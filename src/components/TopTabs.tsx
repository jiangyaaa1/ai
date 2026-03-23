import React from 'react';
import { MinusSquare } from 'lucide-react';
import { useStore } from '../store';

export const TopTabs = () => {
  const { setMinimized } = useStore();

  return (
    <div className="flex gap-2 h-8 mb-2 relative">
      <div className="sci-fi-panel flex-1 flex items-center justify-center text-sm font-bold sci-fi-text bg-neon-cyan/20">
        MAIN - bash
      </div>
      <div className="sci-fi-panel flex-1 flex items-center justify-center text-sm text-neon-cyan/50">
        EMPTY
      </div>
      <div className="sci-fi-panel flex-1 flex items-center justify-center text-sm text-neon-cyan/50">
        EMPTY
      </div>
      <div className="sci-fi-panel flex-1 flex items-center justify-center text-sm text-neon-cyan/50 relative">
        EMPTY
        <button 
          onClick={() => setMinimized(true)} 
          className="absolute right-2 text-neon-cyan hover:text-white transition-colors"
          title="Minimize to Pet"
        >
          <MinusSquare size={16} />
        </button>
      </div>
    </div>
  );
};
