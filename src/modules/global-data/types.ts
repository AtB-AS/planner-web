import type { GlobalCookiesData } from '@atb/modules/cookies';

export type AllData = GlobalCookiesData;

export type WithGlobalData<T> = T & AllData;
