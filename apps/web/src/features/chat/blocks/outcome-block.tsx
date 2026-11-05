import { useState } from "react";
import {
  ArrowRight,
  ArrowSquareOut,
  Check,
  CheckCircle,
  PencilSimple,
  X,
} from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import { Textarea } from "@hucoo/ui/components/textarea";
import { getArtifact, getWorkItem } from "@/fixtures";
import { reviewStatusLabel } from "@/display/labels";
import { useWorkItemView } from "@/lib/work-state";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { ArtifactKindBadge } from "@/components/primitives";
import { ArtifactTile } from "@/features/artifacts/artifact-preview";

type Decision = "accepted" | "revision_requested" | "rejected";

export function OutcomeBlock({ taskId }: { taskId: string }) {
  const raw = getWorkItem(taskId);
  const item = raw ? useWorkItemView(raw) : undefined;
  const resolveReview = useDemoStore((state) => state.resolveReview);
  const openTask = useUiStore((state) => state.openTask);

  const [mode, setMode] = useState<Decision | null>(null);
  const [note, setNote] = useState("");

  if (!item) return null;

  const artifact = item.review
    ? getArtifact(item.review.artifactId)
    : item.artifactIds[0]
      ? getArtifact(item.artifactIds[0])
      : undefined;
  const artifacts = item.artifactIds
    .map((id) => getArtifact(id))
    .filter((entry) => entry !== undefined);
  const reviewResolved =
    item.review && item.review.status !== "pending" ? item.review.status : null;

  function submit() {
    if (!item?.review || !mode) return;
    resolveReview(item.review.id, mode, note.trim() || undefined);
    setMode(null);
    setNote("");
  }

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-card px-4 py-3.5 shadow-[var(--shadow-card)]">
      <header className="flex items-center gap-2">
        <CheckCircle size={15} weight="fill" className="text-sage" />
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-section-label">
          结果
        </span>
        {artifact && <ArtifactKindBadge kind={artifact.kind} />}
        {item.review && (
          <span className="ml-auto text-[11px] text-muted-foreground">
            {reviewResolved
              ? reviewStatusLabel(reviewResolved)
              : "待你确认"}
          </span>
        )}
      </header>

      <p className="mt-2 text-sm leading-relaxed">{item.outcome}</p>

      {artifacts.length > 0 && (
        <div className="mt-3 space-y-2">
          {artifacts.map((entry) => (
            <ArtifactTile
              key={entry.id}
              artifact={entry}
              onOpen={() => {
                window.location.href = `/artifact/${entry.id}`;
              }}
            />
          ))}
        </div>
      )}

      {item.review && !reviewResolved && (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode === "accepted" ? "secondary" : "outline"}
              onClick={() => {
                setMode("accepted");
                setNote("");
              }}
              className={mode === "accepted" ? "text-sage" : undefined}
            >
              <Check size={13} />
              接受
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "revision_requested" ? "secondary" : "outline"}
              onClick={() => setMode("revision_requested")}
              className={mode === "revision_requested" ? "text-warning" : undefined}
            >
              <PencilSimple size={13} />
              请求修订
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => setMode("rejected")}
            >
              <X size={13} />
              拒绝
            </Button>
          </div>

          {mode && (
            <div className="mt-3 space-y-2 border-t border-border/70 pt-3">
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={
                  mode === "accepted"
                    ? "可选：留一句备注"
                    : mode === "revision_requested"
                      ? "告诉我需要改哪里"
                      : "告诉我为什么不用这个结果"
                }
                rows={2}
                className="min-h-16 resize-none rounded-[10px] bg-background/40 text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setMode(null)}
                >
                  取消
                </Button>
                <Button type="button" size="sm" onClick={submit}>
                  确认
                </Button>
              </div>
            </div>
          )}

          {artifact && (
            <a
              href={`/artifact/${artifact.id}`}
              className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              打开完整产物
              <ArrowSquareOut size={11} />
            </a>
          )}
        </>
      )}

      {reviewResolved && (
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={() => openTask(taskId)}
          className="mt-2 h-auto px-0 text-[11px]"
        >
          在右侧查看任务
          <ArrowRight size={11} />
        </Button>
      )}
    </section>
  );
}
