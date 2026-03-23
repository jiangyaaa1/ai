import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Html } from '@react-three/drei';
import { useStore } from '../store';
import * as THREE from 'three';

const AnimeFace = ({ zOffset = 1.01 }: { zOffset?: number }) => (
  <group position={[0, 0, zOffset]}>
    {/* Left Eye */}
    <mesh position={[-0.3, 0.1, 0]}>
      <capsuleGeometry args={[0.08, 0.2, 4, 16]} />
      <meshBasicMaterial color="#111" />
    </mesh>
    {/* Left Eye Highlight */}
    <mesh position={[-0.32, 0.22, 0.05]}>
      <circleGeometry args={[0.03, 16]} />
      <meshBasicMaterial color="#fff" />
    </mesh>
    <mesh position={[-0.28, 0.12, 0.05]}>
      <circleGeometry args={[0.015, 16]} />
      <meshBasicMaterial color="#fff" />
    </mesh>

    {/* Right Eye */}
    <mesh position={[0.3, 0.1, 0]}>
      <capsuleGeometry args={[0.08, 0.2, 4, 16]} />
      <meshBasicMaterial color="#111" />
    </mesh>
    {/* Right Eye Highlight */}
    <mesh position={[0.28, 0.22, 0.05]}>
      <circleGeometry args={[0.03, 16]} />
      <meshBasicMaterial color="#fff" />
    </mesh>
    <mesh position={[0.32, 0.12, 0.05]}>
      <circleGeometry args={[0.015, 16]} />
      <meshBasicMaterial color="#fff" />
    </mesh>

    {/* Blush */}
    <mesh position={[-0.45, -0.1, 0]}>
      <circleGeometry args={[0.12, 16]} />
      <meshBasicMaterial color="#ff88aa" transparent opacity={0.7} />
    </mesh>
    <mesh position={[0.45, -0.1, 0]}>
      <circleGeometry args={[0.12, 16]} />
      <meshBasicMaterial color="#ff88aa" transparent opacity={0.7} />
    </mesh>

    {/* Mouth (Cute Triangle) */}
    <mesh position={[0, -0.15, 0.02]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.08, 0.15, 3]} />
      <meshBasicMaterial color="#ff6688" />
    </mesh>
  </group>
);

const Neko = ({ color }: { color: string }) => (
  <group>
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshToonMaterial color={color} />
    </mesh>
    {/* Ears */}
    <mesh position={[-0.5, 0.8, 0]} rotation={[0, 0, 0.3]}>
      <coneGeometry args={[0.3, 0.6, 16]} />
      <meshToonMaterial color={color} />
    </mesh>
    <mesh position={[0.5, 0.8, 0]} rotation={[0, 0, -0.3]}>
      <coneGeometry args={[0.3, 0.6, 16]} />
      <meshToonMaterial color={color} />
    </mesh>
    {/* Tail */}
    <mesh position={[0, -0.5, -0.9]} rotation={[0.5, 0, 0]}>
      <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
      <meshToonMaterial color={color} />
    </mesh>
    <AnimeFace zOffset={1.01} />
  </group>
);

