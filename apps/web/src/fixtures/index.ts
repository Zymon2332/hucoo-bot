export * from "./types";
export { PROFILE, ARTIFACTS, CAPABILITIES } from "./artifacts";
export { WORK_ITEMS, getWorkItem, workItemsByStage } from "./work-items";
export { AGENTS, getAgent } from "./agents";
export { EVIDENCE, getEvidence } from "./evidence";
export {
  CONVERSATIONS,
  getConversation,
  conversationsForWorkItem,
} from "./conversations";
export { MEMORIES, getMemory } from "./memories";
export {
  RULES,
  CANDIDATES,
  SOURCES,
  getCandidate,
  getRule,
} from "./proactive";
export { METRICS, PORTFOLIO_LANES } from "./metrics";

import { ARTIFACTS } from "./artifacts";
import type { Artifact } from "./types";

export function getArtifact(id: string): Artifact | undefined {
  return ARTIFACTS.find((artifact) => artifact.id === id);
}
