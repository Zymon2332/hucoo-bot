import { createFileRoute } from "@tanstack/react-router";
import { StatesPage } from "@/features/settings/states-page";

export const Route = createFileRoute("/dev/states")({
  component: StatesPage,
});
