import { GlobeAmericasIcon, MinusIcon } from "@heroicons/react/24/solid";
import { animated, config, useSpring, useSpringValue } from "@react-spring/web";
import { useEffect, useState } from "react";
import { useStore } from "~/state";

export function AxialTiltToggle() {
  const tilt = useStore((state) => state.tilt);
  const setTilt = useStore((state) => state.setTilt);

  const [iconRotation, setIconRotation] = useState(tilt ? 23.5 : 0);
  const [rotateIcon, setRotateIcon] = useState(true);

  const { color } = useSpring({
    color: tilt ? "#3b82f6" : "#ffffff",
    config: config.gentle,
  });

  const rotate = useSpringValue(iconRotation, {
    config: config.gentle,
  });

  const handleHoverOrFocus = () => {
    if (!rotateIcon) return;

    rotate.start(Math.abs(iconRotation - 11.75));
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
  }, [iconRotation, rotate, tilt]);

  return (
    <animated.button
      onClick={onClick}
      onMouseEnter={handleHoverOrFocus}
      onMouseLeave={handleUnhoverOrBlur}
      onFocus={handleHoverOrFocus}
      onBlur={handleUnhoverOrBlur}
      style={{ rotate, color }}
      className="relative flex size-12 items-center justify-center rounded-full"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <GlobeAmericasIcon className="size-8 rounded-full" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <MinusIcon className="size-12 rotate-90 rounded-full" />
      </div>
    </animated.button>
  );
}
