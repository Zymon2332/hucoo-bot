import { useMemo, useState } from "react";
import { ArrowSquareOut, Cube } from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { getArtifact, getTask } from "@/fixtures";
import { artifactStatusLabel } from "@/display/labels";
import { ArtifactKindBadge, EmptyState } from "@/components/primitives";
import { ArtifactBody } from "./artifact-preview";

export function InspectorArtifacts({ taskId }: { taskId?: string }) {
  const task = taskId ? getTask(taskId) : undefined;
  const artifacts = useMemo(
    () =>
      (task?.artifactIds ?? [])
        .map((id) => getArtifact(id))
        .filter((artifact) => artifact !== undefined),
    [task?.artifactIds],
  );
  const [selectedId, setSelectedId] = useState(artifacts[0]?.id);
  const selected =
    artifacts.find((artifact) => artifact.id === selectedId) ?? artifacts[0];

  if (artifacts.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={<Cube size={22} />}
          title="这个会话还没有产物"
          description="当任务产生文档、表格或网页时，会出现在这里。"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col">
      <div className="space-y-1 border-b border-border/70 p-3">
        {artifacts.map((artifact) => (
          <button
            key={artifact.id}
            type="button"
            onClick={() => setSelectedId(artifact.id)}
            className={cn(
              "flex w-full items-center gap-2 rounded-[10px] px-2 py-1.5 text-left transition-colors",
              selected?.id === artifact.id
                ? "bg-secondary"
                : "hover:bg-secondary/60",
            )}
          >
            <ArtifactKindBadge kind={artifact.kind} withLabel={false} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-medium">
                {artifact.title}
              </span>
              <span className="block truncate text-[10px] text-muted-foreground">
                {artifactStatusLabel(artifact.status)} · {artifact.updatedAt}
              </span>
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="min-w-0 flex-1 truncate text-[13px] font-medium">
              {selected.title}
            </h3>
            <a
              href={`/artifact/${selected.id}`}
              aria-label="全屏打开"
              className="grid size-7 place-items-center rounded-[8px] text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <ArrowSquareOut size={14} />
            </a>
          </div>
          <div className="rounded-[12px] border border-border bg-card/60 p-3">
            <ArtifactBody artifact={selected} />
          </div>
        </div>
      )}
    </div>
  );
}
