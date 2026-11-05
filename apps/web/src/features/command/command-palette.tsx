import { useNavigate } from "@tanstack/react-router";
import {
  Brain,
  Cube,
  GearSix,
  Laptop,
  Plus,
  Robot,
  Sparkle,
} from "@phosphor-icons/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@hucoo/ui/components/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@hucoo/ui/components/dialog";
import { ARTIFACTS, BOTS, WORK_ITEMS } from "@/fixtures";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { setTheme, getStoredTheme } from "@/lib/theme";

export function CommandPalette() {
  const open = useUiStore((state) => state.commandOpen);
  const setOpen = useUiStore((state) => state.setCommandOpen);
  const openTask = useUiStore((state) => state.openTask);
  const memories = useDemoStore((state) => state.memories);
  const navigate = useNavigate();

  function run(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="top-1/3 translate-y-0 gap-0 overflow-hidden rounded-xl p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">命令面板</DialogTitle>
        <DialogDescription className="sr-only">
          搜索 bot、任务、产物与记忆，或执行一个动作
        </DialogDescription>
        <Command>
          <CommandInput placeholder="搜索 bot、任务、产物…" />
          <CommandList>
            <CommandEmpty>没有找到结果。</CommandEmpty>

            <CommandGroup heading="动作">
              <CommandItem
                value="新建 bot new bot"
                onSelect={() => run(() => void navigate({ to: "/onboarding" }))}
              >
                <Plus size={15} />
                新建 bot
              </CommandItem>
              <CommandItem
                value="应用 apps"
                onSelect={() => run(() => void navigate({ to: "/apps" }))}
              >
                <Robot size={15} />
                应用与 Agent
              </CommandItem>
              <CommandItem
                value="技能 skills"
                onSelect={() => run(() => void navigate({ to: "/skills" }))}
              >
                <Sparkle size={15} />
                技能
              </CommandItem>
              <CommandItem
                value="产物 assets"
                onSelect={() => run(() => void navigate({ to: "/assets" }))}
              >
                <Cube size={15} />
                产物
              </CommandItem>
              <CommandItem
                value="记忆 memory"
                onSelect={() => run(() => void navigate({ to: "/memory" }))}
              >
                <Brain size={15} />
                记忆
              </CommandItem>
              <CommandItem
                value="设置 settings"
                onSelect={() => run(() => void navigate({ to: "/settings" }))}
              >
                <GearSix size={15} />
                设置
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
              <CommandItem
                value="切换主题 theme"
                onSelect={() =>
                  run(() =>
                    setTheme(getStoredTheme() === "dark" ? "light" : "dark"),
                  )
                }
              >
                <Laptop size={15} />
                切换亮色 / 暗色
              </CommandItem>
              {import.meta.env.DEV && (
                <CommandItem
                  value="状态画廊 states"
                  onSelect={() =>
                    run(() => {
                      window.location.href = "/dev/states";
                    })
                  }
                >
                  <Sparkle size={15} />
                  状态画廊（开发）
                </CommandItem>
              )}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Bots">
              {BOTS.map((bot) => (
                <CommandItem
                  key={bot.id}
                  value={`${bot.name} ${bot.role} ${bot.description}`}
                  onSelect={() =>
                    run(() =>
                      void navigate({
                        to: "/b/$botId",
                        params: { botId: bot.id },
                      }),
                    )
                  }
                >
                  <Robot size={15} />
                  {bot.name}
                  <CommandShortcut>{bot.role}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="任务">
              {WORK_ITEMS.map((item) => {
                const bot = BOTS.find((entry) => entry.id === item.botId);
                return (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.outcome} ${bot?.name ?? ""}`}
                    onSelect={() =>
                      run(() => {
                        openTask(item.id);
                        void navigate({
                          to: "/b/$botId",
                          params: { botId: item.botId },
                        });
                      })
                    }
                  >
                    <Cube size={15} />
                    {item.title}
                    <CommandShortcut>{bot?.name}</CommandShortcut>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="产物">
              {ARTIFACTS.map((artifact) => (
                <CommandItem
                  key={artifact.id}
                  value={`${artifact.title} ${artifact.id}`}
                  onSelect={() =>
                    run(() => {
                      window.location.href = `/artifact/${artifact.id}`;
                    })
                  }
                >
                  <Cube size={15} />
                  {artifact.title}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="记忆">
              {memories.slice(0, 6).map((memory) => (
                <CommandItem
                  key={memory.id}
                  value={`${memory.content} ${memory.id}`}
                  onSelect={() => run(() => void navigate({ to: "/memory" }))}
                >
                  <Brain size={15} />
                  <span className="truncate">{memory.content}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
