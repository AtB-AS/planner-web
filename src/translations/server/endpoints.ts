import { ServerText } from '@mrfylke/contact-form';
import type { ContactFormTranslationsOverride } from '@mrfylke/contact-form';
import { translation as _ } from '@atb/translations/commons';
import { byOrg } from '@atb/modules/org-data';
import { orgSpecificTranslations } from '../utils';

type EndpointsOverride = NonNullable<
  ContactFormTranslationsOverride['server']
>['Endpoints'];

const endpointsOrgOverrides = {
  nfk: {
    serverErrors: {
      travelCardExists: _(
        'Reisekortet er registert hos noen andre.',
        'Travelcard is already registered to another account.',
        'Reisekortet er registrert hos nokon andre.',
      ),
    },
    behalfOfOthers: {
      serverErrors: {
        travelCardExists: _(
          'Reisekortet er registert hos noen andre.',
          'Travelcard is already registered to another account.',
          'Reisekortet er registrert hos nokon andre.',
        ),
      },
    },
    travelCard: {
      missingId: _(
        'Mangler reisekort nummer.',
        'Missing travelcard number.',
        'Manglar reisekortnummer.',
      ),
      successAdd: _(
        'Lagt til reisekort.',
        'Travelcard added.',
        'Reisekort lagt til.',
      ),
      successRemove: _(
        'Fjernet reisekort.',
        'Travelcard successfully removed.',
        'Fjerna reisekort.',
      ),
    },
  },
  farte: {
    serverErrors: {
      travelCardExists: _(
        'Reisekortet er registert hos noen andre.',
        'Travelcard is already registered to another account.',
        'Reisekortet er registrert hos nokon andre.',
      ),
    },
    behalfOfOthers: {
      serverErrors: {
        travelCardExists: _(
          'Reisekortet er registert hos noen andre.',
          'Travelcard is already registered to another account.',
          'Reisekortet er registrert hos nokon andre.',
        ),
      },
    },
    travelCard: {
      missingId: _(
        'Mangler reisekort nummer.',
        'Missing travelcard number.',
        'Manglar reisekortnummer.',
      ),
      successAdd: _(
        'Lagt til reisekort.',
        'Travelcard added.',
        'Reisekort lagt til.',
      ),
      successRemove: _(
        'Fjernet reisekort.',
        'Travelcard successfully removed.',
        'Fjerna reisekort.',
      ),
    },
  },
  vkt: {
    serverErrors: {
      travelCardExists: _(
        'Reisekortet er registert hos noen andre.',
        'Travelcard is already registered to another account.',
        'Reisekortet er registrert hos nokon andre.',
      ),
    },
    behalfOfOthers: {
      serverErrors: {
        travelCardExists: _(
          'Reisekortet er registert hos noen andre.',
          'Travelcard is already registered to another account.',
          'Reisekortet er registrert hos nokon andre.',
        ),
      },
    },
    travelCard: {
      missingId: _(
        'Mangler reisekort nummer.',
        'Missing travelcard number.',
        'Manglar reisekortnummer.',
      ),
      successAdd: _(
        'Lagt til reisekort.',
        'Travelcard added.',
        'Reisekort lagt til.',
      ),
      successRemove: _(
        'Fjernet reisekort.',
        'Travelcard successfully removed.',
        'Fjerna reisekort.',
      ),
    },
  },
  fram: {
    serverErrors: {
      travelCardExists: _(
        'Reisekortet er registert hos noen andre.',
        'Travelcard is already registered to another account.',
        'Reisekortet er registrert hos nokon andre.',
      ),
    },
    behalfOfOthers: {
      serverErrors: {
        travelCardExists: _(
          'Reisekortet er registert hos noen andre.',
          'Travelcard is already registered to another account.',
          'Reisekortet er registrert hos nokon andre.',
        ),
      },
    },
    travelCard: {
      missingId: _(
        'Mangler reisekort nummer.',
        'Missing travelcard number.',
        'Manglar reisekortnummer.',
      ),
      successAdd: _(
        'Lagt til reisekort.',
        'Travelcard added.',
        'Reisekort lagt til.',
      ),
      successRemove: _(
        'Fjernet reisekort.',
        'Travelcard successfully removed.',
        'Fjerna reisekort.',
      ),
    },
    consents: {
      missingEmail: _(
        'Du har ikke satt en e-post på brukeren din.',
        'You need to specify e-mail in user settings.',
        'Du har ikkje sett ein e-post på brukaren din.',
      ),
    },
    updateProfile: {
      missingProfileData: _(
        'Mangelfull data sendt til oppdatering.',
        'Invalid user data.',
        'Mangelfull data sendt til oppdatering.',
      ),
      success: _('Oppdatert bruker.', 'Updated user.', 'Oppdatert brukar.'),
    },
    sendReceipt: {
      missingEmail: _(
        'Du har ikke satt en e-post på brukeren din.',
        'You need to specify e-mail in user settings.',
        'Du har ikkje sett ein e-post på brukaren din.',
      ),
    },
    registerProfile: {
      success: _('Opprettet bruker.', 'Created user.', 'Oppretta brukar.'),
    },
  },
};

/**
 * Full, resolved Endpoints translations for the current org - used directly
 * by planner-web's own server code (API routes etc.), not just the widget.
 *
 * TODO: this couples planner-web's own general server-error text to the
 * contact-form package's override mechanism (it's built from the same
 * org-delta that feeds EndpointsOverride below). Decouple these once
 * planner-web's non-contact-form error text has a home that isn't shaped
 * around the widget's translation overrides.
 */
export const Endpoints: typeof ServerText.Endpoints = orgSpecificTranslations(
  ServerText.Endpoints,
  endpointsOrgOverrides,
);

/** Partial override fed into the contact-form widget's config.translations. */
export const EndpointsOverride: EndpointsOverride =
  byOrg(endpointsOrgOverrides) ?? {};
