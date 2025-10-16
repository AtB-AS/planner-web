import { HttpRequester, genericError } from '@atb/modules/api-server';
import {
  TripPatternPriceRequestBody,
  TripPatternPriceResponse,
  TripPatternPriceResponseSchema,
} from '@atb/page-modules/assistant';

export type SalesSearchApi = {
  tripPatternPrice(
    tripPatternPriceRequestBody: TripPatternPriceRequestBody,
  ): Promise<TripPatternPriceResponse>;
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
        return TripPatternPriceResponseSchema.parse(await response.json());
      } catch {
        throw genericError();
      }
    },
  };
}
