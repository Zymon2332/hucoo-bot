import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { AgentsPage } from "@/features/agents/agents-page";

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
}));

afterEach(() => {
  cleanup();
});

describe("agents page", () => {
  it("shows the three layers", () => {
    render(<AgentsPage />);

    expect(screen.getAllByText("个人助理").length).toBeGreaterThan(0);
    expect(screen.getAllByText("子代理").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Code Agents").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Claude Code").length).toBeGreaterThan(0);
    expect(screen.getByText("Codex")).toBeInTheDocument();
  });

  it("links agents to their work items", () => {
    render(<AgentsPage />);
    expect(screen.getAllByText("本周产品周报").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Q4 竞品调研").length).toBeGreaterThan(0);
  });
});
