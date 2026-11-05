import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import { getArtifact, getTask } from "@/fixtures";
import { ArtifactTile } from "@/features/artifacts/artifact-preview";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { reviewStatusLabel } from "@/display/labels";

export function ResultBlock({
  taskId,
  summary,
}: {
  taskId: string;
  summary: string;
}) {
  const task = getTask(taskId);
  const setTab = useUiStore((state) => state.setInspectorTab);
  const setOpen = useUiStore((state) => state.setInspectorOpen);
  const resolved = useDemoStore((state) =>
    task?.review ? state.reviews[task.review.id] : undefined,
  );

  if (!task) return null;

  const artifacts = task.artifactIds
    .map((id) => getArtifact(id))
    .filter((artifact) => artifact !== undefined);

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-card px-4 py-3.5 shadow-[var(--shadow-card)]">
      <header className="flex items-center gap-2">
        <CheckCircle size={15} weight="fill" className="text-sage" />
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-section-label">
          结果
        </span>
        {task.review && (
          <span className="ml-auto text-[11px] text-muted-foreground">
            {resolved ? reviewStatusLabel(resolved) : "待你确认"}
          </span>
        )}
      </header>

      <p className="mt-2 text-sm leading-relaxed">{summary}</p>

      {artifacts.length > 0 && (
        <div className="mt-3 space-y-2">
          {artifacts.map((artifact) => (
            <ArtifactTile
              key={artifact.id}
              artifact={artifact}
              onOpen={() => {
                window.location.href = `/artifact/${artifact.id}`;
              }}
            />
          ))}
        </div>
      )}

      {task.review && !resolved && (
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={() => {
            setOpen(true);
            setTab("artifacts");
          }}
          className="mt-3 h-auto px-0 text-[12px]"
        >
          打开并审阅
          <ArrowRight size={13} />
        </Button>
      )}
    </section>
  );
}
