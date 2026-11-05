import { createFileRoute } from "@tanstack/react-router";
import { MemoryPage } from "@/features/memory/memory-page";

type MemorySearch = { focus?: string };

export const Route = createFileRoute("/memory")({
  validateSearch: (search: Record<string, unknown>): MemorySearch => ({
    focus: typeof search.focus === "string" ? search.focus : undefined,
  }),
  component: MemoryRoute,
});

function MemoryRoute() {
  const { focus } = Route.useSearch();
  return <MemoryPage focusId={focus} />;
}
