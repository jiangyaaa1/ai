import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Html, useGLTF, Center } from '@react-three/drei';
import { useStore } from '../store';
import * as THREE from 'three';
import { runAgentLoop } from '../lib/agent';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';

const CustomModel = ({ url, onClick }: { url: string, onClick: () => void }) => {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group
      ref={group}
      onClick={onClick}
      onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto'; }}
    >
      <Center>
        <primitive object={scene} scale={1.5} />
      </Center>
      {hovered && (
        <Html position={[0, 2.5, 0]} center>
          <div className="bg-black/90 border-2 border-purple-500 text-purple-400 px-4 py-2 text-sm whitespace-nowrap rounded-full font-bold shadow-lg animate-pulse">
            我会保护你的... (点击唤醒)
          </div>
        </Html>
      )}
    </group>
  );
};

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
  const { customModelUrl, setCustomModelUrl, setPetType } = useStore();

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
    <Suspense fallback={<Html center><div className="text-neon-cyan font-bold animate-pulse whitespace-nowrap bg-black/80 px-4 py-2 border border-neon-cyan">LOADING MODEL...</div></Html>}>
      {type !== 'custom' && (
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
      )}

      {type === 'custom' && customModelUrl && <CustomModel url={customModelUrl} onClick={onClick} />}
      
      {type === 'custom' && !customModelUrl && (
        <Html center>
          <div className="flex flex-col items-center justify-center bg-black/90 p-6 border-2 border-neon-cyan rounded-lg shadow-[0_0_20px_rgba(0,255,204,0.4)]">
            <div className="text-neon-cyan text-sm mb-4 font-bold tracking-widest">IMPORT CUSTOM 3D MODEL</div>
            <label className="cursor-pointer bg-neon-cyan/20 hover:bg-neon-cyan/40 text-neon-cyan px-6 py-2 rounded border border-neon-cyan transition-all font-bold text-center">
              <span>SELECT .GLB / .GLTF FILE</span>
              <input
                type="file"
                accept=".glb,.gltf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCustomModelUrl(URL.createObjectURL(file));
                    setPetType('custom');
                  }
                }}
              />
            </label>
          </div>
        </Html>
      )}
    </Suspense>
  );
};

export const DesktopPet = () => {
  const { setMinimized, petColor, petType, isAgentRunning } = useStore();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = navigator.language || 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAgentRunning) return;
    const task = input.trim();
    setInput('');
    runAgentLoop(task);
  };

  return (
    <div className="w-full h-screen bg-[#040b14] flex flex-col items-center justify-center relative overflow-hidden font-mono">
      {/* Matrix/Cyberpunk background hint */}
      <div className="absolute inset-0 scanlines opacity-50 pointer-events-none"></div>
      
      <div className="absolute top-4 left-4 flex items-center gap-4 z-10">
        <div className="text-neon-cyan/50 text-xs">
          OMNI-AGENT [ANIME_MODE: ACTIVE]
        </div>
        <button 
          onClick={() => setMinimized(false)}
          className="text-xs bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan px-3 py-1 hover:bg-neon-cyan hover:text-black transition-colors"
        >
          [ OPEN_TERMINAL ]
        </button>
      </div>

      <div className="w-full flex-1 max-w-2xl">
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

      {/* Floating Input Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-20">
        <form 
          onSubmit={handleSubmit} 
          className="bg-black/80 border border-neon-cyan/50 rounded-full p-2 flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,204,0.2)] backdrop-blur-sm transition-all focus-within:border-neon-cyan focus-within:shadow-[0_0_30px_rgba(0,255,204,0.4)]"
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10'}`}
            title="Voice Input"
          >
            {isListening ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isAgentRunning}
            placeholder={isAgentRunning ? "Agent is processing..." : "Tell me what to do..."}
            className="flex-1 bg-transparent border-none outline-none text-neon-cyan caret-neon-cyan placeholder-neon-cyan/30 text-sm px-2"
          />

          <button
            type="submit"
            disabled={!input.trim() || isAgentRunning}
            className="p-3 rounded-full text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAgentRunning ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};
