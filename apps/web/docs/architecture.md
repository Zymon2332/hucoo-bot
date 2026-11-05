# 前端架构

## 1. 目标

`apps/web` 是一个 **bot 中心**的个人助理前端原型：

- 左侧：Bot 列表
- 中间：Bot 对话
- 右侧：默认收起的任务 / 电脑 / 资产 / 设置面板
- 左下角：用户菜单
- 顶栏：全局通知 + 右侧面板开关
- 弹窗：设置 / 技能 / 产物 / 应用

当前不发起网络请求，所有数据来自 `src/fixtures`。

---

## 2. 分层

```
routes/                 页面入口，只做路由与参数解析
  ↓
app/shell/              AppShell、BotRail、TopBar、RightPanel、通知、命令面板
  ↓
features/               产品功能：chat / panel / apps / skills / assets / memory ...
  ↓
components/             基础展示组件（BotAvatar、StageBadge、空态等）
  ↓
display/                后端状态 → 中文文案
lib/                    纯函数：任务投影、主题、高亮
stores/                 UI 状态 + 演示交互
fixtures/               静态渲染数据
```

原则：

- `routes` 不写业务 UI。
- `features` 可以组合 `components` / `stores` / `fixtures`。
- `display` 只做映射，不做判断。
- `fixtures` 是渲染数据，不是领域模型。

---

## 3. AppShell

`src/app/shell/app-shell.tsx` 负责应用外壳：

```
AppShell
├── BotRail              左下角 bot 列表 + 用户菜单
├── section
│   ├── TopBar            bot 名称 / 通知 / 右侧面板开关
│   └── Outlet            当前路由页面
├── RightPanel           默认收起；任务 / 电脑 / 资产 / 设置
├── MobileRail           移动端 bot 抽屉
├── BellDrawer           全局通知
├── CommandPalette       ⌘K
├── AppModals            设置 / 技能 / 产物 / 应用
└── ThemedToaster
```

### 布局

- 桌面：左侧 Bot 列表 + 主内容卡片 + 右侧面板。
- 窄屏：Bot 列表变为抽屉；右侧面板变为覆盖层。
- 右侧面板收起时，在宽屏上显示一条窄图标栏；点击图标直接展开对应 Tab。

---

## 4. 路由

| 路由 | 文件 | 说明 |
| --- | --- | --- |
| `/` | `routes/index.tsx` | 重定向到默认 bot |
| `/b/$botId` | `routes/b/$botId.tsx` | Bot 对话 |
| `/memory` | `routes/memory.tsx` | 记忆中心 |
| `/onboarding` | `routes/onboarding.tsx` | 新建 bot |
| `/artifact/$artifactId` | `routes/artifact/$artifactId.tsx` | 资产预览 |
| `/dev/states` | `routes/dev/states.tsx` | 状态画廊 |

旧地址：

- `/settings`
- `/skills`
- `/assets`
- `/apps`

这些路由只做重定向，不再渲染页面。对应内容通过左下角用户菜单以弹窗打开。

---

## 5. 功能模块

```
features/
├── chat/        Bot 对话、Composer、消息块、即时确认与任务卡
├── panel/       右侧面板：任务、电脑、资产、bot 设置
├── apps/        外部应用与 Agent 管理
├── skills/      技能目录
├── assets/      产物浏览器（筛选 + 列表 + 预览）
├── memory/      记忆中心
├── settings/    全局设置 + 状态画廊
├── onboarding/  新建 bot / 人格设置
├── menu/        左下角用户菜单
├── modals/      四个全局弹窗的容器
├── command/     命令面板
├── evidence/    证据卡、diff
└── artifacts/   资产渲染器与全屏预览
```

---

## 6. 状态

### `ui-store`

纯 UI 状态：

- 左侧栏折叠
- 右侧面板开关 / 当前 Tab
- 选中任务
- 通知抽屉 / 命令面板 / 用户菜单
- 当前弹窗
- 移动端抽屉

### `demo-store`

仅用于静态原型的演示交互：

- 回答结构化问题
- 接受 / 请求修订 / 拒绝审阅
- 停止任务
- 处理主动候选
- 记忆编辑
- 人格设置

它不模拟后端事件，也不负责业务阶段推导。

### `lib/work-state.ts`

把 demo-store 的本地演示结果投影到任务视图上，避免“卡片已回答但顶栏仍显示等待回答”的矛盾。

真实接入后端后，这个投影层应替换为后端状态。

---

## 7. 数据流

```
fixtures/*.ts
   ↓
features / components
   ↓
display/labels.ts       状态 → 中文
   ↓
渲染
```

交互：

```
用户操作
   ↓
demo-store 更新
   ↓
work-state 投影
   ↓
重新渲染
```

没有网络请求、没有 SSE、没有 IndexedDB。

---

## 8. 静态原型边界

当前明确不做：

- 真实 API 调用
- SSE 流式连接
- 持久化
- 多用户鉴权
- 真实容器 / 桌面控制
- 真实 Code Agent 调用

接后端时优先替换：

1. `fixtures` → 后端 view model
2. `demo-store` → 命令 + 后端事件
3. `work-state` 投影 → 后端状态
4. 保持 `display/labels.ts` 的映射与兜底

---

## 9. 扩展点

### 新增一个右侧面板 Tab

1. 在 `fixtures/types.ts` 的 `PanelTab` 增加值。
2. 在 `features/panel/right-panel.tsx` 增加 Tab 配置与渲染。
3. 新增对应 panel 组件。
4. 更新状态画廊与测试。

### 新增一个弹窗

1. 在 `stores/ui-store.ts` 的 `AppModal` 增加值。
2. 在 `features/modals/app-modals.tsx` 增加配置。
3. 内容组件支持 `embedded`，不要带页面级标题。
4. 更新 `features/menu/user-menu.tsx` 与命令面板入口。

### 新增一个 Bot 数据

1. 在 `fixtures/bots.ts` 增加 Bot。
2. 在 `fixtures/work-items.ts` 给任务分配 `botId`。
3. 在 `fixtures/apps.ts` / `skills.ts` 分配应用与技能。
4. 如需对话，在 `fixtures/conversations.ts` 增加 bot 主对话。
