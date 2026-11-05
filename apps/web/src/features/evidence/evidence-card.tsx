import {
  Code,
  FileText,
  GitDiff,
  LinkSimple,
  TerminalWindow,
  TestTube,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import type { Evidence } from "@/fixtures/types";
import { evidenceKindLabel, verifiedLabel } from "@/display/labels";

const ICONS: Record<Evidence["kind"], Icon> = {
  artifact: FileText,
  diff: GitDiff,
  source: LinkSimple,
  session: TerminalWindow,
  log: TerminalWindow,
  test: TestTube,
};

export function EvidenceIcon({ kind }: { kind: Evidence["kind"] }) {
  const Icon = ICONS[kind] ?? Code;
  return <Icon size={14} />;
}

export function VerifiedBadge({ verified }: { verified: Evidence["verified"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
        verified === "yes" && "bg-sage/10 text-sage",
        verified === "partial" && "bg-warning/10 text-warning",
        verified === "no" && "bg-destructive/10 text-destructive",
      )}
    >
      {verifiedLabel(verified)}
    </span>
  );
}

export function EvidenceCard({
  evidence,
  active,
  onClick,
}: {
  evidence: Evidence;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-2.5 rounded-[12px] border px-3 py-2.5 text-left transition-colors",
        active
          ? "border-clay/35 bg-accent/35"
          : "border-border bg-card/60 hover:bg-secondary/60",
      )}
    >
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-[8px] bg-secondary text-muted-foreground">
        <EvidenceIcon kind={evidence.kind} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[12px] font-medium">
            {evidence.title}
          </span>
          <VerifiedBadge verified={evidence.verified} />
        </span>
        <span className="mt-0.5 block truncate text-[10.5px] text-muted-foreground">
          {evidenceKindLabel(evidence.kind)} · {evidence.at}
        </span>
        <span className="mt-1 block line-clamp-2 text-[10.5px] leading-relaxed text-muted-foreground/80">
          {evidence.summary}
        </span>
      </span>
    </button>
  );
}
