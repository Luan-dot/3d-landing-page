import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

export default function EarthGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [spring, api] = useSpring(() => ({
    scale: 1,
    config: { mass: 1, tension: 280, friction: 60 },
  }));

  const handlePointerEnter = () => api.start({ scale: 1.2 });
  const handlePointerLeave = () => api.start({ scale: 1 });

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <animated.mesh
      ref={meshRef}
      scale={spring.scale}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhysicalMaterial
        color="#4CAF50"
        roughness={0.3}
        metalness={0.8}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
        envMapIntensity={1}
      />
    </animated.mesh>
  );
}
