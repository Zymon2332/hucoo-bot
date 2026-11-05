import { Brain } from "@phosphor-icons/react";
import { getMemory } from "@/fixtures";

export function MemoryBlock({
  memoryId,
  quote,
}: {
  memoryId: string;
  quote: string;
}) {
  const memory = getMemory(memoryId);

  return (
    <a
      href={`/memory?focus=${memoryId}`}
      className="group inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-clay/30 hover:text-foreground"
      title={memory?.content}
    >
      <Brain size={12} className="shrink-0 text-clay/70" />
      <span className="truncate">
        <span className="text-section-label">记得</span>：{quote}
      </span>
    </a>
  );
}
