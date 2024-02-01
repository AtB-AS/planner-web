/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  test: {
    globalSetup: './src/tests/global-setup.ts',
    setupFiles: './src/tests/setup.ts',
    environment: 'happy-dom',
    exclude: ['e2e-tests/**', '**/node_modules/**'],
  },
  resolve: {
    alias: {
      '@atb': path.resolve(__dirname, './src'),
    },
  },
});
