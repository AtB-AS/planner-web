import { FeatureCategory } from '@atb/components/venue-icon';

export type AutocompleteFeature = {
  id: string;
  name: string;
  locality?: string;
  category: FeatureCategory[];
  layer: string;
  geometry: {
    coordinates: number[];
  };
};
