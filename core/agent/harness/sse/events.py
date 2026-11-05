import itertools
import time
from dataclasses import dataclass
from typing import Literal, Any

from fastapi.sse import ServerSentEvent
from pydantic import BaseModel


class BaseEvent(BaseModel):
    v: Literal[1] = 1
    """协议版本"""

    type: str
    """事件类型"""

    seq: int
    """Run 内严格递增，从 1 开始；用于去重、排序、续传"""

    ts: int
    """服务端毫秒时间戳；只用于展示和排查，不用于排序"""

    run_id: str
    """每次运行的唯一 id"""


class ReasoningEvent(BaseEvent):
    type: Literal["reasoning.start", "reasoning.end", "reasoning.delta"]
    message_id: str
    delta: str | None = None


class TextEvent(BaseEvent):
    type: Literal["text.start", "text.end", "text.delta"]
    message_id: str
    delta: str | None = None


@dataclass
class CallState:
    index: int | None = None
    name: str | None = None
    tool_call_id: str | None = None
    started: bool = False


class ToolCallEvent(BaseEvent):
    type: Literal["tool_call.start", "tool_call.end", "tool_call.delta"]
    message_id: str
    tool_call_id: str
    tool_name: str | None = None
    delta: str | None = None


class ToolResultEvent(BaseEvent):
    type: Literal["tool_result"] = "tool_result"
    tool_call_id: str
    tool_name: str
    output: str
    is_error: bool = False
    duration_ms: int | None = None


class ToolResultDeltaEvent(BaseEvent):
    """流式工具调用结果"""
    type: Literal["tool_result.delta"] = "tool_result.delta"
    tool_call_id: str
    delta: str


class DoneEvent(BaseEvent):
    type: Literal["done"] = "done"
    usage: dict[str, Any] | None = None
    duration_ms: int | None = None


class ErrorEvent(BaseEvent):
    type: Literal["error"] = "error"
    display_message: str
    # TODO details 暂且搁置，未来可以构建一个结构，比如是否重试等字段让前端判断，或者一些具体原因方便审计
    # details: dict[str, Any] | None = None


class EventFactory:

    def __init__(self, run_id: str) -> None:
        self.run_id = run_id
        self._seq = itertools.count(1)

    def emit(self, cls: type[BaseEvent], **fields: object):
        return cls(
            run_id=self.run_id,
            seq=next(self._seq),
            ts=int(time.time() * 1000),
            **fields,
        )


def to_sse_event(event: BaseEvent) -> ServerSentEvent:
    return ServerSentEvent(event=event.type,
                           data=event.model_dump(exclude_none=True),
                           id=str(event.seq),
                           retry=None)
