import { translation as _ } from '@atb/translations/commons';

export const Departures = {
  title: _('Finn avganger', 'Find departures', 'Finn avganger'),
  shortTitle: _('Avganger', 'Departures', 'Avganger'),
  search: {
    input: {
      label: _(
        'Hvor vil du reise fra?',
        'Where do you want to travel from?',
        'Kor vil du reise frå?',
      ),
      from: _('Fra', 'From', 'Frå'),
      placeholder: _(
        'adresse, kai eller holdeplass',
        'address, pier or bus stop',
        'adresse, kai eller haldeplass',
      ),
    },
    date: {
      label: _(
        'Når vil du reise?',
        'When do you want to travel?',
        'Når vil du reise?',
      ),
    },
    buttons: {
      find: {
        title: _('Finn avganger', 'Find departures', 'Finn avganger'),
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
      cancelled: _(
        'Avgangen fra denne holdeplassen er kansellert.',
        'The departure from this stop has been cancelled.',
        'Avgangen frå denne haldeplassen er kansellert.',
      ),
    },
  },
  details: {
    back: _(
      'Tilbake til avganger',
      'Back to departures',
      'Tilbake til avgangar',
    ),
    lastPassedStop: (stopPlaceName: string, time: string) =>
      _(
        `Passerte ${stopPlaceName} kl. ${time}`,
        `Passed ${stopPlaceName} at ${time}`,
        `Passerte ${stopPlaceName} kl. ${time}`,
      ),
    noPassedStop: (stopPlaceName: string, time: string) =>
      _(
        `Kjører fra ${stopPlaceName} kl. ${time}`,
        `Departs from ${stopPlaceName} at ${time}`,
        `Køyrer frå ${stopPlaceName} kl. ${time}`,
      ),
    onTime: _(`I rute`, `On time`, `I rute`),
    notOnTime: _(`Etter rutetid`, `Behind scheduled time`, `Etter rutetid`),
    time: {
      aimedPrefix: _('Rutetid', 'Route time', `Rutetid`),
      expectedPrefix: _('Sanntid', 'Realtime', `Sanntid`),
    },
    collapse: {
      label: (numberStops: number) =>
        _(
          `${numberStops} mellomstopp`,
          `${numberStops} intermediate stops`,
          `${numberStops} mellomstopp`,
        ),
      a11yHint: _(
        'Aktivér for å vise alle mellomstopp.',
        'Activate to show intermediate stops',
        'Aktiver for å vise alle mellomstopp',
      ),
    },
    messages: {
      loading: _('Laster detaljer', 'Loading details', 'Lastar detaljar'),
      noAlighting: _('Ingen avstigning', 'No disembarking', 'Ingen avstiging'),
      noBoarding: _('Ingen påstigning', 'No boarding', 'Ingen påstiging'),
      noActiveItem: _(
        'Ojda! Noe gikk galt med lasting av detaljer for denne reisen.',
        'Oops! We had some issues loading the details for this journey.',
        'Oi då! Noko gjekk gale med lasting av detaljar for denne reisa.',
      ),
    },
  },
};
