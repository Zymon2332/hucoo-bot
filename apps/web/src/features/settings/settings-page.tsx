import { useState } from "react";
import {
  ArrowSquareOut,
  DownloadSimple,
  Eye,
  GearSix,
  Lightning,
  PaintBrush,
  ShieldCheck,
  Sparkle,
  Trash,
  UserCircle,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { Input } from "@hucoo/ui/components/input";
import { Switch } from "@hucoo/ui/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@hucoo/ui/components/tabs";
import { toast } from "sonner";
import type { Tone } from "@/fixtures/types";
import { toneLabel } from "@/display/labels";
import { useDemoStore } from "@/stores/demo-store";
import { getStoredTheme, setTheme, type Theme } from "@/lib/theme";

const COLORS = ["#A64B2A", "#66735A", "#3F5D7A", "#8A5A83", "#8A6A2F"];
const TONES: Tone[] = ["concise", "warm", "direct", "playful"];

const TABS = [
  { id: "persona", label: "人格", icon: UserCircle },
  { id: "appearance", label: "外观", icon: PaintBrush },
  { id: "proactive", label: "主动规则", icon: Sparkle },
  { id: "data", label: "记忆与数据", icon: ShieldCheck },
  { id: "about", label: "关于", icon: GearSix },
] as const;

export function SettingsPage() {
  const profile = useDemoStore((state) => state.profile);
  const updateProfile = useDemoStore((state) => state.updateProfile);
  const rules = useDemoStore((state) => state.rules);
  const toggleRule = useDemoStore((state) => state.toggleRule);
  const setRuleMode = useDemoStore((state) => state.setRuleMode);
  const memories = useDemoStore((state) => state.memories);
  const reset = useDemoStore((state) => state.reset);
  const [theme, setThemeState] = useState<Theme | "system">(getStoredTheme());
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[1020px] px-4 pb-16 pt-6 sm:px-6">
        <header>
          <h1 className="font-display text-[26px] tracking-tight">设置</h1>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            只放必要的东西。健康状态不占空间。
          </p>
        </header>

        <Tabs
          orientation="vertical"
          defaultValue="persona"
          className="mt-6 grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)]"
        >
          <TabsList className="h-fit flex-col items-stretch bg-transparent p-0">
            {TABS.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="h-8 w-full justify-start gap-2 rounded-[9px] px-2 text-[12.5px] data-active:bg-secondary data-active:shadow-none"
                >
                  <Icon size={15} />
                  {item.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="min-w-0">
            <TabsContent value="persona">
              <SettingsBlock
                title="人格"
                description="名称、称呼与语气会出现在所有对话和主动消息里。"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] text-muted-foreground">
                      助理名称
                    </span>
                    <Input
                      value={profile.name}
                      onChange={(event) =>
                        updateProfile({
                          name: event.target.value,
                          initials:
                            event.target.value.slice(0, 1) || profile.initials,
                        })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] text-muted-foreground">
                      怎么称呼你
                    </span>
                    <Input
                      value={profile.addressAs}
                      onChange={(event) =>
                        updateProfile({ addressAs: event.target.value })
                      }
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <span className="mb-1.5 block text-[11px] text-muted-foreground">
                    颜色
                  </span>
                  <div className="flex gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        aria-label={`选择颜色 ${color}`}
                        onClick={() => updateProfile({ accent: color })}
                        className={cn(
                          "size-7 rounded-full transition-transform",
                          profile.accent === color && "ring-2 ring-offset-2 ring-offset-background",
                        )}
                        style={{
                          backgroundColor: color,
                          boxShadow:
                            profile.accent === color
                              ? `0 0 0 2px ${color}`
                              : undefined,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <span className="mb-1.5 block text-[11px] text-muted-foreground">
                    语气
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {TONES.map((tone) => (
                      <Button
                        key={tone}
                        type="button"
                        size="sm"
                        variant={profile.tone === tone ? "secondary" : "outline"}
                        onClick={() => updateProfile({ tone })}
                      >
                        {toneLabel(tone)}
                      </Button>
                    ))}
                  </div>
                </div>
              </SettingsBlock>
            </TabsContent>

            <TabsContent value="appearance">
              <SettingsBlock
                title="外观"
                description="暖色主题，亮暗跟随你的环境。"
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
                        "rounded-[12px] border px-3 py-3 text-left transition-colors",
                        theme === item.id
                          ? "border-clay/40 bg-accent/45"
                          : "border-border bg-card/60 hover:bg-secondary/60",
                      )}
                    >
                      <span className="block text-[12.5px] font-medium">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-[10.5px] text-muted-foreground">
                        {item.id === "system"
                          ? "睡前自动变暗"
                          : item.id === "light"
                            ? "米白纸面"
                            : "暖炭背景"}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-[12px] border border-border px-3 py-2.5">
                  <div>
                    <p className="text-[12.5px] font-medium">减少动效</p>
                    <p className="mt-0.5 text-[10.5px] text-muted-foreground">
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

            <TabsContent value="proactive">
              <SettingsBlock
                title="主动规则"
                description="每条规则都有观察与自动两种模式。默认观察：只记录，不执行。"
              >
                <div className="flex items-center justify-between rounded-[12px] border border-border bg-card/60 px-3 py-2.5">
                  <div>
                    <p className="text-[12.5px] font-medium">默认主动行为</p>
                    <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                      新规则默认继承这个模式。
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="xs"
                      variant={
                        profile.proactiveMode === "observe"
                          ? "secondary"
                          : "outline"
                      }
                      onClick={() => updateProfile({ proactiveMode: "observe" })}
                    >
                      <Eye size={11} />
                      观察
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant={
                        profile.proactiveMode === "auto"
                          ? "secondary"
                          : "outline"
                      }
                      onClick={() => updateProfile({ proactiveMode: "auto" })}
                    >
                      <Lightning size={11} />
                      自动
                    </Button>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="rounded-[12px] border border-border bg-card/60 px-3 py-2.5"
                    >
                      <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[12.5px] font-medium">
                              {rule.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {rule.lastTriggered
                                ? `上次触发 ${rule.lastTriggered}`
                                : "尚未触发"}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                            {rule.instruction}
                          </p>
                        </div>
                        <Switch
                          checked={rule.enabled}
                          aria-label={`${rule.name}启用`}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <Button
                          type="button"
                          size="xs"
                          variant={rule.mode === "observe" ? "secondary" : "ghost"}
                          onClick={() => setRuleMode(rule.id, "observe")}
                          className="text-muted-foreground"
                        >
                          <Eye size={11} />
                          观察
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant={rule.mode === "auto" ? "secondary" : "ghost"}
                          onClick={() => setRuleMode(rule.id, "auto")}
                          className="text-muted-foreground"
                        >
                          <Lightning size={11} />
                          自动
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </SettingsBlock>
            </TabsContent>

            <TabsContent value="data">
              <SettingsBlock
                title="记忆与数据"
                description="记忆只存在本地原型里。导出与清空都是演示动作。"
              >
                <div className="flex items-center justify-between rounded-[12px] border border-border px-3 py-2.5">
                  <div>
                    <p className="text-[12.5px] font-medium">允许记忆</p>
                    <p className="mt-0.5 text-[10.5px] text-muted-foreground">
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

                <div className="mt-3 rounded-[12px] border border-border px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[12.5px] font-medium">已保存的记忆</p>
                      <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                        {memories.length} 条
                      </p>
                    </div>
                    <Button
                      asChild
                      size="xs"
                      variant="outline"
                    >
                      <a href="/memory">
                        查看
                        <ArrowSquareOut size={11} />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => toast("原型演示：导出记忆（JSON）")}
                  >
                    <DownloadSimple size={13} />
                    导出数据
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      reset();
                      toast("已重置演示数据");
                    }}
                  >
                    <Trash size={13} />
                    重置演示数据
                  </Button>
                </div>
              </SettingsBlock>
            </TabsContent>

            <TabsContent value="about">
              <SettingsBlock
                title="关于"
                description="Hucoo 个人助理 · 前端静态原型。"
              >
                <div className="space-y-2 text-[12px] text-muted-foreground">
                  <p>
                    这个原型只使用 fixtures 渲染状态，不连接后端，也不发起网络请求。
                  </p>
                  <p>
                    真实的任务阶段、报告与授权语义由后端定义；前端只做显示映射与兜底。
                  </p>
                  <div className="flex items-center justify-between rounded-[10px] bg-secondary/60 px-3 py-2">
                    <span>版本</span>
                    <span className="font-mono text-[11px]">0.1.0-prototype</span>
                  </div>
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
    <section className="rounded-[16px] border border-border bg-card/70 p-4 sm:p-5">
      <header className="mb-4">
        <h2 className="text-[14px] font-medium">{title}</h2>
        <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </header>
      {children}
    </section>
  );
}
