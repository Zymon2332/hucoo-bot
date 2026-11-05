import type { Conversation } from "./types";

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-weekly-chat",
    workItemId: "wi-weekly",
    title: "对话",
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
            text: "好，我会从会议纪要和任务记录里整理，核对完数据后把草稿给你。",
          },
          { kind: "plan", workItemId: "wi-weekly" },
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
          { kind: "outcome", workItemId: "wi-weekly" },
        ],
      },
    ],
  },
  {
    id: "conv-weekly-email",
    workItemId: "wi-weekly",
    title: "邮件草稿",
    channel: "email",
    updatedAt: "今天 09:38",
    messages: [
      {
        id: "m1",
        role: "assistant",
        at: "今天 09:38",
        blocks: [
          {
            kind: "text",
            text: "邮件草稿已准备好，收件人是产品与设计团队。等你确认周报后再发送，不会自动发出。",
          },
          { kind: "memory", memoryId: "m-writing", quote: "周报偏好三段式，1500 字以内" },
        ],
      },
    ],
  },
  {
    id: "conv-competitor",
    workItemId: "wi-competitor",
    title: "对话",
    channel: "chat",
    updatedAt: "今天 09:52",
    messages: [
      {
        id: "m1",
        role: "user",
        at: "今天 09:30",
        blocks: [
          {
            kind: "text",
            text: "帮我对比一下 Grok、DeepSeek Superagent、ChatGPT、Claude 这几个个人助理产品，重点看主动能力、记忆和任务编排。",
          },
        ],
      },
      {
        id: "m2",
        role: "assistant",
        at: "今天 09:31",
        blocks: [
          {
            kind: "text",
            text: "我会先确定 6 个竞品和 5 个维度，再分头收集资料。资料互相矛盾的地方会单独标出来。",
          },
          { kind: "plan", workItemId: "wi-competitor" },
        ],
      },
    ],
  },
  {
    id: "conv-schedule",
    workItemId: "wi-schedule",
    title: "对话",
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
            text: "我读了下周的日历，周三 14:00 的评审和 15:00 的牙医预约冲突了。先确认这一件事，其余我按你的偏好排。",
          },
          { kind: "plan", workItemId: "wi-schedule" },
          { kind: "attention", workItemId: "wi-schedule" },
          {
            kind: "memory",
            memoryId: "m-review",
            quote: "评审安排在工作日的 11:00–16:00",
          },
        ],
      },
    ],
  },
  {
    id: "conv-budget",
    workItemId: "wi-budget",
    title: "对话",
    channel: "chat",
    updatedAt: "昨天 16:05",
    messages: [
      {
        id: "m1",
        role: "user",
        at: "昨天 15:40",
        blocks: [
          { kind: "text", text: "帮我看下四个团队的季度预算执行率，把异常项标出来。" },
        ],
      },
      {
        id: "m2",
        role: "assistant",
        at: "昨天 15:41",
        blocks: [
          {
            kind: "text",
            text: "好，我会按团队汇总预算和报销数据，执行率偏离 15% 以上的标红。",
          },
          { kind: "plan", workItemId: "wi-budget" },
        ],
      },
      {
        id: "m3",
        role: "assistant",
        at: "昨天 16:05",
        blocks: [
          {
            kind: "error",
            workItemId: "wi-budget",
            code: "missing_data",
            message: "缺少数据团队 10 月的报销明细，暂时无法计算执行率。",
            retryable: true,
          },
        ],
      },
    ],
  },
  {
    id: "conv-inbox",
    workItemId: "wi-inbox",
    title: "对话",
    channel: "chat",
    updatedAt: "今天 08:41",
    messages: [
      {
        id: "m1",
        role: "user",
        at: "今天 08:30",
        blocks: [
          { kind: "text", text: "早上的未读邮件帮我过一遍，需要今天回复的列出来。" },
        ],
      },
      {
        id: "m2",
        role: "assistant",
        at: "今天 08:30",
        blocks: [
          { kind: "text", text: "我会先分类，再起草需要今天回复的邮件。" },
          { kind: "plan", workItemId: "wi-inbox" },
        ],
      },
      {
        id: "m3",
        role: "assistant",
        at: "今天 08:41",
        blocks: [
          {
            kind: "error",
            workItemId: "wi-inbox",
            code: "auth_expired",
            message: "邮件连接器的授权过期了，重新连接后可以从断点继续。",
            retryable: false,
          },
        ],
      },
    ],
  },
  {
    id: "conv-trip",
    workItemId: "wi-trip",
    title: "对话",
    channel: "chat",
    updatedAt: "刚刚",
    messages: [
      {
        id: "m1",
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
        id: "m2",
        role: "assistant",
        at: "刚才",
        blocks: [
          {
            kind: "text",
            text: "好，我会先确认日期与预算，再从你收藏的地点里筛两条步行路线。",
          },
          { kind: "plan", workItemId: "wi-trip" },
          { kind: "memory", memoryId: "m-travel", quote: "旅行偏好步行可达、安静、有本地小店" },
        ],
      },
    ],
  },
  {
    id: "conv-design",
    workItemId: "wi-design",
    title: "对话",
    channel: "chat",
    updatedAt: "周一 10:18",
    messages: [
      {
        id: "m1",
        role: "assistant",
        at: "周一 10:18",
        blocks: [
          {
            kind: "text",
            text: "本周设计系统有 3 条更新与前端实现相关，我已记录。下周同一时间继续检查，不需要你现在处理。",
          },
        ],
      },
    ],
  },
  {
    id: "conv-weekend",
    workItemId: "wi-weekend",
    title: "对话",
    channel: "chat",
    updatedAt: "周六 09:06",
    messages: [
      {
        id: "m1",
        role: "user",
        at: "周六 09:00",
        blocks: [{ kind: "text", text: "周末帮我安排一下，别太赶。" }],
      },
      {
        id: "m2",
        role: "assistant",
        at: "周六 09:06",
        blocks: [
          {
            kind: "text",
            text: "安排好了：两个步行范围内的地点，中间留了足够的空白，不需要预订。",
          },
          { kind: "outcome", workItemId: "wi-weekend" },
        ],
      },
    ],
  },
  {
    id: "conv-pricing",
    workItemId: "wi-pricing",
    title: "对话",
    channel: "chat",
    updatedAt: "昨天 18:12",
    messages: [
      {
        id: "m1",
        role: "user",
        at: "昨天 17:30",
        blocks: [
          {
            kind: "text",
            text: "帮我写一页个人助理的发布介绍，暖色编辑风格，先别发布。",
          },
        ],
      },
      {
        id: "m2",
        role: "assistant",
        at: "昨天 17:31",
        blocks: [
          {
            kind: "text",
            text: "好，我先出结构和文案，再让 Claude Code 生成页面草稿。",
          },
          { kind: "plan", workItemId: "wi-pricing" },
        ],
      },
      {
        id: "m3",
        role: "assistant",
        at: "昨天 18:12",
        blocks: [
          { kind: "outcome", workItemId: "wi-pricing" },
        ],
      },
    ],
  },
  {
    id: "conv-contract",
    workItemId: "wi-contract",
    title: "对话",
    channel: "chat",
    updatedAt: "昨天 14:30",
    messages: [
      {
        id: "m1",
        role: "user",
        at: "昨天 14:00",
        blocks: [
          {
            kind: "text",
            text: "帮我把供应商合同的条款过一遍，标出需要我注意的地方。不要改，也不要发出去。",
          },
        ],
      },
      {
        id: "m2",
        role: "assistant",
        at: "昨天 14:01",
        blocks: [
          {
            kind: "text",
            text: "明白：只提取与提示，不修改、不发送。附件里的 SLA 如果不清晰我会单独标出来。",
          },
          { kind: "plan", workItemId: "wi-contract" },
        ],
      },
      {
        id: "m3",
        role: "assistant",
        at: "昨天 14:30",
        blocks: [
          { kind: "outcome", workItemId: "wi-contract" },
        ],
      },
    ],
  },
];

export function getConversation(id: string): Conversation | undefined {
  return CONVERSATIONS.find((conversation) => conversation.id === id);
}

export function conversationsForWorkItem(workItemId: string): Conversation[] {
  return CONVERSATIONS.filter(
    (conversation) => conversation.workItemId === workItemId,
  );
}
