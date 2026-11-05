import { Bell, List, SidebarSimple } from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import { BOTS, workItemsForBot } from "@/fixtures";
import type { Bot } from "@/fixtures/types";
import { needsHuman, projectWorkItem } from "@/lib/work-state";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { BotAvatar } from "@/components/bot-avatar";

export function TopBar({ bot, title }: { bot?: Bot; title?: string }) {
  const answers = useDemoStore((state) => state.answers);
  const reviews = useDemoStore((state) => state.reviews);
  const stopped = useDemoStore((state) => state.stopped);
  const setBellOpen = useUiStore((state) => state.setBellOpen);
  const setMobileRailOpen = useUiStore((state) => state.setMobileRailOpen);
  const panelOpen = useUiStore((state) => state.panelOpen);
  const togglePanel = useUiStore((state) => state.togglePanel);

  const notificationCount = BOTS.flatMap((entry) =>
    workItemsForBot(entry.id).map((item) =>
      projectWorkItem(item, { answers, reviews, stopped }),
    ),
  ).filter((item) => needsHuman(item)).length;

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/70 px-3 sm:px-4">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setMobileRailOpen(true)}
        aria-label="打开 bot 列表"
        className="text-muted-foreground md:hidden"
      >
        <List size={18} />
      </Button>

      {bot ? (
        <div className="flex min-w-0 items-center gap-2">
          <BotAvatar bot={bot} size="sm" status="online" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium leading-tight">
              {bot.name}
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              {bot.role} · 主 Agent 只负责路由
            </p>
          </div>
        </div>
      ) : (
        <h1 className="truncate text-[14px] font-medium">
          {title ?? "Hucoo"}
        </h1>
      )}

      <div className="ml-auto flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setBellOpen(true)}
          aria-label="通知"
          className="relative text-muted-foreground"
        >
          <Bell size={16} />
          {notificationCount > 0 && (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-clay" />
          )}
        </Button>
        <Button
          type="button"
          variant={panelOpen ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={togglePanel}
          aria-label={panelOpen ? "收起右侧面板" : "展开右侧面板"}
          className={panelOpen ? undefined : "text-muted-foreground"}
        >
          <SidebarSimple size={16} className="rotate-180" />
        </Button>
      </div>
    </header>
  );
}
