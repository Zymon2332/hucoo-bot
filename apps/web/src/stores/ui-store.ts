import { create } from "zustand";

interface UiState {
  railCollapsed: boolean;
  bellOpen: boolean;
  commandOpen: boolean;
  mobileRailOpen: boolean;
  setRailCollapsed: (value: boolean) => void;
  toggleRail: () => void;
  setBellOpen: (value: boolean) => void;
  setCommandOpen: (value: boolean) => void;
  setMobileRailOpen: (value: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  railCollapsed: false,
  bellOpen: false,
  commandOpen: false,
  mobileRailOpen: false,
  setRailCollapsed: (railCollapsed) => set({ railCollapsed }),
  toggleRail: () => set((state) => ({ railCollapsed: !state.railCollapsed })),
  setBellOpen: (bellOpen) => set({ bellOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setMobileRailOpen: (mobileRailOpen) => set({ mobileRailOpen }),
}));
