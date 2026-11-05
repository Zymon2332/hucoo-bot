import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDemoStore } from "@/stores/demo-store";
import { PlanBlock } from "@/features/chat/blocks/plan-block";
import { ResultBlock } from "@/features/chat/blocks/result-block";
import { AttentionBlock } from "@/features/chat/blocks/attention-block";
import { ReviewBlock } from "@/features/chat/blocks/review-block";
import { ErrorBlock } from "@/features/chat/blocks/error-block";
import { CandidateBlock } from "@/features/chat/blocks/candidate-block";
import { MemoryBlock } from "@/features/chat/blocks/memory-block";

beforeEach(() => {
  useDemoStore.getState().reset();
});

afterEach(() => {
  cleanup();
});

describe("message blocks", () => {
  it("renders a plan with steps and subagents", () => {
    render(<PlanBlock taskId="t-weekend" />);
    expect(
      screen.getByText("根据天气和你的偏好，给出一个不赶时间的周末安排"),
    ).toBeInTheDocument();
    expect(screen.getByText("生成安排")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /在检查器中查看/ })).toBeInTheDocument();
  });

  it("renders a result with its artifact", () => {
    render(
      <ResultBlock taskId="t-weekend" summary="周末安排好了，留了足够的空白。" />,
    );
    expect(screen.getByText("周末安排好了，留了足够的空白。")).toBeInTheDocument();
    expect(screen.getByText("结果")).toBeInTheDocument();
  });

  it("answers a structured question", async () => {
    const user = userEvent.setup();
    render(<AttentionBlock taskId="t-schedule" />);

    expect(screen.getByText("需要你决定")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /保留评审/ }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /保留评审/ }));
    await user.click(screen.getByRole("button", { name: "回答" }));

    expect(screen.getByText("已回答")).toBeInTheDocument();
    expect(
      useDemoStore.getState().answers["at-schedule"],
    ).toBe("保留评审");
  });

  it("accepts a review result", async () => {
    const user = userEvent.setup();
    render(<ReviewBlock taskId="t-weekly" />);

    await user.click(screen.getByRole("button", { name: /接受/ }));
    await user.click(screen.getByRole("button", { name: "确认" }));

    expect(screen.getByText("已接受")).toBeInTheDocument();
    expect(useDemoStore.getState().reviews["rv-weekly"]).toBe("accepted");
  });

  it("shows an error and its details action", () => {
    render(
      <ErrorBlock
        taskId="t-budget"
        code="missing_data"
        message="缺少数据团队 10 月的报销明细。"
        retryable
      />,
    );
    expect(screen.getByText("无法继续")).toBeInTheDocument();
    expect(screen.getByText("missing_data")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /重试/ })).toBeInTheDocument();
  });

  it("resolves an observed candidate", async () => {
    const user = userEvent.setup();
    render(<CandidateBlock candidateId="cand-morning" />);

    expect(screen.getByText("观察到一件事")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /执行一次/ }));

    expect(screen.getByText("已执行")).toBeInTheDocument();
  });

  it("renders an inline memory reference", () => {
    render(<MemoryBlock memoryId="m-tone" quote="你喜欢简洁、直接的回复" />);
    expect(
      screen.getByTitle("喜欢简洁、直接的回复，不需要客套和总结段落。"),
    ).toBeInTheDocument();
  });
});
