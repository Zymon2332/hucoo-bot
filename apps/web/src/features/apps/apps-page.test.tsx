import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { AppsPage } from "@/features/apps/apps-page";

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

describe("apps page", () => {
  it("shows external apps and agents", () => {
    render(<AppsPage />);

    expect(screen.getByText("外部应用")).toBeInTheDocument();
    expect(screen.getByText("Agents")).toBeInTheDocument();
    expect(screen.getByText("Figma")).toBeInTheDocument();
    expect(screen.getByText("opencode")).toBeInTheDocument();
    expect(screen.getByText("Claude Code")).toBeInTheDocument();
  });

  it("connects and disconnects an app", async () => {
    const user = userEvent.setup();
    render(<AppsPage />);

    const mail = screen.getByText("邮件").closest('[data-slot="card"]');
    expect(mail).not.toBeNull();
    const connect = screen
      .getAllByRole("button", { name: /^连接$/ })
      .find((button) => mail?.contains(button));
    expect(connect).toBeDefined();
    await user.click(connect!);
    expect(
      screen.getAllByRole("button", { name: /^断开$/ }).length,
    ).toBeGreaterThan(0);
  });
});
