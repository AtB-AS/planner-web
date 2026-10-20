import {
  T,
  richTranslation as _rich,
  translation as _,
} from '@mrfylke/contact-form';

export const CompanyText = {
  title: _('Bedrift', 'Company', 'Bedrift'),
  category: {
    title: _(
      'Hva gjelder henvendelsen?',
      'What is your inquiry about?',
      'Kva gjeld førespurnaden?',
    ),
    order: _('Bestilling', 'Order', 'Bestilling'),
    other: _('Annet', 'Other', 'Anna'),
  },
  order: {
    examples: _('Eksempler:', 'Examples:', 'Døme:'),
    orderTickets: _(
      'Bestille billetter',
      'Order tickets',
      'Bestille billettar',
    ),
    orderTravelCardsHref: _('https://www.atb.no/bestill-tkort/'),
    orderTravelCards: _(
      `Bestille nye ${T.travelCard.plural}`,
      `Order new ${T.travelCard.plural}`,
      `Bestille nye ${T.travelCard.plural}`,
    ),
    info: _rich(
      `Ved bestilling av periodebilletter må du oppgi startdato for billetten.\n\nHvis dere ønsker nye ${T.travelCard.plural} tilsendt i posten, må leveringsadresse oppgis i bestillingen.\n\nKlippekortprodukt er gyldig i 1 år fra påfyllingsdato. Etter denne perioden kan gjenværende klipp ikke brukes og blir ikke refundert. Selve ${T.travelCard.definite} påvirkes ikke av utløpsdatoen.`,
      `When ordering period tickets, you must specify the start date of the ticket.\n\nIf you want new ${T.travelCard.plural} sent by post, a delivery address must be included in the order.\n\nCarnet products are valid for 1 year from the top-up date. After this period, remaining clips cannot be used and will not be refunded. ${T.travelCard.Definite} itself is not affected by the expiry date.`,
      `Ved bestilling av periodebillettar må du oppgi startdato for billetten.\n\nViss de ønskjer nye ${T.travelCard.plural} tilsende i posten, må leveringsadresse oppgjevast i bestillinga.\n\nKlippekortprodukt er gyldig i 1 år frå påfyllingsdato. Etter denne perioden kan attverande klipp ikkje brukast og blir ikkje refunderte. Sjølve ${T.travelCard.definite} blir ikkje påverka av utløpsdatoen.`,
    ),
    companyName: _('Firmanavn', 'Company name', 'Firmanamn'),
    organizationNumber: _(
      'Organisasjonsnummer',
      'Organization number',
      'Organisasjonsnummer',
    ),
    invoiceAddress: _('Fakturaadresse', 'Invoice address', 'Fakturaadresse'),
    contactPerson: _('Kontaktperson', 'Contact person', 'Kontaktperson'),
    description: _(
      'Beskrivelse av bestilling',
      'Order description',
      'Bestilling',
    ),
    travelCardNumber: _(
      `${T.travelCardNumber.Base} (valgfritt)`,
      `${T.travelCardNumber.Base} (optional)`,
      `${T.travelCardNumber.Base} (valfritt)`,
    ),
    travelCardNumberInfo: _(
      `For påfyll av eksisterende ${T.travelCard.base}, skriv inn fullt ${T.travelCardNumber.base} uten mellomrom. Eks: 1616000120333228 eller 1616006082212111.`,
      `To top up an existing ${T.travelCard.base}, enter the full ${T.travelCardNumber.base} without spaces. E.g. 1616000120333228 or 1616006082212111.`,
      `For påfyll av eksisterande ${T.travelCard.base}, skriv inn fullt ${T.travelCardNumber.base} utan mellomrom. Døme: 1616000120333228 eller 1616006082212111.`,
    ),
    removeTravelCard: _('Fjern', 'Remove', 'Fjern'),
    addTravelCard: _(
      `Legg til ${T.travelCard.base}`,
      `Add ${T.travelCard.base}`,
      `Legg til ${T.travelCard.base}`,
    ),
  },
  other: {
    info: _(
      'Har du generelle spørsmål for bedrift?',
      'Do you have general questions as a company?',
      'Har du generelle spørsmål for bedrift?',
    ),
    company: _('Firma', 'Company', 'Firma'),
  },
  attachmentLabel: _('Vedlegg', 'Attachments', 'Vedlegg'),
  attachment: _('Legg ved filer', 'Attach files', 'Legg ved filer'),
  errors: {
    required: _(
      'Feltet må fylles ut',
      'This field is required',
      'Feltet må fyllast ut',
    ),
    travelCardNumber: _(
      `${T.travelCardNumber.Definite} må bestå av 16 siffer`,
      `${T.travelCardNumber.Definite} must be 16 digits`,
      `${T.travelCardNumber.Definite} må bestå av 16 siffer`,
    ),
  },
};
