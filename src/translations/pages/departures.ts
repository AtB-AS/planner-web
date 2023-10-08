import { translation as _ } from '@atb/translations/commons';

export const Departures = {
  title: _('Finn avganger', 'Find departures', 'Finn avganger'),
  shortTitle: _('Avganger', 'Departures', 'Avganger'),
  search: {
    input: {
      label: _(
        'Hvor vil du reise?',
        'Where do you want to go?',
        'Kor vil du reise?',
      ),
      from: _('Fra', 'From', 'Frå'),
    },
    date: {
      label: _(
        'Når vil du reise?',
        'When do you want to travel?',
        'Når vil du reise?',
      ),
    },
    button: {
      title: _('Finn avganger', 'Find departures', 'Finn avganger'),
    },
  },

  nearest: {
    stopPlaceItem: {
      stopPlace: _('Holdeplass', 'Stop', 'Haldeplass'),

      uuTitle: (name: string, distance: string) =>
        _(
          `Holdeplass ${name}. ${distance} meter gåavstand.`,
          `Stop place ${name}. ${distance} meters walking distance`,
          `Holdeplass ${name}. ${distance} meter gåavstand`,
        ),
    },
  },
  stopPlace: {
    noDepartures: _(
      'Ingen avganger i dette tidsrommet.',
      'No departures in the selected period of time.',
      'Ingen avgangar i dette tidsrommet.',
    ),
    quaySection: {
      a11yExpand: _(
        'Aktiver for å utvide',
        'Activate to expand',
        'Aktiver for å utvide',
      ),
      a11yMinimize: _(
        'Aktiver for å minimere',
        'Activate to minimize',
        'Aktiver for å minimere',
      ),
      a11yToQuayHint: _(
        'Aktiver for å vise flere avganger',
        'Activate to show more departures',
        'Aktiver for å vise fleire avgangar',
      ),
      moreDepartures: _(
        'Se flere avganger',
        'See more departures',
        'Sjå fleire avgangar',
      ),
    },
  },
};
