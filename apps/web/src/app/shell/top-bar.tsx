import { Bell, List } from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import { WORK_ITEMS } from "@/fixtures";
import { needsHuman, projectWorkItem } from "@/lib/work-state";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";

export function TopBar({ title }: { title?: string }) {
  const answers = useDemoStore((state) => state.answers);
  const reviews = useDemoStore((state) => state.reviews);
  const stopped = useDemoStore((state) => state.stopped);
  const setBellOpen = useUiStore((state) => state.setBellOpen);
  const setMobileRailOpen = useUiStore((state) => state.setMobileRailOpen);

  const queueCount = WORK_ITEMS.map((item) =>
    projectWorkItem(item, { answers, reviews, stopped }),
  ).filter((item) => needsHuman(item)).length;

  return (
    <header className="flex h-13 shrink-0 items-center gap-2 border-b border-border/70 px-3 sm:px-4">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setMobileRailOpen(true)}
        aria-label="打开工作项"
        className="text-muted-foreground md:hidden"
      >
        <List size={18} />
      </Button>

      <h1 className="min-w-0 truncate text-[14px] font-medium tracking-tight">
        {title ?? "今天"}
      </h1>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setBellOpen(true)}
          aria-label="需要你"
          className="relative text-muted-foreground"
        >
          <Bell size={16} />
          {queueCount > 0 && (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-clay" />
          )}
        </Button>
      </div>
    </header>
  );
}
