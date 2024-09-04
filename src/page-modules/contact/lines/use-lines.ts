import { swrFetcher } from '@atb/modules/api-browser';
import { TransportModeType } from '@atb/modules/transport-mode';
import useSWR from 'swr';
import { Line } from '../server/journey-planner/validators';

export const useLines = () => {
  const {
    data: lines,
    error,
    isLoading,
  } = useSWR<Line[]>('/api/contact/lines', swrFetcher);

  const getLinesByMode = (mode: TransportModeType): Line[] => {
    if (!lines) return [];
    return lines.filter((line) => line.transportMode === mode);
  };

  const getQuaysByLine = (lineId: string): Line['quays'] => {
    if (!lines) return [];
    const res = lines.find((line) => line.id === lineId)?.quays || [];
    return res;
  };

  return {
    lines,
    error,
    isLoading,
    getLinesByMode,
    getQuaysByLine,
  };
};
