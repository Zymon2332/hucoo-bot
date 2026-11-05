# 后端契约（Provisional）

> 这是前端消费后端数据的**建议契约**，不是已实现接口。真实字段、事件名与状态枚举由后端最终定义。

当前前端使用 `src/fixtures` 渲染。接后端时，目标是替换数据来源，而不是让前端推导领域状态。

---

## 1. 所有权

后端负责：

- Bot / Task / App / Skill / Asset 的领域语义
- Task 阶段、等待对象、授权、验证结果
- 任务事件与报告
- 通知的生成与去重
- 会话与任务的关联

前端负责：

- 事件解析与渲染
- 状态文案映射
- 未知值的兜底显示
- 纯 UI 状态（面板、弹窗、选中项）

前端不推导：

- 任务阶段
- 是否应该通知
- 是否允许执行
- 主动行为是否放行

---

## 2. Bot

```ts
interface BotView {
  id: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
  persona: string;
  description: string;
  addressAs: string;
  tone: "concise" | "warm" | "direct" | "playful";
  memoryScope: "bot" | "global";
  appIds: string[];
  agentIds: string[];
  skillIds: string[];
  lastActiveAt: string;
  greeting: string;
  hasAttention: boolean;
}
```

`hasAttention` 应由后端计算，前端只决定是否显示小圆点。

---

## 3. Task

```ts
interface TaskView {
  id: string;
  botId: string;
  title: string;
  outcome: string;
  acceptance: string[];
  stage:
    | "queued"
    | "working"
    | "awaiting_answer"
    | "awaiting_review"
    | "blocked"
    | "failed"
    | "waiting"
    | "done";
  waitingOn: "human" | "agent" | "external" | "trigger" | "none";
  priority: "now" | "today" | "later";
  authority: {
    mode: "explicit" | "inferred";
    scope: string;
    rules: string[];
    reversible: boolean;
    grantedBy: string;
    grantedAt: string;
    stopReason?: string;
  };
  plan: PlanStepView[];
  reports: ReportView[];
  agentIds: string[];
  evidenceIds: string[];
  attention?: AttentionView;
  review?: ReviewView;
  artifactIds: string[];
  memoryIds: string[];
  verification: {
    summary: string;
    checked: string[];
    unchecked: string[];
    needsHuman: string[];
  };
  decisions: DecisionView[];
  audit: AuditEntryView[];
  createdAt: string;
  updatedAt: string;
}
```

约定：

- `stage` 由后端给出，前端只映射。
- `waitingOn` 用于“在等谁”。
- `verification.needsHuman` 是结构化字段，不从报告自由文本推断。
- `authority.reversible` 决定是否允许批量操作。

---

## 4. 对话

```ts
interface ChatView {
  botId: string;
  conversationId: string;
  channel: "chat" | "email" | "im" | "note";
  messages: ChatMessageView[];
}

type ChatMessageView =
  | { role: "user"; id: string; at: string; text: string }
  | { role: "assistant"; id: string; at: string; blocks: AssistantBlockView[] };

type AssistantBlockView =
  | { kind: "text"; text: string }
  | { kind: "task"; taskId: string }
  | { kind: "outcome"; taskId: string }
  | { kind: "attention"; taskId: string }
  | { kind: "error"; taskId: string; code: string; message: string; retryable: boolean }
  | { kind: "memory"; memoryId: string; quote: string };
```

关键约束：

- 对话中不出现 plan / tool / log / diff。
- 执行细节通过 Task 详情读取。
- 主 Agent 的即时确认与后续结果由后端决定何时发送。

---

## 5. 建议事件

如果使用 SSE，建议使用统一信封：

```ts
interface ServerEvent<T = unknown> {
  v: 1;
  seq: number;
  ts: number;
  runId: string;
  botId: string;
  type: string;
  data: T;
}
```

建议事件：

```ts
"bot.message"        // 主 Agent 即时确认 / 文本
"task.created"       // 任务卡
"task.updated"       // 阶段 / 等待对象变化
"task.attention"     // 结构化提问
"task.review"        // 结果待审阅
"task.error"         // 失败 / 受阻
"task.report"        // 报告（主要给右侧面板）
"artifact.created"   // 产物
"memory.suggested"   // 记忆候选
"notification.created"
"bot.attention"      // bot 圆点变化
```

前端消费原则：

- `task.report` 不直接渲染到对话。
- 只有 `bot.message`、`task.created`、`task.attention`、`task.review`、`task.error` 会改变对话。
- 其余事件只更新右侧面板与全局通知。

---

## 6. 应用、技能、资产

```ts
interface AppView {
  id: string;
  kind: "mcp" | "agent";
  name: string;
  description: string;
  status: "connected" | "available" | "error";
  assignedBotIds: string[];
}

interface SkillView {
  id: string;
  name: string;
  description: string;
  assignedBotIds: string[];
}

interface AssetView {
  id: string;
  botId: string;
  taskId?: string;
  title: string;
  kind: "markdown" | "code" | "table" | "html";
  status: "draft" | "ready" | "accepted";
  summary: string;
  content: string;
  updatedAt: string;
}
```

---

## 7. 与现有后端的关系

`core/agent` 已有两套 SSE：

- `routers/agent.py`（v1）：扁平事件 `text.*` / `reasoning.*` / `tool.*` / `done` / `error`
- `routers/agent_v2.py`（v2）：message / block / tool / scope 结构化事件

当前前端不消费任何一套。接后端时需要：

1. 增加协议适配层，将后端事件映射成前端 view model。
2. 对话只接收高层事件。
3. Task 详情按 `botId` + `taskId` 读取。
4. 通知由后端聚合，前端只展示。

---

## 8. 接后端步骤

1. 新建 `src/protocol/`，放事件与 view model 类型（provisional）。
2. 新建 `src/api/`，放 fetch / SSE 客户端。
3. 用真实数据替换 `fixtures`。
4. 用后端状态替换 `demo-store` 的本地交互。
5. 保留 `display/labels.ts` 的映射与兜底。
6. 保留未知状态回退原始值的逻辑。
7. 删除状态画廊里的纯静态演示，或改为真实状态快照。 
