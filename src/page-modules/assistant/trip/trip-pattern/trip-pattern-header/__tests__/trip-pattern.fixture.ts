import { ExtendedTripPatternType } from '@atb/page-modules/assistant';
import { Mode, TransportSubmode } from '@atb/modules/graphql-types';

export const tripPatternFixture: ExtendedTripPatternType = {
  expectedStartTime: '2023-01-01T01:00:00+01:00',
  expectedEndTime: '2023-01-01T02:00:00+01:00',
  legs: [
    {
      mode: Mode.Bus,
      distance: 1,
      duration: 1,
      aimedStartTime: '2023-01-01T01:00:00+01:00',
      expectedEndTime: '2023-01-01T02:00:00+01:00',
      expectedStartTime: '2023-01-01T01:00:00+01:00',
      realtime: false,
      transportSubmode: TransportSubmode.RegionalBus,
      line: {
        publicCode: '1',
        flexibleLineType: undefined,
        notices: [],
      },
      fromEstimatedCall: {
        notices: [],
        cancellation: false,
      },
      situations: [],
      fromPlace: {
        name: 'FromPlaceName',
        quay: {
          publicCode: '1',
          name: 'From',
          description: undefined,
          id: 'NSR:Quay:1',
          situations: [],
        },
      },
      serviceJourney: {
        id: 'ATB:ServiceJourney:1',
        notices: [],
        journeyPattern: {
          notices: [],
        },
      },
    },
  ],
  compressedQuery: 'H4sIAAAAAAAA',
};
