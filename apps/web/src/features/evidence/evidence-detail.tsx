import {
  ArrowSquareOut,
  FileText,
  LinkSimple,
  TerminalWindow,
} from "@phosphor-icons/react";
import { getAgent, getArtifact } from "@/fixtures";
import type { Evidence } from "@/fixtures/types";
import { ArtifactBody } from "@/features/artifacts/artifact-preview";
import { DiffViewer } from "./diff-viewer";
import { VerifiedBadge } from "./evidence-card";

export function EvidenceDetail({ evidence }: { evidence: Evidence }) {
  const artifact = evidence.artifactId
    ? getArtifact(evidence.artifactId)
    : undefined;
  const agent = evidence.agentId ? getAgent(evidence.agentId) : undefined;

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-center gap-2">
        <h3 className="min-w-0 flex-1 truncate text-[13px] font-medium">
          {evidence.title}
        </h3>
        <VerifiedBadge verified={evidence.verified} />
        <span className="text-[10.5px] text-muted-foreground">{evidence.at}</span>
      </header>
      <p className="text-[11.5px] leading-relaxed text-muted-foreground">
        {evidence.summary}
      </p>

      {evidence.kind === "artifact" && artifact && (
        <div className="rounded-[12px] border border-border bg-card/60 p-3">
          <ArtifactBody artifact={artifact} />
        </div>
      )}

      {evidence.kind === "diff" && evidence.diff && (
        <DiffViewer diff={evidence.diff} />
      )}

      {evidence.kind === "source" && (
        <div className="rounded-[12px] border border-border bg-card/60 p-3">
          <div className="flex items-center gap-2 text-[12px]">
            <LinkSimple size={14} className="text-clay" />
            <span className="font-medium">{evidence.sourceLabel}</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {evidence.summary}
          </p>
          {evidence.sourceUrl && (
            <a
              href={evidence.sourceUrl}
              className="mt-2 inline-flex items-center gap-1 text-[11px] text-clay hover:opacity-80"
            >
              打开来源
              <ArrowSquareOut size={11} />
            </a>
          )}
        </div>
      )}

      {(evidence.kind === "session" || evidence.kind === "log") && (
        <div className="overflow-hidden rounded-[12px] border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-3 py-1.5 text-[11px] text-muted-foreground">
            <TerminalWindow size={12} />
            {agent?.name ?? "执行日志"}
            {agent?.sessionId && (
              <span className="font-mono text-[10px]">{agent.sessionId}</span>
            )}
          </div>
          <pre className="max-h-[420px] overflow-auto bg-background/50 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {(evidence.log ?? []).map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </pre>
        </div>
      )}

      {evidence.kind === "test" && (
        <div className="flex items-center gap-2 rounded-[12px] border border-border bg-card/60 px-3 py-3 text-[11.5px] text-muted-foreground">
          <FileText size={14} className="text-sage" />
          {evidence.summary}
        </div>
      )}

      {agent && (
        <p className="text-[10.5px] text-muted-foreground/70">
          来自 {agent.name} · {agent.role}
          {agent.sessionId ? ` · ${agent.sessionId}` : ""}
        </p>
      )}
    </div>
  );
}
