import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  CheckCircle,
  Sparkle,
} from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@hucoo/ui/components/sheet";
import { ScrollArea } from "@hucoo/ui/components/scroll-area";
import { Button } from "@hucoo/ui/components/button";
import { BOTS, getBot, workItemsForBot } from "@/fixtures";
import type { WorkItem } from "@/fixtures/types";
import { stageWaitingFor } from "@/display/labels";
import { needsHuman, projectWorkItem } from "@/lib/work-state";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { BotAvatar } from "@/components/bot-avatar";

export function BellDrawer() {
  const open = useUiStore((state) => state.bellOpen);
  const setOpen = useUiStore((state) => state.setBellOpen);
  const openTask = useUiStore((state) => state.openTask);
  const answers = useDemoStore((state) => state.answers);
  const reviews = useDemoStore((state) => state.reviews);
  const stopped = useDemoStore((state) => state.stopped);
  const allCandidates = useDemoStore((state) => state.candidates);
  const candidates = allCandidates.filter(
    (candidate) => candidate.status === "open",
  );
  const resolveCandidate = useDemoStore((state) => state.resolveCandidate);
  const setRuleMode = useDemoStore((state) => state.setRuleMode);
  const navigate = useNavigate();

  const groups = BOTS.map((bot) => {
    const items = workItemsForBot(bot.id)
      .map((item) => projectWorkItem(item, { answers, reviews, stopped }))
      .filter((item) => needsHuman(item));
    return { bot, items };
  }).filter((group) => group.items.length > 0);

  function handleTask(botId: string, task: WorkItem) {
    openTask(task.id);
    setOpen(false);
    void navigate({ to: "/b/$botId", params: { botId } });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-[420px]">
        <SheetHeader className="border-b border-border/70 px-4 py-3">
          <SheetTitle className="flex items-center gap-2 text-[14px]">
            <Bell size={16} />
            通知
          </SheetTitle>
          <SheetDescription className="text-[11px]">
            所有 bot 的通知都在这里。没有需要你的事时，保持安静。
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-5 p-4">
            {groups.length === 0 && (
              <div className="flex items-center gap-2 rounded-[12px] border border-dashed border-border px-3 py-5 text-[11px] text-muted-foreground">
                <CheckCircle size={14} weight="fill" className="text-sage" />
                都处理完了。
              </div>
            )}

            {groups.map(({ bot, items }) => (
              <section key={bot.id}>
                <div className="flex items-center gap-2">
                  <BotAvatar bot={bot} size="sm" />
                  <span className="text-[12px] font-medium">{bot.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {bot.role}
                  </span>
                </div>
                <div className="mt-1.5 space-y-1">
                  {items.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => handleTask(bot.id, task)}
                      className="flex w-full items-start gap-2 rounded-[10px] border border-border bg-card px-2.5 py-2 text-left transition-colors hover:bg-secondary/60"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11.5px] font-medium">
                          {task.title}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-muted-foreground">
                          {stageWaitingFor(task.stage)}
                        </span>
                      </span>
                      <ArrowRight
                        size={11}
                        className="mt-1 shrink-0 text-muted-foreground"
                      />
                    </button>
                  ))}
                </div>
              </section>
            ))}

            {candidates.length > 0 && (
              <section>
                <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
                  观察记录
                </h3>
                <div className="mt-1.5 space-y-1.5">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="rounded-[10px] border border-dashed border-clay/30 bg-accent/20 px-2.5 py-2"
                    >
                      <p className="text-[11px] font-medium">
                        {candidate.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {candidate.impact}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Button
                          type="button"
                          size="xs"
                          onClick={() =>
                            resolveCandidate(candidate.id, "accepted")
                          }
                        >
                          执行一次
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant="ghost"
                          onClick={() =>
                            resolveCandidate(candidate.id, "ignored")
                          }
                          className="text-muted-foreground"
                        >
                          忽略
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant="link"
                          onClick={() => {
                            setRuleMode(candidate.ruleId, "auto");
                            resolveCandidate(candidate.id, "accepted");
                          }}
                          className="ml-auto h-auto px-0 text-[10px]"
                        >
                          总是这样做
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="rounded-[10px] bg-secondary/50 px-3 py-2.5">
              <p className="flex items-center gap-1 text-[10.5px] text-muted-foreground">
                <Sparkle size={11} className="text-clay" />
                主动行为默认只观察；在 bot 设置里可以调整。
              </p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
