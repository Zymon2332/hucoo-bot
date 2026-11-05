import type { Bot } from "@/fixtures/types";
import { cn } from "@hucoo/ui";

export function BotAvatar({
  bot,
  size = "md",
  status,
}: {
  bot: Bot;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "idle";
}) {
  const sizes = {
    sm: "size-7 text-[11px] rounded-[9px]",
    md: "size-8 text-xs rounded-[10px]",
    lg: "size-11 text-sm rounded-[14px]",
    xl: "size-14 text-lg rounded-[18px]",
  } as const;

  return (
    <span className="relative inline-flex shrink-0">
      <span
        aria-hidden
        className={cn(
          "grid place-items-center font-semibold tracking-tight text-white",
          sizes[size],
        )}
        style={{ backgroundColor: bot.accent }}
      >
        {bot.initials}
      </span>
      {status && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background",
            status === "online" ? "bg-sage" : "bg-muted-foreground/50",
          )}
        />
      )}
    </span>
  );
}
