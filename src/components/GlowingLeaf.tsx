import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GlowingLeafProps {
  initialPosition: [number, number, number];
}

export default function GlowingLeaf({ initialPosition }: GlowingLeafProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [targetPosition, setTargetPosition] = useState(
    new THREE.Vector3(...initialPosition)
  );
  const currentPosition = useRef(new THREE.Vector3(...initialPosition));

  const getNextPosition = (current: THREE.Vector3) => {
    const directions: [number, number][] = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];
    return new THREE.Vector3(
      current.x + randomDirection[0] * 3,
      Math.random() * 2 + 0.5, // Random height between 0.5 and 2.5
      current.z + randomDirection[1] * 3
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getNextPosition(currentPosition.current);
      // Keep within bounds
      newPosition.x = Math.max(-15, Math.min(15, newPosition.x));
      newPosition.z = Math.max(-15, Math.min(15, newPosition.z));
      setTargetPosition(newPosition);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth position transition
      currentPosition.current.lerp(targetPosition, 0.05);
      meshRef.current.position.copy(currentPosition.current);

      // Gentle rotation
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={initialPosition}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#00ff00"
          opacity={0.6}
          transparent
          emissive="#00ff00"
          emissiveIntensity={0.2}
        />
      </mesh>
      <pointLight
        position={initialPosition}
        intensity={0.4}
        distance={3}
        color="#00ff00"
      />
    </group>
  );
}
