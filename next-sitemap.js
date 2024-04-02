/** @type {import('next-sitemap').IConfig} */

function getEnvironmentUrls() {
  const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;
  const org = require(`./orgs/${orgId}.json`);
  return org.urls.sitemapUrls;
}

const environmentUrls = getEnvironmentUrls();
let environment;

if (dev) {
  environment = 'dev';
} else if (process.env.NEXT_PUBLIC_IN_STAGING) {
  environment = 'staging';
} else {
  environment = 'prod';
}

module.exports = {
  siteUrl: environmentUrls[environment],
  generateIndexSitemap: false,
  sitemapSize: 7000,
  generateRobotsTxt: true,
  robosTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
