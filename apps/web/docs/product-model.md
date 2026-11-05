# 产品模型

当前前端围绕 **Bot** 组织，而不是围绕会话或工作项。

---

## 1. Bot

`fixtures/bots.ts`

```ts
Bot {
  id: string
  name: string
  role: string
  initials: string
  accent: string
  persona: string
  description: string
  addressAs: string
  tone: "concise" | "warm" | "direct" | "playful"
  memoryScope: "bot" | "global"
  appIds: string[]
  agentIds: string[]
  skillIds: string[]
  lastActiveAt: string
  greeting: string
}
```

每个 Bot 是一个独立的主 Agent：

- 独立人格
- 独立记忆范围
- 独立应用与 Agent
- 独立任务与资产
- 独立通知圆点

当前有三个 Bot：工作 / 生活 / 编码。左侧按 Bot 展示；点击进入该 Bot 的主对话。

---

## 2. Task

`fixtures/work-items.ts` / `fixtures/types.ts`

```ts
WorkItem {
  id, botId
  title, outcome
  acceptance: string[]
  stage
  waitingOn: "human" | "agent" | "external" | "trigger" | "none"
  priority: "now" | "today" | "later"
  authority
  plan
  reports
  agentIds
  evidenceIds
  attention?
  review?
  artifactIds
  memoryIds
  verification
  decisions
  audit
}
```

前端把 `WorkItem` 当作 **Task** 使用。任务属于 Bot，不属于会话。

### 阶段

```ts
Stage =
  | "queued"
  | "working"
  | "awaiting_answer"
  | "awaiting_review"
  | "blocked"
  | "failed"
  | "waiting"
  | "done"
```

阶段由后端下发，前端只做中文映射。未知值回退原始值。

### 等待对象

```ts
WaitingOn =
  | "human"
  | "agent"
  | "external"
  | "trigger"
  | "none"
```

用于回答“这件任务现在在等谁”。

### 授权

```ts
Authority {
  mode: "explicit" | "inferred"
  scope: string
  rules: string[]
  reversible: boolean
  grantedBy: string
  grantedAt: string
  stopReason?: string
}
```

不可逆任务不允许批量操作。

---

## 3. 对话

```ts
Conversation {
  id
  botId
  title
  channel: "chat" | "email" | "im" | "note"
  updatedAt
  messages: Message[]
}

Message {
  id
  role: "user" | "assistant"
  at
  blocks: MessageBlock[]
}
```

### 消息块

```ts
MessageBlock =
  | { kind: "text"; text }
  | { kind: "task"; taskId }
  | { kind: "outcome"; taskId }
  | { kind: "attention"; taskId }
  | { kind: "error"; taskId; code; message; retryable }
  | { kind: "memory"; memoryId; quote }
```

注意：

- 没有 `plan` 块。计划只在右侧任务详情里。
- 没有工具调用、日志、diff 块。
- 执行细节不进入对话。

### 对话契约

主 Agent 只输出：

1. 即时确认
2. 任务卡
3. 结果 / 审阅
4. 结构化提问
5. 失败 / 受阻

---

## 4. 右侧面板

`PanelTab`：

```ts
"tasks" | "computer" | "assets" | "settings"
```

- **任务**：Bot 的任务列表与详情。
- **电脑**：容器状态、桌面、终端、文件、进程。
- **资产**：当前 Bot 的产物；支持搜索、类型筛选、列表 + 预览。
- **设置**：Bot 级人格、外部应用、可用 Agent、技能、记忆范围。

面板默认收起。宽屏显示窄图标栏，点击图标直接展开对应 Tab；顶栏按钮是统一的展开 / 收起入口。

---

## 5. 全局通知

- 只有一个通知入口：顶栏铃铛。
- 通知按 Bot 分组。
- 每个 Bot 行只有一个小圆点，不显示数字。
- 只列需要人行动的事项：等待决定、等待审阅、受阻、失败。

观察候选放在通知抽屉的“观察记录”中，默认不进入主队列。

---

## 6. 应用与技能

```ts
AppConnection {
  id
  kind: "mcp" | "agent"
  name
  description
  status: "connected" | "available" | "error"
  assignedBotIds: string[]
}
```

- 外部应用：MCP、Figma、日历、邮件、GitHub、笔记、网页研究、容器终端。
- Agent：opencode、Claude Code、Codex。
- 应用页只负责“添加 / 移除”，不在卡片里展示关联 Bot。

```ts
Skill {
  id
  name
  description
  assignedBotIds: string[]
}
```

技能只影响能力，不改变授权。

---

## 7. 资产

```ts
Artifact {
  id
  botId
  title
  kind: "markdown" | "code" | "table" | "html"
  status: "draft" | "ready" | "accepted"
  summary
  content
  updatedAt
}
```

- 产物弹窗：搜索 + 类型筛选 + 列表 + 预览。
- 点击“打开完整页面”进入 `/artifact/$id`。
- 全屏预览复用同一套 renderer。

---

## 8. 记忆

```ts
Memory {
  id
  category: "preference" | "about" | "project" | "relationship" | "routine"
  content
  source?
  pinned?
  suggested?
}
```

记忆是决策上下文，不是聊天历史。支持分类、来源、固定、编辑、删除、待确认。

---

## 9. 注意力原则

- 默认缺席：一切正常时界面几乎为空。
- 不展示实时进度。
- 需要人行动时才出现。
- 合并同类结果，避免同一概念多个入口。
- 批量操作只用于可逆、同类、就绪的事项。
- 不可逆操作必须逐个确认。
