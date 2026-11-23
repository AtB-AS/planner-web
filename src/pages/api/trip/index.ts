import { tryResult } from '@atb/modules/api-server';
import { handlerWithTripClient } from '@atb/page-modules/trip/server';
import { ApiError } from 'next/dist/server/api-utils';
import { z } from 'zod';

const SaveTripRequestBodySchema = z.object({ compressedQuery: z.string() });

export default handlerWithTripClient<{ tripId: string }>({
  async POST(req, res, { client, ok }) {
    return tryResult(req, res, async () => {
      const bodyRes = SaveTripRequestBodySchema.safeParse(req.body);
      if (bodyRes.error) {
        throw new ApiError(400, bodyRes.error.message);
      }

      const tripPattern = await client.findTrip(bodyRes.data.compressedQuery);
      if (!tripPattern) {
        throw new ApiError(404, 'Trip not found');
      }

      return ok({ tripId: await client.saveTrip(tripPattern) });
    });
  },
});
