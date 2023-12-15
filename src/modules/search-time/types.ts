import { z } from 'zod';

export const SEARCH_MODES: SearchMode[] = ['now', 'departBy', 'arriveBy'];

export const searchModeSchema = z.union([
  z.literal('now'),
  z.literal('departBy'),
  z.literal('arriveBy'),
]);

export type SearchMode = z.infer<typeof searchModeSchema>;

export type SearchTime =
  | {
      mode: 'now';
    }
  | {
      mode: 'arriveBy' | 'departBy';
      dateTime: number;
    };
