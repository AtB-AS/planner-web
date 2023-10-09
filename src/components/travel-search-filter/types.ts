import { z } from 'zod';

export declare const TransportModeFilterOptionType: z.ZodObject<
  {
    id: z.ZodString;
    icon: z.ZodObject<
      {
        transportMode: z.ZodUnion<
          [
            z.ZodLiteral<'air'>,
            z.ZodLiteral<'bus'>,
            z.ZodLiteral<'cableway'>,
            z.ZodLiteral<'coach'>,
            z.ZodLiteral<'funicular'>,
            z.ZodLiteral<'lift'>,
            z.ZodLiteral<'metro'>,
            z.ZodLiteral<'monorail'>,
            z.ZodLiteral<'rail'>,
            z.ZodLiteral<'tram'>,
            z.ZodLiteral<'trolleybus'>,
            z.ZodLiteral<'unknown'>,
            z.ZodLiteral<'water'>,
          ]
        >;
        transportSubMode: z.ZodOptional<
          z.ZodUnion<
            [
              z.ZodLiteral<'SchengenAreaFlight'>,
              z.ZodLiteral<'airportBoatLink'>,
              z.ZodLiteral<'airportLinkBus'>,
              z.ZodLiteral<'airportLinkRail'>,
              z.ZodLiteral<'airshipService'>,
              z.ZodLiteral<'allFunicularServices'>,
              z.ZodLiteral<'allHireVehicles'>,
              z.ZodLiteral<'allTaxiServices'>,
              z.ZodLiteral<'bikeTaxi'>,
              z.ZodLiteral<'blackCab'>,
              z.ZodLiteral<'cableCar'>,
              z.ZodLiteral<'cableFerry'>,
              z.ZodLiteral<'canalBarge'>,
              z.ZodLiteral<'carTransportRailService'>,
              z.ZodLiteral<'chairLift'>,
              z.ZodLiteral<'charterTaxi'>,
              z.ZodLiteral<'cityTram'>,
              z.ZodLiteral<'communalTaxi'>,
              z.ZodLiteral<'commuterCoach'>,
              z.ZodLiteral<'crossCountryRail'>,
              z.ZodLiteral<'dedicatedLaneBus'>,
              z.ZodLiteral<'demandAndResponseBus'>,
              z.ZodLiteral<'domesticCharterFlight'>,
              z.ZodLiteral<'domesticFlight'>,
              z.ZodLiteral<'domesticScheduledFlight'>,
              z.ZodLiteral<'dragLift'>,
              z.ZodLiteral<'expressBus'>,
              z.ZodLiteral<'funicular'>,
              z.ZodLiteral<'helicopterService'>,
              z.ZodLiteral<'highFrequencyBus'>,
              z.ZodLiteral<'highSpeedPassengerService'>,
              z.ZodLiteral<'highSpeedRail'>,
              z.ZodLiteral<'highSpeedVehicleService'>,
              z.ZodLiteral<'hireCar'>,
              z.ZodLiteral<'hireCycle'>,
              z.ZodLiteral<'hireMotorbike'>,
              z.ZodLiteral<'hireVan'>,
              z.ZodLiteral<'intercontinentalCharterFlight'>,
              z.ZodLiteral<'intercontinentalFlight'>,
              z.ZodLiteral<'international'>,
              z.ZodLiteral<'internationalCarFerry'>,
              z.ZodLiteral<'internationalCharterFlight'>,
              z.ZodLiteral<'internationalCoach'>,
              z.ZodLiteral<'internationalFlight'>,
              z.ZodLiteral<'internationalPassengerFerry'>,
              z.ZodLiteral<'interregionalRail'>,
              z.ZodLiteral<'lift'>,
              z.ZodLiteral<'local'>,
              z.ZodLiteral<'localBus'>,
              z.ZodLiteral<'localCarFerry'>,
              z.ZodLiteral<'localPassengerFerry'>,
              z.ZodLiteral<'localTram'>,
              z.ZodLiteral<'longDistance'>,
              z.ZodLiteral<'metro'>,
              z.ZodLiteral<'miniCab'>,
              z.ZodLiteral<'mobilityBus'>,
              z.ZodLiteral<'mobilityBusForRegisteredDisabled'>,
              z.ZodLiteral<'nationalCarFerry'>,
              z.ZodLiteral<'nationalCoach'>,
              z.ZodLiteral<'nationalPassengerFerry'>,
              z.ZodLiteral<'nightBus'>,
              z.ZodLiteral<'nightRail'>,
              z.ZodLiteral<'postBoat'>,
              z.ZodLiteral<'postBus'>,
              z.ZodLiteral<'rackAndPinionRailway'>,
              z.ZodLiteral<'railReplacementBus'>,
              z.ZodLiteral<'railShuttle'>,
              z.ZodLiteral<'railTaxi'>,
              z.ZodLiteral<'regionalBus'>,
              z.ZodLiteral<'regionalCarFerry'>,
              z.ZodLiteral<'regionalCoach'>,
              z.ZodLiteral<'regionalPassengerFerry'>,
              z.ZodLiteral<'regionalRail'>,
              z.ZodLiteral<'regionalTram'>,
              z.ZodLiteral<'replacementRailService'>,
              z.ZodLiteral<'riverBus'>,
              z.ZodLiteral<'roadFerryLink'>,
              z.ZodLiteral<'roundTripCharterFlight'>,
              z.ZodLiteral<'scheduledFerry'>,
              z.ZodLiteral<'schoolAndPublicServiceBus'>,
              z.ZodLiteral<'schoolBoat'>,
              z.ZodLiteral<'schoolBus'>,
              z.ZodLiteral<'schoolCoach'>,
              z.ZodLiteral<'shortHaulInternationalFlight'>,
              z.ZodLiteral<'shuttleBus'>,
              z.ZodLiteral<'shuttleCoach'>,
              z.ZodLiteral<'shuttleFerryService'>,
              z.ZodLiteral<'shuttleFlight'>,
              z.ZodLiteral<'shuttleTram'>,
              z.ZodLiteral<'sightseeingBus'>,
              z.ZodLiteral<'sightseeingCoach'>,
              z.ZodLiteral<'sightseeingFlight'>,
              z.ZodLiteral<'sightseeingService'>,
              z.ZodLiteral<'sightseeingTram'>,
              z.ZodLiteral<'sleeperRailService'>,
              z.ZodLiteral<'specialCoach'>,
              z.ZodLiteral<'specialNeedsBus'>,
              z.ZodLiteral<'specialTrain'>,
              z.ZodLiteral<'streetCableCar'>,
              z.ZodLiteral<'suburbanRailway'>,
              z.ZodLiteral<'telecabin'>,
              z.ZodLiteral<'telecabinLink'>,
              z.ZodLiteral<'touristCoach'>,
              z.ZodLiteral<'touristRailway'>,
              z.ZodLiteral<'trainFerry'>,
              z.ZodLiteral<'trainTram'>,
              z.ZodLiteral<'tube'>,
              z.ZodLiteral<'undefined'>,
              z.ZodLiteral<'undefinedFunicular'>,
              z.ZodLiteral<'unknown'>,
              z.ZodLiteral<'urbanRailway'>,
              z.ZodLiteral<'waterTaxi'>,
            ]
          >
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        transportMode:
          | 'unknown'
          | 'air'
          | 'bus'
          | 'cableway'
          | 'coach'
          | 'funicular'
          | 'lift'
          | 'metro'
          | 'monorail'
          | 'rail'
          | 'tram'
          | 'trolleybus'
          | 'water';
        transportSubMode?:
          | 'undefined'
          | 'unknown'
          | 'funicular'
          | 'lift'
          | 'metro'
          | 'SchengenAreaFlight'
          | 'airportBoatLink'
          | 'airportLinkBus'
          | 'airportLinkRail'
          | 'airshipService'
          | 'allFunicularServices'
          | 'allHireVehicles'
          | 'allTaxiServices'
          | 'bikeTaxi'
          | 'blackCab'
          | 'cableCar'
          | 'cableFerry'
          | 'canalBarge'
          | 'carTransportRailService'
          | 'chairLift'
          | 'charterTaxi'
          | 'cityTram'
          | 'communalTaxi'
          | 'commuterCoach'
          | 'crossCountryRail'
          | 'dedicatedLaneBus'
          | 'demandAndResponseBus'
          | 'domesticCharterFlight'
          | 'domesticFlight'
          | 'domesticScheduledFlight'
          | 'dragLift'
          | 'expressBus'
          | 'helicopterService'
          | 'highFrequencyBus'
          | 'highSpeedPassengerService'
          | 'highSpeedRail'
          | 'highSpeedVehicleService'
          | 'hireCar'
          | 'hireCycle'
          | 'hireMotorbike'
          | 'hireVan'
          | 'intercontinentalCharterFlight'
          | 'intercontinentalFlight'
          | 'international'
          | 'internationalCarFerry'
          | 'internationalCharterFlight'
          | 'internationalCoach'
          | 'internationalFlight'
          | 'internationalPassengerFerry'
          | 'interregionalRail'
          | 'local'
          | 'localBus'
          | 'localCarFerry'
          | 'localPassengerFerry'
          | 'localTram'
          | 'longDistance'
          | 'miniCab'
          | 'mobilityBus'
          | 'mobilityBusForRegisteredDisabled'
          | 'nationalCarFerry'
          | 'nationalCoach'
          | 'nationalPassengerFerry'
          | 'nightBus'
          | 'nightRail'
          | 'postBoat'
          | 'postBus'
          | 'rackAndPinionRailway'
          | 'railReplacementBus'
          | 'railShuttle'
          | 'railTaxi'
          | 'regionalBus'
          | 'regionalCarFerry'
          | 'regionalCoach'
          | 'regionalPassengerFerry'
          | 'regionalRail'
          | 'regionalTram'
          | 'replacementRailService'
          | 'riverBus'
          | 'roadFerryLink'
          | 'roundTripCharterFlight'
          | 'scheduledFerry'
          | 'schoolAndPublicServiceBus'
          | 'schoolBoat'
          | 'schoolBus'
          | 'schoolCoach'
          | 'shortHaulInternationalFlight'
          | 'shuttleBus'
          | 'shuttleCoach'
          | 'shuttleFerryService'
          | 'shuttleFlight'
          | 'shuttleTram'
          | 'sightseeingBus'
          | 'sightseeingCoach'
          | 'sightseeingFlight'
          | 'sightseeingService'
          | 'sightseeingTram'
          | 'sleeperRailService'
          | 'specialCoach'
          | 'specialNeedsBus'
          | 'specialTrain'
          | 'streetCableCar'
          | 'suburbanRailway'
          | 'telecabin'
          | 'telecabinLink'
          | 'touristCoach'
          | 'touristRailway'
          | 'trainFerry'
          | 'trainTram'
          | 'tube'
          | 'undefinedFunicular'
          | 'urbanRailway'
          | 'waterTaxi'
          | undefined;
      },
      {
        transportMode:
          | 'unknown'
          | 'air'
          | 'bus'
          | 'cableway'
          | 'coach'
          | 'funicular'
          | 'lift'
          | 'metro'
          | 'monorail'
          | 'rail'
          | 'tram'
          | 'trolleybus'
          | 'water';
        transportSubMode?:
          | 'undefined'
          | 'unknown'
          | 'funicular'
          | 'lift'
          | 'metro'
          | 'SchengenAreaFlight'
          | 'airportBoatLink'
          | 'airportLinkBus'
          | 'airportLinkRail'
          | 'airshipService'
          | 'allFunicularServices'
          | 'allHireVehicles'
          | 'allTaxiServices'
          | 'bikeTaxi'
          | 'blackCab'
          | 'cableCar'
          | 'cableFerry'
          | 'canalBarge'
          | 'carTransportRailService'
          | 'chairLift'
          | 'charterTaxi'
          | 'cityTram'
          | 'communalTaxi'
          | 'commuterCoach'
          | 'crossCountryRail'
          | 'dedicatedLaneBus'
          | 'demandAndResponseBus'
          | 'domesticCharterFlight'
          | 'domesticFlight'
          | 'domesticScheduledFlight'
          | 'dragLift'
          | 'expressBus'
          | 'helicopterService'
          | 'highFrequencyBus'
          | 'highSpeedPassengerService'
          | 'highSpeedRail'
          | 'highSpeedVehicleService'
          | 'hireCar'
          | 'hireCycle'
          | 'hireMotorbike'
          | 'hireVan'
          | 'intercontinentalCharterFlight'
          | 'intercontinentalFlight'
          | 'international'
          | 'internationalCarFerry'
          | 'internationalCharterFlight'
          | 'internationalCoach'
          | 'internationalFlight'
          | 'internationalPassengerFerry'
          | 'interregionalRail'
          | 'local'
          | 'localBus'
          | 'localCarFerry'
          | 'localPassengerFerry'
          | 'localTram'
          | 'longDistance'
          | 'miniCab'
          | 'mobilityBus'
          | 'mobilityBusForRegisteredDisabled'
          | 'nationalCarFerry'
          | 'nationalCoach'
          | 'nationalPassengerFerry'
          | 'nightBus'
          | 'nightRail'
          | 'postBoat'
          | 'postBus'
          | 'rackAndPinionRailway'
          | 'railReplacementBus'
          | 'railShuttle'
          | 'railTaxi'
          | 'regionalBus'
          | 'regionalCarFerry'
          | 'regionalCoach'
          | 'regionalPassengerFerry'
          | 'regionalRail'
          | 'regionalTram'
          | 'replacementRailService'
          | 'riverBus'
          | 'roadFerryLink'
          | 'roundTripCharterFlight'
          | 'scheduledFerry'
          | 'schoolAndPublicServiceBus'
          | 'schoolBoat'
          | 'schoolBus'
          | 'schoolCoach'
          | 'shortHaulInternationalFlight'
          | 'shuttleBus'
          | 'shuttleCoach'
          | 'shuttleFerryService'
          | 'shuttleFlight'
          | 'shuttleTram'
          | 'sightseeingBus'
          | 'sightseeingCoach'
          | 'sightseeingFlight'
          | 'sightseeingService'
          | 'sightseeingTram'
          | 'sleeperRailService'
          | 'specialCoach'
          | 'specialNeedsBus'
          | 'specialTrain'
          | 'streetCableCar'
          | 'suburbanRailway'
          | 'telecabin'
          | 'telecabinLink'
          | 'touristCoach'
          | 'touristRailway'
          | 'trainFerry'
          | 'trainTram'
          | 'tube'
          | 'undefinedFunicular'
          | 'urbanRailway'
          | 'waterTaxi'
          | undefined;
      }
    >;
    text: z.ZodArray<
      z.ZodUnion<
        [
          z.ZodObject<
            {
              lang: z.ZodString;
              value: z.ZodString;
            },
            'strip',
            z.ZodTypeAny,
            {
              value: string;
              lang: string;
            },
            {
              value: string;
              lang: string;
            }
          >,
          z.ZodObject<
            {
              language: z.ZodOptional<z.ZodString>;
              value: z.ZodOptional<z.ZodString>;
            },
            'strip',
            z.ZodTypeAny,
            {
              language?: string | undefined;
              value?: string | undefined;
            },
            {
              language?: string | undefined;
              value?: string | undefined;
            }
          >,
        ]
      >,
      'atleastone'
    >;
    description: z.ZodOptional<
      z.ZodArray<
        z.ZodUnion<
          [
            z.ZodObject<
              {
                lang: z.ZodString;
                value: z.ZodString;
              },
              'strip',
              z.ZodTypeAny,
              {
                value: string;
                lang: string;
              },
              {
                value: string;
                lang: string;
              }
            >,
            z.ZodObject<
              {
                language: z.ZodOptional<z.ZodString>;
                value: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                language?: string | undefined;
                value?: string | undefined;
              },
              {
                language?: string | undefined;
                value?: string | undefined;
              }
            >,
          ]
        >,
        'many'
      >
    >;
    modes: z.ZodArray<
      z.ZodObject<
        {
          transportMode: z.ZodUnion<
            [
              z.ZodLiteral<'air'>,
              z.ZodLiteral<'bus'>,
              z.ZodLiteral<'cableway'>,
              z.ZodLiteral<'coach'>,
              z.ZodLiteral<'funicular'>,
              z.ZodLiteral<'lift'>,
              z.ZodLiteral<'metro'>,
              z.ZodLiteral<'monorail'>,
              z.ZodLiteral<'rail'>,
              z.ZodLiteral<'tram'>,
              z.ZodLiteral<'trolleybus'>,
              z.ZodLiteral<'unknown'>,
              z.ZodLiteral<'water'>,
            ]
          >;
          transportSubModes: z.ZodOptional<
            z.ZodArray<
              z.ZodUnion<
                [
                  z.ZodLiteral<'SchengenAreaFlight'>,
                  z.ZodLiteral<'airportBoatLink'>,
                  z.ZodLiteral<'airportLinkBus'>,
                  z.ZodLiteral<'airportLinkRail'>,
                  z.ZodLiteral<'airshipService'>,
                  z.ZodLiteral<'allFunicularServices'>,
                  z.ZodLiteral<'allHireVehicles'>,
                  z.ZodLiteral<'allTaxiServices'>,
                  z.ZodLiteral<'bikeTaxi'>,
                  z.ZodLiteral<'blackCab'>,
                  z.ZodLiteral<'cableCar'>,
                  z.ZodLiteral<'cableFerry'>,
                  z.ZodLiteral<'canalBarge'>,
                  z.ZodLiteral<'carTransportRailService'>,
                  z.ZodLiteral<'chairLift'>,
                  z.ZodLiteral<'charterTaxi'>,
                  z.ZodLiteral<'cityTram'>,
                  z.ZodLiteral<'communalTaxi'>,
                  z.ZodLiteral<'commuterCoach'>,
                  z.ZodLiteral<'crossCountryRail'>,
                  z.ZodLiteral<'dedicatedLaneBus'>,
                  z.ZodLiteral<'demandAndResponseBus'>,
                  z.ZodLiteral<'domesticCharterFlight'>,
                  z.ZodLiteral<'domesticFlight'>,
                  z.ZodLiteral<'domesticScheduledFlight'>,
                  z.ZodLiteral<'dragLift'>,
                  z.ZodLiteral<'expressBus'>,
                  z.ZodLiteral<'funicular'>,
                  z.ZodLiteral<'helicopterService'>,
                  z.ZodLiteral<'highFrequencyBus'>,
                  z.ZodLiteral<'highSpeedPassengerService'>,
                  z.ZodLiteral<'highSpeedRail'>,
                  z.ZodLiteral<'highSpeedVehicleService'>,
                  z.ZodLiteral<'hireCar'>,
                  z.ZodLiteral<'hireCycle'>,
                  z.ZodLiteral<'hireMotorbike'>,
                  z.ZodLiteral<'hireVan'>,
                  z.ZodLiteral<'intercontinentalCharterFlight'>,
                  z.ZodLiteral<'intercontinentalFlight'>,
                  z.ZodLiteral<'international'>,
                  z.ZodLiteral<'internationalCarFerry'>,
                  z.ZodLiteral<'internationalCharterFlight'>,
                  z.ZodLiteral<'internationalCoach'>,
                  z.ZodLiteral<'internationalFlight'>,
                  z.ZodLiteral<'internationalPassengerFerry'>,
                  z.ZodLiteral<'interregionalRail'>,
                  z.ZodLiteral<'lift'>,
                  z.ZodLiteral<'local'>,
                  z.ZodLiteral<'localBus'>,
                  z.ZodLiteral<'localCarFerry'>,
                  z.ZodLiteral<'localPassengerFerry'>,
                  z.ZodLiteral<'localTram'>,
                  z.ZodLiteral<'longDistance'>,
                  z.ZodLiteral<'metro'>,
                  z.ZodLiteral<'miniCab'>,
                  z.ZodLiteral<'mobilityBus'>,
                  z.ZodLiteral<'mobilityBusForRegisteredDisabled'>,
                  z.ZodLiteral<'nationalCarFerry'>,
                  z.ZodLiteral<'nationalCoach'>,
                  z.ZodLiteral<'nationalPassengerFerry'>,
                  z.ZodLiteral<'nightBus'>,
                  z.ZodLiteral<'nightRail'>,
                  z.ZodLiteral<'postBoat'>,
                  z.ZodLiteral<'postBus'>,
                  z.ZodLiteral<'rackAndPinionRailway'>,
                  z.ZodLiteral<'railReplacementBus'>,
                  z.ZodLiteral<'railShuttle'>,
                  z.ZodLiteral<'railTaxi'>,
                  z.ZodLiteral<'regionalBus'>,
                  z.ZodLiteral<'regionalCarFerry'>,
                  z.ZodLiteral<'regionalCoach'>,
                  z.ZodLiteral<'regionalPassengerFerry'>,
                  z.ZodLiteral<'regionalRail'>,
                  z.ZodLiteral<'regionalTram'>,
                  z.ZodLiteral<'replacementRailService'>,
                  z.ZodLiteral<'riverBus'>,
                  z.ZodLiteral<'roadFerryLink'>,
                  z.ZodLiteral<'roundTripCharterFlight'>,
                  z.ZodLiteral<'scheduledFerry'>,
                  z.ZodLiteral<'schoolAndPublicServiceBus'>,
                  z.ZodLiteral<'schoolBoat'>,
                  z.ZodLiteral<'schoolBus'>,
                  z.ZodLiteral<'schoolCoach'>,
                  z.ZodLiteral<'shortHaulInternationalFlight'>,
                  z.ZodLiteral<'shuttleBus'>,
                  z.ZodLiteral<'shuttleCoach'>,
                  z.ZodLiteral<'shuttleFerryService'>,
                  z.ZodLiteral<'shuttleFlight'>,
                  z.ZodLiteral<'shuttleTram'>,
                  z.ZodLiteral<'sightseeingBus'>,
                  z.ZodLiteral<'sightseeingCoach'>,
                  z.ZodLiteral<'sightseeingFlight'>,
                  z.ZodLiteral<'sightseeingService'>,
                  z.ZodLiteral<'sightseeingTram'>,
                  z.ZodLiteral<'sleeperRailService'>,
                  z.ZodLiteral<'specialCoach'>,
                  z.ZodLiteral<'specialNeedsBus'>,
                  z.ZodLiteral<'specialTrain'>,
                  z.ZodLiteral<'streetCableCar'>,
                  z.ZodLiteral<'suburbanRailway'>,
                  z.ZodLiteral<'telecabin'>,
                  z.ZodLiteral<'telecabinLink'>,
                  z.ZodLiteral<'touristCoach'>,
                  z.ZodLiteral<'touristRailway'>,
                  z.ZodLiteral<'trainFerry'>,
                  z.ZodLiteral<'trainTram'>,
                  z.ZodLiteral<'tube'>,
                  z.ZodLiteral<'undefined'>,
                  z.ZodLiteral<'undefinedFunicular'>,
                  z.ZodLiteral<'unknown'>,
                  z.ZodLiteral<'urbanRailway'>,
                  z.ZodLiteral<'waterTaxi'>,
                ]
              >,
              'many'
            >
          >;
        },
        'strip',
        z.ZodTypeAny,
        {
          transportMode:
            | 'unknown'
            | 'air'
            | 'bus'
            | 'cableway'
            | 'coach'
            | 'funicular'
            | 'lift'
            | 'metro'
            | 'monorail'
            | 'rail'
            | 'tram'
            | 'trolleybus'
            | 'water';
          transportSubModes?:
            | (
                | 'undefined'
                | 'unknown'
                | 'funicular'
                | 'lift'
                | 'metro'
                | 'SchengenAreaFlight'
                | 'airportBoatLink'
                | 'airportLinkBus'
                | 'airportLinkRail'
                | 'airshipService'
                | 'allFunicularServices'
                | 'allHireVehicles'
                | 'allTaxiServices'
                | 'bikeTaxi'
                | 'blackCab'
                | 'cableCar'
                | 'cableFerry'
                | 'canalBarge'
                | 'carTransportRailService'
                | 'chairLift'
                | 'charterTaxi'
                | 'cityTram'
                | 'communalTaxi'
                | 'commuterCoach'
                | 'crossCountryRail'
                | 'dedicatedLaneBus'
                | 'demandAndResponseBus'
                | 'domesticCharterFlight'
                | 'domesticFlight'
                | 'domesticScheduledFlight'
                | 'dragLift'
                | 'expressBus'
                | 'helicopterService'
                | 'highFrequencyBus'
                | 'highSpeedPassengerService'
                | 'highSpeedRail'
                | 'highSpeedVehicleService'
                | 'hireCar'
                | 'hireCycle'
                | 'hireMotorbike'
                | 'hireVan'
                | 'intercontinentalCharterFlight'
                | 'intercontinentalFlight'
                | 'international'
                | 'internationalCarFerry'
                | 'internationalCharterFlight'
                | 'internationalCoach'
                | 'internationalFlight'
                | 'internationalPassengerFerry'
                | 'interregionalRail'
                | 'local'
                | 'localBus'
                | 'localCarFerry'
                | 'localPassengerFerry'
                | 'localTram'
                | 'longDistance'
                | 'miniCab'
                | 'mobilityBus'
                | 'mobilityBusForRegisteredDisabled'
                | 'nationalCarFerry'
                | 'nationalCoach'
                | 'nationalPassengerFerry'
                | 'nightBus'
                | 'nightRail'
                | 'postBoat'
                | 'postBus'
                | 'rackAndPinionRailway'
                | 'railReplacementBus'
                | 'railShuttle'
                | 'railTaxi'
                | 'regionalBus'
                | 'regionalCarFerry'
                | 'regionalCoach'
                | 'regionalPassengerFerry'
                | 'regionalRail'
                | 'regionalTram'
                | 'replacementRailService'
                | 'riverBus'
                | 'roadFerryLink'
                | 'roundTripCharterFlight'
                | 'scheduledFerry'
                | 'schoolAndPublicServiceBus'
                | 'schoolBoat'
                | 'schoolBus'
                | 'schoolCoach'
                | 'shortHaulInternationalFlight'
                | 'shuttleBus'
                | 'shuttleCoach'
                | 'shuttleFerryService'
                | 'shuttleFlight'
                | 'shuttleTram'
                | 'sightseeingBus'
                | 'sightseeingCoach'
                | 'sightseeingFlight'
                | 'sightseeingService'
                | 'sightseeingTram'
                | 'sleeperRailService'
                | 'specialCoach'
                | 'specialNeedsBus'
                | 'specialTrain'
                | 'streetCableCar'
                | 'suburbanRailway'
                | 'telecabin'
                | 'telecabinLink'
                | 'touristCoach'
                | 'touristRailway'
                | 'trainFerry'
                | 'trainTram'
                | 'tube'
                | 'undefinedFunicular'
                | 'urbanRailway'
                | 'waterTaxi'
              )[]
            | undefined;
        },
        {
          transportMode:
            | 'unknown'
            | 'air'
            | 'bus'
            | 'cableway'
            | 'coach'
            | 'funicular'
            | 'lift'
            | 'metro'
            | 'monorail'
            | 'rail'
            | 'tram'
            | 'trolleybus'
            | 'water';
          transportSubModes?:
            | (
                | 'undefined'
                | 'unknown'
                | 'funicular'
                | 'lift'
                | 'metro'
                | 'SchengenAreaFlight'
                | 'airportBoatLink'
                | 'airportLinkBus'
                | 'airportLinkRail'
                | 'airshipService'
                | 'allFunicularServices'
                | 'allHireVehicles'
                | 'allTaxiServices'
                | 'bikeTaxi'
                | 'blackCab'
                | 'cableCar'
                | 'cableFerry'
                | 'canalBarge'
                | 'carTransportRailService'
                | 'chairLift'
                | 'charterTaxi'
                | 'cityTram'
                | 'communalTaxi'
                | 'commuterCoach'
                | 'crossCountryRail'
                | 'dedicatedLaneBus'
                | 'demandAndResponseBus'
                | 'domesticCharterFlight'
                | 'domesticFlight'
                | 'domesticScheduledFlight'
                | 'dragLift'
                | 'expressBus'
                | 'helicopterService'
                | 'highFrequencyBus'
                | 'highSpeedPassengerService'
                | 'highSpeedRail'
                | 'highSpeedVehicleService'
                | 'hireCar'
                | 'hireCycle'
                | 'hireMotorbike'
                | 'hireVan'
                | 'intercontinentalCharterFlight'
                | 'intercontinentalFlight'
                | 'international'
                | 'internationalCarFerry'
                | 'internationalCharterFlight'
                | 'internationalCoach'
                | 'internationalFlight'
                | 'internationalPassengerFerry'
                | 'interregionalRail'
                | 'local'
                | 'localBus'
                | 'localCarFerry'
                | 'localPassengerFerry'
                | 'localTram'
                | 'longDistance'
                | 'miniCab'
                | 'mobilityBus'
                | 'mobilityBusForRegisteredDisabled'
                | 'nationalCarFerry'
                | 'nationalCoach'
                | 'nationalPassengerFerry'
                | 'nightBus'
                | 'nightRail'
                | 'postBoat'
                | 'postBus'
                | 'rackAndPinionRailway'
                | 'railReplacementBus'
                | 'railShuttle'
                | 'railTaxi'
                | 'regionalBus'
                | 'regionalCarFerry'
                | 'regionalCoach'
                | 'regionalPassengerFerry'
                | 'regionalRail'
                | 'regionalTram'
                | 'replacementRailService'
                | 'riverBus'
                | 'roadFerryLink'
                | 'roundTripCharterFlight'
                | 'scheduledFerry'
                | 'schoolAndPublicServiceBus'
                | 'schoolBoat'
                | 'schoolBus'
                | 'schoolCoach'
                | 'shortHaulInternationalFlight'
                | 'shuttleBus'
                | 'shuttleCoach'
                | 'shuttleFerryService'
                | 'shuttleFlight'
                | 'shuttleTram'
                | 'sightseeingBus'
                | 'sightseeingCoach'
                | 'sightseeingFlight'
                | 'sightseeingService'
                | 'sightseeingTram'
                | 'sleeperRailService'
                | 'specialCoach'
                | 'specialNeedsBus'
                | 'specialTrain'
                | 'streetCableCar'
                | 'suburbanRailway'
                | 'telecabin'
                | 'telecabinLink'
                | 'touristCoach'
                | 'touristRailway'
                | 'trainFerry'
                | 'trainTram'
                | 'tube'
                | 'undefinedFunicular'
                | 'urbanRailway'
                | 'waterTaxi'
              )[]
            | undefined;
        }
      >,
      'many'
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    id: string;
    icon: {
      transportMode:
        | 'unknown'
        | 'air'
        | 'bus'
        | 'cableway'
        | 'coach'
        | 'funicular'
        | 'lift'
        | 'metro'
        | 'monorail'
        | 'rail'
        | 'tram'
        | 'trolleybus'
        | 'water';
      transportSubMode?:
        | 'undefined'
        | 'unknown'
        | 'funicular'
        | 'lift'
        | 'metro'
        | 'SchengenAreaFlight'
        | 'airportBoatLink'
        | 'airportLinkBus'
        | 'airportLinkRail'
        | 'airshipService'
        | 'allFunicularServices'
        | 'allHireVehicles'
        | 'allTaxiServices'
        | 'bikeTaxi'
        | 'blackCab'
        | 'cableCar'
        | 'cableFerry'
        | 'canalBarge'
        | 'carTransportRailService'
        | 'chairLift'
        | 'charterTaxi'
        | 'cityTram'
        | 'communalTaxi'
        | 'commuterCoach'
        | 'crossCountryRail'
        | 'dedicatedLaneBus'
        | 'demandAndResponseBus'
        | 'domesticCharterFlight'
        | 'domesticFlight'
        | 'domesticScheduledFlight'
        | 'dragLift'
        | 'expressBus'
        | 'helicopterService'
        | 'highFrequencyBus'
        | 'highSpeedPassengerService'
        | 'highSpeedRail'
        | 'highSpeedVehicleService'
        | 'hireCar'
        | 'hireCycle'
        | 'hireMotorbike'
        | 'hireVan'
        | 'intercontinentalCharterFlight'
        | 'intercontinentalFlight'
        | 'international'
        | 'internationalCarFerry'
        | 'internationalCharterFlight'
        | 'internationalCoach'
        | 'internationalFlight'
        | 'internationalPassengerFerry'
        | 'interregionalRail'
        | 'local'
        | 'localBus'
        | 'localCarFerry'
        | 'localPassengerFerry'
        | 'localTram'
        | 'longDistance'
        | 'miniCab'
        | 'mobilityBus'
        | 'mobilityBusForRegisteredDisabled'
        | 'nationalCarFerry'
        | 'nationalCoach'
        | 'nationalPassengerFerry'
        | 'nightBus'
        | 'nightRail'
        | 'postBoat'
        | 'postBus'
        | 'rackAndPinionRailway'
        | 'railReplacementBus'
        | 'railShuttle'
        | 'railTaxi'
        | 'regionalBus'
        | 'regionalCarFerry'
        | 'regionalCoach'
        | 'regionalPassengerFerry'
        | 'regionalRail'
        | 'regionalTram'
        | 'replacementRailService'
        | 'riverBus'
        | 'roadFerryLink'
        | 'roundTripCharterFlight'
        | 'scheduledFerry'
        | 'schoolAndPublicServiceBus'
        | 'schoolBoat'
        | 'schoolBus'
        | 'schoolCoach'
        | 'shortHaulInternationalFlight'
        | 'shuttleBus'
        | 'shuttleCoach'
        | 'shuttleFerryService'
        | 'shuttleFlight'
        | 'shuttleTram'
        | 'sightseeingBus'
        | 'sightseeingCoach'
        | 'sightseeingFlight'
        | 'sightseeingService'
        | 'sightseeingTram'
        | 'sleeperRailService'
        | 'specialCoach'
        | 'specialNeedsBus'
        | 'specialTrain'
        | 'streetCableCar'
        | 'suburbanRailway'
        | 'telecabin'
        | 'telecabinLink'
        | 'touristCoach'
        | 'touristRailway'
        | 'trainFerry'
        | 'trainTram'
        | 'tube'
        | 'undefinedFunicular'
        | 'urbanRailway'
        | 'waterTaxi'
        | undefined;
    };
    text: [
      (
        | {
            value: string;
            lang: string;
          }
        | {
            language?: string | undefined;
            value?: string | undefined;
          }
      ),
      ...(
        | {
            value: string;
            lang: string;
          }
        | {
            language?: string | undefined;
            value?: string | undefined;
          }
      )[],
    ];
    modes: {
      transportMode:
        | 'unknown'
        | 'air'
        | 'bus'
        | 'cableway'
        | 'coach'
        | 'funicular'
        | 'lift'
        | 'metro'
        | 'monorail'
        | 'rail'
        | 'tram'
        | 'trolleybus'
        | 'water';
      transportSubModes?:
        | (
            | 'undefined'
            | 'unknown'
            | 'funicular'
            | 'lift'
            | 'metro'
            | 'SchengenAreaFlight'
            | 'airportBoatLink'
            | 'airportLinkBus'
            | 'airportLinkRail'
            | 'airshipService'
            | 'allFunicularServices'
            | 'allHireVehicles'
            | 'allTaxiServices'
            | 'bikeTaxi'
            | 'blackCab'
            | 'cableCar'
            | 'cableFerry'
            | 'canalBarge'
            | 'carTransportRailService'
            | 'chairLift'
            | 'charterTaxi'
            | 'cityTram'
            | 'communalTaxi'
            | 'commuterCoach'
            | 'crossCountryRail'
            | 'dedicatedLaneBus'
            | 'demandAndResponseBus'
            | 'domesticCharterFlight'
            | 'domesticFlight'
            | 'domesticScheduledFlight'
            | 'dragLift'
            | 'expressBus'
            | 'helicopterService'
            | 'highFrequencyBus'
            | 'highSpeedPassengerService'
            | 'highSpeedRail'
            | 'highSpeedVehicleService'
            | 'hireCar'
            | 'hireCycle'
            | 'hireMotorbike'
            | 'hireVan'
            | 'intercontinentalCharterFlight'
            | 'intercontinentalFlight'
            | 'international'
            | 'internationalCarFerry'
            | 'internationalCharterFlight'
            | 'internationalCoach'
            | 'internationalFlight'
            | 'internationalPassengerFerry'
            | 'interregionalRail'
            | 'local'
            | 'localBus'
            | 'localCarFerry'
            | 'localPassengerFerry'
            | 'localTram'
            | 'longDistance'
            | 'miniCab'
            | 'mobilityBus'
            | 'mobilityBusForRegisteredDisabled'
            | 'nationalCarFerry'
            | 'nationalCoach'
            | 'nationalPassengerFerry'
            | 'nightBus'
            | 'nightRail'
            | 'postBoat'
            | 'postBus'
            | 'rackAndPinionRailway'
            | 'railReplacementBus'
            | 'railShuttle'
            | 'railTaxi'
            | 'regionalBus'
            | 'regionalCarFerry'
            | 'regionalCoach'
            | 'regionalPassengerFerry'
            | 'regionalRail'
            | 'regionalTram'
            | 'replacementRailService'
            | 'riverBus'
            | 'roadFerryLink'
            | 'roundTripCharterFlight'
            | 'scheduledFerry'
            | 'schoolAndPublicServiceBus'
            | 'schoolBoat'
            | 'schoolBus'
            | 'schoolCoach'
            | 'shortHaulInternationalFlight'
            | 'shuttleBus'
            | 'shuttleCoach'
            | 'shuttleFerryService'
            | 'shuttleFlight'
            | 'shuttleTram'
            | 'sightseeingBus'
            | 'sightseeingCoach'
            | 'sightseeingFlight'
            | 'sightseeingService'
            | 'sightseeingTram'
            | 'sleeperRailService'
            | 'specialCoach'
            | 'specialNeedsBus'
            | 'specialTrain'
            | 'streetCableCar'
            | 'suburbanRailway'
            | 'telecabin'
            | 'telecabinLink'
            | 'touristCoach'
            | 'touristRailway'
            | 'trainFerry'
            | 'trainTram'
            | 'tube'
            | 'undefinedFunicular'
            | 'urbanRailway'
            | 'waterTaxi'
          )[]
        | undefined;
    }[];
    description?:
      | (
          | {
              value: string;
              lang: string;
            }
          | {
              language?: string | undefined;
              value?: string | undefined;
            }
        )[]
      | undefined;
  },
  {
    id: string;
    icon: {
      transportMode:
        | 'unknown'
        | 'air'
        | 'bus'
        | 'cableway'
        | 'coach'
        | 'funicular'
        | 'lift'
        | 'metro'
        | 'monorail'
        | 'rail'
        | 'tram'
        | 'trolleybus'
        | 'water';
      transportSubMode?:
        | 'undefined'
        | 'unknown'
        | 'funicular'
        | 'lift'
        | 'metro'
        | 'SchengenAreaFlight'
        | 'airportBoatLink'
        | 'airportLinkBus'
        | 'airportLinkRail'
        | 'airshipService'
        | 'allFunicularServices'
        | 'allHireVehicles'
        | 'allTaxiServices'
        | 'bikeTaxi'
        | 'blackCab'
        | 'cableCar'
        | 'cableFerry'
        | 'canalBarge'
        | 'carTransportRailService'
        | 'chairLift'
        | 'charterTaxi'
        | 'cityTram'
        | 'communalTaxi'
        | 'commuterCoach'
        | 'crossCountryRail'
        | 'dedicatedLaneBus'
        | 'demandAndResponseBus'
        | 'domesticCharterFlight'
        | 'domesticFlight'
        | 'domesticScheduledFlight'
        | 'dragLift'
        | 'expressBus'
        | 'helicopterService'
        | 'highFrequencyBus'
        | 'highSpeedPassengerService'
        | 'highSpeedRail'
        | 'highSpeedVehicleService'
        | 'hireCar'
        | 'hireCycle'
        | 'hireMotorbike'
        | 'hireVan'
        | 'intercontinentalCharterFlight'
        | 'intercontinentalFlight'
        | 'international'
        | 'internationalCarFerry'
        | 'internationalCharterFlight'
        | 'internationalCoach'
        | 'internationalFlight'
        | 'internationalPassengerFerry'
        | 'interregionalRail'
        | 'local'
        | 'localBus'
        | 'localCarFerry'
        | 'localPassengerFerry'
        | 'localTram'
        | 'longDistance'
        | 'miniCab'
        | 'mobilityBus'
        | 'mobilityBusForRegisteredDisabled'
        | 'nationalCarFerry'
        | 'nationalCoach'
        | 'nationalPassengerFerry'
        | 'nightBus'
        | 'nightRail'
        | 'postBoat'
        | 'postBus'
        | 'rackAndPinionRailway'
        | 'railReplacementBus'
        | 'railShuttle'
        | 'railTaxi'
        | 'regionalBus'
        | 'regionalCarFerry'
        | 'regionalCoach'
        | 'regionalPassengerFerry'
        | 'regionalRail'
        | 'regionalTram'
        | 'replacementRailService'
        | 'riverBus'
        | 'roadFerryLink'
        | 'roundTripCharterFlight'
        | 'scheduledFerry'
        | 'schoolAndPublicServiceBus'
        | 'schoolBoat'
        | 'schoolBus'
        | 'schoolCoach'
        | 'shortHaulInternationalFlight'
        | 'shuttleBus'
        | 'shuttleCoach'
        | 'shuttleFerryService'
        | 'shuttleFlight'
        | 'shuttleTram'
        | 'sightseeingBus'
        | 'sightseeingCoach'
        | 'sightseeingFlight'
        | 'sightseeingService'
        | 'sightseeingTram'
        | 'sleeperRailService'
        | 'specialCoach'
        | 'specialNeedsBus'
        | 'specialTrain'
        | 'streetCableCar'
        | 'suburbanRailway'
        | 'telecabin'
        | 'telecabinLink'
        | 'touristCoach'
        | 'touristRailway'
        | 'trainFerry'
        | 'trainTram'
        | 'tube'
        | 'undefinedFunicular'
        | 'urbanRailway'
        | 'waterTaxi'
        | undefined;
    };
    text: [
      (
        | {
            value: string;
            lang: string;
          }
        | {
            language?: string | undefined;
            value?: string | undefined;
          }
      ),
      ...(
        | {
            value: string;
            lang: string;
          }
        | {
            language?: string | undefined;
            value?: string | undefined;
          }
      )[],
    ];
    modes: {
      transportMode:
        | 'unknown'
        | 'air'
        | 'bus'
        | 'cableway'
        | 'coach'
        | 'funicular'
        | 'lift'
        | 'metro'
        | 'monorail'
        | 'rail'
        | 'tram'
        | 'trolleybus'
        | 'water';
      transportSubModes?:
        | (
            | 'undefined'
            | 'unknown'
            | 'funicular'
            | 'lift'
            | 'metro'
            | 'SchengenAreaFlight'
            | 'airportBoatLink'
            | 'airportLinkBus'
            | 'airportLinkRail'
            | 'airshipService'
            | 'allFunicularServices'
            | 'allHireVehicles'
            | 'allTaxiServices'
            | 'bikeTaxi'
            | 'blackCab'
            | 'cableCar'
            | 'cableFerry'
            | 'canalBarge'
            | 'carTransportRailService'
            | 'chairLift'
            | 'charterTaxi'
            | 'cityTram'
            | 'communalTaxi'
            | 'commuterCoach'
            | 'crossCountryRail'
            | 'dedicatedLaneBus'
            | 'demandAndResponseBus'
            | 'domesticCharterFlight'
            | 'domesticFlight'
            | 'domesticScheduledFlight'
            | 'dragLift'
            | 'expressBus'
            | 'helicopterService'
            | 'highFrequencyBus'
            | 'highSpeedPassengerService'
            | 'highSpeedRail'
            | 'highSpeedVehicleService'
            | 'hireCar'
            | 'hireCycle'
            | 'hireMotorbike'
            | 'hireVan'
            | 'intercontinentalCharterFlight'
            | 'intercontinentalFlight'
            | 'international'
            | 'internationalCarFerry'
            | 'internationalCharterFlight'
            | 'internationalCoach'
            | 'internationalFlight'
            | 'internationalPassengerFerry'
            | 'interregionalRail'
            | 'local'
            | 'localBus'
            | 'localCarFerry'
            | 'localPassengerFerry'
            | 'localTram'
            | 'longDistance'
            | 'miniCab'
            | 'mobilityBus'
            | 'mobilityBusForRegisteredDisabled'
            | 'nationalCarFerry'
            | 'nationalCoach'
            | 'nationalPassengerFerry'
            | 'nightBus'
            | 'nightRail'
            | 'postBoat'
            | 'postBus'
            | 'rackAndPinionRailway'
            | 'railReplacementBus'
            | 'railShuttle'
            | 'railTaxi'
            | 'regionalBus'
            | 'regionalCarFerry'
            | 'regionalCoach'
            | 'regionalPassengerFerry'
            | 'regionalRail'
            | 'regionalTram'
            | 'replacementRailService'
            | 'riverBus'
            | 'roadFerryLink'
            | 'roundTripCharterFlight'
            | 'scheduledFerry'
            | 'schoolAndPublicServiceBus'
            | 'schoolBoat'
            | 'schoolBus'
            | 'schoolCoach'
            | 'shortHaulInternationalFlight'
            | 'shuttleBus'
            | 'shuttleCoach'
            | 'shuttleFerryService'
            | 'shuttleFlight'
            | 'shuttleTram'
            | 'sightseeingBus'
            | 'sightseeingCoach'
            | 'sightseeingFlight'
            | 'sightseeingService'
            | 'sightseeingTram'
            | 'sleeperRailService'
            | 'specialCoach'
            | 'specialNeedsBus'
            | 'specialTrain'
            | 'streetCableCar'
            | 'suburbanRailway'
            | 'telecabin'
            | 'telecabinLink'
            | 'touristCoach'
            | 'touristRailway'
            | 'trainFerry'
            | 'trainTram'
            | 'tube'
            | 'undefinedFunicular'
            | 'urbanRailway'
            | 'waterTaxi'
          )[]
        | undefined;
    }[];
    description?:
      | (
          | {
              value: string;
              lang: string;
            }
          | {
              language?: string | undefined;
              value?: string | undefined;
            }
        )[]
      | undefined;
  }
