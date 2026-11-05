import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CheckCircle,
  FileText,
  Question,
  ShieldCheck,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import {
  conversationsForWorkItem,
  getAgent,
  getArtifact,
  getEvidence,
  getMemory,
} from "@/fixtures";
import type { WorkItem } from "@/fixtures/types";
import {
  agentKindLabel,
  agentStatusLabel,
  channelLabel,
  stageWaitingFor,
} from "@/display/labels";
import { ArtifactKindBadge, SectionHeading } from "@/components/primitives";
import { EvidenceCard } from "@/features/evidence/evidence-card";

function NextAction({ item }: { item: WorkItem }) {
  if (item.stage === "awaiting_answer" && item.attention) {
    return (
      <section className="rounded-[16px] border border-clay/25 bg-accent/40 p-4">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-clay">
          <Question size={14} weight="fill" />
          下一步
        </div>
        <p className="mt-2 text-[14px] font-medium leading-relaxed">
          {item.attention.question}
        </p>
        <Button asChild size="sm" className="mt-3">
          <Link
            to="/w/$workItemId"
            params={{ workItemId: item.id }}
            search={{ tab: "conversation" }}
          >
            去回答
            <ArrowRight size={13} />
          </Link>
        </Button>
      </section>
    );
  }

  if (item.stage === "awaiting_review" && item.review) {
    const artifact = getArtifact(item.review.artifactId);
    return (
      <section className="rounded-[16px] border border-warning/25 bg-warning/[0.06] p-4">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-warning">
          <WarningCircle size={14} weight="fill" />
          下一步
        </div>
        <p className="mt-2 text-[14px] font-medium leading-relaxed">
          {artifact?.title ?? "结果已就绪"}，等你确认
        </p>
        {artifact && (
          <div className="mt-1.5 flex items-center gap-2">
            <ArtifactKindBadge kind={artifact.kind} />
            <span className="text-[11px] text-muted-foreground">
              {artifact.summary}
            </span>
          </div>
        )}
        <Button asChild size="sm" className="mt-3">
          <Link
            to="/w/$workItemId"
            params={{ workItemId: item.id }}
            search={{ tab: "conversation" }}
          >
            去审阅
            <ArrowRight size={13} />
          </Link>
        </Button>
      </section>
    );
  }

  if (item.stage === "blocked" || item.stage === "failed") {
    return (
      <section className="rounded-[16px] border border-destructive/25 bg-destructive/[0.045] p-4">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-destructive">
          <WarningCircle size={14} weight="fill" />
          下一步
        </div>
        <p className="mt-2 text-[13px] leading-relaxed">
          {item.verification.needsHuman[0] ?? "需要你补充信息或重新连接后继续。"}
        </p>
        <Button asChild size="sm" variant="outline" className="mt-3">
          <Link
            to="/w/$workItemId"
            params={{ workItemId: item.id }}
            search={{ tab: "conversation" }}
          >
            查看并处理
            <ArrowRight size={13} />
          </Link>
        </Button>
      </section>
    );
  }

  if (item.stage === "done") {
    return (
      <section className="rounded-[16px] border border-sage/20 bg-sage/[0.05] p-4">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-sage">
          <CheckCircle size={14} weight="fill" />
          已完成
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">
          这个工作项已结束，不再占用注意力。
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[16px] border border-border bg-card/70 p-4">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-section-label">
        <span className="size-1.5 animate-soft-pulse rounded-full bg-clay" />
        下一步
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">
        {stageWaitingFor(item.stage)}。不需要你。
      </p>
    </section>
  );
}

export function OverviewTab({ item }: { item: WorkItem }) {
  const navigate = useNavigate();
  const agents = item.agentIds
    .map((id) => getAgent(id))
    .filter((agent) => agent !== undefined);
  const evidence = item.evidenceIds
    .map((id) => getEvidence(id))
    .filter((entry) => entry !== undefined)
    .slice(0, 3);
  const conversations = conversationsForWorkItem(item.id);
  const memories = item.memoryIds
    .map((id) => getMemory(id))
    .filter((memory) => memory !== undefined);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[1000px] px-4 pb-12 pt-5 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <NextAction item={item} />

            <section className="rounded-[16px] border border-border bg-card/70 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-clay" />
                <h2 className="text-[13px] font-medium">验证摘要</h2>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
                {item.verification.summary}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="rounded-[10px] bg-sage/[0.06] p-2.5">
                  <p className="flex items-center gap-1 text-[10px] font-medium text-sage">
                    <CheckCircle size={11} weight="fill" />
                    已验证
                  </p>
                  <ul className="mt-1 space-y-0.5 text-[10.5px] text-muted-foreground">
                    {item.verification.checked.map((entry) => (
                      <li key={entry}>· {entry}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[10px] bg-secondary/60 p-2.5">
                  <p className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                    <XCircle size={11} />
                    未验证
                  </p>
                  <ul className="mt-1 space-y-0.5 text-[10.5px] text-muted-foreground">
                    {item.verification.unchecked.length > 0 ? (
                      item.verification.unchecked.map((entry) => (
                        <li key={entry}>· {entry}</li>
                      ))
                    ) : (
                      <li>· 无</li>
                    )}
                  </ul>
                </div>
                <div className="rounded-[10px] bg-warning/[0.06] p-2.5">
                  <p className="flex items-center gap-1 text-[10px] font-medium text-warning">
                    <WarningCircle size={11} weight="fill" />
                    需要你判断
                  </p>
                  <ul className="mt-1 space-y-0.5 text-[10.5px] text-muted-foreground">
                    {item.verification.needsHuman.length > 0 ? (
                      item.verification.needsHuman.map((entry) => (
                        <li key={entry}>· {entry}</li>
                      ))
                    ) : (
                      <li>· 无</li>
                    )}
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between">
                <SectionHeading>最近证据</SectionHeading>
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  onClick={() =>
                    void navigate({
                      to: "/w/$workItemId",
                      params: { workItemId: item.id },
                      search: { tab: "evidence" },
                    })
                  }
                  className="h-auto px-0"
                >
                  查看全部
                  <ArrowRight size={11} />
                </Button>
              </div>
              <div className="mt-2 space-y-1.5">
                {evidence.map((entry) => (
                  <EvidenceCard
                    key={entry.id}
                    evidence={entry}
                    onClick={() =>
                      void navigate({
                        to: "/w/$workItemId",
                        params: { workItemId: item.id },
                        search: { tab: "evidence" },
                      })
                    }
                  />
                ))}
                {evidence.length === 0 && (
                  <p className="rounded-[12px] border border-dashed border-border px-3 py-4 text-[11px] text-muted-foreground">
                    还没有证据。
                  </p>
                )}
              </div>
            </section>

            <section>
              <SectionHeading>对话</SectionHeading>
              <div className="mt-2 space-y-1.5">
                {conversations.map((conversation) => {
                  const last = conversation.messages[conversation.messages.length - 1];
                  const text = last?.blocks.find((block) => block.kind === "text");
                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() =>
                        void navigate({
                          to: "/w/$workItemId",
                          params: { workItemId: item.id },
                          search: { tab: "conversation" },
                        })
                      }
                      className="flex w-full items-start gap-2 rounded-[12px] border border-border bg-card/60 px-3 py-2.5 text-left transition-colors hover:bg-secondary/60"
                    >
                      <FileText size={13} className="mt-0.5 text-muted-foreground" />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-[11.5px] font-medium">
                            {channelLabel(conversation.channel)}
                          </span>
                          <span className="text-[10px] text-muted-foreground/60">
                            {conversation.messages.length} 条
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[10.5px] text-muted-foreground">
                          {text?.kind === "text" ? text.text.slice(0, 80) : "…"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section>
              <SectionHeading>关联 Agents</SectionHeading>
              <div className="mt-2 space-y-1.5">
                {agents.map((agent) => (
                  <Link
                    key={agent.id}
                    to="/agents"
                    className="flex items-start gap-2 rounded-[12px] border border-border bg-card/60 px-3 py-2.5 transition-colors hover:bg-secondary/60"
                  >
                    <span
                      className={cn(
                        "mt-1 size-1.5 shrink-0 rounded-full",
                        agent.status === "running" && "animate-soft-pulse bg-clay",
                        agent.status === "done" && "bg-sage",
                        agent.status === "failed" && "bg-destructive",
                        agent.status === "waiting" && "bg-warning",
                        agent.status === "idle" && "bg-muted-foreground/40",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-[11.5px] font-medium">
                          {agent.name}
                        </span>
                        <span className="rounded bg-secondary px-1 py-0.5 text-[9px] text-muted-foreground">
                          {agentKindLabel(agent.kind)}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">
                        {agentStatusLabel(agent.status)}
                        {agent.sessionId ? ` · ${agent.sessionId}` : ""}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {memories.length > 0 && (
              <section>
                <SectionHeading>相关记忆</SectionHeading>
                <div className="mt-2 space-y-1.5">
                  {memories.map((memory) => (
                    <a
                      key={memory.id}
                      href={`/memory?focus=${memory.id}`}
                      className="flex items-start gap-2 rounded-[10px] px-2 py-1.5 text-[10.5px] leading-relaxed text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                    >
                      <Brain size={12} className="mt-0.5 shrink-0 text-clay/60" />
                      {memory.content}
                    </a>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-[12px] bg-secondary/50 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
                授权
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {item.authority.scope}
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                <ShieldCheck size={11} />
                {item.authority.reversible ? "可逆" : "不可逆"} ·{" "}
                {item.authority.grantedBy}
              </div>
              <Button
                asChild
                variant="link"
                size="xs"
                className="mt-1 h-auto px-0"
              >
                <Link
                  to="/w/$workItemId"
                  params={{ workItemId: item.id }}
                  search={{ tab: "authority" }}
                >
                  查看授权与审计
                  <ArrowRight size={11} />
                </Link>
              </Button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
