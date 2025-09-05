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
      const response = await request('/v1/search/trip-pattern', {
        method: 'POST',
        body: JSON.stringify(offerFromLegsBody),
        // todo: auth currently needed. Either sales stops requiring it, or add static auth here.
      });

      try {
        return OfferFromLegsResponseSchema.parse(await response.json());
      } catch {
        throw genericError();
      }
    },
  };
}
