import { z } from 'zod';

export const linesSchema = z.record(z.string(), z.array(z.string()));

export type LineData = z.infer<typeof linesSchema>;
