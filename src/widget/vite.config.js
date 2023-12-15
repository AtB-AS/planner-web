import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { compressToEncodedURIComponent } from 'lz-string';

import { version } from '../../package.json';

const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;

if (!orgId) {
  throw new Error('Missing env NEXT_PUBLIC_PLANNER_ORG_ID');
}
const compressedOrgId = compressToEncodedURIComponent(orgId);

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
  plugins: [
    dts({
      include: [resolve(__dirname, 'widget.ts')],
      rollupTypes: true,
    }),
  ],
  define: {
    'process.env': {
      MODULE_VERSION: version,
      COMPRESSED_ORG: compressedOrgId,
    },
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'widget.ts'),
      name: 'PlannerWeb',
      // the proper extensions will be added
      fileName: `planner-web`,
    },
    outDir: resolve(
      __dirname,
      `../../public/widget/${compressedOrgId}/${version}`,
    ),
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: `planner-web.css`,
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
