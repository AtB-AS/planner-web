import {
  T,
  type ContactFormTranslationsOverride,
  type ReasonForTransportFailure,
} from '@mrfylke/contact-form';
import { translation as _ } from '@atb/translations/commons';
import { richTranslation as _rich } from '@mrfylke/contact-form';
import { byOrg } from '@atb/modules/org-data';

export const translations: ContactFormTranslationsOverride = {
  terms: byOrg<ContactFormTranslationsOverride['terms']>({
    atb: {
      travelCard: {
        base: _('t:kort', 't:card', 't:kort'),
        indefinite: _('et t:kort', 'a t:card', 'eit t:kort'),
        definite: _('t:kortet', 'the t:card', 't:kortet'),
        plural: _('t:kort', 't:cards', 't:kort'),
        // t:kort is never capitalized.
        capitalized: {
          base: _('t:kort', 't:card', 't:kort'),
          definite: _('t:kortet', 'The t:card', 't:kortet'),
          plural: _('t:kort', 't:cards', 't:kort'),
        },
      },
      travelCardNumber: {
        base: _('t:kortnummer', 't:card number', 't:kortnummer'),
        definite: _('t:kortnummeret', 'the t:card number', 't:kortnummeret'),
        capitalized: {
          base: _('t:kortnummer', 't:card number', 't:kortnummer'),
          definite: _('t:kortnummeret', 'The t:card number', 't:kortnummeret'),
        },
      },
      orgApp: {
        base: _('AtB-appen', 'the AtB app', 'AtB-appen'),
        definite: _('AtB-appen', 'the AtB app', 'AtB-appen'),
        // Standalone label, without "the".
        capitalized: {
          base: _('AtB-appen', 'AtB app', 'AtB-appen'),
        },
      },
      ticketApp: {
        base: _('AtB-appen', 'AtB app', 'AtB-appen'),
      },
    },
  }),
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
            feeComplaint: {
              secondAgreement: {
                info: _(
                  'Har du krav på rabatt, men har fått gebyr fordi du ikke kunne framvise gyldig legitimasjon, kan du få redusert gebyret ditt til kr. 150,- ved å besøke vårt kundesenter og fremvise dokumentasjon eller sende det til oss innen 7 dager.',
                  'If you are eligible for a discount but were charged a fee because you were unable to present valid identification, you can have your fee reduced to 150 NOK by visiting our customer service center and presenting the necessary documentation or by sending it to us within 7 days.',
                  'Har du krav på rabatt, men har fått gebyr fordi du ikkje kunne vise fram gyldig legitimasjon, kan du få redusert gebyret ditt til kr 150,- ved å besøkje kundesenteret vårt og vise fram dokumentasjon eller sende dokumentasjonen til oss innan 7 dagar.',
                ),
                rules: [
                  _(
                    'Kunden bruker et skjermbilde av billett eller en forfalsket billett.',
                    'The customer uses a screenshot of a ticket or a counterfeit ticket.',
                    'Kunden brukar eit skjermbilete av billett eller ein forfalska billett.',
                  ),
                  _(
                    'Kunden kjøper billett til seg selv eller andre for seint, for eksempel etter ombordstiging.',
                    'The customer buys a ticket for themselves or others too late, for example, after boarding.',
                    'Kunden kjøper billett til seg sjølv eller andre for seint, for eksempel etter ombordstiging.',
                  ),
                  _(
                    'Kunden har glemt å fornye periodebillett.',
                    'The customer has forgotten to renew the ticket.',
                    'Kunden har gløymt å fornye periodebillett.',
                  ),
                  _(
                    'Reisekortet ligger igjen hjemme.',
                    'The travel card is left at home.',
                    'Reisekortet ligg igjen heime.',
                  ),
                ],
              },
            },
          },
          refund: {
            title: _(
              'Refusjon og reisegaranti',
              'Refund and travel guarantee',
              'Refusjon og reisegaranti',
            ),
            refundAndTravelGuarantee: {
              description: _(
                'Reisegaranti',
                'Travel guarantee',
                'Reisegaranti',
              ),
              refundTaxi: {
                label: _(
                  'Jeg ønsker refusjon for alternativ transport',
                  'I would like a refund for alternative transportation',
                  'Eg ønsker refusjon for alternativ transport',
                ),
              },
              refundCar: {
                label: _(
                  'Jeg ønsker refusjon for kjøregodtgjørelse',
                  'I would like a refund for my mileage expenses.',
                  'Eg ønskjer refusjon for køyregodtgjersle',
                ),
              },
            },
            agreement: {
              title: _('Reisegaranti', 'Travel guarantee', 'Reisegaranti'),
              delayedRefundText: _(
                'Ved forsinkelser eller innstillinger på buss, bestillingstransport eller hurtigbåt, kan du ha rett til refusjon for utlegg til annen skyss. Merk at vi ikke betaler ut reisegaranti til utenlandsk konto.',
                'If your bus, on-demand transport, or express boat is delayed or canceled, you may be entitled to a refund for the cost of alternative transportation. Please note that we do not make travel guarantee payments to international bank accounts.',
                'Ved forseinkingar eller innstillingar på buss, bestillingstransport eller hurtigbåt kan du ha rett til refusjon for utlegg til annan skyss. Merk at vi ikkje betaler ut reisegaranti til utanlandsk konto.',
              ),
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
                    'https://www.atb.no/reisegaranti-buss/',
                    'https://www.atb.no/en/travel-guarantee/',
                    'https://www.atb.no/reisegaranti-buss/',
                  ),
                },
              },
            },
            refundTaxi: {
              taxiReceipt: {
                title: _(
                  'Informasjon fra kvitteringen',
                  'Information from the receipt',
                  'Informasjon frå kvitteringa',
                ),
                info: _(
                  'Last opp en kopi eller et bilde av kvitteringen fra turen. Kvitteringen må inneholde informasjon om hvor du reiste fra og til.',
                  'Upload a copy or a photo of the receipt from the ride. The receipt must contain information about where you traveled from and to.',
                  'Last opp ein kopi eller eit bilde av kvitteringa frå turen. Kvitteringa må innehalde informasjon om kor du reiste frå og til.',
                ),
              },
            },
            residualValueOnTravelCard: {
              title: _(
                'Søk refusjon av saldo',
                'Apply for a refund of remaining balance',
                'Søk refusjon av saldo',
              ),
              description: _(
                'Refusjon av saldo',
                'Refund of remaining balance',
                'Refusjon av saldo',
              ),
              text: _(
                '**t:kort verdi**\nDu kan ikke lenger bruke t:kort for buss, trikk og hurtigbåt med verdi. Hvis du har igjen penger på t:kortet, må du søke om refusjon innen 30. mars 2028. Etter det blir refusjonskrav foreldet.\n\n[Søk refusjon for saldo på t:kort](https://www.atb.no/billettrefusjon/refusjon-t-kort-verdi/)\n\n**Mobillett konto**\nAppen AtB Mobillett er avviklet og erstattet med AtB-appen. Hvis du har saldo igjen på Mobillett konto, må du søke om refusjon innen 30. april 2027. Etter det blir refusjonskrav foreldet.\n\n[Søk refusjon for saldo på Mobillettkonto](https://www.atb.no/billettrefusjon/refusjon-mobillett-konto/)',
                '**t:card value**\nYou can no longer use a t:card with value for bus, tram and express boat. If you have money left on your t:card, you must apply for a refund by 30 March 2028. After that, refund claims expire.\n\n[Apply for a refund of remaining t:card balance](https://www.atb.no/en/ticket-refund/)\n\n**Mobillett account**\nThe AtB Mobillett app has been discontinued and replaced by the AtB app. If you have a remaining balance on your Mobillett account, you must apply for a refund by 30 April 2027. After that, refund claims expire.\n\n[Apply for a refund of remaining Mobillett account balance](https://www.atb.no/en/ticket-refund/)',
                '**t:kort verdi**\nDu kan ikkje lenger bruke t:kort for buss, trikk og hurtigbåt med verdi. Viss du har att pengar på t:kortet, må du søkje om refusjon innan 30. mars 2028. Etter det blir refusjonskrav forelda.\n\n[Søk refusjon for saldo på t:kort](https://www.atb.no/billettrefusjon/refusjon-t-kort-verdi/)\n\n**Mobillett konto**\nAppen AtB Mobillett er avvikla og erstatta med AtB-appen. Viss du har saldo att på Mobillett konto, må du søkje om refusjon innan 30. april 2027. Etter det blir refusjonskrav forelda.\n\n[Søk refusjon for saldo på Mobillettkonto](https://www.atb.no/billettrefusjon/refusjon-mobillett-konto/)',
              ),
              automatedProcessNotice: {
                note: _(''),
                text: _(''),
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
              detail: _(''),
              linkText: _(''),
              href: _(''),
            },
            travelCard: {
              orderTravelCard: {
                detailsList: [
                  _rich(
                    'Et t:kort er et fysisk plastkort. Du kan bestille det [her](https://www.atb.no/bestill-tkort/).',
                    'A travel card is a physical plastic card. You can order one [here](https://www.atb.no/bestill-tkort/).',
                    'Eit t:kort er eit fysisk plastkort. Du kan bestille det [her](https://www.atb.no/bestill-tkort/).',
                  ),
                  _rich(
                    't:kort kan fylles på i [nettbutikk](https://nettbutikk.atb.no/) eller i kundesenteret vårt i Prinsens gate 41, 7011 Trondheim.',
                    'You can top up your travel card in the [webshop](https://nettbutikk.atb.no/) or at our customer service center at Prinsens gate 41, 7011 Trondheim.',
                    't:kort kan fyllast på i [nettbutikken](https://nettbutikk.atb.no/) eller i kundesenteret vårt i Prinsens gate 41, 7011 Trondheim.',
                  ),
                ],
              },
            },
            refund: {
              initialAgreement: {
                ticketRefundAvailability: {
                  rules: [
                    _(
                      'Hvis du endrer adresse, blir sykemeldt eller endrer reisemønster på grunn av jobb eller skole. Slike forhold må dokumenteres.',
                      'If you change your address, go on sick leave, or change your travel patterns due to work or school. Such circumstances must be documented.',
                      'Dersom du endrar adresse, blir sjukmeld eller endrar reisemønster på grunn av arbeid eller skule. Slike forhold må dokumenterast.',
                    ),
                    _(
                      'Ved kjøp av feil reisestrekning, passasjerkategori eller tidspunkt/dato. Vi vil refundere billetten som du har kjøpt feil dersom du kjøper ny, korrekt billett.',
                      'When purchasing the wrong journey, passenger category or time/date. We will refund the ticket that you bought incorrectly if you buy a new, correct ticket.',
                      'Ved kjøp av feil reisestrekning, passasjerkategori eller tidspunkt/dato. Vi vil refundere billetten som du har kjøpt feil dersom du kjøper ny, korrekt billett.',
                    ),
                  ],
                },
                refundableTicketTypes: {
                  rules: [
                    _(
                      'Periodebilletter: Du får refusjon for gjenværende dager etter kjøp av ny billett',
                      'Period tickets: You’ll be refunded for the remaining days after purchasing a new ticket.',
                      'Periodebillettar: Du får refusjon for attverande dagar etter kjøp av ny billett',
                    ),
                    _(
                      'Klippekort: Du får refusjon for antall gjenværende klipp. Klipp utgått på dato refunderes ikke.',
                      'Carnet: You’ll receive a refund for any unused clips. Expired clips are not refundable.',
                      'Klippekort: Du får refusjon for dei klippa du har att. Klipp som har gått ut på dato, blir ikkje refunderte.',
                    ),
                    _(
                      'Enkeltbillett refunderes i utgangspunktet kun ved feilkjøp og når ny, riktig billett er kjøpt.',
                      'Single tickets are generally only refunded if they were purchased in error and a new, correct ticket has been purchased.',
                      'Enkeltbillett blir i utgangspunktet berre refundert ved feilkjøp og når ein ny, korrekt billett er kjøpt.',
                    ),
                  ],
                },
              },
              otherTicketRefund: {
                label: _(
                  'Billett kjøpt om bord eller på utsalgssted',
                  'Ticket purchased on board or at a ticket office',
                  'Billett kjøpt om bord eller på utsalsstad',
                ),
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
          modeOfTransport: {
            injury: {
              info: _(
                'Ønsker du å kreve erstatning for tap av eller skade på gjenstander eller person, må krav sendes til AtB kundesenter innen rimelig tid. Erstatningskravet må dokumenteres.',
                'If you wish to claim compensation for loss of or damage to property, or for personal injury, you must submit your claim to the AtB service center within a reasonable time. The compensation claim must be supported by evidence.',
                'Ønskjer du å krevje erstatning for tap av eller skade på gjenstandar eller person, må krav sendast til AtB kundesenter innan rimeleg tid. Erstatningskravet må dokumenterast.',
              ),
            },
          },
          journeyInfo: {
            title: _(
              'Reiseinformasjon',
              'Travel information',
              'Reiseinformasjon',
            ),
            info: {
              useTravelSearch: _(
                'Du kan bruke reiseplanleggeren for å finne oppdatert reiseinformasjon om linjene, holdeplassene, tidene og annet.',
                'You can use the journey planner to find updated travel information about the lines, stops, times and other.',
                'Du kan bruke reiseplanleggaren for å finne oppdatert reiseinformasjon om linjene, haldeplassene, tidene og anna.',
              ),
            },
          },
          input: {
            purchasePlatform: {
              platforms: {
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
            reasonForTransportFailure: {
              options: [
                {
                  id: 'transportDidNotArrive',
                  name: _(
                    'Transportmiddel kom ikke',
                    'Mode of transport did not arrive',
                    'Transportmiddel kom ikkje',
                  ),
                },
                {
                  id: 'missedNextTransport',
                  name: _(
                    'Mistet neste transportmiddel',
                    'Lost next mode of transport',
                    'Mista neste transportmiddel',
                  ),
                },
                {
                  id: 'didNotStopAtStop',
                  name: _(
                    'Stoppet ikke på holdeplassen',
                    'Did not stop at the stop',
                    'Stoppa ikkje på haldeplassen',
                  ),
                },
                {
                  id: 'incorrectAppInformation',
                  name: _(
                    `Feil informasjon i ${T.orgApp.base} eller reiseplanlegger`,
                    `Incorrect information in ${T.orgApp.base} or travel planner`,
                    `Feil informasjon i ${T.orgApp.base} eller reiseplanlegger`,
                  ),
                },
              ] satisfies ReasonForTransportFailure[],
            },
          },
        },
      }) ?? {},
  },
};
