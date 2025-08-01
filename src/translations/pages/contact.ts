import {
  ReasonForTransportFailure,
  TicketType,
} from '@atb/page-modules/contact/types';
import { translation as _ } from '@atb/translations/commons';
import { orgSpecificTranslations } from '../utils';

const ContactInternal = {
  contactPageLayout: {
    title: _(
      'Hva kan vi hjelpe deg med?',
      'What can we help you with?',
      'Kva kan vi hjelpe deg med?',
    ),
    homeLink: _(
      'Tilbake til reisesøk',
      'Back to travel search',
      'Tilbake til reisesøk',
    ),
    privacyAndTerms: _(
      'Vi ber om de personopplysningene vi trenger for å behandle saken din. Du skal derfor ikke legge inn personopplysninger i fritekstfeltene. Personopplysninger er alle opplysninger som kan knytest til en fysisk person, eller bidra til å identifisere en fysisk person.',
      'We ask for the personal information we need to process your case. You should therefore not enter personal information in the free text field. Personal information is all information that can be linked to a physical person, or help to identify a physical person.',
      'Vi ber om dei personopplysningane vi treng for å behandle saka di. Du skal derfor ikkje legge inn personopplysningar i fritekstfelta. Personopplysningar er alle opplysningar som kan knytast til ein fysisk person, eller bidra til å identifisere ein fysisk person.',
    ),
  },

  ticketControl: {
    title: _(
      'Billettkontroll og gebyr',
      'Ticket control and fee',
      'Billettkontroll og gebyr',
    ),

    feeComplaint: {
      title: _(
        'Informasjon fra gebyret',
        'Information from the fee',
        'Informasjon frå gebyret',
      ),
      description: _(
        'Jeg har fått gebyr og ønsker å klage',
        'I have received a fee and would like to file a complaint',
        'Eg har fått gebyr og ønsker å klage',
      ),
      info: _(
        'Hvis du har fått gebyr på feil grunnlag, kan du sende oss en skriftlig klage.',
        'If you have received a fee on incorrect grounds, you can submit a written complaint to us.',
        'Dersom du har fått gebyr på feil grunnlag, kan du sende oss ei skriftleg klage.',
      ),

      ticketStorage: {
        question: _(
          'Hvor pleier du å ha billetten din?',
          'Where do you usually keep your ticket?',
          'Kor pleier du å ha billetten din?',
        ),

        app: {
          title: _('Mobilapp', 'Mobile app', 'Mobilapp'),
        },
      },

      firstAgreement: {
        title: _(
          'Har du fått gebyr etter billettkontroll?',
          'Have you received a fine after a ticket inspection?',
          'Har du fått gebyr etter billettkontroll?',
        ),
        question: _(
          'Vi har full forståelse for at det kan være en ubehagelig opplevelse å få gebyr ved billettkontroll, og vi vet at de aller fleste ønsker å reise med gyldig billett.',
          'We fully understand that receiving a fine during a ticket inspection can be an unpleasant experience, and we know that the majority of people want to travel with a valid ticket.',
          'Vi har full forståing for at det kan vere ei ubehageleg oppleving å få gebyr ved billettkontroll, og vi veit at dei fleste ønsker å reise med gyldig billett.',
        ),
        labelRules: _(
          'Reglene er som følger:',
          'The following rules applies:',
          'Reglane er som følgjer:',
        ),
        rules: [
          _(
            'Du er selv ansvarlig for å ha gyldig billett og legitimasjon på hele reisen.',
            'You are responsible for having a valid ticket and identification throughout the trip.',
            'Du er sjølv ansvarleg for å ha gyldig billett og legitimasjon på heile reisa.',
          ),
          _(
            'Reiser du med en rabattert billett, må du også ha legitimasjon på at du har rett til rabatten for at billetten skal være gyldig.',
            'If you are traveling with a discounted ticket, you must also have identification proving your eligibility for the discount for the ticket to be valid.',
            'Reiser du med ein rabattert billett, må du også ha legitimasjon på at du har rett til rabatten for at billetten skal vere gyldig.',
          ),
          _(
            'Har du kjøpt billett på forhånd, må du ha startet billetten før du går om bord.',
            'If you have purchased a ticket in advance, you must have activated the ticket before boarding.',
            'Har du kjøpt billett på førehand, må du ha starta billetten før du går om bord.',
          ),
          _(
            'Har du ikke gyldig billett for reisen, vil du få gebyr ved billettkontroll.',
            'If you do not have a valid ticket for the trip, you will receive a fine during the ticket inspection.',
            'Har du ikkje gyldig billett for reisa, vil du få gebyr ved billettkontroll.',
          ),
        ],
        checkbox: _('Jeg forstår', 'I understand', 'Eg forstår'),
      },

      secondAgreement: {
        title: _(
          'Typiske saker som ikke får medhold',
          'Typical cases that do not receive approval',
          'Typiske saker som ikkje får medhald',
        ),
        info: _(
          'Har du krav på rabatt, men har fått gebyr fordi du ikke kunne framvise gyldig legitimasjon, kan du få redusert gebyret ditt til 200 kroner ved å sende oss dokumentasjon på at du har rett på rabatt.',
          'If you are entitled to a discount, but have been charged a fee because you were unable to present valid identification, you can have your fee reduced to 200 kroner by sending us documentation that you are eligible for the discount.',
          'Dersom du har krav på rabatt, men har fått gebyr fordi du ikkje kunne framvise gyldig legitimasjon, kan du få redusert gebyret ditt til 200 kroner ved å sende oss dokumentasjon på at du har rett på rabatt.',
        ),
        rules: [
          _(
            'Kunden bruker et skjermbilde av billett eller en forfalsket billett.',
            'The customer uses a screenshot of a ticket or a counterfeit ticket.',
            'Kunden brukar eit skjermbilde av billett eller ein forfalska billett.',
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
            'Kunden reiser med gyldig billett på mobilen, men mobiltelefonen har gått tom for strøm.',
            'The customer travels with a valid ticket on their mobile phone, but the phone has run out of battery.',
            'Kunden reiser med gyldig billett på mobilen, men mobiltelefonen har gått tom for straum.',
          ),
          _(
            'Reisekortet ligger igjen hjemme.',
            'The travel card is left at home.',
            'Reisekortet ligg igjen heime.',
          ),
        ],
        checkbox: _(
          'Jeg forstår reglene og ønsker å klage på gebyret.',
          'I understand the rules and want to complain about the fine.',
          'Eg forstår reglane og ønsker å klage på gebyret.',
        ),
      },
    },

    postponePayment: {
      title: _('Utsette betaling ', 'Postpone payment', 'Utsette betaling'),
      description: _(
        'Jeg har fått gebyr og ønsker å utsette betalingen',
        'I have received a fee and would like to postpone the payment',
        'Eg har fått gebyr og ønsker å utsette betalinga',
      ),
      info: _(
        'Ved å sende inn skjemaet, blir betalingsfristen utsatt med 30 dager fra opprinnelig forfallsdato, dvs. totalt 60 dagers betalingsfrist. Du velger selv om du vil dele opp betalingen og gjøre flere innbetalinger i løpet av denne perioden eller betale hele beløpet på en gang',
        'By sending the form, the payment deadline is extended by 30 days from the original due date, providing a total of 60 days to make your payment. During this period, you can choose to either divide it into multiple installments or pay the full amount at once.',
        'Ved å sende inn skjemaet, blir betalingsfristen utsett med 30 dagar frå opphaveleg forfallsdato, dvs. totalt 60 dagars betalingsfrist. Du vel sjølv om du vil dele opp betalinga og gjere fleire innbetalingar i løpet av denne perioden eller betale heile beløpet på ein gong',
      ),
    },

    feedback: {
      title: _(
        'Tilbakemelding billettkontroll ',
        'Feedback on ticket control',
        'Tilbakemelding billettkontroll ',
      ),
      description: _(
        'Jeg vil gi en tilbakemelding knyttet til billettkontroll',
        'I would like to provide feedback regarding ticket control',
        'Eg vil gi ei tilbakemelding knytt til billettkontroll',
      ),
      info: _(
        'Har du tilbakemelding på en bestemt billettkontroll, trenger vi en beskrivelse av hvor og når billettkontrollen fant sted for å kunne gå videre med saken.',
        'If you have feedback regarding a specific ticket inspection, we need a description of where and when the ticket inspection took place in order to proceed with the matter.',
        'Har du tilbakemelding på ein bestemt billettkontroll, treng vi ei beskriving av kor og kva tid billettkontrollen var for å kunne gå vidare med saka.',
      ),
    },
  },

  refund: {
    title: _('Refusjon', 'Refund', 'Refusjon'),
    refundOfTicket: {
      description: _(
        'Refusjon av billett',
        'Refund of ticket',
        'Refusjon av billett',
      ),
    },
    refundAndTravelGuarantee: {
      description: _(
        'Refusjon og reisegaranti',
        'Refund and travel guarantee',
        'Refusjon og reisegaranti',
      ),

      refundTaxi: {
        label: _(
          'Jeg ønsker refusjon for drosje',
          'I would like refund for taxi',
          'Eg ønsker refusjon for drosje',
        ),
      },
      refundCar: {
        label: _(
          'Jeg ønsker refusjon for bil',
          'I would like refund for car',
          'Eg ønsker refusjon for bil',
        ),
      },
    },

    residualValueOnTravelCard: {
      description: _(
        'Restverdi på reisekort (reisepenger)',
        'Residual value on travel card (travel allowance)',
        'Restverdi på reisekort (reisepengar)',
      ),

      title: _(
        'Søk refusjon av restverdien på et reisekort',
        'Apply for a refund of the residual value on a travel card',
        'Søk refusjon av restverdien på eit reisekort',
      ),

      link: {
        text: _(
          'Skjema for refusjon av restverdien på et reisekort',
          'Form for refund of residual value on a travel card',
          'Skjema for refusjon av restverdien på eit reisekort',
        ),
        href: _(
          'https://forms.office.com/Pages/ResponsePage.aspx?id=5-wyud-clE20wRUlbkPH6qGF2mFbrapOg9lnALAiJk9UMkROS0dORUdaTTZURzJHNFNSSVhVTzE4Ti4u',
          'https://forms.office.com/Pages/ResponsePage.aspx?id=5-wyud-clE20wRUlbkPH6qGF2mFbrapOg9lnALAiJk9UMkROS0dORUdaTTZURzJHNFNSSVhVTzE4Ti4u',
          'https://forms.office.com/Pages/ResponsePage.aspx?id=5-wyud-clE20wRUlbkPH6qGF2mFbrapOg9lnALAiJk9UMkROS0dORUdaTTZURzJHNFNSSVhVTzE4Ti4u',
        ),
      },
      monthlyPayoutDetails: _(
        'Restverdien blir betalt ut i slutten av hver måned (med forbehold). Hvis du har flere reisekort du vil ha refundert, må du sende inn ett skjema per reisekort.',
        'The residual value is paid out at the end of each month (with reservations). If you have multiple travel cards that you want refunded, you must submit one form per travel card.',
        'Restverdien blir betalt ut i slutten av kvar månad (med atterhald). Viss du har fleire reisekort du vil ha refundert, må du sende inn eitt skjema per reisekort.',
      ),
      automatedProcessNotice: {
        note: _('Merk!', 'Note!', 'Merk!'),
        text: _(
          'Dette skjemaet gjelder bare for refusjon av restverdi på reisekort. Det er en automatisert prosess som bare fungerer for denne typen refusjon.',
          'This form only applies to refunds of residual value on travel cards. It is an automated process that only works for this type of refund.',
          'Dette skjemaet gjeld berre for refusjon av restverdi på reisekort. Det er ein automatisert prosess som berre fungerar for denne typen refusjon.',
        ),
      },
    },

    agreement: {
      title: _(
        'Refusjon og reisegaranti',
        'Refund and travel guarantee',
        'Refusjon og reisegaranti',
      ),
      delayedRefundText: _(
        'Ble du forsinket fordi vi ikke var i rute? Du kan ha krav på å få refundert utgifter til alternativ transport som for eksempel drosje, bil og annen kollektivtransport.',
        'Were you delayed because we were not on schedule? You may be entitled to reimbursement for expenses related to alternative transportation such as taxi, car, and other public transportation.',
        'Vart du forseinka fordi vi ikkje var i rute? Du kan du ha krav på å få refundert utlegg til alternativ transport som for eksempel drosje, bil og annan kollektivtransport.',
      ),
      ticketRefundText: _(
        'Ønsker du refusjon av feilkjøpt eller ikke brukt billett, skal du ikke søke reisegaranti, men refusjon. Dette finner du under Billetter og app.',
        'If you want a refund for a mistakenly purchased or unused ticket, you should not apply for travel guarantee, but rather for a refund. You can find this under Tickets and app.',
        'Ønsker du refusjon av feilkjøpt eller ikkje brukt billett, skal du ikkje søke reisegaranti, men refusjon. Dette finn du under Billettar og app.',
      ),
      travelGuaranteeExceptions: {
        label: _(
          'I hvilke tilfeller gjelder ikke reisegarantien?',
          'In which cases does the travel guarentee not apply?',
          'I kva tilfelle gjeld ikkje reisegarantien?',
        ),

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
              _('naturkatastrofer', 'natural disasters', 'naturkatastrofar'),
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

        exclusion: _(
          'Reisegarantien omfatter heller ikke tap som følge av forsinkelsen, som for eksempel mistet tannlegetime, jobbavtale, togavgang, fergeavgang eller flyavgang.',
          'The travel guarantee does not cover losses resulting from the delay, such as missed dental appointments, job agreements, train departures, ferry departures or flight departures.',
          'Reisegarantien omfattar heller ikkje tap som følge av forseinkinga, som for eksempel mista tannlegetime, jobbavtale, togavgang, ferjeavgang eller flyavgang.',
        ),

        link: {
          text: _(
            'Les mer om reisegranti',
            'Read more about travel guarantee',
            'Les meir om reisegaranti',
          ),
          href: _(
            'https://frammr.no/hjelp-og-kontakt/reisegaranti/',
            'https://frammr.no/hjelp-og-kontakt/reisegaranti/?sprak=3',
            'https://frammr.no/hjelp-og-kontakt/reisegaranti/',
          ),
        },
        checkbox: _('Jeg forstår', 'I understand', 'Eg forstår'),
      },
    },

    refundTaxi: {
      description: _(
        'Jeg ønsker refusjon for drosje',
        'I would like refund for taxi',
        'Eg ønsker refusjon for drosje',
      ),
      info: _(
        'Hvis du ikke kommer frem med et annet rutetilbud, refunderer vi utgifter til drosje i henhold til gjeldende regler.',
        'If you are unable to reach your destination by an alternative service, we will refund taxi expenses according to the applicable regulations.',
        'Viss du ikkje kjem fram med eit anna rutetilbod, refunderer vi utlegg til drosje etter gjeldande reglar.',
      ),
      taxiReceipt: {
        title: _(
          'Informasjon fra drosjekvitteringen',
          'Information from the taxi receipt',
          'Informasjon frå drosjekvitteringa',
        ),
        info: _(
          'Last opp en kopi eller et bilde av kvitteringen fra drosjeturen. Kvitteringen må inneholde informasjon om hvor du reiste fra og til.',
          'Upload a copy or a photo of the receipt from the taxi ride. The receipt must contain information about where you traveled from and to.',
          'Last opp ein kopi eller eit bilde av kvitteringa frå drosjeturen. Kvitteringa må innehalde informasjon om kor du reiste frå og til.',
        ),
      },

      carTrip: {
        title: _('Om bilturen', 'About the car trip', 'Om bilturen'),
      },

      aboutYourTrip: {
        title: _(
          'Om den planlagte reisen din',
          'About your planned trip',
          'Om den planlagde reisa di',
        ),
      },
    },

    refundCar: {
      description: _(
        'Jeg ønsker refusjon for bruk av bil',
        'I would like refund for the use of a car',
        'Eg ønsker refusjon for bruk av en bil',
      ),
      info: _(
        'Hvis du ikke kommer frem med et annet rutetilbud, refunderer vi dokumenterte utgifter for bruk av bil. Vi betaler kilometergodtgjørelse etter statens satser. Refusjonen dekker ikke bompenger, parkering eller andre utgifter knyttet til leiebil/delebil.',
        'If you are unable to reach your destination by an alternative service, we will refund documented expenses for the use of a car. We pay compensation per kilometer according to government rates. The refund does not cover tolls, parking, or other expenses related to rental cars/sharing cars',
        'Viss du ikkje kjem fram med eit anna rutetilbod, refunderer vi dokumenterte utlegg for bruk av bil. Vi betalar kilometergodtgjersle etter statens satsar. Refusjonen dekker ikkje bompengar, parkering eller andre utgifter knytt til leigebil/delebil.',
      ),

      aboutTheCarTrip: {
        title: _('Om bilturen', 'About the car trip', 'Om bilturen'),
      },
      aboutThePlanedTrip: {
        title: _(
          'Om den planlagte reisen din',
          'About your planned trip',
          'Om den planagde reisa di',
        ),
      },
    },

    refundOtherPublicTransport: {
      description: _(
        'Jeg ønsker refusjon for annen kollektivtransport',
        'I would like a refund for other public transport',
        'Eg ønsker refusjon for annan kollektivtransport',
      ),
    },
  },

  modeOfTransport: {
    title: _(
      'Transportmiddel og stoppested',
      'Means of transport and stopping place',
      'Transportmiddel og stoppested',
    ),

    driver: {
      description: _(
        'Tilbakemelding på sjåfør/mannskap',
        'Feedback on driver/crew',
        'Tilbakemelding på sjåfør/mannskap',
      ),
      info: _(
        'Har du opplevd uansvarlig kjøring, eller reagert på hvordan mannskapet gjorde jobben sin, kan du gi tilbakemelding her. Har du hatt en ekstra hyggelig opplevelse, vil vi gjerne høre om det også.',
        'If you have experienced irresponsible driving, or reacted to how the crew did their job, you can give feedback here. If you have had an extra pleasant experience, we would like to hear about it too.',
        'Har du opplevd uforsvarleg køyring, eller reagert på korleis mannskapet gjorde jobben sin, kan du gi tilbakemelding her. Har du hatt ei ekstra hyggeleg oppleving, vil vi gjerne høyre om det også.',
      ),
      about: {
        title: _('Om reisen', 'About the trip', 'Om reisa'),
        description: _(
          'Vi trenger å vite litt om reisen din. Da er det lettere for oss å følge opp saken.',
          'We need to know a bit about your trip. Then it is easier for us to follow up on the case.',
          'Vi treng å vite litt om reisa di. Då er det enklare for oss å følgje opp saka.',
        ),
      },
    },
    transportation: {
      description: _(
        'Tilbakemelding på transportmiddel',
        'Feedback on transport vehicle',
        'Tilbakemelding på transportmiddel',
      ),
      info: _(
        'Har du opplevd noe som ikke var som det skulle på transportmiddelet, kan du gi tilbakemelding her. Har du hatt en ekstra hyggelig opplevelse, vil vi gjerne høre om det også.',
        'If you have experienced something that was not as it should be on the means of transport, you can give feedback here. If you have had an extra pleasant experience, we would like to hear about it too.',
        'Har du opplevd noko som ikkje var som det skulle på transportmiddelet, kan du gi tilbakemelding her. Har du hatt ei ekstra hyggeleg oppleving, vil vi gjerne høyre om det også.',
      ),
      about: {
        title: _('Om reisen', 'About the trip', 'Om reisa'),
        description: _(
          'Vi trenger å vite litt om reisen din. Da er det lettere for oss å følge opp saken.',
          'We need to know a bit about your trip. Then it is easier for us to follow up on the case.',
          'Vi treng å vite litt om reisa di. Då er det enklare for oss å følgje opp saka.',
        ),
      },
    },
    delay: {
      description: _(
        'Forsinkelse, kjørt for tidlig eller innstilt',
        'Delay, driven too early or cancelled',
        'Forseinking, køyrd for tidleg eller innstilt',
      ),
      info: _(
        'Hvis transportmiddelet ditt er forsinket, for tidlig ute, ikke stoppet, manglet plass eller hvis du ikke fikk tilstrekkelig informasjon om planlagte avvik, kan du gi tilbakemelding her.',
        'If your means of transport is delayed, left too early, did not stop, lacked space or if you did not receive sufficient information about planned deviations, you can give feedback here.',
        'Viss transportmiddelet ditt er forseinka, for tidleg ute, ikkje stoppa, mangla plass eller viss du ikkje fekk tilstrekkeleg informasjon om planlagde avvik, kan du gi tilbakemelding her. ',
      ),
      about: {
        title: _('Om reisen', 'About the trip', 'Om reisa'),
        description: _(
          'Vi trenger å vite litt om reisen din. Da er det lettere for oss å følge opp saken.',
          'We need to know a bit about your trip. Then it is easier for us to follow up on the case.',
          'Vi treng å vite litt om reisa di. Då er det enklare for oss å følgje opp saka.',
        ),
      },
    },
    stop: {
      description: _(
        'Tilbakemelding på holdeplass/kai',
        'Feedback on stop/dock',
        'Tilbakemelding på haldeplass/kai',
      ),
      info: _(
        'Har du opplevd en feil eller manglende stopp? Eksempler kan være skade på leskur, søppel, feil med sanntidsskilt eller lignende.',
        'Have you experienced an error or lack of a stop? Examples could be damage to reading sheds, litter, errors with real-time signs, or the like.',
        'Har du opplevd ein feil eller mangel på stoppestaden? Eksempel kan vere skader på leskur, søppel, feil med sanntidsskilt, eller liknande.',
      ),
      about: {
        title: _(
          'Om holdeplassen/kaia',
          'About the stop/dock',
          'Om haldeplassen/kaia',
        ),
        description: _(
          'Vi trenger å vite litt om reisen din. Da er det lettere for oss å følge opp saken.',
          'We need to know a bit about your trip. Then it is easier for us to follow up on the case.',
          'Vi treng å vite litt om reisa di. Då er det enklare for oss å følgje opp saka.',
        ),
      },
    },
    serviceOffering: {
      description: _(
        'Tilbakemelding på rutetilbudet',
        'Feedback on service offering',
        'Tilbakemelding på rutetilbodet',
      ),
      info: _(
        'Har du et forslag til ruteendring, eller vil du gi tilbakemelding på tilbudet vårt? Gi oss gjerne tilbakemelding her. Alle oppføringer lagres og systematiseres og inngår i den årlige ruteendringsprosessen. Vi kan ikke gi individuell tilbakemelding på hvilke innspill/forslag som innføres.',
        'Do you have a suggestion for a service change, or would you like to give feedback on our service offer? Feel free to give us feedback here. All entries are stored and systematized and are included in the annual service change process. We cannot give individual feedback on which input/suggestions are introduced.',
        'Har du eit forslag til ruteendring, eller ønsker du å gi tilbakemelding på tilbodet vårt? Gi oss gjerne tilbakemelding her. Alle innspel blir lagra og systematisert og blir tatt med i den årlege ruteendringsprosessen. Vi kan ikkje gi individuelle tilbakemeldingar på kva innspel/forslag som blir innførte. ',
      ),

      about: {
        title: _('Om reisen', 'About the trip', 'Om reisa'),
        description: _(
          'Vi trenger å vite litt om reisen din. Da er det lettere for oss å følge opp saken.',
          'We need to know a bit about your trip. Then it is easier for us to follow up on the case.',
          'Vi treng å vite litt om reisa di. Då er det enklare for oss å følgje opp saka.',
        ),
      },
    },
    injury: {
      description: _(
        'Melde fra om personskade eller ulykke',
        'Report of personal injury or accident',
        'Melde frå om personskade eller ulykke',
      ),
      info: _(
        'Skadet du deg selv eller noe du eier om bord eller på stoppestedet/kai? Gi tilbakemelding her, så hjelper vi deg.',
        'Did you injure yourself or something you own on board or at the stop/dock? Give feedback here, and we will help you.',
        'Skada du deg sjølv eller noko du eig om bord eller på haldeplass/kai? Gje tilbakemelding her, så hjelper vi deg.',
      ),

      about: {
        title: _('Om reisen', 'About the trip', 'Om reisa'),
        description: _(
          'Vi trenger å vite litt om reisen din. Da er det lettere for oss å følge opp saken.',
          'We need to know a bit about your trip. Then it is easier for us to follow up on the case.',
          'Vi treng å vite litt om reisa di. Då er det enklare for oss å følgje opp saka.',
        ),
      },
    },
  },
  lostProperty: {
    title: _('Hittegods', 'Lost property', 'Hittegods'),
    description: {
      info: _(
        'Har du glemt igjen noe på en av bussene, hurtigbåtene, eller fergene, ',
        `If you've left something behind on a bus, express boat, or ferry,`,
        'Har du gløymt igjen noko i ein av bussane, hurtigbåtane eller ferjene, ',
      ),
      externalLink: _(
        'finner du informasjon om hvem du kan ta kontakt med her.',
        'you can find information about whom to contact here.',
        'finn du informasjon om kven du kan ta kontakt med her.',
      ),
      url: _(
        'https://frammr.no/hjelp-og-kontakt/hittegods/',
        'https://frammr.no/hjelp-og-kontakt/hittegods/?sprak=3',
        'https://frammr.no/hjelp-og-kontakt/hittegods/',
      ),
    },
  },

  ticketing: {
    title: _('Billetter og app', 'Tickets and app', 'Billettar og app'),
    priceAndTicketTypes: {
      description: _(
        'Priser og billettyper',
        'Prices and ticket types',
        'Prisar og billettypar',
      ),
    },
    app: {
      description: _('App', 'App', 'App'),

      appTicketing: {
        title: _(
          'Hvilken billett gjelder det?',
          'Which ticket is it about?',
          'Kva billett gjeld det?',
        ),
        label: _('Kjøp billett', 'Purchase ticket', 'Kjøp billett'),
      },

      appTravelSuggestion: {
        label: _('Reiseforslag', 'Travel suggestions', 'Reiseforslag'),
      },

      appAccount: {
        label: _(
          'Innlogging, profil, innstillinger',
          'Login, profile, settings',
          'Innlogging, profil, innstillingar',
        ),
      },
    },
    webshop: {
      description: _('Nettbutikk', 'Webshop', 'Nettbutikk'),
      webshopTicketing: {
        title: _(
          'Hvilken billett gjelder det?',
          'Which ticket is it about?',
          'Kva billett gjeld det?',
        ),
        label: _('Kjøp billett', 'Purchase ticket', 'Kjøp billett'),
      },
      webshopAccount: {
        label: _(
          'Innlogging, profil, innstillinger',
          'Login, profile, settings',
          'Innlogging, profil, innstillingar',
        ),
      },
    },
    travelCard: {
      description: _('Reisekort', 'Travel card', 'Reisekort'),
      question: _(
        'Hva gjelder forespørselen?',
        'What is the request about?',
        'Kva gjeld førespurnaden',
      ),

      orderTravelCard: {
        label: _('Bestill reisekort', 'Order travel card', 'Bestill reisekort'),
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
          detail: _(
            'Du trenger ikke kjøpe produktet hos sjåfør. Du kan ta med deg et kort og fylle på det produktet du vil i',
            'You don’t need to purchase the product from the driver. You can take a card with you and top up the desired product later in the',
            'Du treng ikkje kjøpe produktet hos sjåfør. Du kan ta med deg eit kort og fylle på det produktet du vil i',
          ),
          linkText: _('nettbutikken', 'webshop', 'nettbutikken'),
          href: _(
            'https://nettbutikk.frammr.no/',
            'https://nettbutikk.frammr.no/',
            'https://nettbutikk.frammr.no/',
          ),
        },
      },
      travelCardQuestion: {
        label: _(
          'Andre spørsmål om reisekort',
          'Other questions regarding travel card',
          'Andre spørsmål om reisekort',
        ),
      },
    },
    refund: {
      description: _('Refusjon', 'Refund', 'Refusjon'),
      initialAgreement: {
        ticketRefundAvailability: {
          title: _(
            'Når kan du få refundert billetten din?  ',
            'When can you get your ticket refunded?',
            'Når kan du få refundert billetten din?',
          ),
          rules: [
            _(
              'Når du ikke reiser med oss lenger. Hvis du for eksempel flytter, blir sjukemeldt, endrer reisemønster eller har en annen grunn til å søke om refusjon.',
              'When you no longer travel with us. If, for example, you move, are on sick leave, change your travel pattern or have another reason to apply for a refund.',
              'Når du ikkje reiser med oss lenger. Viss du for eksempel flytter, blir sjukemeldt, endrar reisemønster eller har en annan grunn til å søke om refusjon.',
            ),
            _(
              'Ved kjøp av feil reisestrekning, passasjerkategori eller tidspunkt/dato. Vi vil refundere billetten som du har kjøpt feil dersom du kjøper ny, korrekt billett.',
              'When purchasing the wrong journey, passenger category or time/date. We will refund the ticket that you bought incorrectly if you buy a new, correct ticket.',
              'Ved kjøp av feil reisestrekning, passasjerkategori eller tidspunkt/dato. Vi vil refundere billetten som du har kjøpt feil dersom du kjøper ny, korrekt billett.',
            ),
          ],
        },
        refundableTicketTypes: {
          title: _(
            'Vi refunderer disse billettypene:',
            'We refund these ticket types:',
            'Vi refunderer desse billettypane:  ',
          ),
          rules: [
            _(
              'Periodebillett 7 dager: Du får refusjon for antall resterende døgn.',
              'Period ticket 7 days: You will receive a refund for the number of days remaining.',
              'Periodebillett 7 dagar: Du får refusjon for antall resterande døgn.',
            ),
            _(
              'Periodebillett 30 dager: Du får refusjon for antall resterende døgn.',
              'Period ticket 30 days: You will receive a refund for the number of remaining days.',
              'Periodebillett 30 dagar: Du får refusjon for antall resterande døgn.',
            ),
            _(
              'Periodebillettene for hele fylket: Du får refusjon for antall resterende døgn.',
              'The period tickets for the entire county: You will receive a refund for numbers remaining on the day.',
              'Periodebillettane for heile fylket: Du får refusjon for antall resterande døgn. ',
            ),
            _(
              'Reisekort: Du får tilbakebetalt verdien som gjenstår på reisekortet. ',
              'Travel card: You will be reimbursed the value remaining on the travel card.',
              'Reisekort: Du får tilbakebetalt verdien som gjenstår på reisekortet. ',
            ),
            _(
              'Enkeltbilletter etter feilkjøp og når ny, riktig billett er kjøpt. ',
              'Single tickets after incorrect purchase and when a new, correct ticket has been purchased.',
              'Enkeltbillettar etter feilkjøp og når ny, riktig billett er kjøpt. ',
            ),
            _(
              'Klippekort: Du får refusjon for antall gjenværende klipp.',
              'Carnet: You will receive a refund for the number of remaining clips.',
              'Klippekort: Du får refusjon for tal resterande klipp.',
            ),
          ],
          info: {
            text: _(
              'Gjelder kravet reisegaranti, dvs refusjon for utgifter til andre transportmiddel fordi buss eller hurtigbåt ikke var i rute? Da skal du søke om',
              'Does the claim apply to a travel guarantee, i.e. refund for expenses for other means of transport because the bus or express boat was not on schedule? Then you should not apply for',
              'Gjeld kravet reisegaranti, dvs refusjon for utgifter til andre transportmiddel fordi buss eller hurtigbåt ikkje var i rute? Då skal du søke om',
            ),
            link: _('reisegaranti.', 'travel guarantee.', 'reisegaranti.'),
          },
          checkbox: _('Jeg forstår', 'I understand', 'Eg forstår'),
        },
      },
      appTicketRefund: {
        label: _(
          'Billett kjøpt i app eller nettbutikk',
          'Ticket purchased in an app or webshop',
          'Billett kjøpt i app eller nettbutikk',
        ),
      },
      otherTicketRefund: {
        label: _(
          'Billett kjøpt om bord eller på trafikkterminal',
          'Ticket purchased onboard or at a terminal',
          'Billett kjøpt om bord eller på trafikkterminal',
        ),
      },
    },
  },
  lostAndFound: {
    title: _('Hittegods', 'Lost and found', 'Hittegods'),
  },

  groupTravel: {
    title: _('Gruppereise', 'Group travel', 'Gruppereise'),
    description: {
      info: _(
        'Vi har gjort endring i praksisen for hvordan vi håndterer gruppebestillinger.',
        'We have made changes to the practice for how we handle group bookings.',
        'Vi har gjort endringar i praksisen for korleis vi handterer gruppebestillingar.',
      ),
      externalLink: _(
        'Les mer om gruppereise her',
        'Read more about group travel here',
        'Les meir om gruppereise her',
      ),
      url: _(
        'https://frammr.no/reise/gruppereise/',
        'https://frammr.no/journey/group-travel/?sprak=3',
        'https://frammr.no/reise/gruppereise/',
      ),
    },
  },

  aboutYouInfo: {
    title: _(
      'Informasjon om deg',
      'Information about you',
      'Informasjon om deg',
    ),
    optionalTitle: _(
      'Ønsker du svar fra oss?',
      'Would you like a reply from us?',
      'Ønsker du svar frå oss?',
    ),
  },

  submit: _('Send', 'Submit', 'Send'),

  input: {
    firstName: {
      label: _(
        'Fornavn og mellomnavn',
        'First name and middle name',
        'Fornamn og mellomnamn',
      ),
      labelOptional: _(
        'Fornavn og mellomnavn (valgfritt)',
        'First name and middle name (optional)',
        'Fornamn og mellomnamn (valfritt)',
      ),
      errorMessages: {
        empty: _(
          'Vennligst fyll ut fornavnet ditt',
          'Please enter your first name',
          'Vennligst fyll ut fornamnet ditt',
        ),
      },
    },

    lastName: {
      label: _('Etternavn', 'Lastname', 'Etternamn'),
      labelOptional: _(
        'Etternavn (valgfritt)',
        'Last name (optional)',
        'Etternamn (valfritt)',
      ),
      errorMessages: {
        empty: _(
          'Vennligst fyll ut etternavnet ditt',
          'Please enter your last name',
          'Vennligst fyll ut etternamnet ditt',
        ),
      },
    },

    email: {
      label: _('E-post', 'Email', 'E-post'),
      labelOptionalIfCustomerNumberIsProvided: _(
        'E-post (valgfritt hvis kundenummer er oppgitt)',
        'Email (optional if customer number is provided)',
        'E-post (valfritt viss kundenummer er oppgitt) ',
      ),

      errorMessages: {
        empty: _(
          'Vennligst fyll ut e-postadressen din',
          'Please enter your email address',
          'Vennligst fyll ut e-postadressa di',
        ),
      },
    },

    address: {
      label: _('Adresse', 'Address', 'Adresse'),
      errorMessages: {
        empty: _(
          'Vennligst fyll ut boligadressen din',
          'Please enter your residential address',
          'Vennligst fyll ut bustadadressa di',
        ),
      },
    },

    postalCode: {
      label: _('Postnummer', 'Postal code', 'Postnummer'),
      errorMessages: {
        empty: _(
          'Vennligst fyll ut postnummer',
          'Please enter your postal code',
          'Vennligst fyll ut postnummer',
        ),
        invalidFormat: _(
          'Ugyldig postkode. Skriv inn et gyldig postnummer med 4 sifre',
          'Invalid postal code. Enter a valid postal code with 4 digits',
          'Ugyldig postkode. Skriv inn eit gyldig postnummer med 4 siffer',
        ),
      },
    },

    city: {
      label: _('Bosted', 'City', 'Bustad'),
      errorMessages: {
        empty: _(
          'Vennligst fyll ut ditt bosted',
          'Please enter your residiential city',
          'Vennligst fyll ut bustaden di',
        ),
      },
    },

    phoneNumber: {
      label: _('Telefonnummer', 'Phone number', 'Telefonnummer'),
      labelOptional: _(
        'Telefonnummer (valgfritt)',
        'Phone number (optional)',
        'Telefonnummer (valfritt)',
      ),
      errorMessages: {
        empty: _(
          'Vennligst fyll ut ditt telefonnummer',
          'Please enter your phone number',
          'Vennligst fyll ut ditt telefonnummer',
        ),
        invalidFormat: _(
          'Ugyldig telefonnummer.Vennligst fyll ut telefonnummeret på et gyldig format.',
          'Invalid phone number.Please enter your phone number in a valid format.',
          'Ugyldig telefonnummer.Vennligst fyll ut telefonnummeret på eit gyldig format.',
        ),
      },
    },

    bankInformation: {
      bankAccountNumber: {
        label: _('Bankkontonummer', 'Bank account number', 'Bankkontonummer'),
        placeholder: _('xxxx.xx.xxxxx', 'xxxx.xx.xxxxx', 'xxxx.xx.xxxxx'),
        errorMessages: {
          empty: _(
            'Vennligst fyll ut ditt bankkontonummer',
            'Please provide your bank account number',
            'Vennligst fyll ut ditt bankkontonummer',
          ),
          invalidFormat: _(
            'Ugyldig bankkontonummer. Skriv inn et gyldig nummer med 11 siffer.',
            'Invalid bank account number. Please enter a valid 11-digit number.',
            'Ugyldig bankkontonummer. Skriv inn eit gyldig nummer med 11 siffer.',
          ),
        },
      },
      IBAN: {
        label: _('IBAN', 'IBAN', 'IBAN'),
        errorMessages: {
          empty: _(
            'Vennligst fyll ut ditt IBAN-nummer',
            'Please provide your bank IBAN number',
            'Vennligst fyll ut ditt IBAN-nummer',
          ),
        },
      },
      SWIFT: {
        label: _('SWIFT ', 'SWIFT ', 'SWIFT '),
        errorMessages: {
          empty: _(
            'Vennligst fyll ut ditt SWIFT-nummer',
            'Please provide your SWIFT number',
            'Vennligst fyll ut ditt SWIFT-nummer',
          ),
        },
      },
      checkbox: _(
        'Jeg har et utenlandsk bankkontonummer',
        'I have a foreign bank account',
        'Eg har eit utanlandsk bankkontonummer',
      ),
    },

    transportMode: {
      label: _('Transportmiddel', 'Transport mode', 'Transportmiddel'),
      optionLabel: _(
        'Velg transportmiddel',
        'Select transport mode',
        'Vel transportmiddel',
      ),
      modes: {
        bus: _('Buss', 'Bus', 'Buss'),
        expressboat: _('Hurtigbåt', 'Express boat', 'Hurtigbåt'),
        ferry: _('Ferge', 'Ferry', 'Ferje'),
      },
      errorMessages: {
        empty: _(
          'Velg transportmiddel',
          'Select transport mode',
          'Vel transportmiddel',
        ),
      },
    },

    purchasePlatform: {
      label: _('Kjøpsplattform', 'Purchase platform', 'Kjøpsplattform'),
      optionLabel: _(
        'Velg app eller nettbutikk billetten ble kjøpt i',
        'Select the app or webshop where the ticket was purchased',
        'Vel app eller nettbutikk der billetten vart kjøpt',
      ),
      platforms: {
        enturApp: _('Entur-appen', 'Entur app', 'Entur-appen'),
        framApp: _('FRAM-appen', 'FRAM app', 'FRAM-appen'),
        enturWeb: _('Entur nettbutikk', 'Entur webshop', 'Entur nettbutikk'),
        framWeb: _('FRAM nettbutikk', 'FRAM webshop', 'FRAM nettbutikk'),
      },
      errorMessages: {
        empty: _(
          'Velg app eller nettbutikk',
          'Select app or webshop',
          'Vel app eller nettbutikk',
        ),
      },
    },

    line: {
      label: _('Linje', 'Line', 'Linje'),
      optionLabel: _('Velg linje', 'Choose line', 'Vel linje'),
      errorMessages: {
        empty: _('Velg linje', 'Select line', 'Vel linje'),
      },
    },

    fromStop: {
      label: _('Fra holdeplass/kai', 'From stop/harbor', 'Frå haldeplass/kai'),
      optionalLabel: _(
        'Fra holdeplass/kai (valgfritt)',
        'From stop/harbor (optinal)',
        'Frå haldeplass/kai (valfritt)',
      ),
      optionLabel: _(
        'Velg holdeplass/kai',
        'Select stop/harbor',
        'Vel haldeplass/kai',
      ),
      errorMessages: {
        empty: _(
          'Velg holdeplass/kai',
          'Select stop/harbor',
          'Vel haldeplass/kai',
        ),
      },
    },

    toStop: {
      label: _('Til holdeplass/kai', 'To stop/harbor', 'Til haldeplass/kai'),
      optionalLabel: _(
        'Til holdeplass/kai (valgfritt)',
        'To stop/harbor (optinal)',
        'Til haldeplass/kai (valfritt)',
      ),
      optionLabel: _(
        'Velg holdeplass/kai',
        'Select stop/harbor',
        'Vel haldeplass/kai',
      ),
      errorMessages: {
        empty: _(
          'Velg holdeplass/kai',
          'Select stop/harbor',
          'Vel haldeplass/kai',
        ),
      },
    },
    stop: {
      label: _('Holdeplass/kai', 'Stop/harbor', 'Haldeplass/kai'),
      optionLabel: _(
        'Velg holdeplass/kai',
        'Select stop/harbor',
        'Vel haldeplass/kai',
      ),
      errorMessages: {
        empty: _(
          'Velg holdeplass/kai',
          'Select stop/harbor',
          'Vel haldeplass/kai',
        ),
      },
    },
    date: {
      label: _('Dato', 'Date', 'Dato'),
      errorMessages: {
        empty: _('Velg dato', 'Select date', 'Vel dato'),
      },

      ticketControl: {
        label: _(
          'Dato for billettkontrollen',
          'The date of the ticket control',
          'Dato for billettkontrollen',
        ),
        errorMessages: {
          empty: _(
            'Oppgi dato for når billettkontrollen ble gjennomført',
            'Please provide the date for when the ticket control was carried out.',
            'Oppgi dato for når billettkontrollen blei gjennomført',
          ),
        },
      },
    },
    plannedDepartureTime: {
      label: _(
        'Planlagt avgangstid',
        'Planned departure time',
        'Planlagd avgangstid',
      ),
      errorMessages: {
        empty: _(
          'Velg planlagt avgangstid',
          'Select planned departure time',
          'Vel avgangstid',
        ),
      },
    },

    time: {
      ticketControl: {
        label: _(
          'Tidspunktet for billettkontrollen',
          'The time of the ticket control',
          'Tidspunktet for billettkontroll',
        ),
        errorMessages: {
          empty: _(
            'Oppgi tidspunkt for når billettkontrollen ble gjennomført',
            'Please provide the time for when the ticket control was carried out.',
            'Oppgi tidspunktet for når billettkontrollen blei gjennomført',
          ),
        },
      },
    },

    reasonForTransportFailure: {
      label: _('Mulige valg', 'Options', 'Moglege val'),
      optionLabel: _('Velg årsak', 'Select reason', 'Vel åtsak'),
      options: [
        {
          id: 'late',
          name: _('Forsinket', 'Late', 'Forseinka'),
        },
        {
          id: 'cancelled',
          name: _('Innstilt', 'Cancelled', 'Innstilt'),
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
            'Feil informasjon i app eller reiseplanlegger',
            'Incorrect information in app or travel planner',
            'Feil informasjon i app eller reiseplanlegger',
          ),
        },
      ] as ReasonForTransportFailure[],
      errorMessages: {
        empty: _('Velg årsak', 'Select reason', 'Vel årsak'),
      },
    },

    kilometersDriven: {
      label: _(
        'Antall kjørte kilometer',
        'Number of kilometres driven',
        'Antall køyrde kilometer',
      ),
      errorMessages: {
        empty: _(
          'Vennligst fyll ut antall kjørte kilometer',
          'Please provide the number of driven kilometres',
          'Vennligst fyll ut antall køyrde kilometer',
        ),
      },
    },
    fromAddress: {
      label: _('Fra adresse', 'From address', 'Frå adresse'),
      errorMessages: {
        empty: _(
          'Vennligst oppgi start adressen',
          'Please provide the start address',
          'Vennligst oppgi start adressa',
        ),
      },
    },
    toAddress: {
      label: _('Til adresse', 'To address', 'Til adresse'),
      errorMessages: {
        empty: _(
          'Vennligst oppgi slutt adressen',
          'Please provide the end address',
          'Vennligst oppgi slutt adressa',
        ),
      },
    },

    feeNumber: {
      label: _('Gebyrnummer', 'Fee number', 'Gebyrnummer'),
      description: _(
        'Gebyrnummeret har 4 siffer. Du finner det øverst i høyre hjørne på gebyret',
        'The fee number has 4 digits. You can find it in the top right corner of the fee',
        'Gebyrnummert har 4 siffer. Du finn det øvst i høgre hjørne på gebyret',
      ),
      instruction: _(
        'Fyll ut gebyrnummeret ditt',
        'Enter your fee number',
        'Fyll ut gebyrnummeret ditt',
      ),
      errorMessages: {
        empty: _(
          'Fyll ut gebyrnummeret ditt',
          'Enter your fee number',
          'Fyll ut gebyrnummeret ditt',
        ),
        invalidFormat: _(
          'Ugyldig gebyrnummer. Gebyrnummeret består av 4 siffer',
          'Invalid fee number. The fee number consists of 4 digits',
          'Ugyldig gebyrnummer. Gebyrnummeret består av 4 siffer',
        ),
      },
    },

    invoiceNumber: {
      label: _('Fakturanummer', 'Invoice number', 'Fakturanummer'),
      description: _(
        'Fakturanummeret finner du øverst i høyre hjørne på fakturaen.',
        'The invoice number is found in the top right corner of the invoice.',
        'Fakturanummeret finn du øvst i høgre hjørne på fakturaen.',
      ),
      instruction: _(
        'Fyll ut fakturanummeret ditt',
        'Enter your invoice number',
        'Fyll ut fakturanummeret ditt',
      ),
      errorMessages: {
        empty: _(
          'Fyll ut fakturanummeret ditt',
          'Enter your invoice number',
          'Fyll ut fakturanummeret ditt',
        ),
      },
    },

    feedback: {
      title: _(
        'Hva vil du å fortelle oss?',
        'What do you want to tell us?',
        'Kva vil du fortelje oss?',
      ),

      optionalTitle: _(
        'Ønsker du å fortelle oss noe mer? (valgfritt)',
        'Do you wish to share anyting else with us? - (optional)',
        'Ønsker du å fortelje oss noko meir? (valfritt)',
      ),

      description: _(
        'Unngå å oppgi personlig informasjon som bankkortnummer eller helseopplysninger. Vi vil spørre deg senere om det er nødvendig.',
        'Avoid providing personal information such as bank card numbers or health information. We will ask you later if it is necessary.',
        'Unngå å oppgi personopplysningar som bankkortnummer eller helseopplysningar. Vi spør deg seinare viss det er nødvendig.',
      ),

      attachment: _(
        'Last opp vedlegg',
        'Upload attachments',
        'Last opp vedlegg',
      ),
      errorMessages: {
        empty: _(
          'Tilbakemelding mangler',
          'Feedback is missing',
          'Tilbakemelding manglar',
        ),
      },
    },

    appPhoneNumber: {
      label: _(
        'Registrert mobilnummer',
        'Registered mobile number',
        'Registrert mobilnummer',
      ),
      errorMessages: {
        empty: _(
          'Legg til registrert mobilnummer',
          'Legg til registered mobile number',
          'Legg til registrert mobilnummer',
        ),
      },
    },

    customerNumber: {
      label: _('Kundenummer', 'Customer number', 'Kundenummer'),
      labelOptional: _(
        'Kundenummer - (valgfritt)',
        'Customer number - (optional)',
        'Kundenummer - (valfritt)',
      ),
      description: _(
        'Kundenummeret består av 7 siffer og du finner det under Min bruker i FRAM-appen, eller i nettbutikken.',
        'The customer number consists of 7 digits and can be found under My user in the FRAM app, or in the webshop',
        'Kundenummeret består av 7 siffer og du finn det under Min bruker i FRAM-appen, eller i nettbutikken.',
      ),
      errorMessages: {
        empty: _(
          'Fyll inn kundenummer',
          'Enter customer number',
          'Fyll inn kundenummer',
        ),
        invalidFormat: _(
          'Ugyldig kundenummer. Skriv inn et gyldig kundenummer med 7 siffer.',
          'Invalid customer number. Please enter a valid 7-digit number.',
          'Ugyldig kundenummer. Skriv inn eit gyldig kundenummer med 7 siffer.',
        ),
      },
    },

    travelCardNumber: {
      labelRadioButton: _('Reisekort', 'Travel card', 'Reisekort'),
      label: _('Reisekortnummer', 'Travel card number', 'Reisekortnummer'),
      info: _(
        'Legg inn reisekortnummeret her hvis du allerede har et reisekort. Reisekortnummeret består av 9 siffer og du finner det på baksiden av reisekortet ditt',
        'Enter the travel card number here if you already have a travel card. The travel card number consists of 9 digits and can be found on the back of your travel card',
        'Legg inn reisekortnummeret her viss du allereie har eit reisekort. Reisekortnummeret består av 9 siffer, og du finn det bak på reisekortet ditt.',
      ),
      errorMessages: {
        empty: _(
          'Legg til reisekortnummer',
          'Enter travel card number',
          'Legg til reisekortnummer',
        ),
        invalidFormat: _(
          'Ugyldig reisekortnummer. Skriv inn et gyldig reisekortnummer med 9 siffer.',
          'Invalid travel card number. Please enter a valid 9-digit number.',
          'Ugyldig reisekortnummer. Skriv inn eit gyldig reisekortnummer med 9 siffer.',
        ),
      },
    },

    question: {
      title: _(
        'Hva vil du spørre om?',
        'What do you want to ask about?',
        'Kva vil du spørje om?',
      ),

      info: _(
        'Unngå å oppgi personlig informasjon som bankkortnummer eller helseopplysninger. Vi vil spørre deg senere om det er nødvendig.',
        'Avoid providing personal information such as bank card numbers or health information. We will ask you later if it is necessary.',
        'Unngå å oppgi personopplysningar som bankkortnummer eller helseopplysningar. Vi spør deg seinare viss det er nødvendig.',
      ),

      attachment: _(
        'Last opp vedlegg',
        'Upload attachments',
        'Last opp vedlegg',
      ),
      errorMessages: {
        empty: _(
          'Spørsmålet mangler',
          'The question is missing',
          'Spørsmålet manglar',
        ),
      },
    },

    orderId: {
      label: (expectsSingleOrderId: boolean) =>
        expectsSingleOrderId
          ? _('Ordre-id', 'Order ID', 'Ordre-id')
          : _('Ordre-id(er)', 'Order ID(s)', 'Ordre-id(er)'),

      description: _(
        'Hvis du vil ha hjelp med en billett du allerede har kjøpt, trenger vi å vite ordre-id. Ordre-id finner du følgende steder:',
        'If you want help with a ticket you have already bought, we need to know the order ID. You can find the order ID in the following places:',
        'Viss du vil ha hjelp med ein billett du allereie har kjøpt, treng vi å vite ordre-id. Ordre-id finn du følgende stadar:',
      ),

      descriptionBulletPoints: [
        _(
          'På billetten i appen.',
          'On the ticket in the app.',
          'På billetten i appen.',
        ),

        _('På kvitteringen din.', 'On your receipt.', 'På kvitteringa di.'),
        _(
          'Du finner også ordre-id på utgåtte billetter.',
          'You can also find the order ID on expired tickets.',
          'Du finn også ordre-id på utgåtte billettar.',
        ),
      ],
      instruction: _(
        `Gjelder forespørselen flere billetter, send ordre-id for alle billettene, separert med komma (' , ').`,
        `If the request applies to several tickets, send the order ID for all the tickets, separated by commas (' , ').`,
        `Gjeld førespurnaden flere billettar, send ordre-id for alle billettane, separert med komma (' , ').`,
      ),
      errorMessages: {
        empty: _('Ordre-id mangler', 'Order-id is missing', 'Ordre-id manglar'),
        invalidFormat: {
          singleId: _(
            'Ugyldig ordre-ID. Skriv inn en gyldig ID på 8 tegn.',
            'Invalid order ID. Please enter a valid ID of 8 characters.',
            'Ugyldig ordre-ID. Skriv inn ein gyldig ID på 8 teikn.',
          ),
          multipleIds: _(
            'En eller flere ordre-IDer ugyldige. En gyldig ID består av 8 tegn.',
            'One or more order IDs are invalid. A vaild ID consists of 8 characters.',
            'Ein eller fleire ordre-IDar er ugyldige. Ein gyldig ID består av 8 teikn.',
          ),
        },
      },
    },

    refundReason: {
      label: _('Refusjonen gjelder', 'The refund applies', 'Refusjonen gjeld'),
      question: _(
        'Hva er grunnen til at du ønsker refusjon?',
        'What is the reason you want a refund?',
        'Kva er grunnen til at du ønsker refusjon?',
      ),
      errorMessages: {
        empty: _(
          'Grunn for refusjon mangler',
          'Reason for refund is missing',
          'Grunn for refusjon manglar',
        ),
      },
    },

    wantedResponse: {
      options: {
        yes: _(
          'Ja, jeg ønsker å motta svar på epost',
          'Yes, I want to receive an answer on email',
          'Ja, eg ønsker å motta svar på epost',
        ),
        no: _(
          'Nei, jeg ønsker ikke å motta svar på epost',
          'No, I dont´t want to receive an answer on email',
          'Nei, eg ønsker ikkje å motta svar på epost.',
        ),
      },

      errorMessages: {
        undefined: _(
          'Dette feltet er påkrevd. Velg "Ja" eller "Nei"',
          'This field is required. Please select "Yes" or "No"',
          'Dette feltet er påkravd. Vel "Ja" eller "Nei"',
        ),
      },
    },

    ticketType: {
      labelRefund: _(
        'Refusjonen for billett',
        'Refund for the ticket',
        'Refusjonen for billett',
      ),
      optionLabelRefund: _(
        'Velg billett for refusjonen',
        'Select ticket for the refund',
        'Vel billett for refusjon',
      ),
      options: [
        {
          id: 'singleTicket',
          name: _('Enkeltbillett', 'Single ticket', 'Enkeltbillett'),
        },
        {
          id: 'periodTicket',
          name: _(
            'Periodebillett (sonebasert)',
            'Period ticket (zone-based)',
            'Periodebillett (sonebasert)',
          ),
        },
        {
          id: 'framYoung',
          name: _('FRAM Ung', 'FRAM Ung', 'FRAM Ung'),
        },
        {
          id: 'framStudent',
          name: _('FRAM Student', 'FRAM Student', 'FRAM Student'),
        },
        {
          id: 'framAdult',
          name: _('FRAM Vaksen', 'FRAM Vaksen', 'FRAM Vaksen'),
        },
        {
          id: 'framSenior',
          name: _('FRAM Honnør', 'FRAM Honnør', 'FRAM Honnør'),
        },
      ] as TicketType[],
      errorMessages: {
        empty: _(
          'Billett for refusjon mangler',
          'Ticket for refund is missing',
          'Billett for refusjon manglar',
        ),
      },
    },

    amount: {
      label: _('Beløp', 'Amount', 'Beløp'),
      info: _(
        'Skriv inn beløpet du ønsker utbetalt i norske kroner.',
        'Enter the amount you want paid out in Norwegian kroner.',
        'Skriv inn beløpet du ønsker utbetalt i norske kroner. ',
      ),
      errorMessages: {
        empty: _('Beløp mangler', 'Amount is missing', 'Beløp manglar'),
      },
    },
  },
  success: {
    backButton: _(
      'Tilbake til hovedsiden',
      'Back to the main page',
      'Tilbake til hovedsida',
    ),
    title: _(
      'Takk for din henvendelse',
      'Thank you for your inquiry',
      'Takk for din førespurnad',
    ),
    info: _(
      'Vi har mottatt din henvendelse og vil behandle den så raskt som mulig.',
      'We have received your inquiry and will process it as soon as possible.',
      'Vi har motteke din førespurnad og vil behandle den så raskt som mogleg.',
    ),
  },
  error: {
    backButton: _(
      'Tilbake til skjemasiden',
      'Back to the contact page',
      'Tilbake til skjemasiden',
    ),
    title: _(
      'Ojda! Noe gikk galt med innsending av skjema',
      'Oops! Something went wrong with submitting the form',
      'Oi då! Noko gjekk gale med innsending av skjema',
    ),
    info: _(
      'Her gikk vi på en blemme og det skjedde en feil. Kan du prøve igjen?',
      'An error occured. Could you try again for us?',
      'Her gjekk vi på ei blemme og det skjedde ein feil. Kan du prøve igjen?',
    ),
  },
  components: {
    fileinput: {
      errorMessages: {
        empty: _('Vedlegg mangler', 'Attachment is missing', 'Vedlegg manglar'),
        tooLarge: (fileName: string) =>
          _(
            `Filen "${fileName}" er for stor. Maks 5 MB`,
            `The file "${fileName}" is too large. Max 5 MB`,
            `Fila "${fileName}" er for stor. Maks 5 MB`,
          ),
      },
    },
    modal: {
      moreInformation: (inputName: string) =>
        _(
          `Mer informasjon om ${inputName}`,
          `More information about ${inputName}`,
          `Meir informasjon om ${inputName}`,
        ),

      close: (inputName: string) =>
        _(
          `Klikk for å lukke informasjonsboksen`,
          `Click to close the information box`,
          `Klikk for å lukke informasjonsboksen`,
        ),
    },
  },
};

export const Contact = orgSpecificTranslations(ContactInternal, {
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
  },
});
