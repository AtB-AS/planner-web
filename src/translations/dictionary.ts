import { translation as _ } from './commons';
import { orgSpecificTranslations } from './utils';

const dictionary = {
  date: {
    units: {
      now: _('Nå', 'Now', 'No'),
      short: {
        year: _('år', 'y', 'år'),
        month: _('m', 'm', 'm'),
        week: _('u', 'w', 'v'),
        day: _('d', 'd', 'd'),
        hour: _('t', 'h', 't'),
        minute: _('min', 'min', 'min'),
        second: _('sek', 'sec', 'sek'),
        ms: _('ms', 'msec', 'ms'),
      },
      long: {},
    },
    at: _('klokken', 'at', 'klokka'),
  },
  distance: {
    km: _('km', 'km', 'km'),
    m: _('m', 'm', 'm'),
  },
  a11yRouteTimePrefix: _('rutetid ', 'route time ', `rutetid `),
  missingRealTimePrefix: _('ca. ', 'ca. ', `ca. `),
  readMore: _('Les mer', 'Read more', `Les meir`),
  close: _('Lukk', 'Close', 'Lukk'),
};

export default orgSpecificTranslations(dictionary, {
  nfk: {},
  fram: {},
});
