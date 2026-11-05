import { useMemo, useState } from "react";
import { SealCheck } from "@phosphor-icons/react";
import { getEvidence } from "@/fixtures";
import type { WorkItem } from "@/fixtures/types";
import { EmptyState } from "@/components/primitives";
import { EvidenceCard } from "./evidence-card";
import { EvidenceDetail } from "./evidence-detail";

export function EvidenceTab({ item }: { item: WorkItem }) {
  const evidence = useMemo(
    () =>
      item.evidenceIds
        .map((id) => getEvidence(id))
        .filter((entry) => entry !== undefined),
    [item.evidenceIds],
  );
  const [selectedId, setSelectedId] = useState(evidence[0]?.id);
  const selected =
    evidence.find((entry) => entry.id === selectedId) ?? evidence[0];

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[1000px] px-4 pb-12 pt-5 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-[15px] font-medium">证据</h2>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">
              产物、变更、来源与 Agent 会话。不要只看摘要。
            </p>
          </div>
          <span className="flex items-center gap-1 text-[10.5px] text-muted-foreground">
            <SealCheck size={13} className="text-sage" />
            {evidence.filter((entry) => entry.verified === "yes").length} 份已验证
          </span>
        </header>

        {evidence.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="还没有证据"
              description="当工作项产生结果或调用外部 Agent 时，产物与来源会出现在这里。"
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="space-y-1.5">
              {evidence.map((entry) => (
                <EvidenceCard
                  key={entry.id}
                  evidence={entry}
                  active={entry.id === selected?.id}
                  onClick={() => setSelectedId(entry.id)}
                />
              ))}
            </div>
            {selected && (
              <section className="rounded-[16px] border border-border bg-card/70 p-4">
                <EvidenceDetail evidence={selected} />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
