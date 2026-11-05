import {
  Cube,
  Desktop,
  GearSix,
  ListChecks,
  SidebarSimple,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { getBot } from "@/fixtures";
import type { PanelTab } from "@/fixtures/types";
import { useUiStore } from "@/stores/ui-store";
import { TasksPanel } from "./tasks-panel";
import { ComputerPanel } from "./computer-panel";
import { AssetsPanel } from "./assets-panel";
import { BotSettingsPanel } from "./bot-settings-panel";

const TABS: Array<{ id: PanelTab; label: string; icon: typeof ListChecks }> = [
  { id: "tasks", label: "任务", icon: ListChecks },
  { id: "computer", label: "电脑", icon: Desktop },
  { id: "assets", label: "资产", icon: Cube },
  { id: "settings", label: "设置", icon: GearSix },
];

export function RightPanel({ botId }: { botId?: string }) {
  const bot = botId ? getBot(botId) : undefined;
  const open = useUiStore((state) => state.panelOpen);
  const tab = useUiStore((state) => state.panelTab);
  const setTab = useUiStore((state) => state.setPanelTab);
  const setOpen = useUiStore((state) => state.setPanelOpen);

  if (!bot) return null;

  if (!open) {
    return (
      <aside className="hidden w-11 shrink-0 flex-col items-center gap-1 rounded-[16px] border border-border bg-card/50 py-2 lg:flex">
        {TABS.map((entry) => {
          const Icon = entry.icon;
          return (
            <Button
              key={entry.id}
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={entry.label}
              onClick={() => setTab(entry.id)}
              className="text-muted-foreground"
            >
              <Icon size={16} />
            </Button>
          );
        })}
      </aside>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="关闭右侧面板"
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[1px] lg:hidden"
      />
      <aside className="fixed inset-y-2 right-2 z-40 flex w-[min(380px,calc(100vw-1.5rem))] shrink-0 flex-col overflow-hidden rounded-[18px] border border-border bg-card/95 shadow-[var(--shadow-float)] backdrop-blur lg:static lg:inset-auto lg:z-auto lg:w-[380px] lg:bg-card/50 lg:shadow-none">
        <header className="flex shrink-0 items-center gap-0.5 border-b border-border/70 px-2 py-1.5">
          {TABS.map((entry) => {
            const Icon = entry.icon;
            const active = tab === entry.id;
            return (
              <Button
                key={entry.id}
                type="button"
                variant={active ? "secondary" : "ghost"}
                size="xs"
                onClick={() => setTab(entry.id)}
                className={cn(
                  "h-7 rounded-[7px] px-2 text-[10.5px]",
                  !active && "text-muted-foreground",
                )}
              >
                <Icon size={11} />
                {entry.label}
              </Button>
            );
          })}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setOpen(false)}
            aria-label="收起面板"
            className="ml-auto text-muted-foreground lg:hidden"
          >
            <SidebarSimple size={13} className="rotate-180" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {tab === "tasks" && <TasksPanel botId={bot.id} />}
          {tab === "computer" && <ComputerPanel />}
          {tab === "assets" && <AssetsPanel botId={bot.id} />}
          {tab === "settings" && <BotSettingsPanel bot={bot} />}
        </div>
      </aside>
    </>
  );
}
