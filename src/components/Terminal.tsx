import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { runAgentLoop } from '../lib/agent';
import { Terminal as TerminalIcon, Loader2, Mic, MicOff } from 'lucide-react';

export const Terminal = () => {
  const { messages, isAgentRunning, clearMessages } = useStore();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentRunning]);

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
    <div 
      className="flex-1 sci-fi-panel p-4 flex flex-col font-mono text-sm overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex justify-between items-center mb-4 border-b border-neon-cyan/30 pb-2">
        <div className="text-neon-cyan/80 text-xs">
          Welcome to OmniAgent OS v1.0.0 - Local Execution Environment
        </div>
        <button onClick={clearMessages} className="text-[10px] text-neon-cyan/50 hover:text-red-400 uppercase tracking-widest">
          [ CLEAR_LOGS ]
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 scroll-smooth pb-4">
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="text-neon-cyan">
                <span className="text-green-400 font-bold">root@omniagent</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-white"># </span>
                {msg.content}
              </div>
            );
          } else if (msg.role === 'system') {
            return (
              <div key={msg.id} className="text-neon-cyan/70 pl-4 border-l border-neon-cyan/30 my-2 py-1">
                <pre className="whitespace-pre-wrap break-words font-mono text-xs">{msg.content}</pre>
              </div>
            );
          } else {
            return (
              <div key={msg.id} className="text-white pl-4 my-2">
                <span className="text-purple-400 font-bold">[AGENT] </span>
                <span className="whitespace-pre-wrap">{msg.content}</span>
              </div>
            );
          }
        })}

        {isAgentRunning && (
          <div className="text-yellow-400 flex items-center gap-2 pl-4 my-2">
            <Loader2 size={14} className="animate-spin" />
            <span>Agent is processing...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center mt-2 relative">
          <span className="text-green-400 font-bold">root@omniagent</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-white"># </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isAgentRunning}
            placeholder="Type or speak natural language..."
            className="flex-1 bg-transparent border-none outline-none text-neon-cyan ml-2 caret-neon-cyan w-full placeholder-neon-cyan/30"
            autoFocus
          />
          <button
            type="button"
            onClick={toggleListening}
            className={`ml-2 p-1.5 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-neon-cyan/50 hover:text-neon-cyan hover:bg-neon-cyan/10'}`}
            title="Voice Input"
          >
            {isListening ? <Mic size={16} /> : <MicOff size={16} />}
          </button>
        </form>
        <div ref={endRef} />
      </div>
    </div>
  );
};

