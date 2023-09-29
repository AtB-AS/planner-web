import { FeatureCategory } from '@atb/components/venue-icon';
import { DeparturesData } from './server/journey-planner';

export type GeocoderFeature = {
  id: string;
  name: string;
  locality?: string;
  category: FeatureCategory[];
  layer: string;
  geometry: {
    coordinates: number[];
  };
};

export type { DeparturesData };
