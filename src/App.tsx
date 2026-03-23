import React, { useState } from 'react';
import { Terminal } from './components/Terminal';
import { SystemMonitor } from './components/SystemMonitor';
import { BottomPanels } from './components/BottomPanels';
import { LocalSetupModal } from './components/LocalSetupModal';
import { TopTabs } from './components/TopTabs';
import { DesktopPet } from './components/DesktopPet';
import { useStore } from './store';

export default function App() {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const { isMinimized } = useStore();

  if (isMinimized) {
    return <DesktopPet />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#040b14] overflow-hidden font-mono text-neon-cyan p-2 gap-2 relative">
      <div className="scanlines"></div>
      <TopTabs />
      <div className="flex flex-1 gap-2 min-h-0">
        <SystemMonitor onOpenSetup={() => setIsSetupOpen(true)} />
        <Terminal />
      </div>
      <BottomPanels />
      {isSetupOpen && <LocalSetupModal onClose={() => setIsSetupOpen(false)} />}
    </div>
  );
}
