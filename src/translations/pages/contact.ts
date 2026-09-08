import type { ContactFormTranslationsOverride } from '@mrfylke/contact-form';
import { translation as _ } from '@atb/translations/commons';
import { byOrg } from '@atb/modules/org-data';

type ContactOverride = NonNullable<
  ContactFormTranslationsOverride['pages']
>['Contact'];

export const contactPageTitle = _('Kontakt', 'Contact', 'Kontakt');

export const Contact: ContactOverride =
  byOrg({
    fram: {
      ticketControl: {
        feeComplaint: {
          ticketStorage: {
            app: {
              title: _(
                'Mobilapp (f.eks. FRAM, Entur)',
                'Mobile app (e.g. FRAM, Entur)',
                'Mobilapp (f.eks. FRAM, Entur)',
              ),
            },
          },
        },
      },
    },
  }) ?? {};
