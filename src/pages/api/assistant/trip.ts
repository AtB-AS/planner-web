import { parseFilterQuery } from '@atb/components/transport-mode-filter/utils';
import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import { TripApiReturnType } from '@atb/page-modules/assistant/client/journey-planner';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';
import { parseTripQuery } from '@atb/page-modules/assistant/utils';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';

export default handlerWithAssistantClient<TripApiReturnType>({
  async GET(req, res, { client, ok }) {
    const tripQuery = parseTripQuery(req.query);
    if (tripQuery) {
      const from = await client.reverse(
        parseFloat(tripQuery.fromLat),
        parseFloat(tripQuery.fromLon),
        tripQuery.fromLayer,
      );
      const to = await client.reverse(
        parseFloat(tripQuery.toLat),
        parseFloat(tripQuery.toLon),
        tripQuery.toLayer,
      );
      const transportModeFilter = parseFilterQuery(tripQuery.filter);

      const arriveBy = 'arriveBy' in tripQuery;
      const departureDate = arriveBy
        ? new Date(Number(tripQuery.arriveBy))
        : new Date(Number(tripQuery.departBy)) || new Date();

      if (from && to) {
        return tryResult(req, res, async () => {
          return ok(
            await client.trip({
              from,
              to,
              ...(arriveBy
                ? { arriveBy: departureDate }
                : { departBy: departureDate }),
              transportModes: transportModeFilter,
              cursor: tripQuery.cursor,
            }),
          );
        });
      } else {
        return errorResultAsJson(
          res,
          constants.HTTP_STATUS_BAD_REQUEST,
          ServerText.Endpoints.invalidData,
        );
      }
    } else {
      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_BAD_REQUEST,
        ServerText.Endpoints.invalidData,
      );
    }
  },
});
