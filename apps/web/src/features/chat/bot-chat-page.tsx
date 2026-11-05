import { getBot, conversationForBot } from "@/fixtures";
import { Composer } from "@/features/chat/composer";
import { MessageList } from "@/features/chat/message-list";
import { BotAvatar } from "@/components/bot-avatar";
import { EmptyState } from "@/components/primitives";

export function BotChatPage({ botId }: { botId: string }) {
  const bot = getBot(botId);
  const conversation = conversationForBot(botId);

  if (!bot) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          title="Bot 不存在"
          description="它可能已被删除，或链接不正确。"
        />
      </div>
    );
  }

  const identity = {
    name: bot.name,
    initials: bot.initials,
    accent: bot.accent,
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {conversation && conversation.messages.length > 0 ? (
          <MessageList conversation={conversation} identity={identity} />
        ) : (
          <div className="mx-auto flex w-full max-w-[640px] flex-col items-center px-6 pt-20 text-center">
            <BotAvatar bot={bot} size="xl" status="online" />
            <h2 className="mt-4 text-[18px] font-semibold">{bot.name}</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              {bot.persona}
            </p>
            <p className="mt-4 text-[13px]">{bot.greeting}</p>
          </div>
        )}
      </div>
      <div className="shrink-0 px-3 pb-3 sm:px-5 sm:pb-4">
        <div className="mx-auto w-full max-w-[760px]">
          <Composer placeholder={`对 ${bot.name} 说点什么…`} />
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground/60">
            主 Agent 只负责路由与即时回复，执行细节在右侧面板
          </p>
        </div>
      </div>
    </div>
  );
}
