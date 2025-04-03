import { z } from 'zod';

export const linesSchema = z.record(z.array(z.string()));

export type LineData = z.infer<typeof linesSchema>;
