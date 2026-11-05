import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Stop,
} from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import {
  getAgent,
  getArtifact,
  getEvidence,
  getWorkItem,
  workItemsForBot,
} from "@/fixtures";
import type { WorkItem } from "@/fixtures/types";
import {
  reviewStatusLabel,
  stageLabel,
  stageTone,
  stageWaitingFor,
} from "@/display/labels";
import { needsHuman, projectWorkItem, useWorkItemView } from "@/lib/work-state";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { ArtifactTile } from "@/features/artifacts/artifact-preview";
import { VerifiedBadge } from "@/features/evidence/evidence-card";
import { StageBadge } from "@/components/primitives";

function TaskRow({ item }: { item: WorkItem }) {
  const openTask = useUiStore((state) => state.openTask);
  return (
    <button
      type="button"
      onClick={() => openTask(item.id)}
      className="flex w-full items-start gap-2 rounded-[10px] px-2 py-2 text-left transition-colors hover:bg-secondary/60"
    >
      <span
        className={`mt-1 size-1.5 shrink-0 rounded-full ${
          item.stage === "failed" || item.stage === "blocked"
            ? "bg-destructive"
            : needsHuman(item)
              ? "bg-warning"
              : item.stage === "working"
                ? "bg-clay"
                : "bg-muted-foreground/30"
        }`}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[12px] font-medium">{item.title}</span>
          <StageBadge stage={item.stage} />
        </span>
        <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
          {stageWaitingFor(item.stage)}
        </span>
      </span>
      <ArrowRight size={11} className="mt-1 shrink-0 text-muted-foreground" />
    </button>
  );
}

function TaskDetail({ item }: { item: WorkItem }) {
  const closeTask = useUiStore((state) => state.closeTask);
  const stopWorkItem = useDemoStore((state) => state.stopWorkItem);
  const agents = item.agentIds
    .map((id) => getAgent(id))
    .filter((agent) => agent && agent.kind !== "personal");
  const evidence = item.evidenceIds
    .map((id) => getEvidence(id))
    .filter((entry) => entry !== undefined)
    .slice(0, 4);
  const artifacts = item.artifactIds
    .map((id) => getArtifact(id))
    .filter((artifact) => artifact !== undefined);
  const latestReport = item.reports[item.reports.length - 1];

  return (
    <div className="space-y-4 px-3 py-3">
      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={closeTask}
        className="h-auto px-0 text-[11px] text-muted-foreground"
      >
        <ArrowLeft size={11} />
        任务列表
      </Button>

      <section>
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${stageTone(item.stage)}`}
          >
            <span className="size-1.5 rounded-full bg-current opacity-70" />
            {stageLabel(item.stage)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {stageWaitingFor(item.stage)}
          </span>
        </div>
        <h3 className="mt-1.5 text-[14px] font-medium">{item.title}</h3>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          {item.outcome}
        </p>
      </section>

      <section>
        <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
          验收标准
        </p>
        <ul className="mt-1 space-y-0.5">
          {item.acceptance.map((entry) => (
            <li key={entry} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <CheckCircle size={11} className="mt-0.5 shrink-0 text-sage" />
              {entry}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
          子代理
        </p>
        <div className="mt-1 space-y-1">
          {agents.map((agent) => (
            <div key={agent?.id} className="flex items-center gap-1.5 text-[11px]">
              <span
                className={`size-1.5 rounded-full ${
                  agent?.status === "running"
                    ? "animate-soft-pulse bg-clay"
                    : agent?.status === "failed"
                      ? "bg-destructive"
                      : "bg-sage"
                }`}
              />
              <span className="font-medium">{agent?.name}</span>
              <span className="truncate text-[10px] text-muted-foreground">
                {agent?.role}
              </span>
            </div>
          ))}
          {agents.length === 0 && (
            <p className="text-[10.5px] text-muted-foreground">尚未分派。</p>
          )}
        </div>
      </section>

      {latestReport && (
        <section>
          <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
            最新报告
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {latestReport.summary}
          </p>
          {latestReport.detail && (
            <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground/80">
              {latestReport.detail}
            </p>
          )}
        </section>
      )}

      {item.review && (
        <section>
          <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
            审阅
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {reviewStatusLabel(item.review.status)}
            {item.authority.reversible ? " · 可逆" : " · 不可逆"}
          </p>
        </section>
      )}

      {artifacts.length > 0 && (
        <section>
          <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
            资产
          </p>
          <div className="mt-1 space-y-1">
            {artifacts.map((artifact) => (
              <ArtifactTile key={artifact.id} artifact={artifact} compact />
            ))}
          </div>
        </section>
      )}

      {evidence.length > 0 && (
        <section>
          <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
            证据
          </p>
          <div className="mt-1 space-y-1">
            {evidence.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-1.5 rounded-[8px] border border-border/70 px-2 py-1.5"
              >
                <FileText size={11} className="text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-[10.5px]">
                  {entry.title}
                </span>
                <VerifiedBadge verified={entry.verified} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
          授权
        </p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-muted-foreground">
          {item.authority.scope}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {item.authority.reversible ? "可逆" : "不可逆"} ·{" "}
            {item.authority.grantedBy}
          </span>
          {!item.authority.stopReason && item.stage !== "done" && (
            <Button
              type="button"
              size="xs"
              variant="destructive"
              onClick={() => stopWorkItem(item.id, "你手动停止")}
              className="ml-auto"
            >
              <Stop size={10} />
              停止
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function TaskDetailWithOverrides({ item }: { item: WorkItem }) {
  const projected = useWorkItemView(item);
  return <TaskDetail item={projected} />;
}

export function TasksPanel({ botId }: { botId: string }) {
  const answers = useDemoStore((state) => state.answers);
  const reviews = useDemoStore((state) => state.reviews);
  const stopped = useDemoStore((state) => state.stopped);
  const selectedTaskId = useUiStore((state) => state.selectedTaskId);

  const selectedRaw = selectedTaskId ? getWorkItem(selectedTaskId) : undefined;
  if (selectedRaw && selectedRaw.botId === botId) {
    return <TaskDetailWithOverrides item={selectedRaw} />;
  }

  const items = workItemsForBot(botId).map((item) =>
    projectWorkItem(item, { answers, reviews, stopped }),
  );
  const queue = items.filter((item) => needsHuman(item));
  const active = items.filter(
    (item) => item.stage === "working" || item.stage === "queued",
  );
  const rest = items.filter(
    (item) =>
      !needsHuman(item) &&
      item.stage !== "working" &&
      item.stage !== "queued",
  );

  return (
    <div className="space-y-4 px-2 py-2">
      <section>
        <p className="px-2 text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
          需要你
        </p>
        <div className="mt-1 space-y-0.5">
          {queue.map((item) => (
            <TaskRow key={item.id} item={item} />
          ))}
          {queue.length === 0 && (
            <p className="px-2 py-2 text-[10.5px] text-muted-foreground">
              没有需要你的任务。
            </p>
          )}
        </div>
      </section>

      <section>
        <p className="px-2 text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
          进行中
        </p>
        <div className="mt-1 space-y-0.5">
          {active.map((item) => (
            <TaskRow key={item.id} item={item} />
          ))}
          {active.length === 0 && (
            <p className="px-2 py-2 text-[10.5px] text-muted-foreground">
              没有进行中的任务。
            </p>
          )}
        </div>
      </section>

      {rest.length > 0 && (
        <section>
          <p className="px-2 text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
            其他
          </p>
          <div className="mt-1 space-y-0.5">
            {rest.map((item) => (
              <TaskRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
