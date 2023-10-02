import { FeatureCategory } from '@atb/components/venue-icon';

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
