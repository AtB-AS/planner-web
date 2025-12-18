import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import { getAllTransportModesFromFilterOptions } from '@atb/modules/transport-mode';
import {
  fetchFromToTripQuery,
  type TripApiReturnType,
} from '@atb/page-modules/assistant';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';
import { defaultTransferSlack } from '@atb/page-modules/assistant/transfer-slack-input';
import { MEDIUM_WALK_SPEED } from '@atb/page-modules/assistant/walk-speed-input';
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

    return tryResult(req, res, async () => {
      const result = await client.trip({
        from: tripQuery.from!,
        to: tripQuery.to!,
        via: tripQuery.via || undefined,
        searchTime: tripQuery.searchTime,
        transportModes,
        cursor: tripQuery.cursor!,
        lineFilter: tripQuery.lineFilter ?? [],
        walkSpeed:
          tripQuery.walkSpeed !== null
            ? tripQuery.walkSpeed
            : MEDIUM_WALK_SPEED,
        transferSlack:
          tripQuery.transferSlack !== null
            ? tripQuery.transferSlack
            : defaultTransferSlack(),
      });
      return ok(result.trip);
    });
  },
});
