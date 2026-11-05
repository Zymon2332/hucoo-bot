import { useMemo } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Compass,
  GearSix,
  MagnifyingGlass,
  Plus,
  SidebarSimple,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { WORK_ITEMS } from "@/fixtures";
import type { WorkItem } from "@/fixtures/types";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { projectWorkItem, needsHuman } from "@/lib/work-state";
import { AssistantAvatar, Kbd } from "@/components/primitives";

function groupOf(item: WorkItem): string {
  if (needsHuman(item)) return "需要你";
  if (item.stage === "working" || item.stage === "queued") return "进行中";
  if (item.stage === "waiting") return "等待中";
  return "已结束";
}

export function WorkRail() {
  const profile = useDemoStore((state) => state.profile);
  const answers = useDemoStore((state) => state.answers);
  const reviews = useDemoStore((state) => state.reviews);
  const stopped = useDemoStore((state) => state.stopped);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const activeId = pathname.startsWith("/w/") ? pathname.slice(3) : undefined;
  const collapsed = useUiStore((state) => state.railCollapsed);
  const toggleRail = useUiStore((state) => state.toggleRail);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);

  const groups = useMemo(() => {
    const order = ["需要你", "进行中", "等待中", "已结束"];
    const items = WORK_ITEMS.map((item) =>
      projectWorkItem(item, { answers, reviews, stopped }),
    );
    return order
      .map((label) => ({
        label,
        items: items.filter((item) => groupOf(item) === label),
      }))
      .filter((group) => group.items.length > 0);
  }, [answers, reviews, stopped]);

  if (collapsed) {
    return (
      <aside className="hidden w-[60px] shrink-0 flex-col items-center gap-2 md:flex">
        <div className="mb-2">
          <AssistantAvatar profile={profile} size="md" status="online" />
        </div>
        <Button asChild size="icon-lg" aria-label="新的事">
          <Link to="/">
            <Plus size={17} weight="bold" />
          </Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          onClick={() => setCommandOpen(true)}
          aria-label="搜索"
          className="text-muted-foreground"
        >
          <MagnifyingGlass size={17} />
        </Button>
        <div className="mt-auto flex flex-col items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={toggleRail}
            aria-label="展开工作项"
            className="text-muted-foreground"
          >
            <SidebarSimple size={17} />
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon-lg"
            aria-label="设置"
            className="text-muted-foreground"
          >
            <Link to="/settings">
              <GearSix size={17} />
            </Link>
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden w-[270px] shrink-0 flex-col rounded-[22px] border border-sidebar-border bg-sidebar/80 p-3 backdrop-blur md:flex">
      <header className="flex items-center gap-2.5 px-1 py-1">
        <AssistantAvatar profile={profile} size="md" status="online" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold leading-tight">
            {profile.name}
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            决策台 · {profile.proactiveMode === "observe" ? "观察模式" : "自动模式"}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleRail}
          aria-label="收起工作项"
          className="text-muted-foreground"
        >
          <SidebarSimple size={15} />
        </Button>
      </header>

      <div className="mt-3 space-y-1">
        <Button asChild className="h-9 w-full justify-start gap-2 rounded-[10px] px-3 text-[13px]">
          <Link to="/">
            <Plus size={15} weight="bold" />
            新的事
          </Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCommandOpen(true)}
          className="h-9 w-full justify-start gap-2 rounded-[10px] px-3 text-[13px] font-normal text-muted-foreground"
        >
          <MagnifyingGlass size={15} />
          搜索与跳转
          <Kbd>⌘K</Kbd>
        </Button>
      </div>

      <nav className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-0.5">
        {groups.map((group) => (
          <section key={group.label}>
            <h2 className="px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
              {group.label}
            </h2>
            <ul className="mt-1 space-y-0.5">
              {group.items.map((item) => {
                const active = item.id === activeId;
                return (
                  <li key={item.id}>
                    <Link
                      to="/w/$workItemId"
                      params={{ workItemId: item.id }}
                      search={{ tab: "overview" }}
                      className={cn(
                        "group flex h-8 items-center gap-2 rounded-[9px] px-2 text-[12.5px] transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          active
                            ? "bg-clay"
                            : item.stage === "failed" || item.stage === "blocked"
                              ? "bg-destructive/50"
                              : "bg-transparent group-hover:bg-muted-foreground/30",
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      <footer className="mt-3 border-t border-sidebar-border pt-2">
        <div className="flex items-center gap-2 rounded-[10px] px-1 py-1">
          <AssistantAvatar profile={profile} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11.5px] font-medium">
              {profile.name} · 记得你
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              {profile.memoryEnabled ? `${profile.addressAs} 的记忆已开启` : "记忆已关闭"}
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            aria-label="设置"
            className="text-muted-foreground"
          >
            <Link to="/settings">
              <GearSix size={15} />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            aria-label="重新设置人格"
            className="text-muted-foreground"
          >
            <Link to="/onboarding">
              <Compass size={15} />
            </Link>
          </Button>
        </div>
      </footer>
    </aside>
  );
}
