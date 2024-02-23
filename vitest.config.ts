/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  // @TODO There is an issue with typing in this version, so we need to cast it to any
  plugins: [react() as any],

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
