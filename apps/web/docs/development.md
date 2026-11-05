# 开发指南

## 1. 环境

- Node.js 20+
- pnpm 10+
- 所有前端命令在 `apps/` 下执行
- 后端需要 Python 3.14 + uv + PostgreSQL

```bash
cd apps
pnpm install
pnpm dev
```

默认：`http://localhost:5173`。

---

## 2. 常用命令

```bash
# 全部
pnpm check
pnpm build

# 只跑 web
pnpm --filter @hucoo/web dev
pnpm --filter @hucoo/web typecheck
pnpm --filter @hucoo/web test
pnpm --filter @hucoo/web build
```

提交前至少：

```bash
pnpm --filter @hucoo/web typecheck
pnpm --filter @hucoo/web test
pnpm --filter @hucoo/web build
```

---

## 3. 目录速查

```
src/
├── app/shell/        AppShell、Bot 列表、顶栏、右侧面板、通知
├── features/         产品功能
├── components/       共享展示组件
├── fixtures/         静态渲染数据
├── display/          状态 → 中文文案
├── lib/              任务投影、主题、高亮
├── stores/           UI 状态 + 演示交互
└── routes/           TanStack Router 文件路由
```

---

## 4. 状态画廊

开发环境访问：

```
/dev/states
```

它覆盖：

- Bot
- 阶段与未知值兜底
- 任务
- 对话块
- 右侧面板四个 Tab
- 证据 / diff / session
- 应用与技能
- 注意力指标
- 四个弹窗入口

新增 UI 状态时，优先在状态画廊增加一个样例。状态画廊不替代测试，但能快速做视觉走查。

---

## 5. 添加数据

### 添加一个 Bot

1. `fixtures/bots.ts` 增加 Bot。
2. `fixtures/work-items.ts` 给任务分配 `botId`。
3. `fixtures/conversations.ts` 增加该 Bot 的主对话。
4. `fixtures/apps.ts` / `skills.ts` 分配应用与技能。
5. 检查 `BotRail`、通知分组、命令面板。

### 添加一个 Task

1. 在 `fixtures/work-items.ts` 增加条目。
2. 在 `BOT_BY_TASK` 指定 `botId`。
3. 在 `ACCEPTANCE` 增加验收标准。
4. 如有产物，增加 `fixtures/artifacts.ts`。
5. 如有证据，增加 `fixtures/evidence.ts`。
6. 如有对话，在 `fixtures/conversations.ts` 增加任务卡。

### 添加一个弹窗

1. `stores/ui-store.ts` 的 `AppModal` 增加 id。
2. `features/modals/app-modals.tsx` 增加配置：
   - 标题
   - 描述（只给 `sr-only`）
   - 固定尺寸
   - 内容组件
3. 内容组件支持 `embedded`，不要带页面级标题。
4. `features/menu/user-menu.tsx` 增加菜单项。
5. 命令面板增加入口。
6. 测试覆盖打开与关闭。

### 添加右侧面板 Tab

1. `fixtures/types.ts` 的 `PanelTab` 增加 id。
2. `features/panel/right-panel.tsx` 增加图标与渲染。
3. 新建 panel 组件。
4. 状态画廊与测试同步。

---

## 6. 测试

使用 Vitest + Testing Library + jsdom。

- 测试文件与实现同目录：`*.test.tsx` / `*.test.ts`。
- 交互测试优先使用 `userEvent`。
- 路由相关组件可以 mock `@tanstack/react-router` 的 `Link` / `useNavigate`。
- Markdown / Shiki 相关测试建议 mock `@/lib/highlighter`。
- Dialog / Dropdown 需要完整 pointer 事件；`userEvent.click` 通常足够。

当前测试覆盖：

- 文案映射与未知值兜底
- 任务投影
- Bot 对话与任务卡
- 右侧面板四个 Tab
- 弹窗
- 应用 / 技能 / 产物
- 设置
- 记忆
- Onboarding
- 通知

---

## 7. 常见坑

### Zustand selector 返回新数组

```ts
// 错误：每次渲染返回新数组，触发 useSyncExternalStore 无限循环
const candidates = useDemoStore((state) =>
  state.candidates.filter((c) => c.status === "open"),
);
```

正确：

```ts
const all = useDemoStore((state) => state.candidates);
const candidates = all.filter((c) => c.status === "open");
```

选择器必须返回稳定引用或原始值。

### Dialog 缺少标题

Radix Dialog 需要 `DialogTitle`。如果视觉上不需要标题，使用：

```tsx
<DialogTitle className="sr-only">设置</DialogTitle>
```

### 可见文本与 aria-label 不一致

如果按钮可见文本是 `WZ`，不要设置 `aria-label="用户菜单"`。应使用：

```tsx
aria-label="WZ 用户菜单"
```

Lighthouse 会检查 `label-content-name-mismatch`。

### 把执行细节放回对话

不要在 `MessageBlock` 增加 `plan` / `tool` / `log` / `diff`。这些只属于右侧面板。

### 新增独立页面

设置、技能、产物、应用不应新增页面。优先弹窗。
新增页面前先判断：是否应该是弹窗、右侧面板或抽屉。

### 修改后端契约

修改 `core/agent` 事件协议时，同步更新：

- `apps/web/docs/backend-contract.md`
- `apps/web/src/display/labels.ts`
- 状态画廊中的兜底样例

---

## 8. 提交前检查

- [ ] `typecheck` 通过
- [ ] `test` 通过
- [ ] `build` 通过
- [ ] 没有新增未使用依赖
- [ ] 没有把执行细节放回对话
- [ ] 没有重复的注意力入口
- [ ] 弹窗/面板尺寸与既有规范一致
- [ ] 文档已同步
