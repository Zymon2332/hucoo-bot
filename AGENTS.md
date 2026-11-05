# AGENTS.md

本文件面向在本仓库工作的编码代理。目标是让改动保持一致、可验证、不过度设计。

---

## 1. 仓库概览

```
apps/web                 React 19 + Vite + TanStack Router 前端
apps/packages/ui         shadcn/ui 基础组件
apps/packages/sdk        HTTP SDK（web 当前未使用）
apps/packages/streaming  SSE / run reducer（web 当前未使用）
core/agent               FastAPI + LangChain/LangGraph 后端
```

两个部分目前**没有联调**。前端使用 `apps/web/src/fixtures` 的静态数据渲染完整产品形态。

---

## 2. 常用命令

所有前端命令在 `apps/` 下执行：

```bash
pnpm install
pnpm dev
pnpm check          # typecheck + test
pnpm build
```

只操作 web：

```bash
pnpm --filter @hucoo/web dev
pnpm --filter @hucoo/web typecheck
pnpm --filter @hucoo/web test
pnpm --filter @hucoo/web build
```

后端：

```bash
cd core/agent
uv sync
uv run main.py
```

修改前端后，至少运行：

```bash
pnpm --filter @hucoo/web typecheck
pnpm --filter @hucoo/web test
pnpm --filter @hucoo/web build
```

不要声称“完成/通过”而没有实际命令输出。

---

## 3. 产品形态

当前前端是一个 **bot 中心**的个人助理：

- 左侧是 bot 列表，不是会话列表。
- 每个 bot 有一个主 Agent，只负责路由、即时确认、汇报，不亲自执行。
- 中间是 IM 风格对话。
- 右侧是默认收起的面板：任务 / 电脑 / 资产 / 设置。
- 全局只有一个通知入口；每个 bot 只有一个小圆点。
- 设置、技能、产物、应用从左下角用户菜单以弹窗打开。
- 用户头像在左下角，不在右下角悬浮。

不要把产品改回“工作项决策台”或“多页工作台”，除非明确要求。

### 对话契约

对话中只允许出现：

1. 用户消息
2. 主 Agent 即时确认
3. 任务卡
4. 结果 / 审阅
5. 结构化提问
6. 失败 / 受阻

不允许出现：

- 执行步骤
- 工具调用
- 子代理日志
- 实时进度
- diff

这些只能出现在右侧面板。

---

## 4. 前端约定

### 4.1 组件

- 基础交互控件使用 `@hucoo/ui` 的 shadcn 组件：
  - `Button`、`Input`、`Textarea`
  - `Dialog`、`Sheet`、`DropdownMenu`
  - `Tabs`、`Command`
  - `Switch`、`Badge`、`Avatar`
  - `Card`、`Separator`
  - `ScrollArea`、`Tooltip`、`Sonner`
- 产品语义强的组件保留自定义：
  - 任务卡
  - Attention 选项卡
  - 结果 + 审阅卡
  - 错误卡
  - 消息气泡
  - 电脑桌面 / 终端 / 文件 / 进程
  - Bot 行
  - 右侧面板外壳
- **不要迁移左侧栏到 shadcn Sidebar**，除非明确要求。
- 避免为普通动作手写 `<button>`；优先 `Button`。整卡点击、选项卡片可以保留自定义，但必须保证键盘可操作与可访问名称。

### 4.2 视觉

- 全站无衬线，使用 Inter。
- 不使用衬线字体、暖纸面、编辑感大标题。
- 中性、功能性配色；紧凑密度。
- 不做为了“看起来不一样”的装饰。
- 设置弹窗无可见标题；技能 / 产物 / 应用弹窗有大标题，但不显示副标题。
- 弹窗固定尺寸：
  - 设置 / 应用：`1120 × 780`
  - 技能 / 产物：`920 × 680`
  - 小屏使用 `min(..., calc(100vw/100vh - 2rem))`

