import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface Project {
  name: string;
  description: string;
}

interface GlowingLeafProps {
  initialPosition: [number, number, number];
  project: Project;
  isExploring: boolean;
  onClick: () => void;
}

export default function GlowingLeaf({
  initialPosition,
  project,
  isExploring,
  onClick,
}: GlowingLeafProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hologramRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [targetPosition, setTargetPosition] = useState(
    new THREE.Vector3(...initialPosition)
  );
  const currentPosition = useRef(new THREE.Vector3(...initialPosition));
  const [showHologram, setShowHologram] = useState(false);

  useEffect(() => {
    if (isExploring) {
      // Delay hologram appearance for a smoother transition
      const timer = setTimeout(() => setShowHologram(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowHologram(false);
    }
  }, [isExploring]);

  const getNextPosition = (current: THREE.Vector3) => {
    if (isExploring) return current;

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
      Math.random() * 2 + 0.5,
      current.z + randomDirection[1] * 3
    );
  };

  useEffect(() => {
    if (isExploring) {
      currentPosition.current = new THREE.Vector3(...initialPosition);
      setTargetPosition(new THREE.Vector3(...initialPosition));
      return;
    }

    const interval = setInterval(() => {
      const newPosition = getNextPosition(currentPosition.current);
      newPosition.x = Math.max(-15, Math.min(15, newPosition.x));
      newPosition.z = Math.max(-15, Math.min(15, newPosition.z));
      setTargetPosition(newPosition);
    }, 2000);

    return () => clearInterval(interval);
  }, [isExploring, initialPosition]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (!isExploring) {
        currentPosition.current.lerp(targetPosition, 0.05);
        meshRef.current.position.copy(currentPosition.current);
      }

      meshRef.current.rotation.y += delta * 0.2;
    }

    if (hologramRef.current && showHologram) {
      hologramRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={initialPosition}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color={hovered ? "#00ff88" : "#00ff00"}
          opacity={0.6}
          transparent
          emissive={hovered ? "#00ff88" : "#00ff00"}
          emissiveIntensity={hovered ? 0.4 : 0.2}
        />
      </mesh>

      {showHologram && (
        <group
          ref={hologramRef}
          position={[
            initialPosition[0],
            initialPosition[1] + 2,
            initialPosition[2],
          ]}
        >
          {/* Holographic Ring */}
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[1.2, 0.05, 16, 100]} />
            <meshStandardMaterial
              color="#00ff88"
              opacity={0.3}
              transparent
              emissive="#00ff88"
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Vertical lines */}
          {[...Array(8)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 1.2,
                0,
                Math.sin((i / 8) * Math.PI * 2) * 1.2,
              ]}
            >
              <boxGeometry args={[0.02, 4, 0.02]} />
              <meshStandardMaterial
                color="#00ff88"
                opacity={0.3}
                transparent
                emissive="#00ff88"
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}

          {/* Project Title */}
          <Text
            position={[0, 1, 0]}
            fontSize={0.3}
            color="#00ff88"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
          >
            {project.name}
          </Text>

          {/* Project Description */}
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.15}
            color="#00ff88"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
          >
            {project.description}
          </Text>

          {/* Floating Icons - simplified 3D representations */}
          <group position={[0, -0.2, 0]}>
            {/* Example icon geometry */}
            <mesh position={[0.6, 0, 0]} scale={0.15}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial
                color="#00ff88"
                opacity={0.4}
                transparent
                emissive="#00ff88"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        </group>
      )}

      <pointLight
        position={[
          initialPosition[0],
          initialPosition[1] + (showHologram ? 2 : 0),
          initialPosition[2],
        ]}
        intensity={hovered ? 0.6 : 0.4}
        distance={3}
        color={hovered ? "#00ff88" : "#00ff00"}
      />
    </group>
  );
}
