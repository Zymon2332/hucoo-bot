export interface Skill {
  id: string;
  name: string;
  description: string;
  assignedBotIds: string[];
}

export const SKILLS: Skill[] = [
  {
    id: "skill-write",
    name: "长文写作",
    description: "周报、方案、发布稿的结构化写作。",
    assignedBotIds: ["bot-work"],
  },
  {
    id: "skill-review",
    name: "结果审阅",
    description: "对草稿做一致性、事实与语气检查。",
    assignedBotIds: ["bot-work", "bot-code"],
  },
  {
    id: "skill-research",
    name: "网页研究",
    description: "搜索、交叉验证并整理来源。",
    assignedBotIds: ["bot-work", "bot-life"],
  },
  {
    id: "skill-code",
    name: "代码修改",
    description: "仓库内多步修改、diff 与验证。",
    assignedBotIds: ["bot-code"],
  },
  {
    id: "skill-test",
    name: "测试补齐",
    description: "补单元测试、覆盖率与失败项说明。",
    assignedBotIds: ["bot-code"],
  },
  {
    id: "skill-travel",
    name: "旅行规划",
    description: "步行路线、安静地点与留白安排。",
    assignedBotIds: ["bot-life"],
  },
];

export function skillsForBot(botId: string): Skill[] {
  return SKILLS.filter((skill) => skill.assignedBotIds.includes(botId));
}
