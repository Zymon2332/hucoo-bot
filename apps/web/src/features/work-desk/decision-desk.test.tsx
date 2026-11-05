import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { useDemoStore } from "@/stores/demo-store";
import { DecisionDesk } from "@/features/work-desk/decision-desk";

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

beforeEach(() => {
  useDemoStore.getState().reset();
});

afterEach(() => {
  cleanup();
});

describe("decision desk", () => {
  it("shows the attention queue and the portfolio", async () => {
    const user = userEvent.setup();
    render(<DecisionDesk />);

    expect(screen.getByText("6 件事需要你。其余的，我继续推进。")).toBeInTheDocument();
    expect(screen.getByText("本周产品周报")).toBeInTheDocument();
    expect(screen.getByText("核对供应商合同")).toBeInTheDocument();
    expect(screen.getByText("安排下周行程")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /正在推进/ }));
    expect(screen.getByText("Q4 竞品调研")).toBeInTheDocument();
    expect(screen.getByText("跟进设计系统文档")).toBeInTheDocument();
  });

  it("batches reversible reviews only", async () => {
    const user = userEvent.setup();
    render(<DecisionDesk />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);

    await user.click(checkboxes[0]!);
    expect(screen.getByText("已选 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /接受所选/ }));
    expect(useDemoStore.getState().reviews["rv-weekly"]).toBe("accepted");
    expect(screen.getByText("5 件事需要你。其余的，我继续推进。")).toBeInTheDocument();
  });

  it("renders observe records collapsed", async () => {
    const user = userEvent.setup();
    render(<DecisionDesk />);

    expect(screen.queryByText("今天的早间简报已经准备好")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /观察记录/ }));
    expect(screen.getByText("今天的早间简报已经准备好")).toBeInTheDocument();
  });
});
