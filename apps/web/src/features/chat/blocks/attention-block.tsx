import { useState } from "react";
import { CheckCircle, Question } from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { Input } from "@hucoo/ui/components/input";
import { getWorkItem } from "@/fixtures";
import { useWorkItemView } from "@/lib/work-state";
import { useDemoStore } from "@/stores/demo-store";

export function AttentionBlock({ workItemId }: { workItemId: string }) {
  const raw = getWorkItem(workItemId);
  const item = raw ? useWorkItemView(raw) : undefined;
  const attention = item?.attention;
  const answerAttention = useDemoStore((state) => state.answerAttention);
  const [selected, setSelected] = useState<string | null>(null);
  const [freeText, setFreeText] = useState("");

  if (!attention) return null;

  if (attention.status === "answered" || attention.answer) {
    return (
      <section className="rounded-[var(--radius-card)] border border-border bg-card/60 px-4 py-3">
        <header className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-section-label">
          <CheckCircle size={14} weight="fill" className="text-sage" />
          已回答
        </header>
        <p className="mt-2 text-sm text-muted-foreground">{attention.question}</p>
        <p className="mt-2 text-sm font-medium">{attention.answer}</p>
      </section>
    );
  }

  const selectedOption = attention.options.find(
    (option) => option.id === selected,
  );
  const value = freeText.trim() || selectedOption?.label || "";

  return (
    <section
      id={`attention-${attention.id}`}
      className="overflow-hidden rounded-[var(--radius-card)] border border-clay/25 bg-accent/45"
    >
      <div className="px-4 py-3.5">
        <header className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-clay">
          <Question size={14} weight="fill" />
          需要你决定
        </header>
        <p className="mt-2 text-[15px] font-medium leading-relaxed">
          {attention.question}
        </p>
        {attention.context && (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {attention.context}
          </p>
        )}

        <div className="mt-3 space-y-1.5">
          {attention.options.map((option) => {
            const active = selected === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSelected(option.id);
                  setFreeText("");
                }}
                className={cn(
                  "flex w-full items-start gap-2 rounded-[10px] border px-3 py-2 text-left transition-colors",
                  active
                    ? "border-clay/50 bg-card"
                    : "border-transparent bg-card/50 hover:bg-card",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
                    active ? "border-clay bg-clay" : "border-border",
                  )}
                >
                  {active && <span className="size-1.5 rounded-full bg-white" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm">{option.label}</span>
                  {option.hint && (
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                      {option.hint}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {attention.allowFreeText && (
          <Input
            value={freeText}
            onChange={(event) => {
              setFreeText(event.target.value);
              setSelected(null);
            }}
            placeholder="或者直接说你的想法…"
            className="mt-2 h-9 rounded-[10px] bg-card text-sm"
          />
        )}

        <div className="mt-3 flex items-center justify-end">
          <Button
            type="button"
            size="sm"
            disabled={!value}
            onClick={() => answerAttention(attention.id, value)}
          >
            回答
          </Button>
        </div>
      </div>
    </section>
  );
}
