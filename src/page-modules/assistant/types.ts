import { GeocoderFeature } from '@atb/page-modules/departures';
import { z } from 'zod';
import { searchModeSchema, type SearchTime } from '@atb/modules/search-time';
import type { TransportModeGroup } from '@atb/modules/transport-mode';
import { TransportModeType } from '@atb-as/config-specs';
import {
  NoticeFragment,
  TripPatternFragment,
  TripsQuery,
} from '@atb/page-modules/assistant/journey-gql/trip.generated.ts';
import {
  LegWithDetailsFragment,
  TripPatternWithDetailsFragment,
  TripsWithDetailsQuery,
} from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated.ts';
import { MapLegType } from '@atb/components/map';
import { Mode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

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
  transportModes?: TransportModeGroup[];
  cursor?: string;
  via?: GeocoderFeature;
  lineFilter?: string[];
};

export type FromToTripQuery = {
  from: GeocoderFeature | null;
  to: GeocoderFeature | null;
  transportModeFilter: string[] | null;
  searchTime: SearchTime;
  cursor: string | null;
  via?: GeocoderFeature | null;
  lineFilter: string[] | null;
};

export const TripQuerySchema = z.object({
  fromId: z.string().optional(),
  fromLon: z.number().optional(),
  fromLat: z.number().optional(),
  fromLayer: z.union([z.literal('address'), z.literal('venue')]).optional(),
  toId: z.string().optional(),
  toLon: z.number().optional(),
  toLat: z.number().optional(),
  toLayer: z.union([z.literal('address'), z.literal('venue')]).optional(),
  filter: z.string().optional(),
  searchMode: searchModeSchema.optional(),
  searchTime: z.number().optional(),
  cursor: z.string().optional(),
  viaId: z.string().optional(),
  viaLon: z.number().optional(),
  viaLat: z.number().optional(),
  viaLayer: z.union([z.literal('address'), z.literal('venue')]).optional(),
  lineFilter: z.string().optional(),
});

export type TripQuery = z.infer<typeof TripQuerySchema>;
export enum StreetMode {
  /** Bike only. This can be used as access/egress, but transfers will still be walk only. */
  Bicycle = 'bicycle',
  /** Bike to a bike parking area, then walk the rest of the way. Direct mode and access mode only. */
  BikePark = 'bike_park',
  /** Walk to a bike rental point, bike to a bike rental drop-off point, and walk the rest of the way. This can include bike rental at fixed locations or free-floating services. */
  BikeRental = 'bike_rental',
  /** Car only. Direct mode only. */
  Car = 'car',
  /** Start in the car, drive to a parking area, and walk the rest of the way. Direct mode and access mode only. */
  CarPark = 'car_park',
  /** Walk to a pickup point along the road, drive to a drop-off point along the road, and walk the rest of the way. This can include various taxi-services or kiss & ride. */
  CarPickup = 'car_pickup',
  /** Walk to an eligible pickup area for flexible transportation, ride to an eligible drop-off area and then walk the rest of the way. */
  Flexible = 'flexible',
  /** Walk only */
  Foot = 'foot',
  /** Walk to a scooter rental point, ride a scooter to a scooter rental drop-off point, and walk the rest of the way. This can include scooter rental at fixed locations or free-floating services. */
  ScooterRental = 'scooter_rental',
}

export type NonTransitTripInput = {
  from: GeocoderFeature;
  to: GeocoderFeature;
  searchTime: SearchTime;
  directModes: StreetMode[];
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
export type ExtendedTripPatternType = TripPatternFragment & {
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
};
export type ExtendedTripPatternWithDetailsType =
  TripPatternWithDetailsFragment & {
    compressedQuery: string;
    legs: ExtendedLegType[];
  };
export type TripWithDetailsType = TripsWithDetailsQuery & {
  trip: {
    tripPatterns: ExtendedTripPatternWithDetailsType[];
  };
};

export type BookingArrangementType =
  TripWithDetailsType['trip']['tripPatterns'][number]['legs'][number]['bookingArrangements'];
