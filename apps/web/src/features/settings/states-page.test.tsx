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
  it("renders bots, stages and tasks", () => {
    render(<StatesPage />);

    expect(screen.getByText("状态画廊")).toBeInTheDocument();
    expect(screen.getByText("Bots")).toBeInTheDocument();
    expect(screen.getAllByText("任务").length).toBeGreaterThan(0);
    for (const name of ["小满", "阿禾", "阿码"]) {
      expect(screen.getAllByText(new RegExp(name)).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText("等你审阅").length).toBeGreaterThan(0);
    expect(screen.getAllByText("archived").length).toBeGreaterThan(0);
  });

  it("renders chat blocks and the right panel", () => {
    render(<StatesPage />);

    expect(screen.getByText("对话块")).toBeInTheDocument();
    expect(screen.getByText("任务卡")).toBeInTheDocument();
    expect(screen.getByText("右侧面板")).toBeInTheDocument();
    expect(screen.getByText("电脑")).toBeInTheDocument();
    expect(screen.getByText("桌面 / 终端 / 文件 / 进程")).toBeInTheDocument();
  });

  it("renders evidence, apps, skills and metrics", () => {
    render(<StatesPage />);

    expect(screen.getByText("应用与技能")).toBeInTheDocument();
    expect(screen.getByText("注意力指标")).toBeInTheDocument();
    expect(screen.getAllByText("Claude Code").length).toBeGreaterThan(0);
    expect(screen.getAllByText("长文写作").length).toBeGreaterThan(0);
  });
});
