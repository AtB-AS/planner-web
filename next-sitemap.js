/** @type {import('next-sitemap').IConfig} */

function getHomepageUrl() {
  const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;
  const org = require(`./orgs/${orgId}.json`);
  return org.urls.homePageUrl.href;
}

function getSiteUrl(url) {
  return url.includes('www')
    ? url.replace('www', 'reise')
    : url.replace('//', '//reise.');
}

const homePageUrl = getHomepageUrl();
const siteUrl = getSiteUrl(homePageUrl);

module.exports = {
  siteUrl: siteUrl,
  generateIndexSitemap: false,
  sitemapSize: 7000,
  generateRobotsTxt: true,
  robosTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
