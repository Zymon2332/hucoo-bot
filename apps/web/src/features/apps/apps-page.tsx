import { useState } from "react";
import { PlugsConnected, Robot, Wrench } from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import { Card } from "@hucoo/ui/components/card";
import { APPS } from "@/fixtures";
import type { AppConnection } from "@/fixtures/types";
import { SectionHeading } from "@/components/primitives";

export function AppsPage({ embedded = false }: { embedded?: boolean }) {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(APPS.map((app) => [app.id, app.status === "connected"])),
  );

  const groups: Array<{
    kind: AppConnection["kind"];
    label: string;
    description: string;
    icon: typeof Robot;
  }> = [
    {
      kind: "mcp",
      label: "外部应用",
      description: "MCP、Figma、日历、邮件、GitHub…",
      icon: Wrench,
    },
    {
      kind: "agent",
      label: "Agents",
      description: "opencode、Claude Code、Codex…",
      icon: Robot,
    },
  ];

  return (
    <div className={embedded ? "h-full overflow-y-auto p-3" : "h-full overflow-y-auto"}>
      <div
        className={
          embedded
            ? ""
            : "mx-auto w-full max-w-[980px] px-4 pb-16 pt-6 sm:px-6"
        }
      >
        {!embedded && (
          <header>
            <h1 className="text-[22px] font-semibold tracking-tight">应用</h1>
            <p className="mt-1 text-[12px] text-muted-foreground">
              添加外部应用与 Agent，供 bot 使用。
            </p>
          </header>
        )}

        <div className={embedded ? "space-y-6" : "mt-6 space-y-7"}>
          {groups.map((group) => {
            const apps = APPS.filter((app) => app.kind === group.kind);
            const Icon = group.icon;
            return (
              <section key={group.kind}>
                <SectionHeading
                  aside={
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Icon size={11} />
                      {apps.length}
                    </span>
                  }
                >
                  {group.label}
                </SectionHeading>
                <p className="mt-1 text-[10.5px] text-muted-foreground">
                  {group.description}
                </p>
                <div className="mt-2 grid gap-2 lg:grid-cols-2">
                  {apps.map((app) => {
                    const on = connected[app.id] ?? false;
                    return (
                      <Card
                        key={app.id}
                        size="sm"
                        className="gap-0 border border-border bg-card p-3.5 ring-0"
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-[8px] bg-secondary text-muted-foreground">
                            <PlugsConnected size={14} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[12.5px] font-medium">
                                {app.name}
                              </span>
                              <span
                                className={
                                  app.status === "error"
                                    ? "size-1.5 rounded-full bg-destructive"
                                    : on
                                      ? "size-1.5 rounded-full bg-sage"
                                      : "size-1.5 rounded-full bg-muted-foreground/40"
                                }
                              />
                              <span className="text-[9.5px] text-muted-foreground">
                                {app.status === "error"
                                  ? "错误"
                                  : on
                                    ? "已添加"
                                    : "未添加"}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                              {app.description}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="xs"
                            variant={on ? "outline" : "default"}
                            onClick={() =>
                              setConnected((state) => ({
                                ...state,
                                [app.id]: !on,
                              }))
                            }
                          >
                            {on ? "移除" : "添加"}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
