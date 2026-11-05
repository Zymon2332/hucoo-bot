import type { Artifact, Capability, Profile } from "./types";

type RawArtifact = Omit<Artifact, "botId">;

export const PROFILE: Profile = {
  name: "小满",
  role: "你的个人助理",
  initials: "满",
  accent: "#A64B2A",
  addressAs: "WZM",
  tone: "warm",
  memoryEnabled: true,
  proactiveMode: "observe",
};

const RAW_ARTIFACTS: RawArtifact[] = [
  {
    id: "a-weekly",
    title: "本周产品周报",
    kind: "markdown",
    status: "ready",
    summary: "汇总 5 个进展、3 个风险与下周计划",
    updatedAt: "今天 09:42",
    content: `# 本周产品周报

> 覆盖 10 月 28 日 – 11 月 1 日 · 由小满整理

## 本周进展

1. **会话工作台完成信息架构评审**：确定「对话 + 检查器」为主路径，移除独立画布与项目空间。
2. **记忆中心进入开发**：支持偏好、关于我、项目、关系、习惯五类，以及来源追溯。
3. **主动机制默认观察**：所有规则先记录「会做什么」，由你决定是否开启自动。
4. **移动端适配完成 80%**：会话列表改为抽屉，检查器改为底部面板。
5. **可访问性回归**：键盘路径与对比度问题修复 12 项。

## 风险与阻塞

| 风险 | 影响 | 建议 |
| --- | --- | --- |
| 后端契约尚未冻结 | 前端只能使用 fixtures | 先按渲染层交付，契约就绪后替换适配层 |
| 长会话渲染性能 | 超过 300 条消息时滚动掉帧 | 引入虚拟列表 |
| 记忆去重策略缺失 | 可能重复记录同一偏好 | 后端增加相似度合并 |

## 下周计划

- 完成记忆中心的编辑与来源跳转
- 补齐空态、错误态与未知状态兜底
- 与后端对齐事件命名与状态枚举
- 输出交互走查清单

---

**一句话总结**：本周把「工作台」收敛成了「一个安静的个人助理」，方向已定，剩下的是打磨。`,
  },
  {
    id: "a-competitor",
    title: "Q4 竞品对比表",
    kind: "table",
    status: "ready",
    summary: "6 个竞品 × 5 个维度的横向对比",
    updatedAt: "今天 09:38",
    content: `产品,定位,主动能力,记忆,任务编排
Grok,个人 AI 伙伴,中,强,弱
DeepSeek Superagent,自主代理监督,强,弱,强
ChatGPT,通用助手,中,强,中
Claude,写作与编码,低,中,中
Perplexity,搜索问答,低,弱,无
Notion AI,文档助手,低,中,弱`,
  },
  {
    id: "a-schedule",
    title: "下周行程建议",
    kind: "markdown",
    status: "draft",
    summary: "已避开两个冲突时段，等待你确认周三安排",
    updatedAt: "今天 09:20",
    content: `# 下周行程建议

## 周一
- 10:00 产品周会（线上）
- 14:00 与设计对齐记忆中心

## 周二
- 09:30 深度工作：检查器交互
- 16:00 1:1

## 周三
- ⚠️ 14:00 评审与 15:00 牙医预约冲突
- 建议：评审改到 11:00，或牙医改到周四上午

## 周四
- 10:00 后端契约对齐
- 15:00 预留缓冲

## 周五
- 全天深度工作，不排会`,
  },
  {
    id: "a-launch",
    title: "个人助理发布页草稿",
    kind: "html",
    status: "draft",
    summary: "一页式介绍，暖色编辑风格",
    updatedAt: "昨天 18:12",
    content: `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin: 0; font-family: ui-sans-serif, system-ui; background: #f6f2ea; color: #211e19; }
      main { max-width: 640px; margin: 0 auto; padding: 72px 24px; }
      .eyebrow { font-size: 12px; letter-spacing: .18em; text-transform: uppercase; color: #a64b2a; }
      h1 { font-family: Georgia, serif; font-size: 44px; line-height: 1.1; margin: 16px 0; }
      p { font-size: 17px; line-height: 1.7; color: #7a7367; }
      .card { margin-top: 40px; padding: 24px; background: #fffcf6; border: 1px solid #e3dbce; border-radius: 18px; }
      .row { display: flex; gap: 10px; align-items: center; font-size: 14px; color: #211e19; }
      .dot { width: 8px; height: 8px; border-radius: 999px; background: #a64b2a; }
    </style>
  </head>
  <body>
    <main>
      <div class="eyebrow">Hucoo</div>
      <h1>一个安静的个人助理</h1>
      <p>它不刷进度，不打扰你。只在结果可用、需要你决定、或无法完成时出现。</p>
      <div class="card">
        <div class="row"><span class="dot"></span>记得你的偏好，也记得你的边界</div>
        <div class="row" style="margin-top: 12px"><span class="dot"></span>主动行为默认只观察，不擅自行动</div>
        <div class="row" style="margin-top: 12px"><span class="dot"></span>一次只问一个具体问题</div>
      </div>
    </main>
  </body>
</html>`,
  },
  {
    id: "a-budget",
    title: "季度预算表",
    kind: "table",
    status: "draft",
    summary: "按团队拆分的预算与执行率",
    updatedAt: "昨天 16:05",
    content: `团队,预算(万),已用(万),执行率
产品,120,86,72%
设计,60,41,68%
前端,180,132,73%
后端,200,151,76%
数据,90,52,58%`,
  },
  {
    id: "a-contract",
    title: "供应商合同条款核对",
    kind: "markdown",
    status: "ready",
    summary: "12 条关键条款，3 条需要你判断的风险",
    updatedAt: "昨天 14:30",
    content: `# 供应商合同条款核对

> 合同版本：Vendor-Agreement-v4.docx · 由 Claude Code 提取，小满整理

## 关键条款

1. **付款周期**：验收后 30 日内支付，逾期按 0.05%/日计息。
2. **数据归属**：服务过程中产生的数据归甲方所有。
3. **保密期限**：合同终止后 5 年。
4. **续约**：自动续约 12 个月，需提前 60 天书面通知。

## 需要你判断的风险

| 条款 | 风险 | 建议 |
| --- | --- | --- |
| 第 7.2 条 | 单方面变更服务范围 | 要求提前 30 天书面确认 |
| 第 9.4 条 | 数据删除时限 90 天 | 缩短到 30 天 |
| 第 12.1 条 | 争议解决地在外地 | 改为本地仲裁 |

## 未验证

- 附件中的 SLA 具体指标未读取
- 对方主体资质未核对

---

**注意**：这是草稿，不构成法律意见。`,
  },
  {
    id: "a-test-report",
    title: "Web 测试报告",
    kind: "table",
    status: "ready",
    summary: "覆盖率 84%，24 个用例通过，0 失败",
    updatedAt: "今天 10:20",
    content: `模块,用例数,通过,覆盖率
登录,9,9,92%
权限,7,7,88%
会话,5,5,81%
错误处理,3,3,76%
合计,24,24,84%`,
  },
];

