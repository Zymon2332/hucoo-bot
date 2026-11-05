import { useState } from "react";
import {
  Check,
  PencilSimple,
  X,
  CheckCircle,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { Textarea } from "@hucoo/ui/components/textarea";
import { toast } from "sonner";
import { getArtifact, getTask } from "@/fixtures";
import { ArtifactKindBadge } from "@/components/primitives";
import { useDemoStore } from "@/stores/demo-store";
import { reviewStatusLabel } from "@/display/labels";

export function ReviewBlock({ taskId }: { taskId: string }) {
  const task = getTask(taskId);
  const review = task?.review;
  const artifact = review ? getArtifact(review.artifactId) : undefined;
  const resolved = useDemoStore((state) =>
    review ? state.reviews[review.id] : undefined,
  );
  const storedNote = useDemoStore((state) =>
    review ? state.reviewNotes[review.id] : undefined,
  );
  const resolveReview = useDemoStore((state) => state.resolveReview);
  const [mode, setMode] = useState<"accepted" | "revision_requested" | "rejected" | null>(
    null,
  );
  const [note, setNote] = useState("");

  if (!review || !artifact) return null;

  if (resolved) {
    return (
      <section className="rounded-[var(--radius-card)] border border-border bg-card/60 px-4 py-3">
        <header className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-section-label">
          <CheckCircle size={14} weight="fill" className="text-sage" />
          {reviewStatusLabel(resolved)}
        </header>
        <p className="mt-2 text-sm">{artifact.title}</p>
        {storedNote && (
          <p className="mt-1 text-xs text-muted-foreground">{storedNote}</p>
        )}
      </section>
    );
  }

  function submit() {
    if (!mode || !review) return;
    resolveReview(review.id, mode, note.trim() || undefined);
    toast.success(
      mode === "accepted"
        ? "已接受结果"
        : mode === "revision_requested"
          ? "已请求修订"
          : "已拒绝结果",
    );
    setMode(null);
    setNote("");
  }

  return (
    <section
      id={`review-${review.id}`}
      className="rounded-[var(--radius-card)] border border-border bg-card px-4 py-3.5 shadow-[var(--shadow-card)]"
    >
      <header className="flex items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-section-label">
          审阅
        </span>
        <ArtifactKindBadge kind={artifact.kind} />
        <a
          href={`/artifact/${artifact.id}`}
          className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
        >
          打开
          <ArrowSquareOut size={12} />
        </a>
      </header>

      <p className="mt-2 text-sm font-medium">{artifact.title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{artifact.summary}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "accepted" ? "secondary" : "outline"}
          onClick={() => {
            setMode("accepted");
            setNote("");
          }}
          className={cn(mode === "accepted" && "text-sage")}
        >
          <Check size={13} />
          接受
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "revision_requested" ? "secondary" : "outline"}
          onClick={() => setMode("revision_requested")}
          className={cn(mode === "revision_requested" && "text-warning")}
        >
          <PencilSimple size={13} />
          请求修订
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={() => setMode("rejected")}
          className={cn(mode === "rejected" && "ring-2 ring-destructive/25")}
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
    </section>
  );
}
