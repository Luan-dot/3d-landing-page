// src/components/Scene.tsx
import { OrbitControls, Grid, Stars } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import GlowingLeaf from "./GlowingLeaf";
import ProjectHologram from "./ProjectHologram";
import TeamConstellation from "./TeamConstellation";
import SpaceTravel from "./SpaceTravel";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/three";
import { useMemo, useRef, useState, useEffect } from "react";

interface SceneProps {
  isExploring: boolean;
  onLeafClick: (index: number) => void;
  section: "projects" | "about" | "contact";
}

const projects = [
  {
    name: "Green Mining",
    description: "Sustainable cryptocurrency mining solutions",
    details:
      "Our mining solution reduces energy consumption by 85% through advanced cooling systems and renewable energy integration.",
  },
  {
    name: "Carbon Credits",
    description: "Blockchain-based carbon credit trading",
    details:
      "Transparent and verifiable carbon credit tracking using smart contracts and real-time monitoring.",
  },
  {
    name: "Smart Grid",
    description: "Decentralized renewable energy management",
    details:
      "AI-powered grid optimization that reduces waste and improves distribution efficiency.",
  },
  {
    name: "Waste Tracking",
    description: "Supply chain waste reduction system",
    details:
      "End-to-end waste tracking and optimization platform for enterprise supply chains.",
  },
  {
    name: "Forest Tokens",
    description: "Tokenized reforestation projects",
    details:
      "Direct investment in forest conservation with real-time monitoring and impact tracking.",
  },
  {
    name: "Ocean Clean",
    description: "Marine pollution reduction initiatives",
    details:
      "Automated waste collection systems powered by renewable energy and blockchain verification.",
  },
  {
    name: "Solar Chain",
    description: "Decentralized solar energy marketplace",
    details:
      "P2P energy trading platform that optimizes local energy distribution and storage.",
  },
  {
    name: "Bio Trace",
    description: "Biodiversity tracking platform",
    details: "AI-powered species tracking and conservation management system.",
  },
  {
    name: "Clean Air DAO",
    description: "Air quality improvement collective",
    details:
      "Decentralized organization funding and managing air quality improvement projects.",
  },
  {
    name: "Earth Data",
    description: "Environmental data marketplace",
    details:
      "Secure platform for sharing and monetizing environmental sensor data.",
  },
];

function FloatingLines({ count = 20 }) {
  const lines = useMemo(() => {
    return Array.from({ length: count }, () => ({
      start: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
      ],
      end: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
      ],
      speed: Math.random() * 0.2 + 0.1,
    }));
  }, [count]);

  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.001;
      linesRef.current.children.forEach((line, i) => {
        if (line instanceof THREE.Line) {
          const material = line.material as THREE.LineBasicMaterial;
          material.opacity =
            Math.sin(state.clock.elapsedTime * lines[i].speed) * 0.3 + 0.2;
        }
      });
    }
  });

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line.start, ...line.end])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ff88" transparent opacity={0.2} />
        </line>
      ))}
    </group>
  );
}

