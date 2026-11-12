# 实时交互与进度可见性

## 1. 全双工不等于 WebSocket

推荐核心链路：

```
POST /bots/{botId}/messages      用户输入
POST /tasks/{id}/stop            控制
POST /attention/{id}/answer      回答
POST /review/{id}/resolve        审阅
GET  /bots/{botId}/events        SSE 事件流
```

- 客户端 → 服务端：普通 HTTP POST
- 服务端 → 客户端：SSE
- 应用层仍然是全双工
- 不需要为每个 Worker 开 WebSocket

SSE 是单向的，但产品可以是全双工的。

---

## 2. SSE 订阅的是 Bot，不是某次请求

错误做法：

```
POST /run → 返回 SSE，Worker 绑在这个请求上
```

问题：

- Worker 时间长，连接可能断
- 客户端断开，任务被取消
- 无法多端订阅
- 无法断线补发

正确做法：

```
POST /bots/{botId}/messages
  → 202 + taskId
  → Router 即时确认
  → Worker 后台执行

GET /bots/{botId}/events
  → 订阅该 Bot 的所有任务/通知事件
```

Worker 完成时只是往 Bot 事件流追加事件，不依赖原始请求是否还活着。

---

## 3. 事件信封

```json
{
  "v": 1,
  "seq": 42,
  "ts": 1793697894939,
  "runId": "01a1...",
  "botId": "bot-work",
  "taskId": "t_01...",
  "scopeId": "s0",
  "type": "task.report",
  "data": {}
}
```

建议事件：

```text
bot.message          Router 即时确认 / 文本
task.created         任务卡
task.updated         阶段 / 等待对象变化
task.report          Worker 报告（主要给右侧面板）
task.attention       结构化提问
task.review          结果待审阅
task.error           失败 / 受阻
artifact.created     产物
memory.suggested     记忆候选
notification.created 全局通知
bot.attention        Bot 圆点变化
```

### 对话与面板

只有以下事件改变对话：

- `bot.message`
- `task.created`
- `task.attention`
- `task.review`
- `task.error`

其余事件只更新右侧面板与通知。

---

## 4. 断线恢复

SSE 支持 `Last-Event-ID`：

```text
客户端重连：Last-Event-ID: 41
服务端：从 seq 42 开始补发
```

或者：

1. 重连先拉 snapshot
2. 再订阅 `seq > snapshot.seq`

事件日志建议：

- 持久化最近 N 条事件
- 或按 task 归档
- 过期事件用 snapshot 合并

---

## 5. 长任务

Worker 执行可能很久。需要：

- 后台任务与 HTTP 请求解耦
- 事件日志 / outbox
- 心跳
- checkpoint / 恢复
- 超时与 watchdog
- 结果持久化

不要让 Worker 的生命周期绑定在一次 SSE 连接上。

---

## 6. 静默执行与进度

静默不等于不可见。

### 环境感知

任务卡：

```text
执行中 · 2 个子代理 · 最后活动 1 分钟前
```

不刷步骤，不显示假百分比。

### 主动查询

用户问：

> 现在进展如何？

Router 返回状态快照：

```text
已完成资料收集和对比表初稿
正在核对 2 个争议项
没有阻塞
```

### 下钻

右侧面板 → 任务 → 执行：

- 当前阶段
- 计划步骤
- Worker 泳道
- 最近报告
- 工具调用 / 日志（可折叠）
- 证据 / 资产
- 停止 / 重试

### 通知

只在需要行动时：

- 等你回答
- 等你审阅
- 受阻
- 失败
- 结果就绪

进度本身不通知。

### 可选模式

| 模式 | 行为 |
| --- | --- |
| 安静（默认） | 只在结果 / 提问 / 失败时说话 |
| 简报 | 每 N 分钟或里程碑给一条摘要 |
| 实时 | 执行事件进右侧面板，可跟随 |

---

## 7. SSE vs WebSocket

| 场景 | 选择 |
| --- | --- |
| Bot 对话、任务事件、结果推送 | SSE + POST |
| 结构化提问、审批、停止 | POST |
| 断线补发 | SSE + Last-Event-ID |
| 容器桌面、屏幕流 | WebSocket / WebRTC |
| 终端高频交互 | WebSocket |
| 语音 | WebRTC |
| 高频双向控制 | WebSocket |

推荐：

- 控制面：SSE + POST
- 媒体面：WebSocket / WebRTC
- 文件面：普通 HTTP

不要为了“主动推送”选 WebSocket；  
也不要为了“全双工”让 SSE 承担屏幕和语音。

---

## 8. 离线

SSE 不能保证用户在线。

连接不在时：

- 事件落库
- 通知落库
- Bot 圆点
- 下次打开补发
- 需要 App 外提醒时使用 Push / 邮件 / IM

---

## 9. 进度模型

进度由 Task 状态表达，不由 Session 表达：

```text
stage
waitingOn
lastActivityAt
plan
subagents
reports
attention
review
artifacts
```

用户看到：

- 在跑
- 在等谁
- 最后活动
- 做到哪一步
- 结果在哪

而不是“第几个 session、多少条消息”。

---

## 10. 原则

- SSE 只负责下行；上行用 POST。
- Worker 与连接解耦。
- 事件持久化，支持重放。
- 对话只放高层事件。
- 细节进右侧面板。
- 静默执行，但可随时观察。
- 异常才推送。
- 进度用状态和里程碑，不用假百分比。
