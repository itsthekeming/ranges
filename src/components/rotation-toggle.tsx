import { XMarkIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { config, useSpringValue } from "@react-spring/three";
import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import { useStore } from "~/state";

export function RotationToggle() {
  const rotateGlobe = useStore((state) => state.rotate);
  const setRotateGlobe = useStore((state) => state.setRotate);

  const [iconRotation, setIconRotation] = useState(rotateGlobe ? -90 : 0);
  const [rotateIcon, setRotateIcon] = useState(true);

  const rotate = useSpringValue(iconRotation, {
    config: config.gentle,
  });

  const buttonStyle = useSpring({
    color: rotateGlobe ? "#3b82f6" : "#ffffff",
    config: config.gentle,
  });

  const xMarkStyle = useSpring({
    color: rotateGlobe ? "#3b82f6" : "#ffffff",
    opacity: rotateGlobe ? 0 : 1,
    config: config.gentle,
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
    console.log("handleClick");
    setRotateGlobe(!rotateGlobe);
    setRotateIcon(false);
    setIconRotation((prev) => prev - 90);
  };

  useEffect(() => {
    rotate.start(iconRotation);
  }, [rotate, iconRotation]);

  return (
    <animated.button
      onClick={handleClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
      style={buttonStyle}
      className="relative flex size-12 items-center justify-center rounded-full"
    >
      <animated.div
        style={{ rotate }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <ArrowPathIcon className="size-8 -scale-x-100 rounded-full" />
      </animated.div>
      <animated.div
        style={xMarkStyle}
        className="absolute inset-0 flex items-center justify-center"
      >
        <XMarkIcon className="size-4" />
      </animated.div>
    </animated.button>
  );
}
