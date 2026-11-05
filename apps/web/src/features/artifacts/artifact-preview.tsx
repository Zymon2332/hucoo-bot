import { ArrowSquareOut, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { artifactStatusLabel } from "@/display/labels";
import type { Artifact } from "@/fixtures/types";
import { ArtifactKindBadge } from "@/components/primitives";
import { MarkdownRenderer } from "./renderers/markdown-renderer";
import { CodeRenderer } from "./renderers/code-renderer";
import { TableRenderer } from "./renderers/table-renderer";
import { HtmlRenderer } from "./renderers/html-renderer";

export function ArtifactBody({
  artifact,
  className,
}: {
  artifact: Artifact;
  className?: string;
}) {
  return (
    <div className={cn("min-h-0", className)}>
      {artifact.kind === "markdown" && (
        <MarkdownRenderer content={artifact.content} />
      )}
      {artifact.kind === "code" && <CodeRenderer content={artifact.content} />}
      {artifact.kind === "table" && <TableRenderer content={artifact.content} />}
      {artifact.kind === "html" && <HtmlRenderer content={artifact.content} />}
    </div>
  );
}

export function ArtifactTile({
  artifact,
  onOpen,
  compact = false,
}: {
  artifact: Artifact;
  onOpen?: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group flex w-full items-center gap-3 rounded-[12px] border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-clay/40 hover:bg-accent/40",
        compact && "px-2.5 py-2",
      )}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-secondary text-muted-foreground">
        <ArtifactKindBadge kind={artifact.kind} withLabel={false} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {artifact.title}
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
          {artifact.summary}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2 text-[11px] text-muted-foreground">
        {artifact.status === "accepted" ? (
          <CheckCircle size={14} className="text-sage" />
        ) : (
          artifactStatusLabel(artifact.status)
        )}
        <ArrowSquareOut
          size={14}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        />
      </span>
    </button>
  );
}
