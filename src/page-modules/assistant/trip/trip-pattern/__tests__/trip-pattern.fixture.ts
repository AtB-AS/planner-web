import { ExtendedTripPatternType } from '@atb/page-modules/assistant';
import { Mode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import { TransportSubmode } from '@atb/modules/graphql-types';

export const tripPatternFixture: ExtendedTripPatternType = {
  expectedStartTime: '2023-01-01T01:00:00+01:00',
  expectedEndTime: '2023-01-01T02:00:00+01:00',
  legs: [
    {
      mode: Mode.Bus,
      distance: 1,
      duration: 1,
      aimedStartTime: '2023-01-01T01:00:00+01:00',
      aimedEndTime: '2023-01-01T02:00:00+01:00',
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
        name: 'From',
        quay: {
          publicCode: '1',
          name: 'From',
          description: undefined,
          id: 'NSR:Quay:1',
          situations: [],
        },
        latitude: 1,
        longitude: 1,
      },
      toPlace: {
        name: 'To',
        quay: {
          publicCode: '2',
          name: 'To',
          description: undefined,
          id: 'NSR:Quay:2',
          situations: [],
        },
        latitude: 1,
        longitude: 1,
      },
      intermediateEstimatedCalls: [],
      serviceJourneyEstimatedCalls: [],
      bookingArrangements: {},
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
