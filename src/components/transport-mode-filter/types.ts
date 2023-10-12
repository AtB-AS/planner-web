export const transportModeFilterOptions = [
  'bus',
  'rail',
  'expressboat',
  'ferry',
  'airportbus',
  'air',
  'other',
] as const;

export type TransportModeFilterOption =
  (typeof transportModeFilterOptions)[number];

export type TransportModeFilterState = Record<
  TransportModeFilterOption,
  boolean
>;
