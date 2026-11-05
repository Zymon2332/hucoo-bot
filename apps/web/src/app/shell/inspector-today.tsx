import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CheckCircle,
  Cube,
  Cpu,
  Plugs,
  Sparkle,
  WarningCircle,
} from "@phosphor-icons/react";
import { TASKS, CONVERSATIONS, getTask } from "@/fixtures";
import { stageLabel } from "@/display/labels";
import { StageBadge } from "@/components/primitives";
import { useDemoStore } from "@/stores/demo-store";

function conversationForTask(taskId: string) {
  return CONVERSATIONS.find((conversation) => conversation.taskId === taskId);
}

export function InspectorToday() {
  const allCandidates = useDemoStore((state) => state.candidates);
  const candidates = allCandidates.filter(
    (candidate) => candidate.status === "open",
  );
  const actionable = TASKS.filter((task) =>
    ["awaiting_answer", "awaiting_review", "blocked", "failed"].includes(
      task.stage,
    ),
  );
  const working = TASKS.filter((task) => task.stage === "working");

  return (
    <div className="space-y-5 p-4">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            需要你处理
          </h2>
          {actionable.length === 0 && candidates.length === 0 && (
            <span className="flex items-center gap-1 text-[10px] text-sage">
              <CheckCircle size={11} weight="fill" />
              都处理完了
            </span>
          )}
        </div>
        <div className="mt-2 space-y-1.5">
          {actionable.map((task) => {
            const conversation = conversationForTask(task.id);
            return (
              <Link
                key={task.id}
                to="/c/$conversationId"
                params={{ conversationId: conversation?.id ?? "" }}
                className="flex items-start gap-2 rounded-[12px] border border-border bg-card/60 px-3 py-2 transition-colors hover:bg-secondary/60"
              >
                <WarningCircle
                  size={14}
                  className="mt-0.5 shrink-0 text-warning"
                  weight="fill"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-medium">
                    {task.title}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">
                    {stageLabel(task.stage)}
                  </span>
                </span>
                <ArrowRight size={12} className="mt-1 shrink-0 text-muted-foreground" />
              </Link>
            );
          })}

          {candidates.map((candidate) => (
            <a
              key={candidate.id}
              href="/c/c-proactive"
              className="flex items-start gap-2 rounded-[12px] border border-dashed border-clay/30 bg-accent/25 px-3 py-2 transition-colors hover:bg-accent/50"
            >
              <Sparkle size={14} weight="fill" className="mt-0.5 shrink-0 text-clay" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-medium">
                  {candidate.title}
                </span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                  观察模式 · {candidate.createdAt}
                </span>
              </span>
              <ArrowRight size={12} className="mt-1 shrink-0 text-clay" />
            </a>
          ))}

          {actionable.length === 0 && candidates.length === 0 && (
            <p className="rounded-[12px] border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
              暂时没有需要你处理的事。
            </p>
          )}
        </div>
      </section>

      {working.length > 0 && (
        <section>
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            进行中
          </h2>
          <div className="mt-2 space-y-1.5">
            {working.map((task) => {
              const conversation = conversationForTask(task.id);
              return (
                <Link
                  key={task.id}
                  to="/c/$conversationId"
                  params={{ conversationId: conversation?.id ?? "" }}
                  className="flex items-center gap-2 rounded-[12px] px-3 py-2 transition-colors hover:bg-secondary/60"
                >
                  <span className="size-1.5 animate-soft-pulse rounded-full bg-clay" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px]">{task.title}</span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">
                      {task.subagents.filter((agent) => agent.status === "running").length}{" "}
                      个子代理在并行
                    </span>
                  </span>
                  <StageBadge stage={task.stage} />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
          今天
        </h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-[12px] border border-border bg-card/60 px-3 py-2">
            <p className="text-lg font-semibold tabular-nums">
              {TASKS.filter((task) => task.stage === "done").length}
            </p>
            <p className="text-[10px] text-muted-foreground">已完成</p>
          </div>
          <div className="rounded-[12px] border border-border bg-card/60 px-3 py-2">
            <p className="text-lg font-semibold tabular-nums">
              {getTask("t-weekly")?.artifactIds.length ?? 0}
            </p>
            <p className="text-[10px] text-muted-foreground">新产物</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export const INSPECTOR_TABS = [
  { id: "execution", label: "执行", icon: Cpu },
  { id: "memory", label: "记忆", icon: Brain },
  { id: "artifacts", label: "产物", icon: Cube },
  { id: "capabilities", label: "能力", icon: Plugs },
] as const;
