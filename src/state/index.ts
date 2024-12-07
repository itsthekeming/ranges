import { create } from "zustand";

interface State {
  rotate: boolean;
  tilt: boolean;
  showInformationPanel: boolean;
  globeHovered: boolean;
  orientation: "landscape" | "portrait";
  levelOfDetail: number;
}

interface Action {
  setRotate: (rotate: boolean) => void;
  setTilt: (tilt: boolean) => void;
  setShowInformationPanel: (showInformationPanel: boolean) => void;
  setGlobeHovered: (globeHovered: boolean) => void;
  setOrientation: (orientation: "landscape" | "portrait") => void;
  setLevelOfDetail: (levelOfDetail: number) => void;
}

const initialState: State = {
  rotate: true,
  tilt: false,
  showInformationPanel: false,
  globeHovered: false,
  orientation: "landscape",
  levelOfDetail: 0.01,
};

export const useStore = create<State & Action>((set) => ({
  ...initialState,
  setRotate: (rotate) => set({ rotate }),
  setTilt: (tilt) => set({ tilt }),
  setShowInformationPanel: (showInformationPanel) =>
    set({ showInformationPanel }),
  setGlobeHovered: (globeHovered) => set({ globeHovered }),
  setOrientation: (orientation) => set({ orientation }),
  setLevelOfDetail: (levelOfDetail) => set({ levelOfDetail }),
}));
