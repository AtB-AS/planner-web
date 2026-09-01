import { createLinesRouteHandler } from '@mrfylke/contact-form/server';
import { getOrgData } from '@atb/modules/org-data';

export const GET = createLinesRouteHandler({
  getAuthorityId: () => getOrgData().authorityId,
});
