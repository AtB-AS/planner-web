import { translation as _ } from '@atb/translations/commons';
import { orgSpecificTranslations } from '../utils';

const TitlesInternal = {
  siteTitle: _('AtB (nb)', 'AtB (en)', 'AtB  (nn)'),
};

export const Titles = orgSpecificTranslations(TitlesInternal, {
  nfk: {
    siteTitle: _('Reis', 'Reis', 'Reis'),
  },
  fram: {
    siteTitle: _('FRAM', 'FRAM', 'FRAM'),
  },
});
