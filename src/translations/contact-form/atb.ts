import {
  richTranslation,
  T,
  TicketTypeId,
  type ContactFormTranslationsOverride,
  type ReasonForTransportFailure,
} from '@mrfylke/contact-form';
import { translation, type TranslatedString } from '@atb/translations/commons';

// AtB has not enabled Nynorsk (see orgs/atb.json), so Bokmål is used as Nynorsk.
function _(invariant: string): TranslatedString;
function _(norwegian: string, english: string): TranslatedString;
function _(norwegian: string, english?: string): TranslatedString {
  return translation(norwegian, english ?? norwegian, norwegian);
}
const _rich = (norwegian: string, english: string) =>
  richTranslation(norwegian, english, norwegian);

export const atbTranslations: ContactFormTranslationsOverride = {
  terms: {
    travelCard: {
      base: _('t:kort', 't:card'),
      indefinite: _('et t:kort', 'a t:card'),
      definite: _('t:kortet', 'the t:card'),
      plural: _('t:kort', 't:cards'),
      // t:kort is never capitalized.
      capitalized: {
        base: _('t:kort', 't:card'),
        definite: _('t:kortet', 'The t:card'),
        plural: _('t:kort', 't:cards'),
      },
    },
    travelCardNumber: {
      base: _('t:kortnummer', 't:card number'),
      definite: _('t:kortnummeret', 'the t:card number'),
      capitalized: {
        base: _('t:kortnummer', 't:card number'),
        definite: _('t:kortnummeret', 'The t:card number'),
      },
    },
    orgApp: {
      base: _('AtB-appen', 'the AtB app'),
      definite: _('AtB-appen', 'the AtB app'),
      // Standalone label, without "the".
      capitalized: {
        base: _('AtB-appen', 'AtB app'),
      },
    },
    ticketApp: {
      base: _('AtB-appen', 'AtB app'),
    },
  },
  pages: {
    Contact: {
      ticketControl: {
        postponePayment: {
          info: _(
            'Ved å sende inn skjemaet, blir betalingsfristen utsatt med 14 dager fra opprinnelig forfallsdato, dvs. totalt 60 dagers betalingsfrist. Du velger selv om du vil dele opp betalingen og gjøre flere innbetalinger i løpet av denne perioden eller betale hele beløpet på en gang',
            'By sending the form, the payment deadline is extended by 14 days from the original due date, providing a total of 60 days to make your payment. During this period, you can choose to either divide it into multiple installments or pay the full amount at once.',
          ),
        },
        feeComplaint: {
          firstAgreement: {
            rules: [
              _(
                'Du er selv ansvarlig for å ha gyldig billett før du går om bord.',
                'You are responsible for having a valid ticket before boarding.',
              ),
              _(
                'Har du kjøpt en billett som må aktiveres, må billetten være aktivert før du går om bord.',
                'If you have purchased a ticket that must be activated, the ticket must be activated before boarding.',
              ),
              _(
                'Reiser du med en rabattert billett, må du ved billettkontroll kunne dokumentere at du har rett til rabatten og fremvise nødvendig legitimasjon.',
                'If you are traveling with a discounted ticket, you must be able to document your eligibility for the discount and show the necessary identification during ticket inspection.',
              ),
              _(
                'Har du ikke gyldig billett for reisen, vil du få gebyr ved billettkontroll.',
                'If you do not have a valid ticket for the trip, you will receive a fine during the ticket inspection.',
              ),
            ],
          },
          secondAgreement: {
            info: _(
              'Har du krav på rabatt, men har fått gebyr fordi du ikke kunne framvise gyldig legitimasjon, kan du få redusert gebyret ditt til kr. 150,- ved å besøke vårt kundesenter og fremvise dokumentasjon eller sende det til oss innen 7 dager.',
              'If you are eligible for a discount but were charged a fee because you were unable to present valid identification, you can have your fee reduced to 150 NOK by visiting our customer service center and presenting the necessary documentation or by sending it to us within 7 days.',
            ),
            rules: [
              _(
                'Kunden bruker et skjermbilde av billett eller en forfalsket billett.',
                'The customer uses a screenshot of a ticket or a counterfeit ticket.',
              ),
              _(
                'Kunden kjøper billett til seg selv eller andre for seint, for eksempel etter ombordstiging.',
                'The customer buys a ticket for themselves or others too late, for example, after boarding.',
              ),
              _(
                'Kunden har glemt å fornye periodebillett.',
                'The customer has forgotten to renew the ticket.',
              ),
              _(
                'Reisekortet ligger igjen hjemme.',
                'The travel card is left at home.',
              ),
            ],
          },
          ticketStorage: {
            app: {
              title: _(
                `${T.ticketApp.base} eller SMS`,
                `${T.ticketApp.base} or SMS`,
              ),
            },
          },
        },
      },
      refund: {
        title: _('Refusjon og reisegaranti', 'Refund and travel guarantee'),
        refundAndTravelGuarantee: {
          description: _('Reisegaranti', 'Travel guarantee'),
          refundTaxi: {
            label: _(
              'Jeg ønsker refusjon for alternativ transport',
              'I would like a refund for alternative transportation',
            ),
          },
          refundCar: {
            label: _(
              'Jeg ønsker refusjon for kjøregodtgjørelse',
              'I would like a refund for my mileage expenses.',
            ),
          },
        },
        agreement: {
          title: _('Reisegaranti', 'Travel guarantee'),
          delayedRefundText: _rich(
            'Hvis bussen, bestillingstransporten eller hurtigbåten er forsinket eller innstilt, kan du få dekket utgifter til annen transport.\n\nVi utbetaler reisegaranti kun til norske bankkontoer.',
            'If the bus, on-demand transport or express boat is delayed or canceled, you can get your expenses for alternative transport covered.\n\nWe only pay out travel guarantee to Norwegian bank accounts.',
          ),
          ticketRefundText: _rich(
            'Har du kjøpt feil billett eller en billett du ikke har brukt? Da skal du søke om [refusjon av billett](?type=refundOfTicket), ikke reisegaranti.',
            'Have you bought the wrong ticket or a ticket you have not used? Then you should apply for a [refund of ticket](?type=refundOfTicket), not travel guarantee.',
          ),
          travelGuaranteeExceptions: {
            exceptions: [
              {
                text: _rich(
                  'Les mer om [reisegaranti for buss](https://www.atb.no/reisegaranti-buss/)',
                  'Read more about [travel guarantee for bus](https://www.atb.no/reisegaranti-buss/)',
                ),
                examples: [],
              },
              {
                text: _rich(
                  'Les mer om [reisegaranti for hurtigbåt](https://www.atb.no/reisegaranti-hurtigbat/)',
                  'Read more about [travel guarantee for express boat](https://www.atb.no/reisegaranti-hurtigbat/)',
                ),
                examples: [],
              },
            ],
            exclusion: _(''),
            link: {
              text: _(''),
              href: _(''),
            },
          },
        },
        refundTaxi: {
          taxiReceipt: {
            title: _(
              'Informasjon fra kvitteringen',
              'Information from the receipt',
            ),
            info: _(
              'Last opp en kopi eller et bilde av kvitteringen fra turen. Kvitteringen må inneholde informasjon om hvor du reiste fra og til.',
              'Upload a copy or a photo of the receipt from the ride. The receipt must contain information about where you traveled from and to.',
            ),
          },
        },
        residualValueOnTravelCard: {
          title: _(
            'Søk refusjon av saldo',
            'Apply for a refund of remaining balance',
          ),
          description: _('Refusjon av saldo', 'Refund of remaining balance'),
          text: _rich(
            '**t:kort verdi**\nDu kan ikke lenger bruke t:kort for buss, trikk og hurtigbåt med verdi. Hvis du har igjen penger på t:kortet, må du søke om refusjon innen 30. mars 2028. Etter det blir refusjonskrav foreldet.\n\n[Søk refusjon for saldo på t:kort](https://www.atb.no/billettrefusjon/refusjon-t-kort-verdi/)\n\n**Mobillett konto**\nAppen AtB Mobillett er avviklet og erstattet med AtB-appen. Hvis du har saldo igjen på Mobillett konto, må du søke om refusjon innen 30. april 2027. Etter det blir refusjonskrav foreldet.\n\n[Søk refusjon for saldo på Mobillettkonto](https://www.atb.no/billettrefusjon/refusjon-mobillett-konto/)',
            '**t:card value**\nYou can no longer use a t:card with value for bus, tram and express boat. If you have money left on your t:card, you must apply for a refund by 30 March 2028. After that, refund claims expire.\n\n[Apply for a refund of remaining t:card balance](https://www.atb.no/en/ticket-refund/)\n\n**Mobillett account**\nThe AtB Mobillett app has been discontinued and replaced by the AtB app. If you have a remaining balance on your Mobillett account, you must apply for a refund by 30 April 2027. After that, refund claims expire.\n\n[Apply for a refund of remaining Mobillett account balance](https://www.atb.no/en/ticket-refund/)',
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
          ),
        },
      },
      lostAndFound: {
        info: _rich(
          `Har du glemt igjen eller mistet noe om bord, blir det tatt hånd om av AtB kundesenter eller operatøren for transportmiddelet.

**Bybuss i Trondheimsområdet (grønne busser):** Beskriv gjenstanden i skjemaet, så tar vi kontakt hvis vi finner den. Utlevering skjer kun etter avtale.
**Andre transportmidler:** [Ta kontakt med riktig kontor for hittegods](https://www.atb.no/hittegods/).

Har du mistet ${T.travelCard.definite} ditt, må du [kontakte AtB kundesenter](https://www.atb.no/kontakt/).

[Les mer om hittegods på atb.no](https://www.atb.no/hittegods/)`,
          `If you have left something behind or lost something on board, it is handled by AtB customer service or the operator of that mode of transport.

**City bus in the Trondheim area (green buses):** Describe the item in the form, and we will contact you if we find it. Items can only be collected by appointment.
**Other transport modes:** [Contact the right lost property office](https://www.atb.no/en/lost-and-found/).

If you have lost your ${T.travelCard.base}, [contact AtB customer service](https://www.atb.no/kontakt/).

[Read more about lost property on atb.no](https://www.atb.no/en/lost-and-found/)`,
        ),
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
              ),
              _rich(
                't:kort kan fylles på i [nettbutikk](https://nettbutikk.atb.no/) eller i kundesenteret vårt i Prinsens gate 41, 7011 Trondheim.',
                'You can top up your travel card in the [webshop](https://nettbutikk.atb.no/) or at our customer service center at Prinsens gate 41, 7011 Trondheim.',
              ),
            ],
          },
        },
        refund: {
          appTicketRefund: {
            label: _(
              `Jeg har kjøpt billett i ${T.orgApp.base}, nettbutikk eller SMS`,
              `I bought the ticket in ${T.orgApp.base}, the webshop or by SMS`,
            ),
          },
          initialAgreement: {
            ticketRefundAvailability: {
              rules: [
                _(
                  'Hvis du endrer adresse, blir sykemeldt eller endrer reisemønster på grunn av jobb eller skole. Slike forhold må dokumenteres.',
                  'If you change your address, go on sick leave, or change your travel patterns due to work or school. Such circumstances must be documented.',
                ),
                _(
                  'Hvis du har kjøpt billett for feil reisestrekning, passasjerkategori eller tidspunkt. Du får refusjon for billetten som du har kjøpt feil dersom du kjøper ny, korrekt billett.',
                  'If you have bought a ticket for the wrong journey, passenger category or time. You will get a refund for the ticket you bought by mistake if you buy a new, correct ticket.',
                ),
              ],
            },
            refundableTicketTypes: {
              rules: [
                _(
                  'Periodebillett: Du får refundert dagene som er igjen på den gamle billetten, når du har kjøpt en ny periodebillett.',
                  'Period ticket: You will be refunded for the days remaining on the old ticket once you have purchased a new period ticket.',
                ),
                _(
                  'Klippekort: Du får refusjon for de klippene du har igjen. Du får ikke refusjon for klipp som har gått ut på dato.',
                  'Carnet: You will get a refund for the clips you have left. You will not get a refund for expired clips.',
                ),
                _(
                  'Enkeltbillett: Du får refusjon hvis du har kjøpt feil billett og deretter kjøper en ny og riktig billett.',
                  'Single ticket: You will get a refund if you bought the wrong ticket and then buy a new, correct ticket.',
                ),
              ],
            },
          },
          otherTicketRefund: {
            label: _(
              'Jeg har kjøpt billetten om bord, hos AtB kundesenter eller på et annet utsalgssted',
              'I bought the ticket on board, at the AtB service center or at another point of sale',
            ),
          },
        },
      },
      groupTravel: {
        description: {
          url: _(
            'https://www.atb.no/gruppereise/',
            'https://www.atb.no/group-travels/',
          ),
        },
      },
      modeOfTransport: {
        title: _('Tilbakemelding om reisen', 'Travel feedback'),
        injury: {
          description: _(
            'Melde fra om personskade eller skade på eiendel',
            'Report personal injury or damage to property',
          ),
          feedbackDescription: _(
            'Unngå å oppgi personlig informasjon som bankkortnummer eller helseopplysninger. Vi vil spørre deg senere om det er nødvendig. Utlegg (som for eksempel rens av klær eller reparasjon på eiendel/kjøretøy) må dokumenteres med vedlegg.',
            'Avoid providing personal information such as bank card numbers or health information. We will ask you later if it is necessary. Expenses (for example cleaning of clothes or repair of property/vehicle) must be documented with attachments.',
          ),
          info: _(
            'Ønsker du å kreve erstatning for tap av eller skade på gjenstander eller person, må krav sendes til AtB kundesenter innen rimelig tid. Erstatningskravet må dokumenteres.',
            'If you wish to claim compensation for loss of or damage to property, or for personal injury, you must submit your claim to the AtB service center within a reasonable time. The compensation claim must be supported by evidence.',
          ),
        },
      },
      journeyInfo: {
        title: _('Reiseinformasjon', 'Travel information'),
        info: {
          useTravelSearch: _(
            'Du kan bruke reiseplanleggeren for å finne oppdatert reiseinformasjon om linjene, holdeplassene, tidene og annet.',
            'You can use the journey planner to find updated travel information about the lines, stops, times and other.',
          ),
        },
      },
      input: {
        purchasePlatform: {
          platforms: {
            framWeb: _('AtB nettbutikk', 'AtB webshop'),
          },
        },
        customerNumber: {
          description: _(
            'Består av 7 eller 8 siffer og står under Profil i AtB-appen eller i nettbutikken.',
            'Consists of 7 or 8 digits and is shown under Profile in the AtB app or in the webshop.',
          ),
        },
        travelCardNumber: {
          info: _(
            `Består av 16 siffer og står på baksiden av ${T.travelCard.definite} ditt.`,
            `Consists of 16 digits and is on the back of your ${T.travelCard.base}.`,
          ),
        },
        feeNumber: {
          description: _(
            'Består av 5 eller 6 siffer og står øverst i høyre hjørne på gebyret.',
            'Consists of 5 or 6 digits and is in the top right corner of the fee.',
          ),
        },
        refundReason: {
          description: _(
            'Ved avvik/feilkjøp og bruk av alternativ transport må dette dokumenteres med vedlegg. For eksempel billett/kvittering fra flybuss, tog, reise med sparkesykkel med mer.',
            'In case of deviations/incorrect purchases and use of alternative transport, this must be documented with attachments. For example, a ticket/receipt from the airport bus, train, e-scooter trip and more.',
          ),
        },
        plannedDepartureTime: {
          label: _(
            'Planlagt avgangstid fra holdeplass/kai du reiser fra',
            'Planned departure time from the stop you are traveling from',
          ),
        },
        reasonForTransportFailure: {
          options: [
            {
              id: 'transportDidNotArrive',
              name: _(
                'Transportmiddel kom ikke',
                'Mode of transport did not arrive',
              ),
            },
            {
              id: 'missedNextTransport',
              name: _(
                'Mistet neste transportmiddel',
                'Lost next mode of transport',
              ),
            },
            {
              id: 'didNotStopAtStop',
              name: _(
                'Stoppet ikke på holdeplassen',
                'Did not stop at the stop',
              ),
            },
            {
              id: 'incorrectAppInformation',
              name: _(
                `Feil informasjon i ${T.orgApp.base} eller reiseplanlegger`,
                `Incorrect information in ${T.orgApp.base} or travel planner`,
              ),
            },
          ] satisfies ReasonForTransportFailure[],
        },
        ticketType: {
          options: [
            {
              id: TicketTypeId.SingleTicket,
              name: _('Enkeltbillett', 'Single ticket'),
            },
            {
              id: TicketTypeId.PeriodTicket,
              name: _('Periodebillett', 'Period ticket'),
            },
            {
              id: 'carnet',
              name: _('Klippekort', 'Carnet'),
            },
          ],
        },
      },
    },
  },
};
