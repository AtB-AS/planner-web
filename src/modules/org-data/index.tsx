export type WEBSHOP_ORGS = 'nfk' | 'atb' | 'fram';
export type MAPBOX_DATA = {
  accessToken: string;
  style: string;
  defaultLat: number;
  defaultLng: number;
};
export const currentOrg = getCurrentOrg();
export const mapboxData = getMapboxData();

function getCurrentOrg(): WEBSHOP_ORGS {
  const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;
  switch (orgId) {
    case 'atb':
      return 'atb';
    case 'nfk':
      return 'nfk';
    case 'fram':
      return 'fram';
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
    defaultLat: parseFloat(defaultLat, 10),
    defaultLng: parseFloat(defaultLng, 10),
  };
}
