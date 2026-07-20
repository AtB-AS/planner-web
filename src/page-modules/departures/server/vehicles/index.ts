import { HttpRequester } from '@atb/modules/api-server';
import qs from 'query-string';
import type { VehicleWithPosition } from '@atb/page-modules/departures/client/vehicles';

export type BffVehiclesApi = {
  serviceJourneyVehicles(
    serviceJourneyIds: string[],
  ): Promise<VehicleWithPosition[]>;
};

export function createBffVehiclesApi(
  request: HttpRequester<'http-bff'>,
): BffVehiclesApi {
  return {
    async serviceJourneyVehicles(serviceJourneyIds) {
      if (!serviceJourneyIds.length) return [];

      const url = '/v2/vehicles/service-journeys';
      const query = qs.stringify(
        { serviceJourneyIds },
        { skipNull: true, skipEmptyString: true },
      );

      const result = await request(`${url}?${query}`);
      const data = (await result.json()) as VehicleWithPosition[] | null;
      return data ?? [];
    },
  };
}
