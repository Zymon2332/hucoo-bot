# @hucoo/web · Personal Agent

一个以**工作项**为中心的注意力路由台：决策台只回答“现在需要你做什么”，工作项详情承载对话、证据、执行与授权。

**当前是静态原型**：所有数据来自 `src/fixtures`，不连接后端，也不发起网络请求。真实的工作项阶段、报告与授权语义由后端定义，前端只负责显示映射与兜底。

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
| `/` | 决策台：需要你、正在推进、观察记录、新的事 |
| `/w/$workItemId` | 工作项详情：`?tab=overview / conversation / evidence / execution / authority` |
| `/agents` | 代理名册：个人助理、子代理、Code Agents |
| `/memory` | 记忆中心（支持 `?focus=<memoryId>`） |
| `/artifact/$artifactId` | 产物全屏预览 |
| `/onboarding` | 三步人格设置 |
| `/settings` | 人格、外观、主动规则与来源、数据 |
| `/dev/states` | 状态画廊（仅开发） |

## 核心模型

`WorkItem` 是界面的一等对象，`Conversation` 只是它的一个渠道：

```
WorkItem
├── outcome / stage / waitingOn / priority
├── authority    授权范围、可逆性、规则
├── plan / reports / agents
├── evidence     产物、diff、来源、session、日志
├── conversations[]  对话 / 邮件 / 消息
├── review / attention
├── decisions
├── audit
└── verification 已验证 / 未验证 / 需要你判断
```

## 产品原则

- **默认缺席**：一切正常时，界面几乎为空。
- **决策队列唯一入口**：需要你处理的事项只在一个主位置出现。
- **健康状态不占空间**：进行中默认折叠，不展示子代理数量与进度条。
- **结果与证据优先**：摘要之外必须能下钻到 artifact、diff、来源与 Code Agent session。
- **可逆性决定自治**：可逆操作才允许批量；不可逆操作必须逐个确认。
- **主动默认观察**：候选只进“观察记录”，不进主队列。
- **显示层不推导**：阶段与等待对象来自 fixtures（未来来自后端），前端只做 `display/labels.ts` 映射，未知值保留原值。

## 结构

```
src/
├── app/shell/       # AppShell、工作项导航、顶栏、需要你抽屉
├── features/
│   ├── work-desk/   # 决策台
│   ├── work-item/   # 工作项详情 + 五个 Tab
│   ├── evidence/    # 证据卡、diff、session
│   ├── agents/      # 代理名册
│   ├── chat/        # 消息块、Composer、对话 Tab
│   ├── memory/
│   ├── settings/
│   └── onboarding/
├── fixtures/        # 静态渲染数据（不是领域模型）
├── display/         # 后端状态 → 中文显示映射 + 兜底
├── lib/             # work-state 投影、主题、高亮
├── stores/          # ui-store（纯 UI）、demo-store（演示交互）
└── routes/          # TanStack Router 文件路由
```

## 组件约定

- 基础交互控件使用 `@hucoo/ui` 的 shadcn 组件（Button、Input、Textarea、Switch、Dialog、Sheet、Tabs、Command、ScrollArea 等）。
- 产品特有展示（工作项卡、计划卡、结果卡、AttentionCard、证据卡、代理卡、阶段徽章）保持自定义，只组合 shadcn 控件。
- 视觉 token 在 `src/styles.css` 覆盖，`@hucoo/ui` 包保持通用。

## 对接后端时

1. 保留 `display/labels.ts` 的映射与兜底，替换 `fixtures` 数据源。
2. 将 `demo-store` 的本地演示交互替换为命令 + 后端事件。
3. 工作项阶段、`waitingOn`、`verification`、`authority` 由后端下发，前端不推导。
4. 对话、证据、代理会话按工作项聚合，不把会话当容器。
