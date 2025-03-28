import { TranslatedString, translation as _ } from '@atb/translations/commons';

export const TransportMode: Record<string, Record<string, TranslatedString>> = {
  modes: {
    bus: _('Buss', 'Bus', 'Buss'),
    coach: _('Buss', 'Bus', 'Buss'),
    rail: _('Tog', 'Train', 'Tog'),
    tram: _('Trikk', 'Tram', 'Trikk'),
    water: _('Båt', 'Boat', 'Båt'),
    air: _('Fly', 'Plane', 'Fly'),
    foot: _('Gange', 'Walk', 'Gange'),
    metro: _('T-bane', 'Metro', 'T-bane'),
    funicular: _('Kabelbane', 'Funicular', 'Kabelbane'),
    bicycle: _('Sykkel', 'Bicycle', 'Sykkel'),
    cableway: _('Kabelbane', 'Cableway', 'Kabelbane'),
    car: _('Bil', 'Car', 'Bil'),
    lift: _('Heis', 'Lift', 'Heis'),
    monorail: _('Monorail', 'Monorail', 'Monorail'),
    scooter: _('Scooter', 'Scooter', 'Scooter'),
    taxi: _('Taxi', 'Taxi', 'Taxi'),
    trolleybus: _('Trolleybuss', 'Trolleybus', 'Trolleybuss'),
    flex: _('Flex', 'Flex', 'Flex'),

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
