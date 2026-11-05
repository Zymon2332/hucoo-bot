import { useRef, useState } from "react";
import { ArrowUp, At, Paperclip } from "@phosphor-icons/react";
import { toast } from "sonner";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { Textarea } from "@hucoo/ui/components/textarea";

export function Composer({
  placeholder = "说点什么，或者交给我一件事…",
  onSend,
  large = false,
}: {
  placeholder?: string;
  onSend?: (text: string) => void;
  large?: boolean;
}) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit() {
    const value = text.trim();
    if (!value) return;
    onSend?.(value);
    setText("");
    toast("原型演示：消息已记录（未连接后端）");
  }

  return (
    <div
      className={cn(
        "rounded-[20px] border border-border bg-card p-3 shadow-[var(--shadow-float)] transition-colors focus-within:border-clay/35",
        large && "p-4",
      )}
    >
      <Textarea
        ref={ref}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        rows={1}
        placeholder={placeholder}
        className={cn(
          "field-sizing-content max-h-[160px] min-h-0 resize-none border-0 bg-transparent px-1 py-0 text-[14px] leading-relaxed shadow-none outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 dark:bg-transparent",
          large && "max-h-[220px] min-h-[52px] text-[15px]",
        )}
      />
      <div className="mt-2 flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => toast("原型演示：附件入口")}
          aria-label="添加附件"
          className="text-muted-foreground"
        >
          <Paperclip size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => toast("原型演示：引用记忆")}
          aria-label="引用记忆"
          className="text-muted-foreground"
        >
          <At size={16} />
        </Button>
        <span className="ml-1 hidden text-[10px] text-muted-foreground/60 sm:inline">
          Enter 发送 · Shift + Enter 换行
        </span>
        <Button
          type="button"
          size="icon-sm"
          onClick={submit}
          disabled={!text.trim()}
          aria-label="发送"
          className="ml-auto rounded-[10px]"
        >
          <ArrowUp size={16} weight="bold" />
        </Button>
      </div>
    </div>
  );
}
