"use client";

import {
  GlobeAmericasIcon,
  MinusIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { XMarkIcon as XMarkIconSmall } from "@heroicons/react/20/solid";
import { useSpring, useSpringValue } from "@react-spring/three";
import { animated, config } from "@react-spring/web";
import {
  CameraControls as CameraControlsImpl,
  GizmoHelper,
  GizmoViewport,
  Line,
  PerspectiveCamera,
  Sphere,
  useTexture,
} from "@react-three/drei";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DoubleSide,
  EllipseCurve,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera as PerspectiveCameraImpl,
} from "three";
import { ConicPolygonGeometry } from "three-conic-polygon-geometry";
import { degToRad } from "three/src/math/MathUtils";
import { create } from "zustand";
import testData from "~/data/test.json";

interface State {
  rotate: boolean;
  tilt: boolean;
  showInformationPanel: boolean;
  globeHovered: boolean;
  orientation: "landscape" | "portrait";
}

interface Action {
  setRotate: (rotate: boolean) => void;
  setTilt: (tilt: boolean) => void;
  setShowInformationPanel: (showInformationPanel: boolean) => void;
  setGlobeHovered: (globeHovered: boolean) => void;
  setOrientation: (orientation: "landscape" | "portrait") => void;
}

const initialState: State = {
  rotate: true,
  tilt: true,
  showInformationPanel: false,
  globeHovered: false,
  orientation: "landscape",
};

extend({ ConicPolygonGeometry });

const useStore = create<State & Action>((set, get) => ({
  ...initialState,
  setRotate: (rotate) => set({ rotate }),
  setTilt: (tilt) => set({ tilt }),
  setShowInformationPanel: (showInformationPanel) =>
    set({ showInformationPanel: showInformationPanel }),
  setGlobeHovered: (globeHovered) => set({ globeHovered }),
  setOrientation: (orientation) => set({ orientation }),
}));

export function SceneWrapper() {
  return (
    <>
      <Scene />
      <InformationPanel />
      <Menu />
    </>
  );
}

