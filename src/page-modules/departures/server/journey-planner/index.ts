import { GraphQlRequester } from '@atb/modules/api-server';
import {
  StopPlaceQuayDeparturesDocument,
  StopPlaceQuayDeparturesQuery,
  StopPlaceQuayDeparturesQueryVariables,
} from './journey-gql/departures.generated';
import {
  NearestStopPlacesDocument,
  NearestStopPlacesQuery,
  NearestStopPlacesQueryVariables,
} from './journey-gql/nearest-stop-places.generated';
import {
  GetStopPlaceDocument,
  GetStopPlaceQuery,
  GetStopPlaceQueryVariables,
} from './journey-gql/stop-place.generated';
import {
  QuayEstimatedCallsDocument,
  QuayEstimatedCallsQuery,
  QuayEstimatedCallsQueryVariables,
} from './journey-gql/estimated-calls.generated';
import {
  DepartureData,
  EstimatedCallsData,
  NearestStopPlacesData,
  StopPlaceInfo,
  StopPlaceWithDistance,
  departureDataSchema,
  estimatedCallsSchema,
  nearestStopPlaces,
  stopPlaceSchema,
  Quay,
  Departure,
  ServiceJourneyData,
  serviceJourneySchema,
  MapLegType,
} from './validators';
import {
  TransportMode as GraphQlTransportMode,
  PointsOnLink as GraphQlPointsOnLink,
} from '@atb/modules/graphql-types';
import {
  type TransportModeType,
  isTransportModeType,
  filterGraphQlTransportModes,
  type TransportSubmodeType,
} from '@atb/modules/transport-mode';
import {
  ServiceJourneyWithEstimatedCallsDocument,
  ServiceJourneyWithEstimatedCallsQuery,
  ServiceJourneyWithEstimatedCallsQueryVariables,
} from './journey-gql/service-journey-with-estimated-calls.generated';
import { formatISO } from 'date-fns';
import polyline from '@mapbox/polyline';
import haversineDistance from 'haversine-distance';

export type DepartureInput = {
  id: string;
  date: number | null;
  transportModes: TransportModeType[] | null;
};
export type { DepartureData, Quay, Departure };

export type StopPlaceInput = {
  id: string;
};

export type NearestStopPlacesInput = {
  lat: number;
  lon: number;
  transportModes: TransportModeType[] | null;
};

export type EstimatedCallsInput = {
  quayId: string;
  startTime: string;
};

export type ServiceJourneyInput = {
  id: string;
  date: Date;
  fromQuayId: string;
};

export type { StopPlaceInfo, NearestStopPlacesData, StopPlaceWithDistance };

export type JourneyPlannerApi = {
  departures(input: DepartureInput): Promise<DepartureData>;
  stopPlace(input: StopPlaceInput): Promise<StopPlaceInfo>;
  nearestStopPlaces(
    input: NearestStopPlacesInput,
  ): Promise<NearestStopPlacesData>;
  estimatedCalls(input: EstimatedCallsInput): Promise<EstimatedCallsData>;
  serviceJourney(input: ServiceJourneyInput): Promise<ServiceJourneyData>;
};

