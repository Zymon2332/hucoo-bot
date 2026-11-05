import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkle } from "@phosphor-icons/react";
import { Switch } from "@hucoo/ui/components/switch";
import { BOTS, SKILLS } from "@/fixtures";
import { BotAvatar } from "@/components/bot-avatar";
import { SectionHeading } from "@/components/primitives";

export function SkillsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(SKILLS.map((skill) => [skill.id, true])),
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[900px] px-4 pb-16 pt-6 sm:px-6">
        <header>
          <h1 className="text-[22px] font-semibold tracking-tight">技能</h1>
          <p className="mt-1 text-[12px] text-muted-foreground">
            bot 可以按需加载的技能。技能只影响能力，不改变授权。
          </p>
        </header>

        <div className="mt-6 space-y-2">
          {SKILLS.map((skill) => {
            const on = enabled[skill.id] ?? true;
            const bots = BOTS.filter((bot) => skill.assignedBotIds.includes(bot.id));
            return (
              <article
                key={skill.id}
                className="flex items-start gap-2 rounded-[12px] border border-border bg-card/70 px-3.5 py-3"
              >
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-[8px] bg-secondary text-clay">
                  <Sparkle size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] font-medium">
                      {skill.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {bots.map((bot) => bot.name).join(" · ")}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                    {skill.description}
                  </p>
                </div>
                <Switch
                  checked={on}
                  aria-label={`${skill.name}开关`}
                  onCheckedChange={(checked) =>
                    setEnabled((state) => ({ ...state, [skill.id]: checked }))
                  }
                />
              </article>
            );
          })}
        </div>

        <SectionHeading>按 bot 查看</SectionHeading>
        <div className="mt-2 flex flex-wrap gap-2">
          {BOTS.map((bot) => (
            <Link
              key={bot.id}
              to="/b/$botId"
              params={{ botId: bot.id }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              <BotAvatar bot={bot} size="sm" />
              {bot.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
