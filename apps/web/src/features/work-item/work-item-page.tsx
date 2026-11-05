import { Link, useNavigate } from "@tanstack/react-router";
import {
  Brain,
  ChatCircle,
  Cpu,
  FileText,
  ListChecks,
  ShieldCheck,
} from "@phosphor-icons/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@hucoo/ui/components/tabs";
import { Button } from "@hucoo/ui/components/button";
import { getWorkItem } from "@/fixtures";
import type { WorkTab } from "@/fixtures/types";
import {
  authorityModeLabel,
  priorityLabel,
  stageLabel,
  stageTone,
  waitingOnLabel,
} from "@/display/labels";
import { useWorkItemView } from "@/lib/work-state";
import { EmptyState } from "@/components/primitives";
import { OverviewTab } from "./overview-tab";
import { ConversationTab } from "./conversation-tab";
import { EvidenceTab } from "@/features/evidence/evidence-tab";
import { ExecutionTab } from "./execution-tab";
import { AuthorityTab } from "./authority-tab";

const TABS: Array<{ id: WorkTab; label: string; icon: typeof ListChecks }> = [
  { id: "overview", label: "概览", icon: ListChecks },
  { id: "conversation", label: "对话", icon: ChatCircle },
  { id: "evidence", label: "证据", icon: FileText },
  { id: "execution", label: "执行", icon: Cpu },
  { id: "authority", label: "权限", icon: ShieldCheck },
];

export function WorkItemPage({
  workItemId,
  tab,
}: {
  workItemId: string;
  tab: WorkTab;
}) {
  const raw = getWorkItem(workItemId);
  const item = raw ? useWorkItemView(raw) : undefined;
  const navigate = useNavigate();

  if (!item) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          title="工作项不存在"
          description="它可能已被删除，或链接不正确。"
          action={
            <Button asChild size="sm">
              <Link to="/">回到决策台</Link>
            </Button>
          }
        />
      </div>
    );
  }

  function setTab(next: string) {
    if (!item) return;
    void navigate({
      to: "/w/$workItemId",
      params: { workItemId: item.id },
      search: { tab: next as WorkTab },
    });
  }

  return (
    <Tabs value={tab} onValueChange={setTab} className="h-full min-h-0 gap-0">
      <header className="shrink-0 border-b border-border/70 px-4 pb-0 pt-4 sm:px-6">
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${stageTone(item.stage)}`}
              >
                <span className="size-1.5 rounded-full bg-current opacity-70" />
                {stageLabel(item.stage)}
              </span>
              <span className="text-[10.5px] text-muted-foreground">
                {waitingOnLabel(item.waitingOn)}
              </span>
              <span className="text-[10.5px] text-muted-foreground/60">
                {priorityLabel(item.priority)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                <ShieldCheck size={11} />
                {authorityModeLabel(item.authority.mode)}
                {item.authority.reversible ? " · 可逆" : " · 不可逆"}
              </span>
            </div>
            <h1 className="mt-2 truncate font-display text-[24px] tracking-tight">
              {item.title}
            </h1>
            <p className="mt-1 max-w-[720px] text-[12px] leading-relaxed text-muted-foreground">
              {item.outcome}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
              <Link
                to="/agents"
                className="inline-flex items-center gap-1"
              >
                <Brain size={13} />
                Agents
              </Link>
            </Button>
          </div>
        </div>

        <TabsList variant="line" className="mt-3 h-9">
          {TABS.map((entry) => {
            const Icon = entry.icon;
            return (
              <TabsTrigger
                key={entry.id}
                value={entry.id}
                className="flex-none px-2.5 text-[12px]"
              >
                <Icon size={14} />
                {entry.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </header>

      <TabsContent value="overview" className="m-0 min-h-0 flex-1 overflow-hidden">
        <OverviewTab item={item} />
      </TabsContent>
      <TabsContent
        value="conversation"
        className="m-0 min-h-0 flex-1 overflow-hidden"
      >
        <ConversationTab item={item} />
      </TabsContent>
      <TabsContent value="evidence" className="m-0 min-h-0 flex-1 overflow-hidden">
        <EvidenceTab item={item} />
      </TabsContent>
      <TabsContent value="execution" className="m-0 min-h-0 flex-1 overflow-hidden">
        <ExecutionTab item={item} />
      </TabsContent>
      <TabsContent value="authority" className="m-0 min-h-0 flex-1 overflow-hidden">
        <AuthorityTab item={item} />
      </TabsContent>
    </Tabs>
  );
}
