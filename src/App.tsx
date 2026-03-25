import React, { useState, useEffect } from 'react';
import { Terminal } from './components/Terminal';
import { SystemMonitor } from './components/SystemMonitor';
import { BottomPanels } from './components/BottomPanels';
import { LocalSetupModal } from './components/LocalSetupModal';
import { TopTabs } from './components/TopTabs';
import { DesktopPet } from './components/DesktopPet';
import { AgentVision } from './components/AgentVision';
import { TokenForge } from './components/TokenForge';
import { BrainCore } from './components/BrainCore';
import { SkillManager } from './components/SkillManager';
import { QuickDirectives } from './components/QuickDirectives';
import { FileSystemMap } from './components/FileSystemMap';
import { useStore } from './store';
import { runAgentLoop } from './lib/agent';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { LayoutPanelLeft, LayoutPanelTop, LayoutGrid } from 'lucide-react';

export default function App() {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const { isMinimized, activeTab, showSysMonitor, showQuickDirectives, showFileSystemMap, togglePanel } = useStore();

  useEffect(() => {
    const eventSource = new EventSource('/api/stream');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'REMOTE_COMMAND' && data.command) {
          console.log('Received remote command:', data.command);
          runAgentLoop(data.command);
        }
      } catch (e) {
        console.error('Error parsing SSE data:', e);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (isMinimized) {
    return (
      <>
        <DesktopPet />
        <AgentVision />
        <TokenForge />
        <BrainCore />
        <SkillManager />
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#040b14] overflow-hidden font-mono text-neon-cyan p-2 gap-2 relative">
      <div className="scanlines"></div>
      <TopTabs />
      
      {activeTab === 'MAIN' && (
        <div className="flex-1 min-h-0 flex flex-col relative">
          {/* Floating Restore Buttons */}
          <div className="absolute top-2 right-2 z-50 flex gap-2">
            {!showSysMonitor && (
              <button 
                onClick={() => togglePanel('sysMonitor')}
                className="p-2 bg-black/80 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors rounded"
                title="Restore System Monitor"
              >
                <LayoutPanelLeft size={16} />
              </button>
            )}
            {!showQuickDirectives && (
              <button 
                onClick={() => togglePanel('quickDirectives')}
                className="p-2 bg-black/80 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors rounded"
                title="Restore Quick Directives"
              >
                <LayoutPanelTop size={16} />
              </button>
            )}
            {!showFileSystemMap && (
              <button 
                onClick={() => togglePanel('fileSystemMap')}
                className="p-2 bg-black/80 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors rounded"
                title="Restore File System Map"
              >
                <LayoutGrid size={16} />
              </button>
            )}
          </div>

          <PanelGroup orientation="vertical" className="flex-1 min-h-0">
            <Panel defaultSize={70} minSize={30} className="flex">
              <PanelGroup orientation="horizontal">
                {showSysMonitor && (
                  <>
                    <Panel defaultSize={25} minSize={15} className="flex relative">
                      <SystemMonitor onOpenSetup={() => setIsSetupOpen(true)} />
                    </Panel>
                    
                    <PanelResizeHandle className="w-2 relative flex items-center justify-center group cursor-col-resize mx-1">
                      <div className="w-0.5 h-8 bg-neon-cyan/20 group-hover:bg-neon-cyan/80 transition-colors rounded-full" />
                    </PanelResizeHandle>
                  </>
                )}
                
                <Panel minSize={30} className="flex">
                  <Terminal />
                </Panel>
              </PanelGroup>
            </Panel>
            
            {(showQuickDirectives || showFileSystemMap) && (
              <>
                <PanelResizeHandle className="h-2 relative flex items-center justify-center group cursor-row-resize my-1">
                  <div className="h-0.5 w-8 bg-neon-cyan/20 group-hover:bg-neon-cyan/80 transition-colors rounded-full" />
                </PanelResizeHandle>
                
                <Panel defaultSize={30} minSize={15} className="flex">
                  <BottomPanels />
                </Panel>
              </>
            )}
          </PanelGroup>
        </div>
      )}

      {activeTab === 'SYS_MONITOR' && (
        <div className="flex-1 min-h-0 flex">
          <SystemMonitor onOpenSetup={() => setIsSetupOpen(true)} />
        </div>
      )}

      {activeTab === 'QUICK_DIRECTIVES' && (
        <div className="flex-1 min-h-0 flex">
          <QuickDirectives />
        </div>
      )}

      {activeTab === 'FILE_SYSTEM_MAP' && (
        <div className="flex-1 min-h-0 flex">
          <FileSystemMap />
        </div>
      )}

      <AgentVision />
      <TokenForge />
      <BrainCore />
      <SkillManager />
      {isSetupOpen && <LocalSetupModal onClose={() => setIsSetupOpen(false)} />}
    </div>
  );
}
