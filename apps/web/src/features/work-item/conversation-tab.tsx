import { useState } from "react";
import { ChatCircle } from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { conversationsForWorkItem } from "@/fixtures";
import type { WorkItem } from "@/fixtures/types";
import { channelLabel } from "@/display/labels";
import { useDemoStore } from "@/stores/demo-store";
import { MessageList } from "@/features/chat/message-list";
import { Composer } from "@/features/chat/composer";
import { EmptyState } from "@/components/primitives";

export function ConversationTab({ item }: { item: WorkItem }) {
  const profile = useDemoStore((state) => state.profile);
  const conversations = conversationsForWorkItem(item.id);
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const active =
    conversations.find((conversation) => conversation.id === activeId) ??
    conversations[0];

  if (!active) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<ChatCircle size={22} />}
          title="这个工作项还没有对话"
          description="当它需要你补充信息或确认结果时，会在这里出现。"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {conversations.length > 1 && (
        <div className="flex shrink-0 items-center gap-1 border-b border-border/70 px-3 py-2">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              type="button"
              size="sm"
              variant={conversation.id === active.id ? "secondary" : "ghost"}
              onClick={() => setActiveId(conversation.id)}
              className={cn(
                "h-7 rounded-full px-2.5 text-[11px]",
                conversation.id !== active.id && "text-muted-foreground",
              )}
            >
              {channelLabel(conversation.channel)}
              <span className="text-[10px] text-muted-foreground/60">
                {conversation.messages.length}
              </span>
            </Button>
          ))}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <MessageList conversation={active} profile={profile} />
      </div>
      <div className="shrink-0 px-3 pb-3 sm:px-5 sm:pb-4">
        <div className="mx-auto w-full max-w-[760px]">
          <Composer placeholder="回复，或者补充一件事…" />
        </div>
      </div>
    </div>
  );
}
