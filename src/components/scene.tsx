"use client";

import {
  Cross1Icon,
  ValueNoneIcon,
  DividerVerticalIcon,
  ValueIcon,
} from "@radix-ui/react-icons";
import { useSpringValue } from "@react-spring/three";
import { animated, useSpring } from "@react-spring/web";
import {
  CameraControls as CameraControlsPrimitive,
  GizmoHelper,
  GizmoViewport,
  Line,
  PerspectiveCamera,
  Sphere,
  Stars,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import CameraControlsImpl from "camera-controls";
import { damp, exp } from "maath/easing";
import {
  PropsWithChildren,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import {
  EllipseCurve,
  Group,
  PerspectiveCamera as PerspectiveCameraImpl,
  Mesh,
  MeshBasicMaterial,
  DoubleSide,
} from "three";
import invariant from "tiny-invariant";
import { create } from "zustand";
import classNames from "classnames";
import { get } from "http";
import countries from "./geojson.json";
import { ConicPolygonGeometry } from "three-conic-polygon-geometry";

interface State {
  autoRotate: boolean;
  axialTilt: number;
  showInformationPanel: boolean;
  globeHovered: boolean;
  orientation: "landscape" | "portrait";
}

interface Action {
  setAutoRotate: (autoRotate: boolean) => void;
  setAxialTilt: (axialTilt: number) => void;
  setShowInformationPanel: (showInformationPanel: boolean) => void;
  setGlobeHovered: (globeHovered: boolean) => void;
  setOrientation: (orientation: "landscape" | "portrait") => void;
}

const initialState: State = {
  autoRotate: false, // start with rotation on
  axialTilt: 23.5 * (Math.PI / 180), // earth's axial tilt in radians
  showInformationPanel: false,
  globeHovered: false,
  orientation: "landscape",
};

const useStore = create<State & Action>((set, get) => ({
  ...initialState,
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setAxialTilt: (axialTilt) => set({ axialTilt }),
  setShowInformationPanel: (showInformationPanel) =>
    set({ showInformationPanel: showInformationPanel }),
  setGlobeHovered: (globeHovered) => set({ globeHovered }),
  setOrientation: (orientation) => set({ orientation }),
}));

export function SceneWrapper() {
  return (
    <>
      <CameraControlsProvider>
        <GlobeProvider>
          <Scene />
          <InformationPanel />
          <Menu />
        </GlobeProvider>
      </CameraControlsProvider>
    </>
  );
}

function Scene() {
  const setAutoRotate = useStore((state) => state.setAutoRotate);

  const onPointerDown = () => {
    setAutoRotate(false);
  };

  return (
    <Canvas className="z-0 grow" onPointerDown={onPointerDown}>
      <color attach="background" args={["black"]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Camera />
      <CameraControls />
      <Globe />
      <GizmoHelper>
        <GizmoViewport />
      </GizmoHelper>
    </Canvas>
  );
}

function Menu() {
  const autoRotate = useStore((state) => state.autoRotate);
  const setAutoRotate = useStore((state) => state.setAutoRotate);

  const axialTilt = useStore((state) => state.axialTilt);
  const setAxialTilt = useStore((state) => state.setAxialTilt);

  const offsetGlobe = useStore((state) => state.showInformationPanel);
  const setOffsetGlobe = useStore((state) => state.setShowInformationPanel);

  const { ref: cameraControlsRef } = useCameraControlsContext();

  const onToggleRotationClick = () => {
    // if going from autoRotate false -> true, reset camera polar angle
    if (!autoRotate) {
      cameraControlsRef.current?.rotatePolarTo(Math.PI / 2, true);
    }

    setAutoRotate(!autoRotate);
  };

  const onToggleAxialTiltClick = () => {
    setAxialTilt(axialTilt === 0 ? initialState.axialTilt : 0);
  };

  const onToggleOffsetGlobeClick = () => {
    setOffsetGlobe(!offsetGlobe);
  };

  const rotate = useSpringValue(0, {
    config: {
      clamp: true,
      easing: exp,
    },
  });

  useEffect(() => {
    if (axialTilt) rotate.start(-23.5);
    else rotate.start(0);
  }, [axialTilt]);

  return (
    <div className="z-10 fixed bottom-4 left-4 text-white space-x-4 flex flex-row items-center">
      <button
        className="px-4 py-2 bg-black/75 backdrop-blur rounded-full"
        onClick={onToggleRotationClick}
      >
        {autoRotate ? "Stop" : "Start"} Rotation
      </button>
      <button
        className="bg-black/75 backdrop-blur rounded-full flex items-center justify-center h-8 w-8"
        onClick={onToggleAxialTiltClick}
      >
        <animated.div
          style={{ rotate }}
          className={classNames("relative h-8 w-8 duration-200 transform")}
        >
          <DividerVerticalIcon className="h-8 w-8 absolute inset-0 text-white" />
          <ValueIcon className="h-8 w-8 text-white absolute inset-0 scale-50" />
        </animated.div>
      </button>
      <button
        className="px-4 py-2 bg-blue-500 rounded"
        onClick={onToggleOffsetGlobeClick}
      >
        Show Information Panel
      </button>
    </div>
  );
}

function InformationPanel() {
  const showInformationPanel = useStore((state) => state.showInformationPanel);
  const setShowInformationPanel = useStore(
    (state) => state.setShowInformationPanel
  );

  const orientation = useStore((state) => state.orientation);

  const { opacity, x, y } = useSpring({
    opacity: showInformationPanel ? 1 : 0,
    x:
      orientation === "landscape"
        ? showInformationPanel
          ? "0%"
          : "75%"
        : "0%",
    y:
      orientation === "portrait" ? (showInformationPanel ? "0%" : "75%") : "0%",
    config: {
      clamp: true,
      easing: exp,
    },
  });

  const handleClose = () => {
    setShowInformationPanel(false);
  };

  return (
    <animated.div
      style={{ x, y }}
      className="fixed z-10 landscape:w-1/2 landscape:inset-y-8 landscape:right-8 portrait:inset-x-4 portrait:bottom-4 portrait:h-1/2"
    >
      <animated.div
        style={{ opacity }}
        className="absolute inset-0 blur-[2px] bg-gray-950/90 saturate-0 backdrop-blur-lg rounded-lg"
      />
      <animated.div
        style={{ opacity }}
        className="absolute inset-0 flex flex-col"
      >
        <div className="flex justify-end p-4">
          <button onClick={handleClose}>
            <Cross1Icon className="text-white h-8 w-8" />
          </button>
        </div>
        <div className="flex items-center justify-center grow">
          <h1 className="text-white text-5xl">Information Panel</h1>
        </div>
      </animated.div>
    </animated.div>
  );
}

function Camera() {
  const { viewport } = useThree();
  const showInformationPanel = useStore((state) => state.showInformationPanel);
  const orientation = useStore((state) => state.orientation);
  const setOrientation = useStore((state) => state.setOrientation);

  const ref = useRef<PerspectiveCameraImpl>(null);

  const offset = useSpringValue(0, {
    config: {
      clamp: true,
      easing: exp,
    },
  });

  // update state orientation. this will allow us to read orientation outside of three.js context
  useEffect(() => {
    setOrientation(
      viewport.width >= viewport.height ? "landscape" : "portrait"
    );
  }, [viewport.width, viewport.height]);

  // trigger animation when showInformationPanel changes
  // there are still some artifacts when opening devtools and such, this can probably be cleaned up
  useEffect(() => {
    offset.start(
      showInformationPanel
        ? orientation === "landscape"
          ? viewport.width / 4
          : viewport.height / 4
        : 0
    );
  }, [showInformationPanel, viewport.width, viewport.height, orientation]);

  // update view offset based on animation
  useFrame(() => {
    ref.current?.setViewOffset(
      viewport.width,
      viewport.height,
      orientation === "landscape" ? offset.get() : 0,
      orientation === "portrait" ? offset.get() : 0,
      viewport.width,
      viewport.height
    );
  });

  return <PerspectiveCamera ref={ref} makeDefault position={[5, 0, 0]} />;
}

interface CameraControlsContext {
  ref: RefObject<CameraControlsImpl>;
}

const CameraControlsContext = createContext<CameraControlsContext | null>(null);

function CameraControlsProvider({ children }: PropsWithChildren) {
  const ref = useRef<CameraControlsImpl>(null);

  return (
    <CameraControlsContext.Provider value={{ ref }}>
      {children}
    </CameraControlsContext.Provider>
  );
}

function useCameraControlsContext() {
  const context = useContext(CameraControlsContext);
  invariant(
    context,
    `${useCameraControlsContext.name} must be called within a ${CameraControlsProvider.name} component.`
  );
  return context;
}

function CameraControls() {
  const { ref } = useCameraControlsContext();

  return (
    <>
      <CameraControlsPrimitive
        ref={ref}
        truckSpeed={0}
        maxDistance={5}
        minDistance={1.25}
      />
    </>
  );
}

interface GlobeContext {
  ref: RefObject<Group>;
}

const GlobeContext = createContext<GlobeContext | null>(null);

function GlobeProvider({ children }: PropsWithChildren) {
  const ref = useRef<Group>(null);

  return (
    <GlobeContext.Provider value={{ ref }}>{children}</GlobeContext.Provider>
  );
}

function useGlobeContext() {
  const context = useContext(GlobeContext);
  invariant(
    context,
    `${useCameraControlsContext.name} must be called within a ${CameraControlsProvider.name} component.`
  );
  return context;
}

// 1 rotation every 30 seconds
const rotationSpeed = (2 * Math.PI) / 30;
const sphereSegments = 256;
const points = new EllipseCurve(0, 0, 1.001, 1.001).getPoints(sphereSegments);

function Globe() {
  const autoRotate = useStore((state) => state.autoRotate);
  const axialTilt = useStore((state) => state.axialTilt);

  const { ref } = useGlobeContext();

  const texture = useTexture("/2_no_clouds_16k.jpg");

  // rotation
  useFrame((_, delta) => {
    if (!autoRotate) return;
    if (!ref.current) return;

    ref.current.rotation.y += rotationSpeed * delta;
  });

  // axial tilt
  useFrame((_, delta) => {
    if (!ref.current) return;
    if (ref.current.rotation.x === axialTilt) return;

    damp(ref.current.rotation, "x", axialTilt, 0.25, delta);
  });

  const polygonMeshes = useMemo(() => {
    const materials = [
      new MeshBasicMaterial({
        side: DoubleSide,
        color: "green",
        opacity: 0.1,
        transparent: true,
      }), // side material
      new MeshBasicMaterial({
        side: DoubleSide,
        color: "red",
        opacity: 0.7,
        transparent: true,
      }), // bottom cap material
      new MeshBasicMaterial({
        color: "red",
        opacity: 0.7,
        transparent: true,
        wireframe: true,
      }), // top cap material
    ];

    const polygonMeshes: Mesh[] = [];
    countries.features.forEach(({ properties, geometry }) => {
      const polygons =
        geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.coordinates;
      const alt = 1.001;

      polygons.forEach((coords) => {
        polygonMeshes.push(
          new Mesh(
            new ConicPolygonGeometry(
              coords,
              alt / 10,
              alt,
              true,
              true,
              true,
              1
            ),
            materials
          )
        );
      });
    });

    return polygonMeshes;
  }, []);

  return (
    <group ref={ref}>
      {polygonMeshes.map((x) => (
        <primitive object={x} />
      ))}
      {/* equator */}
      <Line
        points={points}
        color="white"
        linewidth={1}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* prime meridian */}
      <Line
        points={points}
        color="white"
        linewidth={1}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <Sphere
        args={[1, sphereSegments, sphereSegments]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <meshStandardMaterial map={texture} />
      </Sphere>
    </group>
  );
}
