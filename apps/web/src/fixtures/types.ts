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

export type InspectorTab =
  | "execution"
  | "memory"
  | "artifacts"
  | "capabilities";

export type Stage =
  | "queued"
  | "working"
  | "awaiting_answer"
  | "awaiting_review"
  | "blocked"
  | "failed"
  | "waiting"
  | "done";

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
  agent?: string;
  note?: string;
}

export type SubAgentStatus = "idle" | "running" | "done" | "failed";

export interface SubAgent {
  id: string;
  name: string;
  role: string;
  status: SubAgentStatus;
  summary?: string;
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

export interface Task {
  id: string;
  title: string;
  goal: string;
  stage: Stage;
  origin: "explicit" | "inferred";
  startedAt: string;
  updatedAt: string;
  plan: PlanStep[];
  subagents: SubAgent[];
  reports: Report[];
  attention?: Attention;
  review?: Review;
  artifactIds: string[];
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
  createdAt: string;
  status: "open" | "accepted" | "ignored" | "snoozed";
}

export type MessageBlock =
  | { kind: "text"; text: string }
  | { kind: "plan"; taskId: string }
  | { kind: "result"; taskId: string; summary: string }
  | { kind: "attention"; taskId: string }
  | { kind: "review"; taskId: string }
  | { kind: "error"; taskId: string; code: string; message: string; retryable: boolean }
  | { kind: "candidate"; candidateId: string }
  | { kind: "memory"; memoryId: string; quote: string };

export interface Message {
  id: string;
  role: "user" | "assistant";
  at: string;
  blocks: MessageBlock[];
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  pinned?: boolean;
  taskId?: string;
  focus?: InspectorTab;
  messages: Message[];
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  kind: "skill" | "connector" | "tool";
  enabled: boolean;
  lastUsed?: string;
}
