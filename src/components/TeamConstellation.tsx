import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import TeamMemberHologram from "./TeamMemberHologram";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  expertise: string[];
  position: readonly [number, number, number];
  connections: number[];
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Founder & CEO",
    expertise: ["Blockchain", "Sustainability", "Strategy"],
    position: [-4, 0, -2] as const,
    connections: [2, 3, 4],
  },
  {
    id: 2,
    name: "Alex Rivera",
    role: "CTO",
    expertise: ["Systems Architecture", "Green Computing", "AI"],
    position: [4, 0, -2] as const,
    connections: [1, 3],
  },
  {
    id: 3,
    name: "Dr. Maya Patel",
    role: "Head of Research",
    expertise: ["Environmental Science", "Data Analytics", "IoT"],
    position: [0, 0, 3] as const,
    connections: [1, 2, 4],
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Lead Engineer",
    expertise: ["Smart Contracts", "Renewable Energy", "DeFi"],
    position: [-2, 0, 2] as const,
    connections: [1, 3],
  },
];

interface ConstellationLineProps {
  start: readonly [number, number, number];
  end: readonly [number, number, number];
}

function ConstellationLine({ start, end }: ConstellationLineProps) {
  const ref = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (ref.current) {
      const material = ref.current.material as THREE.LineBasicMaterial;
      material.opacity = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.5;
    }
  });

  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <lineSegments ref={ref}>
      <bufferGeometry {...lineGeometry} />
      <lineBasicMaterial color="#00ff88" transparent opacity={0.5} />
    </lineSegments>
  );
}

export default function TeamConstellation() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection Lines */}
      {teamMembers.map((member) =>
        member.connections.map((connectionId) => {
          const connectedMember = teamMembers.find(
            (m) => m.id === connectionId
          );
          if (connectedMember) {
            return (
              <ConstellationLine
                key={`${member.id}-${connectionId}`}
                start={member.position}
                end={connectedMember.position}
              />
            );
          }
          return null;
        })
      )}

      {/* Team Member Nodes */}
      {teamMembers.map((member) => (
        <TeamMemberHologram
          key={member.id}
          member={member}
          position={member.position}
        />
      ))}
    </group>
  );
}
