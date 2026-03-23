import React, { useState } from 'react';
import { useStore } from '../store';
import { Brain, Trash2, Plus, Database } from 'lucide-react';

export const BrainCore = () => {
  const { isBrainCoreActive, setBrainCoreActive, memories, addMemory, removeMemory } = useStore();
  const [newMemory, setNewMemory] = useState('');

  if (!isBrainCoreActive) return null;

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemory.trim()) {
      addMemory(newMemory.trim());
      setNewMemory('');
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-black/95 border border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] flex flex-col z-50 rounded-md overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between bg-purple-500/20 px-4 py-3 border-b border-purple-500/50">
        <div className="flex items-center gap-2 text-purple-400 text-sm font-bold tracking-widest">
          <Brain size={18} className="animate-pulse" />
          BRAIN_CORE_MEMORY
        </div>
        <button onClick={() => setBrainCoreActive(false)} className="text-purple-400 hover:text-white transition-colors">✕</button>
      </div>
      
      {/* Memory List */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
        {memories.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-purple-500/50 font-mono text-xs text-center">
            <Database size={32} className="mb-2 opacity-50" />
            <p>MEMORY BANK EMPTY</p>
            <p className="mt-1">Feed me knowledge to train me.</p>
          </div>
        ) : (
          memories.map((memory) => (
            <div key={memory.id} className="group flex items-start justify-between gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded hover:border-purple-500/60 transition-colors">
              <div className="flex-1 font-mono text-xs text-purple-200 leading-relaxed">
                {memory.content}
              </div>
              <button 
                onClick={() => removeMemory(memory.id)}
                className="text-purple-500/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                title="Erase Memory"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-purple-500/30 bg-black">
        <form onSubmit={handleAddMemory} className="flex gap-2">
          <input
            type="text"
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            placeholder="Feed new knowledge or rules..."
            className="flex-1 bg-purple-500/10 border border-purple-500/50 text-purple-200 text-xs p-2 outline-none focus:border-purple-400 font-mono placeholder-purple-500/50"
          />
          <button 
            type="submit"
            disabled={!newMemory.trim()}
            className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/50 px-4 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold tracking-wider"
          >
            <Plus size={14} /> FEED
          </button>
        </form>
      </div>
    </div>
  );
};
