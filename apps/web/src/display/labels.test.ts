import { describe, expect, it } from "vitest";
import {
  artifactStatusLabel,
  capabilityKindLabel,
  labelFor,
  MEMORY_CATEGORY_LABEL,
  reportLabel,
  reviewStatusLabel,
  stageLabel,
  stageTone,
  stageWaitingFor,
  stepLabel,
  subAgentLabel,
  toneLabel,
} from "@/display/labels";

describe("display labels", () => {
  it("maps every known stage", () => {
    const expected: Record<string, string> = {
      queued: "排队中",
      working: "执行中",
      awaiting_answer: "等待你回答",
      awaiting_review: "等待你确认",
      blocked: "受阻",
      failed: "失败",
      waiting: "等待触发",
      done: "完成",
    };

    for (const [value, label] of Object.entries(expected)) {
      expect(stageLabel(value)).toBe(label);
    }
  });

  it("falls back to the raw backend value for unknown states", () => {
    expect(stageLabel("archived")).toBe("archived");
    expect(stageWaitingFor("archived")).toBe("archived");
    expect(reportLabel("queued_elsewhere")).toBe("queued_elsewhere");
    expect(stepLabel("paused")).toBe("paused");
    expect(subAgentLabel("waiting")).toBe("waiting");
    expect(artifactStatusLabel("archived")).toBe("archived");
    expect(reviewStatusLabel("pending_owner")).toBe("pending_owner");
    expect(toneLabel("formal")).toBe("formal");
    expect(capabilityKindLabel("plugin")).toBe("plugin");
    expect(labelFor({}, undefined)).toBe("未知");
  });

  it("gives unknown stages a neutral tone", () => {
    expect(stageTone("archived")).toContain("bg-secondary");
    expect(stageTone("working")).toContain("text-clay");
    expect(stageTone("failed")).toContain("text-destructive");
  });

  it("covers memory categories", () => {
    expect(MEMORY_CATEGORY_LABEL.preference).toBe("偏好");
    expect(MEMORY_CATEGORY_LABEL.about).toBe("关于我");
    expect(MEMORY_CATEGORY_LABEL.project).toBe("项目");
    expect(MEMORY_CATEGORY_LABEL.relationship).toBe("关系");
    expect(MEMORY_CATEGORY_LABEL.routine).toBe("习惯");
  });
});
