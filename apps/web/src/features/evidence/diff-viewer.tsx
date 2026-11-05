import type { Evidence } from "@/fixtures/types";

export function DiffViewer({ diff }: { diff: NonNullable<Evidence["diff"]> }) {
  const lines = diff.patch.split("\n");
  return (
    <div className="overflow-hidden rounded-[12px] border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary/60 px-3 py-1.5">
        <span className="truncate font-mono text-[11px]">{diff.file}</span>
        <span className="shrink-0 font-mono text-[10px]">
          <span className="text-sage">+{diff.additions}</span>{" "}
          <span className="text-destructive">-{diff.deletions}</span>
        </span>
      </div>
      <pre className="max-h-[420px] overflow-auto bg-background/40 p-3 font-mono text-[11px] leading-relaxed">
        {lines.map((line, index) => (
          <div
            key={index}
            className={
              line.startsWith("+")
                ? "bg-sage/10 text-sage"
                : line.startsWith("-")
                  ? "bg-destructive/10 text-destructive"
                  : "text-muted-foreground"
            }
          >
            {line || " "}
          </div>
        ))}
      </pre>
    </div>
  );
}
