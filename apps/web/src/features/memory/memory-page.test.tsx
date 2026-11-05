import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  cleanup,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDemoStore } from "@/stores/demo-store";
import { MemoryPage } from "@/features/memory/memory-page";

beforeEach(() => {
  useDemoStore.getState().reset();
});

afterEach(() => {
  cleanup();
});

describe("memory center", () => {
  it("filters by category and search", async () => {
    const user = userEvent.setup();
    render(<MemoryPage />);

    expect(screen.getByText("喜欢简洁、直接的回复，不需要客套和总结段落。")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /偏好/ }));
    expect(screen.getByText("喜欢简洁、直接的回复，不需要客套和总结段落。")).toBeInTheDocument();
    expect(
      screen.queryByText("负责产品设计，同时参与前端实现，经常需要在设计与代码之间切换。"),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /全部/ }));
    await user.clear(screen.getByPlaceholderText("搜索记忆内容"));
    await user.type(screen.getByPlaceholderText("搜索记忆内容"), "牙医");
    expect(screen.getByText("牙医预约每三个月一次，通常安排在周三下午。")).toBeInTheDocument();
    expect(
      screen.queryByText("喜欢简洁、直接的回复，不需要客套和总结段落。"),
    ).not.toBeInTheDocument();
  });

  it("toggles memory globally", async () => {
    const user = userEvent.setup();
    render(<MemoryPage />);

    await user.click(screen.getByRole("switch", { name: "记忆开关" }));
    expect(screen.getByText("记忆已关闭")).toBeInTheDocument();
    expect(useDemoStore.getState().profile.memoryEnabled).toBe(false);
  });

  it("accepts a suggested memory", async () => {
    const user = userEvent.setup();
    render(<MemoryPage />);

    const accepts = screen.getAllByRole("button", { name: /记住/ });
    expect(accepts.length).toBe(2);
    await user.click(accepts[0]!);

    expect(screen.getAllByRole("button", { name: /记住/ }).length).toBe(1);
    expect(
      useDemoStore.getState().memories.filter((memory) => memory.suggested),
    ).toHaveLength(1);
  });

  it("edits a memory in a dialog", async () => {
    const user = userEvent.setup();
    render(<MemoryPage />);

    const editButtons = screen.getAllByRole("button", { name: "编辑" });
    await user.click(editButtons[0]!);

    const dialog = screen.getByRole("dialog");
    const textarea = within(dialog).getByRole("textbox");
    await user.clear(textarea);
    await user.type(textarea, "喜欢非常简洁的回复。");
    await user.click(within(dialog).getByRole("button", { name: "保存" }));

    expect(screen.getByText("喜欢非常简洁的回复。")).toBeInTheDocument();
    expect(useDemoStore.getState().memories[0]?.content).toBe(
      "喜欢非常简洁的回复。",
    );
  });
});
