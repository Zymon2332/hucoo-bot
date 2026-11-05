import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@hucoo/ui/components/dialog";
import { cn } from "@hucoo/ui";
import { useUiStore, type AppModal } from "@/stores/ui-store";
import { SettingsPage } from "@/features/settings/settings-page";
import { SkillsPage } from "@/features/skills/skills-page";
import { AssetsPage } from "@/features/assets/assets-page";
import { AppsPage } from "@/features/apps/apps-page";

const CONFIG: Record<
  AppModal,
  { title: string; description: string; width: string; content: React.ReactNode }
> = {
  settings: {
    title: "设置",
    description: "模型、记忆、用量与通用配置。bot 级设置在右侧面板。",
    width: "sm:max-w-3xl",
    content: <SettingsPage embedded />,
  },
  skills: {
    title: "技能",
    description: "bot 可以按需加载的技能。技能只影响能力，不改变授权。",
    width: "sm:max-w-2xl",
    content: <SkillsPage embedded />,
  },
  assets: {
    title: "产物",
    description: "所有 bot 产出的文档、表格、网页与代码。",
    width: "sm:max-w-2xl",
    content: <AssetsPage embedded />,
  },
  apps: {
    title: "应用",
    description: "连接外部应用（MCP）与 Agent（opencode / Claude Code / Codex）。",
    width: "sm:max-w-3xl",
    content: <AppsPage embedded />,
  },
};

export function AppModals() {
  const activeModal = useUiStore((state) => state.activeModal);
  const closeModal = useUiStore((state) => state.closeModal);
  const config = activeModal ? CONFIG[activeModal] : null;

  return (
    <Dialog
      open={Boolean(activeModal)}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      {config && (
        <DialogContent
          className={cn(
            "max-h-[86vh] gap-0 overflow-hidden p-0",
            config.width,
          )}
        >
          <DialogHeader className="border-b border-border/70 px-4 py-3">
            <DialogTitle className="text-[14px]">{config.title}</DialogTitle>
            <DialogDescription className="text-[11px]">
              {config.description}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(86vh-5rem)] overflow-y-auto p-4">
            {config.content}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
