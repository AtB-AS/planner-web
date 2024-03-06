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
    siteTitle: _(
      'FRAM Reiseplanlegger',
      'FRAM Travel Search',
      'FRAM Reiseplanleggar',
    ),
  },
  troms: {
    siteTitle: _(
      'Troms fylkestrafikk Reisesøk',
      'Troms fylkestrafikk Travel Search',
      'Troms fylkestrafikk Reisesøk',
    ),
  },
});
