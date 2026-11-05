from dataclasses import dataclass
from typing import Literal, Any

from langchain_core.messages import ToolCall
from pydantic import BaseModel, ConfigDict


class Payload(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)


class RunStartData(Payload):
    model: str


class RunResumeData(Payload):
    interrupt_id: str
    """与 interrupt 事件的 id 相对应"""
    decisions: dict[str, Any]
    """用户提交的决策回显"""


class RunEndData(Payload):
    status: Literal["completed", "cancelled", "interrupted"]
    """执行终态"""
    usage: dict[str, Any] | None
    """运行结束的完整 token 用量，中断时不传递"""
    finish_reason: str | None
    """运行结束的原因，中断时不传递"""
    duration_ms: int


class RunErrorData(Payload):
    code: Literal["model_error",
    "tool_error",
    "rate_limited",
    "context_overflow",
    "stream_expired",
    "internal"]
    message: str
    """人类可读描述，只给日志和开发者看，UI 应按 code 自己映射文案"""
    # detail: str
    """原始错误信息，排障用"""
    retryable: bool
    """是否在这个 point 位置重试）"""
    partial: bool
    """出错之前已下发的事件是否有效、UI 是否继续保留"""


class InterruptData(Payload):
    interrupt_id: str
    kind: Literal["approval", "input", "review"]
    """决定渲染哪种表单（前端遇到未知 kind 要降级渲染）"""
    payload: dict[str, Any]
    """该 kind 自己的 schema，协议层不解释。例如 approval 是{tool_id, name, args, risk_level}"""
    tool_id: str | None = None
    """若这是某个工具调用的审批，用它把弹窗关联到工具卡片"""
    expires_at: int | None = None
    """超时自动拒绝"""


class ScopeOpenData(Payload):
    kind: Literal["root", "agent", "subgraph", "tool"]
    agent: str
    """逻辑身份（researcher），同名的多次调用会重复"""
    display_name: str
    """展示给用户看的名称（研究员 #1）"""
    # depth: int = 5
    """深度，防递归"""
    detail: Literal["full", "summary", "off"]
    """本作用域下发的粒度，full 表示全量流式渲染，summary 仅会下发摘要，off 将忽略"""
    # cause: dict[str, Any]
    """为什么开：{type:"tool_call", tool_id} / {type:"fanout", index, total} / {type:"handoff", from_scope}"""


class ScopeCloseData(Payload):
    status: Literal["ok", "failed", "cancelled", "interrupted"]
    """作用域级状态，不影响 run 状态"""
    output: str | None
    """该作用域的最终文本，当 scope.open:detail 为 full、summary 时携带"""
    usage: dict[str, Any]
    reason: Literal["user_cancel", "parent_canceled", "depth_exceeded", "error"]


class MessageStartData(Payload):
    message_id: str
    # role
    # node


class MessageEndData(Payload):
    message_id: str
    usage: dict[str, Any] | None
    finish_reason: str
    tool_calls: list[ToolCall] = []
    """本轮调用到的工具信息，finish_reason 一般是 tool_calls，最后一轮的最终消息一般不会携带"""


class BlockStartData(Payload):
    kind: Literal["text", "reasoning", "tool_call"]
    """分别对应文本、思考、工具调用、工具参数，如果为 tool_call 需传递 name 和 tool_id"""
    name: str | None = None
    tool_id: str | None = None


class BlockDeltaData(Payload):
    kind: Literal["text", "reasoning", "tool_call"]
    """分别对应文本、思考、工具参数的 delta 数据"""
    text: str | None = None
    """text | reasoning 内容传递"""
    args: str | None = None
    """tool 参数传递"""
    tool_id: str | None = None
    """tool_call kind 传递"""


class TextBlock(BaseModel):
    type: Literal["text"] = "text"
    text: str


class ReasoningBlock(BaseModel):
    type: Literal["reasoning"] = "reasoning"
    reasoning: str


class ToolCallBlock(BaseModel):
    type: Literal["tool_call"] = "tool_call"
    name: str
    args: str
    tool_id: str


class BlockEndData(Payload):
    kind: Literal["text", "reasoning", "tool_call"]
    block: TextBlock | ReasoningBlock | ToolCallBlock


@dataclass
class ToolMeta:
    index: int
    total: int


class ToolStartData(Payload):
    tool_id: str
    name: str
    args: dict[str, Any] | None
    started_at: int
    parallel: ToolMeta
    """并行调用信息，格式为索引 + 总数 {'index': 0, 'total': 2}"""


class ToolDeltaData(Payload):
    kind: Literal["append", "patch", "replace", "event"]
    """输出的增量语义：
        
        append: 追加文本，带 offset（字符偏移）
                前端动作：buffer += text；若 offset !== buffer.length → 判丢包
        patch: RFC6902 JSON Patch
                前端动作：对 outputJson 应用补丁（结构化结果，如流式表格行）
        replace: 全量替换当前缓冲（工具只吐累计值时的兜底）
                前端动作：buffer = text
        event: 仅进度/日志，不进入结果渲染
                前端动作：更新进度条、追加日志行
    """
    tool_id: str
    offset: int | None = None
    """append 时的字符偏移量，用于校验与续接"""
    text: str | None = None
    """append / replace 的载荷"""
    patch: list[Any] | None = None
    """patch 的载荷"""
    channel: Literal["result", "stdout", "log"]
    """决定渲染哪一个区域（别把日志混进结果）"""
    progress: float | None = None
    """仅 event 用，0-1 进度表示"""


class ToolEndData(Payload):
    tool_id: str
    # TODO 工具执行结果可能不为字符串，是统一转换为字符串还是 json 传递？
    output: str
    """工具执行结果"""
    artifacts: list[dict[str, Any]]
    """工具产物或引用[{id,mime,size,url}]"""
    truncated: bool = False
    """表示结果是否被截断，完整内容需从 artifacts 或接口取"""
    duration_ms: int
    """执行耗时"""


class ToolErrorData(Payload):
    code: Literal["tool_error", "timeout", "cancelled", "rate_limited"]
    message: str
    """人类可读消息内容，只进日志和 detail，不直接渲染给用户"""
    # detail: str
    """上游原始错误，排障用"""
    tool_id: str
    retryable: bool = False
    """决定是否显示重试按钮"""
    # partial_output: str
    """失败前已产出的内容，保留并渲染"""
    duration_ms: int
