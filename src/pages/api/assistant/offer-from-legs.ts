import { tryResult } from '@atb/modules/api-server';
import { type OfferFromLegsResponse } from '@atb/page-modules/assistant';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';

export default handlerWithAssistantClient<OfferFromLegsResponse>({
  async POST(req, res, { client, ok }) {
    return tryResult(req, res, async () => {
      const result = await client.offerFromLegs(req.body);
      return ok(result);
    });
  },
});
