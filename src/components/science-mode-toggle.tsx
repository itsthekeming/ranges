import {  ItalicIcon } from "@heroicons/react/24/solid";
import { config } from "@react-spring/three";
import { animated, useSpring } from "@react-spring/web";
import { useStore } from "~/state";

export function ScienceModeToggle() {
  const { scienceMode, setScienceMode } = useStore((state) => ({
    scienceMode: state.scienceMode,
    setScienceMode: state.setScienceMode,
  }));

  const buttonStyle = useSpring({
    color: scienceMode ? "#3b82f6" : "#ffffff",
    config: config.gentle,
  });

  const handleClick = () => {
    setScienceMode(!scienceMode);
  };

  return (
    <animated.button
      onClick={handleClick}
      style={buttonStyle}
      className="relative flex size-12 items-center justify-center rounded-full"
    >
        <ItalicIcon className="size-8" />
    </animated.button>
  );
}
