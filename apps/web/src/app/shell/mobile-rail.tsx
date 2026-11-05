import { Link } from "@tanstack/react-router";
import { GearSix, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@hucoo/ui/components/sheet";
import { Button } from "@hucoo/ui/components/button";
import { BOTS, conversationForBot, workItemsForBot } from "@/fixtures";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { needsHuman, projectWorkItem } from "@/lib/work-state";
import { BotAvatar } from "@/components/bot-avatar";

export function MobileRail() {
  const open = useUiStore((state) => state.mobileRailOpen);
  const setOpen = useUiStore((state) => state.setMobileRailOpen);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const answers = useDemoStore((state) => state.answers);
  const reviews = useDemoStore((state) => state.reviews);
  const stopped = useDemoStore((state) => state.stopped);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-[300px] gap-0 p-0">
        <SheetHeader className="border-b border-border/70 px-4 py-3">
          <SheetTitle className="text-[14px]">Bots</SheetTitle>
        </SheetHeader>

        <div className="space-y-1 p-3">
          <Button asChild className="h-9 w-full justify-start gap-2">
            <Link to="/onboarding" onClick={() => setOpen(false)}>
              <Plus size={15} weight="bold" />
              新建 bot
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setOpen(false);
              setCommandOpen(true);
            }}
            className="h-9 w-full justify-start gap-2 font-normal text-muted-foreground"
          >
            <MagnifyingGlass size={15} />
            搜索
          </Button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
          <ul className="space-y-1">
            {BOTS.map((bot) => {
              const pending = workItemsForBot(bot.id)
                .map((item) =>
                  projectWorkItem(item, { answers, reviews, stopped }),
                )
                .some((item) => needsHuman(item));
              const conversation = conversationForBot(bot.id);
              const last = conversation?.messages[conversation.messages.length - 1];
              const lastText = last?.blocks.find((block) => block.kind === "text");
              return (
                <li key={bot.id}>
                  <Link
                    to="/b/$botId"
                    params={{ botId: bot.id }}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-2 rounded-[9px] px-2 py-2 transition-colors hover:bg-secondary"
                  >
                    <BotAvatar bot={bot} size="md" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[12.5px] font-medium">
                          {bot.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {bot.role}
                        </span>
                        {pending && (
                          <span className="ml-auto size-1.5 rounded-full bg-clay" />
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                        {lastText?.kind === "text"
                          ? lastText.text
                          : bot.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border/70 p-3">
          <Button asChild variant="ghost" className="w-full justify-start gap-2 font-normal">
            <Link to="/settings" onClick={() => setOpen(false)}>
              <GearSix size={15} />
              设置
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
