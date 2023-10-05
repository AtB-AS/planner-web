import { FeatureCategory } from '@atb/components/venue-icon';

export type GeocoderFeature = {
  id: string;
  name: string;
  locality?: string;
  category: FeatureCategory[];
  layer: 'address' | 'venue';
  geometry: {
    coordinates: number[];
  };
};
