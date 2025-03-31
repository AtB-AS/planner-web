import type { FeatureCategory } from '@atb/components/venue-icon';
import type { SearchTime } from '@atb/modules/search-time';
import {
  ServiceJourneyEstimatedCallFragment,
  ServiceJourneyWithEstimatedCallsQuery,
} from '@atb/page-modules/departures/journey-gql/service-journey-with-estimated-calls.generated.ts';
import { MapLegType } from '@atb/components/map';
import { StopPlaceFragment } from '@atb/page-modules/departures/journey-gql/nearest-stop-places.generated';
import { SituationFragment } from '@atb/page-modules/assistant/journey-gql/trip.generated.ts';
import {
  DepartureQuayFragment,
  StopPlaceQuayDeparturesQuery,
} from '@atb/page-modules/departures/journey-gql/departures.generated.ts';
import { EstimatedCallFragment } from '@atb/page-modules/departures/journey-gql/estimated-calls.generated.ts';
import { GetStopPlaceQuery } from '@atb/page-modules/departures/journey-gql/stop-place.generated.ts';
import {
  Mode,
  TransportMode,
} from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

/**
 * IMPORTANT! READ THIS
 *
 * We use the GraphQL-generated types directly in the code as much as possible, since these
 * have proven to be reliable return types and further validation adds development
 * complexity without adding much safety.
 *
 * The GraphQL types are found in /page-modules/<module-name>/journey-gql/<query>.generated.ts
 *
 * Sometimes it is useful to modify or extend the GraphQL-types. That can be done in this file.
 *
 * It is recommended to start with the Query-type (which describes the shape of the GraphQL
 * response), or a GraphQL fragment. Here are two examples of these two:
 *
 * export type ServiceJourneyType =
 *   ServiceJourneyWithEstimatedCallsQuery['serviceJourney'] & {
 *     mapLegs: MapLegType[];
 *   };
 *
 * export type NearestStopPlaceType = {
 *   stopPlace: StopPlaceFragment & { situations: SituationFragment[] };
 *   distance?: number;
 * };
 */

export type GeocoderFeature = {
  id: string;
  name: string;
  locality: string | null;
  category: FeatureCategory[];
  layer: 'address' | 'venue';
  geometry: {
    coordinates: number[];
  };
  street?: string;
};

export type FromDepartureQuery = {
  searchTime: SearchTime;
  from: GeocoderFeature | null;
  isAddress: boolean;
};

export type EstimatedCallMetadata = {
  group: 'passed' | 'trip' | 'after';
  isStartOfServiceJourney: boolean;
  isEndOfServiceJourney: boolean;
  isStartOfGroup: boolean;
  isEndOfGroup: boolean;
};

export type EstimatedCallWithMetadata = ServiceJourneyEstimatedCallFragment & {
  metadata: EstimatedCallMetadata;
};

export type ServiceJourneyType =
  ServiceJourneyWithEstimatedCallsQuery['serviceJourney'] & {
    mapLegs: MapLegType[];
  };

export type NearestStopPlaceType = {
  stopPlace: StopPlaceFragment & { situations: SituationFragment[] };
  distance?: number;
};

// Add an ID to each departure for convenience
export type ExtendedDepartureType = EstimatedCallFragment & {
  id?: string;
};
export type ExtendedDepartureQuayType = DepartureQuayFragment & {
  estimatedCalls: ExtendedDepartureType[];
};

export type ExtendedDeparturesType = {
  stopPlace: StopPlaceQuayDeparturesQuery['stopPlace'] & {
    quays: ExtendedDepartureQuayType[];
    position?: {
      lat: number;
      lon: number;
    };
  };
};

export type StopPlaceType = GetStopPlaceQuery['stopPlace'] & {
  position: { lat?: number; lon?: number };
};
