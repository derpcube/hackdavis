import { defineConfig } from 'vite';

export default defineConfig({
  base: '', // GitHub Pages needs this to serve assets correctly
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
