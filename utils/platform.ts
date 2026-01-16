/**
 * Cross-platform utilities for OxideVim
 * Provides consistent behavior across Linux and Windows
 */

export interface PlatformInfo {
  os: 'windows' | 'linux' | 'macos' | 'unknown';
  pathSeparator: string;
  binaryExtension: string;
  lineEnding: 'LF' | 'CRLF';
  homeDir: string;
  isWindows: boolean;
  isLinux: boolean;
  isMacOS: boolean;
}

/**
 * Detects the current operating system
 */
export const detectPlatform = (): PlatformInfo => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();
  
  let os: PlatformInfo['os'] = 'unknown';
  
  if (userAgent.includes('win') || platform.includes('win')) {
    os = 'windows';
  } else if (userAgent.includes('mac') || platform.includes('mac')) {
    os = 'macos';
  } else if (userAgent.includes('linux') || platform.includes('linux')) {
    os = 'linux';
  }

  const isWindows = os === 'windows';
  const isLinux = os === 'linux';
  const isMacOS = os === 'macos';

  return {
    os,
    pathSeparator: isWindows ? '\\' : '/',
    binaryExtension: isWindows ? '.exe' : '',
    lineEnding: isWindows ? 'CRLF' : 'LF',
    homeDir: isWindows ? '%USERPROFILE%' : '~',
    isWindows,
    isLinux,
    isMacOS,
  };
};

/**
 * Normalizes a file path for the current platform
 */
export const normalizePath = (filePath: string, platform?: PlatformInfo): string => {
  const currentPlatform = platform || detectPlatform();
  
  if (currentPlatform.isWindows) {
    // Convert forward slashes to backslashes for Windows
    return filePath.replace(/\//g, '\\');
  } else {
    // Convert backslashes to forward slashes for Unix-like systems
    return filePath.replace(/\\/g, '/');
  }
};

/**
 * Joins path segments using the correct separator for the platform
 */
export const joinPath = (...segments: string[]): string => {
  const platform = detectPlatform();
  return segments
    .filter(segment => segment.length > 0)
    .join(platform.pathSeparator);
};

/**
 * Gets the file name from a path (cross-platform)
 */
export const getFileName = (filePath: string): string => {
  // Handle both separators
  const normalized = filePath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  return parts[parts.length - 1] || '';
};

/**
 * Gets the directory from a path (cross-platform)
 */
export const getDirectory = (filePath: string): string => {
  const platform = detectPlatform();
  const normalized = filePath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  parts.pop();
  const dir = parts.join('/');
  return platform.isWindows ? dir.replace(/\//g, '\\') : dir;
};

/**
 * Normalizes line endings based on platform
 */
export const normalizeLineEndings = (content: string, platform?: PlatformInfo): string => {
  const currentPlatform = platform || detectPlatform();
  
  // First normalize to LF
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  if (currentPlatform.isWindows) {
    // Convert to CRLF for Windows
    return normalized.replace(/\n/g, '\r\n');
  }
  
  return normalized;
};

/**
 * Converts line endings to LF (Unix style) - useful for display
 */
export const toLF = (content: string): string => {
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
};

/**
 * Converts line endings to CRLF (Windows style)
 */
export const toCRLF = (content: string): string => {
  return toLF(content).replace(/\n/g, '\r\n');
};

/**
 * Gets the appropriate command prefix for the platform
 * Useful for simulating terminal commands
 */
export const getCommandPrefix = (): string => {
  const platform = detectPlatform();
  return platform.isWindows ? '' : './';
};

/**
 * Formats a binary path for the current platform
 */
export const formatBinaryPath = (basePath: string, binaryName: string): string => {
  const platform = detectPlatform();
  const extension = platform.binaryExtension;
  return joinPath(basePath, `${binaryName}${extension}`);
};

/**
 * Gets environment variable syntax for the platform
 */
export const getEnvVarSyntax = (varName: string): string => {
  const platform = detectPlatform();
  return platform.isWindows ? `%${varName}%` : `$${varName}`;
};

/**
 * Returns the clear screen command for the platform
 */
export const getClearCommand = (): string => {
  const platform = detectPlatform();
  return platform.isWindows ? 'cls' : 'clear';
};

/**
 * Returns the list directory command for the platform
 */
export const getListCommand = (): string => {
  const platform = detectPlatform();
  return platform.isWindows ? 'dir' : 'ls -la';
};

export default {
  detectPlatform,
  normalizePath,
  joinPath,
  getFileName,
  getDirectory,
  normalizeLineEndings,
  toLF,
  toCRLF,
  getCommandPrefix,
  formatBinaryPath,
  getEnvVarSyntax,
  getClearCommand,
  getListCommand,
};
