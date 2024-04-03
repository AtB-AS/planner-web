/** @type {import('next-sitemap').IConfig} */

function getEnvironmentUrls() {
  const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;
  const org = require(`./orgs/${orgId}.json`);
  return org.urls.sitemapUrls;
}

const environmentUrls = getEnvironmentUrls();
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

module.exports = {
  siteUrl: environment ? environmentUrls[environment] : environmentUrls['dev'],
  generateIndexSitemap: false,
  sitemapSize: 7000,
  generateRobotsTxt: true,
  robosTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
