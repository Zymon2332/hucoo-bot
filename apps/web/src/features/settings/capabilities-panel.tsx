import { useState } from "react";
import { PlugsConnected, Sparkle, Wrench } from "@phosphor-icons/react";
import { Switch } from "@hucoo/ui/components/switch";
import { toast } from "sonner";
import { CAPABILITIES } from "@/fixtures";
import { capabilityKindLabel } from "@/display/labels";

const GROUPS = [
  { kind: "connector", label: "连接器", icon: PlugsConnected },
  { kind: "skill", label: "技能", icon: Sparkle },
  { kind: "tool", label: "工具", icon: Wrench },
] as const;

export function CapabilitiesPanel() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(
      CAPABILITIES.map((capability) => [capability.id, capability.enabled]),
    ),
  );

  return (
    <div className="space-y-5 p-4">
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        这些是小满可以使用的连接与能力。关闭后，本会话不会再调用它。
      </p>
      {GROUPS.map((group) => {
        const items = CAPABILITIES.filter(
          (capability) => capability.kind === group.kind,
        );
        const Icon = group.icon;
        return (
          <section key={group.kind}>
            <h3 className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
              <Icon size={12} />
              {group.label}
            </h3>
            <div className="mt-2 space-y-1.5">
              {items.map((capability) => {
                const on = enabled[capability.id] ?? false;
                return (
                  <div
                    key={capability.id}
                    className="flex items-start gap-2 rounded-[12px] border border-border bg-card/60 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-medium">
                          {capability.name}
                        </span>
                        <span className="rounded bg-secondary px-1 py-0.5 text-[9px] text-muted-foreground">
                          {capabilityKindLabel(capability.kind)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground">
                        {capability.description}
                      </p>
                      {capability.lastUsed && (
                        <p className="mt-0.5 text-[9.5px] text-muted-foreground/60">
                          上次使用：{capability.lastUsed}
                        </p>
                      )}
                    </div>
                    <Switch
                      checked={on}
                      aria-label={`${capability.name}开关`}
                      onCheckedChange={(checked) => {
                        setEnabled((state) => ({
                          ...state,
                          [capability.id]: checked,
                        }));
                        toast(
                          checked
                            ? `已开启 ${capability.name}`
                            : `已关闭 ${capability.name}`,
                        );
                      }}
                      className="mt-0.5"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
