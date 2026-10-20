import {
  richTranslation as _rich,
  translation as _,
  type LostPropertyMode,
} from '@mrfylke/contact-form';

const regionalBusInfo = _rich(
  `Hittegods fra regionbuss tas hånd om av operatøren. Ta kontakt med hittegodskontoret for området du reiste i, og gi en god beskrivelse av det du har mistet.

**Trøndelag Nord**
Namsos: [477 15 974](tel:+4747715974), mandag–fredag kl. 10–14. Holmenvegen 1, 7820 Spillum
Grong: [918 78 223](tel:+4791878223), mandag–fredag kl. 09–15. Grong Godshus, Jernbanevegen 18, 7870 Grong
Kolvereid: [990 32 935](tel:+4799032935), mandag–fredag kl. 09–15. Solsida Næringsområde, 7970 Kolvereid

**Trøndelag Midt**
Steinkjer: [901 26 681](tel:+4790126681), mandag–fredag kl. 09–15. Byaveien 50, 7715 Steinkjer
Levanger: [901 17 087](tel:+4790117087), mandag–fredag kl. 09–15. Lerkendalvegen 2, 7603 Levanger
Stjørdal: [480 81 753](tel:+4748081753), mandag–fredag kl. 09–15. Sandfærhusveien 25, 7502 Stjørdal
Fosen: [901 03 876](tel:+4790103876), mandag–fredag kl. 09–15. Myrullveien 8, 7160 Bjugn

**Trøndelag Sør**
Orkanger (Kyrksæterøra, Hitra, Frøya og Støren): [468 84 503](tel:+4746884503), mandag–fredag kl. 10–13, [hittegods.sor@vy.no](mailto:hittegods.sor@vy.no). Franslykkja 9, 7300 Orkanger`,
  `Lost property from regional buses is handled by the operator. Contact the lost property office for the area you travelled in, and describe what you lost as precisely as you can.

**Trøndelag Nord**
Namsos: [477 15 974](tel:+4747715974), Monday–Friday 10:00–14:00. Holmenvegen 1, 7820 Spillum
Grong: [918 78 223](tel:+4791878223), Monday–Friday 09:00–15:00. Grong Godshus, Jernbanevegen 18, 7870 Grong
Kolvereid: [990 32 935](tel:+4799032935), Monday–Friday 09:00–15:00. Solsida Næringsområde, 7970 Kolvereid

**Trøndelag Midt**
Steinkjer: [901 26 681](tel:+4790126681), Monday–Friday 09:00–15:00. Byaveien 50, 7715 Steinkjer
Levanger: [901 17 087](tel:+4790117087), Monday–Friday 09:00–15:00. Lerkendalvegen 2, 7603 Levanger
Stjørdal: [480 81 753](tel:+4748081753), Monday–Friday 09:00–15:00. Sandfærhusveien 25, 7502 Stjørdal
Fosen: [901 03 876](tel:+4790103876), Monday–Friday 09:00–15:00. Myrullveien 8, 7160 Bjugn

**Trøndelag Sør**
Orkanger (Kyrksæterøra, Hitra, Frøya and Støren): [468 84 503](tel:+4746884503), Monday–Friday 10:00–13:00, [hittegods.sor@vy.no](mailto:hittegods.sor@vy.no). Franslykkja 9, 7300 Orkanger`,
  `Hittegods frå regionbuss blir teke hand om av operatøren. Ta kontakt med hittegodskontoret for området du reiste i, og gi ei god skildring av det du har mista.

**Trøndelag Nord**
Namsos: [477 15 974](tel:+4747715974), måndag–fredag kl. 10–14. Holmenvegen 1, 7820 Spillum
Grong: [918 78 223](tel:+4791878223), måndag–fredag kl. 09–15. Grong Godshus, Jernbanevegen 18, 7870 Grong
Kolvereid: [990 32 935](tel:+4799032935), måndag–fredag kl. 09–15. Solsida Næringsområde, 7970 Kolvereid

**Trøndelag Midt**
Steinkjer: [901 26 681](tel:+4790126681), måndag–fredag kl. 09–15. Byaveien 50, 7715 Steinkjer
Levanger: [901 17 087](tel:+4790117087), måndag–fredag kl. 09–15. Lerkendalvegen 2, 7603 Levanger
Stjørdal: [480 81 753](tel:+4748081753), måndag–fredag kl. 09–15. Sandfærhusveien 25, 7502 Stjørdal
Fosen: [901 03 876](tel:+4790103876), måndag–fredag kl. 09–15. Myrullveien 8, 7160 Bjugn

**Trøndelag Sør**
Orkanger (Kyrksæterøra, Hitra, Frøya og Støren): [468 84 503](tel:+4746884503), måndag–fredag kl. 10–13, [hittegods.sor@vy.no](mailto:hittegods.sor@vy.no). Franslykkja 9, 7300 Orkanger`,
);

