# 设计系统

## 1. 原则

- 功能优先，不做为了“看起来不一样”的装饰。
- 中性、紧凑、可长期每天使用。
- 全站无衬线，不使用衬线字体或编辑感大标题。
- 基础交互控件统一到 shadcn；产品语义强的组件保留自定义。

---

## 2. 字体

- 主字体：Inter Variable
- 回退：系统无衬线
- 代码：等宽字体
- 不使用 Fraunces 或其他衬线字体

CSS 变量：

```css
--font-sans: "Inter Variable", "Inter", ui-sans-serif, system-ui, ...;
--font-display: "Inter Variable", "Inter", ui-sans-serif, system-ui, ...;
```

`font-display` 也指向无衬线，避免历史组件意外回退到衬线。

---

## 3. 颜色

在 `src/styles.css` 覆盖 shadcn token，`@hucoo/ui` 包保持通用。

### 亮色

| Token | 值 |
| --- | --- |
| `--background` | `#f5f6f7` |
| `--foreground` | `#171a1f` |
| `--card` | `#ffffff` |
| `--primary` | `#2e5aac` |
| `--secondary` | `#f0f2f5` |
| `--muted-foreground` | `#6b7280` |
| `--border` | `#e3e6ea` |
| `--success` | `#2f7d5b` |
| `--warning` | `#a86312` |
| `--destructive` | `#c0392b` |

### 暗色

| Token | 值 |
| --- | --- |
| `--background` | `#0f1115` |
| `--foreground` | `#e8ebef` |
| `--card` | `#151820` |
| `--primary` | `#6e9be8` |
| `--secondary` | `#1c2029` |
| `--muted-foreground` | `#9aa3b2` |
| `--border` | `#262b36` |
| `--success` | `#5fb98c` |
| `--warning` | `#d6a44a` |
| `--destructive` | `#e4695e` |

强调色只用于主操作、选中态、左侧竖条和少量状态，不用于大面积装饰。

---

## 4. 布局

### 应用外壳

| 区域 | 宽度 |
| --- | --- |
| Bot 列表展开 | `264px` |
| Bot 列表收起 | `60px` |
| 主内容 | 自适应 |
| 右侧面板收起图标栏 | `44px` |
| 右侧面板展开 | `380px` |

- 主内容是一个圆角卡片。
- 右侧面板是独立圆角面板。
- 窄屏：Bot 列表变 Sheet；右侧面板变覆盖层。

### 弹窗

| 弹窗 | 尺寸 |
| --- | --- |
| 设置 / 应用 | `1120 × 780` |
| 技能 / 产物 | `920 × 680` |

- 小屏：`min(尺寸, calc(100vw/100vh - 2rem))`。
- 设置弹窗没有可见标题；技能 / 产物 / 应用有大标题，但无副标题。
- 设置左栏固定 `184px`，字体 `13.5px`，图标 `15px`。
- 内容区独立滚动，弹窗本身不随内容跳变。

---

## 5. 组件约定

### 使用 shadcn（`@hucoo/ui`）

- Button
- Input / Textarea
- Dialog / Sheet
- DropdownMenu
- Tabs
- Command
- Switch
- Badge
- Avatar / AvatarFallback / AvatarBadge
- Card
- Separator
- ScrollArea
- Tooltip
- Sonner

### 保留自定义

- 任务卡
- Attention 选项卡
- 结果 + 审阅卡
- 错误卡
- 消息气泡
- 电脑桌面 / 终端 / 文件 / 进程
- Bot 行
- 右侧面板外壳

整卡点击区域可以保留自定义按钮，但必须：

- 键盘可操作
- 有可访问名称
- 内部不嵌套交互控件

---

## 6. 状态与徽章

- `StageBadge`：`Badge` + 阶段色调。
- `ModeBadge`：`Badge variant="outline"`。
- `ArtifactKindBadge`：`Badge variant="secondary"`。
- 未知状态回退原始值，不隐藏。
- 状态文案统一来自 `src/display/labels.ts`。

---

## 7. 动效

- 只使用轻微上浮 / 淡入。
- 默认 `180ms` 左右。
- 支持 `reduce-motion`，通过 `prefers-reduced-motion` 或设置里的“减少动效”。
- 不做循环装饰动画。

---

## 8. 可访问性

- Dialog 必须有 `DialogTitle`；视觉隐藏时使用 `sr-only`。
- 图标按钮必须有 `aria-label`。
- 可见文本与可访问名称不能冲突。
- 颜色对比度至少满足 AA。
- 键盘可完成：打开面板、切换 Tab、关闭弹窗、发送消息。