function DepthRings() {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.001;
      ringsRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <group ref={ringsRef}>
      {[10, 15, 20].map((radius, i) => (
        <mesh key={i} rotation-x={Math.PI / 2}>
          <ringGeometry args={[radius, radius + 0.1, 64]} />
          <meshBasicMaterial
            color="#00ff88"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene({
  isExploring,
  onLeafClick,
  section,
}: SceneProps) {
  const { camera } = useThree();
  const sceneRef = useRef<THREE.Group>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSectionRef = useRef(section);
  const prevIsExploringRef = useRef(isExploring);

  useEffect(() => {
    if (
      prevSectionRef.current !== section ||
      prevIsExploringRef.current !== isExploring
    ) {
      setIsTransitioning(true);
      prevSectionRef.current = section;
      prevIsExploringRef.current = isExploring;
    }
  }, [section, isExploring]);

  useSpring({
    from: {
      cameraX: camera.position.x,
      cameraY: camera.position.y,
      cameraZ: camera.position.z,
    },
    to: async (next) => {
      if (isTransitioning) {
        // Initial gentle zoom out
        await next({
          cameraX: 0,
          cameraY: camera.position.y * 0.8,
          cameraZ: camera.position.z * 0.8,
          config: {
            mass: 2,
            tension: 120,
            friction: 40,
          },
        });

        // Move to center position smoothly
        await next({
          cameraX: 0,
          cameraY: 8,
          cameraZ: 25,
          config: {
            mass: 2,
            tension: 100,
            friction: 50,
          },
        });

        // Gradual travel through space
        await next({
          cameraX: 0,
          cameraY: 8,
          cameraZ: -25,
          config: {
            mass: 2,
            tension: 80,
            friction: 40,
            duration: 3000, // Ensure smooth travel duration
          },
        });

        // Smoothly arrive at destination
        await next({
          cameraX: section === "about" ? 0 : isExploring ? 0 : 0,
          cameraY: section === "about" ? 10 : isExploring ? 8 : 15,
          cameraZ: section === "about" ? 20 : isExploring ? 15 : 30,
          config: {
            mass: 2,
            tension: 120,
            friction: 50,
          },
        });
      } else {
        // Direct movement when not transitioning
        await next({
          cameraX: section === "about" ? 0 : isExploring ? 0 : 0,
          cameraY: section === "about" ? 10 : isExploring ? 8 : 15,
          cameraZ: section === "about" ? 20 : isExploring ? 15 : 30,
          config: {
            mass: 2,
            tension: 150,
            friction: 50,
          },
        });
      }
    },
    onChange: ({ value }) => {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.position.set(value.cameraX, value.cameraY, value.cameraZ);
        // Smoother FOV transition
        if (isTransitioning) {
          const progress = Math.abs(value.cameraZ) / 25; // Normalized progress
          camera.fov = 60 + progress * 20; // More subtle FOV change
        } else {
          camera.fov = isExploring ? 50 : 60;
        }
        camera.updateProjectionMatrix();
        if (isTransitioning) {
          camera.lookAt(0, 0, 0);
        }
      }
    },
  });

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

  const fadeSpring = useSpring({
    opacity: isExploring ? 1 : 0,
    config: { duration: 1000 },
  });

  return (
    <group ref={sceneRef}>
      <OrbitControls
        enableZoom={section === "about" || isExploring}
        enablePan={section === "about" || isExploring}
        enabled={!isTransitioning}
        maxDistance={section === "about" ? 30 : 50}
        minDistance={section === "about" ? 3 : 5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        enableDamping
        dampingFactor={0.05}
      />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={isTransitioning ? 1.5 : 1}
      />

      <group position={[0, 5, 0]}>
        <SpaceTravel
          active={isTransitioning}
          onComplete={() => setIsTransitioning(false)}
        />
      </group>

      {/* Ensure content is visible when not transitioning */}
      {!isTransitioning && (
        <>
          {section === "projects" && (
            <>
              {!isExploring && (
                <>
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
                    <GlowingLeaf
                      key={index}
                      initialPosition={position}
                      project={projects[index]}
                      isExploring={isExploring}
                      onClick={() => onLeafClick(index)}
                    />
                  ))}
                </>
              )}

              {isExploring && (
                <animated.group scale={fadeSpring.opacity}>
                  <group position={[0, 0, 0]}>
                    {projects.map((project, index) => (
                      <ProjectHologram
                        key={index}
                        project={project}
                        position={[
                          Math.cos((index / projects.length) * Math.PI * 2) * 8,
                          0,
                          Math.sin((index / projects.length) * Math.PI * 2) * 8,
                        ]}
                      />
                    ))}
                  </group>
                </animated.group>
              )}
            </>
          )}

          {section === "about" && (
            <group position={[0, 0, 0]}>
              <DepthRings />
              <FloatingLines count={30} />
              <Grid
                renderOrder={-1}
                position={[0, -0.5, 0]}
                infiniteGrid
                cellSize={1}
                cellThickness={0.3}
                sectionSize={3}
                sectionThickness={0.5}
                sectionColor={new THREE.Color(0.2, 0.8, 0.2)}
                fadeDistance={30}
                fadeStrength={1}
              />
              <TeamConstellation />
              {Array.from({ length: 100 }).map((_, i) => (
                <mesh
                  key={i}
                  position={[
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 30,
                  ]}
                >
                  <sphereGeometry args={[0.02, 8, 8]} />
                  <meshBasicMaterial
                    color="#00ff88"
                    transparent
                    opacity={0.3}
                  />
                </mesh>
              ))}
            </group>
          )}
        </>
      )}
    </group>
  );
}
