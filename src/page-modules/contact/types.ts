import { TranslatedString } from '@atb/translations';

export type TransportModeType = 'bus' | 'expressboat' | 'ferry';
export type ReasonForTransportFailure = { id: string; name: TranslatedString };
export enum TicketTypeId {
  SingleTicket = 'singleTicket',
  PeriodTicket = 'periodTicket',
  FramYoung = 'framYoung',
  FramStudent = 'framStudent',
  FramAdult = 'framAdult',
  FramSenior = 'framSenior',
}
export type TicketType = {
  id: TicketTypeId;
  name: TranslatedString;
};
export type PurchasePlatformType =
  | 'framApp'
  | 'enturApp'
  | 'framWeb'
  | 'enturWeb';
