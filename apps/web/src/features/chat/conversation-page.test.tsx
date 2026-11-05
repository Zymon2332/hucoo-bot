import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDemoStore } from "@/stores/demo-store";
import { ConversationPage } from "@/features/chat/conversation-page";

vi.mock("@/lib/highlighter", () => ({
  useHighlighter: () => null,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
  }: {
    to?: string;
    children?: React.ReactNode;
  }) => <a href={typeof to === "string" ? to : "#"}>{children}</a>,
}));

beforeEach(() => {
  useDemoStore.getState().reset();
});

afterEach(() => {
  cleanup();
});

describe("conversation page", () => {
  it("renders a missing conversation state", () => {
    render(<ConversationPage conversationId="does-not-exist" />);
    expect(screen.getByText("会话不存在或已删除")).toBeInTheDocument();
  });

  it("renders a task with an attention card and answers it", async () => {
    const user = userEvent.setup();
    render(<ConversationPage conversationId="c-schedule" />);

    expect(screen.getByText("帮我排一下下周的行程。周三下午好像有点挤，你看着调整。")).toBeInTheDocument();
    expect(screen.getByText("需要你决定")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /保留牙医/ }));
    await user.click(screen.getByRole("button", { name: "回答" }));

    expect(screen.getByText("已回答")).toBeInTheDocument();
  });

  it("renders a result and review block", () => {
    render(<ConversationPage conversationId="c-weekly" />);

    expect(screen.getByText("结果")).toBeInTheDocument();
    expect(screen.getByText("审阅")).toBeInTheDocument();
    expect(screen.getAllByText("本周产品周报").length).toBeGreaterThan(0);
  });

  it("renders an error block for a blocked task", () => {
    render(<ConversationPage conversationId="c-budget" />);

    expect(screen.getByText("无法继续")).toBeInTheDocument();
    expect(screen.getByText("missing_data")).toBeInTheDocument();
  });
});
