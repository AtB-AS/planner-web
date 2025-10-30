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
        /*
         * One might expect 'atb-distribution-channel' to be 'Web', since planner-web
         * is a web app. However, 'atb-distribution-channel' header is ultimately
         * used by Entur to determine what tickets are purchasable where, and since we
         * show the price of single tickets that are only purchaseable in the app, we
         * set the channel to 'App' here.
         */
        headers: { 'atb-distribution-channel': 'App' },
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
