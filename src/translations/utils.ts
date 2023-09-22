import { currentOrg, type WEBSHOP_ORGS } from '@atb/modules/org-data';
import merge from 'lodash/merge';

export type LanguageOverrides<T> = {
  [P in keyof T]?: LanguageOverrides<T[P]>;
};
export function orgSpecificTranslations<T>(
  translationTexts: T,
  overrides: Partial<{ [org in WEBSHOP_ORGS]: LanguageOverrides<T> }>,
  orgId: WEBSHOP_ORGS = currentOrg,
) {
  return merge({}, translationTexts, overrides[orgId]);
}
