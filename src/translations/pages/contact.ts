import { Area } from '@atb/page-modules/contact/means-of-transport/events';
import { ReasonForTransportFailure } from '@atb/page-modules/contact/travel-guarantee/events';
import { translation as _ } from '@atb/translations/commons';

export const Contact = {
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
        'Eg har fått gebyr og ønskjer å klage',
      ),
      info: _(
        'Hvis du har fått gebyr på feil grunnlag, kan du sende oss en skriftlig klage.',
        'If you have received a fee on incorrect grounds, you can submit a written complaint to us.',
        'Dersom du har fått gebyr på feil grunnlag, kan du sende oss ei skriftleg klage.',
      ),

      firstAgreement: {
        title: _(
          'Har du fått gebyr etter billettkontroll?',
          'Have you received a fine after a ticket inspection?',
          'Har du fått gebyr etter billettkontroll?',
        ),
        question: _(
          'Vi har full forståelse for at det kan være en ubehagelig opplevlese å få gebyr ved billettkontroll, og vi vet at de aller fleste ønsker å reise med gyldig billett.',
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
          _(
            'Vi kan kreve gebyr selv om du er under 15 år.',
            'We may charge a fee even if you are under 15 years old.',
            'Vi kan krevje gebyr sjølv om du er under 15 år.',
          ),
        ],
        checkbox: _('Jeg forsår', 'I understand', 'Eg forstår'),
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
        'Eg har fått gebyr og ønskjer å utsetje betalinga',
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
        'Har du tilbakemelding på en bestemt billettkontroll, trenger vi en beskrivelse av hvor og når billettkontrollen fant sted for å kunne gå videre med saken. Hvis du har en generell tilbakemelding, kan du hoppe over de første punktene.',
        'If you have feedback regarding a specific ticket inspection, we need a description of where and when the ticket inspection took place in order to proceed with the matter. If you have general feedback, you can skip the initial points.',
        'Har du tilbakemelding på ein bestemt billettkontroll, treng vi ei beskriving av kor og kva tid billettkontrollen var for å kunne gå vidare med saka. Har du ei generell tilbakemelding, kan du hoppe over dei første punkta.',
      ),
    },
  },

  travelGuarantee: {
    title: _('Reisegaranti', 'Travel guarantee', 'Reisegaranti'),

    agreement: {
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

        minimumTimeToNextDeparture: _(
          'Reisegarantien gjelder ikke dersom det er 20 minutter eller mindre til neste avgang i henhold til rutetabellen.',
          'The travel guarantee does not apply if there are 20 minutes or less until the next departure according to the timetable.',
          'Reisegarantien gjeld ikkje dersom det er 20 minutt eller mindre til neste avgang i følgje rutetabellen.',
        ),

        externalFactors: _(
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
            'ekstraordinære verforhold',
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
        exclusion: _(
          'Reisegarantien omfatter heller ikke tap som følge av forsinkelsen, som for eksempel mistet tannlegetime, jobbavtale, togavgang eller flyavgang.',
          'The travel guarantee does not cover losses resulting from the delay, such as missed dental appointments, job agreements, train departures, or flight departures.',
          'Reisegarantien omfattar heller ikkje tap som følge av forseinkinga, som for eksempel mista tannlegetime, jobbavtale, togavgang eller flyavgang.',
        ),
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
      information: {
        title: _(
          'Informasjon fra drosjekvitteringen',
          'Information from the taxi reciet',
          'Informasjon frå drosjekvitteringa',
        ),
      },
      aboutYourTrip: {
        title: _(
          'Om den planlagte reisa di',
          'About your planed trip',
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
        'Hvis du ikke kommer frem med et annet rutetilbud, refunderer vi dokumenterte utgifter for bruk av bil. Vi betaler kilometergodtgjørelse etter statens satser. Refusjonen dekker ikke bompenger, parkering eller andre utgifter knyttet til leiebil/delbil.',
        'If you are unable to reach your destination by an alternative service, we will refund documented expenses for the use of a car. We pay compensation per kilometer according to government rates. The refund does not cover tolls, parking, or other expenses related to rental cars/sharing cars',
        'Viss du ikkje kjem fram med eit anna rutetilbod, refunderer vi dokumenterte utlegg for bruk av bil. Vi betalar kilometergodtgjersle etter statens satsar. Refusjonen dekker ikkje bompengar, parkering eller andre utgifter knytt til leigebil/delebil.',
      ),

      aboutTheCarTrip: {
        title: _('Om bilturen', 'About the car trip', 'Om bilturen'),
      },
      aboutThePlanedTrip: {
        title: _(
          'Om den planlagde reisen di',
          'About your planed trip',
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
        'Forinkelse, kjørt for tidlig eller innstilt',
        'Delay, driven too early or cancelled',
        'Forseinking, køyrd for tidleg eller innstilt',
      ),
      info: _(
        'Hvis transportmiddelet ditt er forsinket, for tidlig ute, ikke stoppet, manglet plass eller hvis du ikke fikk tilstrekkelig informasjon om planlakte avvik, kan du gi tilbakemelding her.',
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
        'Har du opplevd en feil eller manglende stopp? Eksempler kan være skade på leseskur, søppel, feil med sanntidsskilt eller lignende.',
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
        'Har du skadet deg selv eller noe du eier om bord på et av våre transportmidler eller ved kai/brygge? Gi tilbakemelding her, så tar vi saken videre med det aktuelle busselskapet eller ledergruppen.',
        'Did you injure yourself or something you own on board one of our means of transport or at a dock? Give feedback here, and we will take the matter further with the relevant bus company or management team.',
        'Skada du deg sjølv eller noko du eig om bord på eit av våre transportmiddel eller på haldeplass/kai? Gi tilbakemelding her, så tar vi saka vidare med aktuelt busselskap eller reiarlag.',
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

  ticketsApp: {
    title: _('Billetter og app', 'Tickets and app', 'Billettar og app'),
  },
  lostAndFound: {
    title: _('Hittegods', 'Lost and found', 'Hittegods'),
  },
  groupTravel: {
    title: _('Gruppereise', 'Group travel', 'Gruppereise'),
  },
  aboutYouInfo: {
    title: _(
      'Informasjon om deg',
      'Information about you',
      'Informasjon om deg',
    ),
    optionalTitle: _(
      'Informasjon om deg (valgfritt)',
      'Information about you (optinal)',
      'Informasjon om deg  (valfritt)',
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
      errorMessages: {
        empty: _(
          'Vennligst fyll ut informasjon om deg',
          'Please provide your information',
          'Vennligst fyll ut din informasjon',
        ),
      },
    },

    lastName: {
      label: _('Etternavn', 'Lastname', 'Etternamn'),
      errorMessages: {
        empty: _(
          'Vennligst fyll ut informasjon om deg',
          'Please provide your information',
          'Vennligst fyll ut din informasjon',
        ),
      },
    },

    email: {
      label: _('E-post', 'Email', 'E-post'),
      isResponseWanted: {
        label: _(
          'E-post (må fylles ut hvis du vil ha svar)',
          'Email (must be entered if you want to receive an answer)',
          'E-post (må fyllast ut viss du vil ha svar)',
        ),
        checkbox: _(
          'Ja, jeg ønsker å motta svar på epost',
          'Yes, I want to receive an answer on email',
          'Ja, eg ønsker å motta svar på epost',
        ),
      },
      errorMessages: {
        empty: _(
          'Vennligst fyll ut informasjon om deg',
          'Please provide your information',
          'Vennligst fyll ut din informasjon',
        ),
      },
    },

    address: {
      label: _('Adresse', 'Address', 'Adresse'),
      errorMessages: {
        empty: _(
          'Vennligst fyll ut informasjon om deg',
          'Please provide your information',
          'Vennligst fyll ut din informasjon',
        ),
      },
    },

    postalCode: {
      label: _('Postnummer', 'Postal code', 'Postnummer'),
      errorMessages: {
        empty: _(
          'Vennligst fyll ut informasjon om deg',
          'Please provide your information',
          'Vennligst fyll ut din informasjon',
        ),
      },
    },

    city: {
      label: _('Bosted', 'City', 'Bustad'),
      errorMessages: {
        empty: _(
          'Vennligst fyll ut informasjon om deg',
          'Please provide your information',
          'Vennligst fyll ut din informasjon',
        ),
      },
    },

    phoneNumber: {
      label: _('Telefonnummer', 'Phonenumber', 'Telefonnummer'),
      errorMessages: {
        empty: _(
          'Vennligst fyll ut informasjon om deg',
          'Please provide your information',
          'Vennligst fyll ut din informasjon',
        ),
      },
    },

    bankAccountNumber: {
      notForeignLabel: _(
        'Bankkontonummer',
        'Bank account number',
        'Bankkontonummer',
      ),
      checkbox: _(
        'Jeg har et utenlandsk bankkontonummer',
        'I have a foreign bank account',
        'Eg har eit utanlandsk bankkontonummer',
      ),
      IBAN: _('IBAN', 'IBAN', 'IBAN'),
      SWIFT: _('SWIFT ', 'SWIFT ', 'SWIFT '),

      errorMessages: {
        empty: _(
          'Vennligst fyll ut ditt bankkontonummer',
          'Please provide your bank account',
          'Vennligst fyll ut ditt bankkontonummer',
        ),
      },
    },

    transportMode: {
      label: _('Transportmiddel', 'Transport mode', 'Transportmiddel'),
      optionLabel: _(
        'Velg transportmiddel',
        'Select transport mode',
        'Vel transportmiddel',
      ),
      errorMessages: {
        empty: _(
          'Velg transportmiddel',
          'Select transport mode',
          'Vel transportmiddel',
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
        'Gebyrnummeret har fire siffer. Du finner det øverst i høyre hjørne på gebyret',
        'The fee number has four digits. You can find it in the top right corner of the fee',
        'Gebyrnummert har fire siffer. Du finn det øvst i høgre hjørne på gebyret',
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
        notFourDigits: _(
          'Gebyrnummeret består av fire siffer',
          'The fee number consists of four digits',
          'Gebyrnummeret består av fire siffer',
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

    ticketStorage: {
      question: _(
        'Hvor pleier du å ha billetten din?',
        'Where do you usually keep your ticket?',
        'Kor pleier du å ha billetten din?',
      ),

      app: {
        title: _('App', 'App', 'App'),
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
          errorMessages: {
            empty: _(
              'Fyll inn kundenummer',
              'Enter customer number',
              'Fyll inn kundenummer',
            ),
          },
        },
      },

      travelCardNumber: {
        label: _('Reisekort', 'Travelcard', 'Reisekort'),
        errorMessages: {
          empty: _(
            'Legg til reisekort',
            'Enter travelcard number',
            'Legg til reisekort',
          ),
        },
      },
    },
    feedback: {
      title: _(
        'Hva ønsker du å fortelle oss?',
        'What do you want to tell us?',
        'Kva ønskjer du å fortelje oss?',
      ),

      optionalTitle: _(
        'Ønsker du å fortelle oss noe mer? (valgfritt)',
        'Do you whish to share anyting else with us? - (optional)',
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
          'Tilbakemelding mangler',
        ),
      },
    },
    area: {
      label: _('Område', 'Area', 'Område'),
      optionLabel: _('Velg område', 'Select area', 'Vel område'),
      options: [
        {
          id: 'rp1',
          name: _(
            'Ålesund, Giske, Sula (RP1)',
            'Ålesund, Giske, Sula (RP1)',
            'Ålesund, Giske, Sula (RP1)',
          ),
        },
        {
          id: 'rp2',
          name: _(
            'Kristiansund, Averøy, Aure, Smøla (RP2)',
            'Kristiansund, Averøy, Aure, Smøla (RP2)',
            'Kristiansund, Averøy, Aure, Smøla (RP2)',
          ),
        },
        {
          id: 'rp3',
          name: _(
            'Molde (unntatt Skåla), Gjemnes (RP3)',
            'Molde (except Skåla), Gjemnes (RP3)',
            'Molde (unntatt Skåla), Gjemnes (RP3)',
          ),
        },
        {
          id: 'rp4',
          name: _(
            'Sunnmøre nord (RP4)',
            'Sunnmøre nord (RP4)',
            'Sunnmøre nord (RP4)',
          ),
        },
        {
          id: 'rp5',
          name: _(
            'Sunnmøre sør (RP5)',
            'Sunnmøre sør (RP5)',
            'Sunnmøre sør (RP5)',
          ),
        },
        {
          id: 'rp6',
          name: _(
            'Sunndalsøra, Surnadal, Trondheim, Oppdal (RP6)',
            'Sunndalsøra, Surnadal, Trondheim, Oppdal (RP6)',
            'Sunndalsøra, Surnadal, Trondheim, Oppdal (RP6)',
          ),
        },
        {
          id: 'rp7',
          name: _(
            'Rauma, Vestnes, Skåla (RP7)',
            'Rauma, Vestnes, Skåla (RP7)',
            'Rauma, Vestnes, Skåla (RP7)',
          ),
        },
        {
          id: 'rp8',
          name: _(
            'Hustadvika, Midsund, Aukra (RP8)',
            'Hustadvika, Midsund, Aukra (RP8)',
            'Hustadvika, Midsund, Aukra (RP8)',
          ),
        },
      ] as Area[],
      errorMessages: {
        empty: _('Område mangler', 'Area is missing', 'Område mangler'),
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
          `Mer informasjon om ${inputName}`,
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
