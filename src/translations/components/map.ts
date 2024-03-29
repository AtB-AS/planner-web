import { translation as _ } from '@atb/translations/commons';

export const Map = {
  header: {
    address: _(
      'Holdeplasser i nærheten av',
      'Stops near',
      'Haldeplasser i nærleiken av',
    ),
    venue: (address: string) =>
      _(`Ligger i ${address}`, `Located on ${address}`, `Ligg i ${address}`),
  },
  map: {
    openFullscreenButton: _('Se i kart', 'See in map', 'Sjå i kart'),
    closeFullscreenButton: _('Lukk kart', 'Close map', 'Lukk kart'),
    centerMapButton: _(
      'Tilbakestill kartvisning',
      'Reset map view',
      'Tilbakestill kartvisning',
    ),
    startPoint: _('Start', 'Start', 'Start'),
    endPoint: _('Slutt', 'End', 'Slutt'),
  },
  button: {
    travelFrom: _('Reis fra', 'Travel from', 'Reis frå'),
    travelTo: _('Reis til', 'Travel to', 'Reis til'),
  },
  loading: _('Laster...', 'Loading...', 'Lastar...'),
};
