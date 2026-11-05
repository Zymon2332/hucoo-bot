import { Avatar, AvatarBadge, AvatarFallback } from "@hucoo/ui/components/avatar";
import { cn } from "@hucoo/ui";
import type { Bot } from "@/fixtures/types";

const SIZES = {
  sm: { avatar: "size-7 rounded-[9px]", fallback: "rounded-[9px] text-[10px]" },
  md: { avatar: "size-8 rounded-[10px]", fallback: "rounded-[10px] text-[11px]" },
  lg: { avatar: "size-11 rounded-[13px]", fallback: "rounded-[13px] text-[13px]" },
  xl: { avatar: "size-14 rounded-[16px]", fallback: "rounded-[16px] text-[16px]" },
} as const;

export function BotAvatar({
  bot,
  size = "md",
  status,
}: {
  bot: Bot;
  size?: keyof typeof SIZES;
  status?: "online" | "idle";
}) {
  const sizes = SIZES[size];
  return (
    <Avatar
      aria-hidden
      className={cn(sizes.avatar, "after:hidden")}
    >
      <AvatarFallback
        className={cn(
          "font-semibold tracking-tight text-white",
          sizes.fallback,
        )}
        style={{ backgroundColor: bot.accent }}
      >
        {bot.initials}
      </AvatarFallback>
      {status && (
        <AvatarBadge
          className={cn(
            "border-2 border-background ring-0",
            status === "online" ? "bg-sage" : "bg-muted-foreground/50",
          )}
        />
      )}
    </Avatar>
  );
}
