import { useState } from "react";
import { ArrowUpRight, Moon, Sun } from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import { getStoredTheme, setTheme } from "@/lib/theme";
import { useDemoStore } from "@/stores/demo-store";
import { StageBadge } from "@/components/primitives";
import { TextBlock } from "@/features/chat/blocks/text-block";
import { PlanBlock } from "@/features/chat/blocks/plan-block";
import { ResultBlock } from "@/features/chat/blocks/result-block";
import { AttentionBlock } from "@/features/chat/blocks/attention-block";
import { ReviewBlock } from "@/features/chat/blocks/review-block";
import { ErrorBlock } from "@/features/chat/blocks/error-block";
import { CandidateBlock } from "@/features/chat/blocks/candidate-block";
import { MemoryBlock } from "@/features/chat/blocks/memory-block";
import { ExecutionPanel } from "@/features/tasks/execution-panel";

const STAGES = [
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
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
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
      <div className={className}>{children}</div>
    </section>
  );
}

export function StatesPage() {
  const reset = useDemoStore((state) => state.reset);
  const [dark, setDark] = useState(getStoredTheme() === "dark");

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-6 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-[26px] tracking-tight">
              状态画廊
            </h1>
            <p className="mt-1 text-[12px] text-muted-foreground">
              所有页面与卡片状态的静态检查。仅开发环境可见。
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
              onClick={() => {
                reset();
              }}
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
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            消息块
          </h2>
          <div className="mt-2 grid gap-3 lg:grid-cols-2">
            <Preview title="文本" description="Markdown">
              <TextBlock text={"这是一个普通回复。包含 **加粗**、`行内代码` 和列表：\n\n- 第一点\n- 第二点"} />
            </Preview>
            <Preview title="计划卡" description="执行中">
              <PlanBlock taskId="t-competitor" />
            </Preview>
            <Preview title="计划卡" description="已完成">
              <PlanBlock taskId="t-weekend" />
            </Preview>
            <Preview title="结果卡" description="带产物">
              <ResultBlock
                taskId="t-weekend"
                summary="周末安排好了：两个步行范围内的地点，中间留了足够的空白。"
              />
            </Preview>
            <Preview title="结构化提问" description="等待回答">
              <AttentionBlock taskId="t-schedule" />
            </Preview>
            <Preview title="审阅" description="等待确认">
              <ReviewBlock taskId="t-weekly" />
            </Preview>
            <Preview title="错误" description="受阻">
              <ErrorBlock
                taskId="t-budget"
                code="missing_data"
                message="缺少数据团队 10 月的报销明细，暂时无法计算执行率。"
                retryable
              />
            </Preview>
            <Preview title="主动候选" description="观察模式">
              <CandidateBlock candidateId="cand-morning" />
            </Preview>
            <Preview title="记忆引用" description="行内 chip">
              <MemoryBlock memoryId="m-tone" quote="你喜欢简洁、直接的回复" />
            </Preview>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            执行检查器
          </h2>
          <div className="mt-2 grid gap-3 lg:grid-cols-2">
            {(
              [
                ["t-trip", "排队中"],
                ["t-competitor", "执行中"],
                ["t-schedule", "等待回答"],
                ["t-weekly", "等待确认"],
                ["t-budget", "受阻"],
                ["t-inbox", "失败"],
                ["t-reading", "等待触发"],
                ["t-weekend", "完成"],
              ] as Array<[string, string]>
            ).map(([taskId, label]) => (
              <Preview key={taskId} title={label ?? taskId} description={taskId}>
                <div className="h-[420px] overflow-y-auto rounded-[12px] border border-border bg-card/50">
                  <ExecutionPanel taskId={taskId} />
                </div>
              </Preview>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            页面
          </h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["主页", "/"],
              ["对话 · 周报", "/c/c-weekly"],
              ["对话 · 竞品", "/c/c-competitor"],
              ["对话 · 行程", "/c/c-schedule"],
              ["对话 · 主动候选", "/c/c-proactive"],
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
