import { resolve } from 'path';
import { defineConfig } from 'vite';

const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;

if (!orgId) {
  throw new Error('Missing env NEXT_PUBLIC_PLANNER_ORG_ID');
}

if (!process.env.VITE_WIDGET_BASE_URL) {
  throw new Error('Missing env VITE_WIDGET_BASE_URL');
}

export default defineConfig({
  resolve: {
    alias: {
      '@atb/theme/theme.css': `@atb-as/theme/lib/themes/${orgId}-theme/theme.css`,
      '@atb/theme/theme.module.css': `@atb-as/theme/lib/themes/${orgId}-theme/theme.module.css`,
      '@atb/theme/typography.css': '@atb-as/theme/lib/typography.css',
      '@atb/theme/typography.module.css':
        '@atb-as/theme/lib/typography.module.css',
    },
  },
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
  css: {
    modules: {
      scopeBehaviour: 'local',
      // Make naming stable so we don't have to update HTML all the time.
      generateScopedName: '[name]__[local]',
    },
  },
});
