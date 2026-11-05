import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, Sparkle, Sun } from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import { CONVERSATIONS, TASKS } from "@/fixtures";
import { stageWaitingFor } from "@/display/labels";
import { useDemoStore } from "@/stores/demo-store";
import { Composer } from "@/features/chat/composer";
import { AssistantAvatar, SectionHeading, StageBadge } from "@/components/primitives";

const SUGGESTIONS = [
  { label: "把本周进展整理成周报", to: "c-weekly" },
  { label: "对比一下几个个人助理产品", to: "c-competitor" },
  { label: "帮我排下周的行程", to: "c-schedule" },
  { label: "清理一遍未读邮件", to: "c-inbox" },
];

function conversationForTask(taskId: string) {
  return CONVERSATIONS.find((conversation) => conversation.taskId === taskId);
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了";
  if (hour < 12) return "早上好";
  if (hour < 18) return "下午好";
  return "晚上好";
}

export function HomePage() {
  const profile = useDemoStore((state) => state.profile);
  const actionable = TASKS.filter((task) =>
    ["awaiting_answer", "awaiting_review", "blocked", "failed"].includes(
      task.stage,
    ),
  ).slice(0, 3);
  const working = TASKS.filter((task) => task.stage === "working").slice(0, 2);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[760px] px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
        <div className="flex flex-col items-center text-center">
          <AssistantAvatar profile={profile} size="xl" status="online" />
          <h1 className="mt-5 font-display text-[30px] leading-tight tracking-tight sm:text-[34px]">
            {greeting()}，{profile.addressAs}
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            今天想让我做什么？轻的事直接说，复杂的事交给我。
          </p>
        </div>

        <div className="mt-7">
          <Composer large />
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {SUGGESTIONS.map((suggestion) => (
            <Button
              key={suggestion.to}
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border-border/80 bg-card/60 px-3 text-[12px] font-normal text-muted-foreground hover:text-foreground"
            >
              <Link
                to="/c/$conversationId"
                params={{ conversationId: suggestion.to }}
              >
                {suggestion.label}
              </Link>
            </Button>
          ))}
        </div>

        {actionable.length > 0 && (
          <section className="mt-10">
            <SectionHeading
              aside={
                <span className="flex items-center gap-1 text-[10px] text-warning">
                  <Sparkle size={11} weight="fill" />
                  {actionable.length} 件
                </span>
              }
            >
              需要你处理
            </SectionHeading>
            <div className="mt-2 space-y-1.5">
              {actionable.map((task) => {
                const conversation = conversationForTask(task.id);
                return (
                  <Link
                    key={task.id}
                    to="/c/$conversationId"
                    params={{ conversationId: conversation?.id ?? "" }}
                    className="flex items-center gap-3 rounded-[14px] border border-border bg-card/70 px-3.5 py-2.5 transition-colors hover:bg-card"
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-warning" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">
                        {task.title}
                      </span>
                      <span className="mt-0.5 block text-[10.5px] text-muted-foreground">
                        {stageWaitingFor(task.stage)}
                      </span>
                    </span>
                    <StageBadge stage={task.stage} />
                    <ArrowRight
                      size={13}
                      className="shrink-0 text-muted-foreground"
                    />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {working.length > 0 && (
          <section className="mt-7">
            <SectionHeading>进行中</SectionHeading>
            <div className="mt-2 space-y-1.5">
              {working.map((task) => {
                const conversation = conversationForTask(task.id);
                const running = task.subagents.filter(
                  (agent) => agent.status === "running",
                ).length;
                return (
                  <Link
                    key={task.id}
                    to="/c/$conversationId"
                    params={{ conversationId: conversation?.id ?? "" }}
                    className="flex items-center gap-3 rounded-[14px] px-3.5 py-2 transition-colors hover:bg-secondary/50"
                  >
                    <span className="size-1.5 animate-soft-pulse rounded-full bg-clay" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px]">
                        {task.title}
                      </span>
                      <span className="mt-0.5 block text-[10.5px] text-muted-foreground">
                        {running > 0
                          ? `${running} 个子代理在并行，不需要你`
                          : "正在处理，不需要你"}
                      </span>
                    </span>
                    <StageBadge stage={task.stage} />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-10 flex items-center justify-center gap-1.5 text-[10.5px] text-muted-foreground/70">
          <Sun size={12} />
          {profile.proactiveMode === "observe"
            ? "观察模式：主动行为只记录，不擅自执行"
            : "自动模式：符合条件的规则会直接执行"}
        </div>
      </div>
    </div>
  );
}

export function HomeEmptyHint() {
  return (
    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
      <CheckCircle size={12} className="text-sage" />
      都处理完了
    </div>
  );
}
