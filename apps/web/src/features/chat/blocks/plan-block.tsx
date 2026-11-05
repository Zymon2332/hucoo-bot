import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CaretDown } from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { getAgent, getWorkItem } from "@/fixtures";
import { useWorkItemView } from "@/lib/work-state";
import { StageBadge, StepStatusIcon } from "@/components/primitives";

export function PlanBlock({ workItemId }: { workItemId: string }) {
  const raw = getWorkItem(workItemId);
  const item = raw ? useWorkItemView(raw) : undefined;
  const [expanded, setExpanded] = useState(false);

  if (!item) return null;

  const done = item.plan.filter((step) => step.status === "done").length;

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-card/70 px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          aria-expanded={expanded}
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-section-label">
            计划
          </span>
          <span className="text-[11px] text-muted-foreground">
            {done}/{item.plan.length} 步
          </span>
          <CaretDown
            size={12}
            className={cn(
              "text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
          <span className="ml-auto" />
        </button>
        <StageBadge stage={item.stage} />
      </div>

      {expanded && (
        <ol className="mt-2.5 space-y-1.5">
          {item.plan.map((step) => {
            const agent = step.agentId ? getAgent(step.agentId) : undefined;
            return (
              <li key={step.id} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5">
                  <StepStatusIcon status={step.status} />
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 leading-snug",
                    step.status === "pending" && "text-muted-foreground",
                    step.status === "done" && "text-foreground/75",
                  )}
                >
                  {step.title}
                  {agent && (
                    <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {agent.name}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <Button
        asChild
        variant="link"
        size="sm"
        className="mt-2 h-auto px-0 text-[11px]"
      >
        <Link
          to="/w/$workItemId"
          params={{ workItemId }}
          search={{ tab: "execution" }}
        >
          查看工作项与证据
          <ArrowRight size={11} />
        </Link>
      </Button>
    </section>
  );
}
