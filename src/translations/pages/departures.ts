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
    filter: {
      label: _(
        'Hva vil du reise med?',
        'How do you want to travel?',
        'Kva vil du reise med?',
      ),
    },
    buttons: {
      find: {
        title: _('Finn avganger', 'Find departures', 'Finn avganger'),
      },
      alternatives: {
        title: _('Flere valg', 'More choices', 'Fleire val'),
      },
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
    emptySearchResults: {
      emptyNearbyLocationsTitle: _(
        'Finner ingen holdeplasser i nærheten',
        'No nearby stop places found',
        'Finn ingen haldeplassar i nærleiken',
      ),
      emptyNearbyLocationsDetails: _(
        'Prøv å søke på et annet navn eller bruk et annet stoppested for å finne avganger i nærheten.',
        'Try to search for another name or use another stop place to find departures nearby.',
        'Prøv å søkje på eit anna namn eller bruk ein annan stoppestad for å finne avgangar i nærleiken.',
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
      refreshButton: _('Oppdater', 'Refresh', 'Oppdater'),
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
