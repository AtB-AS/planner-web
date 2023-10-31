import { TransportSubmodeType } from '@atb-as/config-specs';
import { z } from 'zod';

export const TransportModeType = z.union([
  z.literal('air'),
  z.literal('bus'),
  z.literal('foot'),
  z.literal('bicycle'),
  z.literal('cableway'),
  z.literal('coach'),
  z.literal('funicular'),
  z.literal('lift'),
  z.literal('metro'),
  z.literal('monorail'),
  z.literal('rail'),
  z.literal('taxi'),
  z.literal('tram'),
  z.literal('trolleybus'),
  z.literal('unknown'),
  z.literal('water'),
]);
export type TransportModeType = z.infer<typeof TransportModeType>;

export { TransportSubmodeType };

export type TransportModeGroup = {
  mode: TransportModeType;
  subMode?: TransportSubmodeType;
};
