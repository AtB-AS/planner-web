import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import {
  getAllTransportModesFromFilterOptions,
  parseInputFilterString,
} from '@atb/modules/transport-mode';
import {
  fetchFromToTripQuery,
  type TripApiReturnType,
} from '@atb/page-modules/assistant';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';

export default handlerWithAssistantClient<TripApiReturnType>({
  async GET(req, res, { client, ok }) {
    const tripQuery = await fetchFromToTripQuery(req.query, client);

    if (!tripQuery.from || !tripQuery.to) {
      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_BAD_REQUEST,
        ServerText.Endpoints.invalidData,
      );
    }

    const transportModes = await getAllTransportModesFromFilterOptions(
      tripQuery.transportModeFilter,
    );

    const inputFilterString = parseInputFilterString(
      tripQuery.transportModeFilter,
    );

    return tryResult(req, res, async () => {
      return ok(
        await client.trip({
          from: tripQuery.from!,
          to: tripQuery.to!,
          via: tripQuery.via || undefined,
          searchTime: tripQuery.searchTime,
          transportModes,
          cursor: tripQuery.cursor!,
          lineFilter: tripQuery.lineFilter ?? [],
          inputFilterString: inputFilterString,
        }),
      );
    });
  },
});
