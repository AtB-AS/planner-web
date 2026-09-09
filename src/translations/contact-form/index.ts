import type { ContactFormTranslationsOverride } from '@mrfylke/contact-form';
import { translation as _ } from '@atb/translations/commons';
import { byOrg } from '@atb/modules/org-data';

/**
 * The only translation overrides actually fed to the contact-form widget.
 * Kept separate from planner-web's own translations (translations/pages,
 * translations/common, etc.) so it's structurally obvious which content is a
 * real override for @mrfylke/contact-form and which is planner-web's own.
 */
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
