import { ThemeVariant } from '@atb-as/theme';
import { WEBSHOP_ORGS } from '@atb/modules/org-data';

const themeVariants: Record<WEBSHOP_ORGS, ThemeVariant> = {
  atb: ThemeVariant.AtB,
  nfk: ThemeVariant.Nfk,
  fram: ThemeVariant.FRAM,
  vkt: ThemeVariant.VKT,
  farte: ThemeVariant.Farte,
};

export function getThemeVariant(orgId: WEBSHOP_ORGS): ThemeVariant {
  return themeVariants[orgId];
}
