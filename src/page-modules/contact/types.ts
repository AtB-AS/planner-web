import { TranslatedString } from '@atb/translations';

export type TransportModeType = 'bus' | 'expressboat' | 'ferry';
export type ReasonForTransportFailure = { id: string; name: TranslatedString };
export type TicketType = { id: string; name: TranslatedString };
export type PurchasePlatformType =
  | 'framApp'
  | 'enturApp'
  | 'framWeb'
  | 'enturWeb';
