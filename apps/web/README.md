# @hucoo/web · Personal Agent

一个 **bot 中心**的个人助理原型：左侧是 bot，中间是 IM 风格对话，右侧是可收起的任务 / 电脑 / 资产 / 设置面板。

**当前是静态原型**：所有数据来自 `src/fixtures`，不连接后端，也不发起网络请求。真实的任务状态、授权与事件由后端定义，前端只负责显示映射与兜底。

## 文档

- [docs/architecture.md](./docs/architecture.md)
- [docs/product-model.md](./docs/product-model.md)
- [docs/design-system.md](./docs/design-system.md)
- [docs/backend-contract.md](./docs/backend-contract.md)
- [docs/development.md](./docs/development.md)

## 运行

```bash
pnpm install
pnpm --filter @hucoo/web dev     # http://localhost:5173
pnpm --filter @hucoo/web test
pnpm --filter @hucoo/web typecheck
pnpm --filter @hucoo/web build
```

## 路由

| 路由 | 页面 |
| --- | --- |
| `/` | 重定向到默认 bot |
| `/b/$botId` | Bot 对话：即时确认、任务卡、结果、提问、失败 |
| `/memory` | 记忆中心 |
| `/onboarding` | 新建 bot |
| `/artifact/$artifactId` | 资产预览 |
| `/dev/states` | 状态画廊（仅开发） |

设置、技能、产物、应用不再有独立页面：从左下角用户头像菜单打开，统一用弹窗展示。旧地址 `/settings` `/skills` `/assets` `/apps` 会重定向回默认 bot。

## 核心模型

```
Bot
├── 主 Agent（只路由、即时确认、不执行）
├── 独立人格 / 记忆 / 应用 / Agent / 技能
├── 任务队列
├── 资产
└── 通知圆点

Task
├── botId / 验收标准 / 状态 / 等待对象
├── 子代理 / 报告 / 证据 / 资产 / 授权
└── 停止与审计
```

全局共享：模型凭证、用量、应用连接池、技能目录、外观与通知设置。

## 交互契约

- 主 Agent 只输出：即时确认、任务卡、结果就绪、结构化提问、失败。
- 执行细节（步骤、工具、日志、diff）只进右侧面板，不进对话。
- Composer 始终可用；任务运行时用户可以继续补充要求。
- 全局只有一个通知入口；每个 bot 只用一个小圆点提示。
- 右侧面板默认收起，四个 Tab：任务 / 电脑 / 资产 / 设置。
- 电脑 Tab 展示容器桌面、终端、文件与进程。
- 左下角头像菜单：设置 / 技能 / 产物 / 应用，全部以弹窗打开。

## 结构

```
src/
├── app/shell/       # AppShell、bot 导航、顶栏、全局通知
├── features/
│   ├── chat/        # bot 对话、消息块、Composer
│   ├── panel/       # 右侧任务 / 电脑 / 资产 / bot 设置
│   ├── apps/        # 外部应用与 Agent
│   ├── skills/      # 技能
│   ├── assets/      # 产物
│   ├── menu/        # 左下角用户菜单
│   ├── modals/      # 设置 / 技能 / 产物 / 应用弹窗
│   ├── memory/
│   ├── settings/
│   └── onboarding/
├── fixtures/        # 静态渲染数据（不是领域模型）
├── display/         # 后端状态 → 中文显示映射 + 兜底
├── lib/             # 任务投影、主题、高亮
├── stores/          # ui-store（纯 UI）、demo-store（演示交互）
└── routes/          # TanStack Router 文件路由
```

## 视觉

- 全站无衬线（Inter），移除衬线字体。
- 中性功能性配色，紧凑密度。
- 基础控件使用 `@hucoo/ui` 的 shadcn 组件；产品特有卡片保持自定义。

## 对接后端时

1. 保留 `display/labels.ts` 的映射与兜底，替换 `fixtures`。
2. 将 `demo-store` 的本地演示交互替换为命令 + 后端事件。
3. Bot、Task、通知、授权、验证结果都由后端下发，前端不推导。
4. 对话只接收高层事件；执行细节通过右侧面板读取。
