import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import {
  fetchFromToTripQuery,
  type NonTransitTripApiReturnType,
} from '@atb/page-modules/assistant';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';
import { MEDIUM_WALK_SPEED } from '@atb/page-modules/assistant/walk-speed-input';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';
import { StreetMode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

export default handlerWithAssistantClient<NonTransitTripApiReturnType>({
  async GET(req, res, { client, ok }) {
    const tripQuery = await fetchFromToTripQuery(req.query, client);

    if (!tripQuery.from || !tripQuery.to) {
      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_BAD_REQUEST,
        ServerText.Endpoints.invalidData,
      );
    }

    return tryResult(req, res, async () => {
      return ok(
        await client.nonTransitTrips({
          from: tripQuery.from!,
          to: tripQuery.to!,
          searchTime: tripQuery.searchTime,
          directModes: [StreetMode.Foot, StreetMode.Bicycle],
          walkSpeed: tripQuery.walkSpeed ?? MEDIUM_WALK_SPEED,
        }),
      );
    });
  },
});
