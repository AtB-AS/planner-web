/** @type {import('next-sitemap').IConfig} */

function getSiteUrl() {
  const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;
  const org = require(`./orgs/${orgId}.json`);
  return org.urls.travelPlannerUrl.href;
}

const prod = process.env.NODE_ENV === 'production';
const siteUrl = getSiteUrl();

/*
 * Todo: Find a way to set the correct url when in preview and in staging.
 */
module.exports = {
  siteUrl: prod ? siteUrl : 'http://localhost:3000',
  generateIndexSitemap: false,
  sitemapSize: 7000,
  generateRobotsTxt: true,
  robosTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
