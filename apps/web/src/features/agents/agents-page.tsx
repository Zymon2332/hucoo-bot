import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Cpu,
  Robot,
  Sparkle,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { AGENTS, getWorkItem } from "@/fixtures";
import type { AgentRun } from "@/fixtures/types";
import { agentKindLabel, agentStatusLabel } from "@/display/labels";
import { SectionHeading } from "@/components/primitives";

const GROUPS: Array<{
  kind: AgentRun["kind"];
  label: string;
  icon: typeof Robot;
  description: string;
}> = [
  {
    kind: "personal",
    label: "Personal Agent",
    icon: Sparkle,
    description: "负责路由、验证与汇报，不直接替代执行。",
  },
  {
    kind: "subagent",
    label: "子代理",
    icon: Brain,
    description: "为单个工作项做检索、整理、核对与审阅。",
  },
  {
    kind: "code",
    label: "Code Agents",
    icon: Cpu,
    description: "真实的执行层：仓库、分支、会话与产出。",
  },
];

function AgentCard({ agent }: { agent: AgentRun }) {
  const items = agent.workItemIds
    .map((id) => getWorkItem(id))
    .filter((item) => item !== undefined);

  return (
    <article className="rounded-[16px] border border-border bg-card/70 px-4 py-3.5">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[10px] bg-secondary text-muted-foreground">
          <Robot size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13px] font-medium">{agent.name}</h3>
            <span className="rounded bg-secondary px-1.5 py-0.5 text-[9.5px] text-muted-foreground">
              {agentKindLabel(agent.kind)}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[10px]",
                agent.status === "running" && "text-clay",
                agent.status === "done" && "text-sage",
                agent.status === "failed" && "text-destructive",
                agent.status === "waiting" && "text-warning",
                agent.status === "idle" && "text-muted-foreground",
              )}
            >
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
              {agentStatusLabel(agent.status)}
            </span>
          </div>
          <p className="mt-0.5 text-[10.5px] text-muted-foreground">
            {agent.role}
          </p>
          {agent.summary && (
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
              {agent.summary}
            </p>
          )}
          {(agent.sessionId || agent.repo || agent.branch) && (
            <p className="mt-1.5 font-mono text-[9.5px] text-muted-foreground/60">
              {[agent.repo, agent.branch, agent.sessionId]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          {agent.lastHandoff && (
            <p className="mt-1 text-[10px] text-muted-foreground/60">
              最近交接：{agent.lastHandoff}
            </p>
          )}
          {items.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to="/w/$workItemId"
                  params={{ workItemId: item.id }}
                  search={{ tab: "overview" }}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.title}
                  <ArrowRight size={9} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function AgentsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[1000px] px-4 pb-12 pt-6 sm:px-6">
        <header>
          <h1 className="font-display text-[26px] tracking-tight">代理</h1>
          <p className="mt-1 text-[12px] text-muted-foreground">
            小满负责路由与验证；子代理负责中间步骤；Code Agents 负责真实执行。
            每一层都可以下钻到工作项和证据。
          </p>
        </header>

        <div className="mt-6 space-y-7">
          {GROUPS.map((group) => {
            const agents = AGENTS.filter((agent) => agent.kind === group.kind);
            const Icon = group.icon;
            return (
              <section key={group.kind}>
                <SectionHeading
                  aside={
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Icon size={11} />
                      {agents.length}
                    </span>
                  }
                >
                  {group.label}
                </SectionHeading>
                <p className="mt-1 text-[10.5px] text-muted-foreground">
                  {group.description}
                </p>
                <div className="mt-2 grid gap-2 lg:grid-cols-2">
                  {agents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
