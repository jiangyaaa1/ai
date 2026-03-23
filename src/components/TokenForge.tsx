import React, { useEffect } from 'react';
import { useStore } from '../store';
import { Zap } from 'lucide-react';

export const TokenForge = () => {
  const { isMiningActive, tokensMined, tokensConsumed, addMinedTokens } = useStore();

  useEffect(() => {
    if (!isMiningActive) return;
    
    const interval = setInterval(() => {
      // Simulate generating more tokens than consumed
      const mined = Math.floor(Math.random() * 150) + 50; // 50-200
      const consumed = Math.floor(Math.random() * 30) + 10; // 10-40
      addMinedTokens(mined, consumed);
    }, 800);
    
    return () => clearInterval(interval);
  }, [isMiningActive, addMinedTokens]);

  if (!isMiningActive) return null;

  const netProfit = tokensMined - tokensConsumed;

  return (
    <div className="absolute bottom-20 right-4 w-64 bg-black/90 border border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)] rounded-md p-3 z-40 backdrop-blur-md font-mono">
      <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold mb-2 border-b border-yellow-500/30 pb-1">
        <Zap size={14} className="animate-pulse" />
        TOKEN_FORGE [ACTIVE]
      </div>
      
      <div className="space-y-1 text-[10px]">
        <div className="flex justify-between text-red-400">
          <span>CONSUMED:</span>
          <span>{tokensConsumed.toLocaleString()} TKNS</span>
        </div>
        <div className="flex justify-between text-green-400">
          <span>GENERATED:</span>
          <span>{tokensMined.toLocaleString()} TKNS</span>
        </div>
        <div className="flex justify-between text-yellow-400 font-bold pt-1 border-t border-yellow-500/30 mt-1">
          <span>NET PROFIT:</span>
          <span>+{netProfit.toLocaleString()} TKNS</span>
        </div>
      </div>
      
      <div className="mt-2 h-1 w-full bg-black rounded overflow-hidden">
        <div className="h-full bg-yellow-500 animate-pulse" style={{ width: '100%' }}></div>
      </div>
    </div>
  );
};
