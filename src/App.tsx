import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import Header from "./components/header";

export default function App() {
  const [isExploring, setIsExploring] = useState(false);
  const [currentSection, setCurrentSection] = useState<
    "projects" | "about" | "contact"
  >("projects");

  const handleLeafClick = (index: number) => {
    console.log(`Clicked project ${index}`);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-green-900 to-black text-white overflow-hidden font-sans">
      <Header
        onSectionChange={setCurrentSection}
        currentSection={currentSection}
      />

      <Canvas
        shadows
        camera={{ position: [0, 15, 30], fov: 60 }}
        className="absolute inset-0"
      >
        <Scene
          isExploring={isExploring}
          onLeafClick={handleLeafClick}
          section={currentSection}
        />
      </Canvas>

      {currentSection === "projects" && !isExploring && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <h1 className="text-5xl font-bold mb-8 max-w-4xl mx-auto font-manrope">
            Sustainable Solutions for a
            <br />
            Web3 World
          </h1>
          <h2 className="text-xl mb-10">
            Empowering businesses with eco-friendly blockchain technology
          </h2>
          <button
            onClick={() => setIsExploring(true)}
            className="bg-green-500 text-white font-bold py-3 px-6 rounded-md hover:bg-green-600 transition duration-300"
          >
            Explore Our Solutions
          </button>
        </div>
      )}

      {isExploring && (
        <button
          onClick={() => setIsExploring(false)}
          className="absolute top-4 right-4 z-20 bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
        >
          Back
        </button>
      )}
    </div>
  );
}