function Scene() {
  return (
    <Canvas className="z-0 grow">
      <color attach="background" args={["black"]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Camera />
      <Controls />
      <Globe />
      <GizmoHelper>
        <GizmoViewport />
      </GizmoHelper>
    </Canvas>
  );
}

function Menu() {
  const showInformationPanel = useStore((state) => state.showInformationPanel);
  const setShowInformationPanel = useStore(
    (state) => state.setShowInformationPanel
  );

  const onToggleOffsetGlobeClick = () => {
    setShowInformationPanel(!showInformationPanel);
  };

  return (
    <div className="z-10 fixed bottom-4 left-4 text-white space-x-4 flex flex-row items-center">
      <RotationToggle />
      <AxialTiltToggle />
      <button
        className="px-4 py-2 bg-blue-500 rounded"
        onClick={onToggleOffsetGlobeClick}
      >
        Show Information Panel
      </button>
    </div>
  );
}

function RotationToggle() {
  const shouldRotate = useStore((state) => state.rotate);
  const setRotate = useStore((state) => state.setRotate);
  const firstRender = useRef(true);

  const [targetRotation, setTargetRotation] = useState(-90);
  const rotate = useSpringValue(targetRotation, { config: config.wobbly });

  const buttonStyle = useSpring({
    color: shouldRotate ? "#3b82f6" : "#ffffff",
    config: config.wobbly,
  });

  const xMarkStyle = useSpring({
    color: shouldRotate ? "#3b82f6" : "#ffffff",
    opacity: shouldRotate ? 0 : 1,
    config: config.wobbly,
  });

  const onClick = async () => {
    setRotate(!shouldRotate);
  };

  useEffect(() => {
    firstRender.current = false;
  }, []);

  useEffect(() => {
    if (firstRender.current) return;

    let newTargetRotation = targetRotation - 90;
    rotate.start(newTargetRotation);
    setTargetRotation(newTargetRotation);
  }, [shouldRotate]);

  return (
    <animated.button
      onClick={onClick}
      style={buttonStyle}
      className="rounded-full relative h-12 w-12 flex justify-center items-center"
    >
      <animated.div
        style={{ rotate }}
        className="absolute inset-0 flex justify-center items-center"
      >
        <ArrowPathIcon className="h-8 w-8 rounded-full scale-x-[-1]" />
      </animated.div>
      <animated.div
        style={xMarkStyle}
        className="absolute inset-0 flex justify-center items-center"
      >
        <XMarkIconSmall className="h-4 w-4" />
      </animated.div>
    </animated.button>
  );
}

function AxialTiltToggle() {
  const tilt = useStore((state) => state.tilt);
  const setTilt = useStore((state) => state.setTilt);

  const { rotate, color } = useSpring({
    rotate: tilt ? 23.5 : 0,
    color: tilt ? "#3b82f6" : "#ffffff",
    config: config.wobbly,
  });

  const onClick = () => {
    setTilt(!tilt);
  };

  return (
    <animated.button
      onClick={onClick}
      style={{ rotate, color }}
      className="relative rounded-full flex items-center justify-center h-12 w-12"
    >
      <div className="absolute inset-0 flex justify-center items-center">
        <GlobeAmericasIcon className="h-8 w-8 rounded-full" />
      </div>
      <div className="absolute inset-0 flex justify-center items-center">
        <MinusIcon className="h-12 w-12 rotate-90 rounded-full" />
      </div>
    </animated.button>
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
    config: config.wobbly,
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
            <XMarkIcon className="text-white h-8 w-8" />
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

  const { offset } = useSpring({
    offset: showInformationPanel
      ? orientation === "landscape"
        ? viewport.width / 4
        : viewport.height / 4
      : 0,
    config: config.wobbly,
  });

  // update state orientation. this will allow us to read orientation outside of three.js context
  useEffect(() => {
    setOrientation(
      viewport.width >= viewport.height ? "landscape" : "portrait"
    );
  }, [viewport.width, viewport.height]);

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

const actionsThatStopRotation: number[] = [
  CameraControls.ACTION.ROTATE,
  CameraControls.ACTION.TOUCH_ROTATE,
];

function Controls() {
  const rotate = useStore((state) => state.rotate);
  const setRotate = useStore((state) => state.setRotate);
  const ref = useRef<CameraControlsImpl>(null);

  const polarAngle = useSpringValue(degToRad(90), { config: config.wobbly });

  useFrame(() => {
    if (!ref.current) return;

    if (polarAngle.isAnimating) {
      ref.current.polarAngle = polarAngle.get();
    }
  });

  // reset camera polar angle when rotation starts
  useEffect(() => {
    if (!rotate) return;
    if (!ref.current) return;

    polarAngle.set(ref.current.polarAngle); // give the animation a starting point
    polarAngle.start(degToRad(90));
  }, [rotate]);

  // behavior is that if the user clicks but doesn't drag, rotation doesn't change
  // if user clicks and drags (therefore changing the camera), we disable rotation
  const onChange = () => {
    if (!ref.current) return;
    if (!polarAngle.idle) return;
    if (!actionsThatStopRotation.includes(ref.current.currentAction)) return;

    setRotate(false);
  };

  return (
    <>
      <CameraControlsImpl
        ref={ref}
        onChange={onChange}
        truckSpeed={0}
        maxDistance={5}
        minDistance={1.25}
      />
    </>
  );
}

// 1 rotation every 30 seconds
const rotationSpeed = (2 * Math.PI) / 30;
const sphereSegments = 256;
const points = new EllipseCurve(0, 0, 1.001, 1.001).getPoints(sphereSegments);

function Globe() {
  const rotate = useStore((state) => state.rotate);
  const tilt = useStore((state) => state.tilt);

  const ref = useRef<Group>(null);

  const texture = useTexture("/2_no_clouds_16k.jpg");

  // rotation
  useFrame((_, delta) => {
    if (!rotate) return;
    if (!ref.current) return;

    ref.current.rotation.y += rotationSpeed * delta;
  });

  const { axialTilt } = useSpring({
    axialTilt: tilt ? degToRad(-23.5) : 0,
    config: config.wobbly,
  });

  useFrame(() => {
    if (!ref.current) return;

    ref.current.rotation.x = axialTilt.get();
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
        // wireframe: true,
      }), // top cap material
    ];

    const polygonMeshes: Mesh[] = [];
    testData.features.forEach(({ properties, geometry }) => {
      const polygons =
        geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.coordinates;
      const alt = 1.001;

      polygons.forEach((coords) => {
        polygonMeshes.push(
          new Mesh(
            new ConicPolygonGeometry(
              // @ts-ignore
              coords,
              alt / 2,
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
        <primitive key={x.id} object={x} />
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
