import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "@phosphor-icons/react";
import { ARTIFACTS, BOTS, getBot } from "@/fixtures";
import { ArtifactKindBadge } from "@/components/primitives";

export function AssetsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[980px] px-4 pb-16 pt-6 sm:px-6">
        <header>
          <h1 className="text-[22px] font-semibold tracking-tight">产物</h1>
          <p className="mt-1 text-[12px] text-muted-foreground">
            所有 bot 产出的文档、表格、网页与代码。
          </p>
        </header>

        <div className="mt-6 space-y-5">
          {BOTS.map((bot) => {
            const assets = ARTIFACTS.filter((artifact) => artifact.botId === bot.id);
            if (assets.length === 0) return null;
            return (
              <section key={bot.id}>
                <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
                  {bot.name}
                </h2>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {assets.map((artifact) => (
                    <Link
                      key={artifact.id}
                      to="/artifact/$artifactId"
                      params={{ artifactId: artifact.id }}
                      className="group rounded-[12px] border border-border bg-card/70 px-3.5 py-3 transition-colors hover:border-clay/25 hover:bg-card"
                    >
                      <div className="flex items-center gap-2">
                        <ArtifactKindBadge kind={artifact.kind} />
                        <span className="text-[9.5px] text-muted-foreground">
                          {artifact.updatedAt}
                        </span>
                        <ArrowUpRight
                          size={12}
                          className="ml-auto text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </div>
                      <p className="mt-1.5 text-[12.5px] font-medium">
                        {artifact.title}
                      </p>
                      <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                        {artifact.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
