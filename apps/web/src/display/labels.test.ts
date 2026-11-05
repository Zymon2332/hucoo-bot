import { describe, expect, it } from "vitest";
import {
  agentKindLabel,
  agentStatusLabel,
  artifactStatusLabel,
  auditKindLabel,
  authorityModeLabel,
  capabilityKindLabel,
  channelLabel,
  evidenceKindLabel,
  labelFor,
  MEMORY_CATEGORY_LABEL,
  priorityLabel,
  reportLabel,
  reviewStatusLabel,
  stageLabel,
  stageTone,
  stageWaitingFor,
  stepLabel,
  toneLabel,
  verifiedLabel,
  waitingOnLabel,
} from "@/display/labels";

describe("display labels", () => {
  it("maps every known work stage", () => {
    const expected: Record<string, string> = {
      queued: "排队中",
      working: "进行中",
      awaiting_answer: "等你决定",
      awaiting_review: "等你审阅",
      blocked: "受阻",
      failed: "失败",
      waiting: "等待中",
      done: "已完成",
    };

    for (const [value, label] of Object.entries(expected)) {
      expect(stageLabel(value)).toBe(label);
    }
  });

  it("maps waiting-on, priority and verification values", () => {
    expect(waitingOnLabel("human")).toBe("等你");
    expect(waitingOnLabel("agent")).toBe("等 Agent");
    expect(waitingOnLabel("trigger")).toBe("等触发");
    expect(priorityLabel("now")).toBe("现在");
    expect(priorityLabel("later")).toBe("稍后");
    expect(verifiedLabel("yes")).toBe("已验证");
    expect(verifiedLabel("partial")).toBe("部分验证");
    expect(verifiedLabel("no")).toBe("未验证");
  });

  it("falls back to the raw backend value for unknown states", () => {
    expect(stageLabel("archived")).toBe("archived");
    expect(stageWaitingFor("archived")).toBe("archived");
    expect(waitingOnLabel("robot")).toBe("robot");
    expect(reportLabel("queued_elsewhere")).toBe("queued_elsewhere");
    expect(stepLabel("paused")).toBe("paused");
    expect(evidenceKindLabel("spreadsheet")).toBe("spreadsheet");
    expect(agentKindLabel("human")).toBe("human");
    expect(agentStatusLabel("sleeping")).toBe("sleeping");
    expect(verifiedLabel("maybe")).toBe("maybe");
    expect(authorityModeLabel("forced")).toBe("forced");
    expect(auditKindLabel("retry")).toBe("retry");
    expect(channelLabel("sms")).toBe("sms");
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
