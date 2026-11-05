import { useEffect } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { TooltipProvider } from "@hucoo/ui/components/tooltip";
import { getWorkItem } from "@/fixtures";
import { useUiStore } from "@/stores/ui-store";
import { WorkRail } from "./work-rail";
import { TopBar } from "./top-bar";
import { MobileRail } from "./mobile-rail";
import { BellDrawer } from "./bell-drawer";
import { CommandPalette } from "@/features/command/command-palette";
import { ThemedToaster } from "@/components/themed-toaster";

export function AppShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);

  const workItemId = pathname.startsWith("/w/") ? pathname.slice(3) : undefined;
  const workItem = workItemId ? getWorkItem(workItemId) : undefined;
  const title = workItem
    ? "工作项"
    : pathname.startsWith("/agents")
      ? "代理"
      : pathname.startsWith("/memory")
        ? "记忆"
        : pathname.startsWith("/settings")
          ? "设置"
          : pathname.startsWith("/onboarding")
            ? "认识你的助理"
            : pathname.startsWith("/artifact/")
              ? "产物"
              : pathname.startsWith("/dev/states")
                ? "状态画廊"
                : "今天";

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (meta && event.key.toLowerCase() === "n") {
        event.preventDefault();
        void navigate({ to: "/" });
      }
      if (meta && event.key === ",") {
        event.preventDefault();
        void navigate({ to: "/settings" });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, setCommandOpen]);

  return (
    <TooltipProvider>
      <div className="flex h-dvh gap-2 overflow-hidden p-2 sm:p-3">
        <WorkRail />

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-border bg-card/70 shadow-[var(--shadow-card)]">
          <TopBar title={title} />
          <main className="min-h-0 flex-1 overflow-hidden">
            <Outlet />
          </main>
        </section>
      </div>

      <MobileRail />
      <BellDrawer />
      <CommandPalette />
      <ThemedToaster />
    </TooltipProvider>
  );
}
