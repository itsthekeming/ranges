import { XMarkIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { config, useSpringValue } from "@react-spring/three";
import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import { useStore } from "~/components/scene";

export function RotationToggle() {
  const rotateGlobe = useStore((state) => state.rotate);
  const setRotateGlobe = useStore((state) => state.setRotate);

  const [iconRotation, setIconRotation] = useState(rotateGlobe ? -90 : 0);
  const [rotateIcon, setRotateIcon] = useState(true);

  const rotate = useSpringValue(iconRotation, {
    config: config.wobbly,
  });

  const buttonStyle = useSpring({
    color: rotateGlobe ? "#3b82f6" : "#ffffff",
    config: config.wobbly,
  });

  const xMarkStyle = useSpring({
    color: rotateGlobe ? "#3b82f6" : "#ffffff",
    opacity: rotateGlobe ? 0 : 1,
    config: config.wobbly,
  });

  const handleHover = () => {
    if (!rotateIcon) return;

    rotate.start(iconRotation - 15);
  };

  const handleUnhover = () => {
    setRotateIcon(true);
    rotate.start(iconRotation);
  };

  const handleClick = () => {
    setRotateGlobe(!rotateGlobe);
    setRotateIcon(false);
    setIconRotation((prev) => prev - 90);
  };

  useEffect(() => {
    rotate.start(iconRotation);
  }, [iconRotation]);

  return (
    <animated.button
      onClick={handleClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
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
        <XMarkIcon className="h-4 w-4" />
      </animated.div>
    </animated.button>
  );
}
