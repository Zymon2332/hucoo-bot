import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDemoStore } from "@/stores/demo-store";
import { OnboardingPage } from "@/features/onboarding/onboarding-page";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));

beforeEach(() => {
  useDemoStore.getState().reset();
});

afterEach(() => {
  cleanup();
});

describe("onboarding", () => {
  it("walks through the three steps and completes", async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    expect(screen.getByText("先给它起个名字")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /下一步/ }));
    expect(screen.getByText("它该怎么称呼你？")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /下一步/ }));
    expect(screen.getByText("最后，关于边界")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /开始使用/ }));
    expect(useDemoStore.getState().onboardingComplete).toBe(true);
  });

  it("lets the user set a name and tone", async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    const nameInput = screen.getByPlaceholderText("小满");
    await user.clear(nameInput);
    await user.type(nameInput, "阿满");

    await user.click(screen.getByRole("button", { name: /下一步/ }));
    await user.click(screen.getByRole("button", { name: /直接/ }));
    await user.click(screen.getByRole("button", { name: /下一步/ }));
    await user.click(screen.getByRole("button", { name: /开始使用/ }));

    const state = useDemoStore.getState();
    expect(state.profile.name).toBe("阿满");
    expect(state.profile.tone).toBe("direct");
  });
});
