import asyncio
import contextlib
import json
import time
import uuid
from dataclasses import dataclass
from typing import AsyncIterator, Any

from fastapi import APIRouter, HTTPException
from fastapi.sse import ServerSentEvent, EventSourceResponse
from langchain_core.callbacks import UsageMetadataCallbackHandler
from langchain_core.runnables import RunnableConfig
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.store.memory import InMemoryStore
from loguru import logger
from pydantic import BaseModel, Field

from domain.model_config import ModelConfig
from harness.agent import create_lead_agent
from harness.sse.events_v2 import EventFactory, to_sse_event, BaseEvent, RunStart, RunEnd, MessageStart, BlockStart, \
    BlockDelta, BlockEnd, ToolStart, ToolDelta, ToolEnd, ToolError, MessageEnd, RunError
from harness.sse.payloads import RunStartData, RunEndData, MessageStartData, BlockStartData, BlockDeltaData, \
    BlockEndData, TextBlock, ToolCallBlock, ToolStartData, ToolMeta, ToolDeltaData, ToolEndData, ToolErrorData, \
    MessageEndData, RunErrorData, ReasoningBlock
from routers.deps import CheckpointerDep, StoreDep

agent_router_v2 = APIRouter(
    prefix="/agent/v2",
    tags=["agent"],
)

_STREAM_DONE = None


class StreamRequestPayload(BaseModel):
    input: str = Field(..., description="Input to send to the agent")
    model_conf: ModelConfig = Field(..., description="Model configuration")
    session_id: str = Field(..., description="Session ID")


@dataclass
class CallState:
    index: int
    name: str
    tool_id: str
    args: str = ""
    started: bool = False


_FINISH_REASON_MAP = {
    # OpenAI / DeepSeek / OpenAI-compatible
    "stop": "stop",
    "length": "length",
    "tool_calls": "tool_calls",
    "function_call": "tool_calls",
    "content_filter": "content_filter",
    # Anthropic
    "end_turn": "stop",
    "tool_use": "tool_calls",
    "max_tokens": "length",
    "stop_sequence": "stop",
    # Google
    "STOP": "stop",
    "MAX_TOKENS": "length",
    "SAFETY": "content_filter",
    "RECITATION": "content_filter",
}


def _normalize_finish_reason(ai) -> str:
    rm = ai.response_metadata or {}
    raw = rm.get("finish_reason") or rm.get("stop_reason") or ""
    if not raw:
        return ""
    return _FINISH_REASON_MAP.get(raw, raw.lower())


def _normalize_input(user_input: str) -> dict[str, Any]:
    return {
        "messages": [
            {
                "role": "user",
                "content": user_input
            }
        ]
    }


def _to_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, bytes):
        return value.decode("utf-8", "replace")
    if isinstance(value, (dict, list)):
        return json.dumps(value, ensure_ascii=False, default=str)
    return str(value)


