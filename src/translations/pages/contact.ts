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
        'Jeg har fått gebyr og ønsker å utsette betalingen',
        'I have received a fee and would like to postpone the payment',
        'Eg har fått gebyr og ønskjer å utsetje betalinga',
      ),
      refund: _(
        'Jeg har fått gebyr og ønsker å klage',
        'I have received a fee and would like to file a complaint',
        'Eg har fått gebyr og ønskjer å klage',
      ),
      feedback: _(
        'Jeg vil git en tilbakemling knyttet til billettkontroll',
        'I would like to provide feedback regarding ticket control',
        'Eg vil gi ei tilbakemelding knytt til billettkontroll',
      ),
    },

    feeComplaint: {
      info: _(
        'Viss du har fått gebyr på feil grunnlag, kan du sende oss en skriftleg klage.',
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
          'Vi har full forståing for at det kan være en ubehagelig opplevlese å få gebyr ved billettkontroll, og vi veit at de aller fleste ønsker å reise med gyldig billett.',
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
      },
      ticketStorage: {
        question: _(
          'Hvor pleier du å ha billetten din?',
          'Where do you usually keep your ticket?',
          'Kor pleier du å ha billetten din?',
        ),
        app: {
          title: _('App', 'App', 'App'),
          registeredMobile: _(
            'Registrert mobilnummer',
            'Registered mobile number',
            'Registrert mobilnummar',
          ),
          customerNumber: _('Kundenummer', 'Customer number', 'Kundenummar'),
        },
        travelcard: {
          title: _('Reisekort', 'Travelcard', 'Reisekort'),
        },
      },
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
  feedbackQuestion: _(
    'Hva ønsker du å fortelle oss?',
    'What do you want to tell us?',
    'Kva ønskjer du å fortelje oss?',
  ),
  aboutYouInfo: {
    title: _(
      'Informasjon om deg',
      'Information about you',
      'Informasjon om deg',
    ),
    firstAndMiddleName: _(
      'Fornavn og mellomnavn',
      'First name and middle name',
      'Fornamn og mellomnamn',
    ),
    surname: _('Etternavn', 'Surname', 'Etternamn'),
    address: _('Adresse', 'Address', 'Adresse'),
    postalCode: _('Postnummer', 'Postal code', 'Postnummar'),
    city: _('Bosted', 'City', 'Bustad'),
    email: _('E-post', 'Email', 'E-post'),
    mobile: _('Mobil', 'Mobile', 'Mobil'),
    bankAccount: _('Bankkontonummer', 'Bank account number', 'Bankkontonummar'),
  },
  submit: _('Send', 'Submit', 'Send'),
};
