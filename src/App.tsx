import React, { useState } from 'react';
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
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';

export default function App() {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const { isMinimized, activeTab } = useStore();

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
        <PanelGroup orientation="vertical" className="flex-1 min-h-0">
          <Panel defaultSize={70} minSize={30} className="flex">
            <PanelGroup orientation="horizontal">
              <Panel defaultSize={25} minSize={15} className="flex">
                <SystemMonitor onOpenSetup={() => setIsSetupOpen(true)} />
              </Panel>
              
              <PanelResizeHandle className="w-2 relative flex items-center justify-center group cursor-col-resize mx-1">
                <div className="w-0.5 h-8 bg-neon-cyan/20 group-hover:bg-neon-cyan/80 transition-colors rounded-full" />
              </PanelResizeHandle>
              
              <Panel minSize={30} className="flex">
                <Terminal />
              </Panel>
            </PanelGroup>
          </Panel>
          
          <PanelResizeHandle className="h-2 relative flex items-center justify-center group cursor-row-resize my-1">
            <div className="h-0.5 w-8 bg-neon-cyan/20 group-hover:bg-neon-cyan/80 transition-colors rounded-full" />
          </PanelResizeHandle>
          
          <Panel defaultSize={30} minSize={15} className="flex">
            <BottomPanels />
          </Panel>
        </PanelGroup>
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
