import React from 'react';
import { useStore } from '../store';
import { Settings, Server, Key, Cpu, Terminal as TerminalIcon } from 'lucide-react';

export const Sidebar = ({ onOpenSetup }: { onOpenSetup: () => void }) => {
  const { config, updateConfig, isLocalConnected, systemPrompt, updateSystemPrompt } = useStore();

  return (
    <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full text-zinc-300 p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-8">
        <Cpu className="text-emerald-500" size={24} />
        <h1 className="text-xl font-bold text-white tracking-tight">OmniAgent</h1>
      </div>

      <div className="space-y-6">
        {/* Connection Status */}
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Server size={16} /> Local Connection
            </h2>
            <div className={`w-2 h-2 rounded-full ${isLocalConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`} />
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            {isLocalConnected ? 'Connected to local execution environment.' : 'Disconnected. Agent cannot execute local commands.'}
          </p>
          <button
            onClick={onOpenSetup}
            className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-medium rounded transition-colors"
          >
            Setup Local Environment
          </button>
        </div>

        {/* Model Config */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-3">
            <Settings size={16} /> Model Configuration
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Provider</label>
              <select
                value={config.provider}
                onChange={(e) => updateConfig({ provider: e.target.value as any })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="gemini">Google Gemini</option>
                <option value="ollama">Local Ollama</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Model Name</label>
              <input
                type="text"
                value={config.modelName}
                onChange={(e) => updateConfig({ modelName: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm focus:outline-none focus:border-emerald-500"
                placeholder="e.g., gemini-3.1-pro-preview"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1 flex items-center gap-1">
                <Key size={12} /> API Key / Token
              </label>
              <input
                type="password"
                value={config.apiKey}
                onChange={(e) => updateConfig({ apiKey: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm focus:outline-none focus:border-emerald-500"
                placeholder="Leave blank to use environment default"
              />
            </div>
            
            {config.provider === 'ollama' && (
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Endpoint URL</label>
                <input
                  type="text"
                  value={config.endpoint || ''}
                  onChange={(e) => updateConfig({ endpoint: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="http://localhost:11434"
                />
              </div>
            )}
          </div>
        </div>

        {/* System Prompt */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-3">
            <TerminalIcon size={16} /> System Prompt
          </h2>
          <textarea
            value={systemPrompt}
            onChange={(e) => updateSystemPrompt(e.target.value)}
            className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded p-2 text-xs font-mono focus:outline-none focus:border-emerald-500 resize-none"
            placeholder="Define the agent's behavior..."
          />
        </div>
      </div>
    </div>
  );
};
