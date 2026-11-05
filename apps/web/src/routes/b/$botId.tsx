import { createFileRoute } from "@tanstack/react-router";
import { BotChatPage } from "@/features/chat/bot-chat-page";

export const Route = createFileRoute("/b/$botId")({
  component: BotRoute,
});

function BotRoute() {
  const { botId } = Route.useParams();
  return <BotChatPage botId={botId} />;
}
