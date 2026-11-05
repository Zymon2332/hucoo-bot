import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useUiStore } from "@/stores/ui-store";
import { UserMenu } from "@/features/menu/user-menu";

beforeEach(() => {
  useUiStore.setState({ activeModal: null });
});

afterEach(() => {
  cleanup();
});

describe("user menu", () => {
  it("opens the four app modals", async () => {
    const user = userEvent.setup();
    render(<UserMenu />);

    await user.click(screen.getByRole("button", { name: /用户菜单/ }));
    expect(screen.getByText("设置")).toBeInTheDocument();
    expect(screen.getByText("技能")).toBeInTheDocument();
    expect(screen.getByText("产物")).toBeInTheDocument();
    expect(screen.getByText("应用")).toBeInTheDocument();

    await user.click(screen.getByText("设置"));
    expect(useUiStore.getState().activeModal).toBe("settings");
  });
});
