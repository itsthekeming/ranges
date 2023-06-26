"use client";

import {
  OrbitControls,
  Sphere,
  GizmoHelper,
  GizmoViewport,
  PerspectiveCamera,
  Line,
  CameraControls,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Ref, useEffect, useMemo, useRef } from "react";
import {
  BufferGeometry,
  CircleGeometry,
  Euler,
  Float32BufferAttribute,
  Group,
  Mesh,
  Vector3,
} from "three";
import create from "zustand";
import CameraControlsImpl from "camera-controls";

interface State {
  autoRotate: boolean;
  controlsRef: Ref<typeof OrbitControls>;
}

interface Action {
  setAutoRotate: (autoRotate: boolean) => void;
  setControlsRef: (controlsRef: Ref<typeof OrbitControls>) => void;
}

const initialState: State = {
  autoRotate: true,
  controlsRef: null,
};

const useStore = create<State & Action>((set) => ({
  ...initialState,
  setAutoRotate: (autoRotate: boolean) => set({ autoRotate }),
  setControlsRef: (controlsRef: Ref<typeof OrbitControls>) =>
    set({ controlsRef }),
}));

export function Scene() {
  const autoRotate = useStore((state) => state.autoRotate);
  const setAutoRotate = useStore((state) => state.setAutoRotate);

  return (
    <>
      <div className="z-10 fixed top-0 left-0 p-4 text-white">
        <button
          className="px-4 py-2 bg-blue-500 rounded"
          onClick={() => setAutoRotate(!autoRotate)}
        >
          {autoRotate ? "Stop" : "Start"} Rotation
        </button>
      </div>
      <Canvas className="z-0 grow" onPointerDown={() => setAutoRotate(false)}>
        <color attach="background" args={["black"]} />
        {/* <ambientLight /> */}
        <pointLight position={[10, 10, 10]} />
        <Camera />
        <Controls />
        <Globe />
        <GizmoHelper>
          <GizmoViewport />
        </GizmoHelper>
      </Canvas>
    </>
  );
}

function Camera() {
  const { viewport } = useThree();

  return (
    <PerspectiveCamera
      makeDefault
      position={[5, 0, 0]}
      view={{
        enabled: true,
        fullWidth: viewport.width,
        fullHeight: viewport.height,
        offsetX: viewport.width / 4,
        offsetY: 0,
        width: viewport.width,
        height: viewport.height,
      }}
    />
  );
}

function Controls() {
  const autoRotate = useStore((state) => state.autoRotate);

  const ref = useRef<CameraControlsImpl>(null);

  useEffect(() => {
    if (!autoRotate) return;
    if (!ref.current) return;

    ref.current.reset(true);
  }, [autoRotate]);

  return (
    <CameraControls ref={ref} truckSpeed={0} maxDistance={5} minDistance={3} />
  );
}

function Globe() {
  const autoRotate = useStore((state) => state.autoRotate);

  const mesh = useRef<Group>(null);

  // Earth's axial tilt in radians
  const axialTilt = 23.5 * (Math.PI / 180);

  const rotationSpeed = (2 * Math.PI) / 30;

  useFrame((_, delta) => {
    if (!autoRotate) return;
    if (!mesh.current) return;

    // Increment the y-rotation
    mesh.current.rotation.y += rotationSpeed * delta;

    // Set the x-rotation to represent the axial tilt
    mesh.current.rotation.x = axialTilt;
  });

  // Create a circle geometry that represents the equator
  const equatorGeometry = useMemo(() => {
    const geometry = new CircleGeometry(1, 128);
    geometry.rotateX(Math.PI / 2);
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(geometry.attributes.position.array, 3)
    );
    return geometry;
  }, []);

  // Create a circle geometry that represents the prime meridian
  const meridianGeometry = useMemo(() => {
    const geometry = new CircleGeometry(1, 128);
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(geometry.attributes.position.array, 3)
    );
    return geometry;
  }, []);

  return (
    <group ref={mesh}>
      <Sphere args={[1, 128, 128]}>
        <meshStandardMaterial color="blue" />
      </Sphere>
      <line>
        <bufferGeometry attach="geometry" {...equatorGeometry} />
        <lineBasicMaterial attach="material" color="white" />
      </line>
      <line>
        <bufferGeometry attach="geometry" {...meridianGeometry} />
        <lineBasicMaterial attach="material" color="white" />
      </line>
    </group>
  );
}
