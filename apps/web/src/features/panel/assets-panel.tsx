import { useState } from "react";
import { Cube } from "@phosphor-icons/react";
import { artifactsForBot } from "@/fixtures";
import { ArtifactTile, ArtifactBody } from "@/features/artifacts/artifact-preview";
import { EmptyState } from "@/components/primitives";

export function AssetsPanel({ botId }: { botId: string }) {
  const assets = artifactsForBot(botId);
  const [selectedId, setSelectedId] = useState(assets[0]?.id);
  const selected =
    assets.find((artifact) => artifact.id === selectedId) ?? assets[0];

  if (assets.length === 0) {
    return (
      <div className="p-3">
        <EmptyState
          icon={<Cube size={20} />}
          title="这个 bot 还没有资产"
          description="任务产出的文档、表格、代码和网页会出现在这里。"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2.5">
      <div className="space-y-1">
        {assets.map((artifact) => (
          <ArtifactTile
            key={artifact.id}
            artifact={artifact}
            compact
            onOpen={() => setSelectedId(artifact.id)}
          />
        ))}
      </div>
      {selected && (
        <div className="rounded-[10px] border border-border bg-card/60 p-3">
          <p className="mb-2 text-[11.5px] font-medium">{selected.title}</p>
          <div className="max-h-[40vh] overflow-y-auto">
            <ArtifactBody artifact={selected} />
          </div>
        </div>
      )}
    </div>
  );
}
