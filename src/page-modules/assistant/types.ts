import { TransportModeFilterOption } from '@atb/components/transport-mode-filter/types';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { z } from 'zod';
import type { TripData } from './server/journey-planner/validators';

export enum DepartureMode {
  DepartBy = 'departBy',
  ArriveBy = 'arriveBy',
}

export type TripInput = {
  from: GeocoderFeature;
  to: GeocoderFeature;
  departureMode: DepartureMode;
  departureDate?: number;
  transportModes?: TransportModeFilterOption[];
  cursor?: string;
};

export const TripQuerySchema = z.object({
  fromId: z.string(),
  fromLon: z.number(),
  fromLat: z.number(),
  fromLayer: z.union([z.literal('address'), z.literal('venue')]),
  toId: z.string(),
  toLon: z.number(),
  toLat: z.number(),
  toLayer: z.union([z.literal('address'), z.literal('venue')]),
  filter: z.string().optional(),
  departureDate: z.number().optional(),
  departureMode: z.nativeEnum(DepartureMode),
  cursor: z.string().optional(),
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
  departureMode: DepartureMode;
  departureDate?: number;
  directModes: StreetMode[];
};

export type { TripData };
export type NonTransitTripData = {
  cycleTrip?: TripData;
  footTrip?: TripData;
  bikeRentalTrip?: TripData;
};
