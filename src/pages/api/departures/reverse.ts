import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import { handlerWithDepartureClient } from '@atb/page-modules/departures/server';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';
import { z } from 'zod';
import { type ReverseApiReturnType } from '@atb/page-modules/departures/client';

export default handlerWithDepartureClient<ReverseApiReturnType>({
  async GET(req, res, { client, ok }) {
    const latQuery = z.string().safeParse(req.query.lat);
    const lonQuery = z.string().safeParse(req.query.lon);

    if (!latQuery.success || !lonQuery.success) {
      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_BAD_REQUEST,
        ServerText.Endpoints.invalidMethod,
      );
    }

    const lat = parseFloat(latQuery.data);
    const lon = parseFloat(lonQuery.data);

    if (lat === 0 || lon === 0) {
      return ok(undefined);
    }

    return tryResult(req, res, async () => {
      return ok(await client.reverse(lat, lon));
    });
  },
});
