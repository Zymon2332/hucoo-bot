import type { AppConnection, UsageSummary } from "./types";

export const APPS: AppConnection[] = [
  {
    id: "app-mail",
    kind: "mcp",
    name: "邮件",
    description: "读取未读、起草回复、跟踪待办。",
    status: "error",
    assignedBotIds: ["bot-work"],
  },
  {
    id: "app-calendar",
    kind: "mcp",
    name: "日历",
    description: "读取日程、发现冲突、创建与调整会议。",
    status: "connected",
    assignedBotIds: ["bot-work", "bot-life"],
  },
  {
    id: "app-notion",
    kind: "mcp",
    name: "Notion",
    description: "会议纪要、项目文档、知识库检索。",
    status: "connected",
    assignedBotIds: ["bot-work"],
  },
  {
    id: "app-github",
    kind: "mcp",
    name: "GitHub",
    description: "仓库、Issue、Pull Request 与 CI。",
    status: "connected",
    assignedBotIds: ["bot-work", "bot-code"],
  },
  {
    id: "app-figma",
    kind: "mcp",
    name: "Figma",
    description: "读取设计稿、导出切图与设计变量。",
    status: "connected",
    assignedBotIds: ["bot-code"],
  },
  {
    id: "app-notes",
    kind: "mcp",
    name: "笔记",
    description: "个人笔记与旅行收藏。",
    status: "connected",
    assignedBotIds: ["bot-life"],
  },
  {
    id: "app-web",
    kind: "mcp",
    name: "网页研究",
    description: "搜索并整理公开信息，附来源。",
    status: "connected",
    assignedBotIds: ["bot-life"],
  },
  {
    id: "app-terminal",
    kind: "mcp",
    name: "容器终端",
    description: "在隔离容器中运行命令、文件和测试。",
    status: "connected",
    assignedBotIds: ["bot-code"],
  },
  {
    id: "agent-opencode",
    kind: "agent",
    name: "opencode",
    description: "通用编码 Agent，适合仓库内多步修改。",
    status: "connected",
    assignedBotIds: ["bot-work", "bot-life", "bot-code"],
  },
  {
    id: "agent-claude",
    kind: "agent",
    name: "Claude Code",
    description: "长上下文代码执行，适合重构与审阅。",
    status: "connected",
    assignedBotIds: ["bot-work", "bot-life", "bot-code"],
  },
  {
    id: "agent-codex",
    kind: "agent",
    name: "Codex",
    description: "快速修复与脚本执行。",
    status: "connected",
    assignedBotIds: ["bot-work", "bot-code"],
  },
];

export const USAGE: UsageSummary[] = [
  { botId: "bot-work", tokens: 842_000, cost: 12.4, tasks: 7 },
  { botId: "bot-life", tokens: 196_000, cost: 2.8, tasks: 3 },
  { botId: "bot-code", tokens: 1_240_000, cost: 18.6, tasks: 2 },
];

export function getApp(id: string): AppConnection | undefined {
  return APPS.find((app) => app.id === id);
}

export function appsForBot(botId: string): AppConnection[] {
  return APPS.filter((app) => app.assignedBotIds.includes(botId));
}
