import type { AttentionMetric, PortfolioLane } from "./types";

export const METRICS: AttentionMetric[] = [
  {
    workItemId: "wi-weekly",
    decisions: 1,
    humanMinutes: 2,
    timeToDecision: "就绪后 0 分钟",
    interrupted: true,
  },
  {
    workItemId: "wi-competitor",
    decisions: 1,
    humanMinutes: 1,
    timeToDecision: "未到决策点",
    interrupted: false,
  },
  {
    workItemId: "wi-schedule",
    decisions: 1,
    humanMinutes: 1,
    timeToDecision: "等待中",
    interrupted: true,
  },
  {
    workItemId: "wi-budget",
    decisions: 0,
    humanMinutes: 0,
    timeToDecision: "受阻 14 小时",
    interrupted: true,
  },
  {
    workItemId: "wi-inbox",
    decisions: 0,
    humanMinutes: 0,
    timeToDecision: "失败 1 小时",
    interrupted: true,
  },
  {
    workItemId: "wi-pricing",
    decisions: 0,
    humanMinutes: 0,
    timeToDecision: "就绪后 16 小时",
    interrupted: true,
  },
  {
    workItemId: "wi-contract",
    decisions: 0,
    humanMinutes: 0,
    timeToDecision: "就绪后 18 小时",
    interrupted: true,
  },
];

export const PORTFOLIO_LANES: PortfolioLane[] = [
  {
    id: "lane-human",
    label: "等你",
    waitingOn: "human",
    workItemIds: ["wi-schedule", "wi-weekly", "wi-budget", "wi-inbox", "wi-pricing", "wi-contract"],
  },
  {
    id: "lane-agent",
    label: "等 Agent",
    waitingOn: "agent",
    workItemIds: ["wi-competitor", "wi-trip"],
  },
  {
    id: "lane-trigger",
    label: "等触发",
    waitingOn: "trigger",
    workItemIds: ["wi-design"],
  },
  {
    id: "lane-done",
    label: "已结束",
    waitingOn: "none",
    workItemIds: ["wi-weekend"],
  },
];
