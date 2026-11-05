import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  {
    title: string;
    description: string;
    size: string;
    content: React.ReactNode;
  }
> = {
  settings: {
    title: "设置",
    description: "模型、记忆、用量与通用配置。",
    size: "h-[min(640px,calc(100vh-2rem))] w-[min(920px,calc(100vw-2rem))]",
    content: <SettingsPage embedded />,
  },
  apps: {
    title: "应用",
    description: "连接外部应用与 Agent。",
    size: "h-[min(640px,calc(100vh-2rem))] w-[min(920px,calc(100vw-2rem))]",
    content: <AppsPage embedded />,
  },
  skills: {
    title: "技能",
    description: "bot 可以按需加载的技能。",
    size: "h-[min(560px,calc(100vh-2rem))] w-[min(760px,calc(100vw-2rem))]",
    content: <SkillsPage embedded />,
  },
  assets: {
    title: "产物",
    description: "所有 bot 产出的资产。",
    size: "h-[min(560px,calc(100vh-2rem))] w-[min(760px,calc(100vw-2rem))]",
    content: <AssetsPage embedded />,
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
            "flex max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none",
            config.size,
          )}
        >
          <DialogTitle className="sr-only">{config.title}</DialogTitle>
          <DialogDescription className="sr-only">
            {config.description}
          </DialogDescription>
          <div className="min-h-0 flex-1 overflow-hidden pt-9">
            {config.content}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
