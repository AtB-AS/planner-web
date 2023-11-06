export const SEARCH_MODES = ['now', 'arriveBy', 'departBy'] as const;
export type SearchMode = (typeof SEARCH_MODES)[number];

export type SearchTime =
  | {
      mode: 'now';
    }
  | {
      mode: 'arriveBy' | 'departBy';
      dateTime: number;
    };
