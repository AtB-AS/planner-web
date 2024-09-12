import { translation as _ } from '@atb/translations/commons';

export const Contact = {
  title: _(
    'Hva kan vi hjelpe deg med?',
    'What can we help you with?',
    'Kva kan vi hjelpe deg med?',
  ),
  ticketControl: {
    title: _(
      'Billettkontroll og gebyr',
      'Ticket control and fee',
      'Billettkontroll og gebyr',
    ),
    subPageTitles: {
      feeComplaint: _(
        'Jeg har fått gebyr og ønsker å klage',
        'I have received a fee and would like to file a complaint',
        'Eg har fått gebyr og ønskjer å klage',
      ),
      postpone: _(
        'Jeg har fått gebyr og ønsker å utsette betalingen',
        'I have received a fee and would like to postpone the payment',
        'Eg har fått gebyr og ønskjer å utsetje betalinga',
      ),
      feedback: _(
        'Jeg vil gi en tilbakemelding knyttet til billettkontroll',
        'I would like to provide feedback regarding ticket control',
        'Eg vil gi ei tilbakemelding knytt til billettkontroll',
      ),
    },

    feeComplaint: {
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
            'You are responsible for having a valid ticket and identification throughout the journey.',
            'Du er sjølv ansvarleg for å ha gyldig billett og legitimasjon på heile reisa.',
          ),
          _(
            'Reiser du med en rabattert billett, må du også ha legitimasjon på at du har rett til rabatten for at billetten skal være gyldig.',
            'If you are traveling with a discounted ticket, you must also have identification proving your eligibility for the discount for the ticket to be valid.',
            'Reiser du med ein rabattert billett, må du også ha legitimasjon på at du har rett til rabatten for at billetten skal vere gyldig.',
          ),
          _(
            'Har du kjøpt billett på forhånd, må du ha kjøpt og startet billetten før du går om bord.',
            'If you have purchased a ticket in advance, you must have bought and activated the ticket before boarding.',
            'Har du kjøpt billett på førehand, må du ha kjøpt og starta billetten før du går om bord.',
          ),
          _(
            'Har du ikke gyldig billett for reiser, vil du få gebyr ved billettkontroll.',
            'If you do not have a valid ticket for the journey, you will receive a fine during the ticket inspection.',
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
          'Har du fått gebyr etter billettkontroll?',
          'Have you received a fine after a ticket inspection?',
          'Har du fått gebyr etter billettkontroll?',
        ),
        info: _(
          'Har du krav på rabatt men har fått gebyr fordi du ikke kunne framvise gyldig legitimasjon, kan du få redusert gebyret ditt til 200 kroner ved å sende oss dokumentasjon på at du har rett på rabatt.',
          'If you are entitled to a discount but have been charged a fee because you could not present valid identification, you can have your fee reduced to 200 kroner by sending us documentation that you are eligible for the discount.',
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
      title: _(
        'Informasjon fra gebyret',
        'Information from the fee',
        'Informasjon frå gebyret',
      ),
      fee: {
        inputlabel: _('Gebyrnummer', 'Fee number', 'Gebyrnummar'),
        instruction: _(
          'Fyll ut gebyrnummeret ditt',
          'Enter your fee number',
          'Fyll ut gebyrnummaret ditt',
        ),
        errorMessage: _(
          'Fyll ut gebyrnummeret ditt',
          'Enter your fee number',
          'Fyll ut gebyrnummaret ditt',
        ),
      },
      ticketStorage: {
        question: _(
          'Hvor pleier du å ha billetten din?',
          'Where do you usually keep your ticket?',
          'Kor pleier du å ha billetten din?',
        ),
        app: {
          title: _('App', 'App', 'App'),
          registeredMobile: {
            label: _(
              'Registrert mobilnummer',
              'Registered mobile number',
              'Registrert mobilnummar',
            ),
            errorMessage: _(
              'Legg til registrert mobilnummer',
              'Legg til registered mobile number',
              'Legg til registrert mobilnummar',
            ),
          },
          customerNumber: {
            label: _('Kundenummer', 'Customer number', 'Kundenummar'),
            errorMessage: _(
              'Fyll inn kundenummer',
              'Enter customer number',
              'Fyll inn kundenummar',
            ),
          },
        },
        travelcard: {
          title: _('Reisekort', 'Travelcard', 'Reisekort'),
          errorMessage: _(
            'Legg til reisekort',
            'Enter travelcard number',
            'Legg til reisekort',
          ),
        },
        errorMessage: _(
          'Velg billettoppbevaring',
          'Select ticket storage mode',
          'Velg billettoppbevaring',
        ),
      },
    },

    postponePayment: {
      title: _('Utsette betaling ', 'Postpone payment', 'Utsette betaling'),
      info: _(
        'Når du fyller ut skjemaet, blir betalingsfristen utsett med 30 dager fra opprinnelig forfallsdato, dvs. totalt 60 dagers betalingsfrist. Du velger selv om du vil dele opp betalingen og gjøre flere innbetalinger i løpet av denne perioden eller betale hele beløpet på en gang',
        'When you fill out the form, the payment deadline is extended by 30 days from the original due date, giving you a total payment deadline of 60 days. You can choose whether to divide the payment and make multiple installments during this period or pay the full amount at once',
        'Når du fyller ut skjemaet, blir betalingsfristen utsett med 30 dagar frå opphaveleg forfallsdato, dvs. totalt 60 dagars betalingsfrist. Du vel sjølv om du vil dele opp betalinga og gjere fleire innbetalingar i løpet av denne perioden eller betale heile beløpet på ein gong',
      ),

      fee: {
        inputlabel: _('Gebyrnummer', 'Fee number', 'Gebyrnummar'),
        description: _(
          'Gebyrnummeret har fire siffer. Du finner det øverst i høyre hjørne på gebyret',
          'The fee number has four digits. You can find it in the top right corner of the fee',
          'Gebyrnummeret har fire siffer. Du finn det øvst i høgre hjørne på gebyret',
        ),
        instruction: _(
          'Fyll ut gebyrnummeret ditt',
          'Enter your fee number',
          'Fyll ut gebyrnummaret ditt',
        ),
        errorMessage: _(
          'Fyll ut gebyrnummeret ditt',
          'Enter your fee number',
          'Fyll ut gebyrnummaret ditt',
        ),
      },

      invoiceNumber: {
        inputlabel: _('Fakturanummer', 'Invoice number', 'Fakturanummar'),
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
        errorMessage: _(
          'Fyll ut fakturanummeret ditt',
          'Enter your invoice number',
          'Fyll ut fakturanummaret ditt',
        ),
      },
    },

    feedback: {
      title: _(
        'Tilbakemelding billettkontroll ',
        'Feedback on ticket control',
        'Tilbakemelding billettkontroll ',
      ),
      info: _(
        'Har du tilbakemelding på en bestemt billettkontroll, trenger vi en beskrivelse av hvor og når billettkontrollen fant sted for å kunne gå videre med saken. Hvis du har en generell tilbakemelding, kan du hoppe over de første punktene.',
        'If you have feedback regarding a specific ticket inspection, we need a description of where and when the ticket inspection took place in order to proceed with the matter. If you have general feedback, you can skip the initial points.',
        'Har du tilbakemelding på ein bestemt billettkontroll, treng vi ei beskriving av kor og kva tid billettkontrollen var for å kunne gå vidare med saka. Har du ei generell tilbakemelding, kan du hoppe over dei første punkta.',
      ),
      locationQuestion: _(
        'Hvor var billettkontrollen?',
        'Where was the ticket control conducted?',
        'Kor var billettkontrollen?',
      ),
      transportMode: {
        label: _('Reisemåte', 'Transport mode', 'Reisemåte'),
        optionLabel: _(
          'Velg reisemåte',
          'Select transport mode',
          'Velg reisemåte',
        ),
        errorMessage: _(
          'Velg reisemåte',
          'Select transport mode',
          'Velg reisemåte',
        ),
      },
      line: {
        label: _('Linje', 'Line', 'Linje'),
        optionLabel: _('Velg linje', 'Choose line', 'Velg linje'),
        errorMessage: _('Velg linje', 'Select line', 'Velg linje'),
      },
      departureLocation: {
        label: _('Avreisested', 'Departure location', 'Avreisested'),
        optionLabel: _(
          'Velg avreisested',
          'Select departure loation',
          'Velg avreisested',
        ),
        errorMessage: _(
          'Velg avreisested',
          'Select departure loation',
          'Velg avreisested',
        ),
      },
      arrivalLocation: {
        label: _('Ankomststed', 'Arrival location', 'Ankomststed'),
        optionLabel: _(
          'Velg anskomststed',
          'Select arrival location',
          'Velg ankomststed',
        ),
        errorMessage: _(
          'Velg anskomststed',
          'Select arrival location',
          'Velg ankomststed',
        ),
      },
      date: _('Dato', 'Date', 'Dato'),
      departureTime: _('Avgangstid', 'Departure time', 'Avgangstid'),
    },
  },
  travelGuarantee: {
    title: _('Reisegaranti', 'Travel guarantee', 'Reisegaranti'),
  },
  modeOfTransport: {
    title: _(
      'Transportmiddel og stoppested',
      'Means of transport and stopping place',
      'Transportmiddel og stoppested',
    ),
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
  feedback: {
    question: _(
      'Hva ønsker du å fortelle oss?',
      'What do you want to tell us?',
      'Kva ønskjer du å fortelje oss?',
    ),
    errorMessage: _(
      'Tilbakemelding mangler!',
      'Feedback is missing!',
      'Tilbakemelding mangler!',
    ),
    attatchment: _('Vedlegg', 'Attatchment', 'Vedlegg'),
  },
  aboutYouInfo: {
    title: _(
      'Informasjon om deg',
      'Information about you',
      'Informasjon om deg',
    ),

    firstname: _(
      'Fornavn og mellomnavn',
      'First name and middle name',
      'Fornamn og mellomnamn',
    ),
    lastname: _('Etternavn', 'Lastname', 'Etternamn'),
    address: _('Adresse', 'Address', 'Adresse'),
    postalCode: _('Postnummer', 'Postal code', 'Postnummar'),
    city: _('Bosted', 'City', 'Bustad'),
    email: _('E-post', 'Email', 'E-post'),
    phonenumber: _('Mobil', 'Mobile', 'Mobil'),
    bankAccount: {
      label: _('Bankkontonummer', 'Bank account number', 'Bankkontonummar'),
      checkbox: _(
        'Jeg har et utenlandsk bankkontonummer',
        'I have a foreign bank account',
        'Eg har eit utanlandsk bankkontonummar',
      ),
      iban: _('IBAN', 'IBAN', 'IBAN'),
      swift: _('SWIFT ', 'SWIFT ', 'SWIFT '),
      errorMessageBankAccount: _(
        'Vennligst fyll ut ditt bankkontonummer',
        'Please provide your bank account',
        'Vennligst fyll ut ditt bankkontonummar',
      ),
    },
    errorMessage: _(
      'Vennligst fyll ut informasjon om deg',
      'Please provide your information',
      'Vennligst fyll ut din informasjon',
    ),
  },
  submit: _('Send', 'Submit', 'Send'),
};
