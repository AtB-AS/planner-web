import type { ContactFormTranslationsOverride } from '@mrfylke/contact-form';
import { translation as _ } from '@atb/translations/commons';
import { byOrg } from '@atb/modules/org-data';

export const translations: ContactFormTranslationsOverride = {
  pages: {
    Contact:
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
      }) ?? {},
  },
};
