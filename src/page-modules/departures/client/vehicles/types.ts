export type VehicleMode =
  | 'AIR'
  | 'BUS'
  | 'COACH'
  | 'FERRY'
  | 'METRO'
  | 'RAIL'
  | 'TRAM';

export type VehicleWithPosition = {
  serviceJourney: { id: string };
  location?: { latitude: number; longitude: number };
  bearing?: number;
  lastUpdated?: string;
  mode?: VehicleMode;
};
