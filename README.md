# 🦀 OxideVim

<div align="center">

![OxideVim](https://img.shields.io/badge/OxideVim-Rust%20IDE-orange?style=for-the-badge&logo=rust)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-purple?style=for-the-badge&logo=vite)

**A specialized Rust development environment combining Vim-style modal editing with an interactive dependency graph visualization.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Keybindings](#-keybindings) • [Commands](#-commands) • [Architecture](#-architecture)

</div>

---

## 📖 Overview

OxideVim is a conceptual Rust development environment that merges the modal editing efficiency of Vim with a spatial, node-based file navigation system. Built with React and TypeScript, it provides a modern web-based IDE experience with Vim keybindings and a unique D3.js-powered dependency graph for visualizing project structure.

## ✨ Features

### 🎯 Modal Editing
Full Vim emulation with support for multiple editing modes:
- **Normal Mode** - Navigation and command execution
- **Insert Mode** - Text editing and insertion
- **Visual Mode** - Text selection
- **Command Mode** - Ex commands and custom commands

### 🗺️ Spatial Navigation
- Interactive **Dependency Graph** powered by D3.js
- Visual representation of file relationships
- Click-to-navigate between files
- Toggle with `TAB` key in Normal mode

### 🔧 Rust Toolchain Simulation
Built-in simulated Cargo commands:
- `:cargo run` - Run the current project
- `:cargo build` - Compile dependencies
- `:cargo check` - Fast syntax checking

### 🎨 Syntax Highlighting
- Native Rust syntax highlighting
- Support for keywords, types, strings, comments, and more

### 🤖 AI Integration (Optional)
- Google Gemini AI integration for code assistance
- Context-aware suggestions

### 🖥️ Cross-Platform Support
- **Linux** - Full support with LF line endings
- **Windows** - Full support with CRLF line endings and proper path separators
- **macOS** - Full support with LF line endings
- Automatic platform detection with visual indicator in status bar
- Cross-platform path handling utilities
- `.gitattributes` for consistent line endings in Git
- `.editorconfig` for consistent coding style across editors

---

## 🚀 Installation

### Prerequisites

Before installing OxideVim, ensure you have the following installed:

| Software | Version | Linux (Debian/Ubuntu) | Arch Linux | Windows |
|----------|---------|----------------------|------------|---------|
| **Node.js** | ≥ 18.x | `sudo apt install nodejs` or via [nvm](https://github.com/nvm-sh/nvm) | `sudo pacman -S nodejs npm` | [Download](https://nodejs.org/) or `winget install OpenJS.NodeJS` |
| **npm** | ≥ 9.x | Included with Node.js | Included with nodejs package | Included with Node.js |
| **Git** | Latest | `sudo apt install git` | `sudo pacman -S git` | `winget install Git.Git` |

### Step-by-Step Installation

#### 🐧 Linux (Debian/Ubuntu)

```bash
# 1. Navigate to the project directory
cd /path/to/oxidevim

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

**Or if cloning from a Git repository:**
```bash
# Replace with your actual repository URL
git clone <your-repository-url>
cd oxidevim
npm install
npm run dev
```

#### 🐧 Arch Linux

```bash
# 1. Install Node.js and npm
sudo pacman -S nodejs npm

# 2. (Optional) Install Git if not already installed
sudo pacman -S git

# 3. Navigate to the project directory
cd /path/to/oxidevim

# 4. Install dependencies
npm install

# 5. Start the development server
npm run dev
```

**Using yay (AUR helper) for latest Node.js:**
```bash
# Install nvm from AUR for managing Node.js versions
yay -S nvm

# Load nvm
source /usr/share/nvm/init-nvm.sh

# Install latest LTS Node.js
nvm install --lts
nvm use --lts

# Then install and run the project
cd /path/to/oxidevim
npm install
npm run dev
```

#### 🪟 Windows

**Using Command Prompt:**
```cmd
REM 1. Navigate to the project directory
cd C:\path\to\oxidevim

REM 2. Install dependencies
npm install

REM 3. Start the development server
npm run dev
```

**Using PowerShell:**
```powershell
# 1. Navigate to the project directory
cd C:\path\to\oxidevim

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

**Or if cloning from a Git repository:**
```cmd
REM Replace with your actual repository URL
git clone <your-repository-url>
cd oxidevim
npm install
npm run dev
```

### Verify Installation

After running `npm run dev`, you should see:

```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and navigate to `http://localhost:5173/`

---

## 🎮 Usage

### Getting Started

1. **Open the application** in your browser at `http://localhost:5173/`
2. **Navigate files** using the Graph View (press `TAB` to toggle)
3. **Edit code** using standard Vim keybindings
4. **Save buffers** with `:w` command
5. **Run Rust code** with `:cargo run`

### Interface Overview

```
┌─────────────────────────────────────────────────────────────┐
│  🔥 OxideVim          [File: main.rs]           Platform   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    fn main() {                                             │
│        println!("Welcome to OxideVim!");                   │
│    }                                                        │
│                                                             │
│                    ┌─────────────────┐                     │
│   [Graph View]     │   Dependency    │                     │
│      TAB to        │     Graph       │                     │
│      toggle        │                 │                     │
│                    └─────────────────┘                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  -- NORMAL --                              Ln 1, Col 1      │
└─────────────────────────────────────────────────────────────┘
```

---

## ⌨️ Keybindings

### Mode Switching

| Key | Action | From Mode |
|-----|--------|-----------|
| `i` | Enter Insert mode | Normal |
| `a` | Enter Insert mode (after cursor) | Normal |
| `o` | Insert new line below | Normal |
| `O` | Insert new line above | Normal |
| `v` | Enter Visual mode | Normal |
| `Escape` | Return to Normal mode | Any |
| `:` | Enter Command mode | Normal |

### Navigation (Normal Mode)

| Key | Action |
|-----|--------|
| `h` | Move cursor left |
| `j` | Move cursor down |
| `k` | Move cursor up |
| `l` | Move cursor right |
| `w` | Jump to next word |
| `b` | Jump to previous word |
| `0` | Jump to beginning of line |
| `$` | Jump to end of line |
| `gg` | Jump to beginning of file |
| `G` | Jump to end of file |
| `TAB` | Toggle dependency graph |

### Editing (Insert Mode)

| Key | Action |
|-----|--------|
| `TAB` | Insert 4 spaces (Rust indentation) |
| `Escape` | Exit Insert mode |

### Special Keys

| Key | Action | Mode |
|-----|--------|------|
| `TAB` | Toggle Graph View | Normal |
| `Enter` | Execute command | Command |
| `Backspace` | Delete character / Exit command mode | Command |

---

## 💻 Commands

Enter Command mode by pressing `:` in Normal mode.

### File Operations

| Command | Description |
|---------|-------------|
| `:w` | Save current buffer (simulated) |
| `:q` | Quit (shows warning in main buffer) |
| `:wq` | Save and quit |

### Cargo Commands

| Command | Description |
|---------|-------------|
| `:cargo run` | Compile and run the project |
| `:cargo build` | Compile the project |
| `:cargo check` | Quick syntax check |

### View Commands

| Command | Description |
|---------|-------------|
| `:graph` | Toggle dependency graph view |

---

## 🏗️ Architecture

### Project Structure

```
oxidevim/
├── 📄 index.html          # Entry HTML file
├── 📄 index.tsx           # React entry point
├── 📄 App.tsx             # Main application component
├── 📄 types.ts            # TypeScript type definitions
├── 📄 constants.ts        # Initial file data and configuration
├── 📄 vite.config.ts      # Vite configuration
├── 📄 tsconfig.json       # TypeScript configuration
├── 📄 package.json        # Dependencies and scripts
├── 📄 .gitattributes      # Git line ending configuration
├── 📄 .editorconfig       # Editor configuration
│
├── 📁 components/
│   ├── 📄 VimEditor.tsx   # Vim-style editor component
│   ├── 📄 GraphView.tsx   # D3.js dependency graph
│   └── 📄 StatusBar.tsx   # Status bar component
│
├── 📁 services/
│   └── 📄 geminiService.ts # Google Gemini AI integration
│
└── 📁 utils/
    └── 📄 platform.ts      # Cross-platform utilities
```

### Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **TypeScript 5.8** | Type-safe JavaScript |
| **Vite 6** | Build tool and dev server |
| **D3.js 7** | Dependency graph visualization |
| **Lucide React** | Icon library |
| **Google GenAI** | AI-powered code assistance |

### Component Overview

```
┌─────────────────────────────────────────────┐
│                   App.tsx                    │
│  ┌─────────────────────────────────────┐    │
│  │            State Management          │    │
│  │  - activeFileId                      │    │
│  │  - files[]                           │    │
│  │  - editorMode                        │    │
│  │  - platformInfo                      │    │
│  └─────────────────────────────────────┘    │
│                     │                        │
│      ┌──────────────┼──────────────┐        │
│      ▼              ▼              ▼        │
│  ┌────────┐  ┌───────────┐  ┌──────────┐   │
│  │VimEditor│  │ GraphView │  │ StatusBar│   │
│  └────────┘  └───────────┘  └──────────┘   │
└─────────────────────────────────────────────┘
```

---

## 🔧 Configuration

### Environment Variables

For AI features, create a `.env` file in the project root:

**Linux/macOS:**
```bash
echo "API_KEY=your_gemini_api_key_here" > .env
```

**Windows (PowerShell):**
```powershell
"API_KEY=your_gemini_api_key_here" | Out-File -Encoding utf8 .env
```

**Windows (CMD):**
```cmd
echo API_KEY=your_gemini_api_key_here > .env
```

### Build Configuration

The `vite.config.ts` file can be customized for your needs:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,        // Change dev server port
    host: true,        // Expose to network
  },
  build: {
    outDir: 'dist',    // Output directory
  },
});
```

---

## 📦 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Start development server with HMR |
| **build** | `npm run build` | Build for production |
| **preview** | `npm run preview` | Preview production build locally |

### Production Build

**Linux:**
```bash
# Build for production
npm run build

