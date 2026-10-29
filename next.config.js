/** @type {import('next').NextConfig} */
const { version } = require('./package.json');

const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;

/** Sites allowed to show /embed pages in an iframe. */
function getEmbedFrameAncestors() {
  const orgData = orgId ? require(`./orgs/${orgId}.json`) : undefined;
  const origins = [
    "'self'",
    ...(orgData?.embed?.allowedOrigins ?? []),
    ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:*'] : []),
  ];
  return `frame-ancestors ${origins.join(' ')}`;
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'standalone',
  env: { PLANNER_WEB_VERSION: version },
  transpilePackages: ['@atb-as/mapbox-shared', '@mrfylke/contact-form'],
  async headers() {
    return [
      {
        source: '/widget/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value:
              process.env.NODE_ENV == 'production'
                ? 'public, max-age=604800, stale-while-revalidate=86400'
                : 'no-cache',
          },
        ],
      },
      {
        source: '/embed/:path+',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: getEmbedFrameAncestors(),
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/.well-known/:path*', destination: '/api/well-known/:path*' },
    ];
  },

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@atb/theme/theme.css': `@atb-as/theme/lib/generated/themes/${orgId}-theme/theme.css`,
      '@atb/theme/typography.css': '@atb-as/theme/lib/generated/typography.css',
      '@atb/theme/typography.module.css':
        '@atb-as/theme/lib/generated/typography.module.css',
    };

    const oneOf = config.module.rules.find(
      (rule) => typeof rule.oneOf === 'object',
    );
    if (oneOf) {
      const moduleCssRules = oneOf.oneOf.filter(
        (rule) => regexEqual(rule.test, /\.module\.css$/),
        // regexEqual(rule.test, /\.module\.(scss|sass)$/)
      );
      for (const moduleCssRule of moduleCssRules) {
        const cssLoader = moduleCssRule.use.find(({ loader }) =>
          loader.includes('css-loader'),
        );
        if (cssLoader) {
          cssLoader.options.modules = {
            ...(typeof cssLoader.options.modules === 'object'
              ? cssLoader.options.modules
              : {}),
            mode: 'local',
          };
        }
      }
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                'cleanupListOfValues',
                'convertStyleToAttrs',
                'removeElementsByAttr',
                'removeRasterImages',
                'removeStyleElement',
                'sortAttrs',
                'removeXMLNS',
                {
                  name: 'removeAttrs',
                  params: {
                    attrs: ['fill'],
                  },
                },
              ],
            },
          },
        },
      ],
    });

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
