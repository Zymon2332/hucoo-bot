import { ArrowRight } from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { getTask } from "@/fixtures";
import { StageBadge, StepStatusIcon } from "@/components/primitives";
import { useUiStore } from "@/stores/ui-store";

export function PlanBlock({ taskId }: { taskId: string }) {
  const task = getTask(taskId);
  const setTab = useUiStore((state) => state.setInspectorTab);
  const setOpen = useUiStore((state) => state.setInspectorOpen);

  if (!task) return null;

  const done = task.plan.filter((step) => step.status === "done").length;

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-card/70 px-4 py-3.5">
      <header className="flex items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-section-label">
          计划
        </span>
        <span className="text-[11px] text-muted-foreground">
          {done}/{task.plan.length} 步
        </span>
        <StageBadge stage={task.stage} className="ml-auto" />
      </header>

      <p className="mt-2 text-sm leading-relaxed text-foreground/90">
        {task.goal}
      </p>

      <ol className="mt-3 space-y-1.5">
        {task.plan.map((step) => (
          <li key={step.id} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5">
              <StepStatusIcon status={step.status} />
            </span>
            <span
              className={cn(
                "flex-1 leading-snug",
                step.status === "pending" && "text-muted-foreground",
                step.status === "skipped" && "text-muted-foreground line-through",
                step.status === "done" && "text-foreground/75",
              )}
            >
              {step.title}
              {step.agent && (
                <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {step.agent}
                </span>
              )}
              {step.note && (
                <span className="mt-0.5 block text-[11px] text-destructive">
                  {step.note}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>

      {task.subagents.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/70 pt-2.5">
          <span className="text-[10px] uppercase tracking-[0.14em] text-section-label">
            子代理
          </span>
          {task.subagents.map((agent) => (
            <span
              key={agent.id}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  agent.status === "running" && "animate-soft-pulse bg-clay",
                  agent.status === "done" && "bg-sage",
                  agent.status === "failed" && "bg-destructive",
                  agent.status === "idle" && "bg-muted-foreground/40",
                )}
              />
              {agent.name}
            </span>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="link"
        size="sm"
        onClick={() => {
          setOpen(true);
          setTab("execution");
        }}
        className="mt-3 h-auto px-0 text-[12px]"
      >
        在检查器中查看
        <ArrowRight size={13} />
      </Button>
    </section>
  );
}
