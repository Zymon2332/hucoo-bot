import { createFileRoute } from "@tanstack/react-router";
import { DecisionDesk } from "@/features/work-desk/decision-desk";

export const Route = createFileRoute("/")({
  component: DecisionDesk,
});
