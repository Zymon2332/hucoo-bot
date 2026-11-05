import itertools
import time
from typing import Any, Literal, Annotated, TypeVar, Union

from fastapi.sse import ServerSentEvent
from pydantic import BaseModel, Field, TypeAdapter

from harness.sse.payloads import Payload, RunStartData, RunResumeData, RunErrorData, RunEndData, InterruptData, \
    ScopeCloseData, ScopeOpenData, MessageStartData, MessageEndData, BlockStartData, BlockDeltaData, \
    BlockEndData, ToolStartData, ToolDeltaData, ToolEndData, ToolErrorData


class BaseEvent(BaseModel):
    v: Literal[1] = 1
    seq: int
    type: str
    ts: int
    run_id: str
    thread_id: str
    scope_id: str
    """标记当前 agent 运行的作用域，用于多智能体"""
    block_index: int | None = None
    """消息内内容块序号（文本/推理/工具调用各占一块）"""


class RunStart(BaseEvent):
    type: Literal["run.start"] = "run.start"
    data: RunStartData


class RunResumed(BaseEvent):
    type: Literal["run.resume"] = "run.resume"
    data: RunResumeData


class RunEnd(BaseEvent):
    type: Literal["run.end"] = "run.end"
    data: RunEndData


class RunError(BaseEvent):
    """只用于根致命错误，子代理失败走 scope.close(status:'failed')，工具失败走 tool.error，都不会触发此事件"""
    type: Literal["run.error"] = "run.error"
    data: RunErrorData


class Interrupt(BaseEvent):
    type: Literal["interrupt"] = "interrupt"
    data: InterruptData


class ScopeOpen(BaseEvent):
    type: Literal["scope.open"] = "scope.open"
    data: ScopeOpenData


class ScopeClose(BaseEvent):
    type: Literal["scope.close"] = "scope.close"
    data: ScopeCloseData


class MessageStart(BaseEvent):
    type: Literal["message.start"] = "message.start"
    data: MessageStartData


class MessageEnd(BaseEvent):
    type: Literal["message.end"] = "message.end"
    data: MessageEndData


class BlockStart(BaseEvent):
    type: Literal["block.start"] = "block.start"
    message_id: str
    block_index: int
    data: BlockStartData


class BlockDelta(BaseEvent):
    type: Literal["block.delta"] = "block.delta"
    message_id: str
    block_index: int
    data: BlockDeltaData


class BlockEnd(BaseEvent):
    type: Literal["block.end"] = "block.end"
    message_id: str
    block_index: int
    data: BlockEndData


class ToolStart(BaseEvent):
    type: Literal["tool.start"] = "tool.start"
    data: ToolStartData


class ToolDelta(BaseEvent):
    type: Literal["tool.delta"] = "tool.delta"
    data: ToolDeltaData


class ToolEnd(BaseEvent):
    type: Literal["tool.end"] = "tool.end"
    data: ToolEndData


class ToolError(BaseEvent):
    type: Literal["tool.error"] = "tool.error"
    data: ToolErrorData


ProtocolEvent = Annotated[
    Union[
        RunStart, RunResumed, RunEnd, RunError,
        ScopeOpen, ScopeClose, Interrupt,
        MessageStart, MessageEnd, BlockStart, BlockDelta, BlockEnd,
        ToolStart, ToolDelta, ToolEnd, ToolError,
    ],
    Field(discriminator="type"),
]

EVENT_ADAPTER: TypeAdapter[ProtocolEvent] = TypeAdapter(ProtocolEvent)


EventT = TypeVar("EventT", bound=BaseEvent)


class EventFactory:
    """v2 协议事件的统一信封工厂。

    同一个 run 必须共享一个实例，保证 `seq` 在 run 内全局单调递增；
    子 agent / 子图通过 `scoped()` 拿到绑定 `scope_id` 的发射器，
    避免在每个调用点重复传 scope。

    非线程安全：seq 基于 `itertools.count`，请在单个事件循环 / 线程内使用。
    """

    def __init__(self, *, run_id: str, thread_id: str) -> None:
        self.run_id = run_id
        self.thread_id = thread_id
        self._seq = itertools.count(1)

    def emit(
        self,
        cls: type[EventT],
        *,
        data: Payload,
        scope_id: str,
        message_id: str | None = None,
        block_index: int | None = None,
        **extra: Any,
    ) -> EventT:
        """填充信封字段并校验为具体的 v2 事件。

        `message_id` / `block_index` 仅在非 None 时写入，避免给
        RunStart 等不包含这些字段的事件塞入多余属性。
        """
        envelope: dict[str, Any] = {
            "seq": next(self._seq),
            "ts": int(time.time() * 1000),
            "run_id": self.run_id,
            "thread_id": self.thread_id,
            "scope_id": scope_id,
            "data": data,
        }
        if message_id is not None:
            envelope["message_id"] = message_id
        if block_index is not None:
            envelope["block_index"] = block_index
        envelope.update(extra)
        return cls.model_validate(envelope)

    def scoped(self, scope_id: str) -> "ScopedEmitter":
        return ScopedEmitter(self, scope_id)


class ScopedEmitter:
    """绑定 `scope_id` 的轻量发射器，等价于 `factory.emit(scope_id=...)`。"""

    def __init__(self, factory: EventFactory, scope_id: str) -> None:
        self._factory = factory
        self.scope_id = scope_id

    @property
    def run_id(self) -> str:
        return self._factory.run_id

    @property
    def thread_id(self) -> str:
        return self._factory.thread_id

    def emit(
        self,
        cls: type[EventT],
        *,
        data: Payload,
        message_id: str | None = None,
        block_index: int | None = None,
        **extra: Any,
    ) -> EventT:
        return self._factory.emit(
            cls,
            data=data,
            scope_id=self.scope_id,
            message_id=message_id,
            block_index=block_index,
            **extra,
        )


def to_sse_event(event: BaseEvent) -> ServerSentEvent:
    """把 v2 事件序列化为 SSE 帧，`id` 直接复用 ms 内的全局序 `seq`。"""
    return ServerSentEvent(
        event=event.type,
        data=event.model_dump(exclude_none=True, mode="json"),
        id=str(event.seq),
        retry=None,
    )
