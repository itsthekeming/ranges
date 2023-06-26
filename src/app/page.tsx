import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import { Scene } from "~/components/scene";

export default function Home() {
  return (
    <main className="h-screen w-screen flex">
      <Scene />
    </main>
  );
}
