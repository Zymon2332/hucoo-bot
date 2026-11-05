import { createFileRoute } from "@tanstack/react-router";
import { WorkItemPage } from "@/features/work-item/work-item-page";
import type { WorkTab } from "@/fixtures/types";

const TABS: WorkTab[] = [
  "overview",
  "conversation",
  "evidence",
  "execution",
  "authority",
];

type WorkSearch = { tab: WorkTab };

export const Route = createFileRoute("/w/$workItemId")({
  validateSearch: (search: Record<string, unknown>): WorkSearch => ({
    tab: TABS.includes(search.tab as WorkTab)
      ? (search.tab as WorkTab)
      : "overview",
  }),
  component: WorkItemRoute,
});

function WorkItemRoute() {
  const { workItemId } = Route.useParams();
  const { tab } = Route.useSearch();
  return <WorkItemPage workItemId={workItemId} tab={tab} />;
}
