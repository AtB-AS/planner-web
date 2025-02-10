import { translation as _ } from '@atb/translations/commons';
import { orgSpecificTranslations } from '@atb/translations/utils';

const LayoutInternal = {
  homeLink: (name: string) =>
    _(`Gå til ${name}`, `Gå to ${name}`, `Gå til ${name}`),

  contactLink: _('Kontaktskjema', 'Contact form', 'Kontaktskjema'),

  meta: {
    defaultDescription: _(
      'Finn rutetider, holdeplasser og tilbud for buss, trikk, båt og tog i Trøndelag med reiseplanleggeren.',
      'Find timetables, stops and offers for bus, tram, boat and train in Trøndelag with the travel planner.',
      'Finn rutetider, haldeplassar og tilbod for buss, trikk, båt og tog i Trøndelag med reiseplanleggaren.',
    ),
  },
};

export const Layout = orgSpecificTranslations(LayoutInternal, {
  nfk: {
    meta: {
      defaultDescription: _(
        'Finn rutetider, holdeplasser og tilbud for buss, båt og tog i Nordland med reiseplanleggeren.',
        'Find timetables, stops and offers for bus, boat and train in Nordland with the travel planner.',
        'Finn rutetider, haldeplassar og tilbod for buss, båt og tog i Nordland med reiseplanleggaren.',
      ),
    },
  },
  fram: {
    meta: {
      defaultDescription: _(
        'Finn rutetider, holdeplasser, kaier og tilbud for buss, hurtigbåt og ferge i Møre og Romsdal med reiseplanleggeren.',
        'Find timetables, stops and offers for bus, boat and ferry in Møre og Romsdal with the travel planner.',
        'Finn rutetider, haldeplassar, kaier og tilbod for buss, hurtigbåt og ferje i Møre og Romsdal med reiseplanleggaren.',
      ),
    },
  },
  troms: {
    meta: {
      defaultDescription: _(
        'Finn rutetider, holdeplasser, kaier og tilbud for buss, hurtigbåt og ferge i Troms med reiseplanleggeren.',
        'Find timetables, stops and offers for bus, boat and ferry in Troms with the travel planner.',
        'Finn rutetider, haldeplassar, kaier og tilbod for buss, hurtigbåt og ferje i Troms med reiseplanleggaren.',
      ),
    },
  },
  vkt: {
    meta: {
      defaultDescription: _(
        'Finn rutetider, holdeplasser, kaier og tilbud for buss, hurtigbåt og ferge i Vestfold med reiseplanleggeren.',
        'Find timetables, stops and offers for bus, boat and ferry in Vestfold with the travel planner.',
        'Finn rutetider, haldeplassar, kaier og tilbod for buss, hurtigbåt og ferje i Vestfold med reiseplanleggaren.',
      ),
    },
  },
  farte: {
    meta: {
      defaultDescription: _(
        'Finn rutetider, holdeplasser, kaier og tilbud for buss, hurtigbåt og ferge i Telemark med reiseplanleggeren.',
        'Find timetables, stops and offers for bus, boat and ferry in Telemark with the travel planner.',
        'Finn rutetider, haldeplassar, kaier og tilbod for buss, hurtigbåt og ferje i Telemark med reiseplanleggaren.',
      ),
    },
  },
});
