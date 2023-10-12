export const travelSearchFilterOptions = [
  'bus',
  'rail',
  'expressboat',
  'ferry',
  'airportbus',
  'air',
  'other',
] as const;

export type TravelSearchFilterOption =
  (typeof travelSearchFilterOptions)[number];

export type TravelSearchFilterState = Record<TravelSearchFilterOption, boolean>;
