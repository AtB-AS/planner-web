import { HttpRequester, genericError } from '@atb/modules/api-server';
import {
  OfferFromLegsBody,
  OfferFromLegsResponse,
  OfferFromLegsResponseSchema,
} from '@atb/page-modules/assistant';

export type SalesSearchApi = {
  offerFromLegs(
    offerFromLegsBody: OfferFromLegsBody,
  ): Promise<OfferFromLegsResponse>;
};

export function createSalesSearchApi(
  request: HttpRequester<'http-sales'>,
): SalesSearchApi {
  return {
    async offerFromLegs(offerFromLegsBody) {
      const response = await request('/internal/trip-pattern', {
        method: 'POST',
        body: JSON.stringify(offerFromLegsBody),
      });

      try {
        return OfferFromLegsResponseSchema.parse(await response.json());
      } catch {
        throw genericError();
      }
    },
  };
}
