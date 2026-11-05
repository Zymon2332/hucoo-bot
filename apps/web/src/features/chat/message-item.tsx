import { useState } from "react";
import { Check, Copy, Robot } from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import type { Message, Profile } from "@/fixtures/types";
import { BlockRenderer } from "./blocks/block-renderer";

export function MessageItem({
  message,
  profile,
}: {
  message: Message;
  profile: Profile;
}) {
  const [copied, setCopied] = useState(false);

  if (message.role === "user") {
    return (
      <article className="flex flex-col items-end gap-1.5">
        <div className="max-w-[84%] whitespace-pre-wrap rounded-[16px] rounded-br-[6px] border border-border bg-secondary/80 px-4 py-2.5 text-[14px] leading-relaxed">
          {message.blocks.map((block, index) =>
            block.kind === "text" ? (
              <span key={index}>{block.text}</span>
            ) : null,
          )}
        </div>
        <span className="pr-1 text-[10px] text-muted-foreground/60">
          {message.at}
        </span>
      </article>
    );
  }

  const plain = message.blocks
    .filter((block) => block.kind === "text")
    .map((block) => (block.kind === "text" ? block.text : ""))
    .join("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <article className="group/message animate-rise">
      <header className="flex items-center gap-2">
        <span
          aria-hidden
          className="grid size-6 place-items-center rounded-[8px] text-[10px] font-semibold text-white"
          style={{ backgroundColor: profile.accent }}
        >
          {profile.initials}
        </span>
        <span className="text-[12px] font-medium">{profile.name}</span>
        <span className="text-[10px] text-muted-foreground/60">
          {message.at}
        </span>
        {plain && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => void copy()}
            aria-label="复制回复"
            className="ml-auto text-muted-foreground/0 transition-colors group-hover/message:text-muted-foreground/70 hover:!text-foreground"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </Button>
        )}
      </header>

      <div className="mt-2 space-y-3 pl-8">
        {message.blocks.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>
    </article>
  );
}

export function ChatPlaceholder({ profile }: { profile: Profile }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <span
        aria-hidden
        className="grid size-6 place-items-center rounded-[8px] text-[10px] font-semibold text-white"
        style={{ backgroundColor: profile.accent }}
      >
        {profile.initials}
      </span>
      <span className="inline-flex items-center gap-1.5 pt-1">
        <Robot size={13} />
        小满会在这里出现
      </span>
    </div>
  );
}
