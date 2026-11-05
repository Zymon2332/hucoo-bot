import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowSquareOut,
  Brain,
  ChartLineUp,
  DownloadSimple,
  GearSix,
  Laptop,
  PaintBrush,
  Sparkle,
  Trash,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { Input } from "@hucoo/ui/components/input";
import { Switch } from "@hucoo/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@hucoo/ui/components/tabs";
import { BOTS, USAGE } from "@/fixtures";
import { useDemoStore } from "@/stores/demo-store";
import { getStoredTheme, setTheme, type Theme } from "@/lib/theme";
import { BotAvatar } from "@/components/bot-avatar";

const TABS = [
  { id: "model", label: "模型", icon: Sparkle },
  { id: "memory", label: "记忆", icon: Brain },
  { id: "usage", label: "用量", icon: ChartLineUp },
  { id: "general", label: "通用", icon: GearSix },
  { id: "appearance", label: "外观", icon: PaintBrush },
] as const;

export function SettingsPage() {
  const memories = useDemoStore((state) => state.memories);
  const profile = useDemoStore((state) => state.profile);
  const updateProfile = useDemoStore((state) => state.updateProfile);
  const reset = useDemoStore((state) => state.reset);
  const [theme, setThemeState] = useState<Theme | "system">(getStoredTheme());
  const [density, setDensity] = useState<"comfortable" | "compact">("compact");
  const [reduceMotion, setReduceMotion] = useState(false);

  const totalTokens = USAGE.reduce((sum, entry) => sum + entry.tokens, 0);
  const totalCost = USAGE.reduce((sum, entry) => sum + entry.cost, 0);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[980px] px-4 pb-16 pt-6 sm:px-6">
        <header>
          <h1 className="text-[22px] font-semibold tracking-tight">设置</h1>
          <p className="mt-1 text-[12px] text-muted-foreground">
            模型、记忆、用量与通用配置。bot 级设置在右侧面板。
          </p>
        </header>

        <Tabs
          orientation="vertical"
          defaultValue="model"
          className="mt-6 grid gap-6 lg:grid-cols-[160px_minmax(0,1fr)]"
        >
          <TabsList className="h-fit flex-col items-stretch bg-transparent p-0">
            {TABS.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="h-8 w-full justify-start gap-2 rounded-[7px] px-2 text-[12px] data-active:bg-secondary data-active:shadow-none"
                >
                  <Icon size={14} />
                  {item.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="min-w-0">
            <TabsContent value="model">
              <SettingsBlock
                title="模型"
                description="全局默认模型。bot 可以单独覆盖，但共用这里的凭证。"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-[10.5px] text-muted-foreground">
                      默认模型
                    </span>
                    <Input defaultValue="deepseek-v4" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[10.5px] text-muted-foreground">
                      Provider
                    </span>
                    <Input defaultValue="OpenAI Compatible" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-[10.5px] text-muted-foreground">
                      Base URL
                    </span>
                    <Input defaultValue="https://api.example.com/v1" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-[10.5px] text-muted-foreground">
                      API Key
                    </span>
                    <Input type="password" defaultValue="sk-••••••••••••" />
                  </label>
                </div>
                <p className="mt-3 text-[10px] text-muted-foreground/70">
                  凭证只存储在本地；原型不发起真实请求。
                </p>
              </SettingsBlock>
            </TabsContent>

            <TabsContent value="memory">
              <SettingsBlock
                title="记忆"
                description="记忆是决策上下文，不是聊天历史。可以按 bot 隔离。"
              >
                <div className="flex items-center justify-between rounded-[10px] border border-border px-3 py-2.5">
                  <div>
                    <p className="text-[12px] font-medium">允许记忆</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      关闭后，新对话不会再积累记忆。
                    </p>
                  </div>
                  <Switch
                    checked={profile.memoryEnabled}
                    aria-label="允许记忆"
                    onCheckedChange={(checked) =>
                      updateProfile({ memoryEnabled: checked })
                    }
                  />
                </div>
                <div className="mt-2 flex items-center justify-between rounded-[10px] border border-border px-3 py-2.5">
                  <div>
                    <p className="text-[12px] font-medium">已保存的记忆</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {memories.length} 条 · 按 bot 隔离
                    </p>
                  </div>
                  <Button asChild size="xs" variant="outline">
                    <Link to="/memory">
                      查看
                      <ArrowSquareOut size={10} />
                    </Link>
                  </Button>
                </div>
              </SettingsBlock>
            </TabsContent>

            <TabsContent value="usage">
              <SettingsBlock
                title="用量"
                description="按 bot 汇总。只统计已发生的模型调用。"
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-[10px] border border-border px-3 py-2.5">
                    <p className="text-[10px] text-muted-foreground">总 Token</p>
                    <p className="mt-0.5 text-[18px] font-semibold tabular-nums">
                      {(totalTokens / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="rounded-[10px] border border-border px-3 py-2.5">
                    <p className="text-[10px] text-muted-foreground">总成本</p>
                    <p className="mt-0.5 text-[18px] font-semibold tabular-nums">
                      ${totalCost.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {USAGE.map((entry) => {
                    const bot = BOTS.find((item) => item.id === entry.botId);
                    return (
                      <div
                        key={entry.botId}
                        className="flex items-center gap-2 rounded-[10px] border border-border px-2.5 py-2"
                      >
                        {bot && <BotAvatar bot={bot} size="sm" />}
                        <span className="min-w-0 flex-1 truncate text-[11.5px]">
                          {bot?.name} · {bot?.role}
                        </span>
                        <span className="text-[10px] tabular-nums text-muted-foreground">
                          {(entry.tokens / 1000).toFixed(0)}k · $
                          {entry.cost.toFixed(2)} · {entry.tasks} 个任务
                        </span>
                      </div>
                    );
                  })}
                </div>
              </SettingsBlock>
            </TabsContent>

            <TabsContent value="general">
              <SettingsBlock
                title="通用"
                description="通知、数据与快捷键。"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-[10px] border border-border px-3 py-2.5">
                    <div>
                      <p className="text-[12px] font-medium">全局通知</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        所有 bot 的通知只出现在一个地方。
                      </p>
                    </div>
                    <Switch defaultChecked aria-label="全局通知" />
                  </div>
                  <div className="flex items-center justify-between rounded-[10px] border border-border px-3 py-2.5">
                    <div>
                      <p className="text-[12px] font-medium">bot 圆点</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        有需要你的事时，在 bot 行显示一个小圆点。
                      </p>
                    </div>
                    <Switch defaultChecked aria-label="bot 圆点" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      /* prototype only */
                    }}
                  >
                    <DownloadSimple size={13} />
                    导出数据
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => reset()}
                  >
                    <Trash size={13} />
                    重置演示数据
                  </Button>
                </div>
              </SettingsBlock>
            </TabsContent>

            <TabsContent value="appearance">
              <SettingsBlock
                title="外观"
                description="中性、功能性视觉。没有衬线字体。"
              >
                <div className="grid gap-1.5 sm:grid-cols-3">
                  {(
                    [
                      { id: "light", label: "亮色" },
                      { id: "dark", label: "暗色" },
                      { id: "system", label: "跟随系统" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setTheme(item.id);
                        setThemeState(item.id);
                      }}
                      className={cn(
                        "rounded-[10px] border px-3 py-2.5 text-left text-[11.5px] transition-colors",
                        theme === item.id
                          ? "border-clay/40 bg-accent/40"
                          : "border-border bg-card/60 hover:bg-secondary/60",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between rounded-[10px] border border-border px-3 py-2.5">
                  <div>
                    <p className="text-[12px] font-medium">紧凑密度</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      减少行高与留白，适合每天使用。
                    </p>
                  </div>
                  <Switch
                    checked={density === "compact"}
                    aria-label="紧凑密度"
                    onCheckedChange={(checked) =>
                      setDensity(checked ? "compact" : "comfortable")
                    }
                  />
                </div>

                <div className="mt-2 flex items-center justify-between rounded-[10px] border border-border px-3 py-2.5">
                  <div>
                    <p className="text-[12px] font-medium">减少动效</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      关闭过渡与上浮动画。
                    </p>
                  </div>
                  <Switch
                    checked={reduceMotion}
                    aria-label="减少动效"
                    onCheckedChange={(checked) => {
                      setReduceMotion(checked);
                      document.documentElement.classList.toggle(
                        "reduce-motion",
                        checked,
                      );
                    }}
                  />
                </div>
              </SettingsBlock>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function SettingsBlock({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[14px] border border-border bg-card/70 p-4">
      <header className="mb-3">
        <h2 className="text-[13px] font-medium">{title}</h2>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </header>
      {children}
    </section>
  );
}
