import { readdir, stat } from 'fs/promises';
import { resolve } from 'path';
import { compareVersions } from 'compare-versions';

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

const BASE_URL = resolve(__dirname, '../../../public/widget');

/***
 * List all version with files from /public/widget
 */
export async function getWidgetData(): Promise<PlannerWidgetData> {
  const dirs = await readdir(BASE_URL);

  // return all files from /public/widget based on dirs
  const allP = dirs.map(async (dir) => {
    const statForDir = await stat(resolve(dir, BASE_URL));
    return {
      version: dir,
      created: statForDir.birthtime.toISOString(),
      urls: {
        umd: `/widget/${dir}/planner-web.umd.js`,
        esm: `/widget/${dir}/planner-web.mjs`,
        css: `/widget/${dir}/planner-web.css`,
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
