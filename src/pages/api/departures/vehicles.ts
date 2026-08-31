import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import type { VehicleWithPosition } from '@atb/page-modules/departures/client';
import { handlerWithDepartureClient } from '@atb/page-modules/departures/server';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';
import { z } from 'zod';

export default handlerWithDepartureClient<VehicleWithPosition[]>({
  async GET(req, res, { client, ok }) {
    const query = z
      .object({
        serviceJourneyIds: z.union([z.string(), z.array(z.string())]),
      })
      .safeParse(req.query);

    if (!query.success) {
      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_BAD_REQUEST,
        ServerText.Endpoints.invalidMethod,
      );
    }

    const serviceJourneyIds = Array.isArray(query.data.serviceJourneyIds)
      ? query.data.serviceJourneyIds
      : [query.data.serviceJourneyIds];

    return tryResult(req, res, async () => {
      return ok(await client.serviceJourneyVehicles(serviceJourneyIds));
    });
  },
});
