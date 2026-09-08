import { CommonText } from '@mrfylke/contact-form';
import type { ContactFormTranslationsOverride } from '@mrfylke/contact-form';
import { translation as _ } from '@atb/translations/commons';
import { byOrg } from '@atb/modules/org-data';
import { orgSpecificTranslations } from '@atb/translations/utils';

type LayoutOverride = NonNullable<
  ContactFormTranslationsOverride['common']
>['Layout'];

const layoutOrgOverrides = {
  nfk: {
    meta: {
      defaultDescription: _(
        'Finn rutetider, holdeplasser og tilbud for buss, båt og tog i Nordland med reiseplanleggeren.',
        'Find timetables, stops and offers for bus, boat and train in Nordland with the travel planner.',
        'Finn rutetider, haldeplassar og tilbod for buss, båt og tog i Nordland med reiseplanleggaren.',
      ),
    },
  },
  fram: {
    meta: {
      defaultDescription: _(
        'Finn rutetider, holdeplasser, kaier og tilbud for buss, hurtigbåt og ferge i Møre og Romsdal med reiseplanleggeren.',
        'Find timetables, stops and offers for bus, boat and ferry in Møre og Romsdal with the travel planner.',
        'Finn rutetider, haldeplassar, kaier og tilbod for buss, hurtigbåt og ferje i Møre og Romsdal med reiseplanleggaren.',
      ),
    },
  },
  troms: {
    meta: {
      defaultDescription: _(
        'Finn rutetider, holdeplasser, kaier og tilbud for buss, hurtigbåt og ferge i Troms med reiseplanleggeren.',
        'Find timetables, stops and offers for bus, boat and ferry in Troms with the travel planner.',
        'Finn rutetider, haldeplassar, kaier og tilbod for buss, hurtigbåt og ferje i Troms med reiseplanleggaren.',
      ),
    },
  },
  vkt: {
    meta: {
      defaultDescription: _(
        'Finn rutetider, holdeplasser, kaier og tilbud for buss, hurtigbåt og ferge i Vestfold med reiseplanleggeren.',
        'Find timetables, stops and offers for bus, boat and ferry in Vestfold with the travel planner.',
        'Finn rutetider, haldeplassar, kaier og tilbod for buss, hurtigbåt og ferje i Vestfold med reiseplanleggaren.',
      ),
    },
  },
  farte: {
    meta: {
      defaultDescription: _(
        'Finn rutetider, holdeplasser, kaier og tilbud for buss, hurtigbåt og ferge i Telemark med reiseplanleggeren.',
        'Find timetables, stops and offers for bus, boat and ferry in Telemark with the travel planner.',
        'Finn rutetider, haldeplassar, kaier og tilbod for buss, hurtigbåt og ferje i Telemark med reiseplanleggaren.',
      ),
    },
  },
};

/**
 * Full, resolved Layout translations for the current org - used directly by
 * planner-web's own general pages, not just the widget.
 *
 * TODO: this couples planner-web's own general layout text to the
 * contact-form package's override mechanism (it's built from the same
 * org-delta that feeds LayoutOverride below). Decouple these once
 * planner-web's non-contact-form layout text has a home that isn't shaped
 * around the widget's translation overrides.
 */
export const Layout: typeof CommonText.Layout = orgSpecificTranslations(
  CommonText.Layout,
  layoutOrgOverrides,
);

/** Partial override fed into the contact-form widget's config.translations. */
export const LayoutOverride: LayoutOverride = byOrg(layoutOrgOverrides) ?? {};
