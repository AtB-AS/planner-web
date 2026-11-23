import {
  ApplicationError,
  composeClientFactories,
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
  HttpRequester,
} from '@atb/modules/api-server';
import {
  extendLeg,
  extractServiceJourneyIds,
  parseTripQueryString,
} from '@atb/page-modules/assistant/server/journey-planner';
import type {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant';

/**
 * Trip pattern in the format atb-bff returns and the journey service stores.
 * Leg fields planner-web reads have the same shape as in planner-web's own
 * trip search, apart from `serviceDate` and `authority.fareUrl`, which the BFF
 * does not include.
 */
export type BffTripPattern = Omit<
  ExtendedTripPatternWithDetailsType,
  'legs' | 'compressedQuery' | 'streetDistance'
> & {
  walkDistance?: number;
  compressedQuery?: string;
  legs: BffLeg[];
};
type BffLeg = Omit<ExtendedLegType, 'mapLegs' | 'notices'> & {
  intermediateEstimatedCalls: { date?: string }[];
};

type BffTripApi = {
  /**
   * Finds a trip from planner-web's trip search in the BFF format, by
   * repeating the search with /bff/v2/trips. Returns undefined for via
   * searches, which /bff/v2/trips does not support, and for trips no longer
   * found.
   */
  findTrip(compressedQuery: string): Promise<BffTripPattern | undefined>;
  refreshSingleTrip(tripPattern: BffTripPattern): Promise<BffTripPattern>;
};

function createBffTripApi(request: HttpRequester<'http-bff'>): BffTripApi {
  return {
    async findTrip(compressedQuery) {
      const tripQuery = parseTripQueryString(compressedQuery);
      if (!tripQuery || 'via' in tripQuery.query) return;

      const {
        from,
        to,
        when,
        modes,
        walkSpeed,
        transferSlack,
        transferPenalty,
        waitReluctance,
        walkReluctance,
      } = tripQuery.query;

      // /bff/v2/singleTrip searches without transfer slack, which can return a
      // tighter connection in place of the trip.
      const result = await request('/v2/trips', {
        method: 'POST',
        body: JSON.stringify({
          from,
          to,
          when,
          // `when` is just before the trip departs, see generateSingleTripQueryString
          arriveBy: false,
          modes,
          walkSpeed,
          transferSlack,
          transferPenalty,
          waitReluctance,
          walkReluctance,
          includeCancellations: true,
        }),
      });
      const tripPatterns: BffTripPattern[] = (await result.json()).trip
        .tripPatterns;

      const journeyIds = JSON.stringify(tripQuery.journeyIds);
      return tripPatterns.find(
        (tripPattern) =>
          JSON.stringify(extractServiceJourneyIds(tripPattern)) === journeyIds,
      );
    },
    async refreshSingleTrip(tripPattern) {
      const result = await request('/v3/singleTrip', {
        method: 'POST',
        body: JSON.stringify(tripPattern),
      });
      return result.json();
    },
  };
}

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

/**
 * Adds the fields planner-web's trip components expect to a trip pattern in
 * the BFF format.
 */
export function toExtendedTripPattern(
  tripPattern: BffTripPattern,
): ExtendedTripPatternWithDetailsType {
  const { walkDistance, compressedQuery, legs, ...rest } = tripPattern;
  const now = new Date().toISOString();
  return {
    ...rest,
    streetDistance: walkDistance ?? 0,
    // Only planner-web's trip search reads compressedQuery, and the BFF's
    // compressedQuery has a different format.
    compressedQuery: '',
    legs: legs.map((leg) =>
      extendLeg(
        { ...leg, serviceDate: getServiceDate(leg) },
        leg.refreshedAt ?? now,
      ),
    ),
  };
}

/**
 * The date of an intermediate call is the service date. Without intermediate
 * calls the local date of the departure is used, which is wrong only for
 * departures after midnight on a service journey that started the day before.
 */
function getServiceDate(leg: BffLeg) {
  if (!leg.serviceJourney) return null;
  return (
    leg.intermediateEstimatedCalls[0]?.date ?? leg.aimedStartTime.slice(0, 10)
  );
}
