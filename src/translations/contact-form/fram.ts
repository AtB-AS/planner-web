import {
  richTranslation as _rich,
  type ContactFormTranslationsOverride,
} from '@mrfylke/contact-form';
import { translation as _ } from '@atb/translations/commons';

export const framTranslations: ContactFormTranslationsOverride = {
  pages: {
    Contact: {
      ticketControl: {
        feeComplaint: {
          ticketStorage: {
            app: {
              title: _(
                'Mobilapp (f.eks. FRAM, Entur)',
                'Mobile app (e.g. FRAM, Entur)',
                'Mobilapp (f.eks. FRAM, Entur)',
              ),
            },
          },
        },
      },
      refund: {
        refundCar: {
          info: _('', '', ''),
        },
        agreement: {
          travelGuaranteeExceptions: {
            exceptions: [
              {
                text: _(
                  'Reisegarantien gjelder ikke for fergene. Reisegarantien gjelder heller ikke for flybussen i Ålesund eller andre kommersielle busslinjer.',
                  'The travel guarantee does not apply to the ferries. The travel guarantee also does not apply to the airport bus in Ålesund or other commercial bus lines.',
                  'Reisegarantien gjeld ikkje for ferjene. Reisegarantien gjeld heller ikkje for flybussen i Ålesund eller andre kommersielle busslinjer.',
                ),
                examples: [],
              },
              {
                text: _(
                  'Reisegarantien gjelder ikke dersom det er 20 minutter eller mindre til neste avgang i henhold til rutetabellen.',
                  'The travel guarantee does not apply if there are 20 minutes or less until the next departure according to the timetable.',
                  'Reisegarantien gjeld ikkje dersom det er 20 minutt eller mindre til neste avgang i følgje rutetabellen.',
                ),
                examples: [],
              },
              {
                text: _(
                  'Reisegarantien gjelder heller ikke hvis forsinkelsen eller innstillingen skyldes forhold utenfor kontrollen til FRAM eller operatøren. Dette inkluderer situasjoner som (for eksempel):',
                  'The travel guarantee also does not apply if the delay or cancellation is due to circumstances beyond the control of FRAM or the operator. These are cases such as (for example):',
                  'Reisegarantien gjeld heller ikkje dersom forseinkinga eller innstillinga skjer på grunn av forhold utanfor kontrollen til FRAM eller operatøren. Dette er tilfelle som (for eksempel):',
                ),
                examples: [
                  _(
                    'offentlige påbud og forbud',
                    'public orders and prohibitions',
                    'offentlege påbod og forbod',
                  ),
                  _(
                    'streik og lignende',
                    'strikes and similar situations',
                    'streik og liknande',
                  ),
                  _(
                    'naturkatastrofer',
                    'natural disasters',
                    'naturkatastrofar',
                  ),
                  _(
                    'ekstraordinære værforhold',
                    'extraordinary weather conditions',
                    'ekstraordinære vêrforhold',
                  ),
                  _(
                    'vegarbeid eller uforutsette problemer med kjøreveien',
                    'roadworks or unforeseen issues with the road',
                    'vegarbeid eller uførutsette problem med køyrevegen',
                  ),
                  _(
                    'større arrangementer eller andre trafikale forhold som i stor grad rammer kollektivtrafikken',
                    'major events or other traffic conditions that significantly affect public transportation',
                    'større arrangement eller andre trafikale forhold som i stor grad rammar kollektivtrafikken',
                  ),
                  _('pandemi', 'pandemic', 'pandemi'),
                ],
              },
            ],
            link: {
              href: _(
                'https://frammr.no/hjelp-og-kontakt/reisegaranti/',
                'https://frammr.no/hjelp-og-kontakt/reisegaranti/?sprak=3',
                'https://frammr.no/hjelp-og-kontakt/reisegaranti/',
              ),
            },
          },
        },
      },
      lostProperty: {
        description: {
          url: _(
            'https://frammr.no/hjelp-og-kontakt/hittegods/',
            'https://frammr.no/hjelp-og-kontakt/hittegods/?sprak=3',
            'https://frammr.no/hjelp-og-kontakt/hittegods/',
          ),
        },
      },
      ticketing: {
        additionalTicketingInfo: {
          href: _(
            'https://frammr.no/billettar/billettar-og-prisar/ferje/',
            'https://frammr.no/billettar/billettar-og-prisar/ferje/?sprak=3',
            'https://frammr.no/billettar/billettar-og-prisar/ferje/?sprak=11',
          ),
        },
        travelCard: {
          orderTravelCard: {
            detailsList: [
              _(
                'Et reisekort er et fysisk plastkort. På reisekortet kan du legge periodebilletter.',
                'A travel card is a physical plastic card. You can add period tickets to the travel card',
                'Eit reisekort er eit fysisk plastkort. På reisekortet kan du legge periodebillettar.',
              ),
              _(
                'Reisekort får du tak i hos sjåføren om bord i bussen, eller matrosen om bord i hurtigbåten. Det er også tilgjengelig på salgskontoret i Molde og Ålesund. De har tomme kort som er gratis ved utlevering.',
                'Travel cards can be provided by the bus driver, or the sailor on board the express boat. They can also be obtained at sales offices in Molde and Ålesund. Blank cards are provided free of charge upon delivery.',
                'Reisekort får du tak i hos sjåføren om bord i bussen, eller matrosen om bord i hurtigbåten. Det er også tilgjengeleg på salskontoret i Molde og Ålesund. Dei har tomme kort som er gratis ved utlevering.',
              ),
              _rich(
                'Du trenger ikke kjøpe produktet hos sjåfør. Du kan ta med deg et kort og fylle på det produktet du vil i [nettbutikken](https://nettbutikk.frammr.no/)',
                'You don’t need to purchase the product from the driver. You can take a card with you and top up the desired product later in the [webshop](https://nettbutikk.frammr.no/)',
                'Du treng ikkje kjøpe produktet hos sjåfør. Du kan ta med deg eit kort og fylle på det produktet du vil i [nettbutikken](https://nettbutikk.frammr.no/)',
              ),
            ],
          },
        },
      },
      groupTravel: {
        description: {
          url: _(
            'https://frammr.no/reise/gruppereise/',
            'https://frammr.no/journey/group-travel/?sprak=3',
            'https://frammr.no/reise/gruppereise/',
          ),
        },
      },
      input: {
        purchasePlatform: {
          platforms: {
            framApp: _('FRAM-appen', 'FRAM app', 'FRAM-appen'),
            framWeb: _('FRAM nettbutikk', 'FRAM webshop', 'FRAM nettbutikk'),
          },
        },
        customerNumber: {
          description: _(
            'Består av 7 siffer og står under Min bruker i FRAM-appen eller i nettbutikken.',
            'Consists of 7 digits and is shown under My user in the FRAM app or in the webshop.',
            'Består av 7 siffer og står under Min bruker i FRAM-appen eller i nettbutikken.',
          ),
        },
      },
    },
  },
};
