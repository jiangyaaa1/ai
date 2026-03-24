import React from 'react';
import { MinusSquare } from 'lucide-react';
import { useStore } from '../store';

export const TopTabs = () => {
  const { setMinimized, activeTab, setActiveTab } = useStore();

  const tabs = [
    { id: 'MAIN', label: 'MAIN - bash' },
    { id: 'SYS_MONITOR', label: 'SYS_MONITOR' },
    { id: 'QUICK_DIRECTIVES', label: 'QUICK_DIRECTIVES' },
    { id: 'FILE_SYSTEM_MAP', label: 'FILE_SYSTEM_MAP' }
  ];

  return (
    <div className="flex gap-2 h-8 mb-2 relative">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`sci-fi-panel flex-1 flex items-center justify-center text-sm font-bold transition-colors relative ${
            activeTab === tab.id
              ? 'sci-fi-text bg-neon-cyan/20 text-neon-cyan'
              : 'text-neon-cyan/50 hover:text-neon-cyan/80 hover:bg-neon-cyan/10'
          }`}
        >
          {tab.label}
          {index === tabs.length - 1 && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setMinimized(true);
              }} 
              className="absolute right-2 text-neon-cyan hover:text-white transition-colors cursor-pointer"
              title="Minimize to Pet"
            >
              <MinusSquare size={16} />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
