const orgId = process.env.NEXT_PUBLIC_PLANNER_ORG_ID || 'atb';

switch (orgId) {
  case 'atb':
    require('./dist/atb/standalone/server.js');
    break;
  case 'nfk':
    require('./dist/nfk/standalone/server.js');
    break;
  case 'fram':
    require('./dist/fram/standalone/server.js');
    break;
  case 'troms':
    require('./dist/troms/standalone/server.js');
    break;
  case 'vkt':
    require('./dist/vkt/standalone/server.js');
    break;
  case 'farte':
    require('./dist/farte/standalone/server.js');
    break;
  default:
    throw new Error('Invalid org ID provided.');
}
