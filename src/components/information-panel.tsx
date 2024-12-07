import {
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/solid";
import { useSpring } from "@react-spring/three";
import { animated, config } from "@react-spring/web";
import { Link } from "react-router";
import { useStore } from "~/state";

interface InformationPanelProps {
  title: string;
  content: string;
}

export function InformationPanel({ title, content }: InformationPanelProps) {
  const { showInformationPanel, setShowInformationPanel, orientation } =
    useStore(
      ({ showInformationPanel, setShowInformationPanel, orientation }) => ({
        showInformationPanel,
        setShowInformationPanel,
        orientation,
      })
    );

  const {
    opacity,
    panelX,
    panelY,
    panelRight,
    toggleRight,
    toggleX,
    toggleRotate,
  } = useSpring({
    opacity: showInformationPanel ? 0.9 : 0,
    panelX:
      orientation === "landscape"
        ? showInformationPanel
          ? "0%"
          : "100%"
        : "0%",
    panelY:
      orientation === "portrait"
        ? showInformationPanel
          ? "0%"
          : "100%"
        : "0%",
    panelRight: showInformationPanel ? "2rem" : "0rem",
    toggleX: showInformationPanel ? "0%" : "0%",
    toggleRight: showInformationPanel ? "3rem" : "1rem",
    toggleRotate: showInformationPanel ? 180 : 0,
    config: { ...config.gentle, clamp: true },
  });

  const toggleInformationPanel = () => {
    setShowInformationPanel(!showInformationPanel);
  };

  return (
    <>
      <animated.button
        style={{
          right: toggleRight,
          x: toggleX,
          rotate: toggleRotate,
        }}
        onClick={toggleInformationPanel}
        className="fixed z-20 top-12 size-12 rounded-full"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <ChevronDoubleLeftIcon className="size-8 text-white" />
        </div>
      </animated.button>
      <animated.div
        style={{ x: panelX, y: panelY, right: panelRight }}
        className="fixed z-10 portrait:inset-x-4 portrait:bottom-4 portrait:h-1/2 landscape:inset-y-8 backdrop-blur-sm backdrop-grayscale landscape:w-1/2"
      >
        <animated.div
          style={{ opacity }}
          className="absolute inset-0 rounded-lg bg-gray-950 blur-[2px]"
        />
        <animated.div
          style={{ opacity }}
          className="absolute inset-0 flex flex-col"
        >
          <div className="relative overflow-y-scroll flex grow flex-col p-4 text-white">
            <h1 className="sticky top-0 text-5xl">{title}</h1>
            <Link to="/Yellow-cheeked_chipmunk" className="text-white">Yellow-cheeked Chipmunk</Link>
            <div dangerouslySetInnerHTML={{__html: content}} />
          </div>
        </animated.div>
      </animated.div>
    </>
  );
}