const tramInfo = _rich(
  `Hittegods fra trikken (linje 9) tas hånd om av Boreal Bane. Ta kontakt på telefon eller e-post for å avtale henting.

Telefon: [994 44 789](tel:+4799444789), mandag–fredag kl. 08–16
E-post: [trafikkleder.gb@boreal.no](mailto:trafikkleder.gb@boreal.no)
Adresse: Vognhallvegen 1B, 7023 Trondheim`,
  `Lost property from the tram (line 9) is handled by Boreal Bane. Contact them by phone or email to arrange a pickup.

Phone: [994 44 789](tel:+4799444789), Monday–Friday 08:00–16:00
Email: [trafikkleder.gb@boreal.no](mailto:trafikkleder.gb@boreal.no)
Address: Vognhallvegen 1B, 7023 Trondheim`,
  `Hittegods frå trikken (linje 9) blir teke hand om av Boreal Bane. Ta kontakt på telefon eller e-post for å avtale henting.

Telefon: [994 44 789](tel:+4799444789), måndag–fredag kl. 08–16
E-post: [trafikkleder.gb@boreal.no](mailto:trafikkleder.gb@boreal.no)
Adresse: Vognhallvegen 1B, 7023 Trondheim`,
);

const expressboatInfo = _rich(
  `Hittegods fra hurtigbåt tas hånd om av operatøren for den enkelte båtruten. Telefonene på fartøyene er betjent etter rutetabellen, med mindre noe annet er oppgitt.

**Rute 800 – Norled**
MS Ekspressen: [916 81 231](tel:+4791681231)
MS Fjordprinsessen: [994 85 733](tel:+4799485733)
MS Teisten: [916 81 226](tel:+4791681226)
E-post: [post@norled.no](mailto:post@norled.no)

**Rute 805 – Norled**
MS Trondheimsfjord I: [404 48 212](tel:+4740448212)
MS Teisten: [916 81 226](tel:+4791681226)
E-post: [post@norled.no](mailto:post@norled.no)

**Rute 810 – Norled**
MS Fjordglimt: [916 81 235](tel:+4791681235)
E-post: [post@norled.no](mailto:post@norled.no)

**Rute 820 – Torghatten Midt**
Telefon: [73 89 07 00](tel:+4773890700), mandag–fredag kl. 09–15
E-post: [firmapost@torghatten-midt.no](mailto:firmapost@torghatten-midt.no)

**Rute 830 – Vidar Hop Skyssbåter**
MS Osen: [957 89 635](tel:+4795789635)

**Rute 980 – Vidar Hop Skyssbåter**
MS Namdalingen: [482 94 560](tel:+4748294560)`,
  `Lost property from express boats is handled by the operator of each boat route. The phones on board are staffed according to the timetable, unless otherwise stated.

**Route 800 – Norled**
MS Ekspressen: [916 81 231](tel:+4791681231)
MS Fjordprinsessen: [994 85 733](tel:+4799485733)
MS Teisten: [916 81 226](tel:+4791681226)
Email: [post@norled.no](mailto:post@norled.no)

**Route 805 – Norled**
MS Trondheimsfjord I: [404 48 212](tel:+4740448212)
MS Teisten: [916 81 226](tel:+4791681226)
Email: [post@norled.no](mailto:post@norled.no)

**Route 810 – Norled**
MS Fjordglimt: [916 81 235](tel:+4791681235)
Email: [post@norled.no](mailto:post@norled.no)

**Route 820 – Torghatten Midt**
Phone: [73 89 07 00](tel:+4773890700), Monday–Friday 09:00–15:00
Email: [firmapost@torghatten-midt.no](mailto:firmapost@torghatten-midt.no)

**Route 830 – Vidar Hop Skyssbåter**
MS Osen: [957 89 635](tel:+4795789635)

**Route 980 – Vidar Hop Skyssbåter**
MS Namdalingen: [482 94 560](tel:+4748294560)`,
  `Hittegods frå hurtigbåt blir teke hand om av operatøren for den einskilde båtruta. Telefonane på fartøya er betente etter rutetabellen, med mindre noko anna er oppgitt.

**Rute 800 – Norled**
MS Ekspressen: [916 81 231](tel:+4791681231)
MS Fjordprinsessen: [994 85 733](tel:+4799485733)
MS Teisten: [916 81 226](tel:+4791681226)
E-post: [post@norled.no](mailto:post@norled.no)

**Rute 805 – Norled**
MS Trondheimsfjord I: [404 48 212](tel:+4740448212)
MS Teisten: [916 81 226](tel:+4791681226)
E-post: [post@norled.no](mailto:post@norled.no)

**Rute 810 – Norled**
MS Fjordglimt: [916 81 235](tel:+4791681235)
E-post: [post@norled.no](mailto:post@norled.no)

**Rute 820 – Torghatten Midt**
Telefon: [73 89 07 00](tel:+4773890700), måndag–fredag kl. 09–15
E-post: [firmapost@torghatten-midt.no](mailto:firmapost@torghatten-midt.no)

**Rute 830 – Vidar Hop Skyssbåter**
MS Osen: [957 89 635](tel:+4795789635)

**Rute 980 – Vidar Hop Skyssbåter**
MS Namdalingen: [482 94 560](tel:+4748294560)`,
);

