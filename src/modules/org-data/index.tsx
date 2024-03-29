import { Language } from '@atb/translations';
import atb from '../../../orgs/atb.json';
import fram from '../../../orgs/fram.json';
import nfk from '../../../orgs/nfk.json';
import troms from '../../../orgs/troms.json';

export type WEBSHOP_ORGS = 'nfk' | 'atb' | 'fram' | 'troms';
export type MAPBOX_DATA = {
  accessToken: string;
  style: string;
  defaultLat: number;
  defaultLng: number;
};

export type TranslatableUrl = { default: string } & Partial<{
  [isoCode in `${Language}`]: string;
}>;
export type OrgData = {
  orgId: WEBSHOP_ORGS;
  authorityId: string;
  supportEmail: string;

  fylkeskommune?: {
    name: string;
    logoSrc: string;
    logoSrcDark: string;
    replaceTitleWithLogoInHeader?: boolean;
  };

  urls: {
    privacyDeclarationUrl: TranslatableUrl;
    accessibilityStatementUrl: TranslatableUrl;

    helpUrl?: TranslatableUrl;
    supportUrl?: TranslatableUrl;

    instagramLink?: string;
    facebookLink?: string;
    twitterLink?: string;
    homePageUrl: {
      name: string;
      href: string;
    };
    ticketsUrl?: TranslatableUrl;
  };
  journeyApiConfigurations: {
    waitReluctance?: number;
    walkingReluctance?: number;
    walkingSpeed?: number;
    transferPenalty?: number;
    transferSlack?: number;
  };
};

export function getOrgData(): OrgData {
  const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;
  switch (orgId) {
    case 'atb':
      return atb as OrgData;
    case 'nfk':
      return nfk as OrgData;
    case 'fram':
      return fram as OrgData;
    case 'troms':
      return troms as OrgData;
  }

  throw new Error('NEXT_PUBLIC_PLANNER_ORG_ID required but missing');
}
export const currentOrg = getCurrentOrg();
export const mapboxData = getMapboxData();

export function getConfigUrl(url: TranslatableUrl, lang: Language) {
  return url[lang] ?? url.default;
}

function getCurrentOrg(): WEBSHOP_ORGS {
  const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;
  switch (orgId) {
    case 'atb':
      return 'atb';
    case 'nfk':
      return 'nfk';
    case 'fram':
      return 'fram';
    case 'troms':
      return 'troms';
  }

  throw new Error('NEXT_PUBLIC_PLANNER_ORG_ID required but missing');
}

function getMapboxData(): MAPBOX_DATA {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;
  const style = process.env.NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL;
  const defaultLat = process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_LAT;
  const defaultLng = process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_LNG;

  if (!accessToken || !style || !defaultLat || !defaultLng) {
    throw new Error('Mapbox data required but missing');
  }

  return {
    accessToken,
    style,
    defaultLat: parseFloat(parseFloat(defaultLat).toFixed(10)),
    defaultLng: parseFloat(parseFloat(defaultLng).toFixed(10)),
  };
}
