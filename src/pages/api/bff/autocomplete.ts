import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import { handlerWithBffClient } from '@atb/page-modules/bff/server';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';
import { z } from 'zod';
import qs from 'query-string';
import { mapboxData } from '@atb/modules/org-data';
import { AutocompleteApiReturnType } from '@atb/modules/geocoder/autocomplete';

export default handlerWithBffClient<AutocompleteApiReturnType>(
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

      const q = {
        query: query.data,
        lat: lat.data ?? mapboxData.defaultLat,
        lon: lon.data ?? mapboxData.defaultLng,
        layers: onlyStopPlaces.data ? ['venue'] : ['venue', 'address'],
        limit: 10,
        multiModal: 'parent', // TODO: child was used previously
      };

      return tryResult(req, res, async () => {
        return ok(
          await client.autocomplete(qs.stringify(q, { skipNull: true })),
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
