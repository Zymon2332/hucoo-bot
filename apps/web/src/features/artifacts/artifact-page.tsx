import { ArrowLeft, Check, Copy } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@hucoo/ui/components/button";
import { getArtifact } from "@/fixtures";
import { artifactStatusLabel } from "@/display/labels";
import { ArtifactBody } from "@/features/artifacts/artifact-preview";
import { ArtifactKindBadge, EmptyState } from "@/components/primitives";

export function ArtifactPage({ artifactId }: { artifactId: string }) {
  const artifact = getArtifact(artifactId);
  const [copied, setCopied] = useState(false);

  if (!artifact) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          title="产物不存在"
          description="它可能已被删除，或链接不正确。"
          action={
            <Button asChild size="sm">
              <Link to="/">回到主页</Link>
            </Button>
          }
        />
      </div>
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(artifact?.content ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border/70 px-4 py-2.5">
        <Button asChild variant="ghost" size="icon-sm" aria-label="返回">
          <Link to="/">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-[14px] font-medium">
              {artifact.title}
            </h1>
            <ArtifactKindBadge kind={artifact.kind} />
            <span className="text-[10.5px] text-muted-foreground">
              {artifactStatusLabel(artifact.status)}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {artifact.summary} · 更新于 {artifact.updatedAt}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={copy}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "已复制" : "复制内容"}
        </Button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto w-full max-w-[900px]">
          <div className="rounded-[16px] border border-border bg-card p-4 sm:p-6">
            <ArtifactBody artifact={artifact} />
          </div>
        </div>
      </div>
    </div>
  );
}
