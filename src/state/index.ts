import { create } from "zustand";

interface State {
  scienceMode: boolean;
  rotate: boolean;
  tilt: boolean;
  showInformationPanel: boolean;
  globeHovered: boolean;
  orientation: "landscape" | "portrait";
  levelOfDetail: number;
}

interface Action {
  setScienceMode: (scienceMode: boolean) => void;
  setRotate: (rotate: boolean) => void;
  setTilt: (tilt: boolean) => void;
  setShowInformationPanel: (showInformationPanel: boolean) => void;
  setGlobeHovered: (globeHovered: boolean) => void;
  setOrientation: (orientation: "landscape" | "portrait") => void;
  setLevelOfDetail: (levelOfDetail: number) => void;
}

const initialState: State = {
  scienceMode: false,
  rotate: true,
  tilt: false,
  showInformationPanel: false,
  globeHovered: false,
  orientation: "landscape",
  levelOfDetail: 0.01,
};

export const useStore = create<State & Action>((set) => ({
  ...initialState,
  setScienceMode: (scienceMode) => set({ scienceMode }),
  setRotate: (rotate) => set({ rotate }),
  setTilt: (tilt) => set({ tilt }),
  setShowInformationPanel: (showInformationPanel) =>
    set({ showInformationPanel }),
  setGlobeHovered: (globeHovered) => set({ globeHovered }),
  setOrientation: (orientation) => set({ orientation }),
  setLevelOfDetail: (levelOfDetail) => set({ levelOfDetail }),
}));
