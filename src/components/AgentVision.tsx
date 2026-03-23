import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { Activity, Code, Globe, Terminal, Cpu, Database, Network } from 'lucide-react';

const FAKE_ACTIONS = [
  "Initializing headless browser instance...",
  "Navigating to target URL...",
  "Extracting DOM elements...",
  "Opening VS Code...",
  "Writing Python script...",
  "Compiling assets...",
  "Running unit tests...",
  "Analyzing visual layout...",
  "Adjusting CSS parameters...",
  "Deploying to local sandbox...",
  "Scanning system directories...",
  "Parsing JSON configuration...",
  "Establishing secure WebSocket...",
  "Querying local database...",
  "Optimizing memory allocation...",
  "Bypassing cache...",
  "Injecting payload...",
  "Reading system logs...",
  "Executing shell command...",
  "Formatting output..."
];

export const AgentVision = () => {
  const { isVisionActive, setVisionActive, isAgentRunning } = useStore();
  const [logs, setLogs] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [activeIcon, setActiveIcon] = useState(0);

  useEffect(() => {
    if (!isVisionActive) return;
    
    // Initial boot sequence
    setLogs([
      `[${new Date().toISOString().split('T')[1].slice(0, 8)}] AGENT_VISION initialized.`,
      `[${new Date().toISOString().split('T')[1].slice(0, 8)}] Connecting to OmniAgent core...`,
      `[${new Date().toISOString().split('T')[1].slice(0, 8)}] Connection established. Waiting for tasks...`
    ]);

    const interval = setInterval(() => {
      if (isAgentRunning || Math.random() > 0.7) {
        const action = FAKE_ACTIONS[Math.floor(Math.random() * FAKE_ACTIONS.length)];
        const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
        setLogs(prev => [...prev.slice(-40), `[${timestamp}] ${action}`]);
        setActiveIcon(Math.floor(Math.random() * 4));
      }
    }, 1200);
    
    return () => clearInterval(interval);
  }, [isVisionActive, isAgentRunning]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isVisionActive) return null;

  return (
    <div className="absolute top-4 right-4 w-96 h-[400px] bg-black/90 border border-neon-cyan shadow-[0_0_20px_rgba(0,255,204,0.4)] flex flex-col z-50 rounded-md overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between bg-neon-cyan/20 px-3 py-2 border-b border-neon-cyan/50">
        <div className="flex items-center gap-2 text-neon-cyan text-xs font-bold tracking-widest">
          <Activity size={14} className={isAgentRunning ? "animate-pulse text-red-500" : "text-neon-cyan"} />
          AGENT_VISION_LINK {isAgentRunning ? '[ACTIVE]' : '[IDLE]'}
        </div>
        <button onClick={() => setVisionActive(false)} className="text-neon-cyan hover:text-white transition-colors">✕</button>
      </div>
      
      {/* Logs Area */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-[10px] text-green-400 space-y-1 custom-scrollbar">
        {logs.map((log, i) => (
          <div key={i} className="animate-fade-in opacity-90">{log}</div>
        ))}
        {isAgentRunning && (
          <div className="animate-pulse text-neon-cyan mt-2">_ Processing...</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Visualizer Area */}
      <div className="h-32 border-t border-neon-cyan/30 bg-black/60 p-2 flex gap-2">
        {/* Fake UI showing what the agent is "seeing" */}
        <div className="flex-1 border border-neon-cyan/30 rounded flex flex-col items-center justify-center relative overflow-hidden bg-neon-cyan/5">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,204,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
          {activeIcon === 0 && <Code className="text-neon-cyan/70 animate-pulse" size={32} />}
          {activeIcon === 1 && <Globe className="text-neon-cyan/70 animate-pulse" size={32} />}
          {activeIcon === 2 && <Terminal className="text-neon-cyan/70 animate-pulse" size={32} />}
          {activeIcon === 3 && <Database className="text-neon-cyan/70 animate-pulse" size={32} />}
          <div className="text-[8px] text-neon-cyan/50 mt-2 font-mono tracking-widest z-20">
            {activeIcon === 0 && "EDITOR_VIEW"}
            {activeIcon === 1 && "BROWSER_VIEW"}
            {activeIcon === 2 && "SHELL_VIEW"}
            {activeIcon === 3 && "FS_VIEW"}
          </div>
        </div>
        
        {/* Secondary Stats */}
        <div className="w-24 border border-neon-cyan/30 rounded flex flex-col p-2 gap-2 bg-neon-cyan/5">
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-[8px] text-neon-cyan/70 mb-1">CPU_THROUGHPUT</div>
            <div className="w-full h-1 bg-black rounded overflow-hidden">
              <div className="h-full bg-neon-cyan transition-all duration-300" style={{ width: `${isAgentRunning ? 85 + Math.random() * 15 : 10 + Math.random() * 10}%` }}></div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-[8px] text-neon-cyan/70 mb-1">MEM_ALLOC</div>
            <div className="w-full h-1 bg-black rounded overflow-hidden">
              <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${isAgentRunning ? 60 + Math.random() * 20 : 30 + Math.random() * 5}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
