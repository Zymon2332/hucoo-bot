import { create } from "zustand";
import type { PanelTab } from "@/fixtures/types";

export type AppModal = "settings" | "skills" | "assets" | "apps";

interface UiState {
  railCollapsed: boolean;
  panelOpen: boolean;
  panelTab: PanelTab;
  selectedTaskId: string | null;
  bellOpen: boolean;
  commandOpen: boolean;
  avatarMenuOpen: boolean;
  activeModal: AppModal | null;
  mobileRailOpen: boolean;
  setRailCollapsed: (value: boolean) => void;
  toggleRail: () => void;
  setPanelOpen: (value: boolean) => void;
  togglePanel: () => void;
  setPanelTab: (tab: PanelTab) => void;
  openTask: (taskId: string) => void;
  closeTask: () => void;
  setBellOpen: (value: boolean) => void;
  setCommandOpen: (value: boolean) => void;
  setAvatarMenuOpen: (value: boolean) => void;
  setActiveModal: (modal: AppModal | null) => void;
  closeModal: () => void;
  setMobileRailOpen: (value: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  railCollapsed: false,
  panelOpen: false,
  panelTab: "tasks",
  selectedTaskId: null,
  bellOpen: false,
  commandOpen: false,
  avatarMenuOpen: false,
  activeModal: null,
  mobileRailOpen: false,
  setRailCollapsed: (railCollapsed) => set({ railCollapsed }),
  toggleRail: () => set((state) => ({ railCollapsed: !state.railCollapsed })),
  setPanelOpen: (panelOpen) => set({ panelOpen }),
  togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),
  setPanelTab: (panelTab) =>
    set({ panelTab, panelOpen: true, selectedTaskId: null }),
  openTask: (selectedTaskId) =>
    set({ selectedTaskId, panelTab: "tasks", panelOpen: true }),
  closeTask: () => set({ selectedTaskId: null }),
  setBellOpen: (bellOpen) => set({ bellOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setAvatarMenuOpen: (avatarMenuOpen) => set({ avatarMenuOpen }),
  setActiveModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),
  setMobileRailOpen: (mobileRailOpen) => set({ mobileRailOpen }),
}));
