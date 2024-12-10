import { useSpring, useSpringValue, config } from "@react-spring/three";
import {
  CameraControls as CameraControlsImpl,
  GizmoHelper,
  GizmoViewport,
  Line,
  PerspectiveCamera,
  Sphere,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import type { PropsWithChildren } from "react";
import { Suspense, useEffect, useRef } from "react";
import type { Group, PerspectiveCamera as PerspectiveCameraImpl } from "three";
import { EllipseCurve } from "three";
import { degToRad } from "maath/misc";
import { useStore } from "~/state";

export function Scene({ children }: PropsWithChildren) {
  return (
    <Canvas className="z-0 grow">
      <color attach="background" args={["black"]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Camera />
      <Controls />
      <Globe>{children}</Globe>
      <GizmoHelper>
        <GizmoViewport />
      </GizmoHelper>
    </Canvas>
  );
}

function Camera() {
  const { viewport } = useThree();
  const { showInformationPanel, orientation, setOrientation } = useStore(
    ({ showInformationPanel, orientation, setOrientation }) => ({
      showInformationPanel,
      orientation,
      setOrientation,
    }),
  );

  const ref = useRef<PerspectiveCameraImpl>(null);

  const { offset } = useSpring({
    offset: showInformationPanel
      ? orientation === "landscape"
        ? viewport.width / 4
        : viewport.height / 4
      : 0,
    config: config.gentle,
  });

  // update state orientation. this will allow us to read orientation outside of three.js context
  useEffect(() => {
    setOrientation(
      viewport.width >= viewport.height ? "landscape" : "portrait",
    );
  }, [setOrientation, viewport.width, viewport.height]);

  // update view offset based on animation
  useFrame(() => {
    ref.current?.setViewOffset(
      viewport.width,
      viewport.height,
      orientation === "landscape" ? offset.get() : 0,
      orientation === "portrait" ? offset.get() : 0,
      viewport.width,
      viewport.height,
    );
  });

  return <PerspectiveCamera ref={ref} makeDefault position={[5, 0, 0]} />;
}

function Controls() {
  const actionsThatStopRotation = new Set<number>([
    CameraControls.ACTION.ROTATE,
    CameraControls.ACTION.TOUCH_ROTATE,
  ]);

  const { rotate, setRotate } = useStore(({ rotate, setRotate }) => ({
    rotate,
    setRotate,
  }));
  const ref = useRef<CameraControlsImpl>(null);

  const polarAngle = useSpringValue(degToRad(90), { config: config.gentle });

  useFrame(() => {
    if (!ref.current) return;

    if (polarAngle.isAnimating) ref.current.polarAngle = polarAngle.get();
  });

  // reset camera polar angle when rotation starts
  useEffect(() => {
    if (!rotate) return;
    if (!ref.current) return;

    polarAngle.set(ref.current.polarAngle); // give the animation a starting point
    polarAngle.start(degToRad(90));
  }, [rotate, polarAngle]);

  // behavior: if the user clicks but doesn't drag, rotation doesn't change
  // if user clicks and drags, we disable rotation because they are taking control of the camera
  const onChange = () => {
    if (!ref.current) return;
    if (!polarAngle.idle) return;
    if (!actionsThatStopRotation.has(ref.current.currentAction)) return;

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

// 360 degrees rotation every 30 seconds
const rotationDuration = 30;
const sphereSegments = 256;
const points = new EllipseCurve(0, 0, 1.001, 1.001).getPoints(sphereSegments);

function Globe({ children }: PropsWithChildren) {
  const rotate = useStore((state) => state.rotate);
  const tilt = useStore((state) => state.tilt);

  const ref = useRef<Group>(null);

  const texture = useTexture("/2_no_clouds_16k.jpg");

  const { axialTilt } = useSpring({
    axialTilt: tilt ? -degToRad(23.5) : 0,
    config: config.gentle,
  });

  useFrame((_, delta) => {
    if (!ref.current) return;

    // globe tilts around the x-axis
    ref.current.rotation.x = axialTilt.get();

    // globe rotates around the y-axis, if enabled
    if (rotate)
      ref.current.rotation.y += ((2 * Math.PI) / rotationDuration) * delta;
  });

  return (
    <group ref={ref}>
      <Suspense fallback={null}>{children}</Suspense>
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
      {/* globe */}
      <Sphere
        args={[1, sphereSegments, sphereSegments]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <meshStandardMaterial map={texture} />
      </Sphere>
    </group>
  );
}
