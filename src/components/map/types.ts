import { TransportSubmode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import { TransportModeType } from '@atb/modules/transport-mode';
import z from 'zod';

export const positionSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

export type PositionType = z.infer<typeof positionSchema>;

export type MapLegType = {
  transportMode: TransportModeType;
  transportSubmode?: TransportSubmode;
  faded: boolean;
  points: PositionType[];
  isFlexibleLine: boolean;
};
