import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import { parseInputFilterString } from '@atb/modules/transport-mode';
import {
  fetchFromToTripQuery,
  StreetMode,
  type NonTransitTripApiReturnType,
} from '@atb/page-modules/assistant';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';

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
    const inputFilterString = parseInputFilterString(
      tripQuery.transportModeFilter,
    );

    return tryResult(req, res, async () => {
      return ok(
        await client.nonTransitTrips({
          from: tripQuery.from!,
          to: tripQuery.to!,
          searchTime: tripQuery.searchTime,
          directModes: [StreetMode.Foot, StreetMode.Bicycle],
          inputFilterString: inputFilterString,
        }),
      );
    });
  },
});