### 4.3 数据与状态

- `src/fixtures` 是**渲染数据**，不是领域模型。
- 前端不推导业务阶段、授权、验证结果；后端将来下发什么就渲染什么。
- 所有状态文案必须经过 `src/display/labels.ts` 映射；未知值回退原始值。
- `src/stores/ui-store.ts` 只放纯 UI 状态（面板、弹窗、选中任务等）。
- `src/stores/demo-store.ts` 只放原型演示交互；不得假装成后端。
- 不要在前端引入新的领域规则；新增概念先确认是否应由后端定义。

### 4.4 路由

当前路由：

```
/                     → 重定向到默认 bot
/b/$botId             → Bot 对话
/memory               → 记忆中心
/onboarding           → 新建 bot
/artifact/$artifactId → 资产预览
/dev/states           → 状态画廊（仅开发）
```

- 设置 / 技能 / 产物 / 应用是弹窗，不是页面。
- 旧地址 `/settings`、`/skills`、`/assets`、`/apps` 只做重定向，不渲染页面。
- 新增页面之前先判断：它是否应该是弹窗或右侧面板。

### 4.5 可访问性

- Dialog 必须有 `DialogTitle`；视觉上不需要时使用 `sr-only`。
- 图标按钮必须有 `aria-label`。
- 用户可见文本与可访问名称不能冲突（Lighthouse 的 `label-content-name-mismatch`）。
- 不要让整卡按钮里再嵌套交互控件。

---

## 5. 后端约定

`core/agent` 是 FastAPI + LangChain/LangGraph 原型：

- 入口：`core/agent/main.py`
- 路由：`routers/agent.py`（v1）、`routers/agent_v2.py`（v2）
- Agent 组装：`harness/agent.py`
- SSE 协议：`harness/sse/events.py`、`events_v2.py`、`payloads.py`
- 配置：`config/`
- 设计文档：`core/agent/doc/design/`

注意：

- 路由目前使用 `InMemorySaver` / `InMemoryStore`，Postgres 资源尚未真正接入。
- 旧版 v1 是扁平事件协议；v2 是 message / block / tool / scope 结构。
- 修改事件协议时同步更新设计文档与前端契约文档（`apps/web/docs/backend-contract.md`）。
- 不要把敏感凭证写入仓库；`.env` 已被忽略。

---

## 6. 文档

- 根 `README.md`：项目概览与启动方式
- `apps/web/README.md`：前端运行与结构
- `apps/web/docs/architecture.md`：前端架构
- `apps/web/docs/product-model.md`：Bot / Task / App / Skill / Asset 模型
- `apps/web/docs/design-system.md`：视觉与组件规范
- `apps/web/docs/backend-contract.md`：前端期望的后端契约
- `apps/web/docs/development.md`：开发、测试、状态画廊与常见问题

新增功能时同步更新对应文档。

---

## 7. 测试

- 单元测试与组件测试使用 Vitest + Testing Library + jsdom。
- 修改行为时添加或更新测试。
- 常见测试位置：与实现同目录的 `*.test.tsx` / `*.test.ts`。
- 状态画廊（`/dev/states`）用于视觉走查，不替代测试。
- 不要用截图测试替代可访问性/行为测试。

---

## 8. Git 与提交

- 主分支：`main`
- 功能分支：`feat/*`
- 提交信息使用 `feat(web):`、`fix(web):`、`docs:`、`chore:` 前缀。
- 提交前确保工作区只包含本次改动。
- 不要提交 `.env`、构建产物、缓存或本地 IDE 配置。
- 不要自动合并或 push，除非明确要求。

---

## 9. 完成标准

一个前端改动完成前，至少满足：

- `typecheck` 通过
- 相关测试通过
- `build` 通过
- 没有新增未使用的依赖
- 没有把执行细节放回对话
- 没有引入重复的注意力入口
- 文档在行为变化时已更新
