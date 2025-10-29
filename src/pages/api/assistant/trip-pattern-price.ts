import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import {
  TripPatternPrice,
  TripPatternPriceRequestBodySchema,
  TripPatternPriceSchema,
} from '@atb/page-modules/assistant';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';
import { getPriceProductsIfCached } from '@atb/page-modules/assistant/server/price-product-cache.ts';
import { ApiError } from 'next/dist/server/api-utils';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';

export default handlerWithAssistantClient<TripPatternPrice>({
  async POST(req, res, { client, ok }) {
    return tryResult(req, res, async () => {
      let products = await getPriceProductsIfCached();

      const bodyRes = TripPatternPriceRequestBodySchema.safeParse({
        travellers: [{ id: 'adultAnonymousTraveller', userType: 'ADULT' }],
        travelDate: req.body.travelDate,
        products: products.map((p) => p.id),
        legs: req.body.legs,
        isOnBehalfOf: false,
      });
      if (bodyRes.error) {
        throw new ApiError(400, bodyRes.error.message);
      }
      const result = await client.tripPatternPrice(bodyRes.data);
      if (result.cheapestTotalPrice) {
        const priceWithUserType = TripPatternPriceSchema.safeParse({
          ...result,
          userType: 'ADULT',
        });
        return ok(priceWithUserType.data);
      }

      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_NOT_FOUND,
        ServerText.Endpoints.resourceNotFound,
      );
    });
  },
});
