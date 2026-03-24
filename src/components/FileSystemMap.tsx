import React from 'react';
import { Folder, FileText } from 'lucide-react';

const FOLDER_ITEMS = [
  { name: 'bin', type: 'folder', desc: 'Essential command binaries' },
  { name: 'boot', type: 'folder', desc: 'Static files of the boot loader' },
  { name: 'dev', type: 'folder', desc: 'Device files' },
  { name: 'etc', type: 'folder', desc: 'Host-specific system configuration' },
  { name: 'home', type: 'folder', desc: 'User home directories' },
  { name: 'lib', type: 'folder', desc: 'Essential shared libraries and kernel modules' },
  { name: 'media', type: 'folder', desc: 'Mount point for removeable media' },
  { name: 'mnt', type: 'folder', desc: 'Mount point for mounting a filesystem temporarily' },
  { name: 'opt', type: 'folder', desc: 'Add-on application software packages' },
  { name: 'proc', type: 'folder', desc: 'Virtual filesystem documenting kernel and process status' },
  { name: 'root', type: 'folder', desc: 'Home directory for the root user' },
  { name: 'run', type: 'folder', desc: 'Run-time variable data' },
  { name: 'sbin', type: 'folder', desc: 'Essential system binaries' },
  { name: 'srv', type: 'folder', desc: 'Data for services provided by this system' },
  { name: 'sys', type: 'folder', desc: 'Virtual filesystem for system management' },
  { name: 'tmp', type: 'folder', desc: 'Temporary files' },
  { name: 'usr', type: 'folder', desc: 'Secondary hierarchy for read-only user data' },
  { name: 'var', type: 'folder', desc: 'Variable data' },
  { name: 'config.json', type: 'file', desc: 'System configuration file' },
  { name: 'syslog.log', type: 'file', desc: 'System log output' },
  { name: 'readme.txt', type: 'file', desc: 'Documentation' },
];

export const FileSystemMap = () => {
  return (
    <div className="sci-fi-panel w-full h-full p-6 flex flex-col">
      <div className="text-lg font-bold border-b border-neon-cyan/30 pb-4 mb-6 pl-2">
        FILE_SYSTEM_MAP
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {FOLDER_ITEMS.map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 hover:bg-neon-cyan/20 cursor-pointer border border-transparent hover:border-neon-cyan/50 transition-colors group relative">
              {item.type === 'folder' ? (
                <Folder size={48} className="text-neon-cyan group-hover:text-white mb-2" />
              ) : (
                <FileText size={48} className="text-neon-cyan/70 group-hover:text-white mb-2" />
              )}
              <span className="text-xs mt-2 truncate w-full text-center font-bold">{item.name}</span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black border border-neon-cyan/50 text-[10px] text-neon-cyan opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 text-center">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
