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
  const data = await import(
    `../available-widgets/${compressedOrgId}/manifest.json`
  );

  return data.default as PlannerWidgetData;
}
