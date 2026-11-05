/**
 * Display-only mappings. The backend owns these values; the UI only
 * translates them and always falls back to the raw value for unknown ones.
 */

import type {
  ArtifactKind,
  ArtifactStatus,
  MemoryCategory,
  ReportKind,
  ReviewStatus,
  StepStatus,
  SubAgentStatus,
  Tone,
} from "@/fixtures/types";

const STAGE_LABEL: Record<string, string> = {
  queued: "排队中",
  working: "执行中",
  awaiting_answer: "等待你回答",
  awaiting_review: "等待你确认",
  blocked: "受阻",
  failed: "失败",
  waiting: "等待触发",
  done: "完成",
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
  working: "正在执行，不需要你",
  awaiting_answer: "等你回答一个问题",
  awaiting_review: "等你确认结果",
  blocked: "需要你补充信息",
  failed: "需要你重试或修复连接",
  waiting: "等待下一次触发",
  done: "已完成",
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

const SUBAGENT_LABEL: Record<string, string> = {
  idle: "空闲",
  running: "执行中",
  done: "完成",
  failed: "失败",
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
  STAGE_WAITING_FOR[value] ?? value;
export const reportLabel = (value: string) => labelFor(REPORT_LABEL, value);
export const stepLabel = (value: string) => labelFor(STEP_LABEL, value);
export const subAgentLabel = (value: string) => labelFor(SUBAGENT_LABEL, value);
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

export const SUBAGENT_STATES: SubAgentStatus[] = [
  "idle",
  "running",
  "done",
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
