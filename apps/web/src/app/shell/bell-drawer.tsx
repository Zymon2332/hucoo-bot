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
import { WORK_ITEMS, getRule } from "@/fixtures";
import type { WorkItem } from "@/fixtures/types";
import { priorityLabel, stageWaitingFor } from "@/display/labels";
import { canBatchReview, needsHuman, projectWorkItem } from "@/lib/work-state";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";

function tabFor(item: WorkItem): "overview" | "conversation" | "evidence" {
  if (item.stage === "awaiting_answer") return "conversation";
  if (item.stage === "awaiting_review") return "conversation";
  return "overview";
}

export function BellDrawer() {
  const open = useUiStore((state) => state.bellOpen);
  const setOpen = useUiStore((state) => state.setBellOpen);
  const answers = useDemoStore((state) => state.answers);
  const reviews = useDemoStore((state) => state.reviews);
  const stopped = useDemoStore((state) => state.stopped);
  const candidates = useDemoStore((state) => state.candidates);
  const resolveCandidate = useDemoStore((state) => state.resolveCandidate);
  const setRuleMode = useDemoStore((state) => state.setRuleMode);
  const batchAccept = useDemoStore((state) => state.batchAccept);

  const items = WORK_ITEMS.map((item) =>
    projectWorkItem(item, { answers, reviews, stopped }),
  );
  const queue = items
    .filter((item) => needsHuman(item))
    .sort((a, b) => {
      const order = { now: 0, today: 1, later: 2 };
      return order[a.priority] - order[b.priority];
    });
  const batchable = queue.filter((item) => canBatchReview(item));
  const openCandidates = candidates.filter(
    (candidate) => candidate.status === "open",
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-[420px]">
        <SheetHeader className="border-b border-border/70 px-4 py-3">
          <SheetTitle className="flex items-center gap-2 text-[14px]">
            <Bell size={16} />
            需要你
            {queue.length > 0 && (
              <span className="rounded-full bg-clay/10 px-1.5 py-0.5 text-[10px] font-medium text-clay">
                {queue.length}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="text-[11px]">
            只有需要你决定、审阅、补充或处理失败时才出现在这里。
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-5 p-4">
            <section>
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
                  队列
                </h3>
                {batchable.length > 1 && (
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      batchAccept(
                        batchable
                          .map((item) => item.review?.id)
                          .filter((id): id is string => Boolean(id)),
                      );
                    }}
                  >
                    接受 {batchable.length} 个可逆结果
                  </Button>
                )}
              </div>

              <div className="mt-2 space-y-1.5">
                {queue.map((item) => (
                  <Link
                    key={item.id}
                    to="/w/$workItemId"
                    params={{ workItemId: item.id }}
                    search={{ tab: tabFor(item) }}
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
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">
                        {priorityLabel(item.priority)} ·{" "}
                        {stageWaitingFor(item.stage)}
                      </span>
                    </span>
                    <ArrowRight
                      size={13}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                    />
                  </Link>
                ))}

                {queue.length === 0 && (
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
                {openCandidates.map((candidate) => {
                  const rule = getRule(candidate.ruleId);
                  return (
                    <div
                      key={candidate.id}
                      className="rounded-[12px] border border-dashed border-clay/30 bg-accent/25 px-3 py-2.5"
                    >
                      <div className="flex items-start gap-2">
                        <Sparkle
                          size={14}
                          weight="fill"
                          className="mt-0.5 shrink-0 text-clay"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-medium">
                            {candidate.title}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {rule?.name ?? "规则"} · {candidate.createdAt} ·{" "}
                            {candidate.reversible ? "可逆" : "不可逆"}
                          </p>
                          <p className="mt-1 text-[10.5px] leading-relaxed text-muted-foreground">
                            {candidate.impact}
                          </p>
                          <div className="mt-2 flex items-center gap-1.5">
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
                      </div>
                    </div>
                  );
                })}

                {openCandidates.length === 0 && (
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
              <Button
                asChild
                variant="link"
                size="sm"
                className="mt-1 h-auto px-0 text-[11px]"
              >
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