export function createJourneyApi(
  client: GraphQlRequester<'graphql-journeyPlanner3'>,
): JourneyPlannerApi {
  const api: JourneyPlannerApi = {
    async departures(input) {
      const result = await client.query<
        StopPlaceQuayDeparturesQuery,
        StopPlaceQuayDeparturesQueryVariables
      >({
        query: StopPlaceQuayDeparturesDocument,
        variables: {
          id: input.id,
          startTime: input.date
            ? new Date(input.date).toISOString()
            : new Date().toISOString(),
          numberOfDepartures: 10,
          transportModes:
            (input.transportModes as GraphQlTransportMode[]) ?? null,
        },
      });

      if (result.error) {
        throw result.error;
      }

      const data: RecursivePartial<DepartureData> = {
        stopPlace: {
          id: result.data.stopPlace?.id,
          name: result.data.stopPlace?.name,
          position: {
            lat: result.data.stopPlace?.latitude,
            lon: result.data.stopPlace?.longitude,
          },
          transportMode: filterGraphQlTransportModes(
            result.data.stopPlace?.transportMode,
          ),
          transportSubmode: result.data.stopPlace?.transportSubmode,
          description: result.data.stopPlace?.description,
        },
        quays: result.data.stopPlace?.quays?.map((q) => ({
          name: q.name,
          id: q.id,
          publicCode: q.publicCode,
          description: q.description,
          departures: q.estimatedCalls.map((e) => ({
            id: e.serviceJourney.id,
            name: e.destinationDisplay?.frontText,
            date: e.date,
            expectedDepartureTime: e.expectedDepartureTime,
            aimedDepartureTime: e.aimedDepartureTime,
            transportMode: isTransportModeType(
              e.serviceJourney.line.transportMode,
            )
              ? e.serviceJourney.line.transportMode
              : undefined,
            transportSubmode: e.serviceJourney.line.transportSubmode,
            publicCode: e.serviceJourney.line.publicCode,
          })),
        })),
      };

      const validated = departureDataSchema.safeParse(data);
      if (!validated.success) {
        throw validated.error;
      }

      return validated.data;
    },

    async stopPlace(input) {
      const result = await client.query<
        GetStopPlaceQuery,
        GetStopPlaceQueryVariables
      >({
        query: GetStopPlaceDocument,
        variables: {
          id: input.id,
        },
      });

      if (result.error) {
        throw result.error;
      }

      const data: RecursivePartial<StopPlaceInfo> = {
        id: result.data.stopPlace?.id,
        name: result.data.stopPlace?.name,
        description: result.data.stopPlace?.description,

        position: {
          lat: result.data.stopPlace?.latitude,
          lon: result.data.stopPlace?.longitude,
        },
      };

      const validated = stopPlaceSchema.safeParse(data);
      if (!validated.success) {
        throw validated.error;
      }

      return validated.data;
    },

    async nearestStopPlaces(input) {
      const result = await client.query<
        NearestStopPlacesQuery,
        NearestStopPlacesQueryVariables
      >({
        query: NearestStopPlacesDocument,
        variables: {
          // Max distance in meters
          distance: 900,
          transportModes:
            (input.transportModes as GraphQlTransportMode[]) ?? null,

          latitude: input.lat,
          longitude: input.lon,
        },
      });

      if (result.error) {
        throw result.error;
      }

      const data: RecursivePartial<NearestStopPlacesData> =
        result.data.nearest?.edges?.reduce(function (acc, edge) {
          if (!edge.node?.place || !('id' in edge.node?.place)) {
            return acc;
          }

          return acc.concat({
            stopPlace: {
              id: edge.node?.place.id,
              name: edge.node?.place.name,
              description: edge.node?.place?.description
                ? edge.node?.place?.description
                : null,
              position: {
                lat: edge.node?.place.latitude,
                lon: edge.node?.place.longitude,
              },
            },
            distance: edge.node.distance,
          });
        }, [] as RecursivePartial<NearestStopPlacesData>) ?? [];

      const validated = nearestStopPlaces.safeParse(data);

      if (!validated.success) {
        throw validated.error;
      }

      return validated.data;
    },

    async estimatedCalls(input) {
      const result = await client.query<
        QuayEstimatedCallsQuery,
        QuayEstimatedCallsQueryVariables
      >({
        query: QuayEstimatedCallsDocument,
        variables: {
          id: input.quayId,
          numberOfDepartures: 5,
          startTime: new Date(input.startTime),
        },
      });

      if (result.error) {
        throw result.error;
      }

      const data: RecursivePartial<EstimatedCallsData> = {
        quay: {
          id: result.data.quay?.id,
        },
        departures: result.data.quay?.estimatedCalls?.map((e) => ({
          id: e.serviceJourney.id,
          name: e.destinationDisplay?.frontText,
          date: e.date,
          expectedDepartureTime: e.expectedDepartureTime,
          aimedDepartureTime: e.aimedDepartureTime,
          transportMode: isTransportModeType(
            e.serviceJourney.line.transportMode,
          )
            ? e.serviceJourney.line.transportMode
            : 'unknown',
          transportSubmode: e.serviceJourney.line.transportSubmode,
          publicCode: e.serviceJourney.line.publicCode,
        })),
      };
      const validated = estimatedCallsSchema.safeParse(data);
      if (!validated.success) {
        throw validated.error;
      }

      return validated.data;
    },
    async serviceJourney(input) {
      const result = await client.query<
        ServiceJourneyWithEstimatedCallsQuery,
        ServiceJourneyWithEstimatedCallsQueryVariables
      >({
        query: ServiceJourneyWithEstimatedCallsDocument,
        variables: {
          id: input.id,
          date: formatISO(input.date, { representation: 'date' }),
        },
      });

      if (result.error) {
        throw result.error;
      }

      const serviceJourney = result.data.serviceJourney;

      const transportMode =
        serviceJourney?.transportMode &&
        isTransportModeType(serviceJourney?.transportMode)
          ? serviceJourney?.transportMode
          : 'unknown';
      const transportSubmode = serviceJourney?.transportSubmode;

      const fromStopPlace = serviceJourney?.estimatedCalls?.find(
        (call) => call.quay.id === input.fromQuayId,
      )?.quay?.stopPlace;

      const data: RecursivePartial<ServiceJourneyData> = {
        id: serviceJourney?.id,
        transportMode: transportMode,
        transportSubmode: transportSubmode,
        line: {
          publicCode: serviceJourney?.line.publicCode,
        },
        mapLegs: mapToMapLegs(
          serviceJourney?.pointsOnLink,
          transportMode,
          transportSubmode,
          fromStopPlace,
        ),
        estimatedCalls: serviceJourney?.estimatedCalls?.map(
          (estimatedCall) => ({
            actualArrivalTime: estimatedCall.actualArrivalTime || null,
            actualDepartureTime: estimatedCall.actualDepartureTime || null,
            aimedArrivalTime: estimatedCall.aimedArrivalTime,
            aimedDepartureTime: estimatedCall.aimedDepartureTime,
            cancellation: estimatedCall.cancellation,
            date: estimatedCall.date,
            destinationDisplay: {
              frontText: estimatedCall.destinationDisplay?.frontText,
            },
            expectedDepartureTime: estimatedCall.expectedDepartureTime,
            expectedArrivalTime: estimatedCall.expectedArrivalTime,
            forAlighting: estimatedCall.forAlighting,
            forBoarding: estimatedCall.forBoarding,
            realtime: estimatedCall.realtime,
            quay: {
              id: estimatedCall.quay.id,
              publicCode: estimatedCall.quay.publicCode,
              name: estimatedCall.quay.name,
              stopPlace: {
                id: estimatedCall.quay.stopPlace?.id,
                longitude: estimatedCall.quay.stopPlace?.longitude,
                latitude: estimatedCall.quay.stopPlace?.latitude,
              },
            },
          }),
        ),
      };

      const validated = serviceJourneySchema.safeParse(data);
      if (!validated.success) {
        throw validated.error;
      }

      return validated.data;
    },
  };

  return api;
}

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
    ? RecursivePartial<T[P]>
    : T[P];
};

