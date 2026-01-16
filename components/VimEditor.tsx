import React, { useEffect, useRef, useState } from 'react';
import { EditorMode } from '../types';

interface VimEditorProps {
  content: string;
  setContent: (content: string) => void;
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  onCommand: (cmd: string) => void;
  onToggleGraph: () => void;
  setCursorStats: (line: number, col: number) => void;
}

const VimEditor: React.FC<VimEditorProps> = ({ 
  content, 
  setContent, 
  mode, 
  setMode, 
  onCommand,
  onToggleGraph,
  setCursorStats
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [commandBuffer, setCommandBuffer] = useState('');
  
  // Sync scroll between textarea and syntax highlighter
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const updateCursorStats = () => {
    if (!textareaRef.current) return;
    const { selectionStart, value } = textareaRef.current;
    const lines = value.substring(0, selectionStart).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    setCursorStats(line, col);
  };

  useEffect(() => {
    if (textareaRef.current) {
      if (mode === EditorMode.INSERT || mode === EditorMode.COMMAND) {
        textareaRef.current.focus();
      } else {
        textareaRef.current.focus();
      }
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== EditorMode.COMMAND) {
      setCommandBuffer('');
    }
  }, [mode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (mode === EditorMode.NORMAL) {
        onToggleGraph();
      } else if (mode === EditorMode.INSERT) {
        // Insert 4 spaces for Rust indentation
        document.execCommand('insertText', false, '    ');
      }
      return;
    }

    if (mode === EditorMode.INSERT) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMode(EditorMode.NORMAL);
      }
      return;
    }

    if (mode === EditorMode.COMMAND) {
      if (e.key === 'Enter') {
        e.preventDefault();
        onCommand(commandBuffer);
        setMode(EditorMode.NORMAL);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setMode(EditorMode.NORMAL);
      } else if (e.key === 'Backspace') {
        if (commandBuffer.length === 0) {
          setMode(EditorMode.NORMAL);
        } else {
          setCommandBuffer(prev => prev.slice(0, -1));
        }
      } else if (e.key.length === 1) {
        e.preventDefault(); 
        setCommandBuffer(prev => prev + e.key);
      }
      return;
    }

    if (mode === EditorMode.NORMAL) {
      e.preventDefault(); 
      switch (e.key) {
        case 'i': setMode(EditorMode.INSERT); break;
        case ':': setMode(EditorMode.COMMAND); break;
        case 'v': setMode(EditorMode.VISUAL); break;
        case 'h': case 'ArrowLeft': moveCursor(-1); break;
        case 'l': case 'ArrowRight': moveCursor(1); break;
        case 'j': case 'ArrowDown': moveLine(1); break;
        case 'k': case 'ArrowUp': moveLine(-1); break;
      }
    }
  };

  const moveCursor = (offset: number) => {
    if (!textareaRef.current) return;
    const newPos = textareaRef.current.selectionStart + offset;
    textareaRef.current.setSelectionRange(newPos, newPos);
    updateCursorStats();
  };

  const moveLine = (direction: number) => {
    if (!textareaRef.current) return;
    const { value, selectionStart } = textareaRef.current;
    const lines = value.split('\n');
    let currentLineIdx = value.substring(0, selectionStart).split('\n').length - 1;
    let currentCol = selectionStart - value.lastIndexOf('\n', selectionStart - 1) - 1;

    const targetLineIdx = currentLineIdx + direction;
    if (targetLineIdx >= 0 && targetLineIdx < lines.length) {
      let newPos = 0;
      for (let i = 0; i < targetLineIdx; i++) {
        newPos += lines[i].length + 1;
      }
      newPos += Math.min(currentCol, lines[targetLineIdx].length);
      textareaRef.current.setSelectionRange(newPos, newPos);
      updateCursorStats();
    }
  };

  // Basic Rust Syntax Highlighter
  const highlightRust = (code: string) => {
    const tokens = [
      { regex: /\/\/.*/g, color: '#6b7280' }, // Comments (Gray)
      { regex: /\b(fn|let|mut|pub|struct|enum|impl|use|mod|match|if|else|return|const|static|trait|type|where|for|while|loop|break|continue)\b/g, color: '#c678dd' }, // Keywords (Purple)
      { regex: /\b(String|u8|u16|u32|u64|i8|i16|i32|i64|f32|f64|bool|char|Vec|Option|Result|Self|Box|Rc|Arc)\b/g, color: '#e5c07b' }, // Types (Gold)
      { regex: /"[^"]*"/g, color: '#98c379' }, // Strings (Green)
      { regex: /'[^']*'/g, color: '#98c379' }, // Chars (Green)
      { regex: /\b\d+\b/g, color: '#d19a66' }, // Numbers (Orange)
      { regex: /\b[A-Z][a-zA-Z0-9_]*\b/g, color: '#e5c07b' }, // Capitalized words (Types/Structs)
      { regex: /([\w_]+)(?=\()/g, color: '#61afef' }, // Functions (Blue)
      { regex: /!/g, color: '#c678dd' }, // Macros bang
    ];

    // Simple tokenizer (Note: This is a basic visual approximation, not a full parser)
    // We split by tokens but to keep it simple in React without dangerous HTML, 
    // we can't easily interleave regex replacements. 
    // Instead, we'll iterate through lines and apply rules.
    
    // BETTER APPROACH: We map specific spans.
    // However, for this text editor, let's process the string into an array of styled spans.
    // This is complex to do perfectly with overlapping regex.
    // Let's use a simpler approach: Split by word boundaries and colorize.
    
    const parts = code.split(/(\s+|[(){}[\]<>,.;:!])/);
    return parts.map((part, index) => {
      let color = '#abb2bf'; // Default text
      
      if (part.startsWith('//')) return <span key={index} style={{color: '#6b7280'}}>{part}</span>;
      if (part.startsWith('"') || part.startsWith("'")) color = '#98c379';
      else if (/^\d+$/.test(part)) color = '#d19a66';
      else if (['fn', 'let', 'mut', 'pub', 'struct', 'enum', 'impl', 'use', 'mod', 'match', 'if', 'else', 'return', 'const', 'static', 'trait', 'type', 'where', 'for', 'while', 'loop', 'break', 'continue'].includes(part)) color = '#c678dd';
      else if (['String', 'u8', 'u16', 'u32', 'u64', 'i8', 'i16', 'i32', 'i64', 'f32', 'f64', 'bool', 'char', 'Vec', 'Option', 'Result', 'Self'].includes(part)) color = '#e5c07b';
      else if (/^[A-Z]/.test(part)) color = '#e5c07b';
      else if (part === '!') color = '#c678dd';
      
      // Context checks (very basic)
      const prev = parts[index - 2]; // account for separator
      if (prev === 'fn' && /^[a-z]/.test(part)) color = '#61afef';

      return <span key={index} style={{color}}>{part}</span>;
    });
  };

  // A more robust rendering for the background layer
  // We need to render line by line for better performance and consistency
  const renderHighlighted = () => {
    return content.split('\n').map((line, i) => (
      <div key={i} className="min-h-[1.5em]">{highlightLine(line)}</div>
    ));
  };

  const highlightLine = (line: string) => {
     if (line.trim().startsWith('//')) {
         return <span style={{color: '#6b7280'}}>{line}</span>;
     }
     // Split by delimiters but keep them
     const tokens = line.split(/([(){}\[\]<>,.;:!=\s"+-])/);
     let inString = false;
     
     return tokens.map((token, idx) => {
         if (token === '"') inString = !inString;
         if (inString) return <span key={idx} style={{color: '#98c379'}}>{token}</span>;
         if (token === '"') return <span key={idx} style={{color: '#98c379'}}>{token}</span>;
         
         if (/^\s+$/.test(token)) return <span key={idx}>{token}</span>;
         
         let color = '#e6e6e6';
         if (['fn','let','mut','pub','struct','enum','impl','use','mod','match','if','else','return','true','false','async','await'].includes(token)) color = '#ef4723'; // Rust Orange
         else if (['String','u32','i32','Vec','Option','Result','Self'].includes(token)) color = '#e5c07b'; // Yellow
         else if (/^[A-Z]/.test(token)) color = '#e5c07b'; // Types
         else if (token === 'println' || token === 'vec') color = '#61afef'; // Macros/Funcs
         else if (/^\d+$/.test(token)) color = '#d19a66'; // Numbers
         else if (token.startsWith("'")) color = '#98c379'; // Chars

         return <span key={idx} style={{color}}>{token}</span>;
     });
  };

  return (
    <div className="relative w-full h-full font-mono text-sm leading-relaxed">
      {/* Syntax Highlighting Layer */}
      <pre 
        ref={preRef}
        className="absolute inset-0 p-4 m-0 overflow-hidden pointer-events-none z-0 whitespace-pre"
        style={{ fontFamily: 'JetBrains Mono', fontSize: '14px', lineHeight: '1.6' }}
      >
        {renderHighlighted()}
      </pre>

      {/* Editor Layer */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
           if (mode === EditorMode.INSERT) {
               setContent(e.target.value);
               updateCursorStats();
           }
        }}
        onKeyDown={handleKeyDown}
        onClick={updateCursorStats}
        onScroll={handleScroll}
        className={`
            absolute inset-0 z-10 w-full h-full p-4 bg-transparent resize-none outline-none 
            text-transparent caret-white whitespace-pre
            ${mode === EditorMode.NORMAL ? 'cursor-block' : 'cursor-text'}
        `}
        style={{ fontFamily: 'JetBrains Mono', fontSize: '14px', lineHeight: '1.6' }}
        spellCheck={false}
      />

      {/* Command Line Overlay */}
      {(mode === EditorMode.COMMAND || commandBuffer.length > 0) && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#0f1117] border-t border-gray-700 text-gray-200 px-2 py-1 flex items-center z-50">
          <span className="text-[#ef4723] font-bold mr-2">:</span>
          <span className="flex-1 outline-none bg-transparent">{commandBuffer}</span>
        </div>
      )}
    </div>
  );
};

export default VimEditor;
