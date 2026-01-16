import React, { useState, useEffect, useCallback } from 'react';
import GraphView from './components/GraphView';
import StatusBar from './components/StatusBar';
import VimEditor from './components/VimEditor';
import { INITIAL_FILES } from './constants';
import { EditorMode, FileNode } from './types';
import { Search, Monitor, Cpu, Terminal } from 'lucide-react';
import { detectPlatform, formatBinaryPath, PlatformInfo } from './utils/platform';

const App: React.FC = () => {
  // State
  const [activeFileId, setActiveFileId] = useState<string>(INITIAL_FILES.nodes[0].id);
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES.nodes);
  const [showGraph, setShowGraph] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.NORMAL);
  const [statusMessage, setStatusMessage] = useState('');
  
  // Platform State - Cross-platform compatibility for Linux and Windows
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(detectPlatform());
  
  // Cursor Tracking
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  useEffect(() => {
    // Detect platform on mount for cross-platform support
    const platform = detectPlatform();
    setPlatformInfo(platform);
    
    // Log platform info for debugging
    console.log(`OxideVim running on ${platform.os} (${platform.lineEnding} line endings)`);
  }, []);

  const handleContentChange = (newContent: string) => {
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
  };

  const handleNodeClick = (nodeId: string) => {
    setActiveFileId(nodeId);
    setShowGraph(false);
    setStatusMessage(`Opened ${nodeId}`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    
    if (trimmed === 'w') {
      setStatusMessage(`"${activeFileId}" written`);
    } else if (trimmed === 'q') {
      setStatusMessage('Cannot quit main buffer');
    } else if (trimmed === 'graph') {
        setShowGraph(!showGraph);
    } else if (trimmed.startsWith('cargo run')) {
        setStatusMessage('Compiling ' + activeFileId + '...');
        setTimeout(() => {
            const binaryPath = formatBinaryPath(`target${platformInfo.pathSeparator}debug`, 'oxide_vim');
            setStatusMessage(`Running ${binaryPath}...`);
            setTimeout(() => {
                setStatusMessage('Output: "Welcome to OxideVim!"');
            }, 1000);
        }, 1500);
    } else if (trimmed.startsWith('cargo build')) {
        setStatusMessage('Compiling dependencies...');
        setTimeout(() => {
            setStatusMessage('Finished dev [unoptimized + debuginfo] target(s) in 1.2s');
        }, 2000);
    } else if (trimmed.startsWith('cargo check')) {
        setStatusMessage('Checking oxide_vim v0.1.0...');
        setTimeout(() => {
            setStatusMessage('Finished dev [unoptimized + debuginfo] target(s) in 0.5s');
        }, 1000);
    } else {
      setStatusMessage(`E492: Not an editor command: ${trimmed}`);
    }

    // Clear message after delay if it wasn't a long cargo process
    if (!trimmed.startsWith('cargo')) {
        setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
       // Global shortcut handlers if needed
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-[#e6e6e6] overflow-hidden">
      {/* Top Bar */}
      <div className="h-10 bg-[#0f1117] border-b border-gray-800 flex items-center px-4 justify-between select-none">
        <div className="flex items-center gap-2 text-gray-400">
          <Terminal size={16} className="text-[#ef4723]" />
          <span className="font-bold text-gray-200">OxideVim</span>
          <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-500">Rust Edition</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
           <div className="flex items-center gap-1">
             <Cpu size={14} />
             <span>RLS: Active</span>
           </div>
           <span className="text-gray-600">|</span>
           <span>Press 'i' to edit</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="relative flex-1 flex overflow-hidden">
        
        {/* Editor Area */}
        <div className="flex-1 relative z-10">
           <VimEditor 
             content={activeFile.content}
             setContent={handleContentChange}
             mode={editorMode}
             setMode={setEditorMode}
             onCommand={handleCommand}
             onToggleGraph={() => setShowGraph(!showGraph)}
             setCursorStats={(l, c) => { setCursorLine(l); setCursorCol(c); }}
           />
        </div>

        {/* Graph Overlay */}
        <GraphView 
          data={INITIAL_FILES}
          activeNodeId={activeFileId}
          onNodeClick={handleNodeClick}
          visible={showGraph}
        />
        
      </div>

      {/* Helper Legend */}
      {showGraph && (
         <div className="absolute bottom-12 right-6 z-50 bg-black/80 border border-gray-700 p-4 rounded text-xs text-gray-300 pointer-events-none backdrop-blur-md">
            <h4 className="font-bold mb-2 text-[#ef4723]">Crate Dependency Graph</h4>
            <ul className="space-y-1">
              <li>• Drag nodes to rearrange crates</li>
              <li>• Click node to open source</li>
              <li>• Press <kbd className="bg-gray-700 px-1 rounded">TAB</kbd> to return to code</li>
            </ul>
         </div>
      )}

      {/* Status Bar */}
      <div className="z-20">
        <StatusBar 
          mode={editorMode}
          fileName={activeFileId}
          cursorLine={cursorLine}
          cursorCol={cursorCol}
          message={statusMessage}
          eol={platformInfo.lineEnding}
          platform={platformInfo.os}
        />
      </div>
    </div>
  );
};

export default App;
