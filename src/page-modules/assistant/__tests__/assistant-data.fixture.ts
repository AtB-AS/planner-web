import { FeatureCategory } from '@atb/components/venue-icon';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { NonTransitTripData, TripData } from '..';

export const fromFeature: GeocoderFeature = {
  id: '638651',
  name: 'Strindheim',
  locality: 'Trondheim',
  category: [FeatureCategory.BYDEL],
  layer: 'address',
  geometry: {
    coordinates: [10.456038846578249, 63.42666114395819],
  },
};

export const toFeature: GeocoderFeature = {
  id: 'NSR:StopPlace:43984',
  name: 'Byåsen skole',
  locality: 'Trondheim',
  category: [FeatureCategory.ONSTREET_BUS],
  layer: 'venue',
  geometry: { coordinates: [10.358037, 63.398886] },
};

export const tripResult: TripData = {
  nextPageCursor: 'aaa',
  previousPageCursor: 'bbb',
  tripPatterns: [],
};

export const nonTransitTripResult: NonTransitTripData = {
  footTrip: {
    nextPageCursor: 'ccc',
    previousPageCursor: 'ddd',
    tripPatterns: [],
  },
};
