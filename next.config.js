/** @type {import('next').NextConfig} */

const orgId = process.env.NEXT_PUBLIC_WEBSHOP_ORG_ID;

const nextConfig = {
  optimizeFonts: false,
  output: 'standalone',

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@atb/theme/theme.css': `@atb-as/theme/lib/themes/${orgId}-theme/theme.css`,
      '@atb/theme/theme.module.css': `@atb-as/theme/lib/themes/${orgId}-theme/theme.module.css`,
      '@atb/theme/typography.css': '@atb-as/theme/lib/typography.css',
      '@atb/theme/typography.module.css':
        '@atb-as/theme/lib/typography.module.css',
    };

    const oneOf = config.module.rules.find(
      (rule) => typeof rule.oneOf === 'object',
    );
    if (oneOf) {
      const moduleCssRule = oneOf.oneOf.find(
        (rule) => regexEqual(rule.test, /\.module\.css$/),
        // regexEqual(rule.test, /\.module\.(scss|sass)$/)
      );
      if (moduleCssRule) {
        const cssLoader = moduleCssRule.use.find(({ loader }) =>
          loader.includes('css-loader'),
        );
        if (cssLoader) {
          cssLoader.options.modules.mode = 'local';
        }
      }
    }

    return config;
  },
};

module.exports = nextConfig;

const regexEqual = (x, y) => {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
};
