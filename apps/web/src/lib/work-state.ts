import type { WorkItem } from "@/fixtures/types";
import { useDemoStore } from "@/stores/demo-store";

/**
 * Display-only projection of local demo actions onto a work item.
 * The real stage always comes from the backend; this exists so the static
 * prototype does not show contradictory states after a local interaction.
 */
interface DemoOverrides {
  answers: Record<string, string>;
  reviews: Record<string, "accepted" | "revision_requested" | "rejected">;
  stopped: Record<string, string>;
}

export function projectWorkItem(
  item: WorkItem,
  { answers, reviews, stopped }: DemoOverrides,
): WorkItem {
  const stopReason = stopped[item.id];
  if (stopReason) {
    return {
      ...item,
      stage: "done",
      waitingOn: "none",
      authority: { ...item.authority, stopReason },
      audit: [
        ...item.audit,
        {
          id: `stop-${item.id}`,
          at: "刚刚",
          actor: "你",
          action: "停止这个工作项",
          detail: stopReason,
          kind: "stop",
        },
      ],
    };
  }

  const answer = item.attention ? answers[item.attention.id] : undefined;
  if (item.attention && answer) {
    return {
      ...item,
      stage: "working",
      waitingOn: "agent",
      attention: { ...item.attention, status: "answered", answer },
    };
  }

  const review = item.review ? reviews[item.review.id] : undefined;
  if (item.review && (review === "accepted" || review === "rejected")) {
    return {
      ...item,
      stage: "done",
      waitingOn: "none",
      review: { ...item.review, status: review },
    };
  }
  if (item.review && review === "revision_requested") {
    return {
      ...item,
      stage: "working",
      waitingOn: "agent",
      review: { ...item.review, status: review },
    };
  }

  return item;
}

export function useWorkItemView(item: WorkItem): WorkItem {
  const answers = useDemoStore((state) => state.answers);
  const reviews = useDemoStore((state) => state.reviews);
  const stopped = useDemoStore((state) => state.stopped);
  return projectWorkItem(item, { answers, reviews, stopped });
}

export function needsHuman(item: WorkItem): boolean {
  return (
    item.stage === "awaiting_answer" ||
    item.stage === "awaiting_review" ||
    item.stage === "blocked" ||
    item.stage === "failed"
  );
}

export function canBatchReview(item: WorkItem): boolean {
  return Boolean(
    item.review &&
      item.review.status === "pending" &&
      item.authority.reversible &&
      item.stage === "awaiting_review",
  );
}
