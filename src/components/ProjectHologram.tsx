import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface ProjectHologramProps {
  project: {
    name: string;
    description: string;
    details: string;
  };
  position: [number, number, number];
}

export default function ProjectHologram({
  project,
  position,
}: ProjectHologramProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const scale = expanded ? 1.5 : hovered ? 1.2 : 1;

  return (
    <group
      position={position}
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
      scale={scale}
    >
      {/* Base platform */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
        <meshStandardMaterial
          color="#00ff88"
          opacity={0.3}
          transparent
          emissive="#00ff88"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Holographic Ring */}
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[1, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#00ff88"
          opacity={0.3}
          transparent
          emissive="#00ff88"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Vertical beams */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 1,
            expanded ? 2 : 1,
            Math.sin((i / 8) * Math.PI * 2) * 1,
          ]}
        >
          <boxGeometry args={[0.02, expanded ? 4 : 2, 0.02]} />
          <meshStandardMaterial
            color="#00ff88"
            opacity={0.3}
            transparent
            emissive="#00ff88"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Project Info */}
      <group position={[0, expanded ? 2 : 1, 0]}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.3}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {project.name}
        </Text>

        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {project.description}
        </Text>

        {expanded && (
          <Text
            position={[0, -0.5, 0]}
            fontSize={0.12}
            color="#00ff88"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.5}
          >
            {project.details}
          </Text>
        )}
      </group>

      {/* Interactive indicator */}
      <mesh position={[0, expanded ? 3 : 1.5, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#00ff88"
          opacity={hovered ? 0.8 : 0.4}
          transparent
          emissive="#00ff88"
          emissiveIntensity={hovered ? 0.8 : 0.4}
        />
      </mesh>
    </group>
  );
}
