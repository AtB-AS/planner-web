import { z } from 'zod';
import { searchModeSchema, type SearchTime } from '@atb/modules/search-time';
import { NoticeFragment } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated.ts';
import {
  LegWithDetailsFragment,
  TripPatternWithDetailsFragment,
  TripsWithDetailsQuery,
} from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated.ts';
import { MapLegType } from '@atb/components/map';
import {
  Mode,
  StreetMode,
  TransportModes,
} from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import { GeocoderFeature } from '@atb/modules/geocoder';

/**
 * IMPORTANT! READ THIS
 *
 * We use the GraphQL-generated types directly in the code as much as possible, since these
 * have proven to be reliable return types and further validation adds development
 * complexity without adding much safety.
 *
 * The GraphQL types are found in /page-modules/<module-name>/journey-gql/<query>.generated.ts
 *
 * Sometimes it is useful to modify or extend the GraphQL-types. That can be done in this file.
 *
 * It is recommended to start with the Query-type (which describes the shape of the GraphQL
 * response), or a GraphQL fragment. Here are two examples of these two:
 *
 *
 * export type TripsType = TripsQuery & {
 *    trip: {
 *       tripPatterns: ExtendedTripPatternType[];
 *    };
 * };
 *
 * export type ExtendedLegType = LegWithDetailsFragment & {
 *    mapLegs: MapLegType[];
 *       notices: NoticeFragment[];
 *    };
 */

export type TripInput = {
  from: GeocoderFeature;
  to: GeocoderFeature;
  searchTime: SearchTime;
  transportModes?: TransportModes[];
  cursor?: string;
  via?: GeocoderFeature;
  lineFilter?: string[];
  walkSpeed?: number;
  transferSlack?: number;
};

export type FromToTripQuery = {
  from: GeocoderFeature | null;
  to: GeocoderFeature | null;
  transportModeFilter: string[] | null;
  searchTime: SearchTime;
  cursor: string | null;
  via?: GeocoderFeature | null;
  lineFilter: string[] | null;
  walkSpeed: number | null;
  transferSlack: number | null;
};

export const TripQuerySchema = z.object({
  fromId: z.string().optional(),
  fromName: z.string().optional(),
  fromLon: z.number().optional(),
  fromLat: z.number().optional(),
  fromLayer: z.union([z.literal('address'), z.literal('venue')]).optional(),
  toId: z.string().optional(),
  toName: z.string().optional(),
  toLon: z.number().optional(),
  toLat: z.number().optional(),
  toLayer: z.union([z.literal('address'), z.literal('venue')]).optional(),
  filter: z.string().optional(),
  searchMode: searchModeSchema.optional(),
  searchTime: z.number().optional(),
  cursor: z.string().optional(),
  viaId: z.string().optional(),
  viaName: z.string().optional(),
  viaLon: z.number().optional(),
  viaLat: z.number().optional(),
  viaLayer: z.union([z.literal('address'), z.literal('venue')]).optional(),
  lineFilter: z.string().optional(),
  walkSpeed: z.number().optional(),
  transferSlack: z.number().optional(),
});

export type TripQuery = z.infer<typeof TripQuerySchema>;

export type NonTransitTripInput = {
  from: GeocoderFeature;
  to: GeocoderFeature;
  searchTime: SearchTime;
  directModes: StreetMode[];
  walkSpeed?: number;
};

export type NonTransitTripData = {
  cycleTrip?: NonTransitTripType;
  footTrip?: NonTransitTripType;
  bikeRentalTrip?: NonTransitTripType;
};

export type LineInput = {
  authorities: string[];
};

export type NonTransitTripType = {
  mode: Mode;
  rentedBike: boolean;
  duration: number;
  compressedQuery: string;
};

// Extend GraphQL-types with convencience properties
export type ExtendedTripPatternType = TripPatternWithDetailsFragment & {
  compressedQuery: string;
};
export type TripsType = TripsWithDetailsQuery & {
  trip: {
    tripPatterns: ExtendedTripPatternWithDetailsType[];
  };
};

export type ExtendedLegType = LegWithDetailsFragment & {
  mapLegs: MapLegType[];
  notices: NoticeFragment[];
  /** When this leg's data was last fetched or refreshed from journey-planner. */
  refreshedAt?: string;
};

/**
 * Status of a trip pattern after a refresh (see refreshSingleTrip):
 * - valid: all legs refreshed and temporally consistent
 * - impossible: a leg starts before the previous one ends (missed connection)
 * - stale: one or more legs could not be refreshed, so data may be outdated
 */
export type TripPatternStatus = 'valid' | 'impossible' | 'stale';

export type ExtendedTripPatternWithDetailsType =
  TripPatternWithDetailsFragment & {
    compressedQuery: string;
    legs: ExtendedLegType[];
    status?: TripPatternStatus;
    /**
     * Trip-level aimed times, derived from the legs by refreshSingleTrip.
     * Non-transit legs have no real schedule, so these are anchored to the
     * nearest transit legs.
     */
    aimedStartTime?: string;
    aimedEndTime?: string;
  };
export type TripWithDetailsType = TripsWithDetailsQuery & {
  trip: {
    tripPatterns: ExtendedTripPatternWithDetailsType[];
  };
};

export type BookingArrangementType =
  TripWithDetailsType['trip']['tripPatterns'][number]['legs'][number]['bookingArrangements'];

const TravellerSchema = z.object({
  id: z.string(),
  userType: z.string(),
});
export type Traveller = z.infer<typeof TravellerSchema>;

export const LegToGetPriceFromSchema = z.object({
  travelDate: z.string(),
  fromStopPlaceId: z.string(),
  toStopPlaceId: z.string(),
  serviceJourneyId: z.string(),
});

export type LegToGetPriceFrom = z.infer<typeof LegToGetPriceFromSchema>;

// Request body for /api/assistant/refresh-trip. Mirrors the leg-stub
// validation of atb-bff's singleTrip v3: only the fields the refresh logic
// relies on are validated, everything else passes through untouched.
const RefreshTripLegStubSchema = z.looseObject({
  id: z.string().nullish(),
  mode: z.string(),
  distance: z.number(),
  duration: z.number(),
  aimedStartTime: z.string(),
  aimedEndTime: z.string(),
  expectedStartTime: z.string(),
  expectedEndTime: z.string(),
});

export const RefreshTripRequestBodySchema = z.looseObject({
  compressedQuery: z.string(),
  expectedStartTime: z.string(),
  expectedEndTime: z.string(),
  legs: z.array(RefreshTripLegStubSchema).min(1),
});

export const TripPatternPriceRequestBodySchema = z.object({
  travellers: z.array(TravellerSchema).min(1),
  travelDate: z.string(),
  products: z.array(z.string()).min(1),
  isOnBehalfOf: z.boolean(),
  legs: z.array(LegToGetPriceFromSchema).min(1),
});
export type TripPatternPriceRequestBody = z.infer<
  typeof TripPatternPriceRequestBodySchema
>;

// https://github.com/AtB-AS/sales/blob/main/sales-service/src/trip_pattern.rs#L35
export const TripPatternPriceSalesResponseSchema = z.object({
  cheapestTotalPrice: z.number().nullable(),
});

export type TripPatternPriceSalesResponse = z.infer<
  typeof TripPatternPriceSalesResponseSchema
>;

// Internal type (what we use in our app)
export const TripPatternPriceSchema = z
  .object({
    cheapestTotalPrice: z.number(),
    userType: z.string(),
  })
  .optional();

export type TripPatternPrice = z.infer<typeof TripPatternPriceSchema>;
