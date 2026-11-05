/**
 * Display-only mappings. The backend owns these values; the UI only
 * translates them and always falls back to the raw value for unknown ones.
 */

import type {
  AgentKind,
  AgentStatus,
  ArtifactKind,
  ArtifactStatus,
  AuditKind,
  Channel,
  EvidenceKind,
  MemoryCategory,
  Priority,
  ReportKind,
  ReviewStatus,
  StepStatus,
  Tone,
  Verified,
  WaitingOn,
} from "@/fixtures/types";

const STAGE_LABEL: Record<string, string> = {
  queued: "排队中",
  working: "进行中",
  awaiting_answer: "等你决定",
  awaiting_review: "等你审阅",
  blocked: "受阻",
  failed: "失败",
  waiting: "等待中",
  done: "已完成",
};

const STAGE_TONE: Record<string, string> = {
  queued: "text-muted-foreground bg-secondary",
  working: "text-clay bg-accent",
  awaiting_answer: "text-warning bg-warning/10",
  awaiting_review: "text-warning bg-warning/10",
  blocked: "text-destructive bg-destructive/10",
  failed: "text-destructive bg-destructive/10",
  waiting: "text-sage bg-sage/10",
  done: "text-sage bg-sage/10",
};

const STAGE_WAITING_FOR: Record<string, string> = {
  queued: "排队中，不需要你",
  working: "执行中，不需要你",
  awaiting_answer: "等你做一个决定",
  awaiting_review: "等你确认结果",
  blocked: "需要你补充信息",
  failed: "需要你处理失败",
  waiting: "等待下一次触发",
  done: "已经完成",
};

const WAITING_ON_LABEL: Record<WaitingOn, string> = {
  human: "等你",
  agent: "等 Agent",
  external: "等外部",
  trigger: "等触发",
  none: "无",
};

const PRIORITY_LABEL: Record<Priority, string> = {
  now: "现在",
  today: "今天",
  later: "稍后",
};

const REPORT_LABEL: Record<string, string> = {
  progress: "进展",
  waiting: "等待",
  ready: "就绪",
  blocked: "受阻",
  failed: "失败",
  dropped: "无需处理",
};

const STEP_LABEL: Record<string, string> = {
  pending: "待开始",
  running: "进行中",
  done: "完成",
  skipped: "跳过",
  failed: "失败",
};

const AGENT_KIND_LABEL: Record<AgentKind, string> = {
  personal: "个人助理",
  subagent: "子代理",
  code: "Code Agent",
};

const AGENT_STATUS_LABEL: Record<AgentStatus, string> = {
  idle: "空闲",
  running: "执行中",
  waiting: "等待",
  failed: "失败",
  done: "完成",
};

const EVIDENCE_KIND_LABEL: Record<EvidenceKind, string> = {
  artifact: "产物",
  diff: "变更",
  source: "来源",
  session: "会话",
  log: "日志",
  test: "测试",
};

const VERIFIED_LABEL: Record<Verified, string> = {
  yes: "已验证",
  partial: "部分验证",
  no: "未验证",
};

const AUTHORITY_MODE_LABEL: Record<string, string> = {
  explicit: "明确授权",
  inferred: "规则推断",
};

const AUDIT_KIND_LABEL: Record<AuditKind, string> = {
  grant: "授权",
  decision: "决定",
  handoff: "交接",
  action: "动作",
  verify: "验证",
  stop: "停止",
};

const CHANNEL_LABEL: Record<Channel, string> = {
  chat: "对话",
  email: "邮件",
  im: "消息",
  note: "笔记",
};

export const MEMORY_CATEGORY_LABEL: Record<MemoryCategory, string> = {
  preference: "偏好",
  about: "关于我",
  project: "项目",
  relationship: "关系",
  routine: "习惯",
};

export const ARTIFACT_KIND_LABEL: Record<ArtifactKind, string> = {
  markdown: "文档",
  code: "代码",
  table: "表格",
  html: "网页",
};

const ARTIFACT_STATUS_LABEL: Record<ArtifactStatus, string> = {
  draft: "草稿",
  ready: "待确认",
  accepted: "已确认",
};

const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: "待确认",
  accepted: "已接受",
  revision_requested: "已请求修订",
  rejected: "已拒绝",
};

const TONE_LABEL: Record<Tone, string> = {
  concise: "简洁",
  warm: "温和",
  direct: "直接",
  playful: "轻松",
};

const CAPABILITY_KIND_LABEL: Record<string, string> = {
  skill: "技能",
  connector: "连接器",
  tool: "工具",
};

export function labelFor(
  map: Record<string, string>,
  value: string | undefined,
  fallback = "未知",
): string {
  if (!value) return fallback;
  return map[value] ?? value;
}

export const stageLabel = (value: string) => labelFor(STAGE_LABEL, value);
export const stageTone = (value: string) =>
  STAGE_TONE[value] ?? "text-muted-foreground bg-secondary";
export const stageWaitingFor = (value: string) =>
  labelFor(STAGE_WAITING_FOR, value);
export const waitingOnLabel = (value: string) =>
  labelFor(WAITING_ON_LABEL, value);
export const priorityLabel = (value: string) => labelFor(PRIORITY_LABEL, value);
export const reportLabel = (value: string) => labelFor(REPORT_LABEL, value);
export const stepLabel = (value: string) => labelFor(STEP_LABEL, value);
export const agentKindLabel = (value: string) =>
  labelFor(AGENT_KIND_LABEL, value);
export const agentStatusLabel = (value: string) =>
  labelFor(AGENT_STATUS_LABEL, value);
export const evidenceKindLabel = (value: string) =>
  labelFor(EVIDENCE_KIND_LABEL, value);
export const verifiedLabel = (value: string) => labelFor(VERIFIED_LABEL, value);
export const authorityModeLabel = (value: string) =>
  labelFor(AUTHORITY_MODE_LABEL, value);
export const auditKindLabel = (value: string) => labelFor(AUDIT_KIND_LABEL, value);
export const channelLabel = (value: string) => labelFor(CHANNEL_LABEL, value);
export const artifactStatusLabel = (value: string) =>
  labelFor(ARTIFACT_STATUS_LABEL, value);
export const reviewStatusLabel = (value: string) =>
  labelFor(REVIEW_STATUS_LABEL, value);
export const toneLabel = (value: string) => labelFor(TONE_LABEL, value);
export const capabilityKindLabel = (value: string) =>
  labelFor(CAPABILITY_KIND_LABEL, value);

export const STEP_ORDER: StepStatus[] = [
  "pending",
  "running",
  "done",
  "skipped",
  "failed",
];

export const REPORT_KINDS: ReportKind[] = [
  "progress",
  "waiting",
  "ready",
  "blocked",
  "failed",
  "dropped",
];
