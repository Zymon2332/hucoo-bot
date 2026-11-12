# 设计文档

本目录记录后端 agent 的设计。`.txt` 文件是已有草案，`.md` 文件是当前整理后的设计。

## 文档索引

| 文档 | 内容 |
| --- | --- |
| [bot-agent-architecture.md](./bot-agent-architecture.md) | Bot / Router / Worker / Ticket 的总体架构 |
| [router-worker-prompts.md](./router-worker-prompts.md) | Router 与 Worker 的提示词契约 |
| [policy-and-context.md](./policy-and-context.md) | Policy 分层、Bot 创建、五类上下文的来源 |
| [realtime-and-progress.md](./realtime-and-progress.md) | 全双工、SSE/WebSocket、长任务与进度可见性 |

已有草案：

- `sse_design.txt`
- `response_v2.txt`
- `multi_agent_sse.txt`

## 阅读顺序

1. 先读 `bot-agent-architecture.md`，理解角色和边界。
2. 再读 `router-worker-prompts.md`，理解主 Agent 与 Worker 的契约。
3. 然后读 `policy-and-context.md`，理解策略和上下文如何组装。
4. 最后读 `realtime-and-progress.md`，理解事件流和用户感知。

## 状态

这些是设计文档，不代表全部已实现。当前代码状态以 `core/agent` 为准。
