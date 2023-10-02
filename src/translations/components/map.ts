import { translation as _ } from '@atb/translations/commons';

export const Map = {
  header: {
    address: _(
      'Holdeplasser i nærheten av',
      'Stops near',
      'Stoppestader i nærleiken av',
    ),
    venue: (address: string) =>
      _(`Ligger i ${address}`, `Located on ${address}`, `Ligg i ${address}`),
  },
  button: {
    travelFrom: _('Reis fra', 'Travel from', 'Reis frå'),
    travelTo: _('Reis til', 'Travel to', 'Reis til'),
  },
};
