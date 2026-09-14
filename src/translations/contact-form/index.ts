import { TicketTypeId } from '@mrfylke/contact-form';
import type { ContactFormTranslationsOverride } from '@mrfylke/contact-form';
import { translation as _ } from '@atb/translations/commons';
import { byOrg } from '@atb/modules/org-data';

export const translations: ContactFormTranslationsOverride = {
  pages: {
    Contact:
      byOrg({
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
            ticketType: {
              options: [
                {
                  id: TicketTypeId.SingleTicket,
                  name: _('Enkeltbillett', 'Single ticket', 'Enkeltbillett'),
                },
                {
                  id: TicketTypeId.PeriodTicket,
                  name: _(
                    'Periodebillett (sonebasert)',
                    'Period ticket (zone-based)',
                    'Periodebillett (sonebasert)',
                  ),
                },
                {
                  id: TicketTypeId.FramYoung,
                  name: _('FRAM Ung', 'FRAM Ung', 'FRAM Ung'),
                },
                {
                  id: TicketTypeId.FramStudent,
                  name: _('FRAM Student', 'FRAM Student', 'FRAM Student'),
                },
                {
                  id: TicketTypeId.FramAdult,
                  name: _('FRAM Vaksen', 'FRAM Vaksen', 'FRAM Vaksen'),
                },
                {
                  id: TicketTypeId.FramSenior,
                  name: _('FRAM Honnør', 'FRAM Honnør', 'FRAM Honnør'),
                },
              ],
            },
          },
        },
      }) ?? {},
  },
};
