import { Link } from "@tanstack/react-router";
import { Cube, GearSix, PlugsConnected, Sparkle } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@hucoo/ui/components/dropdown-menu";
const USER = { name: "WZM", initials: "WZ", accent: "#475569" };

export function AvatarMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`${USER.initials} 用户菜单`}
          className="fixed bottom-4 right-4 z-50 grid size-8 place-items-center rounded-full text-[11px] font-semibold text-white shadow-[var(--shadow-float)] ring-2 ring-background transition-transform hover:scale-105"
          style={{ backgroundColor: USER.accent }}
        >
          {USER.initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="w-44">
        <DropdownMenuLabel>{USER.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/skills">
            <Sparkle size={14} />
            技能
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/assets">
            <Cube size={14} />
            产物
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/apps">
            <PlugsConnected size={14} />
            应用
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <GearSix size={14} />
            设置
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
