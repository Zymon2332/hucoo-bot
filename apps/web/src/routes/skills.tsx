import { createFileRoute } from "@tanstack/react-router";
import { SkillsPage } from "@/features/skills/skills-page";

export const Route = createFileRoute("/skills")({
  component: SkillsPage,
});
