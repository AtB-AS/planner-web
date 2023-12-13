import { currentOrg } from '@atb/modules/org-data';
import { compareVersions } from 'compare-versions';
import { readdir, stat } from 'fs/promises';
import { compressToEncodedURIComponent } from 'lz-string';
import { join, resolve } from 'path';

export type PlannerWidgetData = {
  latest: PlannerModule;
  all: PlannerModule[];
};

export type PlannerModule = {
  version: string;
  created: string;
  urls: {
    umd: string;
    esm: string;
    css: string;
  };
};

const compressedOrgId = compressToEncodedURIComponent(currentOrg);

/***
 * List all version with files from /public/widget
 */
export async function getWidgetData(): Promise<PlannerWidgetData> {
  // Locally we use /public/widget, but in production we use /widget as
  // all files in public are extracted to the root of the domain
  const baseUrl =
    process.env.NODE_ENV == 'production'
      ? resolve(process.cwd(), '/widget', compressedOrgId)
      : join(process.cwd(), '/public/widget', compressedOrgId);

  const dirs = await readdir(baseUrl);

  console.log(dirs);

  // return all files from /public/widget based on dirs
  const allP = dirs.map(async (dir) => {
    const statForDir = await stat(resolve(dir, baseUrl));
    return {
      version: dir,
      created: statForDir.birthtime.toISOString(),
      urls: {
        umd: `/widget/${compressedOrgId}/${dir}/planner-web.umd.js`,
        esm: `/widget/${compressedOrgId}/${dir}/planner-web.mjs`,
        css: `/widget/${compressedOrgId}/${dir}/planner-web.css`,
      },
    };
  });

  let all = await Promise.all(allP);
  all = all.sort((a, b) => compareVersions(a.version, b.version));

  return {
    latest: all[0],
    all,
  };
}
