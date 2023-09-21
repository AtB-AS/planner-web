/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  test: {
    setupFiles: './src/tests/setup.ts',
    environment: 'happy-dom',
  },
  resolve: {
    alias: {
      '@atb': path.resolve(__dirname, './src'),
    },
  },
});
