import { useState } from "react";
import {
  ArrowClockwise,
  Desktop,
  FolderSimple,
  TerminalWindow,
  Cpu,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import {
  CONTAINER,
  PROCESSES,
  TERMINAL_LINES,
  WORKSPACE_FILES,
} from "@/fixtures";

type ComputerTab = "desktop" | "terminal" | "files" | "processes";

const TABS: Array<{ id: ComputerTab; label: string; icon: typeof Desktop }> = [
  { id: "desktop", label: "桌面", icon: Desktop },
  { id: "terminal", label: "终端", icon: TerminalWindow },
  { id: "files", label: "文件", icon: FolderSimple },
  { id: "processes", label: "进程", icon: Cpu },
];

export function ComputerPanel() {
  const [tab, setTab] = useState<ComputerTab>("desktop");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-border/70 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-sage" />
          <span className="text-[11.5px] font-medium">容器在线</span>
          <span className="text-[10px] text-muted-foreground">
            {CONTAINER.os} · {CONTAINER.cpu} · {CONTAINER.memory} · 运行{" "}
            {CONTAINER.uptime}
          </span>
        </div>
        <p className="mt-1 truncate font-mono text-[9.5px] text-muted-foreground/70">
          {CONTAINER.workspace}
        </p>
        <div className="mt-2 flex gap-1">
          <Button type="button" size="xs" variant="outline">
            <TerminalWindow size={11} />
            打开终端
          </Button>
          <Button type="button" size="xs" variant="ghost" className="text-muted-foreground">
            <ArrowClockwise size={11} />
            重启
          </Button>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 border-b border-border/70 px-2 py-1">
        {TABS.map((entry) => {
          const Icon = entry.icon;
          return (
            <Button
              key={entry.id}
              type="button"
              size="xs"
              variant={tab === entry.id ? "secondary" : "ghost"}
              onClick={() => setTab(entry.id)}
              className={cn(
                "h-7 rounded-[7px] px-2 text-[10.5px]",
                tab !== entry.id && "text-muted-foreground",
              )}
            >
              <Icon size={11} />
              {entry.label}
            </Button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
        {tab === "desktop" && <DesktopView />}
        {tab === "terminal" && <TerminalView />}
        {tab === "files" && <FilesView />}
        {tab === "processes" && <ProcessesView />}
      </div>
    </div>
  );
}

function DesktopView() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-border bg-[#1b1d21]">
      <div className="flex items-center gap-1 border-b border-white/10 px-2 py-1">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[9px] text-white/40">agent@container</span>
      </div>
      <div className="grid gap-1.5 p-2 sm:grid-cols-2">
        <div className="rounded-[6px] border border-white/10 bg-[#111317]">
          <div className="border-b border-white/10 px-2 py-1 text-[9px] text-white/50">
            Terminal
          </div>
          <pre className="max-h-36 overflow-hidden p-2 font-mono text-[8.5px] leading-relaxed text-white/70">
            {TERMINAL_LINES.slice(0, 8).join("\n")}
          </pre>
        </div>
        <div className="rounded-[6px] border border-white/10 bg-[#111317]">
          <div className="border-b border-white/10 px-2 py-1 text-[9px] text-white/50">
            Files
          </div>
          <div className="space-y-1 p-2 font-mono text-[8.5px] text-white/60">
            {WORKSPACE_FILES.slice(0, 5).map((file) => (
              <div key={file.path} className="flex items-center gap-1">
                <span
                  className={
                    file.status === "modified"
                      ? "text-[#febc2e]"
                      : file.status === "added"
                        ? "text-[#28c840]"
                        : "text-white/30"
                  }
                >
                  ●
                </span>
                <span className="truncate">{file.path}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2 rounded-[6px] border border-white/10 bg-[#f7f7f5] p-2">
          <div className="flex items-center gap-1 text-[8.5px] text-[#555]">
            <span className="size-1.5 rounded-full bg-[#28c840]" />
            localhost:5173 · 登录模块
          </div>
          <div className="mt-1 h-20 rounded-[4px] border border-black/10 bg-white p-2">
            <div className="h-2 w-20 rounded bg-black/10" />
            <div className="mt-1.5 h-1.5 w-full rounded bg-black/5" />
            <div className="mt-1 h-1.5 w-3/4 rounded bg-black/5" />
            <div className="mt-2 h-5 w-16 rounded bg-[#2F5FA8]/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalView() {
  return (
    <pre className="min-h-[300px] rounded-[10px] border border-border bg-[#111317] p-3 font-mono text-[10px] leading-relaxed text-white/70">
      {TERMINAL_LINES.map((line, index) => (
        <div
          key={index}
          className={line.startsWith("$") ? "text-[#8ab4f8]" : undefined}
        >
          {line}
        </div>
      ))}
    </pre>
  );
}

function FilesView() {
  return (
    <div className="rounded-[10px] border border-border">
      {WORKSPACE_FILES.map((file) => (
        <div
          key={file.path}
          className="flex items-center gap-2 border-b border-border/60 px-2.5 py-1.5 text-[10.5px] last:border-0"
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              file.status === "modified" && "bg-warning",
              file.status === "added" && "bg-sage",
              file.status === "clean" && "bg-muted-foreground/30",
            )}
          />
          <span className="min-w-0 flex-1 truncate font-mono">{file.path}</span>
          <span className="text-[9px] text-muted-foreground">
            {file.status === "modified"
              ? "修改"
              : file.status === "added"
                ? "新增"
                : "干净"}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProcessesView() {
  return (
    <div className="rounded-[10px] border border-border">
      {PROCESSES.map((process) => (
        <div
          key={process.name}
          className="border-b border-border/60 px-2.5 py-2 last:border-0"
        >
          <div className="flex items-center gap-2 text-[10.5px]">
            <span className="font-mono font-medium">{process.name}</span>
            <span className="ml-auto text-[9px] text-muted-foreground">
              CPU {process.cpu} · {process.memory}
            </span>
          </div>
          <p className="mt-0.5 text-[9.5px] text-muted-foreground">
            {process.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
