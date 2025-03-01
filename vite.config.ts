import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/SacHack/', // GitHub Pages needs this to serve the correct path
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
