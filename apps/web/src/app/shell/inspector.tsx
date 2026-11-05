import { useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { Button } from "@hucoo/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@hucoo/ui/components/tabs";
import type { Conversation, InspectorTab } from "@/fixtures/types";
import { useUiStore } from "@/stores/ui-store";
import { ExecutionPanel } from "@/features/tasks/execution-panel";
import { InspectorMemory } from "@/features/memory/inspector-memory";
import { InspectorArtifacts } from "@/features/artifacts/inspector-artifacts";
import { CapabilitiesPanel } from "@/features/settings/capabilities-panel";
import { InspectorToday, INSPECTOR_TABS } from "./inspector-today";

export function Inspector({ conversation }: { conversation?: Conversation }) {
  const tab = useUiStore((state) => state.inspectorTab);
  const setTab = useUiStore((state) => state.setInspectorTab);
  const toggleInspector = useUiStore((state) => state.toggleInspector);

  useEffect(() => {
    if (conversation?.focus) setTab(conversation.focus);
    else setTab("execution");
  }, [conversation?.id, conversation?.focus, setTab]);

  if (!conversation) {
    return (
      <aside className="flex h-full min-h-0 w-[min(340px,calc(100vw-1.5rem))] shrink-0 flex-col overflow-hidden rounded-[22px] border border-border bg-card/45 backdrop-blur-sm xl:w-[340px]">
        <header className="flex h-13 shrink-0 items-center gap-2 border-b border-border/70 px-4">
          <h2 className="text-[13px] font-medium">今天</h2>
          <span className="text-[10px] text-muted-foreground">
            安静地汇总，不打扰
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleInspector}
            aria-label="收起检查器"
            className="ml-auto text-muted-foreground"
          >
            <X size={14} />
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <InspectorToday />
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full min-h-0 w-[min(352px,calc(100vw-1.5rem))] shrink-0 flex-col overflow-hidden rounded-[22px] border border-border bg-card/45 backdrop-blur-sm xl:w-[352px]">
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as InspectorTab)}
        className="min-h-0 flex-1 gap-0"
      >
        <header className="flex shrink-0 items-center gap-1 border-b border-border/70 px-2 py-1.5">
          <TabsList variant="line" className="h-9">
            {INSPECTOR_TABS.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex-none px-2.5 text-[12px]"
                >
                  <Icon size={14} />
                  {item.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleInspector}
            aria-label="收起检查器"
            className="ml-auto text-muted-foreground"
          >
            <X size={14} />
          </Button>
        </header>

        <TabsContent
          value="execution"
          className="m-0 min-h-0 flex-1 overflow-y-auto"
        >
          <ExecutionPanel taskId={conversation.taskId} />
        </TabsContent>
        <TabsContent
          value="memory"
          className="m-0 min-h-0 flex-1 overflow-y-auto"
        >
          <InspectorMemory />
        </TabsContent>
        <TabsContent
          value="artifacts"
          className="m-0 min-h-0 flex-1 overflow-y-auto"
        >
          <InspectorArtifacts taskId={conversation.taskId} />
        </TabsContent>
        <TabsContent
          value="capabilities"
          className="m-0 min-h-0 flex-1 overflow-y-auto"
        >
          <CapabilitiesPanel />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
