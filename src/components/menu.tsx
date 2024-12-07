import { RotationToggle } from "./rotation-toggle";
import { AxialTiltToggle } from "./axial-tilt-toggle";

export function Menu() {
  return (
    <div>
      <div className="fixed bottom-4 left-4 z-10 flex flex-row items-center space-x-4 text-white">
        <RotationToggle />
        <AxialTiltToggle />
      </div>
    </div>
  );
}
