import type { ContactFormTranslationsOverride } from '@mrfylke/contact-form';
import { translation as _ } from '@atb/translations/commons';
import { byOrg } from '@atb/modules/org-data';

export const translations: ContactFormTranslationsOverride = {
  pages: {
    Contact:
      byOrg<NonNullable<ContactFormTranslationsOverride['pages']>['Contact']>({
        fram: {
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
                ],
                detailWithUrl: {
                  href: _(
                    'https://nettbutikk.frammr.no/',
                    'https://nettbutikk.frammr.no/',
                    'https://nettbutikk.frammr.no/',
                  ),
                },
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
                framWeb: _(
                  'FRAM nettbutikk',
                  'FRAM webshop',
                  'FRAM nettbutikk',
                ),
              },
            },
            customerNumber: {
              description: _(
                'Kundenummeret består av 7 siffer og du finner det under Min bruker i FRAM-appen, eller i nettbutikken.',
                'The customer number consists of 7 digits and can be found under My user in the FRAM app, or in the webshop',
                'Kundenummeret består av 7 siffer og du finn det under Min bruker i FRAM-appen, eller i nettbutikken.',
              ),
            },
          },
        },
        atb: {
          ticketControl: {
            postponePayment: {
              info: _(
                'Ved å sende inn skjemaet, blir betalingsfristen utsatt med 14 dager fra opprinnelig forfallsdato, dvs. totalt 60 dagers betalingsfrist. Du velger selv om du vil dele opp betalingen og gjøre flere innbetalinger i løpet av denne perioden eller betale hele beløpet på en gang',
                'By sending the form, the payment deadline is extended by 14 days from the original due date, providing a total of 60 days to make your payment. During this period, you can choose to either divide it into multiple installments or pay the full amount at once.',
                'Ved å sende inn skjemaet, blir betalingsfristen utsett med 14 dagar frå opphaveleg forfallsdato, dvs. totalt 60 dagars betalingsfrist. Du vel sjølv om du vil dele opp betalinga og gjere fleire innbetalingar i løpet av denne perioden eller betale heile beløpet på ein gong',
              ),
            },
          },
          refund: {
            agreement: {
              travelGuaranteeExceptions: {
                exceptions: [
                  {
                    text: _(
                      'Reisegarantien gjelder ikke for båtene. Reisegarantien gjelder heller ikke for kommersielle busslinjer.',
                      'The travel guarantee does not apply to the boats. The travel guarantee also does not apply to commercial bus lines.',
                      'Reisegarantien gjeld ikkje for båtane. Reisegarantien gjeld heller ikkje for kommersielle busslinjer.',
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
                      'Reisegarantien gjelder heller ikke hvis forsinkelsen eller innstillingen skyldes forhold utenfor kontrollen til AtB eller operatøren. Dette inkluderer situasjoner som (for eksempel):',
                      'The travel guarantee also does not apply if the delay or cancellation is due to circumstances beyond the control of AtB or the operator. These are cases such as (for example):',
                      'Reisegarantien gjeld heller ikkje dersom forseinkinga eller innstillinga skjer på grunn av forhold utanfor kontrollen til AtB eller operatøren. Dette er tilfelle som (for eksempel):',
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
                    'https://www.atb.no/reisegaranti/',
                    'https://www.atb.no/en/travel-guarantee/',
                    'https://www.atb.no/reisegaranti/',
                  ),
                },
              },
            },
          },
          lostProperty: {
            description: {
              url: _(
                'https://www.atb.no/hittegods/',
                'https://www.atb.no/en/lost-and-found/',
                'https://www.atb.no/hittegods/',
              ),
            },
          },
          ticketing: {
            additionalTicketingInfo: {
              href: _(
                'https://www.atb.no/en/ferry-ticket/',
                'https://www.atb.no/en/ferry-ticket/',
                'https://www.atb.no/en/ferry-ticket/',
              ),
            },
            travelCard: {
              orderTravelCard: {
                detailWithUrl: {
                  href: _(
                    'https://www.atb.no/billett/',
                    'https://www.atb.no/en/ticket/',
                    'https://www.atb.no/billett/',
                  ),
                },
              },
            },
          },
          groupTravel: {
            description: {
              url: _(
                'https://www.atb.no/gruppereise/',
                'https://www.atb.no/group-travels/',
                'https://www.atb.no/gruppereise/',
              ),
            },
          },
          input: {
            purchasePlatform: {
              platforms: {
                framApp: _('AtB-appen', 'AtB app', 'AtB-appen'),
                framWeb: _('AtB nettbutikk', 'AtB webshop', 'AtB nettbutikk'),
              },
            },
            customerNumber: {
              description: _(
                'Kundenummeret består av 7 siffer og du finner det under Profil i AtB-appen, eller i nettbutikken.',
                'The customer number consists of 7 digits and can be found under Profile in the AtB app, or in the webshop',
                'Kundenummeret består av 7 siffer og du finn det under Profil i AtB-appen, eller i nettbutikken.',
              ),
            },
          },
        },
      }) ?? {},
  },
};
