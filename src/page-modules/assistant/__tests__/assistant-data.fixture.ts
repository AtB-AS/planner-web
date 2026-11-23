import { GeocoderFeature, FeatureCategory } from '@atb/modules/geocoder';
import { NonTransitTripData, TripsType } from '..';
import { Mode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated';

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

export const viaFeature: GeocoderFeature = {
  id: 'NSR:StopPlace:42660',
  name: 'Studentersamfundet',
  locality: 'Trondheim',
  category: [FeatureCategory.ONSTREET_BUS],
  layer: 'venue',
  geometry: { coordinates: [10.394852, 63.422568] },
};

export const tripResult: TripsType = {
  trip: {
    nextPageCursor: 'aaa',
    previousPageCursor: 'bbb',
    tripPatterns: [],
  },
};

export const nonTransitTripResult: NonTransitTripData = {
  footTrip: {
    duration: 0,
    mode: Mode.Bus,
    rentedBike: false,
    tripPattern: { expectedStartTime: '', expectedEndTime: '', legs: [] },
  },
};
