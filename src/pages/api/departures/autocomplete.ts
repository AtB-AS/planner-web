import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import type { AutocompleteApiReturnType } from '@atb/page-modules/departures/client';
import { handlerWithDepartureClient } from '@atb/page-modules/departures/server';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';
import { z } from 'zod';

export default handlerWithDepartureClient<AutocompleteApiReturnType>(
  {
    async GET(req, res, { client, ok }) {
      // Validate input as string
      const query = z.string().safeParse(req.query.q);
      const lat = z.string().optional().safeParse(req.query.lat);
      const lon = z.string().optional().safeParse(req.query.lon);
      const onlyStopPlaces = z
        .string()
        .optional()
        .safeParse(req.query.onlyStopPlaces);

      if (
        !query.success ||
        !lat.success ||
        !lon.success ||
        !onlyStopPlaces.success
      ) {
        return errorResultAsJson(
          res,
          constants.HTTP_STATUS_BAD_REQUEST,
          ServerText.Endpoints.invalidMethod,
        );
      }

      // Don't run autocomplete if the query is empty.
      if (query.data === '') {
        return ok([]);
      }

      let focus: { lat: number; lon: number } | undefined;

      if (!!lat.data && !!lon.data) {
        focus = {
          lat: Number(lat.data),
          lon: Number(lon.data),
        };
      }

      return tryResult(req, res, async () => {
        return ok(
          await client.autocomplete(
            String(query.data),
            focus,
            onlyStopPlaces.data === 'true',
          ),
        );
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
