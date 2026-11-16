import { currentOrg } from '@atb/modules/org-data';
import { compressToEncodedURIComponent } from 'lz-string';

export type PlannerWidgetData = {
  latest: PlannerModule;
  all: PlannerModule[];
  /**
   * Unreleased widget built from the current source. Only in non-production
   * builds, see scripts/build-widget-next.sh.
   */
  next?: UnreleasedPlannerModule;
};

export type UnreleasedPlannerModule = Pick<PlannerModule, 'version' | 'urls'>;

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

  const widgetData = data.default as PlannerWidgetData;
  if (!process.env.WIDGET_NEXT_AVAILABLE) return widgetData;

  return { ...widgetData, next: nextWidget };
}

const nextWidget: UnreleasedPlannerModule = {
  version: 'next',
  urls: {
    umd: `/widget/${compressedOrgId}/next/planner-web.umd.js`,
    esm: `/widget/${compressedOrgId}/next/planner-web.mjs`,
    css: `/widget/${compressedOrgId}/next/planner-web.css`,
  },
};
