import type { Conversation } from "./types";

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-bot-work",
    botId: "bot-work",
    title: "主对话",
    channel: "chat",
    updatedAt: "今天 09:42",
    messages: [
      {
        id: "m1",
        role: "user",
        at: "今天 09:21",
        blocks: [
          {
            kind: "text",
            text: "帮我把本周的进展整理成一份周报，还是按「进展 / 风险 / 下周计划」的结构，控制在 1500 字以内。",
          },
        ],
      },
      {
        id: "m2",
        role: "assistant",
        at: "今天 09:21",
        blocks: [
          {
            kind: "text",
            text: "收到。已交给「整理者」和「核对者」，验收标准是：三段式、1500 字以内、数据与来源可核对。",
          },
          { kind: "task", taskId: "wi-weekly" },
        ],
      },
      {
        id: "m3",
        role: "assistant",
        at: "今天 09:42",
        blocks: [
          {
            kind: "text",
            text: "周报写好了。结构和数据都核对过，两个风险项留给你判断。",
          },
          { kind: "outcome", taskId: "wi-weekly" },
        ],
      },
      {
        id: "m4",
        role: "user",
        at: "今天 09:50",
        blocks: [
          {
            kind: "text",
            text: "再顺手看下竞品，重点比较主动能力和任务编排。",
          },
        ],
      },
      {
        id: "m5",
        role: "assistant",
        at: "今天 09:51",
        blocks: [
          {
            kind: "text",
            text: "收到。已交给「研究员」和「核对者」，验收标准是：覆盖 6 个产品、5 个维度、争议项标来源。",
          },
          { kind: "task", taskId: "wi-competitor" },
        ],
      },
    ],
  },
  {
    id: "conv-bot-life",
    botId: "bot-life",
    title: "主对话",
    channel: "chat",
    updatedAt: "今天 09:20",
    messages: [
      {
        id: "m1",
        role: "user",
        at: "今天 09:05",
        blocks: [
          {
            kind: "text",
            text: "帮我排一下下周的行程。周三下午好像有点挤，你看着调整。",
          },
        ],
      },
      {
        id: "m2",
        role: "assistant",
        at: "今天 09:06",
        blocks: [
          {
            kind: "text",
            text: "收到。已交给「日程助手」，验收标准是：不冲突、保留深度工作块、不直接修改已有日程。",
          },
          { kind: "task", taskId: "wi-schedule" },
        ],
      },
      {
        id: "m3",
        role: "assistant",
        at: "今天 09:20",
        blocks: [
          {
            kind: "text",
            text: "发现一处冲突，先确认这一件事，其余我按你的偏好排。",
          },
          { kind: "attention", taskId: "wi-schedule" },
          {
            kind: "memory",
            memoryId: "m-review",
            quote: "评审安排在工作日的 11:00–16:00",
          },
        ],
      },
      {
        id: "m4",
        role: "user",
        at: "刚才",
        blocks: [
          {
            kind: "text",
            text: "十一月中旬想去京都待三天，帮我排个不赶时间的行程。我喜欢步行能到、安静一点的地方。",
          },
        ],
      },
      {
        id: "m5",
        role: "assistant",
        at: "刚才",
        blocks: [
          {
            kind: "text",
            text: "收到。已交给「研究员」，验收标准是：三日步行路线、安静不赶景点、不预订不付款。",
          },
          { kind: "task", taskId: "wi-trip" },
          { kind: "memory", memoryId: "m-travel", quote: "旅行偏好步行可达、安静、有本地小店" },
        ],
      },
    ],
  },
  {
    id: "conv-bot-code",
    botId: "bot-code",
    title: "主对话",
    channel: "chat",
    updatedAt: "今天 10:20",
    messages: [
      {
        id: "m1",
        role: "user",
        at: "今天 10:02",
        blocks: [
          {
            kind: "text",
            text: "登录模块太乱了，帮我重构一下，保持 API 兼容，顺便把测试补上。",
          },
        ],
      },
      {
        id: "m2",
        role: "assistant",
        at: "今天 10:02",
        blocks: [
          {
            kind: "text",
            text: "收到。已交给 opencode 和 Claude Code，验收标准是：保持 API 兼容、登录流程测试通过、diff 可审阅。",
          },
          { kind: "task", taskId: "wi-refactor" },
        ],
      },
      {
        id: "m3",
        role: "user",
        at: "今天 09:40",
        blocks: [
          {
            kind: "text",
            text: "另外把 web 端测试补齐，覆盖率过 80% 就行。",
          },
        ],
      },
      {
        id: "m4",
        role: "assistant",
        at: "今天 09:40",
        blocks: [
          {
            kind: "text",
            text: "收到。已交给 Codex，验收标准是：覆盖率 > 80%、不改变业务行为、报告附失败项。",
          },
          { kind: "task", taskId: "wi-tests" },
        ],
      },
      {
        id: "m5",
        role: "assistant",
        at: "今天 10:20",
        blocks: [
          {
            kind: "text",
            text: "测试补齐了，覆盖率 84%。端到端回归还没跑，先给你确认。",
          },
          { kind: "outcome", taskId: "wi-tests" },
        ],
      },
    ],
  },
];

export function getConversation(id: string): Conversation | undefined {
  return CONVERSATIONS.find((conversation) => conversation.id === id);
}

export function conversationForBot(botId: string): Conversation | undefined {
  return CONVERSATIONS.find((conversation) => conversation.botId === botId);
}
