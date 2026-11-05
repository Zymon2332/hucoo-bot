import {
  Cube,
  GearSix,
  PlugsConnected,
  Sparkle,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@hucoo/ui/components/dropdown-menu";
import { useUiStore } from "@/stores/ui-store";

const USER = { name: "WZM", initials: "WZ", accent: "#475569" };

export function UserMenu({ collapsed = false }: { collapsed?: boolean }) {
  const setActiveModal = useUiStore((state) => state.setActiveModal);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`${USER.initials} 用户菜单`}
          className={
            collapsed
              ? "grid size-9 place-items-center rounded-full text-[11px] font-semibold text-white"
              : "flex h-9 w-full items-center gap-2 rounded-[9px] px-2 text-left transition-colors hover:bg-sidebar-accent"
          }
          style={collapsed ? { backgroundColor: USER.accent } : undefined}
        >
          <span
            className="grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white"
            style={{ backgroundColor: USER.accent }}
          >
            {USER.initials}
          </span>
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-medium text-foreground">
                {USER.name}
              </span>
              <span className="block truncate text-[10px] text-muted-foreground">
                设置 · 技能 · 产物 · 应用
              </span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-44">
        <DropdownMenuLabel>{USER.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setActiveModal("settings")}>
          <GearSix size={14} />
          设置
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setActiveModal("skills")}>
          <Sparkle size={14} />
          技能
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setActiveModal("assets")}>
          <Cube size={14} />
          产物
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setActiveModal("apps")}>
          <PlugsConnected size={14} />
          应用
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
