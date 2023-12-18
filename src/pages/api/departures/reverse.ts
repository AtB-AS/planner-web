import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import { handlerWithDepartureClient } from '@atb/page-modules/departures/server';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';
import { z } from 'zod';
import { type ReverseApiReturnType } from '@atb/page-modules/departures/client';

export default handlerWithDepartureClient<ReverseApiReturnType>(
  {
    async GET(req, res, { client, ok }) {
      const lat = z.string().safeParse(req.query.lat);
      const lon = z.string().safeParse(req.query.lon);

      if (!lat.success || !lon.success) {
        return errorResultAsJson(
          res,
          constants.HTTP_STATUS_BAD_REQUEST,
          ServerText.Endpoints.invalidMethod,
        );
      }

      return tryResult(req, res, async () => {
        return ok(
          await client.reverse(
            parseFloat(lat.data),
            parseFloat(lon.data),
            'address',
          ),
        );
      });
    },
  },
  // @TODO FIX THIS!
  ['https://frammr.no', /\.frammr.no$/],
);
