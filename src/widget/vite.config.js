import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';
import { compressToEncodedURIComponent } from 'lz-string';

import { version } from '../../package.json';

const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;

if (!orgId) {
  throw new Error('Missing env NEXT_PUBLIC_PLANNER_ORG_ID');
}
const compressedOrgId = compressToEncodedURIComponent(orgId);

const widgetVersion = process.env.WIDGET_VERSION || version;
const ROOT_DIR = resolve(__dirname, '../..');
const CSS_FILE_NAME = 'planner-web.css';
// `token(` as a function call, not as the end of another name like `my-token(`.
const UNPROCESSED_TOKEN = /(^|[^\w-])token\(/;

/**
 * Runs the project's PostCSS config once more on the bundled CSS.
 *
 * The widget uses `composes` to reuse CSS modules from the web app. Those files
 * are loaded by the CSS modules handling and skip the PostCSS plugins, so e.g.
 * `token()` from them is still unprocessed in the bundle.
 */
function bundledCssPostcssPass() {
  return {
    name: 'widget-bundled-css-postcss-pass',
    apply: 'build',
    // The CSS is only added to the bundle by Vite's own (later) plugins.
    enforce: 'post',
    async generateBundle(_, bundle) {
      const css = bundle[CSS_FILE_NAME];
      if (css?.type !== 'asset') {
        this.error(`Missing ${CSS_FILE_NAME} in the widget bundle`);
      }

      const source =
        typeof css.source === 'string'
          ? css.source
          : new TextDecoder().decode(css.source);

      const { plugins, options } = await postcssrc({}, ROOT_DIR);
      const result = await postcss(plugins).process(source, {
        ...options,
        // A path inside the project, so plugins like autoprefixer find the
        // same browserslist config as in the first pass.
        from: resolve(__dirname, CSS_FILE_NAME),
      });

      for (const warning of result.warnings()) {
        this.warn(warning.toString());
      }
      if (UNPROCESSED_TOKEN.test(result.css)) {
        this.error(`Unprocessed token() in ${CSS_FILE_NAME}`);
      }
      css.source = result.css;
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      /**
       * We should maybe only load the light theme instead of the full theme.css
       * My reasoning is that we set data-theme="light" in the HTML, so we might only need the light theme CSS.
       * '@atb/theme/theme.css': `@atb-as/theme/lib/generated/themes/${orgId}-theme/light.css`,
       */
      '@atb/theme/theme.css': `@atb-as/theme/lib/generated/themes/${orgId}-theme/theme.css`,
      '@atb/theme/typography.css': '@atb-as/theme/lib/generated/typography.css',
      '@atb/theme/typography.module.css':
        '@atb-as/theme/lib/generated/typography.module.css',
    },
  },
  plugins: [
    dts({
      include: [
        resolve(__dirname, 'widget.ts'),
        resolve(__dirname, '../types/additional.d.ts'),
        resolve(__dirname, '../types/svg.d.ts'),
      ],
      rollupTypes: true,
    }),
    bundledCssPostcssPass(),
  ],
  define: {
    'process.env': {
      MODULE_VERSION: widgetVersion,
      COMPRESSED_ORG: compressedOrgId,
      ORG_ID: orgId,
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
      `../../public/widget/${compressedOrgId}/${widgetVersion}`,
    ),
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: CSS_FILE_NAME,
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
