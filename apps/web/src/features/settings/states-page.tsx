import { useState } from "react";
import { ArrowUpRight, Moon, Sun } from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import {
  EVIDENCE,
  METRICS,
  WORK_ITEMS,
  getEvidence,
  getWorkItem,
} from "@/fixtures";
import type { Stage, WorkItem } from "@/fixtures/types";
import {
  priorityLabel,
  stageLabel,
  stageWaitingFor,
  verifiedLabel,
  waitingOnLabel,
} from "@/display/labels";
import { getStoredTheme, setTheme } from "@/lib/theme";
import { useDemoStore } from "@/stores/demo-store";
import { StageBadge } from "@/components/primitives";
import { TextBlock } from "@/features/chat/blocks/text-block";
import { PlanBlock } from "@/features/chat/blocks/plan-block";
import { OutcomeBlock } from "@/features/chat/blocks/outcome-block";
import { AttentionBlock } from "@/features/chat/blocks/attention-block";
import { ErrorBlock } from "@/features/chat/blocks/error-block";
import { MemoryBlock } from "@/features/chat/blocks/memory-block";
import { OverviewTab } from "@/features/work-item/overview-tab";
import { ConversationTab } from "@/features/work-item/conversation-tab";
import { EvidenceTab } from "@/features/evidence/evidence-tab";
import { ExecutionTab } from "@/features/work-item/execution-tab";
import { AuthorityTab } from "@/features/work-item/authority-tab";
import { EvidenceCard } from "@/features/evidence/evidence-card";
import { DiffViewer } from "@/features/evidence/diff-viewer";

const STAGES: Stage[] = [
  "queued",
  "working",
  "awaiting_answer",
  "awaiting_review",
  "blocked",
  "failed",
  "waiting",
  "done",
];

function Preview({
  title,
  description,
  children,
  height,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  height?: string;
}) {
  return (
    <section className="min-w-0 rounded-[16px] border border-border bg-background/40 p-3">
      <header className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="text-[11.5px] font-medium">{title}</h3>
        {description && (
          <span className="truncate text-[10px] text-muted-foreground">
            {description}
          </span>
        )}
      </header>
      <div
        className="overflow-y-auto rounded-[12px] border border-border bg-card/40"
        style={{ height }}
      >
        {children}
      </div>
    </section>
  );
}

function QueueRow({ item }: { item: WorkItem }) {
  return (
    <div className="flex items-start gap-2 border-b border-border/60 px-3 py-2 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11.5px] font-medium">{item.title}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {stageLabel(item.stage)} · {stageWaitingFor(item.stage)} ·{" "}
          {priorityLabel(item.priority)}
        </p>
      </div>
      <StageBadge stage={item.stage} />
    </div>
  );
}

