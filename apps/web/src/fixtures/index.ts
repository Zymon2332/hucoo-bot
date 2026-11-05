export * from "./types";
export { PROFILE, ARTIFACTS, CAPABILITIES } from "./artifacts";
export { TASKS, getTask } from "./tasks";
export { CONVERSATIONS, getConversation } from "./conversations";
export { MEMORIES, getMemory } from "./memories";
export { RULES, CANDIDATES, getCandidate, getRule } from "./proactive";

import { ARTIFACTS } from "./artifacts";
import type { Artifact } from "./types";

export function getArtifact(id: string): Artifact | undefined {
  return ARTIFACTS.find((artifact) => artifact.id === id);
}
