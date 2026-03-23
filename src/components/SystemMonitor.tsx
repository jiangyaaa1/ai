import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Activity, Cpu, HardDrive, Network, Settings, Server } from 'lucide-react';

const Graph = ({ label, value, color = "text-neon-cyan" }: { label: string, value: number, color?: string }) => {
  // Generate fake wave data
  const [points, setPoints] = useState<number[]>(Array(20).fill(50));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        const next = [...prev.slice(1), value + (Math.random() * 20 - 10)];
        return next.map(p => Math.max(0, Math.min(100, p)));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [value]);

  const pathData = points.map((p, i) => `${i * 5},${100 - p}`).join(' L ');

  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className={color}>{Math.round(value)}%</span>
      </div>
      <div className="h-12 border border-neon-cyan/30 relative overflow-hidden bg-neon-cyan/5">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0">
          <path d={`M 0,100 L ${pathData} L 100,100 Z`} fill="currentColor" className={`${color} opacity-20`} />
          <path d={`M 0,${100 - points[0]} L ${pathData}`} fill="none" stroke="currentColor" strokeWidth="2" className={color} />
        </svg>
      </div>
    </div>
  );
};

export const SystemMonitor = ({ onOpenSetup }: { onOpenSetup: () => void }) => {
  const { isLocalConnected, config, updateConfig, isAutoPilot, setAutoPilot, petColor, setPetColor, petType, setPetType, setCustomModelUrl, isVisionActive, setVisionActive, isMiningActive, setMiningActive, isBrainCoreActive, setBrainCoreActive } = useStore();
  const [cpu, setCpu] = useState(32);
  const [ram, setRam] = useState(64);
  const [net, setNet] = useState(12);

  // Fake fluctuating stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Math.max(5, Math.min(95, prev + (Math.random() * 10 - 5))));
      setRam(prev => Math.max(40, Math.min(90, prev + (Math.random() * 4 - 2))));
      setNet(prev => Math.max(1, Math.min(100, prev + (Math.random() * 30 - 15))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-64 sci-fi-panel flex flex-col p-3 overflow-y-auto">
      <div className="text-center border-b border-neon-cyan/30 pb-2 mb-4">
        <h1 className="text-lg font-bold sci-fi-text tracking-widest">SYS_MONITOR</h1>
        <div className="text-[10px] text-neon-cyan/70">OmniAgent Core v1.0.0</div>
      </div>

      <Graph label="CPU_USAGE" value={cpu} />
      <Graph label="MEM_ALLOC" value={ram} />
      <Graph label="NET_TRAFFIC" value={net} />

      <div className="mt-auto pt-4 border-t border-neon-cyan/30 space-y-4">
        {/* Pet Customization */}
        <div className="space-y-2 border border-neon-cyan/30 p-2 bg-neon-cyan/5">
          <div className="text-xs font-bold tracking-wider border-b border-neon-cyan/30 pb-1 mb-2">PET_SETTINGS</div>
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wider">TYPE</span>
            <select 
              value={petType}
              onChange={(e) => setPetType(e.target.value as any)}
              className="bg-black border border-neon-cyan/50 text-neon-cyan text-[10px] p-1 outline-none w-24"
            >
              <option value="custom">Custom 3D (.glb)</option>
              <option value="caier">Cai'er (Q-version)</option>
              <option value="cat">Neko (Cat)</option>
              <option value="slime">Slime</option>
              <option value="ghost">Ghost</option>
            </select>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-neon-cyan/30">
            <span className="text-[10px] tracking-wider">IMPORT 3D</span>
            <label className="cursor-pointer bg-neon-cyan/10 hover:bg-neon-cyan/30 border border-neon-cyan/50 text-neon-cyan text-[8px] px-2 py-1 text-center w-24 transition-colors">
              SELECT .GLB
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

          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] tracking-wider">COLOR</span>
            <input 
              type="color" 
              value={petColor} 
              onChange={(e) => setPetColor(e.target.value)}
              className="w-24 h-5 bg-transparent border-none cursor-pointer"
            />
          </div>
        </div>

        {/* Agent Vision Toggle */}
        <button 
          onClick={() => setVisionActive(!isVisionActive)}
          className={`w-full py-2 text-xs font-bold tracking-widest border transition-all ${isVisionActive ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_10px_rgba(0,255,204,0.8)]' : 'bg-transparent text-neon-cyan border-neon-cyan hover:bg-neon-cyan/20'}`}
        >
          {isVisionActive ? '👁️ VISION: ACTIVE' : '👁️ VISION: OFFLINE'}
        </button>

        {/* Token Forge Toggle */}
        <button 
          onClick={() => setMiningActive(!isMiningActive)}
          className={`w-full py-2 text-xs font-bold tracking-widest border transition-all ${isMiningActive ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 'bg-transparent text-yellow-500 border-yellow-500 hover:bg-yellow-500/20'}`}
        >
          {isMiningActive ? '⚡ FORGE: ACTIVE' : '⚡ FORGE: OFFLINE'}
        </button>

        {/* Brain Core Toggle */}
        <button 
          onClick={() => setBrainCoreActive(!isBrainCoreActive)}
          className={`w-full py-2 text-xs font-bold tracking-widest border transition-all ${isBrainCoreActive ? 'bg-purple-500 text-black border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'bg-transparent text-purple-500 border-purple-500 hover:bg-purple-500/20'}`}
        >
          {isBrainCoreActive ? '🧠 BRAIN: ACTIVE' : '🧠 BRAIN: OFFLINE'}
        </button>

        {/* Auto-Pilot Toggle */}
        <div className="flex items-center justify-between border border-neon-cyan/30 p-2 bg-neon-cyan/5">
          <span className="text-xs font-bold tracking-wider">AUTO_PILOT</span>
          <button 
            onClick={() => setAutoPilot(!isAutoPilot)}
            className={`w-10 h-4 rounded-full relative transition-colors ${isAutoPilot ? 'bg-neon-cyan' : 'bg-transparent border border-neon-cyan/50'}`}
          >
            <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${isAutoPilot ? 'bg-black right-0.5' : 'bg-neon-cyan/50 left-0.5'}`} />
          </button>
        </div>

        {/* Connection Status */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1"><Server size={12}/> LOCAL_LINK</span>
            <span className={isLocalConnected ? "text-green-400 animate-pulse" : "text-red-500"}>
              {isLocalConnected ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
          <button 
            onClick={onOpenSetup}
            className="w-full py-1 border border-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors text-xs uppercase tracking-wider"
          >
            Configure Link
          </button>
        </div>

        {/* Model Config (Simplified for sidebar) */}
        <div>
          <div className="flex items-center gap-1 text-xs mb-2 uppercase">
            <Settings size={12}/> AI_CORE_CFG
          </div>
          <select
            value={config.provider}
            onChange={(e) => {
              const provider = e.target.value as any;
              let defaultModel = config.modelName;
              if (provider === 'deepseek') defaultModel = 'deepseek-chat';
              if (provider === 'qwen') defaultModel = 'qwen-max';
              if (provider === 'zhipu') defaultModel = 'glm-4';
              if (provider === 'moonshot') defaultModel = 'moonshot-v1-8k';
              if (provider === 'gemini') defaultModel = 'gemini-3.1-pro-preview';
              updateConfig({ provider, modelName: defaultModel });
            }}
            className="w-full bg-transparent border border-neon-cyan/50 text-neon-cyan text-xs p-1 mb-2 outline-none"
          >
            <option value="gemini" className="bg-[#040b14]">GEMINI</option>
            <option value="deepseek" className="bg-[#040b14]">DEEPSEEK</option>
            <option value="qwen" className="bg-[#040b14]">QWEN (通义千问)</option>
            <option value="zhipu" className="bg-[#040b14]">ZHIPU (智谱 GLM)</option>
            <option value="moonshot" className="bg-[#040b14]">MOONSHOT (Kimi)</option>
            <option value="ollama" className="bg-[#040b14]">OLLAMA (Local)</option>
            <option value="openai" className="bg-[#040b14]">OPENAI</option>
            <option value="anthropic" className="bg-[#040b14]">ANTHROPIC</option>
          </select>
          <input
            type="text"
            value={config.modelName}
            onChange={(e) => updateConfig({ modelName: e.target.value })}
            placeholder="MODEL_NAME"
            className="w-full bg-transparent border border-neon-cyan/50 text-neon-cyan text-xs p-1 mb-2 outline-none placeholder-neon-cyan/30"
          />
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => updateConfig({ apiKey: e.target.value })}
            placeholder="API_KEY / TOKEN"
            className="w-full bg-transparent border border-neon-cyan/50 text-neon-cyan text-xs p-1 mb-2 outline-none placeholder-neon-cyan/30"
          />
          {['ollama', 'openai', 'anthropic'].includes(config.provider) && (
            <input
              type="text"
              value={config.endpoint || ''}
              onChange={(e) => updateConfig({ endpoint: e.target.value })}
              placeholder="ENDPOINT_URL (Optional)"
              className="w-full bg-transparent border border-neon-cyan/50 text-neon-cyan text-xs p-1 outline-none placeholder-neon-cyan/30"
            />
          )}
        </div>
      </div>
    </div>
  );
};
