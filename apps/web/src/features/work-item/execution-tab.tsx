import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CaretDown,
  Clock,
  Cpu,
  WarningCircle,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { getAgent, getArtifact } from "@/fixtures";
import type { ReportKind, WorkItem } from "@/fixtures/types";
import {
  agentKindLabel,
  agentStatusLabel,
  reportLabel,
  stageLabel,
  stageTone,
  stageWaitingFor,
  stepLabel,
} from "@/display/labels";
import { ArtifactKindBadge, StepStatusIcon } from "@/components/primitives";

const REPORT_DOT: Record<ReportKind, string> = {
  progress: "bg-muted-foreground/40",
  waiting: "bg-sage",
  ready: "bg-sage",
  blocked: "bg-destructive",
  failed: "bg-destructive",
  dropped: "bg-muted-foreground/40",
};

export function ExecutionTab({ item }: { item: WorkItem }) {
  const [showProgress, setShowProgress] = useState(false);
  const agents = item.agentIds
    .map((id) => getAgent(id))
    .filter((agent) => agent !== undefined);
  const progressReports = item.reports.filter(
    (report) => report.kind === "progress",
  );
  const visibleReports = showProgress
    ? item.reports
    : item.reports.filter((report) => report.kind !== "progress");
  const artifact = item.review ? getArtifact(item.review.artifactId) : undefined;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[900px] space-y-6 px-4 pb-12 pt-5 sm:px-6">
        <section>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                stageTone(item.stage),
              )}
            >
              <span className="size-1.5 rounded-full bg-current opacity-70" />
              {stageLabel(item.stage)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {stageWaitingFor(item.stage)}
            </span>
          </div>
          <h2 className="mt-2 font-display text-[22px] tracking-tight">
            {item.title}
          </h2>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
            {item.outcome}
          </p>
          <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground/70">
            <Clock size={11} />
            开始于 {item.createdAt} · 更新于 {item.updatedAt}
          </p>
        </section>

        {item.stage === "awaiting_answer" && item.attention && (
          <Link
            to="/w/$workItemId"
            params={{ workItemId: item.id }}
            search={{ tab: "conversation" }}
            className="flex items-start gap-2 rounded-[12px] border border-clay/25 bg-accent/45 px-3 py-2.5 transition-colors hover:bg-accent/70"
          >
            <WarningCircle size={15} weight="fill" className="mt-0.5 shrink-0 text-clay" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-clay">
                等你决定
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-foreground/80">
                {item.attention.question}
              </span>
            </span>
            <ArrowRight size={13} className="mt-0.5 shrink-0 text-clay" />
          </Link>
        )}

        {item.stage === "awaiting_review" && item.review && (
          <Link
            to="/w/$workItemId"
            params={{ workItemId: item.id }}
            search={{ tab: "evidence" }}
            className="flex items-start gap-2 rounded-[12px] border border-warning/25 bg-warning/[0.06] px-3 py-2.5 transition-colors hover:bg-warning/10"
          >
            <WarningCircle size={15} weight="fill" className="mt-0.5 shrink-0 text-warning" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-warning">
                等你确认
              </span>
              <span className="mt-0.5 block truncate text-xs text-foreground/80">
                {artifact?.title ?? "结果已就绪"}
              </span>
            </span>
            <ArtifactKindBadge kind={artifact?.kind ?? "markdown"} withLabel={false} />
          </Link>
        )}

        <section>
          <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            计划
          </h3>
          <ol className="mt-2 space-y-2">
            {item.plan.map((step) => {
              const agent = step.agentId ? getAgent(step.agentId) : undefined;
              return (
                <li key={step.id} className="flex items-start gap-2">
                  <span className="mt-0.5">
                    <StepStatusIcon status={step.status} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] leading-snug">
                      {step.title}
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground/70">
                      {stepLabel(step.status)}
                      {agent && (
                        <span className="rounded bg-secondary px-1 py-0.5">
                          {agent.name}
                        </span>
                      )}
                      {step.note && (
                        <span className="text-destructive">{step.note}</span>
                      )}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <section>
          <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            Agents
          </h3>
          <div className="mt-2 space-y-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="rounded-[12px] border border-border bg-card/60 px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      agent.status === "running" && "animate-soft-pulse bg-clay",
                      agent.status === "done" && "bg-sage",
                      agent.status === "failed" && "bg-destructive",
                      agent.status === "waiting" && "bg-warning",
                      agent.status === "idle" && "bg-muted-foreground/40",
                    )}
                  />
                  <span className="text-[12px] font-medium">{agent.name}</span>
                  <span className="rounded bg-secondary px-1 py-0.5 text-[9px] text-muted-foreground">
                    {agentKindLabel(agent.kind)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {agentStatusLabel(agent.status)}
                  </span>
                  {agent.sessionId && (
                    <span className="ml-auto font-mono text-[9.5px] text-muted-foreground/60">
                      {agent.sessionId}
                    </span>
                  )}
                </div>
                <p className="mt-1 pl-3.5 text-[11px] leading-relaxed text-muted-foreground">
                  {agent.summary}
                </p>
                {(agent.repo || agent.branch) && (
                  <p className="mt-1 pl-3.5 font-mono text-[9.5px] text-muted-foreground/60">
                    {agent.repo}
                    {agent.branch ? ` · ${agent.branch}` : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
              报告
            </h3>
            {progressReports.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setShowProgress((value) => !value)}
                className="text-muted-foreground"
              >
                {showProgress ? "收起进展" : `显示 ${progressReports.length} 条进展`}
                <CaretDown
                  size={11}
                  className={cn(
                    "transition-transform",
                    showProgress && "rotate-180",
                  )}
                />
              </Button>
            )}
          </div>
          <ol className="mt-2 space-y-2.5">
            {visibleReports.map((report) => (
              <li key={report.id} className="flex gap-2">
                <span
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full",
                    REPORT_DOT[report.kind],
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium">
                      {reportLabel(report.kind)}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {report.at}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
                    {report.summary}
                  </p>
                  {report.detail && (
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground/80">
                      {report.detail}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {item.stage === "done" && (
          <div className="flex items-center gap-2 rounded-[12px] border border-sage/20 bg-sage/[0.06] px-3 py-2 text-[11px] text-sage">
            <Cpu size={13} />
            工作项已结束，不再占用注意力。
          </div>
        )}
      </div>
    </div>
  );
}
