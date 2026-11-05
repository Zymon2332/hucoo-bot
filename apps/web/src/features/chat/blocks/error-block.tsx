import { ArrowClockwise, ArrowRight, WarningCircle } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@hucoo/ui/components/button";
import { getWorkItem } from "@/fixtures";
import { useWorkItemView } from "@/lib/work-state";

export function ErrorBlock({
  workItemId,
  code,
  message,
  retryable,
}: {
  workItemId: string;
  code: string;
  message: string;
  retryable: boolean;
}) {
  const raw = getWorkItem(workItemId);
  const item = raw ? useWorkItemView(raw) : undefined;

  return (
    <section className="rounded-[var(--radius-card)] border border-destructive/25 bg-destructive/[0.045] px-4 py-3.5">
      <header className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-destructive">
        <WarningCircle size={14} weight="fill" />
        无法继续
        <span className="ml-auto font-mono text-[10px] normal-case tracking-normal text-destructive/70">
          {code}
        </span>
      </header>
      <p className="mt-2 text-sm leading-relaxed">{message}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {retryable && (
          <Button type="button" size="sm">
            <ArrowClockwise size={13} />
            重试
          </Button>
        )}
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
        >
          <Link
            to="/w/$workItemId"
            params={{ workItemId }}
            search={{ tab: "overview" }}
          >
            查看详情
            <ArrowRight size={12} />
          </Link>
        </Button>
      </div>
      {item?.verification.summary && (
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          {item.verification.summary}
        </p>
      )}
    </section>
  );
}
