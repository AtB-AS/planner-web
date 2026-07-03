import {
  createGlobalMessageSchema,
  GenericGlobalMessageType,
} from '@atb-as/utils';
import { z } from 'zod';

export enum GlobalMessageContextEnum {
  plannerWeb = 'planner-web',
  plannerWebDepartures = 'planner-web-departures',
  plannerWebDeparturesDetails = 'planner-web-departures-details',
  plannerWebTrip = 'planner-web-trip',
  plannerWebDetails = 'planner-web-details',
}
const GlobalMessageContextSchema = z.enum(GlobalMessageContextEnum);

export const GlobalMessageSchema = createGlobalMessageSchema(
  GlobalMessageContextSchema,
);
export type GlobalMessageType = GenericGlobalMessageType<
  typeof GlobalMessageContextSchema
>;
