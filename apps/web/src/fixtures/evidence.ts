import type { Evidence } from "./types";

export const EVIDENCE: Evidence[] = [
  {
    id: "ev-weekly-artifact",
    kind: "artifact",
    title: "本周产品周报",
    summary: "1,240 字，含 5 个进展、3 个风险与 1 张表格。",
    at: "今天 09:42",
    artifactId: "a-weekly",
    verified: "yes",
  },
  {
    id: "ev-weekly-diff",
    kind: "diff",
    title: "docs/weekly/2026-W45.md",
    summary: "新增周报文件，48 行。",
    at: "今天 09:40",
    agentId: "code-claude",
    diff: {
      file: "docs/weekly/2026-W45.md",
      additions: 48,
      deletions: 0,
      patch: `+ # 本周产品周报
+ > 覆盖 10 月 28 日 – 11 月 1 日 · 由小满整理
+
+ ## 本周进展
+ 1. 会话工作台完成信息架构评审
+ 2. 记忆中心进入开发
+ 3. 主动机制默认观察
+ 4. 移动端适配完成 80%
+ 5. 可访问性回归修复 12 项
+
+ ## 风险与阻塞
+ - 后端契约尚未冻结
+ - 长会话渲染性能
+ - 记忆去重策略缺失`,
    },
    verified: "yes",
  },
  {
    id: "ev-weekly-session",
    kind: "session",
    title: "Claude Code · session 8f2a",
    summary: "生成周报文件并返回变更摘要。",
    at: "今天 09:40",
    agentId: "code-claude",
    log: [
      "$ git status --short",
      "  M apps/web/src/routes/index.tsx",
      "$ write docs/weekly/2026-W45.md",
      "  created 48 lines",
      "$ git diff --stat",
      "  docs/weekly/2026-W45.md | 48 ++++++++++++++++++++++++++++++++",
      "  1 file changed, 48 insertions(+)",
    ],
    verified: "yes",
  },
  {
    id: "ev-weekly-source",
    kind: "source",
    title: "会议纪要 3 条",
    summary: "产品周会、设计对齐、后端契约讨论。",
    at: "今天 09:26",
    sourceLabel: "Notion / 产品周会",
    sourceUrl: "https://example.com/notes/weekly",
    verified: "yes",
  },
  {
    id: "ev-competitor-draft",
    kind: "artifact",
    title: "Q4 竞品对比表",
    summary: "6 个产品 × 5 个维度，4 个产品已填完。",
    at: "今天 09:48",
    artifactId: "a-competitor",
    verified: "partial",
  },
  {
    id: "ev-competitor-session",
    kind: "session",
    title: "Claude Code · session 2d71",
    summary: "正在逐项填写对比表，已处理 4 个产品。",
    at: "今天 09:52",
    agentId: "code-claude-competitor",
    log: [
      "$ research --product grok",
      "  fetched 3 sources",
      "$ research --product deepseek",
      "  fetched 2 sources",
      "$ compare --write table.csv",
      "  filled 4/6 rows",
    ],
    verified: "partial",
  },
  {
    id: "ev-competitor-source",
    kind: "source",
    title: "6 个产品官网与公开文档",
    summary: "官方文档、发布说明与公开访谈。",
    at: "今天 09:44",
    sourceLabel: "Web",
    sourceUrl: "https://example.com/research/q4-competitors",
    verified: "partial",
  },
  {
    id: "ev-schedule-source",
    kind: "source",
    title: "日历 · 下周 12 个事件",
    summary: "包含评审、1:1、牙医预约与两个深度工作块。",
    at: "今天 09:10",
    sourceLabel: "Calendar",
    sourceUrl: "https://example.com/calendar",
    verified: "yes",
  },
  {
    id: "ev-budget-artifact",
    kind: "artifact",
    title: "季度预算表",
    summary: "三个团队已完成，数据团队缺少 10 月数据。",
    at: "昨天 16:05",
    artifactId: "a-budget",
    verified: "partial",
  },
  {
    id: "ev-budget-session",
    kind: "log",
    title: "数据助手 · 执行日志",
    summary: "读取四个团队数据时中断。",
    at: "昨天 16:05",
    agentId: "agent-data",
    log: [
      "read budget/product.xlsx … ok",
      "read budget/design.xlsx … ok",
      "read budget/engineering.xlsx … ok",
      "read budget/data.xlsx … missing (October)",
      "blocked: need export file or finance system access",
    ],
    verified: "partial",
  },
  {
    id: "ev-inbox-session",
    kind: "session",
    title: "Codex · session 3c1d",
    summary: "邮件连接器认证失败。",
    at: "今天 08:41",
    agentId: "code-codex",
    log: [
      "$ mail auth status",
      "  token expired 2026-11-04T08:30:00Z",
      "$ mail sync --unread",
      "  error: unauthorized (401)",
      "  progress saved: 0/47 messages",
    ],
    verified: "no",
  },
  {
    id: "ev-trip-source",
    kind: "source",
    title: "旅行笔记与地图收藏",
    summary: "你收藏的 12 个地点，集中在东山与鸭川附近。",
    at: "刚才",
    sourceLabel: "Notes / Kyoto",
    sourceUrl: "https://example.com/notes/kyoto",
    verified: "partial",
  },
  {
    id: "ev-design-source",
    kind: "source",
    title: "设计系统更新日志",
    summary: "本周 3 条与前端实现相关的变更。",
    at: "周一 10:18",
    sourceLabel: "Design System / Changelog",
    sourceUrl: "https://example.com/design-system/changelog",
    verified: "yes",
  },
  {
    id: "ev-weekend-source",
    kind: "source",
    title: "天气与地点营业时间",
    summary: "周六晴，两个候选地点均营业。",
    at: "周六 09:05",
    sourceLabel: "Weather / Maps",
    sourceUrl: "https://example.com/weather",
    verified: "yes",
  },
  {
    id: "ev-pricing-artifact",
    kind: "artifact",
    title: "个人助理发布页草稿",
    summary: "一页式介绍，暖色编辑风格。",
    at: "昨天 18:12",
    artifactId: "a-launch",
    verified: "partial",
  },
  {
    id: "ev-pricing-diff",
    kind: "diff",
    title: "site/launch.html",
    summary: "新增发布页，82 行。",
    at: "昨天 18:10",
    agentId: "code-claude-pricing",
    diff: {
      file: "site/launch.html",
      additions: 82,
      deletions: 0,
      patch: `+ <main>
+   <div class="eyebrow">Hucoo</div>
+   <h1>一个安静的个人助理</h1>
+   <p>它不刷进度，不打扰你。只在结果可用、需要你决定、或无法完成时出现。</p>
+ </main>`,
    },
    verified: "partial",
  },
  {
    id: "ev-contract-artifact",
    kind: "artifact",
    title: "供应商合同条款核对",
    summary: "12 条关键条款，3 条风险需要判断。",
    at: "昨天 14:30",
    artifactId: "a-contract",
    verified: "partial",
  },
  {
    id: "ev-contract-source",
    kind: "source",
    title: "Vendor-Agreement-v4.docx",
    summary: "合同正文 24 页；附件 SLA 未读取。",
    at: "昨天 14:10",
    sourceLabel: "Local file",
    verified: "partial",
  },
  {
    id: "ev-refactor-diff",
    kind: "diff",
    title: "apps/web/src/auth/session.ts",
    summary: "拆分会话与凭据逻辑，新增 35 行，删除 48 行。",
    at: "今天 10:16",
    agentId: "code-claude",
    diff: {
      file: "apps/web/src/auth/session.ts",
      additions: 35,
      deletions: 48,
      patch: `- export function login(email, password) {
-   const token = sign({ email })
-   return { token, user: { email } }
- }
+ export async function login(email, password) {
+   const session = await createSession(email)
+   return { token: session.token, user: session.user }
+ }
+
+ export async function refresh(sessionId) {
+   return rotateSession(sessionId)
+ }`,
    },
    verified: "partial",
  },
  {
    id: "ev-refactor-session",
    kind: "session",
    title: "Claude Code · session 6a21",
    summary: "重构登录模块，等待测试通过。",
    at: "今天 10:18",
    agentId: "code-claude",
    log: [
      "$ rg \"function login\" apps/web/src",
      "  found 3 call sites",
      "$ edit apps/web/src/auth/session.ts",
      "  split session/credential helpers",
      "$ bun test auth",
      "  18 passed, 0 failed",
    ],
    verified: "partial",
  },
  {
    id: "ev-refactor-test",
    kind: "test",
    title: "auth 测试",
    summary: "18 个用例通过；E2E 未跑。",
    at: "今天 10:18",
    agentId: "code-claude",
    verified: "partial",
  },
  {
    id: "ev-tests-artifact",
    kind: "artifact",
    title: "Web 测试报告",
    summary: "覆盖率 84%，24 个用例通过。",
    at: "今天 10:20",
    artifactId: "a-test-report",
    verified: "yes",
  },
];

export function getEvidence(id: string): Evidence | undefined {
  return EVIDENCE.find((item) => item.id === id);
}
