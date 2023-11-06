import { translation as _ } from '@atb/translations/commons';
import { TransportModeType } from '@atb/components/transport-mode/types';

export const Assistant = {
  title: _('Planlegg reisen', 'Plan travel', 'Planlegg reisa'),
  shortTitle: _('Reiseplanlegger', 'Assistant', 'Reiseplanleggar'),
  search: {
    input: {
      label: _(
        'Hvor vil du reise?',
        'Where do you want to go?',
        'Kor vil du reise?',
      ),
      from: _('Fra', 'From', 'Frå'),
      to: _('Til', 'To', 'Til'),
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
    searching: _(
      'Laster reiseforslag...',
      'Loading travel suggestion...',
      'Lastar resiseforslag...',
    ),
  },
  trip: {
    tripPattern: {
      travelFrom: (mode: TransportModeType, place: string) => {
        switch (mode) {
          case 'bus':
          case 'coach':
            return _(
              `Buss fra ${place}`,
              `Bus from ${place}`,
              `Buss frå ${place}`,
            );
          case 'tram':
            return _(
              `Trikk fra ${place}`,
              `Tram from ${place}`,
              `Trikk frå ${place}`,
            );
          case 'metro':
            return _(
              `T-bane fra ${place}`,
              `Metro from ${place}`,
              `T-bane frå ${place}`,
            );
          case 'rail':
            return _(
              `Tog fra ${place}`,
              `Train from ${place}`,
              `Tog frå ${place}`,
            );
          case 'water':
            return _(
              `Båt fra ${place}`,
              `Boat from ${place}`,
              `Båt frå ${place}`,
            );
          case 'air':
            return _(
              `Fly fra ${place}`,
              `Air from ${place}`,
              `Fly frå ${place}`,
            );
          case 'bicycle':
            return _(
              `Sykkel fra ${place}`,
              `Bike from ${place}`,
              `Sykkel frå ${place}`,
            );
          case 'foot':
            return _(
              `Gå fra ${place}`,
              `Walk from ${place}`,
              `Gå frå ${place}`,
            );
          default:
            return _(`Fra ${place}`, `From ${place}`, `Frå ${place}`);
        }
      },
      details: _('Detaljer', 'Details', 'Detaljar'),
    },
    fetchMore: _(
      'Last inn flere reiseforslag',
      'Load more results',
      'Last inn fleire reiseforslag',
    ),
    nonTransit: {
      foot: _('Gå', 'Walk', 'Gå'),
      bicycle: _('Sykkel', 'Bike', 'Sykkel'),
      bikeRental: _('Bysykkel', 'City bike', 'Bysykkel'),
      unknown: _('Ukjent', 'Unknown', 'Ukjent'),
    },
    emptySearchResults: {
      emptySearchResultsTitle: _(
        'Ingen kollektivreiser passer til ditt søk',
        'No public transportation routes match your search criteria',
        'Ingen kollektivreiser passar til søket ditt',
      ),
      emptySearchResultsDetails: _(
        'Prøv å justere på sted eller tidspunkt.',
        'Try adjusting your time or location input.',
        'Prøv å justere på stad eller tidspunkt.',
      ),
      emptySearchResultsDetailsWithFilters: _(
        'Prøv å justere på sted, filter eller tidspunkt.',
        'Try adjusting your time, filters or location input.',
        'Prøv å justere på stad, filter eller tidspunkt.',
      ),
    },
  },
};
