import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  CheckCircle,
  Sparkle,
  WarningCircle,
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
import { CONVERSATIONS, TASKS } from "@/fixtures";
import { stageLabel } from "@/display/labels";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";

function conversationForTask(taskId: string) {
  return CONVERSATIONS.find((conversation) => conversation.taskId === taskId);
}

export function BellDrawer() {
  const open = useUiStore((state) => state.bellOpen);
  const setOpen = useUiStore((state) => state.setBellOpen);
  const allCandidates = useDemoStore((state) => state.candidates);
  const candidates = allCandidates.filter(
    (candidate) => candidate.status === "open",
  );
  const actionable = TASKS.filter((task) =>
    ["awaiting_answer", "awaiting_review", "blocked", "failed"].includes(
      task.stage,
    ),
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full gap-0 p-0 sm:max-w-[400px]"
      >
        <SheetHeader className="border-b border-border/70 px-4 py-3">
          <SheetTitle className="flex items-center gap-2 text-[14px]">
            <Bell size={16} />
            需要你处理
          </SheetTitle>
          <SheetDescription className="text-[11px]">
            只有需要你行动、或结果可用时，小满才会出现在这里。
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-5 p-4">
            <section>
              <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
                等你行动
              </h3>
              <div className="mt-2 space-y-1.5">
                {actionable.map((task) => {
                  const conversation = conversationForTask(task.id);
                  return (
                    <Link
                      key={task.id}
                      to="/c/$conversationId"
                      params={{ conversationId: conversation?.id ?? "" }}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-2 rounded-[12px] border border-border bg-card px-3 py-2.5 transition-colors hover:bg-secondary/60"
                    >
                      <WarningCircle
                        size={15}
                        weight="fill"
                        className="mt-0.5 shrink-0 text-warning"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12.5px] font-medium">
                          {task.title}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-muted-foreground">
                          {stageLabel(task.stage)}
                        </span>
                      </span>
                      <ArrowRight
                        size={13}
                        className="mt-0.5 shrink-0 text-muted-foreground"
                      />
                    </Link>
                  );
                })}

                {actionable.length === 0 && (
                  <div className="flex items-center gap-2 rounded-[12px] border border-dashed border-border px-3 py-4 text-[11px] text-muted-foreground">
                    <CheckCircle size={14} weight="fill" className="text-sage" />
                    都处理完了，没有等你的事。
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
                观察记录
              </h3>
              <div className="mt-2 space-y-1.5">
                {candidates.map((candidate) => (
                  <Link
                    key={candidate.id}
                    to="/c/$conversationId"
                    params={{ conversationId: "c-proactive" }}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-2 rounded-[12px] border border-dashed border-clay/30 bg-accent/25 px-3 py-2.5 transition-colors hover:bg-accent/50"
                  >
                    <Sparkle
                      size={15}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-clay"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12.5px] font-medium">
                        {candidate.title}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">
                        {candidate.createdAt} · 观察模式
                      </span>
                    </span>
                    <ArrowRight
                      size={13}
                      className="mt-0.5 shrink-0 text-clay"
                    />
                  </Link>
                ))}

                {candidates.length === 0 && (
                  <p className="rounded-[12px] border border-dashed border-border px-3 py-4 text-[11px] text-muted-foreground">
                    观察模式下没有新的候选。
                  </p>
                )}
              </div>
            </section>

            <div className="rounded-[12px] bg-secondary/50 px-3 py-2.5">
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                主动行为默认只观察。你可以对单条规则开启自动，小满才会直接执行。
              </p>
              <Button asChild variant="link" size="sm" className="mt-1 h-auto px-0 text-[11px]">
                <Link to="/settings" onClick={() => setOpen(false)}>
                  管理主动规则
                  <ArrowRight size={12} />
                </Link>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
