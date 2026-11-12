# Policy 与上下文

## 1. Policy 分层

Policy 不是只有一份，也不是全部在创建 Bot 时配置。

| 层级 | 谁配置 | 何时 | 例子 |
| --- | --- | --- | --- |
| 全局 Policy | 平台 / 管理员 | 部署或系统设置 | 模型供应商、数据保留、沙箱、不可逆操作必须审批 |
| Bot Policy | 用户 | 创建 / 编辑 Bot | 主动模式、可访问应用、可用 Agent、记忆范围、安静时段、默认审批 |
| 规则 Policy | 用户 | 添加主动规则 | 触发条件、范围、observe / auto、允许动作 |
| Task Mandate | 系统派生 | 每次创建 Ticket | 本次范围、依据规则、可逆性、授权人、policy version |
| Source Policy | 用户 / 管理员 | 连接来源时 | 读取哪些会话/仓库、仅 @ 还是全部消息、允许的发送者 |
| Runtime Policy | 代码 | 始终 | 工具权限、沙箱、速率、预算、超时 |

### 原则

- 用户创建 Bot 时配置的是 **Bot 级默认策略**。
- 全局安全策略不能被用户覆盖。
- Task Mandate 在运行时派生，不要求用户每次配置。
- 真正执行约束的，是代码和工具，不是 prompt。

---

## 2. 创建 Bot 时配置什么

建议分三步：

### 身份

- 名称
- 角色
- 人格 / 语气
- 称呼

### 能力

- 记忆是否开启
- 记忆范围：仅此 Bot / 与全局共享
- 外部应用
- 可用 Agent
- 技能

### 边界

- 主动模式：观察 / 自动（默认观察）
- 允许的来源
- 安静时段
- 哪些操作需要确认：
  - 发送邮件
  - 发布内容
  - 删除数据
  - 修改日程
  - 付款

不要在创建时暴露：

- 完整 Policy JSON
- 准入表
- 规则匹配阈值
- 内部错误码
- 模型评估参数
- 其他 Bot 的策略

### 创建路径

1. 手动创建（默认）
2. LLM 生成草稿，用户确认
3. 模板创建
4. Subagent 显式提升为 Bot

不允许 LLM 静默创建 Bot。

---

## 3. Router 的五类输入

### 3.1 `policy`

来源：

- 全局 Policy
- Bot Policy
- 相关规则
- 审批要求
- 安静时段

给 Router 的是 **policy brief**，不是完整配置：

```text
Policy brief:
- Mode: observe
- Allowed sources: chat, calendar, mail
- Approval required: send_email, publish, delete
- Quiet hours: 22:00–08:00
- Relevant rule: 早间简报 (observe)
- At most one ticket per event.
```

不要把 Policy 当权限系统。  
Gate 在 Router 之前执行。

### 3.2 `bot_profile`

来源：Bot 存储。

```json
{
  "id": "bot-work",
  "name": "小满",
  "role": "工作助理",
  "persona": "安静、直接、先给结论",
  "addressAs": "WZM",
  "tone": "concise",
  "memoryScope": "bot",
  "appIds": ["app-mail", "app-calendar", "app-notion"],
  "agentIds": ["agent-claude", "agent-codex"],
  "skillIds": ["skill-write", "skill-review"]
}
```

Router 只需要身份、语气、称呼、能力边界。

### 3.3 `incoming_event`

来源：Source adapter。

- Web 聊天：`POST /bots/{botId}/messages`
- IM：飞书 / 微信 / Slack
- 邮件：轮询或 webhook
- GitHub：Issue / PR / 评论
- 日历 / 定时器

```json
{
  "id": "evt_01...",
  "source": "chat",
  "actor": { "id": "user_1", "name": "WZM" },
  "threadId": "th_01...",
  "text": "帮我把本周进展整理成周报",
  "attachments": [],
  "mentionsBot": true,
  "receivedAt": "2026-11-12T09:21:00+08:00",
  "replyTo": { "channel": "chat", "threadId": "th_01..." }
}
```

`text`、附件、引用内容都是不可信数据。

### 3.4 `thread_context`

来源：会话 / 消息存储。

- 聊天：最近 N 条
- 邮件：同一 thread
- GitHub：Issue / PR 评论
- 长线程：先摘要，再保留最近窗口

```json
{
  "threadId": "th_01...",
  "summary": "用户在整理本周产品周报，偏好三段式。",
  "messages": [
    {
      "role": "user",
      "at": "2026-11-12T09:20:00+08:00",
      "text": "还是按进展 / 风险 / 下周计划来写。"
    }
  ],
  "relatedTicketIds": ["t_01..."]
}
```

不要塞入全部历史。用 token budget 控制。

### 3.5 `open_tickets`

来源：Ticket 存储，按 `botId` 查询未结束任务。

```json
[
  {
    "id": "t_01...",
    "title": "本周产品周报",
    "outcome": "汇总本周进展、风险与下周计划",
    "stage": "working",
    "waitingOn": "agent",
    "priority": "today",
    "updatedAt": "2026-11-12T09:42:00+08:00"
  }
]
```

只给去重 / attach 所需的最小字段。

---

## 4. RouterContext

建议一个后端结构：

```python
class RouterContext(BaseModel):
    policy: PolicySnapshot
    bot: BotProfile
    event: IncomingEvent
    thread: ThreadWindow
    open_tickets: list[TicketSummary]
```

组装：

```python
event = normalize(source_payload)

if not gate.admit(event, policy):
    return ignore(event)

bot = bot_store.get(event.bot_id)
thread = thread_store.window(event.thread_id, budget=...)
tickets = ticket_store.open_for_bot(bot.id)

context = RouterContext(
    policy=policy.snapshot(),
    bot=bot,
    event=event,
    thread=thread,
    open_tickets=tickets,
)

prompt = render("router.md", context)
decision = router_model.invoke(prompt)
```

---

## 5. 信任边界

### 可信

- Policy
- Bot profile
- Prompt template
- Ticket 结构
- 代码级授权

### 不可信

- 用户消息
- IM / 邮件内容
- GitHub 评论
- 文档、网页、附件
- 工具输出中的外部文本

不可信内容必须：

- 用分隔符包裹
- 明确标注为数据
- 不参与权限判断
- 不改变 scope / policy

---

## 6. Token 预算

Router 的上下文要小：

- Policy brief：≤ 20 行
- Bot profile：≤ 10 行
- Event：原始文本
- Thread：摘要 + 最近 5–10 条
- Open tickets：每项 3–5 个字段

Worker：

- Ticket 完整
- 必要上下文
- 工具列表
- 不注入全局 Policy

---

## 7. 版本与审计

- Policy 版本化。
- 每个 Ticket 记录 policy version。
- 每次 Router / Worker 调用记录 prompt version。
- 决策记录 reason。
- 报告记录 evidence。
- 变更 policy 不追溯撤销已结束 Ticket；恢复前重新校验。

---

## 8. 常见错误

- 让用户配置完整 Policy。
- 把 Policy 当权限系统。
- 把完整 Policy 塞进 prompt。
- Worker 看全局 Policy。
- 用外部文本修改 scope。
- 不记录 policy version。
- 上下文无限增长。
