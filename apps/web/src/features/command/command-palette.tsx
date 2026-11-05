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
import { AGENTS, ARTIFACTS, WORK_ITEMS } from "@/fixtures";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { setTheme, getStoredTheme } from "@/lib/theme";

export function CommandPalette() {
  const open = useUiStore((state) => state.commandOpen);
  const setOpen = useUiStore((state) => state.setCommandOpen);
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
          搜索工作项、代理、产物与记忆，或执行一个动作
        </DialogDescription>
        <Command>
          <CommandInput placeholder="搜索工作项、代理、产物…" />
          <CommandList>
            <CommandEmpty>没有找到结果。</CommandEmpty>

            <CommandGroup heading="动作">
              <CommandItem
                value="新的事 new work"
                onSelect={() => run(() => void navigate({ to: "/" }))}
              >
                <Plus size={15} />
                新的事
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem
                value="代理 agents"
                onSelect={() => run(() => void navigate({ to: "/agents" }))}
              >
                <Robot size={15} />
                打开代理名册
              </CommandItem>
              <CommandItem
                value="记忆中心 memory"
                onSelect={() => run(() => void navigate({ to: "/memory" }))}
              >
                <Brain size={15} />
                打开记忆中心
              </CommandItem>
              <CommandItem
                value="设置 settings"
                onSelect={() => run(() => void navigate({ to: "/settings" }))}
              >
                <GearSix size={15} />
                打开设置
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
              <CommandItem
                value="切换主题 theme"
                onSelect={() =>
                  run(() => {
                    setTheme(getStoredTheme() === "dark" ? "light" : "dark");
                  })
                }
              >
                <Laptop size={15} />
                切换亮色 / 暗色
              </CommandItem>
              {import.meta.env.DEV && (
                <CommandItem
                  value="状态画廊 states gallery"
                  onSelect={() =>
                    run(() => {
                      window.location.href = "/dev/states";
                    })
                  }
                >
                  <Sparkle size={15} />
                  打开状态画廊（开发）
                </CommandItem>
              )}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="工作项">
              {WORK_ITEMS.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.title} ${item.outcome} ${item.id}`}
                  onSelect={() =>
                    run(() =>
                      void navigate({
                        to: "/w/$workItemId",
                        params: { workItemId: item.id },
                        search: { tab: "overview" },
                      }),
                    )
                  }
                >
                  <Cube size={15} />
                  {item.title}
                  <CommandShortcut>{item.updatedAt}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="代理">
              {AGENTS.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={`${agent.name} ${agent.role} ${agent.id}`}
                  onSelect={() => run(() => void navigate({ to: "/agents" }))}
                >
                  <Robot size={15} />
                  {agent.name}
                  <CommandShortcut>{agent.role}</CommandShortcut>
                </CommandItem>
              ))}
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
                  onSelect={() =>
                    run(() => void navigate({ to: "/memory" }))
                  }
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