>;

export type TransportModeFilterOptionType = z.infer<
  typeof TransportModeFilterOptionType
>;

export declare const TransportModeType: z.ZodUnion<
  [
    z.ZodLiteral<'air'>,
    z.ZodLiteral<'bus'>,
    z.ZodLiteral<'cableway'>,
    z.ZodLiteral<'coach'>,
    z.ZodLiteral<'funicular'>,
    z.ZodLiteral<'lift'>,
    z.ZodLiteral<'metro'>,
    z.ZodLiteral<'monorail'>,
    z.ZodLiteral<'rail'>,
    z.ZodLiteral<'tram'>,
    z.ZodLiteral<'trolleybus'>,
    z.ZodLiteral<'unknown'>,
    z.ZodLiteral<'water'>,
  ]
>;
export declare const TransportSubmodeType: z.ZodUnion<
  [
    z.ZodLiteral<'SchengenAreaFlight'>,
    z.ZodLiteral<'airportBoatLink'>,
    z.ZodLiteral<'airportLinkBus'>,
    z.ZodLiteral<'airportLinkRail'>,
    z.ZodLiteral<'airshipService'>,
    z.ZodLiteral<'allFunicularServices'>,
    z.ZodLiteral<'allHireVehicles'>,
    z.ZodLiteral<'allTaxiServices'>,
    z.ZodLiteral<'bikeTaxi'>,
    z.ZodLiteral<'blackCab'>,
    z.ZodLiteral<'cableCar'>,
    z.ZodLiteral<'cableFerry'>,
    z.ZodLiteral<'canalBarge'>,
    z.ZodLiteral<'carTransportRailService'>,
    z.ZodLiteral<'chairLift'>,
    z.ZodLiteral<'charterTaxi'>,
    z.ZodLiteral<'cityTram'>,
    z.ZodLiteral<'communalTaxi'>,
    z.ZodLiteral<'commuterCoach'>,
    z.ZodLiteral<'crossCountryRail'>,
    z.ZodLiteral<'dedicatedLaneBus'>,
    z.ZodLiteral<'demandAndResponseBus'>,
    z.ZodLiteral<'domesticCharterFlight'>,
    z.ZodLiteral<'domesticFlight'>,
    z.ZodLiteral<'domesticScheduledFlight'>,
    z.ZodLiteral<'dragLift'>,
    z.ZodLiteral<'expressBus'>,
    z.ZodLiteral<'funicular'>,
    z.ZodLiteral<'helicopterService'>,
    z.ZodLiteral<'highFrequencyBus'>,
    z.ZodLiteral<'highSpeedPassengerService'>,
    z.ZodLiteral<'highSpeedRail'>,
    z.ZodLiteral<'highSpeedVehicleService'>,
    z.ZodLiteral<'hireCar'>,
    z.ZodLiteral<'hireCycle'>,
    z.ZodLiteral<'hireMotorbike'>,
    z.ZodLiteral<'hireVan'>,
    z.ZodLiteral<'intercontinentalCharterFlight'>,
    z.ZodLiteral<'intercontinentalFlight'>,
    z.ZodLiteral<'international'>,
    z.ZodLiteral<'internationalCarFerry'>,
    z.ZodLiteral<'internationalCharterFlight'>,
    z.ZodLiteral<'internationalCoach'>,
    z.ZodLiteral<'internationalFlight'>,
    z.ZodLiteral<'internationalPassengerFerry'>,
    z.ZodLiteral<'interregionalRail'>,
    z.ZodLiteral<'lift'>,
    z.ZodLiteral<'local'>,
    z.ZodLiteral<'localBus'>,
    z.ZodLiteral<'localCarFerry'>,
    z.ZodLiteral<'localPassengerFerry'>,
    z.ZodLiteral<'localTram'>,
    z.ZodLiteral<'longDistance'>,
    z.ZodLiteral<'metro'>,
    z.ZodLiteral<'miniCab'>,
    z.ZodLiteral<'mobilityBus'>,
    z.ZodLiteral<'mobilityBusForRegisteredDisabled'>,
    z.ZodLiteral<'nationalCarFerry'>,
    z.ZodLiteral<'nationalCoach'>,
    z.ZodLiteral<'nationalPassengerFerry'>,
    z.ZodLiteral<'nightBus'>,
    z.ZodLiteral<'nightRail'>,
    z.ZodLiteral<'postBoat'>,
    z.ZodLiteral<'postBus'>,
    z.ZodLiteral<'rackAndPinionRailway'>,
    z.ZodLiteral<'railReplacementBus'>,
    z.ZodLiteral<'railShuttle'>,
    z.ZodLiteral<'railTaxi'>,
    z.ZodLiteral<'regionalBus'>,
    z.ZodLiteral<'regionalCarFerry'>,
    z.ZodLiteral<'regionalCoach'>,
    z.ZodLiteral<'regionalPassengerFerry'>,
    z.ZodLiteral<'regionalRail'>,
    z.ZodLiteral<'regionalTram'>,
    z.ZodLiteral<'replacementRailService'>,
    z.ZodLiteral<'riverBus'>,
    z.ZodLiteral<'roadFerryLink'>,
    z.ZodLiteral<'roundTripCharterFlight'>,
    z.ZodLiteral<'scheduledFerry'>,
    z.ZodLiteral<'schoolAndPublicServiceBus'>,
    z.ZodLiteral<'schoolBoat'>,
    z.ZodLiteral<'schoolBus'>,
    z.ZodLiteral<'schoolCoach'>,
    z.ZodLiteral<'shortHaulInternationalFlight'>,
    z.ZodLiteral<'shuttleBus'>,
    z.ZodLiteral<'shuttleCoach'>,
    z.ZodLiteral<'shuttleFerryService'>,
    z.ZodLiteral<'shuttleFlight'>,
    z.ZodLiteral<'shuttleTram'>,
    z.ZodLiteral<'sightseeingBus'>,
    z.ZodLiteral<'sightseeingCoach'>,
    z.ZodLiteral<'sightseeingFlight'>,
    z.ZodLiteral<'sightseeingService'>,
    z.ZodLiteral<'sightseeingTram'>,
    z.ZodLiteral<'sleeperRailService'>,
    z.ZodLiteral<'specialCoach'>,
    z.ZodLiteral<'specialNeedsBus'>,
    z.ZodLiteral<'specialTrain'>,
    z.ZodLiteral<'streetCableCar'>,
    z.ZodLiteral<'suburbanRailway'>,
    z.ZodLiteral<'telecabin'>,
    z.ZodLiteral<'telecabinLink'>,
    z.ZodLiteral<'touristCoach'>,
    z.ZodLiteral<'touristRailway'>,
    z.ZodLiteral<'trainFerry'>,
    z.ZodLiteral<'trainTram'>,
    z.ZodLiteral<'tube'>,
    z.ZodLiteral<'undefined'>,
    z.ZodLiteral<'undefinedFunicular'>,
    z.ZodLiteral<'unknown'>,
    z.ZodLiteral<'urbanRailway'>,
    z.ZodLiteral<'waterTaxi'>,
  ]
>;

export type TransportModeType = z.infer<typeof TransportModeType>;
export type TransportSubmodeType = z.infer<typeof TransportSubmodeType>;

export type TransportModeFilterOptionWithSelectionType =
  TransportModeFilterOptionType & { selected: boolean };
