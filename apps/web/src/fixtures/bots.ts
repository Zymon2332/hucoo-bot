import type { Bot } from "./types";

export const BOTS: Bot[] = [
  {
    id: "bot-work",
    name: "小满",
    role: "工作助理",
    initials: "满",
    accent: "#2F5FA8",
    persona: "安静、直接、先给结论。只在需要你的时候出现。",
    description: "周报、竞品、邮件、合同与跨团队协作。",
    addressAs: "WZM",
    tone: "concise",
    memoryScope: "bot",
    appIds: ["app-mail", "app-calendar", "app-notion", "app-github"],
    agentIds: ["agent-claude", "agent-codex", "agent-opencode"],
    skillIds: ["skill-write", "skill-review", "skill-research"],
    lastActiveAt: "刚刚",
    greeting: "今天想推进哪件事？",
  },
  {
    id: "bot-life",
    name: "阿禾",
    role: "生活助理",
    initials: "禾",
    accent: "#4F7A5A",
    persona: "温和、留白、不催促。帮我把生活安排得松一点。",
    description: "行程、旅行、周末与日常琐事。",
    addressAs: "WZM",
    tone: "warm",
    memoryScope: "bot",
    appIds: ["app-calendar", "app-notes", "app-web"],
    agentIds: ["agent-claude", "agent-opencode"],
    skillIds: ["skill-travel", "skill-research"],
    lastActiveAt: "今天 09:20",
    greeting: "最近有什么想安排的？",
  },
  {
    id: "bot-code",
    name: "阿码",
    role: "编码助理",
    initials: "码",
    accent: "#5B5BD6",
    persona: "简洁、技术化、先看证据。不替你做技术决策，只把结果和 diff 摆出来。",
    description: "仓库、重构、测试、Code Agent 调度。",
    addressAs: "WZM",
    tone: "direct",
    memoryScope: "bot",
    appIds: ["app-github", "app-figma", "app-terminal"],
    agentIds: ["agent-opencode", "agent-claude", "agent-codex"],
    skillIds: ["skill-code", "skill-test", "skill-review"],
    lastActiveAt: "今天 09:52",
    greeting: "要改哪里？把目标丢给我。",
  },
];

export function getBot(id: string): Bot | undefined {
  return BOTS.find((bot) => bot.id === id);
}

export const DEFAULT_BOT_ID = "bot-work";
