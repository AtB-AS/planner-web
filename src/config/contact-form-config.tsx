import type { ContactFormConfig } from '@mrfylke/contact-form';
import { buildEnabledPageIds } from '@mrfylke/contact-form';
import { adaptAtbTheme } from '@mrfylke/contact-form/config';
import { theme } from '@atb/modules/theme';
import { byOrg } from '@atb/modules/org-data';
import { translations } from '@atb/translations/contact-form';

const contactFormTheme = adaptAtbTheme(theme);

export const contactFormConfig: ContactFormConfig = {
  theme: contactFormTheme,
  features: {
    enableFileUploads: true,
    includeOtherTicketTypeSelector: true,
    includeCustomerNumberAndPurchasePlatformInAppTicketRefund: true,
    enableRequiredLineInServiceOffering: true,
    includeOrderIdAndAmountInOtherTicketRefund: true,
    enableRequiredAttachmentInOtherTicketRefund: true,
  },
  pages: {
    enabledPageIds:
      byOrg({
        fram: buildEnabledPageIds([
          'ticket-control',
          'refund',
          'means-of-transport',
          'ticketing',
          'lost-property-external',
          'group-travel',
          'journey-info',
        ]),
      }) ??
      buildEnabledPageIds([
        'ticket-control',
        'refund',
        'means-of-transport',
        'ticketing',
        'lost-property',
        'group-travel',
        'journey-info',
      ]),
  },
  formSchemaOverrides: byOrg({
    fram: {
      refund: {
        enabledFormCategories: [
          'refundOfTicket',
          'refundAndTravelGuarantee',
          'residualValueOnTravelCard',
        ],
      },
    },
  }),
  translations,
};
