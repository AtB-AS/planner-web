import { translation as _ } from '@atb/translations/commons';

export const Endpoints = {
  resourceNotFound: _(
    'Fant ikke resursen.',
    'Resource not found.',
    'Fann ikkje ressursen.',
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
};
