// src/components/Scene.tsx
import { OrbitControls, Grid } from "@react-three/drei";
import GlowingLeaf from "./GlowingLeaf";
import * as THREE from "three";

export default function Scene() {
  const initialPositions: [number, number, number][] = [
    [-9, 0.5, -9],
    [-3, 0.5, -3],
    [0, 0.5, 0],
    [3, 0.5, 3],
    [9, 0.5, 9],
    [-6, 0.5, 6],
    [6, 0.5, -6],
    [-12, 0.5, 0],
    [12, 0.5, 0],
    [0, 0.5, 12],
  ];

  return (
    <>
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Grid
        renderOrder={-1}
        position={[0, -0.5, 0]}
        infiniteGrid
        cellSize={3}
        cellThickness={0.6}
        sectionSize={9}
        sectionThickness={1.2}
        sectionColor={new THREE.Color(0.2, 0.8, 0.2)}
        fadeDistance={50}
      />
      {initialPositions.map((position, index) => (
        <GlowingLeaf key={index} initialPosition={position} />
      ))}
    </>
  );
}
