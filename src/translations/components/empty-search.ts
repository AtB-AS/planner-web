import { translation as _ } from '@atb/translations/commons';

export const EmptySearch = {
  notSearched: _(
    'Du har ikke gjennomført et søk enda.',
    'You have not created a search yet.',
    'Du har ikkje gjennomført eit søk enno.',
  ),

  emptyDetails: {
    trip: _(
      'Reiseforslagene dukker opp her når du søker etter det.',
      'Travel suggestions will appear here when you search for it.',
      'Reiseforslaga dukkar opp her når du søkjer etter det.',
    ),
    nearby: _(
      'Avganger dukker opp her når du søker etter det.',
      'Departures will appear here when you search for it.',
      'Avgangar dukkar opp her når du søkjer etter det.',
    ),
    stopPlace: _(
      'Avganger dukker opp her når du søker etter det.',
      'Departures will appear here when you search for it.',
      'Avgangar dukkar opp her når du søkjer etter det.',
    ),
  },
  searching: {
    trip: _(
      'Laster reiseforslag...',
      'Loading travel suggestions...',
      'Lastar reiseforslag...',
    ),
    nearby: _(
      'Laster holdeplasser...',
      'Loading stop places...',
      'Lastar haldeplassar...',
    ),
    stopPlace: _(
      'Laster avganger...',
      'Loading departures...',
      'Lastar avgangar...',
    ),
  },
  nearbyNoGeolocation: {
    title: _(
      'Holdeplasser i nærheten er ikke tilgjengelig',
      'Stop places nearby are not available',
      'Haldeplassar i nærleiken er ikkje tilgjengeleg',
    ),
    details: _(
      'Del din posisjon for å finne holdeplasser i nærheten. Bruk søkefeltet for å finne andre holdeplasser.',
      'Share your position to find stop places nearby. Use the search field to find other stop places.',
      'Del din posisjon for å finne haldeplassar i nærleiken. Bruk søkefeltet for å finne andre haldeplassar.',
    ),
  },
};
