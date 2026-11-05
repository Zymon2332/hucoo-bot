import { useState } from "react";
import { Sparkle } from "@phosphor-icons/react";
import { Switch } from "@hucoo/ui/components/switch";
import { Card } from "@hucoo/ui/components/card";
import { BOTS, SKILLS } from "@/fixtures";

export function SkillsPage({ embedded = false }: { embedded?: boolean }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(SKILLS.map((skill) => [skill.id, true])),
  );

  return (
    <div className={embedded ? "h-full overflow-y-auto p-3" : "h-full overflow-y-auto"}>
      <div
        className={
          embedded
            ? ""
            : "mx-auto w-full max-w-[900px] px-4 pb-16 pt-6 sm:px-6"
        }
      >
        {!embedded && (
          <header>
            <h1 className="text-[22px] font-semibold tracking-tight">技能</h1>
            <p className="mt-1 text-[12px] text-muted-foreground">
              bot 可以按需加载的技能。技能只影响能力，不改变授权。
            </p>
          </header>
        )}

        <div className={embedded ? "space-y-2" : "mt-6 space-y-2"}>
          {SKILLS.map((skill) => {
            const on = enabled[skill.id] ?? true;
            const bots = BOTS.filter((bot) => skill.assignedBotIds.includes(bot.id));
            return (
              <Card
                key={skill.id}
                size="sm"
                className="flex-row items-start gap-2 border border-border bg-card p-3.5 ring-0"
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
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
