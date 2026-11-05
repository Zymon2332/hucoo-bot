import { Eye, Lightning, X } from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { toast } from "sonner";
import { getCandidate, getRule } from "@/fixtures";
import { useDemoStore } from "@/stores/demo-store";

export function CandidateBlock({ candidateId }: { candidateId: string }) {
  const candidate = getCandidate(candidateId);
  const resolved = useDemoStore((state) =>
    state.candidates.find((item) => item.id === candidateId),
  );
  const resolveCandidate = useDemoStore((state) => state.resolveCandidate);
  const setRuleMode = useDemoStore((state) => state.setRuleMode);

  if (!candidate) return null;

  const status = resolved?.status ?? candidate.status;
  const rule = getRule(candidate.ruleId);

  return (
    <section className="rounded-[var(--radius-card)] border border-dashed border-clay/30 bg-accent/25 px-4 py-3.5">
      <header className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-clay">
        <Eye size={14} />
        观察到一件事
        <span className="ml-auto rounded-full border border-clay/25 px-2 py-0.5 text-[10px] font-normal normal-case tracking-normal text-clay/80">
          {rule?.name ?? "规则"}
        </span>
      </header>

      <p className="mt-2 text-sm font-medium">{candidate.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-foreground/80">
        {candidate.action}
      </p>
      <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
        {candidate.reason}
      </p>

      {status === "open" ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => {
              resolveCandidate(candidate.id, "accepted");
              toast.success("已交给小满执行一次");
            }}
          >
            <Lightning size={13} weight="fill" />
            执行一次
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              resolveCandidate(candidate.id, "ignored");
              toast("已忽略");
            }}
            className="text-muted-foreground"
          >
            <X size={13} />
            忽略
          </Button>
          <Button
            type="button"
            size="sm"
            variant="link"
            onClick={() => {
              setRuleMode(candidate.ruleId, "auto");
              resolveCandidate(candidate.id, "accepted");
              toast.success(`「${rule?.name ?? "规则"}」已切换为自动`);
            }}
            className="ml-auto text-[11px]"
          >
            总是这样做
          </Button>
        </div>
      ) : (
        <p
          className={cn(
            "mt-3 text-[11px]",
            status === "accepted" ? "text-sage" : "text-muted-foreground",
          )}
        >
          {status === "accepted" ? "已执行" : "已忽略"}
        </p>
      )}
    </section>
  );
}
