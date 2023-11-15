import { z } from 'zod';

export enum LanguageAndTextLanguagesEnum {
  'nob' = 'nob',
  'nno' = 'nno',
  'nn' = 'nn',
  'nor' = 'nor',
  'no' = 'no',
  'eng' = 'eng',
  'en' = 'en',
}

export const languageAndTextSchema = z.union([
  z.object({
    lang: z.string(),
    value: z.string(),
  }),
  z.object({
    language: z.string().optional(),
    value: z.string().optional(),
  }),
]);

export type LanguageAndTextType = z.infer<typeof languageAndTextSchema>;