const ferryInfo = _rich(
  `Hittegods fra ferge tas hånd om av operatøren for den enkelte fergeruten. Telefonene på fergene er betjent etter rutetabellen, med mindre noe annet er oppgitt.

**Rute 820, 825, 880, 960, 963, 965, 966 og 985 – Torghatten Midt**
Telefon: [73 89 07 00](tel:+4773890700), mandag–fredag kl. 09–15
E-post: [firmapost@torghatten-midt.no](mailto:firmapost@torghatten-midt.no)

**Rute 830 – Vidar Hop Skyssbåter**
MS Osen: [957 89 635](tel:+4795789635)

**Rute 850, 855 og 860 – Fosenlinjen**
Nidaros: [995 84 119](tel:+4799584119)
Nidaros II: [481 26 000](tel:+4748126000)
Tarva: [472 00 770](tel:+4747200770)
Hovedkontor: [72 51 32 20](tel:+4772513220), kl. 08–16

**Rute 870 – Fjord1**
MF Austrått: [415 36 306](tel:+4741536306)
MF Vestrått: [415 36 307](tel:+4741536307)

**Rute 950 – Fjord1**
MF Harøy: [916 69 328](tel:+4791669328)`,
  `Lost property from ferries is handled by the operator of each ferry route. The phones on board are staffed according to the timetable, unless otherwise stated.

**Routes 820, 825, 880, 960, 963, 965, 966 and 985 – Torghatten Midt**
Phone: [73 89 07 00](tel:+4773890700), Monday–Friday 09:00–15:00
Email: [firmapost@torghatten-midt.no](mailto:firmapost@torghatten-midt.no)

**Route 830 – Vidar Hop Skyssbåter**
MS Osen: [957 89 635](tel:+4795789635)

**Routes 850, 855 and 860 – Fosenlinjen**
Nidaros: [995 84 119](tel:+4799584119)
Nidaros II: [481 26 000](tel:+4748126000)
Tarva: [472 00 770](tel:+4747200770)
Head office: [72 51 32 20](tel:+4772513220), 08:00–16:00

**Route 870 – Fjord1**
MF Austrått: [415 36 306](tel:+4741536306)
MF Vestrått: [415 36 307](tel:+4741536307)

**Route 950 – Fjord1**
MF Harøy: [916 69 328](tel:+4791669328)`,
  `Hittegods frå ferje blir teke hand om av operatøren for den einskilde ferjeruta. Telefonane på ferjene er betente etter rutetabellen, med mindre noko anna er oppgitt.

**Rute 820, 825, 880, 960, 963, 965, 966 og 985 – Torghatten Midt**
Telefon: [73 89 07 00](tel:+4773890700), måndag–fredag kl. 09–15
E-post: [firmapost@torghatten-midt.no](mailto:firmapost@torghatten-midt.no)

**Rute 830 – Vidar Hop Skyssbåter**
MS Osen: [957 89 635](tel:+4795789635)

**Rute 850, 855 og 860 – Fosenlinjen**
Nidaros: [995 84 119](tel:+4799584119)
Nidaros II: [481 26 000](tel:+4748126000)
Tarva: [472 00 770](tel:+4747200770)
Hovudkontor: [72 51 32 20](tel:+4772513220), kl. 08–16

**Rute 870 – Fjord1**
MF Austrått: [415 36 306](tel:+4741536306)
MF Vestrått: [415 36 307](tel:+4741536307)

**Rute 950 – Fjord1**
MF Harøy: [916 69 328](tel:+4791669328)`,
);

