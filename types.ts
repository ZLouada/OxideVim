export interface FileNode {
  id: string;
  name: string;
  content: string;
  group: number; // For coloring logic
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export interface GraphData {
  nodes: FileNode[];
  links: GraphLink[];
}

export enum EditorMode {
  NORMAL = 'NORMAL',
  INSERT = 'INSERT',
  COMMAND = 'COMMAND',
  VISUAL = 'VISUAL'
}

export interface CommandResponse {
  type: 'success' | 'error' | 'info';
  message: string;
}

// Cross-platform types
export type PlatformOS = 'windows' | 'linux' | 'macos' | 'unknown';
export type LineEnding = 'LF' | 'CRLF';