export function StatesPage() {
  const reset = useDemoStore((state) => state.reset);
  const [dark, setDark] = useState(getStoredTheme() === "dark");
  const weekly = getWorkItem("wi-weekly");
  const competitor = getWorkItem("wi-competitor");
  const schedule = getWorkItem("wi-schedule");
  const budget = getWorkItem("wi-budget");
  const contract = getWorkItem("wi-contract");
  const diff = getEvidence("ev-weekly-diff");
  const session = getEvidence("ev-weekly-session");

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-6 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-[26px] tracking-tight">
              状态画廊
            </h1>
            <p className="mt-1 text-[12px] text-muted-foreground">
              工作项、证据、权限、队列与消息块的全部静态状态。仅开发环境可见。
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                const next = dark ? "light" : "dark";
                setTheme(next);
                setDark(!dark);
              }}
            >
              {dark ? <Sun size={13} /> : <Moon size={13} />}
              {dark ? "亮色" : "暗色"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => reset()}
            >
              重置演示状态
            </Button>
          </div>
        </header>

        <section className="mt-7">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            阶段与兜底
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-[16px] border border-border bg-card/50 p-3">
            {STAGES.map((stage) => (
              <StageBadge key={stage} stage={stage} />
            ))}
            <StageBadge stage="archived" />
            <span className="text-[10px] text-muted-foreground">
              ← 未知状态回退为原始值
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
            {["human", "agent", "external", "trigger", "none"].map((value) => (
              <span key={value} className="rounded-full border border-border px-2 py-0.5">
                {waitingOnLabel(value)}
              </span>
            ))}
            {["yes", "partial", "no"].map((value) => (
              <span key={value} className="rounded-full border border-border px-2 py-0.5">
                {verifiedLabel(value)}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            工作项队列
          </h2>
          <div className="mt-2 overflow-hidden rounded-[16px] border border-border bg-card/50">
            {WORK_ITEMS.map((item) => (
              <QueueRow key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            消息块
          </h2>
          <div className="mt-2 grid gap-3 lg:grid-cols-2">
            <Preview title="文本" description="Markdown">
              <div className="p-3">
                <TextBlock text={"这是一个普通回复。包含 **加粗**、`行内代码` 和列表：\n\n- 第一点\n- 第二点"} />
              </div>
            </Preview>
            <Preview title="计划卡" description="默认折叠">
              <div className="p-3">
                <PlanBlock workItemId="wi-competitor" />
              </div>
            </Preview>
            <Preview title="结果 + 审阅" description="合并卡片">
              <div className="p-3">
                <OutcomeBlock workItemId="wi-weekly" />
              </div>
            </Preview>
            <Preview title="结构化提问" description="等待回答">
              <div className="p-3">
                <AttentionBlock workItemId="wi-schedule" />
              </div>
            </Preview>
            <Preview title="错误" description="受阻">
              <div className="p-3">
                <ErrorBlock
                  workItemId="wi-budget"
                  code="missing_data"
                  message="缺少数据团队 10 月的报销明细，暂时无法计算执行率。"
                  retryable
                />
              </div>
            </Preview>
            <Preview title="记忆引用" description="行内 chip">
              <div className="p-3">
                <MemoryBlock memoryId="m-tone" quote="你喜欢简洁、直接的回复" />
              </div>
            </Preview>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            工作项 Tab
          </h2>
          <div className="mt-2 grid gap-3 xl:grid-cols-2">
            {weekly && (
              <Preview title="概览" description="等待审阅" height="520px">
                <OverviewTab item={weekly} />
              </Preview>
            )}
            {schedule && (
              <Preview title="对话" description="结构化提问" height="520px">
                <ConversationTab item={schedule} />
              </Preview>
            )}
            {weekly && (
              <Preview title="证据" description="产物 / diff / session" height="520px">
                <EvidenceTab item={weekly} />
              </Preview>
            )}
            {competitor && (
              <Preview title="执行" description="进行中" height="520px">
                <ExecutionTab item={competitor} />
              </Preview>
            )}
            {weekly && (
              <Preview title="权限" description="可逆" height="520px">
                <AuthorityTab item={weekly} />
              </Preview>
            )}
            {contract && (
              <Preview title="权限" description="不可逆" height="520px">
                <AuthorityTab item={contract} />
              </Preview>
            )}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            证据
          </h2>
          <div className="mt-2 grid gap-3 lg:grid-cols-2">
            <Preview title="diff" description="仅展示变更">
              <div className="p-3">
                {diff?.diff && <DiffViewer diff={diff.diff} />}
              </div>
            </Preview>
            <Preview title="证据卡" description="会话 / 来源 / 产物">
              <div className="space-y-1.5 p-3">
                {EVIDENCE.slice(0, 4).map((evidence) => (
                  <EvidenceCard key={evidence.id} evidence={evidence} />
                ))}
              </div>
            </Preview>
            <Preview title="会话日志" description={session?.title} height="260px">
              <div className="p-3">
                <pre className="whitespace-pre-wrap font-mono text-[10.5px] leading-relaxed text-muted-foreground">
                  {(session?.log ?? []).join("\n")}
                </pre>
              </div>
            </Preview>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            注意力指标
          </h2>
          <div className="mt-2 overflow-hidden rounded-[16px] border border-border">
            <table className="w-full text-[11px]">
              <thead className="bg-secondary/60 text-left text-section-label">
                <tr>
                  <th className="px-3 py-2 font-medium">工作项</th>
                  <th className="px-3 py-2 font-medium">判断次数</th>
                  <th className="px-3 py-2 font-medium">人类分钟</th>
                  <th className="px-3 py-2 font-medium">决策等待</th>
                  <th className="px-3 py-2 font-medium">打断</th>
                </tr>
              </thead>
              <tbody>
                {METRICS.map((metric) => (
                  <tr key={metric.workItemId} className="border-t border-border">
                    <td className="px-3 py-2">
                      {getWorkItem(metric.workItemId)?.title ?? metric.workItemId}
                    </td>
                    <td className="px-3 py-2 tabular-nums">{metric.decisions}</td>
                    <td className="px-3 py-2 tabular-nums">{metric.humanMinutes}</td>
                    <td className="px-3 py-2">{metric.timeToDecision}</td>
                    <td className="px-3 py-2">{metric.interrupted ? "是" : "否"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            页面
          </h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["决策台", "/"],
              ["工作项 · 周报", "/w/wi-weekly?tab=overview"],
              ["工作项 · 竞品", "/w/wi-competitor?tab=execution"],
              ["工作项 · 行程", "/w/wi-schedule?tab=conversation"],
              ["工作项 · 合同", "/w/wi-contract?tab=authority"],
              ["代理名册", "/agents"],
              ["记忆中心", "/memory"],
              ["设置", "/settings"],
              ["Onboarding", "/onboarding"],
              ["产物 · 周报", "/artifact/a-weekly"],
              ["产物 · 网页", "/artifact/a-launch"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="flex items-center justify-between rounded-[12px] border border-border bg-card/60 px-3 py-2.5 text-[12px] transition-colors hover:bg-secondary/60"
              >
                {label}
                <ArrowUpRight size={13} className="text-muted-foreground" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
