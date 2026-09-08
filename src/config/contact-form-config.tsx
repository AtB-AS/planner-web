import type { ContactFormConfig, FormSchemaName } from '@mrfylke/contact-form';
import { buildEnabledPageIds } from '@mrfylke/contact-form';
import { adaptAtbTheme } from '@mrfylke/contact-form/config';
import { theme } from '@atb/modules/theme';
import { byOrg } from '@atb/modules/org-data';
import {
  CommonText,
  ComponentText,
  PageText,
  ServerText,
} from '@atb/translations';

const contactFormTheme = adaptAtbTheme(theme);

const submitEndpoint = '/api/contact/submit';

const onSubmit = (
  schemaName: FormSchemaName,
  state: Record<string, unknown>,
): Promise<Response> => {
  return fetch(submitEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...state, formType: schemaName }),
  });
};

export const contactFormConfig: ContactFormConfig = {
  theme: contactFormTheme,
  api: {
    onSubmit,
  },
  features: {
    enableFileUploads: true,
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
  translations: {
    pages: PageText,
    components: ComponentText,
    common: {
      Titles: CommonText.TitlesOverride,
      Layout: CommonText.LayoutOverride,
    },
    server: { Endpoints: ServerText.EndpointsOverride },
  },
};
