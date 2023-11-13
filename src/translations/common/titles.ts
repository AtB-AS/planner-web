import { translation as _ } from '@atb/translations/commons';
import { orgSpecificTranslations } from '../utils';

const TitlesInternal = {
  siteTitle: _('AtB Reisesøk', 'AtB Travel Search', 'AtB Reisesøk'),
};

export const Titles = orgSpecificTranslations(TitlesInternal, {
  nfk: {
    siteTitle: _('Reis Reisesøk', 'Reis Travel Search', 'Reis Reisesøk'),
  },
  fram: {
    siteTitle: _('FRAM Reisesøk', 'FRAM Travel Search', 'FRAM Reisesøk'),
  },
});