const mapToMapLegs = (
  pointsOnLink: GraphQlPointsOnLink | undefined,
  transportMode: TransportModeType,
  transportSubmode: TransportSubmodeType | undefined,
  fromStopPlace?: { id: string; latitude?: number; longitude?: number },
) => {
  if (!pointsOnLink || !pointsOnLink.points) return [];
  const points = polyline.decode(pointsOnLink.points);
  const fromCoordinates: [number, number] = [
    fromStopPlace?.latitude || 0,
    fromStopPlace?.longitude || 0,
  ];

  const mainStartIndex = findIndex(points, fromCoordinates);
  const mainEndIndex = points.length - 1;

  const beforeLegCoords = points.slice(0, mainStartIndex + 1);
  const mainLegCoords = points.slice(mainStartIndex, mainEndIndex + 1);
  const afterLegCoords = points.slice(mainEndIndex);

  const toMapLeg = (item: [number, number][], faded: boolean) => {
    return {
      transportMode,
      transportSubmode,
      faded,
      points: item,
    };
  };

  const mapLegs: MapLegType[] = [
    toMapLeg(beforeLegCoords, true),
    toMapLeg(mainLegCoords, false),
    toMapLeg(afterLegCoords, true),
  ];

  return mapLegs;
};

const findIndex = (
  array: [number, number][],
  quayCoords: [number, number],
): number => {
  return array.reduce(
    (closest, t, index) => {
      const distance = haversineDistance(t, quayCoords);
      return distance < closest.distance ? { index, distance } : closest;
    },
    { index: -1, distance: 100 },
  ).index;
};
