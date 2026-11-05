import { Link } from "@tanstack/react-router";
import { GearSix, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@hucoo/ui/components/sheet";
import { Button } from "@hucoo/ui/components/button";
import { WORK_ITEMS } from "@/fixtures";
import { useDemoStore } from "@/stores/demo-store";
import { useUiStore } from "@/stores/ui-store";
import { needsHuman, projectWorkItem } from "@/lib/work-state";
import { AssistantAvatar } from "@/components/primitives";

export function MobileRail() {
  const open = useUiStore((state) => state.mobileRailOpen);
  const setOpen = useUiStore((state) => state.setMobileRailOpen);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const profile = useDemoStore((state) => state.profile);
  const answers = useDemoStore((state) => state.answers);
  const reviews = useDemoStore((state) => state.reviews);
  const stopped = useDemoStore((state) => state.stopped);

  const items = WORK_ITEMS.map((item) =>
    projectWorkItem(item, { answers, reviews, stopped }),
  ).sort((a, b) => Number(needsHuman(b)) - Number(needsHuman(a)));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-[300px] gap-0 p-0">
        <SheetHeader className="border-b border-border/70 px-4 py-3">
          <SheetTitle className="flex items-center gap-2 text-[14px]">
            <AssistantAvatar profile={profile} size="sm" status="online" />
            {profile.name}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-1 p-3">
          <Button asChild className="h-9 w-full justify-start gap-2">
            <Link to="/" onClick={() => setOpen(false)}>
              <Plus size={15} weight="bold" />
              新的事
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setOpen(false);
              setCommandOpen(true);
            }}
            className="h-9 w-full justify-start gap-2 font-normal text-muted-foreground"
          >
            <MagnifyingGlass size={15} />
            搜索与跳转
          </Button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
          <h2 className="px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
            工作项
          </h2>
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  to="/w/$workItemId"
                  params={{ workItemId: item.id }}
                  search={{ tab: "overview" }}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-[9px] px-2 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <span
                    className={
                      needsHuman(item)
                        ? "size-1.5 rounded-full bg-warning"
                        : "size-1.5 rounded-full bg-border"
                    }
                  />
                  <span className="truncate">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border/70 p-3">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-2 font-normal"
          >
            <Link to="/settings" onClick={() => setOpen(false)}>
              <GearSix size={15} />
              设置
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
