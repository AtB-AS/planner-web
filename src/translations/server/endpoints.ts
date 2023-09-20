import {translation as _} from '@atb/translations/commons';
import {orgSpecificTranslations} from '../utils';

const EndpointsInternal = {
  empty: _('', '', ''),

  rateLimit: _(
    'For mange forsøk. Prøv igjen senere.',
    'Rate limit exceeded.',
    'For mange forsøk. Prøv igjen seinare.',
  ),
  serverError: _(
    'Ukjent feil med tjenesten.',
    'Internal server error.',
    'Ukjend feil med tenesta.',
  ),
  serverErrorGeneric: (err: string) => _(err, err, err),
  accessError: _(
    'Du har ikke tilgang. Prøv å logge inn på nytt.',
    "You don't have the necessary access. Try logging in again",
    'Du har ikkje tilgang. Prøv å logge inn på nytt.',
  ),
  invalidMethod: _(
    'Ugyldig forespørsel.',
    'Invalid method.',
    'Ugyldig førespurnad.',
  ),
  invalidData: _('Ugyldig data.', 'Invalid data.', 'Ugyldig data.'),
  decodeError: _(
    'Kunne ikke hente ut data.',
    'Could not decode received data.',
    'Kunne ikkje hente ut data.',
  ),
  recurringPayment: {
    missingId: _(
      'Mangler betalingsid.',
      'Missing payment id.',
      'Manglar betalingsid.',
    ),
  },
  behalfOfOthers: {
    register: {
      missingAlias: _('Mangler navn.', 'Missing alias.', 'Manglar namn.'),
      success: (alias: string) =>
        _(
          `${alias} ble opprettet.`,
          `${alias} was created.`,
          `${alias} blei oppretta.`,
        ),
    },
    updatedAlias: _(
      'Kallenavn oppdatert.',
      'Nickname updated.',
      'Kallenavn oppdatert.',
    ),
    deletedAccount: _('Person slettet.', 'Person deleted.', 'Person sletta.'),
    missingId: _(
      'Mangler bruker id.',
      'Missing user id.',
      'Manglar id for brukar.',
    ),
    missingAccount: _('Feil konto.', 'Wrong account.', 'Feil konto.'),

    serverErrors: {
      aliasExists: _(
        'Du har alt en person med det kallenavnet.',
        'Person with the alias already exists',
        'Du har allereie ein person med det kallenamnet.',
      ),
      travelCardExists: _(
        't:kortet er registert hos noen andre.',
        't:card is already registered to another account.',
        't:kortet er registert hos nokon andre.',
      ),
    },
  },
  serverErrors: {
    travelCardExists: _(
      't:kortet er registert hos noen andre.',
      't:card is already registered to another account.',
      't:kortet er registert hos nokon andre.',
    ),
  },
  travelCard: {
    missingId: _(
      'Mangler t:kort nummer.',
      'Missing t:card number.',
      'Manglar t:kort nummer.',
    ),
    successAdd: _('Lagt til t:kort.', 't:card added.', 'Lagt til t:kort.'),
    successRemove: _(
      'Fjernet t:kort.',
      't:card successfully removed.',
      'Fjerna t:kort.',
    ),
    blocked: _(
      'Reisekort er blokkert.',
      'Travelcard is blocked.',
      'Reisekort er blokkert.',
    ),
    notExist: _(
      'Reisekort finnes ikke.',
      'Travelcard does not exist.',
      'Reisekort finst ikkje.',
    ),
    couldNotValidate: _(
      'Kunne ikke validere reisekort.',
      'Could not validate travelcard.',
      'Kunne ikkje validere reisekort.',
    ),
  },
  consents: {
    missingConsent: _(
      'Ugyldig forespørsel, ikke sendt med samtykke.',
      'Not a valid request, missing consent.',
      'Ugyldig førespurnad, ikkje sendt med samtykke.',
    ),
    missingEmail: _(
      'Du har ikke satt en e-post på profilen din.',
      'You need to specify e-mail in profile settings.',
      'Du har ikkje sett ein e-post på profilen din.',
    ),
    success: _(
      'Oppdatert samtykker.',
      'Consents updated.',
      'Oppdaterte samtykker.',
    ),
  },
  searchOffer: {
    missingData: _(
      'Mangler informasjon i forespørselen.',
      'Missing information in request.',
      'Manglar informasjon i førespurnaden.',
    ),
    missingStopPlaces: _(
      'Du må velge fra- og til-holdeplass.',
      'You have to select a from stop and a to stop.',
      'Du må velje frå- og til-holdeplass.',
    ),
    missingFromStopPlaces: _(
      'Du må velge fra-holdeplass.',
      'You have to select a from stop.',
      'Du må velje frå-holdeplass.',
    ),
    missingToStopPlace: _(
      'Du må velge til-holdeplass.',
      'You have to select a to stop.',
      'Du må velje til-holdeplass.',
    ),
    travelDateIsNotNextMorning: (timestamp: string) =>
      _(
        `Starttidspunkt kan tidligst være klokken ${timestamp} neste dag.`,
        `Validity start cannot be earlier than ${timestamp} AM the following day.`,
        `Starttidspunkt kan tidlegast vere klokka ${timestamp} neste dag.`,
      ),
  },
  reserve: {
    missingData: _(
      'Mangler informasjon i forespørselen.',
      'Missing information in request.',
      'Manglar informasjon i førespurnaden.',
    ),
  },
  sendReceipt: {
    missingEmail: _(
      'Du har ikke satt en e-post på profilen din.',
      'You need to specify e-mail in profile settings.',
      'Du har ikkje sett ein e-post på profilen din.',
    ),
    missingOrderData: _(
      'Fant ikke billett du spør etter.',
      'Could not find ticket.',
      'Fann ikkje billett du spør etter.',
    ),
    success: _(
      'Kvittering sendt til din e-post.',
      'Receipt sent to your e-mail.',
      'Kvittering sendt til din e-post.',
    ),
  },
  updateProfile: {
    missingProfileData: _(
      'Mangelfull data sendt til oppdatering.',
      'Invalid profile data.',
      'Mangelfull data sendt til oppdatering.',
    ),
    success: _('Oppdatert profil.', 'Updated profile.', 'Oppdatert profil.'),
  },
  registerProfile: {
    success: _('Opprettet profil.', 'Created profile.', 'Oppretta profil.'),
  },
};

export const Endpoints = orgSpecificTranslations(EndpointsInternal, {
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
});
