import type { ReactNode } from "react";
import {
  CheckCircle,
  Circle,
  CircleNotch,
  Code,
  Eye,
  FileText,
  Globe,
  Lightning,
  MinusCircle,
  Table,
  XCircle,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import {
  ARTIFACT_KIND_LABEL,
  stageLabel,
  stageTone,
} from "@/display/labels";
import type { ArtifactKind, Profile, StepStatus } from "@/fixtures/types";

export function AssistantAvatar({
  profile,
  size = "md",
  status,
}: {
  profile: Profile;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "thinking" | "idle";
}) {
  const sizes = {
    sm: "size-7 text-[11px] rounded-[9px]",
    md: "size-8 text-xs rounded-[10px]",
    lg: "size-11 text-sm rounded-[14px]",
    xl: "size-14 text-lg rounded-[18px]",
  } as const;

  return (
    <span className="relative inline-flex shrink-0">
      <span
        aria-hidden
        className={cn(
          "grid place-items-center font-display font-semibold tracking-tight text-white shadow-[var(--shadow-card)]",
          sizes[size],
        )}
        style={{ backgroundColor: profile.accent }}
      >
        {profile.initials}
      </span>
      {status && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background",
            status === "online" && "bg-sage",
            status === "thinking" && "animate-soft-pulse bg-warning",
            status === "idle" && "bg-muted-foreground/50",
          )}
        />
      )}
    </span>
  );
}

export function StageBadge({
  stage,
  className,
}: {
  stage: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
        stageTone(stage),
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {stageLabel(stage)}
    </span>
  );
}

export function ModeBadge({ mode }: { mode: "observe" | "auto" }) {
  const Icon = mode === "observe" ? Eye : Lightning;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
      <Icon size={12} weight={mode === "auto" ? "fill" : "regular"} />
      {mode === "observe" ? "观察" : "自动"}
    </span>
  );
}

const ARTIFACT_ICON: Record<ArtifactKind, Icon> = {
  markdown: FileText,
  code: Code,
  table: Table,
  html: Globe,
};

export function ArtifactKindBadge({
  kind,
  withLabel = true,
}: {
  kind: ArtifactKind;
  withLabel?: boolean;
}) {
  const Icon = ARTIFACT_ICON[kind];
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      <Icon size={11} />
      {withLabel && ARTIFACT_KIND_LABEL[kind]}
    </span>
  );
}

export function StepStatusIcon({
  status,
  size = 15,
}: {
  status: StepStatus;
  size?: number;
}) {
  if (status === "done")
    return <CheckCircle size={size} weight="fill" className="text-sage" />;
  if (status === "running")
    return <CircleNotch size={size} className="animate-spin text-clay" />;
  if (status === "failed")
    return <XCircle size={size} weight="fill" className="text-destructive" />;
  if (status === "skipped")
    return <MinusCircle size={size} className="text-muted-foreground/60" />;
  return <Circle size={size} className="text-muted-foreground/40" />;
}

export function SectionHeading({
  children,
  aside,
}: {
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-section-label">
        {children}
      </h2>
      {aside}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border px-6 py-10 text-center">
      {icon && <div className="mb-3 text-muted-foreground">{icon}</div>}
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground">
      {children}
    </kbd>
  );
}
