import { createFileRoute } from "@tanstack/react-router";
import { ConversationPage } from "@/features/chat/conversation-page";

export const Route = createFileRoute("/c/$conversationId")({
  component: ConversationRoute,
});

function ConversationRoute() {
  const { conversationId } = Route.useParams();
  return <ConversationPage conversationId={conversationId} />;
}
