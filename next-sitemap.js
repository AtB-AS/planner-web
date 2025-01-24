const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;
const {
  listStopPlaces,
} = require('./scripts/generate-stopplaces/list-stop-places');

function getOrgData() {
  const org = require(`./orgs/${orgId}.json`);
  return {
    sitemapUrls: org.urls.sitemapUrls,
    authPrefix: authIdToPrefix(org.authorityId),
  };
}

const orgData = getOrgData();
const environmentUrls = orgData.sitemapUrls;
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: environment ? environmentUrls[environment] : environmentUrls['dev'],
  generateIndexSitemap: false,
  sitemapSize: 7000,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies:
      environment === 'production'
        ? [{ userAgent: '*', allow: '/' }]
        : [{ userAgent: '*', disallow: '/' }],
  },

  // Adds path as it doesn't support dynamic routes.
  async additionalPaths(config) {
    const data = await listStopPlaces(orgData.authPrefix);

    const result = [];
    // @TODO Consider if we should prepopulate this for better SEO for
    // quays.
    result.push({
      loc: '/departures',
      changefreq: 'yearly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    });

    for (const id of data) {
      result.push({
        loc: `/departures/${encodeURIComponent(id)}`,
        changefreq: 'always',
        priority: 0.3,
      });
    }
    return result;
  },
};

function authIdToPrefix(authId) {
  return authId.split(':')[0];
}
