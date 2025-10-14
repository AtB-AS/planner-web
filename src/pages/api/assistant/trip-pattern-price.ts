import { tryResult } from '@atb/modules/api-server';
import { type TripPatternPriceResponse } from '@atb/page-modules/assistant';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';

export default handlerWithAssistantClient<TripPatternPriceResponse>({
  async POST(req, res, { client, ok }) {
    return tryResult(req, res, async () => {
      const result = await client.tripPatternPrice(req.body);
      return ok(result);
    });
  },
});
