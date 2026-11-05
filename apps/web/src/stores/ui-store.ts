import { create } from "zustand";
import type { InspectorTab } from "@/fixtures/types";

interface UiState {
  railCollapsed: boolean;
  inspectorOpen: boolean;
  inspectorTab: InspectorTab;
  bellOpen: boolean;
  commandOpen: boolean;
  mobileRailOpen: boolean;
  setRailCollapsed: (value: boolean) => void;
  toggleRail: () => void;
  setInspectorOpen: (value: boolean) => void;
  toggleInspector: () => void;
  setInspectorTab: (tab: InspectorTab) => void;
  setBellOpen: (value: boolean) => void;
  setCommandOpen: (value: boolean) => void;
  setMobileRailOpen: (value: boolean) => void;
}

const wideViewport =
  typeof window !== "undefined" && window.innerWidth >= 1280;

export const useUiStore = create<UiState>((set) => ({
  railCollapsed: false,
  inspectorOpen: wideViewport,
  inspectorTab: "execution",
  bellOpen: false,
  commandOpen: false,
  mobileRailOpen: false,
  setRailCollapsed: (railCollapsed) => set({ railCollapsed }),
  toggleRail: () => set((state) => ({ railCollapsed: !state.railCollapsed })),
  setInspectorOpen: (inspectorOpen) => set({ inspectorOpen }),
  toggleInspector: () =>
    set((state) => ({ inspectorOpen: !state.inspectorOpen })),
  setInspectorTab: (inspectorTab) => set({ inspectorTab }),
  setBellOpen: (bellOpen) => set({ bellOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setMobileRailOpen: (mobileRailOpen) => set({ mobileRailOpen }),
}));
