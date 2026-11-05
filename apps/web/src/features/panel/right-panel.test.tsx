import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { RightPanel } from "@/features/panel/right-panel";

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
  useUiStore.setState({
    panelOpen: true,
    panelTab: "tasks",
    selectedTaskId: null,
  });
});

afterEach(() => {
  cleanup();
});

describe("right panel", () => {
  it("lists tasks and opens task detail", async () => {
    const user = userEvent.setup();
    render(<RightPanel botId="bot-work" />);

    expect(screen.getAllByText("本周产品周报").length).toBeGreaterThan(0);
    await user.click(screen.getAllByText("本周产品周报")[0]!);

    expect(screen.getByText("验收标准")).toBeInTheDocument();
    expect(screen.getByText(/数据与来源可核对/)).toBeInTheDocument();
  });

  it("stops a task from the panel detail", async () => {
    const user = userEvent.setup();
    render(<RightPanel botId="bot-work" />);

    await user.click(screen.getAllByText("本周产品周报")[0]!);
    await user.click(screen.getByRole("button", { name: /停止/ }));

    expect(useDemoStore.getState().stopped["wi-weekly"]).toBe("你手动停止");
  });

  it("switches to the computer tab", async () => {
    const user = userEvent.setup();
    render(<RightPanel botId="bot-work" />);

    await user.click(screen.getByRole("button", { name: "电脑" }));
    expect(screen.getByText("容器在线")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "终端" }));
    expect(screen.getByText(/\$ cd \/home\/agent\/workspace/)).toBeInTheDocument();
  });

  it("switches to assets and bot settings", async () => {
    const user = userEvent.setup();
    render(<RightPanel botId="bot-work" />);

    await user.click(screen.getByRole("button", { name: "资产" }));
    expect(screen.getAllByText("本周产品周报").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "设置" }));
    expect(screen.getByText("人格")).toBeInTheDocument();
    expect(screen.getByText("外部应用")).toBeInTheDocument();
  });
});
