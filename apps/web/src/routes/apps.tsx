import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_BOT_ID } from "@/fixtures";

export const Route = createFileRoute("/apps")({
  beforeLoad: () => {
    throw redirect({ to: "/b/$botId", params: { botId: DEFAULT_BOT_ID } });
  },
});
