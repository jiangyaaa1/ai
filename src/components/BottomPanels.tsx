import React, { useState, useEffect } from 'react';
import { Folder, FileText, Terminal as TerminalIcon, Shield, Cpu, Search, Code } from 'lucide-react';
import { useStore } from '../store';
import { runAgentLoop } from '../lib/agent';

const FOLDER_ITEMS = [
  { name: 'bin', type: 'folder' },
  { name: 'boot', type: 'folder' },
  { name: 'dev', type: 'folder' },
  { name: 'etc', type: 'folder' },
  { name: 'home', type: 'folder' },
  { name: 'lib', type: 'folder' },
  { name: 'media', type: 'folder' },
  { name: 'mnt', type: 'folder' },
  { name: 'opt', type: 'folder' },
  { name: 'proc', type: 'folder' },
  { name: 'root', type: 'folder' },
  { name: 'run', type: 'folder' },
  { name: 'sbin', type: 'folder' },
  { name: 'srv', type: 'folder' },
  { name: 'sys', type: 'folder' },
  { name: 'tmp', type: 'folder' },
  { name: 'usr', type: 'folder' },
  { name: 'var', type: 'folder' },
];

const DIRECTIVES = [
  { 
    id: 'SYS_AUDIT', 
    label: 'SYSTEM AUDIT', 
    icon: <Cpu size={14} />,
    prompt: 'Perform a comprehensive system audit. Check OS version, disk usage, memory usage, top 5 CPU consuming processes, and network connections. Summarize the health of the system.' 
  },
  { 
    id: 'SEC_SCAN', 
    label: 'SECURITY SCAN', 
    icon: <Shield size={14} />,
    prompt: 'Check for open ports, active network connections, and firewall status. Identify any suspicious or unknown listening ports.' 
  },
  { 
    id: 'DEV_ENV', 
    label: 'DEV ENV CHECK', 
    icon: <Code size={14} />,
    prompt: 'Check for installed development tools (git, node, python, docker, etc.) and their versions. Report what is missing for a standard modern web dev environment.' 
  },
  { 
    id: 'FIND_JUNK', 
    label: 'FIND JUNK FILES', 
    icon: <Search size={14} />,
    prompt: 'Find temporary files, cache, and large files (>500MB) taking up space in the user directory. Report them to me and ask if I want to delete them.' 
  },
];

const KEYBOARD_ROWS = [
  ['ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACKSPACE'],
  ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'],
  ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT'],
  ['CTRL', 'WIN', 'ALT', 'SPACE', 'ALT', 'FN', 'CTRL']
];

export const BottomPanels = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const { isAgentRunning } = useStore();

  // Fake keyboard typing animation for effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActiveKey(e.key.toUpperCase());
      setTimeout(() => setActiveKey(null), 100);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDirective = (prompt: string) => {
    if (!isAgentRunning) {
      runAgentLoop(prompt);
    }
  };

  return (
    <div className="flex gap-2 w-full h-full">
      {/* Quick Directives (Macros) */}
      <div className="sci-fi-panel flex-1 p-3 flex flex-col">
        <div className="text-xs font-bold border-b border-neon-cyan/30 pb-2 mb-2 flex items-center gap-2">
          <TerminalIcon size={14} /> QUICK_DIRECTIVES
        </div>
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
          {DIRECTIVES.map((dir) => (
            <button
              key={dir.id}
              onClick={() => handleDirective(dir.prompt)}
              disabled={isAgentRunning}
              className="flex items-center gap-2 w-full text-left p-2 border border-neon-cyan/30 hover:bg-neon-cyan hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="text-neon-cyan group-hover:text-black transition-colors">{dir.icon}</span>
              <span className="text-[10px] font-bold tracking-wider">{dir.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* File Explorer */}
      <div className="sci-fi-panel flex-1 p-2 overflow-y-auto hidden sm:block">
        <div className="text-xs font-bold border-b border-neon-cyan/30 pb-2 mb-2 pl-2">
          FILE_SYSTEM_MAP
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {FOLDER_ITEMS.map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-2 hover:bg-neon-cyan/20 cursor-pointer border border-transparent hover:border-neon-cyan/50 transition-colors group">
              {item.type === 'folder' ? (
                <Folder size={20} className="text-neon-cyan group-hover:text-white" />
              ) : (
                <FileText size={20} className="text-neon-cyan/70 group-hover:text-white" />
              )}
              <span className="text-[9px] mt-1 truncate w-full text-center">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Virtual Keyboard */}
      <div className="sci-fi-panel flex-[1.5] p-2 flex flex-col justify-between hidden lg:flex">
        {KEYBOARD_ROWS.map((row, i) => (
          <div key={i} className="flex gap-1 justify-center">
            {row.map((key) => {
              // Calculate width based on key type
              let widthClass = "w-10";
              if (key === 'SPACE') widthClass = "w-64";
              else if (['BACKSPACE', 'ENTER', 'SHIFT', 'CAPS', 'TAB'].includes(key)) widthClass = "w-16";
              else if (['CTRL', 'WIN', 'ALT', 'FN'].includes(key)) widthClass = "w-12";

              const isActive = activeKey === key || 
                               (activeKey === ' ' && key === 'SPACE') ||
                               (activeKey === 'CONTROL' && key === 'CTRL') ||
                               (activeKey === 'META' && key === 'WIN');

              return (
                <div 
                  key={key} 
                  className={`${widthClass} h-10 border ${isActive ? 'bg-neon-cyan text-black border-neon-cyan' : 'border-neon-cyan/30 bg-neon-cyan/5'} flex items-center justify-center text-[10px] font-bold transition-colors duration-75`}
                >
                  {key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
