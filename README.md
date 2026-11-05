# Hucoo Personal Agent

一个以 **bot** 为中心的个人智能助理原型。

产品形态不是“工作台”或“任务控制台”，而是：

- 左侧是多个 bot；
- 每个 bot 有一个只负责路由、即时确认、不亲自执行的主 Agent；
- 中间是 IM 风格对话；
- 右侧是默认收起的任务 / 电脑 / 资产 / 设置面板；
- 设置、技能、产物、应用从左下角用户菜单以弹窗打开。

当前仓库包含两个独立部分：

| 部分 | 状态 |
| --- | --- |
| `apps/web` | 可运行的静态前端原型，数据来自 `src/fixtures`，不连接后端 |
| `core/agent` | FastAPI + LangChain/LangGraph 后端原型，尚未与前端联调 |

---

## 仓库结构

```
hucoo-bot/
├── apps/                 # pnpm monorepo
│   ├── web/              # Vite + React 19 前端
│   ├── packages/
│   │   ├── ui/           # shadcn/ui 基础组件
│   │   ├── sdk/          # HTTP SDK（web 当前未使用）
│   │   └── streaming/    # SSE 解析与 run reducer（web 当前未使用）
│   └── package.json
├── core/
│   └── agent/            # FastAPI + LangChain/LangGraph 后端
├── AGENTS.md             # 编码代理工作约定
└── README.md
```

---

## 快速开始

### 前端

```bash
cd apps
pnpm install
pnpm dev
```

默认地址：`http://localhost:5173`。

常用命令：

```bash
pnpm dev          # web dev server
pnpm build        # 构建所有 workspace 包
pnpm test         # 运行所有测试
pnpm typecheck    # 类型检查
pnpm check        # typecheck + test
```

只跑 web：

```bash
pnpm --filter @hucoo/web dev
pnpm --filter @hucoo/web test
pnpm --filter @hucoo/web typecheck
pnpm --filter @hucoo/web build
```

### 后端

```bash
cd core/agent
cp .env.example .env
uv sync
uv run main.py
```

默认端口：`2000`。

后端依赖 PostgreSQL 用于 checkpointer/store，环境变量示例见 `core/agent/.env.example`。

> 注意：当前路由内仍使用 `InMemorySaver` / `InMemoryStore`，Postgres 资源在 lifespan 中创建，但尚未真正接入路由。

---

## 前端入口

| 路由 | 页面 |
| --- | --- |
| `/` | 重定向到默认 bot |
| `/b/$botId` | Bot 对话 |
| `/memory` | 记忆中心 |
| `/onboarding` | 新建 bot |
| `/artifact/$artifactId` | 资产预览 |
| `/dev/states` | 状态画廊（仅开发） |

设置、技能、产物、应用没有独立页面：从左下角用户菜单打开弹窗。旧地址 `/settings`、`/skills`、`/assets`、`/apps` 会重定向回默认 bot。

---

## 核心模型

```
Bot
├── 主 Agent（只路由、即时确认、不执行）
├── 人格 / 记忆范围
├── 外部应用与 Agent
├── 技能
├── 任务
└── 资产

Task
├── botId / 验收标准 / 状态 / 等待对象
├── 子代理 / 报告 / 证据 / 资产 / 授权
└── 审计与停止
```

全局共享模型凭证、用量、应用连接池、技能目录和外观设置。

---

## 设计原则

- **默认缺席**：一切正常时界面几乎为空。
- **对话只出现高层事件**：即时确认、任务卡、结果、结构化提问、失败。
- **执行细节进右侧面板**：步骤、工具、日志、diff 不进入对话。
- **主 Agent 不亲自执行**：任何工作都交给子 Agent / Code Agent。
- **全局只有一个通知入口**：每个 bot 只显示一个小圆点。
- **可逆性决定自治**：可逆操作可以更主动，不可逆操作需要确认。
- **显示层不推导**：后端状态由 fixtures 模拟，前端只做中文映射与未知值兜底。

---

## 文档

- [AGENTS.md](./AGENTS.md)：编码代理的工作约定与验收标准
- [apps/web/README.md](./apps/web/README.md)：前端运行与结构概览
- [apps/web/docs](./apps/web/docs)：架构、产品模型、设计系统、后端契约、开发指南

---

## 状态

- 前端是静态原型：无真实 API、无 SSE、无持久化。
- 后端是独立原型：已有 v1/v2 SSE 路由与 LangGraph agent 组装。
- 两端尚未联调；前端通过 `fixtures` 渲染完整产品形态。
