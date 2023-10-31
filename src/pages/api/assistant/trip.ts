import { parseFilterQuery } from '@atb/components/transport-mode-filter/utils';
import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import { TripApiReturnType } from '@atb/page-modules/assistant/client/journey-planner';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';
import { parseTripQuery } from '@atb/page-modules/assistant';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';

export default handlerWithAssistantClient<TripApiReturnType>({
  async GET(req, res, { client, ok }) {
    const tripQuery = parseTripQuery(req.query);
    if (!tripQuery) {
      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_BAD_REQUEST,
        ServerText.Endpoints.invalidData,
      );
    }

    const from = await client.reverse(
      tripQuery.fromLat,
      tripQuery.fromLon,
      tripQuery.fromLayer,
    );
    const to = await client.reverse(
      tripQuery.toLat,
      tripQuery.toLon,
      tripQuery.toLayer,
    );

    const transportModeFilter = parseFilterQuery(tripQuery.filter);

    if (!from || !to) {
      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_BAD_REQUEST,
        ServerText.Endpoints.invalidData,
      );
    }

    return tryResult(req, res, async () => {
      return ok(
        await client.trip({
          from,
          to,
          departureMode: tripQuery.departureMode,
          departureDate: tripQuery.departureDate,
          transportModes: transportModeFilter || undefined,
          cursor: tripQuery.cursor,
        }),
      );
    });
  },
});
