import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, GearSix, Plus, Robot, Sparkle } from "@phosphor-icons/react";
import { Switch } from "@hucoo/ui/components/switch";
import { Button } from "@hucoo/ui/components/button";
import { appsForBot, skillsForBot } from "@/fixtures";
import type { Bot } from "@/fixtures/types";

export function BotSettingsPanel({ bot }: { bot: Bot }) {
  const apps = appsForBot(bot.id);
  const skills = skillsForBot(bot.id);
  const external = apps.filter((app) => app.kind === "mcp");
  const agents = apps.filter((app) => app.kind === "agent");
  const [memoryScope, setMemoryScope] = useState(bot.memoryScope);

  return (
    <div className="space-y-4 p-3">
      <section>
        <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
          人格
        </p>
        <div className="mt-1.5 rounded-[10px] border border-border bg-card/60 px-3 py-2.5">
          <p className="text-[12.5px] font-medium">
            {bot.name} · {bot.role}
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-muted-foreground">
            {bot.persona}
          </p>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>称呼：{bot.addressAs}</span>
            <span>语气：{bot.tone}</span>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
            外部应用
          </p>
          <Button asChild variant="link" size="xs" className="h-auto px-0">
            <Link to="/apps">
              管理
              <ArrowRight size={10} />
            </Link>
          </Button>
        </div>
        <div className="mt-1.5 space-y-1">
          {external.map((app) => (
            <div
              key={app.id}
              className="flex items-center gap-2 rounded-[8px] border border-border/70 px-2 py-1.5 text-[10.5px]"
            >
              <span
                className={
                  app.status === "connected"
                    ? "size-1.5 rounded-full bg-sage"
                    : app.status === "error"
                      ? "size-1.5 rounded-full bg-destructive"
                      : "size-1.5 rounded-full bg-muted-foreground/40"
                }
              />
              <span className="min-w-0 flex-1 truncate">{app.name}</span>
              <span className="text-[9px] text-muted-foreground">
                {app.status === "connected"
                  ? "已连接"
                  : app.status === "error"
                    ? "错误"
                    : "可用"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
          可用 Agent
        </p>
        <div className="mt-1.5 space-y-1">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-2 rounded-[8px] border border-border/70 px-2 py-1.5 text-[10.5px]"
            >
              <Robot size={11} className="text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">{agent.name}</span>
              <span className="text-[9px] text-muted-foreground">
                {agent.status === "connected" ? "已授权" : "可用"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-section-label">
          技能
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {skills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              <Sparkle size={9} />
              {skill.name}
            </span>
          ))}
          <Button asChild variant="ghost" size="xs" className="h-6 rounded-full text-[10px]">
            <Link to="/skills">
              <Plus size={9} />
              添加
            </Link>
          </Button>
        </div>
      </section>

      <section className="flex items-center justify-between rounded-[10px] border border-border px-3 py-2.5">
        <div>
          <p className="text-[11.5px] font-medium">记忆范围</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {memoryScope === "bot" ? "只在这个 bot 内共享" : "与全局记忆共享"}
          </p>
        </div>
        <Switch
          checked={memoryScope === "bot"}
          aria-label="记忆范围"
          onCheckedChange={(checked) =>
            setMemoryScope(checked ? "bot" : "global")
          }
        />
      </section>

      <Button asChild variant="outline" size="sm" className="w-full">
        <Link to="/settings">
          <GearSix size={12} />
          打开全局设置
        </Link>
      </Button>
    </div>
  );
}
