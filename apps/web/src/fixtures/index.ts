export * from "./types";
export { PROFILE, ARTIFACTS, CAPABILITIES } from "./artifacts";
export { BOTS, DEFAULT_BOT_ID, getBot } from "./bots";
export { APPS, USAGE, appsForBot, getApp } from "./apps";
export {
  WORK_ITEMS,
  getWorkItem,
  workItemsByStage,
  workItemsForBot,
} from "./work-items";
export { AGENTS, getAgent } from "./agents";
export { EVIDENCE, getEvidence } from "./evidence";
export {
  CONVERSATIONS,
  getConversation,
  conversationForBot,
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
export { SKILLS, skillsForBot } from "./skills";
export {
  CONTAINER,
  TERMINAL_LINES,
  WORKSPACE_FILES,
  PROCESSES,
} from "./computer";

import { ARTIFACTS } from "./artifacts";
import type { Artifact } from "./types";

export function getArtifact(id: string): Artifact | undefined {
  return ARTIFACTS.find((artifact) => artifact.id === id);
}

export function artifactsForBot(botId: string): Artifact[] {
  return ARTIFACTS.filter((artifact) => artifact.botId === botId);
}
