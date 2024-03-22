import { tryResult } from '@atb/modules/api-server';
import { LinesApiReturnType } from '@atb/page-modules/assistant/client';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';

/*
 * Todo:
 *  1. Make sure that all authorities that should be possible to filter on are added.
 *  2. Should the 'authorities' be set somewhere else?
 */
const authorities: string[] = [
  'NSB:Authority:NSB',
  'SJN:Authority:SJN',
  'UNI:Authority:UNI',
  'GFS:Authority:1',
  'VYG:Authority:TAG',
  'BSR:Authority:1',
  'KOL:Authority:30',
];

export default handlerWithAssistantClient<LinesApiReturnType>({
  async GET(req, res, { client, ok }) {
    const { authorityId } = req.query;

    if (typeof authorityId === 'string') {
      authorities.push(authorityId);
    }

    return tryResult(req, res, async () => {
      return ok(
        await client.lines({
          authorities: authorities,
        }),
      );
    });
  },
});
