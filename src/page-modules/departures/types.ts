import { FeatureCategory } from '@atb/components/venue-icon';

export type AutocompleteFeature = {
  name: string;
  locality: string;
  category: FeatureCategory[];
  layer: string;
  geometry: {
    coordinates: number[];
  };
};
