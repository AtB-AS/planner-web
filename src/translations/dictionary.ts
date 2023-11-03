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
  travel: {
    legModes: {
      bus: _('Buss', 'Bus', `Buss`),
      rail: _('Tog', 'Train', `Tog`),
      tram: _('Trikk', 'Tram', `Trikk`),
      water: _('Båt', 'Boat', `Båt`),
      air: _('Fly', 'Plane', `Fly`),
      foot: _('Gange', 'Walk', `Gange`),
      metro: _('T-bane', 'Metro', `T-bane`),
      bicycle: _('Sykkel', 'Bicycle', `Sykkel`),
      unknown: _(
        'Ukjent transportmiddel',
        'Unknown transport',
        `Ukjent transportmiddel`,
      ),
    },
    quay: {
      defaultName: _(
        'Ukjent stoppestedsnavn',
        'Unknown name of stop place',
        `Ukjent namn på stoppestad`,
      ),
    },
    line: {
      defaultName: _(
        'Ukjent linjenavn',
        'Unknown line name',
        `Ukjent namn på linje`,
      ),
    },
    time: {
      aimedPrefix: _('Rutetid', 'Route time', `Rutetid`),
      expectedPrefix: _('Sanntid', 'Realtime', `Sanntid`),
    },
  },
};

export default orgSpecificTranslations(dictionary, {
  nfk: {},
  fram: {},
});
