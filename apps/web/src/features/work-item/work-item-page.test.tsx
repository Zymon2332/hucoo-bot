import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { useDemoStore } from "@/stores/demo-store";
import { WorkItemPage } from "@/features/work-item/work-item-page";

vi.mock("@/lib/highlighter", () => ({
  useHighlighter: () => null,
}));

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

beforeEach(() => {
  useDemoStore.getState().reset();
});

afterEach(() => {
  cleanup();
});

describe("work item page", () => {
  it("renders the overview with verification and evidence", () => {
    render(<WorkItemPage workItemId="wi-weekly" tab="overview" />);

    expect(screen.getAllByText("本周产品周报").length).toBeGreaterThan(0);
    expect(screen.getByText("验证摘要")).toBeInTheDocument();
    expect(screen.getByText("最近证据")).toBeInTheDocument();
    expect(screen.getByText(/风险项的严重程度/)).toBeInTheDocument();
  });

  it("accepts a review from the conversation outcome card", async () => {
    const user = userEvent.setup();
    render(<WorkItemPage workItemId="wi-weekly" tab="conversation" />);

    expect(screen.getByText("结果")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /接受/ }));
    await user.click(screen.getByRole("button", { name: "确认" }));

    expect(useDemoStore.getState().reviews["rv-weekly"]).toBe("accepted");
    expect(screen.getByText("已接受")).toBeInTheDocument();
  });

  it("renders evidence with artifacts and sessions", () => {
    render(<WorkItemPage workItemId="wi-weekly" tab="evidence" />);

    expect(screen.getAllByText("证据").length).toBeGreaterThan(0);
    expect(screen.getByText("4 份已验证")).toBeInTheDocument();
    expect(screen.getByText("Claude Code · session 8f2a")).toBeInTheDocument();
    expect(screen.getAllByText("本周产品周报").length).toBeGreaterThan(0);
  });

  it("renders execution and reports", () => {
    render(<WorkItemPage workItemId="wi-weekly" tab="execution" />);

    expect(screen.getByText("计划")).toBeInTheDocument();
    expect(screen.getAllByText("Agents").length).toBeGreaterThan(0);
    expect(screen.getByText("周报已就绪，等待你确认")).toBeInTheDocument();
  });

  it("stops a work item from the authority tab", async () => {
    const user = userEvent.setup();
    render(<WorkItemPage workItemId="wi-weekly" tab="authority" />);

    expect(screen.getByText("审计记录")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /停止这个工作项/ }));
    await user.click(screen.getByRole("button", { name: "停止" }));

    expect(useDemoStore.getState().stopped["wi-weekly"]).toBe("你手动停止");
  });

  it("renders a missing work item state", () => {
    render(<WorkItemPage workItemId="does-not-exist" tab="overview" />);
    expect(screen.getByText("工作项不存在")).toBeInTheDocument();
  });
});
