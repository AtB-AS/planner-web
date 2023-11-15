import { translation as _ } from '@atb/translations/commons';

export const Situation = {
  validity: {
    from: (fromDate: string) =>
      _(
        `Gyldig fra ${fromDate}`,
        `Valid from ${fromDate}`,
        `Gyldig frå ${fromDate}`,
      ),
    to: (toDate: string) =>
      _(`Gyldig til ${toDate}`, `Valid to ${toDate}`, `Gyldig til ${toDate}`),
    fromAndTo: (fromDate: string, toDate: string) =>
      _(
        `Gyldig fra ${fromDate} til ${toDate}`,
        `Valid from ${fromDate} to ${toDate}`,
        `Gyldig frå ${fromDate} til ${toDate}`,
      ),
  },
};
