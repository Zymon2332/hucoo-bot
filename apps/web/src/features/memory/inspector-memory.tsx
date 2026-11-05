import { useState } from "react";
import {
  ArrowRight,
  Brain,
  Check,
  MagnifyingGlass,
  PushPin,
  X,
} from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import { Input } from "@hucoo/ui/components/input";
import { toast } from "sonner";
import * as memoryLabels from "@/display/labels";
import { useDemoStore } from "@/stores/demo-store";
import { EmptyState } from "@/components/primitives";

export function InspectorMemory() {
  const memories = useDemoStore((state) => state.memories);
  const acceptSuggestion = useDemoStore((state) => state.acceptSuggestion);
  const dismissSuggestion = useDemoStore((state) => state.dismissSuggestion);
  const [query, setQuery] = useState("");

  const suggested = memories.filter((memory) => memory.suggested);
  const active = memories.filter((memory) => !memory.suggested);
  const filtered = active.filter((memory) =>
    query.trim() ? memory.content.includes(query.trim()) : true,
  );

  return (
    <div className="space-y-4 p-4">
      <div className="relative">
        <MagnifyingGlass
          size={14}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索记忆"
          className="h-8 pl-8 text-xs"
        />
      </div>

      {suggested.length > 0 && (
        <section>
          <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            待确认
          </h3>
          <div className="mt-2 space-y-2">
            {suggested.map((memory) => (
              <div
                key={memory.id}
                className="rounded-[12px] border border-dashed border-clay/30 bg-accent/25 px-3 py-2"
              >
                <p className="text-[11.5px] leading-relaxed">{memory.content}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    type="button"
                    size="xs"
                    onClick={() => {
                      acceptSuggestion(memory.id);
                      toast.success("已记住");
                    }}
                  >
                    <Check size={10} />
                    记住
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    variant="ghost"
                    onClick={() => {
                      dismissSuggestion(memory.id);
                      toast("已忽略");
                    }}
                    className="text-muted-foreground"
                  >
                    <X size={10} />
                    忽略
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
          已记住
        </h3>
        <div className="mt-2 space-y-1.5">
          {filtered.map((memory) => (
            <a
              key={memory.id}
              href={`/memory?focus=${memory.id}`}
              className="group flex items-start gap-2 rounded-[10px] px-2 py-1.5 transition-colors hover:bg-secondary/60"
            >
              <Brain size={13} className="mt-0.5 shrink-0 text-clay/60" />
              <span className="min-w-0 flex-1">
                <span className="block text-[11.5px] leading-relaxed text-foreground/85">
                  {memory.content}
                </span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground/70">
                  {memoryLabels.MEMORY_CATEGORY_LABEL[memory.category]}
                  {memory.source ? ` · ${memory.source}` : ""}
                </span>
              </span>
              {memory.pinned && (
                <PushPin
                  size={11}
                  weight="fill"
                  className="mt-1 shrink-0 text-clay/50"
                />
              )}
            </a>
          ))}
        </div>
        {filtered.length === 0 && (
          <EmptyState
            title={query ? "没有匹配的记忆" : "还没有记忆"}
            description={
              query
                ? "换个关键词试试。"
                : "你可以在对话里说「记住这条」，或让助理在征得同意后记录。"
            }
          />
        )}
      </section>

      <a
        href="/memory"
        className="inline-flex items-center gap-1 text-[11px] font-medium text-clay hover:opacity-80"
      >
        打开记忆中心
        <ArrowRight size={12} />
      </a>
    </div>
  );
}
