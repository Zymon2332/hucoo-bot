import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { BotChatPage } from "@/features/chat/bot-chat-page";

vi.mock("@/lib/highlighter", () => ({
  useHighlighter: () => null,
}));

beforeEach(() => {
  useDemoStore.getState().reset();
  useUiStore.setState({
    panelOpen: false,
    panelTab: "tasks",
    selectedTaskId: null,
  });
});

afterEach(() => {
  cleanup();
});

describe("bot chat", () => {
  it("shows immediate acknowledgement and a task card", () => {
    render(<BotChatPage botId="bot-work" />);

    expect(screen.getByText(/收到。已交给「整理者」/)).toBeInTheDocument();
    expect(screen.getAllByText("本周产品周报").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/验收：/).length).toBeGreaterThan(0);
    expect(screen.queryByText("读取下周已有日程")).not.toBeInTheDocument();
  });

  it("opens the task in the right panel when the card is clicked", async () => {
    const user = userEvent.setup();
    render(<BotChatPage botId="bot-work" />);

    const cards = screen.getAllByText("本周产品周报");
    await user.click(cards[0]!);

    expect(useUiStore.getState().selectedTaskId).toBe("wi-weekly");
    expect(useUiStore.getState().panelOpen).toBe(true);
    expect(useUiStore.getState().panelTab).toBe("tasks");
  });

  it("renders the coding bot with its own tasks", () => {
    render(<BotChatPage botId="bot-code" />);
    expect(screen.getAllByText("重构登录模块").length).toBeGreaterThan(0);
    expect(screen.getAllByText("补齐 web 端测试").length).toBeGreaterThan(0);
  });

  it("renders a missing bot state", () => {
    render(<BotChatPage botId="nope" />);
    expect(screen.getByText("Bot 不存在")).toBeInTheDocument();
  });
});
