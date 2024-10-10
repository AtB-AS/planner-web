import { Area } from '@atb/page-modules/contact/means-of-transport/events';
import { RefundReason } from '@atb/page-modules/contact/ticketing/events';
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
  lostProperty: {
    title: _('Hittegods', 'Lost property', 'Hittegods'),
    description: {
      info: _(
        'Har du glemt igjen noe i en av bussene, hurtigbåtene eller fergene',
        'If you have forgotten something on one of the buses, express boats, or ferries',
        'Har du gløymt igjen noko i ein av bussane, hurtigbåtane eller ferjene',
      ),
      externalLink: _(
        'finner du informasjon om hvem du kan kontakte her.',
        'you can find information on who to contact here.',
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
          'Hvilke billett gjelder det?',
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
    },
    travelCard: {
      description: _('Resekort', 'Travel card', 'Resiekort'),
      question: _(
        'Hva gjelder forespørselen?',
        'What is the request about?',
        'Kva gjeld førespurnaden',
      ),

      orderTravelCard: {
        label: _('Bestill reisekort', 'Order travel card', 'Bestill reisekort'),
        info: {
          firstParagraph: _(
            'Et reisekort er et fysisk plastkort. På reisekortet kan du legge periodebilletter.<1/>Fyll ut dette skjemaet viss du vil bestille eit reisekort og få det tilsendt. Merk at vi berre sender reisekort til adresser i Noreg.',
            'A travel card is a physical plastic card. You can add period tickets to the travel card',
            'Eit reisekort er eit fysisk plastkort. På reisekortet kan du legge periodebillettar.',
          ),
          secondParagraph: _(
            'Fyll ut dette skjemaet hvis du vil bestille et reisekort og få det tilsendt. Merk at vi bare sender reisekort til adresser i Norge.',
            'Fill in this form if you want to order a travel card and have it sent to you. Note that we only send travel cards to addresses in Norway.',
            'Fyll ut dette skjemaet viss du vil bestille eit reisekort og få det tilsendt. Merk at vi berre sender reisekort til adresser i Noreg.',
          ),
          thirdParagraph: _(
            'Du kan også få reisekort på bussen, hurtigbåten eller på en av trafikkterminalane. På de samme stedene og i nettbutikken kan du fylle på kortet med nye billetter.',
            'You can also get a travel card on the bus, express boat or at one of the traffic terminals. At the same places and in the online shop, you can top up the card with new tickets.',
            'Du kan også få reisekort på bussen, hurtigbåten eller på ein av trafikkterminalane. På dei same stadane og i nettbutikken kan du fylle på kortet med nye billettar.',
          ),
        },
      },
      otherQuestionsRegardingTravelCard: {
        label: _(
          'Andre spørsmål om reisekort',
          'Other questions regarding travel card',
          'Andre førespurnader om reisekort',
        ),
      },
    },
    refund: {
      description: _('Refusjon', 'Refund', 'Refusjon'),
      agreement: {
        ticketRefundAvailability: {
          title: _(
            'Når kan du få refundert billetten din?  ',
            'When can you get your ticket refunded?',
            'Når kan du få refundert billetten din?',
          ),
          rules: [
            _(
              'Når du ikke reise med oss lenger. Hvis du for eksempel flytter, blir sjukemeldt, endrer reisemønster eller har en annen grunn til å søke om refusjon.',
              'When you no longer travel with us. If, for example, you move, are on sick leave, change your travel pattern or have another reason to apply for a refund.',
              'Når du ikkje reise med oss lenger. Viss du for eksempel flytter, blir sjukemeldt, endrar reisemønster eller har en anna grunn til å søke om refusjon.',
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
              'Fylkesbillettene FRAM Ung, FRAM Student, FRAM Voksen og FRAM Honnør: Du får refusjon for antall resterende døgn.',
              'The county tickets FRAM Ung, FRAM Student, FRAM Adult and FRAM Senior: You will receive a refund for numbers remaining on the day.',
              'Fylkesbillettane FRAM Ung, FRAM Student, FRAM Vaksen og FRAM Honnør: Du får refusjon for antall resterande døgn. ',
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
          ],
          info: _(
            'Gjelder kravet reisegaranti, dvs refusjon for utgifter til andre transportmiddel fordi buss eller hurtigbåt ikke var i rute? Da skal du ikke søke refusjon, men reisegaranti. Dette finner du under Reisegaranti.',
            'Does the claim apply to a travel guarantee, i.e. refund for expenses for other means of transport because the bus or express boat was not on schedule? Then you should not apply for a refund, but a travel guarantee. You can find this under Travel guarantee.',
            'Gjeld kravet reisegaranti, dvs refusjon for utgifter til andre transportmiddel fordi buss eller hurtigbåt ikkje var i rute? Då skal du ikkje søke refusjon, men reisegaranti. Dette finn du under Reisegaranti. ',
          ),
          checkbox: _('Jeg forsår', 'I understand', 'Eg forstår'),
        },
      },
      appTicketRefund: {
        label: _(
          'Billett kjøpt i FRAM-appen (alle billettyper) ',
          'Ticket purchased in the FRAM app (all ticket types)',
          'Billett kjøpt i FRAM-appen (alle billettypar) ',
        ),
      },
    },
  },
  lostAndFound: {
    title: _('Hittegods', 'Lost and found', 'Hittegods'),
  },
  groupTravel: {
    title: _('Gruppereise', 'Group travel', 'Gruppereise'),
    travelTypeBus: {
      radioLabel: _(
        'Gruppereise med buss',
        'Group travel by bus',
        'Gruppereise med buss',
      ),
      paragraphs: [
        _(
          'Det er ikke mulig å reservere seter om bord på buss, men ved å melde fra om større grupper vil det blir enklere å planlegge avgangene slik at ingen blir stående igjen.',
          "It's not possible to reserve seats on the bus, but by notifying us about larger groups, it will be easier to plan the departures so that no one is left behind.",
          'Det er ikkje mogleg å reservere seter om bord på bussar, men ved å melde frå om større grupper vil det bli enklare å planlegge avgangane slik at ingen blir ståande att.',
        ),
        _(
          'Det er ingen grupperabatt på bussene til FRAM.',
          'There is no group discount on the FRAM buses.',
          'Det er ingen grupperabatt på bussane til FRAM.',
        ),
        _(
          'Fristen for å melde inn er klokken 12.00 dagen før. Om du skal reise på en mandag, er fristen kl. 12.00 fredagen før.',
          'The deadline for notification is 12.00 the day before. If you are traveling on a Monday, the deadline is 12.00 on the Friday before.',
          'Fristen for å melde inn er klokka 12.00 dagen før. Om du skal reise på ein måndag, er fristen kl. 12.00 fredagen før.',
        ),
        _(
          'Vi anbefaler grupper å ha med barnesete til alle som normalt bruker dette. Det er setebelte i alle bussene bortsett fra bybussene.',
          'We recommend groups to bring a child seat for everyone who normally uses this. There are seat belts on all buses except for the city buses.',
          'Vi anbefaler grupper å ha med barnesete til alle som normalt bruker dette. Det er setebelte i alle bussane bortsett frå bybussane.',
        ),
      ],
      kindergarden: {
        title: _(
          'Barnehage på buss',
          'Kindergarten on bus',
          'Barnehage på buss',
        ),
        paragraphs: [
          _(
            'Barn på tur med barnehage kan reise gratis med buss mellom klokka 09.00 og 13.00 alle hverdager. Voksne må kjøpe vanlig billett for bussen.',
            'Children on a trip with a kindergarten can travel for free by bus between 09.00 and 13.00 every weekday. The adults must purchase a regular bus ticket.',
            'Barn på tur med barnehage kan reise gratis med buss mellom klokka 09.00 og 13.00 alle kvardagar. Dei vaksne må kjøpe vanleg billett for bussen.',
          ),
          _(
            'Barnehagar skal sende inn skjema for gruppereise.',
            'Kindergartens must submit a group travel form.',
            'Barnehagar skal sende inn skjema for gruppereise.',
          ),
        ],
      },
      form: {
        title: _('Gruppereiseskjema', 'Group travel form', 'Gruppereiseskjema'),
        info: _(
          'Vi ber om de personopplysningene vi trenger for å behandle saken din. Du skal derfor ikke legge inn personopplysninger i fritekstfeltene. Personopplysninger er alle opplysninger som kan knyttes til en fysisk person, eller bidra til å identifisere en fysisk person.',
          'We ask for the personal information we need to process your case. Therefore, you should not enter personal information in the free text fields. Personal information is all information that can be linked to a physical person, or contribute to identifying a physical person.',
          'Vi ber om dei personopplysningane vi treng for å behandle saka di. Du skal derfor ikkje legge inn personopplysningar i fritekstfelta. Personopplysningar er alle opplysningar som kan knytast til ein fysisk person, eller bidra til å identifisere ein fysisk person.',
        ),
        travelInformation: {
          title: _(
            'Reiseinformasjon',
            'Travel information',
            'Reiseinformasjon',
          ),
          dateOfTravel: {
            title: _(
              'Dato de skal reise',
              'Date of travel',
              'Dato de skal reise',
            ),
          },
          line: {
            title: _('Linje (påkrevd)', 'Line (required)', 'Linje (påkrevd)'),
            info: _(
              'Velg linjen på bussen de vil reise med.',
              'Select the bus line you would like to travel with.',
              'Velg linjen på bussen de vil reise med.',
            ),
          },
          fromStop: {
            title: _(
              'Fra holdeplass (påkrevd)',
              'From stop (required)',
              'Frå holdeplass (påkrevd)',
            ),
            info: _(
              'Velg holdeplassen de vil reise fra.',
              'Select the stop you would like to travel from.',
              'Velg haldeplassen de vil reise frå.',
            ),
          },
          departureTime: {
            title: _(
              'Avgangstid (påkrevd)',
              'Departure time (påkrevd)',
              'Avgangstid (påkrevd)',
            ),
            info: _(
              'Skriv inn avgangstiden fra holdeplassen de vil reise fra.',
              'Write the departure time from the stop you would like to travel from.',
              'Skriv inn avgangstida frå haldeplassen de vil reise frå.',
            ),
          },
          toStop: {
            title: _(
              'Til holdeplass (påkrevd)',
              'To stop (required)',
              'Til holdeplass (påkrevd)',
            ),
            info: _(
              'Velg holdeplassen de vil reise til.',
              'Select the stop you would like to travel to.',
              'Velg haldeplassen de vil reise til.',
            ),
          },
        },
        travelReturn: {
          title: _(
            'Retur (hvis aktuelt)',
            'Return (if applicable)',
            'Retur (viss aktuelt)',
          ),
          line: {
            title: _(
              'Linje (for returen)',
              'Line (for the return)',
              'Linje (for returen)',
            ),
            info: _(
              'Velg linjen på bussen de vil reise med på returen.',
              'Select the bus line you would like to travel with on the return.',
              'Velg linjen på bussen de vil reise med på returen.',
            ),
          },
          fromStop: {
            title: _(
              'Fra holdeplass (for returen)',
              'From stop (for the return)',
              'Frå holdeplass (for returen)',
            ),
            info: _(
              'Velg holdeplassen de vil reise fra på returen.',
              'Select the stop you would like to travel from on the return.',
              'Velg haldeplassen de vil reise frå på returen.',
            ),
          },
          departureTime: {
            title: _(
              'Avgangstid (for returen)',
              'Departure time (for the return)',
              'Avgangstid (for returen)',
            ),
            info: _(
              'Skriv inn avgangstiden fra holdeplassen de vil reise fra på returen.',
              'Write the departure time from the stop you would like to travel from on the return.',
              'Skriv inn avgangstida frå haldeplassen de vil reise frå med på returen.',
            ),
          },
          toStop: {
            title: _(
              'Til holdeplass (for returen)',
              'To stop (for the return)',
              'Til holdeplass (for returen)',
            ),
            info: _(
              'Velg holdeplassen de vil reise til på returen.',
              'Select the stop you would like to travel to on the return.',
              'Velg haldeplassen de vil reise til på returen.',
            ),
          },
        },
        groupInformation: {
          title: _(
            'Informasjon om gruppen',
            'Information about the group',
            'Informasjon om gruppa',
          ),
          groupSize: {
            title: _(
              'Antall reisende (påkrevd)',
              'Number of travelers (required)',
              'Talet reisande (påkrevd)',
            ),
            info: _(
              'Skriv inn antall som skal reise',
              'Write number of travellers',
              'Skriv inn talet reisande som skal reise. ',
            ),
            error: _(
              'Antall reisende må være et tall',
              'Number of travelers must be a number',
              'Talet reisande må vere eit tal',
            ),
          },
          groupInfo: {
            title: _(
              'Gruppe (påkrevd)',
              'Group (required)',
              'Gruppe (påkrevd)',
            ),
            info: _(
              'Skriv inn navnet på bedriften, skolen, barnehagen, organisasjonen og lignende. Ikke skriv personopplysninger.',
              'Write the name of the company, school, kindergarten, organization, and the like. Do not write personal information.',
              'Skriv inn namnet på bedrifta, skolen, barnehagen, organisasjonen og liknande. Ikkje skriv personopplysningar. ',
            ),
            error: _(
              'Info om gruppe kan ikke være tom',
              'Group info cannot be empty',
              'Info om gruppe kan ikkje vere tom',
            ),
          },
          firstName: {
            title: _(
              'Fornavnet til ansvarlig person (påkrevd)',
              'First name of responsible person (required)',
              'Fornamnet til ansvarleg person (påkrevd)',
            ),
            info: _(
              'Skriv inn fornavnet til personen som er ansvarlig for gruppen',
              'Write the first name of the person responsible for the group',
              'Skriv inn fornamnet til personen som er ansvarleg for gruppa. ',
            ),
            error: _(
              'Fornavnet til ansvarlig person kan ikke være tom',
              'First name of responsible person cannot be empty',
              'Fornamnet på ansvarleg person kan ikkje vere tom',
            ),
          },
          lastName: {
            title: _(
              'Etternavnet til ansvarlig person (påkrevd)',
              'Last name of responsible person (required)',
              'Etternamnet til ansvarleg person (påkrevd)',
            ),
            info: _(
              'Skriv inn etternavnet til personen som er ansvarlig for gruppen',
              'Write the last name of the person responsible for the group',
              'Skriv inn etternamnet til personen som er ansvarleg for gruppa. ',
            ),
            error: _(
              'Etternavnet til ansvarlig person kan ikke være tom',
              'Last name of responsible person cannot be empty',
              'Etternamnet på ansvarleg person kan ikkje vere tom',
            ),
          },
          responsiblePersonPhone: {
            title: _(
              'Mobilnummer til ansvarlig person (påkrevd)',
              'Phone number of responsible person (required)',
              'Mobilnummer til ansvarleg person (påkrevd)',
            ),
            info: _(
              'Skriv inn mobilnummeret til personen som er ansvarlig for gruppen',
              'Write the phone number of the person responsible for the group',
              'Skriv inn mobilnummeret til personen som er ansvarleg for reisefølget. ',
            ),
            error: _(
              'Mobilnummer til ansvarlig person kan ikke være tom',
              'Phone number of responsible person cannot be empty',
              'Mobilnummer til ansvarleg person kan ikkje vere tom',
            ),
          },
          responsiblePersonEmail: {
            title: _(
              'E-post til ansvarlig person (påkrevd)',
              'Email to responsible person (required)',
              'E-post til ansvarleg person (påkrevd)',
            ),
            info: _(
              'Skriv inn e-postadressen til personen som er ansvarlig for gruppen',
              'Write the email address of the person responsible for the group',
              'Skriv inn e-postadressa til personen som er ansvarlege for reisefølget. ',
            ),
            error: _(
              'E-post til ansvarlig person kan ikke være tom',
              'Email to responsible person cannot be empty',
              'E-post til ansvarleg person kan ikkje vere tom',
            ),
          },
        },
      },
    },
    travelTypeBoat: {
      radioLabel: _(
        'Gruppereise med hurtigbåt',
        'Group travel by express boat',
        'Gruppereise med hurtigbåt',
      ),
      contactInformation: {
        info: _(
          'For gruppereiser med hurtigbåt melder du fra direkte til hurtigbåtene.',
          'For group travel by express boat, you report directly to the express boats.',
          'For gruppereiser med hurtigbåt melder du frå direkte til hurtigbåten.',
        ),
        externalLink: _(
          'Kontaktinformasjon finner du på rutetabellene for hurtigbåt.',
          'You can find the contact information on the express boat timetables.',
          'Du finn kontaktinformasjon på rutetabellane for hurtigbåt.',
        ),
        url: _(
          'https://frammr.no/reise/rutetabellar-og-linjekart/hurtigbat/',
          'https://frammr.no/reise/rutetabellar-og-linjekart/hurtigbat/?sprak=11',
          'https://frammr.no/reise/rutetabellar-og-linjekart/hurtigbat/',
        ),
      },
      discountInformation: _(
        'Grupper på 10 eller flere som kjøpe samlet billett får 30 prosent rabatt på enkeltbillett. Rabatten for gruppe gjelder bare voksne og barn, ikke for andre rabatterte billetter som for eksempel honnør.',
        'Groups of 10 or more who buy a collective ticket receive a 30 percent discount on a single ticket. The group discount applies only to adults and children, not to other discounted tickets such as senior.',
        'Grupper på 10 eller fleire som kjøper samla billett får 30 prosent rabatt på enkeltbillett. Rabatten for gruppe gjeld berre vaksne og barn, ikkje for andre rabatterte billettar som for eksempel honnør.',
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

    bankInformation: {
      bankAccountNumber: {
        label: _('Bankkontonummer', 'Bank account number', 'Bankkontonummer'),
        errorMessages: {
          empty: _(
            'Vennligst fyll ut ditt bankkontonummer',
            'Please provide your bank account number',
            'Vennligst fyll ut ditt bankkontonummer',
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
          labelOptional: _(
            'Kundenummer - (valgfritt)',
            'Customer number - (optional)',
            'Kundenummer - (valfritt)',
          ),
          description: _(
            'Kundenummeret finner du under Min bruker i FRAM-appen, eller i nettbutikken.',
            'You can find the customer number under My user in the FRAM app, or in the webshop.',
            'Kundenummeret finn du under Min bruker i FRAM-appen, eller i nettbutikken.',
          ),
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
        info: _(
          'Legg inn reisekortnummeret her hvis du allerede har et reisekort. Reisekortnummeret finner du bak på reisekortet ditt. ',
          'Enter the travel card number here if you already have a travel card. You can find the travel card number on the back of your travel card.',
          'Legg inn reisekortnummeret her viss du allereie har eit reisekort. Reisekortnummeret finn du bak på reisekortet ditt. ',
        ),
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

    question: {
      title: _(
        'Hva ønsker du å spørre om?',
        'What do you want to ask about?',
        'Kva ønskjer du å spørje om?',
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
          'Smørsmålet mangler',
        ),
      },
    },

    orderId: {
      label: _('Ordre-id(er)', 'Order ID(s)', 'Ordre-id(er)'),
      info: _(
        'Hvis du vil ha hjelp med en billet du allrede har kjøpt, trenger vi å vite ordre-id. Den finner du på billetten i appen, eller på kvitteringen din. Du finner ordre-id også på utgåtte billetter. Gjelder forespørslen din flere billetter, må du huske å sende med ordre-id for alle billettene.',
        'If you want help with a ticket you have already bought, we need to know the order ID. You can find it on the ticket in the app, or on your receipt. You can also find the order ID on expired tickets. If your request concerns several tickets, you must remember to send with the order ID for all the tickets.',
        'Viss du vil ha hjelp med ein billett du allereie har kjøpt, treng vi å vite ordre-id. Den finn du på billetten i appen, eller på kvitteringa di. Du finn ordre-id også på utgåtte billettar. Gjeld førespurnaden din fleire billettar, må du huske å sende med ordre-id for alle billettane.',
      ),
      description: _(
        `Ved flere ordre-id-er, skill med komma (',').`,
        `For multiple order IDs, separate with commas (','').`,
        `Ved flere ordre-id-er, skill med komma (',').`,
      ),
      errorMessages: {
        empty: _('Ordre-id mangler', 'Order-id is missing', 'Ordre-id mangler'),
      },
    },

    refundReason: {
      label: _('Refusjonen gjelder', 'The refund applies', 'Refusjonen gjeld'),
      optionLabel: _(
        'Velg grunnen for refusjonen',
        'Select reason for the refund',
        'Vel grunn for refusjon',
      ),
      options: [
        {
          id: 'singleTicket',
          name: _('Enkeltbillett', 'Single ticket', 'Enkeltbillett'),
        },
        {
          id: 'periodTicket',
          name: _(
            'Periodebillet (sonebasert)',
            'Period ticket (zone-based)',
            'Periodebillet (sonebasert)',
          ),
        },
        {
          id: 'framYoung',
          name: _('FRAM Ung', 'FRAM Young', 'FRAM Ung'),
        },
        {
          id: 'framStudent',
          name: _('FRAM Student', 'FRAM Student', 'FRAM Student'),
        },
        {
          id: 'framAdult',
          name: _('FRAM Voksen', 'FRAM Adult', 'FRAM Voksen'),
        },
        {
          id: 'framSenior',
          name: _('Fram Honnør', 'Fram Senior', 'Fram Honnør'),
        },
      ] as RefundReason[],
      errorMessages: {
        empty: _('Område mangler', 'Area is missing', 'Område mangler'),
      },
    },
    amount: {
      label: _('Beløp', 'Amount', 'Beløp'),
      info: _(
        'Skriv inn beløpet du ønsker utbetalt, i norske kroner.',
        'Enter the amount you want paid out, in Norwegian kroner.',
        'Skriv inn beløpet du ønsker utbetalt, i norske kroner. ',
      ),
      errorMessages: {
        empty: _(
          'Grunn for refusjon mangler',
          'Reason for refund is missing',
          'Grunn for refusjon mangler',
        ),
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
