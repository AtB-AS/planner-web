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
    atTime: _(`kl.`, `at`, `kl.`),
    relativeDayNames: (daysDifference: number) => {
      switch (daysDifference) {
        case -2:
          return _('i forgårs', 'the day before yesterday', 'i forgårs');
        case -1:
          return _('i går', 'yesterday', 'i går');
        case 0:
          return _('i dag', 'today', 'i dag');
        case 1:
          return _('i morgen', 'tomorrow', 'i morgon');
        case 2:
          return _('i overmorgen', 'day after tomorrow', 'i overmorgon');
        default:
          if (daysDifference < 0) {
            return _(
              `for ${daysDifference} dager siden`,
              `${daysDifference} days ago`,
              `for ${daysDifference} dagar sidan`,
            );
          } else {
            return _(
              `om ${daysDifference} dager`,
              `in ${daysDifference} days`,
              `om ${daysDifference} dagar`,
            );
          }
      }
    },
  },
  distance: {
    km: _('km', 'km', 'km'),
    m: _('m', 'm', 'm'),
  },
  a11yRouteTimePrefix: _('rutetid ', 'route time ', `rutetid `),
  missingRealTimePrefix: _('ca. ', 'ca. ', `ca. `),
  readMore: _('Les mer', 'Read more', `Les meir`),
  close: _('Lukk', 'Close', 'Lukk'),
  listConcatWord: _('og', 'and', 'og'),
  via: _('via', 'via', 'via'),
};

export default orgSpecificTranslations(dictionary, {
  nfk: {},
  fram: {},
});