const ARTIFACT_BOT: Record<string, string> = {
  "a-weekly": "bot-work",
  "a-competitor": "bot-work",
  "a-schedule": "bot-life",
  "a-launch": "bot-work",
  "a-budget": "bot-work",
  "a-contract": "bot-work",
  "a-test-report": "bot-code",
};

export const ARTIFACTS: Artifact[] = RAW_ARTIFACTS.map((artifact) => ({
  ...artifact,
  botId: ARTIFACT_BOT[artifact.id] ?? "bot-work",
}));

export const CAPABILITIES: Capability[] = [
  {
    id: "c-calendar",
    name: "日历",
    description: "读取日程、发现冲突、创建与调整会议",
    kind: "connector",
    enabled: true,
    lastUsed: "10 分钟前",
  },
  {
    id: "c-mail",
    name: "邮件",
    description: "摘要未读、起草回复、跟踪待办",
    kind: "connector",
    enabled: true,
    lastUsed: "今天 08:40",
  },
  {
    id: "c-notes",
    name: "笔记",
    description: "检索个人笔记与会议纪要",
    kind: "connector",
    enabled: true,
    lastUsed: "昨天",
  },
  {
    id: "c-web",
    name: "网页研究",
    description: "搜索并整理公开信息，附来源",
    kind: "tool",
    enabled: true,
    lastUsed: "今天 09:30",
  },
  {
    id: "c-browser",
    name: "浏览器操作",
    description: "在你授权下填写表单、抓取页面",
    kind: "tool",
    enabled: false,
  },
  {
    id: "c-write",
    name: "长文写作",
    description: "结构化写作：周报、方案、发布稿",
    kind: "skill",
    enabled: true,
    lastUsed: "今天 09:42",
  },
  {
    id: "c-review",
    name: "结果审阅",
    description: "对草稿做一致性、事实与语气检查",
    kind: "skill",
    enabled: true,
  },
];
