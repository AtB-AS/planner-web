import { GeocoderFeature } from '@atb/page-modules/departures';
import { z } from 'zod';
import type {
  NonTransitData,
  TripData,
} from './server/journey-planner/validators';
import { searchModeSchema, type SearchTime } from '@atb/modules/search-time';
import type { TransportModeGroup } from '@atb/modules/transport-mode';

export type TripInput = {
  from: GeocoderFeature;
  to: GeocoderFeature;
  searchTime: SearchTime;
  transportModes?: TransportModeGroup[];
  cursor?: string;
  via?: GeocoderFeature;
};

export type FromToTripQuery = {
  from: GeocoderFeature | null;
  to: GeocoderFeature | null;
  transportModeFilter: string[] | null;
  searchTime: SearchTime;
  cursor: string | null;
  via: GeocoderFeature | null;
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

export type { TripData, NonTransitData };
export type NonTransitTripData = {
  cycleTrip?: NonTransitData;
  footTrip?: NonTransitData;
  bikeRentalTrip?: NonTransitData;
};
