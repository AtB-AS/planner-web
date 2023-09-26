import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import type { AutocompleteApiReturnType } from '@atb/page-modules/departures/client';
import { handlerWithDepartureClient } from '@atb/page-modules/departures/server';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';
import { z } from 'zod';

export default handlerWithDepartureClient<AutocompleteApiReturnType>({
  async GET(req, res, { client, ok }) {
    // Validate input as string
    const query = z.string().safeParse(req.query.q);
    if (!query.success) {
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

    return tryResult(req, res, async () => {
      return ok(await client.autocomplete(String(query.data)));
    });
  },
});
