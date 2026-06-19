import { tryResult } from '@atb/modules/api-server';
import {
  ExtendedTripPatternWithDetailsType,
  RefreshTripRequestBodySchema,
} from '@atb/page-modules/assistant';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';
import { ApiError } from 'next/dist/server/api-utils';

export default handlerWithAssistantClient<ExtendedTripPatternWithDetailsType>({
  async POST(req, res, { client, ok }) {
    return tryResult(req, res, async () => {
      const bodyRes = RefreshTripRequestBodySchema.safeParse(req.body);
      if (bodyRes.error) {
        throw new ApiError(400, bodyRes.error.message);
      }

      const refreshed = await client.refreshSingleTrip(
        req.body as ExtendedTripPatternWithDetailsType,
      );
      return ok(refreshed);
    });
  },
});
