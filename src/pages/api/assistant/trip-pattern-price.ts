import { errorResultAsJson, tryResult } from '@atb/modules/api-server';
import {
  TripPatternPrice,
  TripPatternPriceRequestBodySchema,
  TripPatternPriceSchema,
} from '@atb/page-modules/assistant';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';
import {
  addPriceProductToCache,
  getPriceProductsIfCached,
} from '@atb/page-modules/assistant/server/price-product-cache.ts';
import { getPreassignedFareProducts } from '@atb/modules/firebase';
import { ApiError } from 'next/dist/server/api-utils';

export default handlerWithAssistantClient<TripPatternPrice>({
  async POST(req, res, { client, ok }) {
    return tryResult(req, res, async () => {
      let products = getPriceProductsIfCached();
      if (!products?.length) {
        const preassignedFareProducts = await getPreassignedFareProducts().then(
          (val) => val.filter((p) => p.isEnabledForTripSearchOffer),
        );
        preassignedFareProducts.length &&
          addPriceProductToCache(preassignedFareProducts);
        products = preassignedFareProducts;
      }
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
      const userType = { userType: 'ADULT' };
      if (result.cheapestTotalPrice) {
        const priceWithUserType = TripPatternPriceSchema.safeParse({
          ...result,
          ...userType,
        });
        return ok(priceWithUserType.data);
      }
      return ok(undefined);
    });
  },
});
