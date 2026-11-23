import { tryResult } from '@atb/modules/api-server';
import {
  type ExtendedTripPatternWithDetailsType,
  RefreshTripRequestBodySchema,
} from '@atb/page-modules/assistant';
import { toBffTripPattern } from '@atb/page-modules/assistant/server/bff-trips';
import { handlerWithTripClient } from '@atb/page-modules/trip/server';
import { ApiError } from 'next/dist/server/api-utils';
import { z } from 'zod';

const SaveTripRequestBodySchema = z.object({
  tripPattern: RefreshTripRequestBodySchema,
});

export default handlerWithTripClient<{ tripId: string }>({
  async POST(req, res, { client, ok }) {
    return tryResult(req, res, async () => {
      const bodyRes = SaveTripRequestBodySchema.safeParse(req.body);
      if (bodyRes.error) {
        throw new ApiError(400, bodyRes.error.message);
      }

      const tripPattern = bodyRes.data
        .tripPattern as ExtendedTripPatternWithDetailsType;
      return ok({
        tripId: await client.saveTrip(toBffTripPattern(tripPattern)),
      });
    });
  },
});
