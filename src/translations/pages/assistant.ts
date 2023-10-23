import { translation as _ } from '@atb/translations/commons';

export const Assistant = {
  title: _('Planlegg reisen', 'Plan travel', 'Planlegg reisen'),
  shortTitle: _('Reiseplanlegger', 'Assistant', 'Reiseplanlegger'),
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
};
