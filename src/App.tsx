import { Canvas } from "@react-three/fiber";
import { Leaf, Recycle, Globe } from "lucide-react";
import Scene from "./components/Scene";
import EarthGlobe from "./components/EarthGlobe";

export default function App() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-green-900 to-black text-white overflow-hidden font-sans">
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="w-20 h-20">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <EarthGlobe />
              </Canvas>
            </div>
            <span className="text-2xl font-bold">Brumi</span>
          </div>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="hover:text-green-300">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-300">
                Solutions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-300">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-300">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
        <h1 className="text-5xl font-bold mb-8 max-w-4xl mx-auto font-manrope">
          Sustainable Solutions for a
          <br />
          Web3 World
        </h1>
        <h2 className="text-xl mb-10">
          Empowering businesses with eco-friendly blockchain technology
        </h2>
        <button className="bg-green-500 text-white font-bold py-3 px-6 rounded-md hover:bg-green-600 transition duration-300">
          Explore Our Solutions
        </button>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-16 z-10">
        <div className="text-center">
          <Leaf className="w-12 h-12 mx-auto mb-2 text-green-400" />
          <p>Eco-Friendly</p>
        </div>
        <div className="text-center">
          <Recycle className="w-12 h-12 mx-auto mb-2 text-green-400" />
          <p>Sustainable</p>
        </div>
        <div className="text-center">
          <Globe className="w-12 h-12 mx-auto mb-2 text-green-400" />
          <p>Global Impact</p>
        </div>
      </div>
      <Canvas
        shadows
        camera={{ position: [0, 15, 30], fov: 60 }}
        className="absolute inset-0"
      >
        <Scene />
      </Canvas>
    </div>
  );
}
