export type AutocompleteFeature = {
  name: string;
  locality: string;
  category: string[];
  layer: string;
  geometry: {
    coordinates: number[];
  };
};
