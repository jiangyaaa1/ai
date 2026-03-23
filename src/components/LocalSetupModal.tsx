import React, { useState } from 'react';
import { X, Copy, Check, TerminalSquare, AlertTriangle } from 'lucide-react';
import { connectLocalAgent, disconnectLocalAgent } from '../lib/agent';
import { useStore } from '../store';

const PYTHON_SCRIPT = `
import asyncio
import websockets
import json
import subprocess
import os

async def handler(websocket):
    print(f"[*] Client connected from {websocket.remote_address}")
    try:
        async for message in websocket:
            data = json.loads(message)
            if data.get('action') == 'execute':
                command = data.get('command')
                print(f"[>] Executing: {command}")
                
                try:
                    # Execute the command
                    result = subprocess.run(
                        command, 
                        shell=True, 
                        capture_output=True, 
                        text=True,
                        cwd=os.getcwd()
                    )
                    
                    output = result.stdout if result.stdout else ""
                    error = result.stderr if result.stderr else ""
                    
                    if not output and not error:
                        output = "Command executed successfully with no output."
                        
                    response = {
                        "id": data.get('id'),
                        "output": output,
                        "error": error
                    }
                except Exception as e:
                    response = {
                        "id": data.get('id'),
                        "error": str(e)
                    }
                    
                await websocket.send(json.dumps(response))
                print(f"[<] Sent response for {data.get('id')}")
    except websockets.exceptions.ConnectionClosed:
        print("[!] Client disconnected.")

async def main():
    print("==================================================")
    print(" OmniAgent Local Execution Server ")
    print(" WARNING: This allows the web app to execute ")
    print(" arbitrary commands on your computer. ")
    print("==================================================")
    print("[*] Starting server on ws://localhost:8765")
    
    # Start the websocket server
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\\n[*] Server stopped.")
`;

export const LocalSetupModal = ({ onClose }: { onClose: () => void }) => {
  const [copied, setCopied] = useState(false);
  const { isLocalConnected } = useStore();
  const [wsUrl, setWsUrl] = useState('ws://localhost:8765');

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    if (isLocalConnected) {
      disconnectLocalAgent();
    } else {
      connectLocalAgent(wsUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <TerminalSquare className="text-emerald-500" /> Local Environment Setup
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-zinc-300 text-sm">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3 text-amber-200/90">
            <AlertTriangle className="shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold mb-1 text-amber-500">Security Warning</p>
              <p>
                Because this is a web application, it cannot directly control your computer due to browser security sandboxes. 
                To give the AI agent access to your local machine, you must run a local WebSocket server. 
                <strong> This script allows the agent to execute arbitrary shell commands on your computer. Only run this if you understand the risks.</strong>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Step 1: Install Dependencies</h3>
            <p>Open your local terminal and install the required Python package:</p>
            <div className="bg-black rounded-lg p-3 font-mono text-emerald-400 border border-zinc-800">
              pip install websockets
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Step 2: Run the Server Script</h3>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Script'}
              </button>
            </div>
            <p>Save the following code as <code>agent_server.py</code> and run it with <code>python agent_server.py</code>:</p>
            <div className="bg-black rounded-lg p-4 font-mono text-xs text-zinc-300 overflow-x-auto border border-zinc-800 max-h-64 overflow-y-auto">
              <pre>{PYTHON_SCRIPT}</pre>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-lg font-medium text-white">Step 3: Connect</h3>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500"
                placeholder="ws://localhost:8765"
              />
              <button 
                onClick={handleConnect}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isLocalConnected 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isLocalConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
