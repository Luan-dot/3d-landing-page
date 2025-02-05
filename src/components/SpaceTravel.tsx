import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SpaceTravelProps {
  active: boolean;
  onComplete: () => void;
}

export default function SpaceTravel({ active, onComplete }: SpaceTravelProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const geometryRef = useRef<THREE.BufferGeometry>();

  // Initialize geometry once
  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const particlesCnt = 5000;
    const posArray = new Float32Array(particlesCnt * 3);

    for (let i = 0; i < particlesCnt * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 20; // x
      posArray[i + 1] = (Math.random() - 0.5) * 20; // y
      posArray[i + 2] = Math.random() * 100 - 50; // z
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    geometryRef.current = geometry;
  }, []);

  useFrame((_, delta) => {
    if (active && particlesRef.current && geometryRef.current) {
      timeRef.current += delta;

      const positions = geometryRef.current.attributes.position;
      const array = positions.array as Float32Array;

      for (let i = 0; i < array.length; i += 3) {
        array[i + 2] += delta * 100;
        if (array[i + 2] > 50) {
          array[i + 2] = -50;
        }
      }

      positions.needsUpdate = true;

      if (timeRef.current >= 2) {
        onComplete();
        timeRef.current = 0;
      }
    }
  });

  if (!active || !geometryRef.current) return null;

  return (
    <points ref={particlesRef}>
      <primitive object={geometryRef.current} />
      <pointsMaterial
        size={0.1}
        color="#00ff88"
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}