@agent_router_v2.post(path="/stream/chat", response_class=EventSourceResponse)
async def stream_chat(payload: StreamRequestPayload,
                      checkpointer: CheckpointerDep,
                      store: StoreDep) -> AsyncIterator[ServerSentEvent]:
    agent = create_lead_agent(payload.model_conf, checkpointer=InMemorySaver(), store=InMemoryStore())

    if not agent:
        raise HTTPException(status_code=500, detail="Agent creation failed")

    usage_callback = UsageMetadataCallbackHandler()
    run_id = uuid.uuid7()

    config: RunnableConfig = {
        "run_id": run_id,
        "configurable": {
            "thread_id": payload.session_id
        },
        "callbacks": [usage_callback]
    }
    stream = await agent.astream_events(input=_normalize_input(payload.input), config=config, version="v3")

    factor = EventFactory(run_id=str(run_id), thread_id=payload.session_id)
    queue: asyncio.Queue[BaseEvent | None] = asyncio.Queue(maxsize=256)

    declared: dict[str, ToolMeta] = {}
    last_finish_reason: str = ""

    async def consume_reasoning(message, message_id, scope_id: str, block_index: int):
        started = False
        try:
            async for chunk in message.reasoning:
                if not started:
                    await queue.put(factor.emit(BlockStart,
                                                data=BlockStartData(kind="reasoning"),
                                                scope_id=scope_id,
                                                message_id=message_id,
                                                block_index=block_index))
                    started = True
                await queue.put(factor.emit(BlockDelta,
                                            data=BlockDeltaData(kind="reasoning", text=chunk),
                                            scope_id=scope_id,
                                            message_id=message_id,
                                            block_index=block_index))
        finally:
            if started:
                await queue.put(factor.emit(BlockEnd,
                                            data=BlockEndData(kind="reasoning",
                                                              block=ReasoningBlock(reasoning=await message.reasoning)),
                                            scope_id=scope_id,
                                            message_id=message_id,
                                            block_index=block_index))

    async def consume_text(message, message_id, scope_id: str, block_index: int):
        started = False
        try:
            async for text in message.text:
                if not started:
                    await queue.put(factor.emit(BlockStart,
                                                data=BlockStartData(kind="text"),
                                                scope_id=scope_id,
                                                message_id=message_id,
                                                block_index=block_index))
                    started = True
                await queue.put(factor.emit(BlockDelta,
                                            data=BlockDeltaData(kind="text", text=text),
                                            scope_id=scope_id,
                                            message_id=message_id,
                                            block_index=block_index))
        finally:
            if started:
                await queue.put(factor.emit(BlockEnd,
                                            data=BlockEndData(kind="text", block=TextBlock(text=await message.text)),
                                            scope_id=scope_id,
                                            message_id=message_id,
                                            block_index=block_index))

    async def consume_tool_calls(message, message_id, scope_id: str, block_index: int):
        states: dict[str, CallState] = {}
        try:
            async for tool_call in message.tool_calls:
                tool_id = tool_call.get("id")
                tool_name = tool_call.get("name")
                index = tool_call.get("index")
                call_state = states.get(tool_id)
                if call_state is None:
                    call_state = CallState(index=index, tool_id=tool_id, name=tool_name)
                    states[tool_id] = call_state

                if not call_state.started:
                    await queue.put(factor.emit(BlockStart,
                                                data=BlockStartData(kind="tool_call",
                                                                    name=call_state.name,
                                                                    tool_id=call_state.tool_id),
                                                scope_id=scope_id,
                                                message_id=message_id,
                                                block_index=block_index))
                    call_state.started = True

                if args := tool_call.get("args"):
                    await queue.put(factor.emit(BlockDelta,
                                                data=BlockDeltaData(kind="tool_call", args=args,
                                                                    tool_id=call_state.tool_id),
                                                scope_id=scope_id,
                                                message_id=message_id,
                                                block_index=block_index))
                    call_state.args += args
            total = len(states)
            for k, v in states.items():
                declared[k] = ToolMeta(v.index or 0, total)
        finally:
            for state in states.values():
                if state.started:
                    await queue.put(factor.emit(BlockEnd,
                                                data=BlockEndData(kind="tool_call",
                                                                  block=ToolCallBlock(name=state.name or "unknown",
                                                                                      args=state.args,
                                                                                      tool_id=state.tool_id or f"{message_id}:{state.index}")),
                                                scope_id=scope_id,
                                                message_id=message_id,
                                                block_index=block_index))

    async def consume_tool(tool, deltas, scope_id: str):
        start_time = time.time()
        try:
            text_offset = 0
            async for delta in deltas:
                if delta is not None:
                    d = _to_text(delta)
                    await queue.put(factor.emit(ToolDelta,
                                                data=ToolDeltaData(
                                                    kind="append",
                                                    tool_id=tool.tool_call_id,
                                                    offset=text_offset,
                                                    text=d,
                                                    channel="result"
                                                ),
                                                scope_id=scope_id))
                    text_offset += len(d)
        finally:
            if tool.completed:
                if tool.error is not None:
                    await queue.put(factor.emit(ToolError,
                                                data=ToolErrorData(
                                                    code="tool_error",
                                                    message=tool.error,
                                                    tool_id=tool.tool_call_id,
                                                    retryable=False,
                                                    duration_ms=int((time.time() - start_time) * 1000)
                                                ),
                                                scope_id=scope_id))
                else:
                    await queue.put(factor.emit(ToolEnd,
                                                data=ToolEndData(
                                                    tool_id=tool.tool_call_id,
                                                    # FIXME 工具输出结果不一定是字符串
                                                    output=tool.output,
                                                    artifacts=[],
                                                    truncated=False,
                                                    duration_ms=int((time.time() - start_time) * 1000)
                                                ),
                                                scope_id=scope_id))

    async def consume_turn(scope_id: str):
        nonlocal last_finish_reason
        messages = stream.messages.__aiter__()
        tools = stream.tool_calls.__aiter__()
        block_index = 0

        while True:
            try:
                message = await messages.__anext__()
            except StopAsyncIteration:
                return

            message_id = str(message.message_id or uuid.uuid7().hex)
            await queue.put(factor.emit(MessageStart,
                                        data=MessageStartData(message_id=message_id),
                                        scope_id=scope_id))

            async with asyncio.TaskGroup() as tg:
                tg.create_task(consume_reasoning(message, message_id, scope_id, block_index))
                tg.create_task(consume_text(message, message_id, scope_id, block_index))
                tg.create_task(consume_tool_calls(message, message_id, scope_id, block_index))

            ai = await message
            finish_reason = _normalize_finish_reason(ai)
            last_finish_reason = finish_reason
            await queue.put(factor.emit(MessageEnd,
                                        data=MessageEndData(
                                            message_id=message_id,
                                            usage=ai.usage_metadata,
                                            finish_reason=finish_reason,
                                            tool_calls=ai.tool_calls
                                        ),
                                        scope_id=scope_id))

            handles = []
            for _ in ai.tool_calls:
                tool = await tools.__anext__()
                # ToolCallStream(tool_call_id='call_00_ZSnUzb42jdysNmseSrQF9564', tool_name='get_weather', status=running)
                # tool_call_id 关联的工具调用 id
                # tool_name 工具名称
                # input 工具输入
                # output_deltas 工具流式输出结果，前提是工具手动通过 ToolRuntime.emit_output_delta，但要确保生产方的消费方的处理类型一致
                # output 结束时的结果，但不保证是字符串
                # error 失败时的错误原因
                # completed 是否已结束
                deltas = tool.output_deltas.__aiter__()  # 在 tool.start 之前订阅
                handles.append((tool, deltas))

            for tool, _ in handles:
                meta = declared.get(tool.tool_call_id) or ToolMeta(0, 1)
                start_time = time.time()
                await queue.put(factor.emit(ToolStart, data=ToolStartData(
                    tool_id=tool.tool_call_id,
                    name=tool.tool_name,
                    args=tool.input,
                    started_at=int(start_time * 1000),
                    parallel=meta
                ), scope_id=scope_id))

            async with asyncio.TaskGroup() as tg:
                for tool, deltas in handles:
                    tg.create_task(consume_tool(tool, deltas, scope_id))

            block_index += 1

    async def produce():
        scope_id = "s0"
        try:
            async with stream:
                start_time = time.time()
                data = RunStartData(model=payload.model_conf.model_name
                if payload.model_conf.model_provider is None
                else f"{payload.model_conf.model_provider}:{payload.model_conf.model_name}")
                # FIXME scope_id 这里是占位符，实际场景要具体设计一下
                await queue.put(factor.emit(RunStart, data=data, scope_id=scope_id))
                async with asyncio.TaskGroup() as tg:
                    tg.create_task(consume_turn(scope_id))
                done_event = factor.emit(RunEnd,
                                         data=RunEndData(status="completed",
                                                         usage=usage_callback.usage_metadata,
                                                         finish_reason=last_finish_reason,
                                                         duration_ms=int((time.time() - start_time) * 1000)),
                                         scope_id=scope_id)
                await queue.put(done_event)
        except asyncio.CancelledError:  # 客户端手动取消异常
            logger.warning(f"Manually cancel the conversation on the client side. run id={run_id}")
            raise
        except Exception as exc:
            error_event = factor.emit(RunError,
                                      data=RunErrorData(
                                          code="internal",
                                          # TODO 面向前端的错误消息需要按情况返回内容
                                          message="Something went wrong",
                                          retryable=False,
                                          partial=True
                                      ), scope_id=scope_id)
            logger.opt(exception=exc).error("stream failed run id={}", run_id)
            await queue.put(error_event)
        finally:
            await queue.put(_STREAM_DONE)

    produce = asyncio.create_task(produce())

    try:
        while (event := await queue.get()) is not _STREAM_DONE:
            if event is not None:
                yield to_sse_event(event)
    finally:
        if not produce.done():
            produce.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await produce
