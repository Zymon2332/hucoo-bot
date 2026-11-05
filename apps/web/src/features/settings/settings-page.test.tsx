import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { useDemoStore } from "@/stores/demo-store";
import { SettingsPage } from "@/features/settings/settings-page";

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
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe("global settings", () => {
  it("shows the default model", () => {
    render(<SettingsPage />);
    expect(screen.getAllByText("模型").length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue("deepseek-v4")).toBeInTheDocument();
    expect(screen.getByDisplayValue("OpenAI Compatible")).toBeInTheDocument();
  });

  it("toggles memory and links to the memory center", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("tab", { name: "记忆" }));
    expect(screen.getByText("已保存的记忆")).toBeInTheDocument();
    await user.click(screen.getByRole("switch", { name: "允许记忆" }));
    expect(useDemoStore.getState().profile.memoryEnabled).toBe(false);
  });

  it("shows usage by bot", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("tab", { name: "用量" }));
    expect(screen.getByText("总 Token")).toBeInTheDocument();
    expect(screen.getAllByText(/小满/).length).toBeGreaterThan(0);
  });

  it("changes the theme and resets demo data", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("tab", { name: "外观" }));
    await user.click(screen.getByRole("button", { name: /暗色/ }));
    expect(localStorage.getItem("hucoo-theme")).toBe("dark");

    await user.click(screen.getByRole("tab", { name: "通用" }));
    await user.click(screen.getByRole("button", { name: /重置演示数据/ }));
    expect(useDemoStore.getState().memories).toHaveLength(10);
  });
});
