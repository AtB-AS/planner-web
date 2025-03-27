import type { FeatureCategory } from '@atb/components/venue-icon';
import type { SearchTime } from '@atb/modules/search-time';
import {
  ServiceJourneyEstimatedCallFragment,
  ServiceJourneyWithEstimatedCallsQuery,
} from '@atb/page-modules/departures/server/journey-planner/journey-gql/service-journey-with-estimated-calls.generated.ts';
import { MapLegType } from '@atb/components/map';
import { StopPlaceFragment } from './server/journey-planner/journey-gql/nearest-stop-places.generated';
import { SituationFragment } from '@atb/page-modules/assistant/server/journey-planner/journey-gql/trip.generated.ts';
import {
  DepartureQuayFragment,
  StopPlaceQuayDeparturesQuery,
} from '@atb/page-modules/departures/server/journey-planner/journey-gql/departures.generated.ts';
import { EstimatedCallFragment } from '@atb/page-modules/departures/server/journey-planner/journey-gql/estimated-calls.generated.ts';

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
export type EnhancedDepartureType = EstimatedCallFragment & {
  id?: string;
};
export type EnhancedDepartureQuayType = DepartureQuayFragment & {
  estimatedCalls: EnhancedDepartureType[];
};

export type DeparturesType = {
  stopPlace: StopPlaceQuayDeparturesQuery['stopPlace'] & {
    quays: EnhancedDepartureQuayType[];
    position?: {
      lat: number;
      lon: number;
    };
  };
};
