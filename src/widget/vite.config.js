import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'widget.ts'),
      name: 'PlannerWeb',
      // the proper extensions will be added
      fileName: 'planner-web',
    },
    outDir: resolve(__dirname, '../../public/widget/'),
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
