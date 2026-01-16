import React from 'react';
import { EditorMode } from '../types';
import { GitBranch, Monitor } from 'lucide-react';

interface StatusBarProps {
  mode: EditorMode;
  fileName: string;
  cursorLine: number;
  cursorCol: number;
  message?: string;
  eol: 'LF' | 'CRLF'; // Line ending format
  platform?: 'windows' | 'linux' | 'macos' | 'unknown'; // Current platform
}

const StatusBar: React.FC<StatusBarProps> = ({ mode, fileName, cursorLine, cursorCol, message, eol, platform }) => {
  const getPlatformIcon = () => {
    switch (platform) {
      case 'windows': return '🪟';
      case 'linux': return '🐧';
      case 'macos': return '🍎';
      default: return '💻';
    }
  };
  const getModeColor = () => {
    switch (mode) {
      case EditorMode.NORMAL: return 'bg-green-600 text-black';
      case EditorMode.INSERT: return 'bg-blue-600 text-black';
      case EditorMode.VISUAL: return 'bg-orange-500 text-black';
      case EditorMode.COMMAND: return 'bg-gray-200 text-black';
      default: return 'bg-gray-700';
    }
  };

  return (
    <div className="flex justify-between items-center text-sm font-mono border-t border-gray-800 bg-[#1a1d26] select-none">
      <div className="flex items-center">
        <div className={`px-3 py-1 font-bold uppercase transition-colors duration-200 ${getModeColor()}`}>
          {mode}
        </div>
        <div className="px-3 py-1 flex items-center space-x-2 text-gray-300">
          <GitBranch size={14} />
          <span>main</span>
        </div>
        <div className="px-3 py-1 text-gray-400 border-l border-gray-700">
          {fileName}
        </div>
        {message && (
          <div className="px-3 py-1 text-yellow-400 border-l border-gray-700 animate-pulse">
            [{message}]
          </div>
        )}
      </div>

      <div className="flex items-center text-gray-400">
        <div className="px-3 py-1 hidden sm:flex items-center space-x-2">
           <span className="text-xs">{getPlatformIcon()}</span>
           <span className="text-xs text-gray-500">{platform}</span>
           <span className="text-xs text-gray-600">|</span>
           <span className="text-xs">utf-8</span>
           <span className="text-xs text-gray-600">|</span>
           <span className="text-xs">{eol}</span>
        </div>
        <div className="px-3 py-1 border-l border-gray-700">
          ln {cursorLine}, col {cursorCol}
        </div>
        <div className="px-3 py-1 border-l border-gray-700 bg-gray-800 text-gray-200">
          Top
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
