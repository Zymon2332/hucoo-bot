import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Eye, Lightning } from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { Input } from "@hucoo/ui/components/input";
import { Switch } from "@hucoo/ui/components/switch";
import type { Tone } from "@/fixtures/types";
import { toneLabel } from "@/display/labels";
import { useDemoStore } from "@/stores/demo-store";
import { AssistantAvatar } from "@/components/primitives";

const COLORS = ["#A64B2A", "#66735A", "#3F5D7A", "#8A5A83", "#8A6A2F"];
const TONES: Tone[] = ["concise", "warm", "direct", "playful"];
const TONE_HINT: Record<Tone, string> = {
  concise: "短句，先说结论",
  warm: "有温度，但不啰嗦",
  direct: "直接指出问题",
  playful: "偶尔开个小玩笑",
};

export function OnboardingPage() {
  const profile = useDemoStore((state) => state.profile);
  const complete = useDemoStore((state) => state.completeOnboarding);
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.name);
  const [accent, setAccent] = useState(profile.accent);
  const [addressAs, setAddressAs] = useState(profile.addressAs);
  const [tone, setTone] = useState<Tone>(profile.tone);
  const [memoryEnabled, setMemoryEnabled] = useState(profile.memoryEnabled);
  const [proactive, setProactive] = useState<"observe" | "auto">(
    profile.proactiveMode,
  );

  const preview = {
    ...profile,
    name: name || "小满",
    initials: (name || "小满").slice(0, 1),
    accent,
    addressAs: addressAs || "你",
    tone,
    memoryEnabled,
    proactiveMode: proactive,
  };

  function finish() {
    complete({
      name: preview.name,
      initials: preview.initials,
      accent,
      addressAs: preview.addressAs,
      tone,
      memoryEnabled,
      proactiveMode: proactive,
    });
    void navigate({ to: "/" });
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[980px] flex-col px-4 py-8 sm:px-6 sm:py-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-[18px] tracking-tight">
              认识一下
            </span>
            <span className="text-[11px] text-muted-foreground">
              3 步，之后随时可以改
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void navigate({ to: "/" })}
            className="text-muted-foreground"
          >
            稍后设置
          </Button>
        </header>

        <div className="mt-5 flex gap-1.5">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                index <= step ? "bg-clay" : "bg-border",
              )}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-h-[330px]">
            {step === 0 && (
              <section className="animate-rise">
                <h1 className="font-display text-[26px] tracking-tight">
                  先给它起个名字
                </h1>
                <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                  名字和颜色只影响它出现的方式，不影响能力。
                </p>
                <div className="mt-6 max-w-sm space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] text-muted-foreground">
                      助理名称
                    </span>
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      maxLength={12}
                      placeholder="小满"
                    />
                  </label>
                  <div>
                    <span className="mb-1.5 block text-[11px] text-muted-foreground">
                      颜色
                    </span>
                    <div className="flex gap-2">
                      {COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          aria-label={`选择颜色 ${color}`}
                          onClick={() => setAccent(color)}
                          className={cn(
                            "grid size-8 place-items-center rounded-full transition-transform",
                            accent === color && "ring-2 ring-offset-2 ring-offset-background",
                          )}
                          style={{
                            backgroundColor: color,
                            color: "white",
                            boxShadow:
                              accent === color
                                ? `0 0 0 2px ${color}`
                                : undefined,
                          }}
                        >
                          {accent === color && <Check size={14} weight="bold" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="animate-rise">
                <h1 className="font-display text-[26px] tracking-tight">
                  它该怎么称呼你？
                </h1>
                <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                  称呼会出现在问候、提醒和主动消息里。
                </p>
                <div className="mt-6 max-w-sm space-y-5">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] text-muted-foreground">
                      称呼
                    </span>
                    <Input
                      value={addressAs}
                      onChange={(event) => setAddressAs(event.target.value)}
                      placeholder="WZM"
                    />
                  </label>
                  <div>
                    <span className="mb-1.5 block text-[11px] text-muted-foreground">
                      语气
                    </span>
                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {TONES.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setTone(item)}
                          className={cn(
                            "rounded-[12px] border px-3 py-2 text-left transition-colors",
                            tone === item
                              ? "border-clay/40 bg-accent/50"
                              : "border-border bg-card/60 hover:bg-secondary/60",
                          )}
                        >
                          <span className="block text-[12.5px] font-medium">
                            {toneLabel(item)}
                          </span>
                          <span className="mt-0.5 block text-[10.5px] text-muted-foreground">
                            {TONE_HINT[item]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="animate-rise">
                <h1 className="font-display text-[26px] tracking-tight">
                  最后，关于边界
                </h1>
                <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                  默认设置已经足够安静，你可以稍后再调。
                </p>
                <div className="mt-6 max-w-md space-y-3">
                  <div className="flex items-center justify-between rounded-[14px] border border-border bg-card/60 px-3.5 py-3">
                    <div>
                      <p className="text-[12.5px] font-medium">记住关于你的事</p>
                      <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                        偏好、项目、关系与习惯，都可以随时查看和删除。
                      </p>
                    </div>
                    <Switch
                      checked={memoryEnabled}
                      aria-label="记忆开关"
                      onCheckedChange={setMemoryEnabled}
                    />
                  </div>

                  <div className="rounded-[14px] border border-border bg-card/60 px-3.5 py-3">
                    <p className="text-[12.5px] font-medium">主动行为</p>
                    <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                      观察模式只记录它想做的事，不会直接执行。
                    </p>
                    <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setProactive("observe")}
                        className={cn(
                          "flex items-start gap-2 rounded-[10px] border px-2.5 py-2 text-left transition-colors",
                          proactive === "observe"
                            ? "border-clay/40 bg-accent/50"
                            : "border-border hover:bg-secondary/60",
                        )}
                      >
                        <Eye size={14} className="mt-0.5 text-clay" />
                        <span>
                          <span className="block text-[12px] font-medium">观察</span>
                          <span className="text-[10px] text-muted-foreground">
                            先记录，由你决定
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProactive("auto")}
                        className={cn(
                          "flex items-start gap-2 rounded-[10px] border px-2.5 py-2 text-left transition-colors",
                          proactive === "auto"
                            ? "border-clay/40 bg-accent/50"
                            : "border-border hover:bg-secondary/60",
                        )}
                      >
                        <Lightning size={14} className="mt-0.5 text-clay" />
                        <span>
                          <span className="block text-[12px] font-medium">自动</span>
                          <span className="text-[10px] text-muted-foreground">
                            规则命中就直接做
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-4 rounded-[20px] border border-border bg-card/70 p-5 shadow-[var(--shadow-card)]">
              <AssistantAvatar profile={preview} size="xl" status="online" />
              <p className="mt-3 font-display text-[20px] tracking-tight">
                {preview.name}
              </p>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                {preview.role}
              </p>
              <div className="mt-4 space-y-2 border-t border-border/70 pt-3 text-[11.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">怎么称呼你</span>
                  <span>{preview.addressAs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">语气</span>
                  <span>{toneLabel(preview.tone)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">记忆</span>
                  <span>{preview.memoryEnabled ? "开启" : "关闭"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">主动行为</span>
                  <span>{preview.proactiveMode === "observe" ? "观察" : "自动"}</span>
                </div>
              </div>
              <p className="mt-4 rounded-[10px] bg-secondary/60 px-2.5 py-2 text-[10.5px] leading-relaxed text-muted-foreground">
                它只会在结果可用、需要你决定、或无法完成时出现。
              </p>
            </div>
          </aside>
        </div>

        <footer className="mt-8 flex items-center justify-between border-t border-border/70 pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={step === 0}
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            className="text-muted-foreground"
          >
            <ArrowLeft size={14} />
            上一步
          </Button>
          {step < 2 ? (
            <Button
              type="button"
              size="sm"
              onClick={() => setStep((value) => Math.min(2, value + 1))}
              disabled={step === 0 && !name.trim()}
            >
              下一步
              <ArrowRight size={14} />
            </Button>
          ) : (
            <Button type="button" size="sm" onClick={finish}>
              开始使用
              <Check size={14} />
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}
