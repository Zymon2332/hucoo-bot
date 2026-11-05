import { useState } from "react";
import {
  ArrowRight,
  CaretDown,
  CheckCircle,
  Clock,
  Cpu,
  WarningCircle,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { getArtifact, getTask } from "@/fixtures";
import {
  reportLabel,
  stageLabel,
  stageTone,
  stageWaitingFor,
  stepLabel,
} from "@/display/labels";
import {
  ArtifactKindBadge,
  EmptyState,
  StepStatusIcon,
} from "@/components/primitives";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import type { ReportKind } from "@/fixtures/types";

const REPORT_DOT: Record<ReportKind, string> = {
  progress: "bg-muted-foreground/40",
  waiting: "bg-sage",
  ready: "bg-sage",
  blocked: "bg-destructive",
  failed: "bg-destructive",
  dropped: "bg-muted-foreground/40",
};

export function ExecutionPanel({ taskId }: { taskId?: string }) {
  const task = taskId ? getTask(taskId) : undefined;
  const setTab = useUiStore((state) => state.setInspectorTab);
  const answer = useDemoStore((state) =>
    task?.attention ? state.answers[task.attention.id] : undefined,
  );
  const reviewStatus = useDemoStore((state) =>
    task?.review ? state.reviews[task.review.id] : undefined,
  );
  const [showProgress, setShowProgress] = useState(false);

  if (!task) {
    return (
      <div className="p-4">
        <EmptyState
          icon={<Cpu size={22} />}
          title="还没有正在执行的任务"
          description="当你交给我一件需要多步完成的事，执行过程会出现在这里。"
        />
      </div>
    );
  }

  const progressReports = task.reports.filter(
    (report) => report.kind === "progress",
  );
  const visibleReports = showProgress
    ? task.reports
    : task.reports.filter((report) => report.kind !== "progress");
  const artifact = task.review ? getArtifact(task.review.artifactId) : undefined;

  return (
    <div className="space-y-5 p-4">
      <section>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
              stageTone(task.stage),
            )}
          >
            <span className="size-1.5 rounded-full bg-current opacity-70" />
            {stageLabel(task.stage)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {stageWaitingFor(task.stage)}
          </span>
        </div>
        <h2 className="mt-2.5 text-[15px] font-medium leading-snug">
          {task.title}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {task.goal}
        </p>
        <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground/70">
          <Clock size={11} />
          开始于 {task.startedAt} · 更新于 {task.updatedAt}
        </p>
      </section>

      {task.stage === "awaiting_answer" && task.attention && !answer && (
        <button
          type="button"
          onClick={() =>
            document
              .getElementById(`attention-${task.attention?.id}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
          className="flex w-full items-start gap-2 rounded-[12px] border border-clay/25 bg-accent/45 px-3 py-2.5 text-left transition-colors hover:bg-accent/70"
        >
          <WarningCircle size={15} weight="fill" className="mt-0.5 shrink-0 text-clay" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-medium text-clay">
              等你回答
            </span>
            <span className="mt-0.5 block text-xs leading-relaxed text-foreground/80">
              {task.attention.question}
            </span>
          </span>
          <ArrowRight size={13} className="mt-0.5 shrink-0 text-clay" />
        </button>
      )}

      {task.stage === "awaiting_review" && task.review && !reviewStatus && (
        <button
          type="button"
          onClick={() => {
            setTab("artifacts");
            document
              .getElementById(`review-${task.review?.id}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className="flex w-full items-start gap-2 rounded-[12px] border border-warning/25 bg-warning/[0.06] px-3 py-2.5 text-left transition-colors hover:bg-warning/10"
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
        </button>
      )}

      <section>
        <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
          计划
        </h3>
        <ol className="mt-2 space-y-2">
          {task.plan.map((step) => (
            <li key={step.id} className="flex items-start gap-2">
              <span className="mt-0.5">
                <StepStatusIcon status={step.status} />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-[12.5px] leading-snug",
                    step.status === "pending" && "text-muted-foreground",
                    step.status === "done" && "text-foreground/75",
                  )}
                >
                  {step.title}
                </span>
                <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground/70">
                  {stepLabel(step.status)}
                  {step.agent && (
                    <span className="rounded bg-secondary px-1 py-0.5">
                      {step.agent}
                    </span>
                  )}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {task.subagents.length > 0 && (
        <section>
          <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            子代理
          </h3>
          <div className="mt-2 space-y-2">
            {task.subagents.map((agent) => (
              <div
                key={agent.id}
                className="rounded-[12px] border border-border bg-card/60 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      agent.status === "running" && "animate-soft-pulse bg-clay",
                      agent.status === "done" && "bg-sage",
                      agent.status === "failed" && "bg-destructive",
                      agent.status === "idle" && "bg-muted-foreground/40",
                    )}
                  />
                  <span className="text-[12px] font-medium">{agent.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {agent.role}
                  </span>
                </div>
                {agent.summary && (
                  <p className="mt-1 pl-3.5 text-[11px] leading-relaxed text-muted-foreground">
                    {agent.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            报告
          </h3>
          {progressReports.length > 0 && (
            <button
              type="button"
              onClick={() => setShowProgress((value) => !value)}
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
            >
              {showProgress ? "收起进展" : `显示 ${progressReports.length} 条进展`}
              <CaretDown
                size={11}
                className={cn("transition-transform", showProgress && "rotate-180")}
              />
            </button>
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
        {visibleReports.length === 0 && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            还没有需要展示的报告。
          </p>
        )}
      </section>

      {task.stage === "done" && (
        <div className="flex items-center gap-2 rounded-[12px] border border-sage/20 bg-sage/[0.06] px-3 py-2 text-[11px] text-sage">
          <CheckCircle size={14} weight="fill" />
          任务已完成
        </div>
      )}
    </div>
  );
}
