import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { AssetsPage } from "@/features/assets/assets-page";

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

describe("assets page", () => {
  it("filters by kind and search", async () => {
    const user = userEvent.setup();
    render(<AssetsPage embedded />);

    expect(screen.getByPlaceholderText("搜索产物")).toBeInTheDocument();
    expect(screen.getAllByText("本周产品周报").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "表格" }));
    expect(screen.getAllByText("Q4 竞品对比表").length).toBeGreaterThan(0);
    expect(screen.queryByText("本周产品周报")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "全部" }));
    await user.type(screen.getByPlaceholderText("搜索产物"), "测试报告");
    expect(screen.getAllByText("Web 测试报告").length).toBeGreaterThan(0);
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<AssetsPage embedded />);

    await user.type(screen.getByPlaceholderText("搜索产物"), "不存在的产物");
    expect(screen.getByText("没有匹配的产物")).toBeInTheDocument();
  });
});
