import { HttpRequester, genericError } from '@atb/modules/api-server';
import {
  TripPatternPriceRequestBody,
  TripPatternPriceSalesResponse,
  TripPatternPriceSalesResponseSchema,
} from '@atb/page-modules/assistant';

export type SalesSearchApi = {
  tripPatternPrice(
    tripPatternPriceRequestBody: TripPatternPriceRequestBody,
  ): Promise<TripPatternPriceSalesResponse>;
};

export function createSalesSearchApi(
  request: HttpRequester<'http-sales'>,
): SalesSearchApi {
  return {
    async tripPatternPrice(tripPatternPriceRequestBody) {
      const response = await request('/v1/search/trip-pattern/price', {
        method: 'POST',
        body: JSON.stringify(tripPatternPriceRequestBody),
        headers: { 'atb-distribution-channel': 'Web' },
      });

      try {
        return TripPatternPriceSalesResponseSchema.parse(await response.json());
      } catch (error) {
        console.error(error);
        throw genericError();
      }
    },
  };
}
