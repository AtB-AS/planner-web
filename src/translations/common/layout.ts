import { translation as _ } from '@atb/translations/commons';
import { orgSpecificTranslations } from '@atb/translations/utils';

const LayoutInternal = {
  meta: {
    defaultDescription: _(
      'Finn rutetider, holdeplasser og tilbud for buss, trikk, båt og tog i Trøndelag med reiseplanleggeren.',
      'Find timetables, stops and offers for bus, tram, boat and train in Trøndelag with the travel planner.',
      'Finn rutetider, haldeplassar og tilbod for buss, trikk, båt og tog i Trøndelag med reiseplanleggjaren.',
    ),
  },
};

export const Layout = orgSpecificTranslations(LayoutInternal, {
  nfk: {
    meta: {
      defaultDescription: _(
        'Finn rutetider, holdeplasser og tilbud for buss, trikk, båt og tog i Nordland med reiseplanleggeren.',
        'Find timetables, stops and offers for bus, tram, boat and train in Nordland with the travel planner.',
        'Finn rutetider, haldeplassar og tilbod for buss, trikk, båt og tog i Nordland med reiseplanleggjaren.',
      ),
    },
  },
  fram: {
    meta: {
      defaultDescription: _(
        'Finn rutetider, holdeplasser og tilbud for buss, trikk, båt og tog i Møre og Romsdal med reiseplanleggeren.',
        'Find timetables, stops and offers for bus, tram, boat and train in Møre og Romsdal with the travel planner.',
        'Finn rutetider, haldeplassar og tilbod for buss, trikk, båt og tog i Møre og Romsdal med reiseplanleggjaren.',
      ),
    },
  },
});
