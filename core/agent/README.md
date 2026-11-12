# core/agent

Hucoo Personal Agent 的后端原型。

技术栈：

- Python 3.14
- FastAPI
- LangChain / LangGraph
- PostgreSQL（checkpointer / store）
- loguru
- uv

当前是研究/原型代码，不是生产实现。

---

## 运行

```bash
cd core/agent
cp .env.example .env
uv sync
uv run main.py
```

默认端口：`2000`。

也可以直接启动 ASGI 应用：

```bash
uv run uvicorn main:create_app --host 0.0.0.0 --port 2000
```

---

## 环境变量

参考 `.env.example`：

```text
APP_SERVICE_PORT=2000
APP_WORKER=1
APP_LOG_LEVEL=info

LOG_LEVEL=INFO
LOG_FILE=
LOG_INTERCEPT_STDLIB=true

DB_URL=postgresql://postgres:postgres@localhost:5432/agent_demo
DB_POOL_MIN_SIZE=1
DB_POOL_MAX_SIZE=10
```

`.env` 不应提交到仓库。

---

## 目录

```text
core/agent/
├── main.py              FastAPI 入口、lifespan、异常处理
├── config/              app / db / logging 配置
├── base/                统一响应与错误码
├── exception/           业务异常
├── db/                  连接池
├── domain/              模型配置
├── harness/
│   ├── agent.py         lead agent 组装
│   ├── router/          Router prompt 与节点（进行中）
│   ├── worker/          Worker prompt（进行中）
│   ├── tools/           工具
│   ├── runtime/         checkpointer / store
│   └── sse/             SSE 事件与 payload
├── routers/
│   ├── agent.py         v1 SSE
│   ├── agent_v2.py      v2 SSE
│   ├── bots.py          Bot 创建（进行中）
│   └── router.py        Router / LangGraph 实验
├── doc/design/          设计文档
├── test/
├── pyproject.toml
└── uv.lock
```

---

## 当前状态

- `agent.py` / `agent_v2.py` 提供流式对话路由。
- `harness/router`、`harness/worker` 是 Router / Worker prompt 与编排的进行中代码。
- `routers/bots.py` 的 Bot 创建仍是占位实现。
- `routers/router.py` 是实验代码，不应作为生产入口。
- Router 与 Worker 的详细设计见 `doc/design/`。

---

## 设计文档

- [设计索引](./doc/design/README.md)
- [Bot Agent 架构](./doc/design/bot-agent-architecture.md)
- [Router 与 Worker 提示词契约](./doc/design/router-worker-prompts.md)
- [Policy 与上下文](./doc/design/policy-and-context.md)
- [实时交互与进度可见性](./doc/design/realtime-and-progress.md)

---

## 安全

- 不要把 API key、数据库密码或其他凭证写进源码。
- 使用 `.env` 或部署环境注入。
- 不要在路由模块的导入阶段执行真实模型调用或演示脚本。
- 提交前检查 `git diff --cached`，确认没有凭证。
- Worker 不应直接与用户对话；所有输出通过 Ticket / Router。
- Policy 的硬约束由代码和工具执行，不依赖 prompt。
