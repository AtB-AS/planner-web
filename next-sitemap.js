/** @type {import('next-sitemap').IConfig} */

function getEnvironmentUrls() {
  const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;
  const org = require(`./orgs/${orgId}.json`);
  return org.urls.sitemapUrls;
}

const environmentUrls = getEnvironmentUrls();

let environment;
if (process.env.NEXT_PUBLIC_IN_STAGING) {
  environment = 'staging';
} else if (!process.env.NEXT_PUBLIC_IN_STAGING) {
  environment = 'prod';
} else {
  environment = 'dev';
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
