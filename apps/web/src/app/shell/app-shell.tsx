import { useEffect } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { TooltipProvider } from "@hucoo/ui/components/tooltip";
import { getBot } from "@/fixtures";
import { useUiStore } from "@/stores/ui-store";
import { BotRail } from "./bot-rail";
import { TopBar } from "./top-bar";
import { MobileRail } from "./mobile-rail";
import { BellDrawer } from "./bell-drawer";
import { CommandPalette } from "@/features/command/command-palette";
import { AppModals } from "@/features/modals/app-modals";
import { RightPanel } from "@/features/panel/right-panel";
import { ThemedToaster } from "@/components/themed-toaster";

function pageTitle(pathname: string): string {
  if (pathname.startsWith("/settings")) return "设置";
  if (pathname.startsWith("/apps")) return "应用";
  if (pathname.startsWith("/skills")) return "技能";
  if (pathname.startsWith("/assets")) return "产物";
  if (pathname.startsWith("/memory")) return "记忆";
  if (pathname.startsWith("/onboarding")) return "新建 bot";
  if (pathname.startsWith("/artifact/")) return "资产";
  if (pathname.startsWith("/dev/states")) return "状态画廊";
  return "Hucoo";
}

export function AppShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const setActiveModal = useUiStore((state) => state.setActiveModal);

  const botId = pathname.startsWith("/b/") ? pathname.split("/")[2] : undefined;
  const bot = botId ? getBot(botId) : undefined;

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
        setActiveModal("settings");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, setCommandOpen, setActiveModal]);

  return (
    <TooltipProvider>
      <div className="flex h-dvh gap-2 overflow-hidden p-2 sm:p-3">
        <BotRail />

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-border bg-card/70 shadow-[var(--shadow-card)]">
          <TopBar bot={bot} title={pageTitle(pathname)} />
          <main className="min-h-0 flex-1 overflow-hidden">
            <Outlet />
          </main>
        </section>

        <RightPanel botId={botId} />
      </div>

      <MobileRail />
      <BellDrawer />
      <CommandPalette />
      <AppModals />
      <ThemedToaster />
    </TooltipProvider>
  );
}
