/**
 * Rendering fixtures, not the domain model.
 *
 * These shapes exist only so the static prototype can render realistic
 * states. The backend owns the real contract; every field here should be
 * replaceable by a server-provided view model without changing the UI.
 */

export type Tone = "concise" | "warm" | "direct" | "playful";

export interface Profile {
  name: string;
  role: string;
  initials: string;
  accent: string;
  addressAs: string;
  tone: Tone;
  memoryEnabled: boolean;
  proactiveMode: "observe" | "auto";
}

export type WorkTab =
  | "overview"
  | "conversation"
  | "evidence"
  | "execution"
  | "authority";

export type Stage =
  | "queued"
  | "working"
  | "awaiting_answer"
  | "awaiting_review"
  | "blocked"
  | "failed"
  | "waiting"
  | "done";

export type WaitingOn = "human" | "agent" | "external" | "trigger" | "none";

export type Priority = "now" | "today" | "later";

export type ReportKind =
  | "progress"
  | "waiting"
  | "ready"
  | "blocked"
  | "failed"
  | "dropped";

export type StepStatus = "pending" | "running" | "done" | "skipped" | "failed";

export interface PlanStep {
  id: string;
  title: string;
  status: StepStatus;
  agentId?: string;
  note?: string;
}

export interface Report {
  id: string;
  kind: ReportKind;
  summary: string;
  detail?: string;
  at: string;
}

export interface AttentionOption {
  id: string;
  label: string;
  hint?: string;
}

export interface Attention {
  id: string;
  question: string;
  context?: string;
  options: AttentionOption[];
  allowFreeText?: boolean;
  answer?: string;
  status: "open" | "answered";
}

export type ReviewStatus =
  | "pending"
  | "accepted"
  | "revision_requested"
  | "rejected";

export interface Review {
  id: string;
  artifactId: string;
  status: ReviewStatus;
  note?: string;
}

export interface Authority {
  mode: "explicit" | "inferred";
  scope: string;
  rules: string[];
  reversible: boolean;
  grantedBy: string;
  grantedAt: string;
  stopReason?: string;
}

export type AuditKind = "grant" | "decision" | "handoff" | "action" | "verify" | "stop";

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail?: string;
  kind: AuditKind;
}

export interface DecisionRecord {
  id: string;
  at: string;
  question: string;
  answer: string;
  by: "human" | "agent";
  reasoning?: string;
}

export interface Verification {
  summary: string;
  checked: string[];
  unchecked: string[];
  needsHuman: string[];
}

export type AgentKind = "personal" | "subagent" | "code";
export type AgentStatus = "idle" | "running" | "waiting" | "failed" | "done";

export interface AgentRun {
  id: string;
  kind: AgentKind;
  name: string;
  role: string;
  status: AgentStatus;
  summary?: string;
  sessionId?: string;
  repo?: string;
  branch?: string;
  lastHandoff?: string;
  workItemIds: string[];
}

export type EvidenceKind =
  | "artifact"
  | "diff"
  | "source"
  | "session"
  | "log"
  | "test";

export type Verified = "yes" | "partial" | "no";

export interface Evidence {
  id: string;
  kind: EvidenceKind;
  title: string;
  summary: string;
  at: string;
  artifactId?: string;
  agentId?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  diff?: {
    file: string;
    additions: number;
    deletions: number;
    patch: string;
  };
  log?: string[];
  verified: Verified;
}

export interface WorkItem {
  id: string;
  title: string;
  outcome: string;
  stage: Stage;
  waitingOn: WaitingOn;
  priority: Priority;
  due?: string;
  createdAt: string;
  updatedAt: string;
  authority: Authority;
  plan: PlanStep[];
  reports: Report[];
  agentIds: string[];
  evidenceIds: string[];
  conversationIds: string[];
  attention?: Attention;
  review?: Review;
  artifactIds: string[];
  memoryIds: string[];
  verification: Verification;
  decisions: DecisionRecord[];
  audit: AuditEntry[];
}

export type ArtifactKind = "markdown" | "code" | "table" | "html";
export type ArtifactStatus = "draft" | "ready" | "accepted";

export interface Artifact {
  id: string;
  title: string;
  kind: ArtifactKind;
  status: ArtifactStatus;
  summary: string;
  content: string;
  updatedAt: string;
}

export type MemoryCategory =
  | "preference"
  | "about"
  | "project"
  | "relationship"
  | "routine";

export interface Memory {
  id: string;
  category: MemoryCategory;
  content: string;
  source?: string;
  pinned?: boolean;
  suggested?: boolean;
}

export interface Rule {
  id: string;
  name: string;
  instruction: string;
  mode: "observe" | "auto";
  enabled: boolean;
  lastTriggered?: string;
}

export interface Candidate {
  id: string;
  ruleId: string;
  title: string;
  action: string;
  reason: string;
  impact: string;
  reversible: boolean;
  createdAt: string;
  status: "open" | "accepted" | "ignored" | "snoozed";
}

export type Channel = "chat" | "email" | "im" | "note";

export type MessageBlock =
  | { kind: "text"; text: string }
  | { kind: "plan"; workItemId: string }
  | { kind: "outcome"; workItemId: string }
  | { kind: "attention"; workItemId: string }
  | { kind: "error"; workItemId: string; code: string; message: string; retryable: boolean }
  | { kind: "memory"; memoryId: string; quote: string };

export interface Message {
  id: string;
  role: "user" | "assistant";
  at: string;
  blocks: MessageBlock[];
}

export interface Conversation {
  id: string;
  workItemId: string;
  title: string;
  channel: Channel;
  updatedAt: string;
  messages: Message[];
}

export interface SourceStatus {
  id: string;
  name: string;
  kind: "connector" | "rule";
  status: "on" | "paused" | "error";
  lastSync?: string;
  detail?: string;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  kind: "skill" | "connector" | "tool";
  enabled: boolean;
  lastUsed?: string;
}

export interface AttentionMetric {
  workItemId: string;
  decisions: number;
  humanMinutes: number;
  timeToDecision: string;
  interrupted: boolean;
}

export interface PortfolioLane {
  id: string;
  label: string;
  waitingOn: WaitingOn;
  workItemIds: string[];
}