const bestillingstransportInfo = _rich(
  `Hittegods fra bestillingstransport tas hånd om av TrønderTaxi, som er operatør.

Telefon: [07373](tel:07373) (tastevalg 2), mandag–fredag kl. 08–16
Adresse: Brøsetvegen 145B, 7048 Trondheim`,
  `Lost property from on-demand transport is handled by the operator, TrønderTaxi.

Phone: [07373](tel:07373) (press 2), Monday–Friday 08:00–16:00
Address: Brøsetvegen 145B, 7048 Trondheim`,
  `Hittegods frå bestillingstransport blir teke hand om av TrønderTaxi, som er operatør.

Telefon: [07373](tel:07373) (tastevalg 2), måndag–fredag kl. 08–16
Adresse: Brøsetvegen 145B, 7048 Trondheim`,
);

/**
 * "Bylinjer", "Nattbuss og -trikk" and "Lokal- og skolelinjer" from
 * https://www.atb.no/trondheimsomradet/ (2026-10).
 */
const cityBusLines = [
  1, 2, 3, 10, 11, 12, 13, 14, 15, 16, 18, 20, 21, 22, 23, 25, 28, 40, 41, 42,
  43, 44, 45, 46, 50, 51, 52, 53, 54, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
  80, 81, 82, 83, 85, 86, 91, 92, 101, 102, 103, 104, 105, 106, 107, 108, 109,
  110, 111, 112, 113, 114, 115, 116, 201, 202, 203, 204, 205, 206, 207, 208,
  209, 210, 211, 212, 214, 215, 216, 217, 218, 5001, 5002, 5003, 5004, 5005,
  5006, 5008, 5009, 5010, 5380,
];

/** AtB's lost property modes: only city bus submits the form. */
export const atbLostPropertyModes: LostPropertyMode[] = [
  {
    id: 'cityBus',
    label: _(
      'Bybuss (grønne busser)',
      'City bus (green buses)',
      'Bybuss (grøne bussar)',
    ),
    lines: (line) =>
      line.transportMode === 'bus' &&
      cityBusLines.includes(Number(line.publicCode)),
  },
  {
    id: 'regionalBus',
    label: _('Regionbuss', 'Regional bus', 'Regionbuss'),
    info: regionalBusInfo,
  },
  { id: 'tram', label: _('Trikk', 'Tram', 'Trikk'), info: tramInfo },
  {
    id: 'expressboat',
    label: _('Hurtigbåt', 'Express boat', 'Hurtigbåt'),
    info: expressboatInfo,
  },
  { id: 'ferry', label: _('Ferge', 'Ferry', 'Ferje'), info: ferryInfo },
  {
    id: 'bestillingstransport',
    label: _(
      'Bestillingstransport',
      'On-demand transport',
      'Bestillingstransport',
    ),
    info: bestillingstransportInfo,
  },
];
