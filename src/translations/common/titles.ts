import type {
  CommonText,
  ContactFormTranslationsOverride,
} from '@mrfylke/contact-form';
import { translation as _ } from '@atb/translations/commons';
import { byOrg } from '@atb/modules/org-data';

type TitlesFull = typeof CommonText.Titles;
type TitlesOverride = NonNullable<
  ContactFormTranslationsOverride['common']
>['Titles'];

const titlesByOrg = {
  atb: { siteTitle: _('AtB Reisesøk', 'AtB Travel Search', 'AtB Reisesøk') },
  nfk: { siteTitle: _('Reis Reisesøk', 'Reis Travel Search', 'Reis Reisesøk') },
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
};

/**
 * Full, resolved Titles for the current org - used directly by planner-web's
 * own general pages.
 *
 * TODO: this couples planner-web's own site title to the contact-form
 * package's override mechanism (it's built from the same org data that feeds
 * TitlesOverride below). Decouple these once planner-web's non-contact-form
 * branding text has a home that isn't shaped around the widget's translation
 * overrides.
 */
export const Titles: TitlesFull = byOrg(titlesByOrg)!;

/** Partial override fed into the contact-form widget's config.translations. */
export const TitlesOverride: TitlesOverride = byOrg(titlesByOrg) ?? {};
