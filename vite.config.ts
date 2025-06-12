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
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'react-toastify',
      'axios',
      'date-fns',
      'lodash',
      'react-hook-form',
      'yup',
      'react-beautiful-dnd',
      'react-datepicker',
      'react-dropzone',
      'react-markdown',
      'react-syntax-highlighter',
      'recharts',
      'socket.io-client',
      'zustand'
    ],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled'
          ],
        },
      },
    },
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