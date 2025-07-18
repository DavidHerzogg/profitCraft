import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // passt für lokale Nutzung oder statisches Hosting
  build: {
    outDir: 'dist',
    sourcemap: false, // kein Quellcode im Output
    minify: 'esbuild', // schneller und kleiner Build
    chunkSizeWarningLimit: 1000,
  },
});
