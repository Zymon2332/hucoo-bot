import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Cube, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import { Card } from "@hucoo/ui/components/card";
import { Input } from "@hucoo/ui/components/input";
import { cn } from "@hucoo/ui";
import { ARTIFACTS, BOTS } from "@/fixtures";
import type { Artifact, ArtifactKind } from "@/fixtures/types";
import { ArtifactKindBadge } from "@/components/primitives";
import { ArtifactBody } from "@/features/artifacts/artifact-preview";
import { useUiStore } from "@/stores/ui-store";

const FILTERS: Array<{ id: ArtifactKind | "all"; label: string }> = [
  { id: "all", label: "全部" },
  { id: "markdown", label: "文档" },
  { id: "table", label: "表格" },
  { id: "html", label: "网页" },
  { id: "code", label: "代码" },
];

function botName(artifact: Artifact) {
  return BOTS.find((bot) => bot.id === artifact.botId)?.name ?? "未知 bot";
}

export function AssetsPage({ embedded = false }: { embedded?: boolean }) {
  const closeModal = useUiStore((state) => state.closeModal);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ArtifactKind | "all">("all");
  const [selectedId, setSelectedId] = useState<string | undefined>(
    ARTIFACTS[0]?.id,
  );

  const filtered = useMemo(
    () =>
      ARTIFACTS.filter((artifact) => {
        if (kind !== "all" && artifact.kind !== kind) return false;
        const text = `${artifact.title} ${artifact.summary} ${botName(artifact)}`;
        return query.trim() ? text.includes(query.trim()) : true;
      }),
    [kind, query],
  );
  const selected =
    filtered.find((artifact) => artifact.id === selectedId) ?? filtered[0];

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col",
        !embedded && "mx-auto w-full max-w-[1000px] px-4 py-6",
      )}
    >
      <div className="shrink-0 space-y-2 border-b border-border/70 px-3 pb-3 pt-1">
        <div className="relative">
          <MagnifyingGlass
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索产物"
            className="h-8 pl-8 text-xs"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {FILTERS.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="xs"
              variant={kind === item.id ? "secondary" : "ghost"}
              onClick={() => setKind(item.id)}
              className={cn(
                "h-6 rounded-full px-2 text-[10.5px]",
                kind !== item.id && "text-muted-foreground",
              )}
            >
              {item.label}
            </Button>
          ))}
          <span className="ml-auto text-[10px] text-muted-foreground">
            {filtered.length} 项
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
          <Cube size={20} className="text-muted-foreground/50" />
          <p className="text-[12px]">
            {ARTIFACTS.length === 0 ? "还没有产物" : "没有匹配的产物"}
          </p>
          <p className="text-[10.5px] text-muted-foreground">
            {ARTIFACTS.length === 0
              ? "任务产生的结果会出现在这里。"
              : "换个关键词或类型试试。"}
          </p>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,42%)_minmax(0,1fr)] md:grid-cols-[280px_minmax(0,1fr)] md:grid-rows-1">
          <div className="min-h-0 space-y-1 overflow-y-auto border-b border-border/70 p-2 md:border-b-0 md:border-r">
            {filtered.map((artifact) => {
              const active = artifact.id === selected?.id;
              return (
                <Button
                  key={artifact.id}
                  type="button"
                  variant={active ? "secondary" : "ghost"}
                  onClick={() => setSelectedId(artifact.id)}
                  className={cn(
                    "h-auto w-full justify-start gap-2 whitespace-normal rounded-[9px] px-2 py-2 text-left",
                    !active && "text-muted-foreground",
                  )}
                >
                  <ArtifactKindBadge kind={artifact.kind} withLabel={false} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11.5px] font-medium text-foreground">
                      {artifact.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[9.5px] text-muted-foreground">
                      {botName(artifact)} · {artifact.updatedAt}
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>

          {selected && (
            <div className="min-h-0 overflow-y-auto p-3">
              <Card className="gap-3 border border-border bg-card p-4 ring-0">
                <header className="flex flex-wrap items-center gap-2">
                  <ArtifactKindBadge kind={selected.kind} />
                  <span className="text-[10px] text-muted-foreground">
                    {botName(selected)} · {selected.updatedAt}
                  </span>
                  <Button
                    asChild
                    variant="ghost"
                    size="xs"
                    className="ml-auto text-muted-foreground"
                  >
                    <Link
                      to="/artifact/$artifactId"
                      params={{ artifactId: selected.id }}
                      onClick={closeModal}
                    >
                      打开完整页面
                      <ArrowUpRight size={11} />
                    </Link>
                  </Button>
                </header>
                <div>
                  <h3 className="text-[15px] font-semibold">
                    {selected.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {selected.summary}
                  </p>
                </div>
                <div className="min-h-0">
                  <ArtifactBody artifact={selected} />
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
