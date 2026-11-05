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
  Avatar,
  AvatarBadge,
  AvatarFallback,
} from "@hucoo/ui/components/avatar";
import { Badge } from "@hucoo/ui/components/badge";
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
    sm: { avatar: "size-7 rounded-[9px]", fallback: "rounded-[9px] text-[10px]" },
    md: { avatar: "size-8 rounded-[10px]", fallback: "rounded-[10px] text-[11px]" },
    lg: { avatar: "size-11 rounded-[13px]", fallback: "rounded-[13px] text-[13px]" },
    xl: { avatar: "size-14 rounded-[16px]", fallback: "rounded-[16px] text-[16px]" },
  } as const;
  const item = sizes[size];

  return (
    <Avatar aria-hidden className={cn(item.avatar, "after:hidden")}>
      <AvatarFallback
        className={cn("font-semibold tracking-tight text-white", item.fallback)}
        style={{ backgroundColor: profile.accent }}
      >
        {profile.initials}
      </AvatarFallback>
      {status && (
        <AvatarBadge
          className={cn(
            "border-2 border-background ring-0",
            status === "online" && "bg-sage",
            status === "thinking" && "animate-soft-pulse bg-warning",
            status === "idle" && "bg-muted-foreground/50",
          )}
        />
      )}
    </Avatar>
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
    <Badge
      variant="secondary"
      className={cn(
        "h-auto gap-1.5 rounded-full border-0 px-2 py-0.5 text-[11px] font-medium",
        stageTone(stage),
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {stageLabel(stage)}
    </Badge>
  );
}

export function ModeBadge({ mode }: { mode: "observe" | "auto" }) {
  const Icon = mode === "observe" ? Eye : Lightning;
  return (
    <Badge
      variant="outline"
      className="h-auto gap-1 rounded-full px-2 py-0.5 text-[11px] font-normal text-muted-foreground"
    >
      <Icon size={12} weight={mode === "auto" ? "fill" : "regular"} />
      {mode === "observe" ? "观察" : "自动"}
    </Badge>
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
    <Badge
      variant="secondary"
      className="h-auto gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
    >
      <Icon size={11} />
      {withLabel && ARTIFACT_KIND_LABEL[kind]}
    </Badge>
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
