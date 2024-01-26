import { GlobeAmericasIcon, MinusIcon } from "@heroicons/react/24/solid";
import { animated, config, useSpring, useSpringValue } from "@react-spring/web";
import { useEffect, useState } from "react";
import { useStore } from "~/components/scene";

export function AxialTiltToggle() {
  const tilt = useStore((state) => state.tilt);
  const setTilt = useStore((state) => state.setTilt);

  const [iconRotation, setIconRotation] = useState(tilt ? 23.5 : 0);
  const [rotateIcon, setRotateIcon] = useState(true);

  const { color } = useSpring({
    color: tilt ? "#3b82f6" : "#ffffff",
    config: config.wobbly,
  });

  const rotate = useSpringValue(iconRotation, {
    config: config.wobbly,
  });

  const handleHoverOrFocus = () => {
    if (!rotateIcon) return;

    rotate.start(Math.abs(iconRotation - 4));
  };

  const handleUnhoverOrBlur = () => {
    setRotateIcon(true);
    rotate.start(iconRotation);
  };

  const onClick = () => {
    setIconRotation(!tilt ? 23.5 : 0);
    setTilt(!tilt);
    setRotateIcon(false);
  };

  useEffect(() => {
    rotate.start(iconRotation);
  }, [tilt]);

  return (
    <animated.button
      onClick={onClick}
      onMouseEnter={handleHoverOrFocus}
      onMouseLeave={handleUnhoverOrBlur}
      onFocus={handleHoverOrFocus}
      onBlur={handleUnhoverOrBlur}
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
