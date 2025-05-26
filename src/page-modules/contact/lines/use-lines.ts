import { swrFetcher } from '@atb/modules/api-browser';
import { TransportModeType } from '../types';
import { Line } from '../server/journey-planner/validators';
import useSWRImmutable from 'swr/immutable';

export const useLines = () => {
  const {
    data: lines,
    error,
    isLoading,
  } = useSWRImmutable<Line[]>('/api/contact/lines', swrFetcher);

  const subTransportModesExpressboat = [
    'highSpeedPassengerService',
    'highSpeedVehicleService',
    'sightseeingService',
    'localPassengerFerry',
    'internationalPassengerFerry',
  ];

  const subTransportModesFerry = [
    'highSpeedVehicleService',
    'internationalCarFerry',
    'localCarFerry',
    'nationalCarFerry',
  ];

  const getLinesByMode = (transportMode: TransportModeType): Line[] => {
    if (!lines) return [];

    switch (transportMode) {
      case 'bus':
        return lines.filter((line) => line.transportMode === transportMode);

      case 'expressboat':
        return lines.filter(
          (line) =>
            line.transportMode === 'water' &&
            line.transportSubmode !== null &&
            subTransportModesExpressboat.includes(line.transportSubmode),
        );

      case 'ferry':
        return lines.filter(
          (line) =>
            line.transportMode === 'water' &&
            line.transportSubmode !== null &&
            subTransportModesFerry.includes(line.transportSubmode),
        );
      default:
        return [];
    }
  };

  const getQuaysByLine = (lineId: string): Line['quays'] => {
    if (!lines) return [];
    return lines.find((line) => line.id === lineId)?.quays || [];
  };

  return {
    lines,
    error,
    isLoading,
    getLinesByMode,
    getQuaysByLine,
  };
};
