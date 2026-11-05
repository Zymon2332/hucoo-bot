import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDemoStore } from "@/stores/demo-store";
import { SettingsPage } from "@/features/settings/settings-page";

beforeEach(() => {
  useDemoStore.getState().reset();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe("settings", () => {
  it("switches tabs and updates the proactive mode", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("tab", { name: "主动规则" }));
    expect(screen.getByText("早间简报")).toBeInTheDocument();
    expect(
      screen.getByText("每条规则都有观察与自动两种模式。默认观察：只记录，不执行。"),
    ).toBeInTheDocument();

    const autoButtons = screen.getAllByRole("button", { name: /自动/ });
    await user.click(autoButtons[0]!);
    expect(useDemoStore.getState().profile.proactiveMode).toBe("auto");
  });

  it("toggles a rule and changes its mode", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("tab", { name: "主动规则" }));
    await user.click(screen.getByRole("switch", { name: "账单与续费启用" }));

    const rule = useDemoStore
      .getState()
      .rules.find((item) => item.id === "rule-bills");
    expect(rule?.enabled).toBe(true);
  });

  it("changes the theme", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("tab", { name: "外观" }));
    await user.click(screen.getByRole("button", { name: /暗色/ }));

    expect(localStorage.getItem("hucoo-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("resets demo data", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("tab", { name: "记忆与数据" }));
    await user.click(screen.getByRole("button", { name: /重置演示数据/ }));

    expect(useDemoStore.getState().profile.name).toBe("小满");
    expect(useDemoStore.getState().memories).toHaveLength(10);
  });
});
