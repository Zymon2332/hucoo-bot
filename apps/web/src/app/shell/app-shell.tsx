import { useEffect } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { TooltipProvider } from "@hucoo/ui/components/tooltip";
import { getConversation, getTask } from "@/fixtures";
import { useUiStore } from "@/stores/ui-store";
import { ConversationRail } from "./conversation-rail";
import { TopBar } from "./top-bar";
import { Inspector } from "./inspector";
import { MobileRail } from "./mobile-rail";
import { BellDrawer } from "./bell-drawer";
import { CommandPalette } from "@/features/command/command-palette";
import { ThemedToaster } from "@/components/themed-toaster";

export function AppShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const inspectorOpen = useUiStore((state) => state.inspectorOpen);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const toggleInspector = useUiStore((state) => state.toggleInspector);

  const conversationId = pathname.startsWith("/c/")
    ? pathname.slice(3)
    : undefined;
  const conversation = conversationId
    ? getConversation(conversationId)
    : undefined;
  const task = conversation?.taskId ? getTask(conversation.taskId) : undefined;
  const pageTitle = pathname.startsWith("/memory")
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
        <ConversationRail />

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-border bg-card/70 shadow-[var(--shadow-card)]">
          <TopBar conversation={conversation} task={task} title={pageTitle} />
          <main className="min-h-0 flex-1 overflow-hidden">
            <Outlet />
          </main>
        </section>

        {inspectorOpen && (
          <>
            <button
              type="button"
              aria-label="关闭检查器"
              onClick={toggleInspector}
              className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[1px] xl:hidden"
            />
            <div className="fixed inset-y-2 right-2 z-40 flex xl:static xl:inset-auto xl:z-auto">
              <Inspector conversation={conversation} />
            </div>
          </>
        )}
      </div>

      <MobileRail />
      <BellDrawer />
      <CommandPalette />
      <ThemedToaster />
    </TooltipProvider>
  );
}
