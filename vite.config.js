import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [preact()],
  root: 'src/popup',
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Chrome extension compatibility
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Use a format that works better in extension context
        format: 'iife',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  // Remove crossorigin attributes from output
  experimental: {
    renderBuiltUrl(filename) {
      return './' + filename;
    }
  }
});
