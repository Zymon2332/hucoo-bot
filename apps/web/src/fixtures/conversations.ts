import type { Conversation } from "./types";

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c-weekly",
    title: "整理本周产品周报",
    updatedAt: "今天 09:42",
    taskId: "t-weekly",
    focus: "artifacts",
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
          { kind: "plan", taskId: "t-weekly" },
        ],
      },
      {
        id: "m3",
        role: "assistant",
        at: "今天 09:42",
        blocks: [
          {
            kind: "result",
            taskId: "t-weekly",
            summary: "周报写好了，共 1,240 字。我保留了 3 个需要你判断的风险项。",
          },
          { kind: "review", taskId: "t-weekly" },
        ],
      },
    ],
  },
  {
    id: "c-competitor",
    title: "整理 Q4 竞品调研",
    updatedAt: "今天 09:52",
    taskId: "t-competitor",
    focus: "execution",
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
          { kind: "plan", taskId: "t-competitor" },
        ],
      },
    ],
  },
  {
    id: "c-schedule",
    title: "安排下周行程",
    updatedAt: "今天 09:20",
    taskId: "t-schedule",
    focus: "execution",
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
          { kind: "plan", taskId: "t-schedule" },
          { kind: "attention", taskId: "t-schedule" },
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
    id: "c-budget",
    title: "核对季度预算表",
    updatedAt: "昨天 16:05",
    taskId: "t-budget",
    focus: "execution",
    messages: [
      {
        id: "m1",
        role: "user",
        at: "昨天 15:40",
        blocks: [
          {
            kind: "text",
            text: "帮我看下四个团队的季度预算执行率，把异常项标出来。",
          },
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
          { kind: "plan", taskId: "t-budget" },
        ],
      },
      {
        id: "m3",
        role: "assistant",
        at: "昨天 16:05",
        blocks: [
          {
            kind: "error",
            taskId: "t-budget",
            code: "missing_data",
            message: "缺少数据团队 10 月的报销明细，暂时无法计算执行率。",
            retryable: true,
          },
        ],
      },
    ],
  },
  {
    id: "c-inbox",
    title: "清理未读邮件",
    updatedAt: "今天 08:41",
    taskId: "t-inbox",
    focus: "execution",
    messages: [
      {
        id: "m1",
        role: "user",
        at: "今天 08:30",
        blocks: [
          {
            kind: "text",
            text: "早上的未读邮件帮我过一遍，需要今天回复的列出来。",
          },
        ],
      },
      {
        id: "m2",
        role: "assistant",
        at: "今天 08:30",
        blocks: [
          {
            kind: "text",
            text: "我会先分类，再起草需要今天回复的邮件。",
          },
          { kind: "plan", taskId: "t-inbox" },
        ],
      },
      {
        id: "m3",
        role: "assistant",
        at: "今天 08:41",
        blocks: [
          {
            kind: "error",
            taskId: "t-inbox",
            code: "auth_expired",
            message: "邮件连接器的授权过期了，重新连接后可以从断点继续。",
            retryable: false,
          },
        ],
      },
    ],
  },
  {
    id: "c-proactive",
    title: "早间简报",
    updatedAt: "今天 08:30",
    focus: "execution",
    messages: [
      {
        id: "m1",
        role: "assistant",
        at: "今天 08:30",
        blocks: [
          {
            kind: "text",
            text: "早上好。按照「早间简报」规则，我整理好了今天的内容，但当前是观察模式，所以先放在这里给你看。",
          },
          { kind: "candidate", candidateId: "cand-morning" },
          {
            kind: "memory",
            memoryId: "m-morning",
            quote: "工作日早上 9 点前希望看到当天日程",
          },
        ],
      },
    ],
  },
  {
    id: "c-chat",
    title: "怎么跟设计团队解释这次改版",
    updatedAt: "昨天 18:20",
    focus: "memory",
    messages: [
      {
        id: "m1",
        role: "user",
        at: "昨天 18:18",
        blocks: [
          {
            kind: "text",
            text: "明天要跟设计团队解释为什么把工作台改成对话式，帮我组织一下说法。",
          },
        ],
      },
      {
        id: "m2",
        role: "assistant",
        at: "昨天 18:20",
        blocks: [
          {
            kind: "text",
            text: "可以从三个角度讲，而且不否定之前的工作：\n\n1. **用户目标变了**：之前是「找工具」，现在是「把事交出去」。工作台假设用户知道该用哪个功能，个人助理不需要这个前提。\n2. **注意力是稀缺的**：工作台把所有状态都摊开，助理只在需要你的时候出现。这不是少做，而是把复杂度收进系统。\n3. **能力没有减少**：任务编排、产物、记忆都还在，只是从「多个页面」变成「一个主舞台 + 检查器」。\n\n如果团队担心可发现性，可以说：入口变少了，但每个入口都更强；短期用 ⌘K 和状态画廊补足探索。\n\n需要我把它整理成一页文档吗？",
          },
        ],
      },
      {
        id: "m3",
        role: "user",
        at: "昨天 18:21",
        blocks: [{ kind: "text", text: "先不用，这样就行。" }],
      },
    ],
  },
];

export function getConversation(id: string): Conversation | undefined {
  return CONVERSATIONS.find((conversation) => conversation.id === id);
}
