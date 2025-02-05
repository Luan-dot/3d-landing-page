// src/components/TeamMemberHologram.tsx
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface TeamMemberProps {
  member: {
    name: string;
    role: string;
    expertise: string[];
  };
  position: readonly [number, number, number];
}

export default function TeamMemberHologram({
  member,
  position,
}: TeamMemberProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const scale = hovered ? 1.1 : 1;

  return (
    <group
      ref={groupRef}
      position={new THREE.Vector3(...position)}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Core Node */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#00ff88"
          transparent
          opacity={0.6}
          emissive="#00ff88"
          emissiveIntensity={hovered ? 0.8 : 0.4}
        />
      </mesh>

      {/* Holographic Display */}
      <group position={[0, 2, 0]}>
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.35}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
        >
          {member.name}
        </Text>

        <Text
          position={[0, 0.2, 0]}
          fontSize={0.25}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
        >
          {member.role}
        </Text>

        <group position={[0, -0.3, 0]}>
          {member.expertise.map((skill, index) => (
            <Text
              key={skill}
              position={[0, -index * 0.25, 0]}
              fontSize={0.2}
              color="#00ff88"
              anchorX="center"
              anchorY="middle"
            >
              {skill}
            </Text>
          ))}
        </group>
      </group>

      {/* Orbital Rings */}
      <group>
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[0.6, 0.65, 32]} />
          <meshBasicMaterial
            color="#00ff88"
            transparent
            opacity={hovered ? 0.4 : 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh rotation-x={Math.PI / 4}>
          <ringGeometry args={[0.7, 0.75, 32]} />
          <meshBasicMaterial
            color="#00ff88"
            transparent
            opacity={hovered ? 0.3 : 0.15}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh rotation-x={Math.PI / 3}>
          <ringGeometry args={[0.8, 0.83, 32]} />
          <meshBasicMaterial
            color="#00ff88"
            transparent
            opacity={hovered ? 0.2 : 0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Glow effect */}
      <pointLight color="#00ff88" intensity={hovered ? 2 : 1} distance={3} />
    </group>
  );
}
