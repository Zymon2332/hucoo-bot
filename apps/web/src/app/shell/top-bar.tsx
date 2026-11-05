import { Bell, List, SidebarSimple } from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import type { Conversation, Task } from "@/fixtures/types";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { ModeBadge, StageBadge } from "@/components/primitives";

export function TopBar({
  conversation,
  task,
  title,
}: {
  conversation?: Conversation;
  task?: Task;
  title?: string;
}) {
  const profile = useDemoStore((state) => state.profile);
  const candidates = useDemoStore((state) => state.candidates);
  const setBellOpen = useUiStore((state) => state.setBellOpen);
  const setMobileRailOpen = useUiStore((state) => state.setMobileRailOpen);
  const inspectorOpen = useUiStore((state) => state.inspectorOpen);
  const toggleInspector = useUiStore((state) => state.toggleInspector);

  const openCandidates = candidates.filter(
    (candidate) => candidate.status === "open",
  ).length;
  const attentionOpen = task?.stage === "awaiting_answer";
  const actionable = openCandidates + (attentionOpen ? 1 : 0);
  const runningAgents =
    task?.subagents.filter((agent) => agent.status === "running").length ?? 0;

  return (
    <header className="flex h-13 shrink-0 items-center gap-2 border-b border-border/70 px-3 sm:px-4">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setMobileRailOpen(true)}
        aria-label="打开会话列表"
        className="text-muted-foreground md:hidden"
      >
        <List size={18} />
      </Button>

      <div className="flex min-w-0 items-center gap-2">
        <h1 className="truncate text-[14px] font-medium tracking-tight">
          {conversation?.title ?? title ?? "今天"}
        </h1>
        {task && <StageBadge stage={task.stage} className="hidden sm:inline-flex" />}
        {task?.stage === "working" && (
          <span className="hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:inline-flex">
            <span className="size-1.5 animate-soft-pulse rounded-full bg-clay" />
            {runningAgents > 0
              ? `${runningAgents} 个子代理在并行`
              : "正在处理"}
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <span className="hidden sm:inline-flex">
          <ModeBadge mode={profile.proactiveMode} />
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setBellOpen(true)}
          aria-label="需要你处理"
          className="relative text-muted-foreground"
        >
          <Bell size={17} />
          {actionable > 0 && (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-clay" />
          )}
        </Button>
        <Button
          type="button"
          variant={inspectorOpen ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={toggleInspector}
          aria-label={inspectorOpen ? "收起检查器" : "展开检查器"}
          className={cn(!inspectorOpen && "text-muted-foreground")}
        >
          <SidebarSimple size={17} className="rotate-180" />
        </Button>
      </div>
    </header>
  );
}
