import { createFileRoute } from "@tanstack/react-router";
import { AgentsPage } from "@/features/agents/agents-page";

export const Route = createFileRoute("/agents")({
  component: AgentsPage,
});
