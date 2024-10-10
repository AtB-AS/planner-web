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
      'Svipper Reisesøk',
      'Svipper Travel Search',
      'Svipper Reisesøk',
    ),
  },
  vkt: {
    siteTitle: _(
      'Vestfold Kollektivtrafikk Reisesøk',
      'Vestfold Kollektivtrafikk Travel Search',
      'Vestfold Kollektivtrafikk Reisesøk',
    ),
  },
  farte: {
    siteTitle: _('Farte Reisesøk', 'Farte Travel Search', 'Farte Reisesøk'),
  },
});
