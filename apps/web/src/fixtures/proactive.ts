import type { Candidate, Rule, SourceStatus } from "./types";

export const SOURCES: SourceStatus[] = [
  {
    id: "src-calendar",
    name: "日历",
    kind: "connector",
    status: "on",
    lastSync: "10 分钟前",
  },
  {
    id: "src-mail",
    name: "邮件",
    kind: "connector",
    status: "error",
    lastSync: "今天 08:41",
    detail: "授权过期",
  },
  {
    id: "src-im",
    name: "消息",
    kind: "connector",
    status: "on",
    lastSync: "刚刚",
  },
  {
    id: "src-notes",
    name: "笔记",
    kind: "connector",
    status: "on",
    lastSync: "昨天",
  },
  {
    id: "src-github",
    name: "GitHub",
    kind: "connector",
    status: "paused",
    lastSync: "昨天",
  },
];

export const RULES: Rule[] = [
  {
    id: "rule-morning",
    name: "早间简报",
    instruction: "工作日早上 8:30，汇总当天日程、未读邮件与三件最重要的事。",
    mode: "observe",
    enabled: true,
    lastTriggered: "今天 08:30",
  },
  {
    id: "rule-design",
    name: "设计系统变更跟进",
    instruction: "每周一检查设计系统文档的更新，只汇总与前端实现相关的变更。",
    mode: "observe",
    enabled: true,
    lastTriggered: "周一 10:00",
  },
  {
    id: "rule-mail",
    name: "重要邮件提醒",
    instruction: "收到来自直属上级或客户的邮件时，先判断是否需要今天回复。",
    mode: "observe",
    enabled: true,
    lastTriggered: "今天 08:41",
  },
  {
    id: "rule-bills",
    name: "账单与续费",
    instruction: "收到账单或自动续费通知时，汇总金额与到期日，提前三天提醒。",
    mode: "auto",
    enabled: false,
  },
];

export const CANDIDATES: Candidate[] = [
  {
    id: "cand-morning",
    ruleId: "rule-morning",
    title: "今天的早间简报已经准备好",
    action: "整理今天的 4 个日程、7 封未读邮件，并列出三件最重要的事。",
    reason: "匹配规则「早间简报」，当前为观察模式，所以只记录、不发送。",
    impact: "只生成一条对话消息，不修改任何外部数据。",
    reversible: true,
    createdAt: "今天 08:30",
    status: "open",
  },
  {
    id: "cand-design",
    ruleId: "rule-design",
    title: "设计系统有 3 条相关变更",
    action: "汇总 3 条与前端实现相关的变更，并标注影响范围。",
    reason: "匹配规则「设计系统变更跟进」，当前为观察模式。",
    impact: "只生成一条汇总，不修改文档。",
    reversible: true,
    createdAt: "周一 10:00",
    status: "open",
  },
];

export function getCandidate(id: string): Candidate | undefined {
  return CANDIDATES.find((candidate) => candidate.id === id);
}

export function getRule(id: string): Rule | undefined {
  return RULES.find((rule) => rule.id === id);
}
