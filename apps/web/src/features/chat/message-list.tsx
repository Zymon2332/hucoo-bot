import { useEffect, useRef } from "react";
import type { Conversation, Profile } from "@/fixtures/types";
import { MessageItem } from "./message-item";

export function MessageList({
  conversation,
  profile,
}: {
  conversation: Conversation;
  profile: Profile;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [conversation.id, conversation.messages.length]);

  return (
    <div className="mx-auto w-full max-w-[760px] space-y-8 px-1 pb-10 pt-6 sm:px-2">
      {conversation.messages.map((message) => (
        <MessageItem key={message.id} message={message} profile={profile} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
