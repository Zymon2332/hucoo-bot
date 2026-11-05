import asyncio
import contextlib
import json
import time
import uuid
from typing import AsyncIterator, Any

from fastapi import APIRouter
from fastapi.sse import ServerSentEvent, EventSourceResponse
from langchain_core.callbacks import UsageMetadataCallbackHandler
from langchain_core.runnables import RunnableConfig
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.store.memory import InMemoryStore
from loguru import logger
from pydantic import BaseModel, Field

from domain.model_config import ModelConfig
from harness.agent import create_lead_agent
from harness.sse.events import EventFactory, TextEvent, to_sse_event, DoneEvent, ErrorEvent, ToolCallEvent, CallState, \
    ReasoningEvent, ToolResultDeltaEvent, ToolResultEvent
from routers.deps import CheckpointerDep, StoreDep

agent_router = APIRouter(
    prefix="/agent/v1",
    tags=["agent"],
)

_STREAM_DONE = None


class StreamRequestPayload(BaseModel):
    input: str = Field(..., description="Input to send to the agent")
    model_conf: ModelConfig = Field(..., description="Model configuration")
    session_id: str = Field(..., description="Session ID")


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


@agent_router.post(path="/stream/chat", response_class=EventSourceResponse)
async def stream_chat(payload: StreamRequestPayload,
                      checkpointer: CheckpointerDep,
                      store: StoreDep) -> AsyncIterator[ServerSentEvent]:
    agent = create_lead_agent(payload.model_conf, checkpointer=InMemorySaver(), store=InMemoryStore())

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

    factor = EventFactory(run_id=str(run_id))
    queue: asyncio.Queue = asyncio.Queue()

    async def consume_reasoning(message, message_id: str):
        started = False
        try:
            async for chunk in message.reasoning:
                if not started:
                    queue.put_nowait(factor.emit(ReasoningEvent, type="reasoning.start", message_id=message_id))
                    started = True
                await queue.put(factor.emit(ReasoningEvent, type="reasoning.delta", message_id=message_id, delta=chunk))
        finally:
            if started:
                queue.put_nowait(factor.emit(ReasoningEvent, type="reasoning.end", message_id=message_id))

    async def consume_text(message, message_id: str):
        started = False
        try:
            async for text in message.text:
                if not started:
                    queue.put_nowait(factor.emit(TextEvent, type="text.start", message_id=message_id))
                    started = True
                await queue.put(factor.emit(TextEvent, type="text.delta", message_id=message_id, delta=text))
        finally:
            if started:
                queue.put_nowait(factor.emit(TextEvent, type="text.end", message_id=message_id))

    async def consume_tool_calls(message, message_id: str):
        groups: dict[object, CallState] = {}

        try:
            async for tool_call in message.tool_calls:
                logger.info(tool_call)
                idx = tool_call.get("index")
                cid = tool_call.get("id")
                if idx is not None:
                    key = ("idx", idx)
                elif cid is not None:
                    key = ("id", cid)
                else:
                    key = "unknown"  # 合并，而不是每个 chunk 新建
                call = groups.get(key)
                if call is None:
                    call = CallState(index=idx, name=tool_call.get("name"), tool_call_id=cid)
                    groups[key] = call

                if name := tool_call.get("name"):
                    call.name = name
                if cid and not call.started:
                    call.tool_call_id = cid

                if not call.started:
                    # 这里假设有些 provider 不会返回 tool_call_id
                    call.tool_call_id = call.tool_call_id or f"{message_id}:{idx}"
                    queue.put_nowait(factor.emit(ToolCallEvent,
                                                 type="tool_call.start",
                                                 message_id=message_id,
                                                 tool_name=call.name,
                                                 tool_call_id=call.tool_call_id))
                    call.started = True

                if args := tool_call.get("args"):
                    await queue.put(factor.emit(ToolCallEvent,
                                                type="tool_call.delta",
                                                message_id=message_id,
                                                tool_name=call.name,
                                                tool_call_id=call.tool_call_id, delta=args))
        finally:
            for call in groups.values():
                if not call.started:
                    continue
                queue.put_nowait(factor.emit(ToolCallEvent,
                                             type="tool_call.end",
                                             message_id=message_id,
                                             tool_name=call.name,
                                             tool_call_id=call.tool_call_id))

    async def consume_tool(tool, deltas):
        start_time = time.time()
        try:
            async for delta in deltas:
                if delta is not None:
                    queue.put_nowait(factor.emit(ToolResultDeltaEvent,
                                                 tool_call_id=tool.tool_call_id,
                                                 delta=_to_text(delta)))
        finally:
            if tool.completed:
                content = tool.error if tool.error is not None else tool.output
                queue.put_nowait(factor.emit(ToolResultEvent,
                                             tool_call_id=tool.tool_call_id,
                                             tool_name=tool.tool_name,
                                             output=_to_text(content),
                                             is_error=tool.error is not None,
                                             duration_ms=int((time.time() - start_time) * 1000)))

    async def consume_messages():
        async for message in stream.messages:
            # 默认 lc_run--xxx 开头，这里的消息 id 不需要自己去处理，框架已经处理好了
            message_id = str(message.message_id or uuid.uuid7().hex)
            # 不采用 gather，防止一个挂了其余还在跑
            async with asyncio.TaskGroup() as tg:
                tg.create_task(consume_reasoning(message, message_id))
                tg.create_task(consume_text(message, message_id))
                tg.create_task(consume_tool_calls(message, message_id))

    async def consume_tools():
        async with asyncio.TaskGroup() as tg:
            async for tool in stream.tool_calls:
                # ToolCallStream(tool_call_id='call_00_ZSnUzb42jdysNmseSrQF9564', tool_name='get_weather', status=running)
                # tool_call_id 关联的工具调用 id
                # tool_name 工具名称
                # input 工具输入
                # output_deltas 工具流式输出结果，前提是工具手动通过 ToolRuntime.emit_output_delta，但要确保生产方的消费方的处理类型一致
                # output 结束时的结果，但不保证是字符串
                # error 失败时的错误原因
                # completed 是否已结束
                deltas = tool.output_deltas.__aiter__()  # 立即订阅
                # 并行工具调用时，每个都应该独立处理，防止串行消费会让后启动的工具在订阅前丢 delta
                tg.create_task(consume_tool(tool, deltas))

    async def produce():
        try:
            async with stream:
                start_time = time.time()
                async with asyncio.TaskGroup() as tg:
                    tg.create_task(consume_messages())
                    tg.create_task(consume_tools())
                done_event = factor.emit(DoneEvent,
                                         usage=usage_callback.usage_metadata,
                                         duration_ms=int((time.time() - start_time) * 1000))
                await queue.put(done_event)
        except asyncio.CancelledError:  # 客户端手动取消异常
            logger.warning(f"Manually cancel the conversation on the client side. run id={run_id}")
            raise
        except Exception as exc:
            error_event = factor.emit(ErrorEvent,
                                      # TODO 面向前端的错误消息需要按情况返回内容
                                      display_message="Something went wrong")
            logger.opt(exception=exc).error("stream failed run id={}", run_id)
            await queue.put(error_event)
        finally:
            queue.put_nowait(_STREAM_DONE)

    produce = asyncio.create_task(produce())

    try:
        while (event := await queue.get()) is not _STREAM_DONE:
            yield to_sse_event(event)
    finally:
        if not produce.done():
            produce.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await produce
