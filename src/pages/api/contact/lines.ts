import { createLinesRouteHandler } from '@mrfylke/contact-form/server';
import { getOrgData } from '@atb/modules/org-data';

export default createLinesRouteHandler({
  getAuthorityId: () => getOrgData().authorityId,
});
