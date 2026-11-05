import { useMemo } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  GearSix,
  MagnifyingGlass,
  Plus,
  SidebarSimple,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { BOTS, conversationForBot, workItemsForBot } from "@/fixtures";
import type { Bot } from "@/fixtures/types";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { needsHuman, projectWorkItem } from "@/lib/work-state";
import { BotAvatar } from "@/components/bot-avatar";
import { Kbd } from "@/components/primitives";

function hasNotifications(bot: Bot, overrides: Parameters<typeof projectWorkItem>[1]) {
  return workItemsForBot(bot.id)
    .map((item) => projectWorkItem(item, overrides))
    .some((item) => needsHuman(item));
}

export function BotRail() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const activeBotId = pathname.startsWith("/b/") ? pathname.split("/")[2] : undefined;
  const collapsed = useUiStore((state) => state.railCollapsed);
  const toggleRail = useUiStore((state) => state.toggleRail);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const answers = useDemoStore((state) => state.answers);
  const reviews = useDemoStore((state) => state.reviews);
  const stopped = useDemoStore((state) => state.stopped);

  const overrides = useMemo(
    () => ({ answers, reviews, stopped }),
    [answers, reviews, stopped],
  );

  if (collapsed) {
    return (
      <aside className="hidden w-[60px] shrink-0 flex-col items-center gap-2 md:flex">
        {BOTS.map((bot) => {
          const active = bot.id === activeBotId;
          const pending = hasNotifications(bot, overrides);
          return (
            <Link
              key={bot.id}
              to="/b/$botId"
              params={{ botId: bot.id }}
              aria-label={`${bot.initials} ${bot.name}`}
              className={cn(
                "relative rounded-[12px] p-1 transition-colors",
                active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60",
              )}
            >
              <BotAvatar bot={bot} size="md" />
              {pending && (
                <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-clay" />
              )}
            </Link>
          );
        })}
        <Button
          asChild
          variant="ghost"
          size="icon-lg"
          aria-label="新建 bot"
          className="mt-2 text-muted-foreground"
        >
          <Link to="/onboarding">
            <Plus size={17} />
          </Link>
        </Button>
        <div className="mt-auto flex flex-col items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={() => setCommandOpen(true)}
            aria-label="搜索"
            className="text-muted-foreground"
          >
            <MagnifyingGlass size={17} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={toggleRail}
            aria-label="展开 bot 列表"
            className="text-muted-foreground"
          >
            <SidebarSimple size={17} />
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon-lg"
            aria-label="设置"
            className="text-muted-foreground"
          >
            <Link to="/settings">
              <GearSix size={17} />
            </Link>
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden w-[264px] shrink-0 flex-col rounded-[18px] border border-sidebar-border bg-sidebar/80 p-2.5 backdrop-blur md:flex">
      <header className="flex items-center gap-2 px-1 py-1">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-section-label">
            Bots
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleRail}
          aria-label="收起 bot 列表"
          className="text-muted-foreground"
        >
          <SidebarSimple size={15} />
        </Button>
      </header>

      <div className="mt-2">
        <Button
          asChild
          variant="ghost"
          className="h-9 w-full justify-start gap-2 rounded-[9px] px-2 text-[12.5px] font-normal text-muted-foreground"
        >
          <Link to="/onboarding">
            <Plus size={15} />
            新建 bot
          </Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCommandOpen(true)}
          className="h-9 w-full justify-start gap-2 rounded-[9px] px-2 text-[12.5px] font-normal text-muted-foreground"
        >
          <MagnifyingGlass size={15} />
          搜索
          <Kbd>⌘K</Kbd>
        </Button>
      </div>

      <nav className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto">
        {BOTS.map((bot) => {
          const active = bot.id === activeBotId;
          const pending = hasNotifications(bot, overrides);
          const conversation = conversationForBot(bot.id);
          const last = conversation?.messages[conversation.messages.length - 1];
          const lastText = last?.blocks.find((block) => block.kind === "text");
          return (
            <Link
              key={bot.id}
              to="/b/$botId"
              params={{ botId: bot.id }}
              className={cn(
                "flex items-start gap-2.5 rounded-[10px] px-2 py-2 transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <BotAvatar bot={bot} size="md" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-[12.5px] font-medium text-foreground">
                    {bot.name}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {bot.role}
                  </span>
                  {pending && (
                    <span className="ml-auto size-1.5 shrink-0 rounded-full bg-clay" />
                  )}
                </span>
                <span className="mt-0.5 block truncate text-[10.5px] text-muted-foreground">
                  {lastText?.kind === "text" ? lastText.text : bot.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <footer className="mt-2 border-t border-sidebar-border pt-2">
        <Button
          asChild
          variant="ghost"
          className="h-9 w-full justify-start gap-2 rounded-[9px] px-2 text-[12.5px] font-normal text-muted-foreground"
        >
          <Link to="/settings">
            <GearSix size={15} />
            设置
          </Link>
        </Button>
      </footer>
    </aside>
  );
}
