import { createFileRoute } from "@tanstack/react-router";
import { ArtifactPage } from "@/features/artifacts/artifact-page";

export const Route = createFileRoute("/artifact/$artifactId")({
  component: ArtifactRoute,
});

function ArtifactRoute() {
  const { artifactId } = Route.useParams();
  return <ArtifactPage artifactId={artifactId} />;
}
