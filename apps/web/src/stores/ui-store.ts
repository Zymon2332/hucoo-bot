import { create } from "zustand";
import type { PanelTab } from "@/fixtures/types";

interface UiState {
  railCollapsed: boolean;
  panelOpen: boolean;
  panelTab: PanelTab;
  selectedTaskId: string | null;
  bellOpen: boolean;
  commandOpen: boolean;
  avatarMenuOpen: boolean;
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
  setMobileRailOpen: (mobileRailOpen) => set({ mobileRailOpen }),
}));
