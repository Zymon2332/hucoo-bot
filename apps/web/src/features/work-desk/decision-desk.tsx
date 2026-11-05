import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  CaretDown,
  Eye,
  WarningCircle,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { Checkbox } from "@hucoo/ui/components/checkbox";
import { WORK_ITEMS, getAgent } from "@/fixtures";
import type { WorkItem } from "@/fixtures/types";
import {
  priorityLabel,
  stageLabel,
  stageWaitingFor,
  waitingOnLabel,
} from "@/display/labels";
import { canBatchReview, needsHuman, projectWorkItem } from "@/lib/work-state";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { Composer } from "@/features/chat/composer";
import { AssistantAvatar, StageBadge } from "@/components/primitives";

function tabFor(item: WorkItem): "overview" | "conversation" | "evidence" {
  if (item.stage === "awaiting_answer") return "conversation";
  if (item.stage === "awaiting_review") return "conversation";
  return "overview";
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了";
  if (hour < 12) return "早上好";
  if (hour < 18) return "下午好";
  return "晚上好";
}

export function DecisionDesk() {
  const profile = useDemoStore((state) => state.profile);
  const answers = useDemoStore((state) => state.answers);
  const reviews = useDemoStore((state) => state.reviews);
  const stopped = useDemoStore((state) => state.stopped);
  const candidates = useDemoStore((state) => state.candidates);
  const batchAccept = useDemoStore((state) => state.batchAccept);
  const setBellOpen = useUiStore((state) => state.setBellOpen);

  const [selected, setSelected] = useState<string[]>([]);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [observeOpen, setObserveOpen] = useState(false);

  const items = useMemo(
    () =>
      WORK_ITEMS.map((item) =>
        projectWorkItem(item, { answers, reviews, stopped }),
      ),
    [answers, reviews, stopped],
  );

  const queue = items
    .filter((item) => needsHuman(item))
    .sort((a, b) => {
      const order = { now: 0, today: 1, later: 2 };
      return order[a.priority] - order[b.priority];
    });
  const working = items.filter(
    (item) => item.stage === "working" || item.stage === "queued",
  );
  const waiting = items.filter((item) => item.stage === "waiting");
  const openCandidates = candidates.filter(
    (candidate) => candidate.status === "open",
  );
  const batchable = queue.filter((item) => canBatchReview(item));
  const selectedBatchable = batchable.filter((item) =>
    selected.includes(item.id),
  );

  function toggleSelected(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[820px] px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <header className="flex items-center gap-3">
          <AssistantAvatar profile={profile} size="lg" status="online" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[28px] leading-tight tracking-tight">
              {greeting()}，{profile.addressAs}
            </h1>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              {queue.length > 0
                ? `${queue.length} 件事需要你。其余的，我继续推进。`
                : "今天没有需要你的事。你可以说一件新的事，或者什么都不做。"}
            </p>
          </div>
        </header>

        {queue.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
                需要你
              </h2>
              {selectedBatchable.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    已选 {selectedBatchable.length}
                  </span>
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      batchAccept(
                        selectedBatchable
                          .map((item) => item.review?.id)
                          .filter((id): id is string => Boolean(id)),
                      );
                      setSelected([]);
                    }}
                  >
                    接受所选
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-2 space-y-1.5">
              {queue.map((item) => {
                const batchEligible = canBatchReview(item);
                return (
                  <article
                    key={item.id}
                    className="group flex items-start gap-3 rounded-[16px] border border-border bg-card/75 px-3.5 py-3 transition-colors hover:border-clay/25 hover:bg-card"
                  >
                    <div className="pt-0.5">
                      {batchEligible ? (
                        <Checkbox
                          checked={selected.includes(item.id)}
                          onCheckedChange={() => toggleSelected(item.id)}
                          aria-label={`选择 ${item.title}`}
                        />
                      ) : (
                        <WarningCircle
                          size={15}
                          weight="fill"
                          className={cn(
                            "mt-0.5",
                            item.stage === "failed" || item.stage === "blocked"
                              ? "text-destructive"
                              : "text-warning",
                          )}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to="/w/$workItemId"
                          params={{ workItemId: item.id }}
                          search={{ tab: tabFor(item) }}
                          className="text-[13.5px] font-medium hover:text-clay"
                        >
                          {item.title}
                        </Link>
                        <StageBadge stage={item.stage} />
                        <span className="text-[10px] text-muted-foreground">
                          {priorityLabel(item.priority)}
                        </span>
                      </div>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">
                        {stageWaitingFor(item.stage)}
                        {item.review
                          ? ` · ${item.authority.reversible ? "可逆" : "不可逆"}`
                          : ""}
                        {item.evidenceIds.length > 0
                          ? ` · ${item.evidenceIds.length} 份证据`
                          : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Button
                          asChild
                          size="xs"
                          variant="secondary"
                        >
                          <Link
                            to="/w/$workItemId"
                            params={{ workItemId: item.id }}
                            search={{ tab: tabFor(item) }}
                          >
                            {item.stage === "awaiting_answer"
                              ? "去回答"
                              : item.stage === "awaiting_review"
                                ? "去审阅"
                                : "查看"}
                            <ArrowRight size={11} />
                          </Link>
                        </Button>
                        <Link
                          to="/w/$workItemId"
                          params={{ workItemId: item.id }}
                          search={{ tab: "overview" }}
                          className="text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          证据与授权
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-7">
          <button
            type="button"
            onClick={() => setPortfolioOpen((value) => !value)}
            className="flex w-full items-center gap-2 text-left"
          >
            <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
              正在推进
            </h2>
            <span className="text-[10px] text-muted-foreground/60">
              {working.length + waiting.length}
            </span>
            <CaretDown
              size={12}
              className={cn(
                "text-muted-foreground transition-transform",
                portfolioOpen && "rotate-180",
              )}
            />
          </button>

          {portfolioOpen && (
            <div className="mt-2 space-y-3">
              {[
                { label: "等 Agent", items: working },
                { label: "等触发", items: waiting },
              ].map((lane) =>
                lane.items.length === 0 ? null : (
                  <div key={lane.label}>
                    <p className="px-3 text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
                      {lane.label}
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {lane.items.map((item) => {
                        const codeAgents = item.agentIds
                          .map((id) => getAgent(id))
                          .filter((agent) => agent?.kind === "code");
                        return (
                          <Link
                            key={item.id}
                            to="/w/$workItemId"
                            params={{ workItemId: item.id }}
                            search={{ tab: "overview" }}
                            className="flex items-start gap-3 rounded-[14px] px-3.5 py-2.5 transition-colors hover:bg-secondary/50"
                          >
                            <span className="mt-1.5 size-1.5 shrink-0 animate-soft-pulse rounded-full bg-clay" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[12.5px]">
                                {item.title}
                              </span>
                              <span className="mt-0.5 block text-[10.5px] text-muted-foreground">
                                {waitingOnLabel(item.waitingOn)}
                                {codeAgents.length > 0
                                  ? ` · ${codeAgents.map((agent) => agent?.name).join(" / ")}`
                                  : ""}
                                {" · 不需要你"}
                              </span>
                            </span>
                            <span className="text-[10px] text-muted-foreground/70">
                              {stageLabel(item.stage)}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>

        {openCandidates.length > 0 && (
          <section className="mt-5">
            <button
              type="button"
              onClick={() => setObserveOpen((value) => !value)}
              className="flex w-full items-center gap-2 text-left"
            >
              <Eye size={12} className="text-clay" />
              <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
                观察记录
              </h2>
              <span className="text-[10px] text-muted-foreground/60">
                {openCandidates.length}
              </span>
              <CaretDown
                size={12}
                className={cn(
                  "text-muted-foreground transition-transform",
                  observeOpen && "rotate-180",
                )}
              />
            </button>

            {observeOpen && (
              <div className="mt-2 space-y-1.5">
                {openCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="rounded-[14px] border border-dashed border-clay/30 bg-accent/25 px-3.5 py-2.5"
                  >
                    <p className="text-[12px] font-medium">{candidate.title}</p>
                    <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground">
                      {candidate.impact}
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      size="xs"
                      onClick={() => setBellOpen(true)}
                      className="mt-1 h-auto px-0"
                    >
                      查看并处理
                      <ArrowRight size={11} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="mt-9">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            说一件新的事
          </h2>
          <div className="mt-2">
            <Composer
              large
              placeholder="描述一个目标，或者交给我一件事…"
            />
          </div>
          <p className="mt-2 text-[10.5px] text-muted-foreground/70">
            复杂的事我会先给计划，再安静执行；需要你时才会出现。
          </p>
        </section>

        {queue.length === 0 && working.length + waiting.length === 0 && (
          <div className="mt-10 flex items-center justify-center gap-2 text-[11px] text-muted-foreground/60">
            <CheckCircle size={13} className="text-sage" />
            一切正常。没有需要你处理的事。
          </div>
        )}
      </div>
    </div>
  );
}
