# @hucoo/web · Personal Agent

一个安静的个人助理前端原型：对话为主舞台，右侧检查器承载执行、记忆、产物与能力。

**当前是静态原型**：所有数据来自 `src/fixtures`，不连接后端，也不发起网络请求。真实的任务阶段、报告与授权语义由后端定义，前端只负责显示映射与兜底。

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
| `/` | 助理主页：问候、输入、需要你处理、进行中 |
| `/c/$conversationId` | 对话 + 检查器 |
| `/memory` | 记忆中心（支持 `?focus=<memoryId>`） |
| `/artifact/$artifactId` | 产物全屏预览 |
| `/onboarding` | 三步人格设置 |
| `/settings` | 人格、外观、主动规则、数据 |
| `/dev/states` | 状态画廊（仅开发） |

## 结构

```
src/
├── app/shell/       # AppShell、会话栏、顶栏、检查器、铃铛抽屉
├── features/        # 对话、任务、记忆、产物、主动、设置、Onboarding
├── fixtures/        # 静态渲染数据（不是领域模型）
├── display/         # 后端状态 → 中文显示映射，未知值回退原值
├── stores/          # ui-store（纯 UI 状态）、demo-store（演示交互）
└── routes/          # TanStack Router 文件路由
```

## 设计约束

- **安静**：任务执行过程只进检查器，不进对话流。对话里只出现结果、结构化提问、失败与主动候选。
- **注意力预算**：不刷进度、不刷步骤；只有在需要你行动或结果可用时出现。
- **结构化提问**：一次只问一个具体问题，用选项卡而不是长文。
- **观察优先**：主动行为默认只记录候选，不直接执行。
- **显示层不推导**：任务阶段由 fixtures（未来由后端）给出，前端只做 `display/labels.ts` 映射；未知状态保留原始值。

## 组件约定

- 基础交互控件使用 `@hucoo/ui` 的 shadcn 组件（Button、Input、Textarea、Switch、Dialog、Sheet、Tabs、Command、ScrollArea 等）。
- 产品特有展示（计划卡、结果卡、AttentionCard、审阅卡、候选卡、消息项、会话行、阶段徽章）保持自定义，只组合 shadcn 控件。
- 视觉 token 在 `src/styles.css` 覆盖，`@hucoo/ui` 包保持通用。

## 配置后端时

1. 保留 `display/labels.ts` 的映射与兜底，替换数据来源。
2. 将 `/dev/states` 的 fixtures 换成后端返回的 view model。
3. 删除 `demo-store` 中的本地演示交互，改为发送命令并等待后端事件。
