import { ArrowClockwise, ArrowRight, WarningCircle } from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import { toast } from "sonner";
import { getTask } from "@/fixtures";
import { useUiStore } from "@/stores/ui-store";

export function ErrorBlock({
  taskId,
  code,
  message,
  retryable,
}: {
  taskId: string;
  code: string;
  message: string;
  retryable: boolean;
}) {
  const task = getTask(taskId);
  const setTab = useUiStore((state) => state.setInspectorTab);
  const setOpen = useUiStore((state) => state.setInspectorOpen);

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
      {task?.attention?.context && (
        <p className="mt-1 text-xs text-muted-foreground">
          {task.attention.context}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {retryable && (
          <Button
            type="button"
            size="sm"
            onClick={() => toast.success("已请求重试")}
          >
            <ArrowClockwise size={13} />
            重试
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setOpen(true);
            setTab("execution");
          }}
          className="text-muted-foreground"
        >
          查看详情
          <ArrowRight size={12} />
        </Button>
      </div>
    </section>
  );
}
