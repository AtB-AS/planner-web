import { translation as _ } from '@atb/translations/commons';
import { orgSpecificTranslations } from '../utils';

export const LayoutInternal = {
  base: {
    footer: {
      sections: {
        general: {
          header: _(
            'AtB Reiseplanlegger',
            'AtB Travel Planner',
            'AtB Reiseplanlegger',
          ),
          helpPageLink: _('Kontakt oss', 'Contact us', 'Kontakt oss'),
        },
        contact: {
          header: _('Kontakt AtB', 'Contact AtB', 'Kontakt AtB'),
          contactLink: _('Kontakt AtB', 'Contact AtB', 'Kontakt AtB'),
        },
        settings: {
          header: _(
            'Språk og utseende',
            'Language and appearance',
            'Språk og utsjånad',
          ),
          setLanguage: {
            norsk: _(
              'Endre til norsk (bokmål)',
              'Endre til norsk (bokmål)',
              'Endre til norsk (bokmål)',
            ),
            english: _(
              'Switch to English',
              'Switch to English',
              'Switch to English',
            ),
            nynorsk: _(
              'Endre til norsk (nynorsk)',
              'Endre til norsk (nynorsk)',
              'Endre til norsk (nynorsk)',
            ),
          },
          toggleDarkMode: _(
            'Bytt til mørkt utseende',
            'Change to dark mode',
            'Byt til mørk utsjånad',
          ),
          toggleLightMode: _(
            'Bytt til lyst utseende',
            'Change to light mode',
            'Byt til lys utsjånad',
          ),
          cookiesWarning: _(
            '* Overstyring av språk og utseende krever bruk av cookies.',
            '* Overriding language and appearance require cookies.',
            '* Overstyring av språk og utsjånad krev bruk av cookies.',
          ),
        },
      },
      bottomLinks: {
        privacy: _('Personvern', 'Privacy', 'Personvern'),
        accessibilityStatement: _(
          'Tilgjengelighetserklæring',
          'Accessibility statement',
          'Tilgjengelegheitserklæring',
        ),
        termsOfUse: _('Bruksvilkår', 'Terms of use', 'Bruksvilkår'),
      },
    },
  },
};

export const Layout = orgSpecificTranslations(LayoutInternal, {
  nfk: {
    base: {
      footer: {
        sections: {
          general: {
            header: _(
              'Reis Nordland Reiseplanlegger',
              'Reis Nordland Travel Planner',
              'Reis Nordland Reiseplanlegger',
            ),
          },
          contact: {
            header: _(
              'Kontakt Reis Nordland',
              'Contact Reis Nordland',
              'Kontakt Reis Nordland',
            ),
            contactLink: _(
              'Kontakt Reis Nordland',
              'Contact Reis Nordland',
              'Kontakt Reis Nordland',
            ),
          },
        },
      },
    },
  },
  fram: {
    base: {
      footer: {
        sections: {
          general: {
            header: _(
              'Hjelp til reiseplanlegger',
              'Help with travel planner',
              'Hjelp til reiseplanleggar',
            ),
          },
          contact: {
            header: _('Kontakt', 'Contact', 'Kontakt'),
            contactLink: _('Kontakt FRAM', 'Contact FRAM', 'Kontakt FRAM'),
          },
        },
      },
    },
  },
});
