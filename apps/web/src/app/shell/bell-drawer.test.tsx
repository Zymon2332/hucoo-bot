import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { BellDrawer } from "@/app/shell/bell-drawer";

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
  useUiStore.setState({ bellOpen: true });
});

afterEach(() => {
  cleanup();
});

describe("global notifications", () => {
  it("groups needs by bot", () => {
    render(<BellDrawer />);

    expect(screen.getByText("通知")).toBeInTheDocument();
    expect(screen.getAllByText("小满").length).toBeGreaterThan(0);
    expect(screen.getAllByText("本周产品周报").length).toBeGreaterThan(0);
    expect(screen.getAllByText("安排下周行程").length).toBeGreaterThan(0);
  });

  it("shows observe records", () => {
    render(<BellDrawer />);
    expect(screen.getByText("观察记录")).toBeInTheDocument();
    expect(screen.getByText("今天的早间简报已经准备好")).toBeInTheDocument();
  });
});
