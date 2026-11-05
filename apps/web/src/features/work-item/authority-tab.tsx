import { useState } from "react";
import {
  ArrowsClockwise,
  ClockCounterClockwise,
  Lock,
  ShieldCheck,
  Stop,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { Textarea } from "@hucoo/ui/components/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@hucoo/ui/components/dialog";
import type { WorkItem } from "@/fixtures/types";
import { auditKindLabel, authorityModeLabel } from "@/display/labels";
import { useDemoStore } from "@/stores/demo-store";

export function AuthorityTab({ item }: { item: WorkItem }) {
  const stopWorkItem = useDemoStore((state) => state.stopWorkItem);
  const [stopOpen, setStopOpen] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[880px] space-y-6 px-4 pb-12 pt-5 sm:px-6">
        <section className="rounded-[16px] border border-border bg-card/70 p-4">
          <header className="flex flex-wrap items-center gap-2">
            <ShieldCheck size={16} className="text-clay" />
            <h2 className="text-[14px] font-medium">授权</h2>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
              {authorityModeLabel(item.authority.mode)}
            </span>
            <span
              className={cn(
                "ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]",
                item.authority.reversible
                  ? "bg-sage/10 text-sage"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {item.authority.reversible ? (
                <ArrowsClockwise size={11} />
              ) : (
                <Lock size={11} />
              )}
              {item.authority.reversible ? "可逆" : "不可逆"}
            </span>
          </header>

          <p className="mt-3 text-[12.5px] leading-relaxed">
            {item.authority.scope}
          </p>

          {item.authority.rules.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
                依据规则
              </p>
              <ul className="mt-1.5 space-y-1">
                {item.authority.rules.map((rule) => (
                  <li key={rule} className="text-[11.5px] text-muted-foreground">
                    · {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/70 pt-3 text-[10.5px] text-muted-foreground">
            <span>授权人：{item.authority.grantedBy}</span>
            <span>授权时间：{item.authority.grantedAt}</span>
            {item.authority.stopReason && (
              <span className="text-destructive">
                已停止：{item.authority.stopReason}
              </span>
            )}
          </div>

          {!item.authority.stopReason && item.stage !== "done" && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => setStopOpen(true)}
              className="mt-3"
            >
              <Stop size={13} />
              停止这个工作项
            </Button>
          )}
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-[14px] font-medium">
            <ClockCounterClockwise size={15} className="text-clay" />
            审计记录
          </h2>
          <ol className="mt-3 space-y-3 border-l border-border pl-4">
            {item.audit.map((entry) => (
              <li key={entry.id} className="relative">
                <span className="absolute -left-[21px] top-1 size-2 rounded-full border-2 border-background bg-clay/60" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-medium">
                    {auditKindLabel(entry.kind)}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">
                    {entry.at}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {entry.actor}
                  </span>
                </div>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                  {entry.action}
                  {entry.detail ? ` · ${entry.detail}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {item.decisions.length > 0 && (
          <section>
            <h2 className="text-[14px] font-medium">已做判断</h2>
            <div className="mt-2 space-y-2">
              {item.decisions.map((decision) => (
                <div
                  key={decision.id}
                  className="rounded-[12px] border border-border bg-card/60 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11.5px] font-medium">
                      {decision.question}
                    </span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {decision.at} · {decision.by === "human" ? "你" : "小满"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11.5px] text-foreground/80">
                    {decision.answer}
                  </p>
                  {decision.reasoning && (
                    <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                      {decision.reasoning}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="text-[10.5px] leading-relaxed text-muted-foreground/70">
          授权只覆盖这件工作。停止后不会自动恢复；需要重新授权才能继续。
        </p>
      </div>

      <Dialog open={stopOpen} onOpenChange={setStopOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>停止这个工作项？</DialogTitle>
            <DialogDescription>
              已执行的可逆动作会保留；后续步骤不会再继续。需要重新授权才能恢复。
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="可选：说明停止原因"
            rows={2}
            className="min-h-16 resize-none"
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStopOpen(false)}
            >
              取消
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                stopWorkItem(item.id, reason.trim() || "你手动停止");
                setStopOpen(false);
              }}
            >
              停止
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
