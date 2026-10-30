export enum FeatureCategory {
  ONSTREET_BUS = 'onstreetBus',
  ONSTREET_TRAM = 'onstreetTram',
  AIRPORT = 'airport',
  RAIL_STATION = 'railStation',
  METRO_STATION = 'metroStation',
  BUS_STATION = 'busStation',
  COACH_STATION = 'coachStation',
  TRAM_STATION = 'tramStation',
  HARBOUR_PORT = 'harbourPort',
  FERRY_PORT = 'ferryPort',
  FERRY_STOP = 'ferryStop',
  LIFT_STATION = 'liftStation',
  VEHICLE_RAIL_INTERCHANGE = 'vehicleRailInterchange',
  GROUP_OF_STOP_PLACES = 'GroupOfStopPlaces',
  POI = 'poi',
  VEGADRESSE = 'Vegadresse',
  STREET = 'street',
  TETTSTEDDEL = 'tettsteddel',
  BYDEL = 'bydel',
  OTHER = 'other',
}

export const geocoderLayers = [
  'stopPlace',
  'address',
  'street',
  'groupOfStopPlaces',
  'poi',
  'place',
] as const;

export type GeocoderLayer = (typeof geocoderLayers)[number];

export type Feature = {
  geometry: {
    coordinates: [number, number];
    type: 'Point';
  };
  properties: {
    id: string;
    names: {
      default: string;
      display: string;
    };
    layer: GeocoderLayer;
    address?: {
      streetName?: string;
      houseNumber?: string;
      postalCode?: string;
      locality?: string;
      localityId?: string;
      county?: string;
      countyId?: string;
      countryCode?: string;
    };
    transportModes?: Array<{
      mode: string;
      subMode?: string;
    }>;
    stopPlaceTypes?: string[];
    categories?: string[];
    fareZones?: string[];
    source?: string;
    distance?: number;
  };
};

export type GeocoderFeature = {
  id: string;
  name: string;
  locality: string | null;
  category: FeatureCategory[];
  layer: 'address' | 'venue';
  geometry: {
    coordinates: number[];
  };
  street?: string | null;
  housenumber?: string | null;
};
