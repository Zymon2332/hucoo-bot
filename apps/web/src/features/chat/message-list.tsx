import { useEffect, useRef } from "react";
import type { Conversation } from "@/fixtures/types";
import { MessageItem, type ChatIdentity } from "./message-item";

export function MessageList({
  conversation,
  identity,
}: {
  conversation: Conversation;
  identity: ChatIdentity;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [conversation.id, conversation.messages.length]);

  return (
    <div className="mx-auto w-full max-w-[760px] space-y-6 px-3 pb-8 pt-5 sm:px-4">
      {conversation.messages.map((message) => (
        <MessageItem key={message.id} message={message} identity={identity} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
