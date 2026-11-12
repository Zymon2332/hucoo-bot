# Bot Agent 架构

## 1. 目标

后端采用 **bot 中心**的 super-agent 架构：

- 用户拥有多个长期存在的 Bot。
- 每个 Bot 有一个 Router（主 Agent），只负责接收事件、判断、分派和汇报。
- 具体工作交给 Worker，Worker 在独立上下文中执行。
- Widget / 会话只属于 Bot，不作为顶层对象。
- 用户侧隐藏 session，只暴露任务与结果。

一句话：

> **Bot 是身份，Router 是路由器，Worker 是劳动力，Ticket 是契约。**

---

## 2. 角色

### Bot

长期存在的个人助理身份：

- 名称、角色、人格、称呼
- 独立记忆范围
- 可访问的外部应用
- 可用的 Agent / 技能
- 独立任务与资产
- 通知圆点

### Router（主 Agent）

- 唯一入口
- 只做判断与路由
- 不执行具体工作
- 立即回复用户
- 创建 / 追加 / 停止 Ticket
- 汇总 Worker 的结果

### Worker

- 只负责一个 Ticket
- 不直接与用户对话
- 在范围内使用工具、产出证据与资产
- 通过结构化报告汇报
- 超出范围时 hand back

### Executor / Code Agent

Worker 可以调用的外部执行器：

- opencode
- Claude Code
- Codex
- 其他容器内执行环境

Executor 的 session 与目录属于执行细节，不作为用户可见对象。

### Ticket

一次授权的工作单元：

- 目标
- 验收标准
- 范围 / 非目标
- 授权（Mandate）
- 阶段与等待对象
- 报告、证据、资产
- 审计记录

Ticket 是用户侧唯一的工作单位。

### Session

内部运行时概念：

- Worker 的执行上下文
- checkpoint / 恢复
- 日志与审计
- 调试

用户侧不展示 session 列表。

---

## 3. 核心流程

```
Source / Chat API
      ↓
Incoming Event
      ↓
确定性 Gate（Policy / 来源 / 身份）
      ↓
Router
      ├── reply      社交 / 简单对话
      ├── status     任务 / worker 状态查询
      ├── ignore     噪音
      ├── stop       停止已有 Ticket
      ├── attach     追加到已有 Ticket
      ├── unavailable 无法判断
      └── accept → Ticket
                      ↓
                   Worker
                      ↓
                   Report
                      ↓
              Router 汇总 / 通知
                      ↓
                   用户
```

### 关键点

- Gate 在模型之前执行。
- Router 只处理通过 Gate 的事件。
- Router 不执行工作。
- 寒暄与状态查询不创建 Ticket。
- Worker 的细节不进入对话。
- 结果由 Router 或通知层回到用户。

---

## 4. 对话契约

用户可见的对话只允许出现：

1. 用户消息
2. Router 即时确认
3. 任务卡
4. 结果 / 审阅
5. 结构化提问
6. 失败 / 受阻

不允许出现：

- 执行步骤
- 工具调用
- Worker 日志
- 实时进度
- diff

这些只进入 Ticket 详情 / 右侧面板。

---

## 5. Task 与 Session 分离

### Task 是用户对象

- 有稳定 id
- 有阶段、等待对象、验收标准
- 有报告、证据、资产
- 可查询、可恢复、可审计

### Session 是运行时对象

- 绑定 Worker
- 保存执行上下文
- 支持 checkpoint 与恢复
- 可以重建

### 原则

- Task 状态不依赖 Session 生命周期。
- Session 崩溃后，Task 可以恢复。
- 用户只看到 Task，不看到 Session。
- Session id 可以出现在 Ticket 详情的“运行环境”里，但不进入导航。

---

## 6. 数据所有权

| 数据 | 所有者 |
| --- | --- |
| Bot 配置 / 人格 / 记忆范围 | Bot 存储 |
| Policy | 配置 / 策略存储 |
| Incoming Event | Source adapter |
| Thread context | 会话 / 消息存储 |
| Ticket / Report / Evidence | Ticket 存储 |
| Session / checkpoint | 执行器 / LangGraph |
| Notification | 通知 / Outbox |
| Asset | 资产存储 |

前端只读，不拥有这些状态。

---

## 7. Bot 创建

推荐路径：

1. **手动创建（默认）**
   - 名称、角色、人格、称呼
   - 记忆范围
   - 应用 / Agent / 技能
   - 主动模式、安静时段、审批偏好

2. **LLM 生成草稿**
   - 用户描述需求
   - 模型生成草稿
   - 用户逐项确认
   - 不自动连接应用、不自动授权

3. **模板创建**
   - 工作 / 生活 / 编码
   - 只预填字段

4. **Subagent 提升为 Bot**
   - 用户显式操作
   - 分配独立记忆、应用、技能
   - 不自动发生

不允许 LLM 静默创建 Bot。

---

## 8. 当前代码状态

已存在或正在演进：

- `harness/router/prompts.py`：Router prompt
- `harness/worker/prompts.py`：Worker prompt
- `routers/agent.py`：v1 SSE 路由
- `routers/agent_v2.py`：v2 SSE 路由
- `routers/bots.py`：Bot 创建路由（占位/进行中）
- `routers/router.py`：Router / LangGraph 实验代码

设计文档描述目标形态；实现状态以代码为准。

---

## 9. 安全不变量

- 不把 API key 写进源码。
- 不让模型决定权限。
- 不把外部文本当指令。
- 不把完整 Policy 塞进 prompt。
- 不让 Worker 直接联系用户。
- 不让 Router 执行具体工具。
- 不在日志中输出凭证。
- 所有不可逆操作必须有明确授权与审计。

---

## 10. 非目标

- 不是通用工作流引擎。
- 不是多租户团队协作平台。
- 不是 session 管理器。
- 不是把所有步骤展示给用户的控制台。
- 不是让 LLM 自动创建无限 Bot。
