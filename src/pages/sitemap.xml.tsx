import fs from 'fs';
import path from 'path';
import { GetServerSideProps } from 'next';
import { Language } from '@atb/translations';
import { formatToShortDateWithYear } from '@atb/utils/date';
import { getOrgData } from '@atb/modules/org-data';

const { urls } = getOrgData();

const travelPlannerUrl = urls.homePageUrl.href.replace('//', '//reise.');

const SiteMap = () => {
  return null;
};

const getFolderNames = (folderPath: string) => {
  try {
    const folderContents = fs.readdirSync(folderPath, { withFileTypes: true });
    const folderNames = folderContents
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((name) => name !== 'api');
    return folderNames;
  } catch (error) {
    console.error('Error when retrieving directory name: ', error);
    return [];
  }
};

const getLastModifiedTime = (totPath: string) => {
  try {
    const stats = fs.statSync(path.join(process.cwd(), totPath));
    return formatToShortDateWithYear(stats.mtime, Language.Norwegian); // Returns the modification time of the folder
  } catch (error) {
    console.error('Error when retrieving change time: ', error);
    return null;
  }
};

const generateSitemap = (folderPath: string) => {
  const folderNames = getFolderNames(folderPath);
  const sites = folderNames.map((folderName) => ({
    name: folderName,
    dateModified: getLastModifiedTime(`${folderPath}/${folderName}`),
  }));

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sites.map((site) => {
    return `
    <url>
        <loc>${travelPlannerUrl}${site.name}</loc>
        <lastmod>${site.dateModified}</lastmod>
    </url>
    `;
  })}
   </urlset>
 `;
};

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
  const siteMap = generateSitemap('src/pages');
  ctx.res.setHeader('Content-Type', 'text/xml');
  ctx.res.write(siteMap);
  ctx.res.end();

  return {
    props: {},
  };
};

export default SiteMap;
