/** @type {import('next-sitemap').IConfig} */

function getEnvironmentUrls() {
  const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;
  const org = require(`./orgs/${orgId}.json`);
  return org.urls.sitemapUrls;
}

const environmentUrls = getEnvironmentUrls();
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: environment ? environmentUrls[environment] : environmentUrls['dev'],
  generateIndexSitemap: false,
  sitemapSize: 7000,
  generateRobotsTxt: true,
  robosTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },

  // Adds path as it doesn't support dynamic routes.
  additionalPaths(config) {
    const result = [];
    // @TODO Consider if we should prepopulate this for better SEO for
    // quays.
    result.push({
      loc: '/departures',
      changefreq: 'yearly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    });
    return result;
  },
};
