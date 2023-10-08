import { translation as _ } from '@atb/translations/commons';

export const TransportMode = {
  modes: {
    bus: _('Buss', 'Bus', 'Buss'),
    coach: _('Buss', 'Bus', 'Buss'),
    rail: _('Tog', 'Train', 'Tog'),
    tram: _('Trikk', 'Tram', 'Trikk'),
    water: _('Båt', 'Boat', 'Båt'),
    air: _('Fly', 'Plane', 'Fly'),
    foot: _('Gange', 'Walk', 'Gange'),
    metro: _('T-bane', 'Metro', 'T-bane'),

    unknown: _(
      `Ukjent reisemåte`,
      `Unknown transportation modes`,
      `Ukjend transportmetode`,
    ),
    multiple: _(
      `Flere reisemåter`,
      `Multiple transportation modes`,
      `Fleire transportmetodar`,
    ),
  },
};