const Slime = ({ color }: { color: string }) => (
  <group position={[0, -0.2, 0]}>
    <mesh scale={[1, 0.8, 1]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshToonMaterial color={color} />
    </mesh>
    <mesh position={[0, 0.6, 0]}>
      <coneGeometry args={[0.5, 1, 32]} />
      <meshToonMaterial color={color} />
    </mesh>
    <group position={[0, 0.1, 0]}>
      <AnimeFace zOffset={1.01} />
    </group>
  </group>
);

const Ghost = ({ color }: { color: string }) => (
  <group>
    <mesh position={[0, 0.2, 0]}>
      <capsuleGeometry args={[0.8, 1, 16, 32]} />
      <meshToonMaterial color={color} />
    </mesh>
    {/* little arms */}
    <mesh position={[-0.8, -0.2, 0]} rotation={[0, 0, 0.5]}>
      <capsuleGeometry args={[0.15, 0.4, 8, 8]} />
      <meshToonMaterial color={color} />
    </mesh>
    <mesh position={[0.8, -0.2, 0]} rotation={[0, 0, -0.5]}>
      <capsuleGeometry args={[0.15, 0.4, 8, 8]} />
      <meshToonMaterial color={color} />
    </mesh>
    {/* Tail/bottom */}
    <mesh position={[0, -0.8, -0.2]} rotation={[0.5, 0, 0]}>
      <coneGeometry args={[0.6, 0.8, 16]} />
      <meshToonMaterial color={color} />
    </mesh>
    <group position={[0, 0.2, 0]}>
      <AnimeFace zOffset={0.81} />
    </group>
  </group>
);

const ChibiCaier = ({ color }: { color: string }) => {
  const hairColor = "#2a1b38"; // Deep purple/black hair
  const skinColor = "#fff0e6"; // Pale skin
  const dressColor = color; // User customizable, defaults to dark purple
  const dressAccent = "#1a1a1a"; // Black accents

  return (
    <group position={[0, -0.5, 0]}>
      {/* Legs (Black tights) */}
      <mesh position={[-0.15, 0.4, 0]}>
        <capsuleGeometry args={[0.08, 0.4]} />
        <meshToonMaterial color="#111" />
      </mesh>
      <mesh position={[0.15, 0.4, 0]}>
        <capsuleGeometry args={[0.08, 0.4]} />
        <meshToonMaterial color="#111" />
      </mesh>
      
      {/* Body/Dress (Assassin style) */}
      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.4, 0.8, 16]} />
        <meshToonMaterial color={dressColor} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.4]} />
        <meshToonMaterial color={dressAccent} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.35, 1.0, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.06, 0.4]} />
        <meshToonMaterial color={skinColor} />
      </mesh>
      <group position={[0.35, 1.0, 0]} rotation={[0, 0, -0.3]}>
        <mesh>
          <capsuleGeometry args={[0.06, 0.4]} />
          <meshToonMaterial color={skinColor} />
        </mesh>
        {/* Dagger in hand */}
        <mesh position={[0, -0.3, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.04, 0.4]} />
          <meshToonMaterial color="#cccccc" />
        </mesh>
        <mesh position={[0, -0.15, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.15, 0.05, 0.05]} />
          <meshToonMaterial color="#111" />
        </mesh>
      </group>

      {/* Head Group */}
      <group position={[0, 1.5, 0]}>
        {/* Face */}
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshToonMaterial color={skinColor} />
        </mesh>
        
        {/* Blindfold (Iconic Cai'er) */}
        <mesh position={[0, 0, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.41, 0.41, 0.15, 32]} />
          <meshToonMaterial color="#111" />
        </mesh>
        
        {/* Hair Base */}
        <mesh position={[0, 0.1, -0.05]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshToonMaterial color={hairColor} />
        </mesh>
        
        {/* Long Hair Back */}
        <mesh position={[0, -0.4, -0.25]} rotation={[0.1, 0, 0]}>
          <coneGeometry args={[0.35, 1.2, 16]} />
          <meshToonMaterial color={hairColor} />
        </mesh>
        
        {/* Hair Bangs */}
        <mesh position={[-0.2, 0.2, 0.35]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.1, 0.4]} />
          <meshToonMaterial color={hairColor} />
        </mesh>
        <mesh position={[0.2, 0.2, 0.35]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.1, 0.4]} />
          <meshToonMaterial color={hairColor} />
        </mesh>
        <mesh position={[0, 0.25, 0.38]}>
          <coneGeometry args={[0.1, 0.3]} />
          <meshToonMaterial color={hairColor} />
        </mesh>

        {/* Blush (peeking under blindfold) */}
        <mesh position={[-0.2, -0.15, 0.35]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial color="#ff88aa" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.2, -0.15, 0.35]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial color="#ff88aa" transparent opacity={0.6} />
        </mesh>

        {/* Small Mouth */}
        <mesh position={[0, -0.2, 0.38]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.03, 0.06, 3]} />
          <meshBasicMaterial color="#ff6688" />
        </mesh>
      </group>
    </group>
  );
};

const AnimePet = ({ color, type, onClick }: { color: string, type: string, onClick: () => void }) => {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  const getHoverText = () => {
    switch(type) {
      case 'caier': return "我会保护你的... (点击唤醒)";
      case 'slime': return "Puru puru! (Click to wake)";
      case 'ghost': return "Boooo~ (Click to wake)";
      default: return "Goshujin-sama! (Click to wake)";
    }
  };

  return (
    <group 
      ref={group} 
      onClick={onClick} 
      onPointerOver={() => {
        setHover(true);
        document.body.style.cursor = 'pointer';
      }} 
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {type === 'cat' && <Neko color={color} />}
      {type === 'slime' && <Slime color={color} />}
      {type === 'ghost' && <Ghost color={color} />}
      {type === 'caier' && <ChibiCaier color={color} />}
      
      {hovered && (
        <Html position={[0, type === 'caier' ? 2.5 : 2.2, 0]} center>
          <div className={`bg-white/90 border-2 ${type === 'caier' ? 'border-purple-500 text-purple-700' : 'border-pink-400 text-pink-500'} px-4 py-2 text-sm whitespace-nowrap rounded-full font-bold shadow-lg animate-bounce`}>
            {getHoverText()}
          </div>
        </Html>
      )}
    </group>
  );
};

export const DesktopPet = () => {
  const { setMinimized, petColor, petType } = useStore();

  return (
    <div className="w-full h-screen bg-[#040b14] flex items-center justify-center relative overflow-hidden font-mono">
      {/* Matrix/Cyberpunk background hint */}
      <div className="absolute inset-0 scanlines opacity-50 pointer-events-none"></div>
      
      <div className="absolute top-4 left-4 text-neon-cyan/50 text-xs">
        OMNI-AGENT [ANIME_MODE: ACTIVE]
      </div>

      <div className="w-full h-full max-w-2xl max-h-[800px]">
        <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <directionalLight position={[-5, 5, 5]} intensity={0.5} color={petColor} />
          
          <Float
            speed={2.5} // Animation speed
            rotationIntensity={0.2} // XYZ rotation intensity
            floatIntensity={2} // Up/down float intensity
            floatingRange={[-0.2, 0.2]} // Range of y-axis values the object will float within
          >
            <AnimePet color={petColor} type={petType || 'cat'} onClick={() => setMinimized(false)} />
          </Float>
          
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        </Canvas>
      </div>
    </div>
  );
};
