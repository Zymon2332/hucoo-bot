import { ArrowRight, CheckSquare } from "@phosphor-icons/react";
import { getAgent, getWorkItem } from "@/fixtures";
import { stageLabel, stageTone } from "@/display/labels";
import { useWorkItemView } from "@/lib/work-state";
import { useUiStore } from "@/stores/ui-store";

export function TaskBlock({ taskId }: { taskId: string }) {
  const raw = getWorkItem(taskId);
  const item = raw ? useWorkItemView(raw) : undefined;
  const openTask = useUiStore((state) => state.openTask);

  if (!item) return null;

  const workers = item.agentIds
    .map((id) => getAgent(id))
    .filter((agent) => agent && agent.kind !== "personal")
    .slice(0, 2);

  return (
    <button
      type="button"
      onClick={() => openTask(item.id)}
      className="group w-full rounded-[12px] border border-border bg-card/70 px-3.5 py-3 text-left transition-colors hover:border-clay/25 hover:bg-card"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] font-medium">{item.title}</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${stageTone(item.stage)}`}
        >
          <span className="size-1.5 rounded-full bg-current opacity-70" />
          {stageLabel(item.stage)}
        </span>
        <ArrowRight
          size={12}
          className="ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5"
        />
      </div>

      <div className="mt-1.5 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-muted-foreground">
        <CheckSquare size={12} className="mt-0.5 shrink-0" />
        <span>
          验收：{item.acceptance.slice(0, 2).join("；")}
          {item.acceptance.length > 2 ? "…" : ""}
        </span>
      </div>

      {workers.length > 0 && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground/80">
          <span>子代理</span>
          {workers.map((agent) => (
            <span
              key={agent?.id}
              className="rounded bg-secondary px-1.5 py-0.5"
            >
              {agent?.name}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
