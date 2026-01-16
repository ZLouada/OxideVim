import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Cross-platform __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // Use path.resolve for cross-platform compatibility (works on both Linux and Windows)
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Ensure consistent line endings in build output
      esbuild: {
        // Preserve line endings during transformation
        keepNames: true,
      },
      build: {
        // Ensure source maps work on both platforms
        sourcemap: true,
        // Use consistent output directory separator
        outDir: 'dist',
      }
    };
});
