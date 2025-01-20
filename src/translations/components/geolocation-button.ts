import { translation as _ } from '@atb/translations/commons';

export const GeolocationButton = {
  alt: _('Finn min posisjon', 'Find my position', 'Finn min posisjon'),
  loading: _('Finner posisjon', 'Finding position', 'Finn posisjon'),
  error: {
    denied: _(
      'Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.',
      'You need to change your browser settings to use your position in the journey planner.',
      'Du må endre stadsinnstillingar i nettlesaren din for å bruke din posisjon i reisesøket.',
    ),
    unavailable: _(
      'Posisjonen din er ikke tilgjengelig.',
      'Your position is not available.',
      'Posisjonen din er ikkje tilgjengeleg.',
    ),
    timeout: _(
      'Det tok for lang tid å hente posisjonen din. Prøv på nytt.',
      'It took too long to get your position. Please try again.',
      'Det tok for lang tid å hente posisjonen din. Prøv på nytt.',
    ),
  },
};
