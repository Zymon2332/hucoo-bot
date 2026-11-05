import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { useDemoStore } from "@/stores/demo-store";
import { StatesPage } from "@/features/settings/states-page";

vi.mock("@/lib/highlighter", () => ({
  useHighlighter: () => null,
}));

beforeEach(() => {
  useDemoStore.getState().reset();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe("state gallery", () => {
  it("renders every stage and the unknown-state fallback", () => {
    render(<StatesPage />);

    expect(screen.getByText("状态画廊")).toBeInTheDocument();
    for (const label of [
      "排队中",
      "执行中",
      "等待你回答",
      "等待你确认",
      "受阻",
      "失败",
      "等待触发",
      "完成",
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText("archived").length).toBeGreaterThan(0);
  });

  it("renders every message block preview", () => {
    render(<StatesPage />);

    expect(screen.getByText("需要你决定")).toBeInTheDocument();
    expect(screen.getByText("观察到一件事")).toBeInTheDocument();
    expect(screen.getByText("无法继续")).toBeInTheDocument();
    expect(screen.getAllByText("审阅").length).toBeGreaterThan(0);
  });

  it("renders the execution inspector for every stage", () => {
    render(<StatesPage />);

    expect(screen.getByText("执行检查器")).toBeInTheDocument();
    expect(screen.getAllByText("计划").length).toBeGreaterThan(5);
    expect(screen.getByText("缺少数据团队 10 月数据，无法继续")).toBeInTheDocument();
  });
});
