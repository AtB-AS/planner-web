import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import { handlerWithDepartureClient } from '@atb/page-modules/departures/server';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';
import { z } from 'zod';
import { type ReverseApiReturnType } from '@atb/modules/geocoder';
import { handlerWithBffClient } from '@atb/page-modules/bff/server';
import qs from 'query-string';

export default handlerWithBffClient<ReverseApiReturnType>(
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
        return ok(await client.reverse(lat.data, lon.data, ['address']));
      });
    },
  },
  /*
   CORS Access-Control-Allow-Origin
   @TODO FIX THIS!
  */
  [
    'https://frammr.no',
    /\.frammr.no$/,
    'https://reisnordland.no',
    /\.reisnordland.no$/,
    'https://reisnordland.com',
    /\.reisnordland.com$/,
    'https://svipper.no',
    /\.svipper.no$/,
    'https://vkt.no',
    /\.vkt.no$/,
    'https://farte.no',
    /\.farte.no$/,
    'https://atb.no',
    /\.atb.no$/,
    'https://atbeta.stagecustom22.coretrek.no',
  ],
);
