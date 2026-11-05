import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useDemoStore } from "@/stores/demo-store";
import { StatesPage } from "@/features/settings/states-page";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
  }: {
    to?: string;
    params?: unknown;
    search?: unknown;
    children?: ReactNode;
  }) => <a href={typeof to === "string" ? to : "#"}>{children}</a>,
  useNavigate: () => vi.fn(),
}));

vi.mock("@/lib/highlighter", () => ({
  useHighlighter: () => null,
}));

beforeEach(() => {
  useDemoStore.getState().reset();
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
      "进行中",
      "等你决定",
      "等你审阅",
      "受阻",
      "失败",
      "等待中",
      "已完成",
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText("archived").length).toBeGreaterThan(0);
  });

  it("renders the work item queue and message blocks", () => {
    render(<StatesPage />);

    expect(screen.getByText("工作项队列")).toBeInTheDocument();
    expect(screen.getByText("工作项 Tab")).toBeInTheDocument();
    expect(screen.getAllByText("结构化提问").length).toBeGreaterThan(0);
    expect(screen.getByText("结果 + 审阅")).toBeInTheDocument();
    expect(screen.getAllByText("需要你决定").length).toBeGreaterThan(0);
  });

  it("renders evidence and attention metrics", () => {
    render(<StatesPage />);

    expect(screen.getAllByText("证据").length).toBeGreaterThan(0);
    expect(screen.getByText("注意力指标")).toBeInTheDocument();
    expect(
      screen.getAllByText("docs/weekly/2026-W45.md").length,
    ).toBeGreaterThan(0);
  });
});
