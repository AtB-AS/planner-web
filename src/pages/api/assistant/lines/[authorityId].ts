import { tryResult } from '@atb/modules/api-server';
import { LinesApiReturnType } from '@atb/page-modules/assistant/client';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';

/*
 * Todo:
 *  1. Make sure that all authorities that should be possible to filter on are added.
 *  2. Should the 'authorities' be set somewhere else?
 */
const authorities: string[] = [
  'NSB:Authority:NSB', // NSB
  'SJN:Authority:SJN', // SJ Nord
  'UNI:Authority:UNI', // Unibuss
  'GFS:Authority:1', // Geiranger Fjordservice
  'VYG:Authority:TAG', // Vy Tåg
  'VYX:Authority:1', // Vy Buss
  'BSR:Authority:1', // Bussring
  'KOL:Authority:30', // Fjord 1
  'BOR:Authority:1', // Boreal
  'HUR:Authority:1', // Hurtigruten
  'Geiranger-Hellesylt', // Geiranger-Hellesylt
  'MOR:Authority:AM008', // Kvamsøya-Voksa-Åram-Larsnes
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
