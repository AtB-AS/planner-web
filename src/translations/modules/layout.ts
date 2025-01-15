import { translation as _ } from '@atb/translations/commons';
import { orgSpecificTranslations } from '../utils';

export const LayoutInternal = {
  base: {
    footer: {
      sections: {
        general: {
          header: _('Reiseplanlegger', 'Travel Planner', 'Reiseplanleggar'),
          supportPageLink: _(
            'Hjelp og kontakt',
            'Help and contact',
            'Hjelp og kontakt',
          ),
          helpPageLink: _(
            'Hjelp til reiseplanleggeren',
            'Help for the travel planner',
            'Hjelp for reiseplanleggaren',
          ),
          ticketPricesPageLink: _(
            'Billetter og priser',
            'Tickets and prices',
            'Billettar og prisar',
          ),
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
          forcedThemeHeader: _('Språk', 'Language', 'Språk'),
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
            '* Overriding language and appearance requires cookies.',
            '* Overstyring av språk og utsjånad krev bruk av cookies.',
          ),
          languageCookiesWarning: _(
            '* Overstyring av språk krever bruk av cookies.',
            '* Overriding language requires cookies.',
            '* Overstyring av språk krev bruk av cookies.',
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
          contact: {
            header: _('Kontakt', 'Contact', 'Kontakt'),
            contactLink: _('Kontakt FRAM', 'Contact FRAM', 'Kontakt FRAM'),
          },
          general: {
            supportPageLink: _(
              'Kontaktskjema',
              'Contact form',
              'Kontaktskjema',
            ),
          },
        },
      },
    },
  },
  troms: {
    base: {
      footer: {
        sections: {
          contact: {
            header: _('Kontakt Svipper', 'Contact Svipper', 'Kontakt Svipper'),
            contactLink: _(
              'Kontakt Svipper',
              'Contact Svipper',
              'Kontakt Svipper',
            ),
          },
        },
      },
    },
  },
  vkt: {
    base: {
      footer: {
        sections: {
          contact: {
            header: _(
              'Kontakt Vestfold Kollektivtrafikk',
              'Contact Vestfold Kollektivtrafikk',
              'Kontakt Vestfold Kollektivtrafikk',
            ),
            contactLink: _(
              'Kontakt Vestfold Kollektivtrafikk',
              'Contact Vestfold Kollektivtrafikk',
              'Kontakt Vestfold Kollektivtrafikk',
            ),
          },
        },
      },
    },
  },
  farte: {
    base: {
      footer: {
        sections: {
          contact: {
            header: _('Kontakt Farte', 'Contact Farte', 'Kontakt Farte'),
            contactLink: _('Kontakt Farte', 'Contact Farte', 'Kontakt Farte'),
          },
        },
      },
    },
  },
});
