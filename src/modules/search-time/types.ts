import { z } from 'zod';

export const SEARCH_MODES: SearchMode[] = ['now', 'arriveBy', 'departBy'];

export const searchModeSchema = z.union([
  z.literal('now'),
  z.literal('arriveBy'),
  z.literal('departBy'),
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
