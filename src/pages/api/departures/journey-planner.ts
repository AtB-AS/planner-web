import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import type { EstimatedCallsApiReturnType } from '@atb/page-modules/departures/client';
import { handlerWithDepartureClient } from '@atb/page-modules/departures/server';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';
import { z } from 'zod';

export default handlerWithDepartureClient<EstimatedCallsApiReturnType>({
  async GET(req, res, { client, ok }) {
    const query = z
      .object({
        quayId: z.string(),
        startTime: z.string(),
        transportModes: z.string().optional(),
      })
      .safeParse(req.query);

    if (!query.success) {
      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_BAD_REQUEST,
        ServerText.Endpoints.invalidMethod,
      );
    }

    return tryResult(req, res, async () => {
      return ok(
        await client.estimatedCalls({
          quayId: query.data.quayId,
          startTime: query.data.startTime,
        }),
      );
    });
  },
});
