import { create } from "zustand";
import {
  CANDIDATES,
  MEMORIES,
  PROFILE,
  RULES,
} from "@/fixtures";
import type {
  Candidate,
  Memory,
  MemoryCategory,
  Profile,
  Rule,
} from "@/fixtures/types";

interface DemoState {
  profile: Profile;
  memories: Memory[];
  rules: Rule[];
  candidates: Candidate[];
  answers: Record<string, string>;
  reviews: Record<string, "accepted" | "revision_requested" | "rejected">;
  reviewNotes: Record<string, string>;
  onboardingComplete: boolean;
  updateProfile: (patch: Partial<Profile>) => void;
  answerAttention: (attentionId: string, answer: string) => void;
  resolveReview: (
    reviewId: string,
    decision: "accepted" | "revision_requested" | "rejected",
    note?: string,
  ) => void;
  resolveCandidate: (
    candidateId: string,
    status: "accepted" | "ignored" | "snoozed",
  ) => void;
  toggleRule: (ruleId: string) => void;
  setRuleMode: (ruleId: string, mode: "observe" | "auto") => void;
  updateMemory: (memoryId: string, patch: Partial<Memory>) => void;
  updateMemoryCategory: (memoryId: string, category: MemoryCategory) => void;
  toggleMemoryPin: (memoryId: string) => void;
  removeMemory: (memoryId: string) => void;
  acceptSuggestion: (memoryId: string) => void;
  dismissSuggestion: (memoryId: string) => void;
  completeOnboarding: (patch?: Partial<Profile>) => void;
  reset: () => void;
}

const initial = () => ({
  profile: { ...PROFILE },
  memories: MEMORIES.map((memory) => ({ ...memory })),
  rules: RULES.map((rule) => ({ ...rule })),
  candidates: CANDIDATES.map((candidate) => ({ ...candidate })),
  answers: {} as Record<string, string>,
  reviews: {} as Record<
    string,
    "accepted" | "revision_requested" | "rejected"
  >,
  reviewNotes: {} as Record<string, string>,
  onboardingComplete: false,
});

export const useDemoStore = create<DemoState>((set) => ({
  ...initial(),
  updateProfile: (patch) =>
    set((state) => ({ profile: { ...state.profile, ...patch } })),
  answerAttention: (attentionId, answer) =>
    set((state) => ({ answers: { ...state.answers, [attentionId]: answer } })),
  resolveReview: (reviewId, decision, note) =>
    set((state) => ({
      reviews: { ...state.reviews, [reviewId]: decision },
      reviewNotes: note
        ? { ...state.reviewNotes, [reviewId]: note }
        : state.reviewNotes,
    })),
  resolveCandidate: (candidateId, status) =>
    set((state) => ({
      candidates: state.candidates.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, status } : candidate,
      ),
    })),
  toggleRule: (ruleId) =>
    set((state) => ({
      rules: state.rules.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    })),
  setRuleMode: (ruleId, mode) =>
    set((state) => ({
      rules: state.rules.map((rule) =>
        rule.id === ruleId ? { ...rule, mode } : rule,
      ),
    })),
  updateMemory: (memoryId, patch) =>
    set((state) => ({
      memories: state.memories.map((memory) =>
        memory.id === memoryId ? { ...memory, ...patch } : memory,
      ),
    })),
  updateMemoryCategory: (memoryId, category) =>
    set((state) => ({
      memories: state.memories.map((memory) =>
        memory.id === memoryId ? { ...memory, category } : memory,
      ),
    })),
  toggleMemoryPin: (memoryId) =>
    set((state) => ({
      memories: state.memories.map((memory) =>
        memory.id === memoryId ? { ...memory, pinned: !memory.pinned } : memory,
      ),
    })),
  removeMemory: (memoryId) =>
    set((state) => ({
      memories: state.memories.filter((memory) => memory.id !== memoryId),
    })),
  acceptSuggestion: (memoryId) =>
    set((state) => ({
      memories: state.memories.map((memory) =>
        memory.id === memoryId
          ? { ...memory, suggested: false, source: memory.source ?? "刚刚确认" }
          : memory,
      ),
    })),
  dismissSuggestion: (memoryId) =>
    set((state) => ({
      memories: state.memories.filter((memory) => memory.id !== memoryId),
    })),
  completeOnboarding: (patch) =>
    set((state) => ({
      profile: { ...state.profile, ...patch },
      onboardingComplete: true,
    })),
  reset: () => set(initial()),
}));
