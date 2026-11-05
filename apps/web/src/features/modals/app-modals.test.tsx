import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useUiStore } from "@/stores/ui-store";
import { AppModals } from "@/features/modals/app-modals";

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
  useUiStore.setState({ activeModal: null });
});

afterEach(() => {
  cleanup();
});

describe("app modals", () => {
  it("opens settings as a dialog", () => {
    useUiStore.setState({ activeModal: "settings" });
    render(<AppModals />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("默认模型")).toBeInTheDocument();
    expect(screen.getByDisplayValue("deepseek-v4")).toBeInTheDocument();
  });

  it("opens apps, skills and assets as dialogs", () => {
    useUiStore.setState({ activeModal: "apps" });
    render(<AppModals />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("外部应用")).toBeInTheDocument();
    cleanup();

    useUiStore.setState({ activeModal: "skills" });
    render(<AppModals />);
    expect(screen.getByText("长文写作")).toBeInTheDocument();
    cleanup();

    useUiStore.setState({ activeModal: "assets" });
    render(<AppModals />);
    expect(screen.getAllByText("本周产品周报").length).toBeGreaterThan(0);
  });
});
