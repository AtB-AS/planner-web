import type { TariffConfig } from './types';
import { atbTariff } from './atb';

export type { TariffConfig } from './types';

// Tariff config per org, keyed by `currentOrg`. Register a new org here after
// adding its file (e.g. `nfk: nfkTariff`). Orgs not listed get no ticket plan.
export const TARIFF_CONFIGS: Record<string, TariffConfig> = {
  atb: atbTariff,
};
