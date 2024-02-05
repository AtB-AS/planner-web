import { translation as _ } from '@atb/translations/commons';

export const DepartureTime = {
  time: {
    aimedPrefix: _('Rutetid', 'Route time', `Rutetid`),
    expectedPrefix: _('Sanntid', 'Realtime', `Sanntid`),
  },
  cancelled: _(
    'Avgangen fra denne holdeplassen er kansellert.',
    'The departure from this stop has been cancelled.',
    'Avgangen frå denne haldeplassen er kansellert.',
  ),
};
