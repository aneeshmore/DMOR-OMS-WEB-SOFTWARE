import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Production optimizations
    target: 'esnext',
    minify: 'esbuild', // Use esbuild for faster builds
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries (changes rarely, cache well)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // Ant Design UI library (large, separate chunk)
          'vendor-antd': ['antd'],

          // Chart.js and related (used in reports/dashboard)
          'vendor-charts': ['chart.js', 'react-chartjs-2'],

          // PDF generation libraries (heavy, used in reports)
          'vendor-pdf': ['jspdf', 'jspdf-autotable', 'html-to-image', 'html2canvas'],

          // Drag & Drop libraries (used in production/scheduling)
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],

          // TanStack libraries (table, query, virtual)
          'vendor-tanstack': [
            '@tanstack/react-query',
            '@tanstack/react-table',
            '@tanstack/react-virtual',
          ],

          // Utilities and smaller libraries
          'vendor-utils': ['axios', 'date-fns', 'lucide-react', 'react-hot-toast'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable sourcemaps in production for smaller builds
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@tanstack/react-table',
      'axios',
      'lucide-react',
      'react-hot-toast',
    ],
  },
});
