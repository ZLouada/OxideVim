import { GraphData } from './types';

export const INITIAL_FILES: GraphData = {
  nodes: [
    { 
      id: 'README.md', 
      name: 'README.md', 
      group: 3,
      content: `# OxideVim

OxideVim is a conceptual Rust development environment that merges the modal editing efficiency of Vim with a spatial, node-based file system.

## Features

- **Modal Editing**: Full Vim emulation (Normal, Insert, Visual, Command modes).
- **Spatial Navigation**: Press 'TAB' to toggle the dependency graph.
- **Rust Toolchain Simulation**:
    - ':cargo run' - Run the current project
    - ':cargo build' - Compile dependencies
    - ':cargo check' - Fast syntax checking
- **Syntax Highlighting**: Native Rust syntax highlighting.

## Getting Started

1. Navigate files using the Graph View (TAB).
2. Edit code in standard Vim modes.
3. Use ':w' to save buffers (simulated).
` 
    },
    { 
      id: 'main.rs', 
      name: 'main.rs', 
      group: 1,
      content: `fn main() {
    println!("Welcome to OxideVim!");
    
    let config = Config::new();
    println!("Mode: {:?}", config.mode);

    // Try typing ':cargo run' in command mode!
    // Or press 'TAB' to see the dependency graph.
}` 
    },
    { 
      id: 'lib.rs', 
      name: 'lib.rs', 
      group: 2,
      content: `pub struct Config {
    pub mode: String,
    pub version: u32,
}

impl Config {
    pub fn new() -> Self {
        Config {
            mode: String::from("Vim"),
            version: 1,
        }
    }
}

pub fn calculate_graph() {
    // TODO: Implement force-directed layout
}` 
    },
    { 
      id: 'utils.rs', 
      name: 'utils.rs', 
      group: 2,
      content: `pub mod graph {
    pub fn connect_nodes(a: &str, b: &str) {
        println!("Connecting {} to {}", a, b);
    }
}

pub mod editor {
    pub fn insert_char(c: char) {
        // Handle insert mode
    }
}` 
    },
    { 
      id: 'Cargo.toml', 
      name: 'Cargo.toml', 
      group: 3,
      content: `[package]
name = "oxide_vim"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }` 
    },
    { 
      id: 'types.rs', 
      name: 'types.rs', 
      group: 1,
      content: `#[derive(Debug)]
pub enum EditorMode {
    Normal,
    Insert,
    Visual,
    Command,
}

pub struct Node {
    pub id: String,
    pub val: i32,
}` 
    }
  ],
  links: [
    { source: 'README.md', target: 'main.rs', value: 1 },
    { source: 'main.rs', target: 'lib.rs', value: 1 },
    { source: 'main.rs', target: 'Cargo.toml', value: 1 },
    { source: 'lib.rs', target: 'utils.rs', value: 2 },
    { source: 'lib.rs', target: 'types.rs', value: 2 },
  ]
};

// Rust Theme Colors (Orange/Red/Gray based)
export const THEME_COLORS = [
  '#ef4723', // Rust Logo Orange
  '#dea584', // Light Rust
  '#a3b68a', // Sage (Strings)
  '#b48ead', // Purple (Keywords)
];
