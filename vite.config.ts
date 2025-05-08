import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 3001;

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: { 
    port: PORT, 
    host: '0.0.0.0', // Listen on all network interfaces
    strictPort: true,
    hmr: {
      host: 'bastaxcasino.com' // Set this for HMR in development
    },
    allowedHosts: [
      'admin.bastaxcasino.com' // Added to allow this host
    ],
    proxy: {
      // Add proxy rules if needed
    }
  },
  preview: {
    port: PORT,
    host: '0.0.0.0',
    strictPort: true
  }
});