import {
  ApplicationError,
  composeClientFactories,
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
  HttpRequester,
} from '@atb/modules/api-server';
import {
  type BffTripPattern,
  createBffTripApi,
} from '@atb/page-modules/assistant/server/bff-trips';

type JourneyServiceApi = {
  saveTrip(tripPattern: BffTripPattern): Promise<string>;
  getTrip(tripId: string): Promise<BffTripPattern | undefined>;
};

function createJourneyServiceApi(
  request: HttpRequester<'http-journey'>,
): JourneyServiceApi {
  return {
    async saveTrip(tripPattern) {
      const result = await request('/v1/trip', {
        method: 'POST',
        body: JSON.stringify({ tripPattern }),
      });
      return (await result.json()).tripId;
    },
    async getTrip(tripId) {
      try {
        const result = await request(`/v1/trip/${tripId}`);
        return (await result.json()).tripPattern;
      } catch (e) {
        if (e instanceof ApplicationError && e.status === 404) return;
        throw e;
      }
    },
  };
}

const composed = composeClientFactories(
  createExternalClient('http-bff', createBffTripApi),
  createExternalClient('http-journey', createJourneyServiceApi),
);
export const withTripClient = createWithExternalClientDecorator(composed);
export const handlerWithTripClient =
  createWithExternalClientDecoratorForHttpHandlers(composed);
