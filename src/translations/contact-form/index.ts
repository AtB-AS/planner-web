import type { ContactFormTranslationsOverride } from '@mrfylke/contact-form';
import { byOrg } from '@atb/modules/org-data';
import { atbTranslations } from './atb';
import { framTranslations } from './fram';

export const translations: ContactFormTranslationsOverride =
  byOrg({ atb: atbTranslations, fram: framTranslations }) ?? {};
