export type WEBSHOP_ORGS = 'nfk' | 'atb' | 'fram';
export const currentOrg = getCurrentOrg();

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
