/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  test: {
    // setupFiles: './tests/setup.ts',
    environment: 'happy-dom',
  },
});
