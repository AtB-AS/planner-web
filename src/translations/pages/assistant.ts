import { translation as _ } from '@atb/translations/commons';

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
  },
  trip: {
    tripPattern: {
      busFrom: _('Buss fra', 'Bus from', 'Buss frå'),
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
    dayLabel: {
      today: () => _('I dag', 'Today', 'I dag'),
      tomorrow: (date: string) =>
        _(`I morgen - ${date}`, `Tomorrow - ${date}`, `I morgon - ${date}`),
      dayAfterTomorrow: (date: string) =>
        _(
          `I overmorgen - ${date}`,
          `Day after tomorrow - ${date}`,
          `I overmorgon - ${date}`,
        ),
    },
  },
};
