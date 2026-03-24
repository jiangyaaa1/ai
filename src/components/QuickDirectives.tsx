import React from 'react';
import { Terminal as TerminalIcon, Shield, Cpu, Search, Code } from 'lucide-react';
import { useStore } from '../store';
import { runAgentLoop } from '../lib/agent';

const DIRECTIVES = [
  { 
    id: 'SYS_AUDIT', 
    label: 'SYSTEM AUDIT', 
    icon: <Cpu size={18} />,
    prompt: 'Perform a comprehensive system audit. Check OS version, disk usage, memory usage, top 5 CPU consuming processes, and network connections. Summarize the health of the system.' 
  },
  { 
    id: 'SEC_SCAN', 
    label: 'SECURITY SCAN', 
    icon: <Shield size={18} />,
    prompt: 'Check for open ports, active network connections, and firewall status. Identify any suspicious or unknown listening ports.' 
  },
  { 
    id: 'DEV_ENV', 
    label: 'DEV ENV CHECK', 
    icon: <Code size={18} />,
    prompt: 'Check for installed development tools (git, node, python, docker, etc.) and their versions. Report what is missing for a standard modern web dev environment.' 
  },
  { 
    id: 'FIND_JUNK', 
    label: 'FIND JUNK FILES', 
    icon: <Search size={18} />,
    prompt: 'Find temporary files, cache, and large files (>500MB) taking up space in the user directory. Report them to me and ask if I want to delete them.' 
  },
];

export const QuickDirectives = () => {
  const { isAgentRunning } = useStore();

  const handleDirective = (prompt: string) => {
    if (!isAgentRunning) {
      runAgentLoop(prompt);
    }
  };

  return (
    <div className="sci-fi-panel w-full h-full p-6 flex flex-col">
      <div className="text-lg font-bold border-b border-neon-cyan/30 pb-4 mb-6 flex items-center gap-3">
        <TerminalIcon size={24} /> QUICK_DIRECTIVES
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2">
        {DIRECTIVES.map((dir) => (
          <button
            key={dir.id}
            onClick={() => handleDirective(dir.prompt)}
            disabled={isAgentRunning}
            className="flex flex-col items-start gap-3 w-full text-left p-6 border border-neon-cyan/30 hover:bg-neon-cyan hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center gap-3">
              <span className="text-neon-cyan group-hover:text-black transition-colors">{dir.icon}</span>
              <span className="text-sm font-bold tracking-wider">{dir.label}</span>
            </div>
            <p className="text-xs opacity-70 group-hover:opacity-100 mt-2 line-clamp-3">
              {dir.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
