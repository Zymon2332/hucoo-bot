import { describe, expect, it } from "vitest";
import { getWorkItem } from "@/fixtures";
import {
  canBatchReview,
  needsHuman,
  projectWorkItem,
} from "@/lib/work-state";

const empty = { answers: {}, reviews: {}, stopped: {} };

describe("work item projection", () => {
  it("keeps the fixture state when there are no demo actions", () => {
    const item = getWorkItem("wi-weekly")!;
    expect(projectWorkItem(item, empty)).toBe(item);
    expect(needsHuman(item)).toBe(true);
  });

  it("moves an answered work item back to working", () => {
    const item = getWorkItem("wi-schedule")!;
    const projected = projectWorkItem(item, {
      ...empty,
      answers: { "at-schedule": "保留评审" },
    });
    expect(projected.stage).toBe("working");
    expect(projected.waitingOn).toBe("agent");
    expect(projected.attention?.status).toBe("answered");
  });

  it("closes a work item when its review is accepted", () => {
    const item = getWorkItem("wi-weekly")!;
    const projected = projectWorkItem(item, {
      ...empty,
      reviews: { "rv-weekly": "accepted" },
    });
    expect(projected.stage).toBe("done");
    expect(projected.waitingOn).toBe("none");
    expect(needsHuman(projected)).toBe(false);
  });

  it("keeps revision requests in progress", () => {
    const item = getWorkItem("wi-pricing")!;
    const projected = projectWorkItem(item, {
      ...empty,
      reviews: { "rv-pricing": "revision_requested" },
    });
    expect(projected.stage).toBe("working");
    expect(projected.waitingOn).toBe("agent");
  });

  it("records a stop reason", () => {
    const item = getWorkItem("wi-budget")!;
    const projected = projectWorkItem(item, {
      ...empty,
      stopped: { "wi-budget": "先不做了" },
    });
    expect(projected.stage).toBe("done");
    expect(projected.authority.stopReason).toBe("先不做了");
  });

  it("only allows batching reversible reviews", () => {
    expect(canBatchReview(getWorkItem("wi-weekly")!)).toBe(true);
    expect(canBatchReview(getWorkItem("wi-pricing")!)).toBe(true);
    expect(canBatchReview(getWorkItem("wi-contract")!)).toBe(false);
    expect(canBatchReview(getWorkItem("wi-budget")!)).toBe(false);
  });
});