# Preview the build
npm run preview

# Or serve with any static server
npx serve dist
```

**Windows:**
```cmd
REM Build for production
npm run build

REM Preview the build
npm run preview

REM Or serve with any static server
npx serve dist
```

---

## 🐛 Troubleshooting

### Common Issues

#### Node.js Version Error

**Problem:** `npm install` fails with engine errors

**Solution:**
```bash
# Check your Node version
node --version

# If below v18, upgrade Node.js
# Linux (using nvm):
nvm install 18
nvm use 18

# Windows (using winget):
winget upgrade OpenJS.NodeJS
```

#### Port Already in Use

**Problem:** `Error: Port 5173 is already in use`

**Solution:**
```bash
# Linux - Find and kill process
lsof -i :5173
kill -9 <PID>

# Windows - Find and kill process
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

#### Permission Denied (Linux)

**Problem:** `EACCES: permission denied`

**Solution:**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

#### Line Ending Issues

**Problem:** Git shows all files as modified

**Solution:**
```bash
# Configure Git for your platform
# Linux:
git config core.autocrlf input

# Windows:
git config core.autocrlf true
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository (if hosted on GitHub/GitLab)
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

**Note:** If you downloaded this project as a ZIP file, you can initialize a new Git repository:
```bash
git init
git add .
git commit -m "Initial commit"
```

### Development Guidelines

- Follow TypeScript best practices
- Use functional React components with hooks
- Maintain cross-platform compatibility
- Add appropriate comments for complex logic
- Test on both Linux and Windows when possible

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Vim](https://www.vim.org/) - The legendary text editor that inspired this project
- [D3.js](https://d3js.org/) - Powerful visualization library
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Lucide](https://lucide.dev/) - Beautiful icons

---

<div align="center">

**Made with ❤️ and 🦀**

</div>
