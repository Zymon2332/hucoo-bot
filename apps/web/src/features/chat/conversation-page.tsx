import { Link } from "@tanstack/react-router";
import { Button } from "@hucoo/ui/components/button";
import { getConversation } from "@/fixtures";
import { useDemoStore } from "@/stores/demo-store";
import { MessageList } from "@/features/chat/message-list";
import { Composer } from "@/features/chat/composer";
import { EmptyState } from "@/components/primitives";

export function ConversationPage({ conversationId }: { conversationId: string }) {
  const profile = useDemoStore((state) => state.profile);
  const conversation = getConversation(conversationId);

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          title="会话不存在或已删除"
          description="回到主页，或者从左侧选择另一个会话。"
          action={
            <Button asChild size="sm">
              <Link to="/">回到主页</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <MessageList conversation={conversation} profile={profile} />
      </div>
      <div className="shrink-0 px-3 pb-3 sm:px-5 sm:pb-4">
        <div className="mx-auto w-full max-w-[760px]">
          <Composer />
        </div>
      </div>
    </div>
  );
}
