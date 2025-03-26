import { translation as _ } from '@atb/translations/commons';
import { orgSpecificTranslations } from '../utils';

const AssistantInternal = {
  title: _('Planlegg reisen', 'Plan travel', 'Planlegg reisa'),
  homeLink: (name: string) =>
    _(`Tilbake til ${name}`, `Back to ${name}`, `Tilbake til ${name}`),
  shortTitle: _('Reiseplanlegger', 'Assistant', 'Reiseplanleggar'),
  search: {
    input: {
      label: _(
        'Hvor vil du reise?',
        'Where do you want to travel?',
        'Kor vil du reise?',
      ),
      from: _('Fra', 'From', 'Frå'),
      to: _('Til', 'To', 'Til'),
      via: {
        label: _(
          'Vil du reise via en mellomdestinasjon?',
          'Do you want to travel via an intermediate destination?',
          'Vil du reise via ein mellomdestinasjon?',
        ),
        description: _('Via', 'Via', 'Via'),
      },
      placeholder: _(
        'Sted eller adresse',
        'Location or address',
        'Stad eller adresse',
      ),
    },
    date: {
      label: _(
        'Når vil du reise?',
        'When do you want to travel?',
        'Når vil du reise?',
      ),
    },
    filter: {
      label: _(
        'Hva vil du reise med?',
        'How do you want to travel?',
        'Kva vil du reise med?',
      ),
    },
    lineFilter: {
      label: _(
        'Jeg reiser med linje',
        'I travel with line',
        'Eg reiser med linje',
      ),
      lineSearch: {
        label: _('Linje', 'Line', 'Linje'),
        placeholder: _('linjenummer', 'line number', 'linjenummer'),
      },
      example: _('Eksempel: 2, 10', 'Example: 2, 10', 'Eksempel: 2, 10'),
      unknownLines: (lines: string[]) =>
        _(
          `Vi finner ikke linje ${lines.join(', ')}`,
          `We couldn't find line ${lines.join(', ')}`,
          `Vi finn ikkje linje ${lines.join(', ')}`,
        ),
    },
    buttons: {
      find: {
        title: _('Finn avganger', 'Find departures', 'Finn avgangar'),
      },
      alternatives: {
        more: _('Flere valg', 'More choices', 'Fleire val'),
        less: _('Færre valg', 'Less choices', 'Færre val'),
      },
    },
  },
  trip: {
    resultsFound: _(
      'Reiseforslag funnet',
      'Trip suggestions found',
      'Reiseforslag funne',
    ),
    tripPattern: {
      travelFrom: {
        bus: (place: string) =>
          _(`Buss fra ${place}`, `Bus from ${place}`, `Buss frå ${place}`),
        coach: (place: string) =>
          _(`Buss fra ${place}`, `Coach from ${place}`, `Buss frå ${place}`),
        tram: (place: string) =>
          _(`Trikk fra ${place}`, `Tram from ${place}`, `Trikk frå ${place}`),
        metro: (place: string) =>
          _(
            `T-bane fra ${place}`,
            `Metro from ${place}`,
            `T-bane frå ${place}`,
          ),
        rail: (place: string) =>
          _(`Tog fra ${place}`, `Train from ${place}`, `Tog frå ${place}`),
        boat: (place: string) =>
          _(`Båt fra ${place}`, `Boat from ${place}`, `Båt frå ${place}`),
        ferry: (place: string) =>
          _(`Ferge fra ${place}`, `Ferry from ${place}`, `Ferje frå ${place}`),
        air: (place: string) =>
          _(`Fly fra ${place}`, `Air from ${place}`, `Fly frå ${place}`),
        bicycle: (place: string) =>
          _(`Sykkel fra ${place}`, `Bike from ${place}`, `Sykkel frå ${place}`),
        foot: (place: string) =>
          _(`Gå fra ${place}`, `Walk from ${place}`, `Gå frå ${place}`),
        unknown: (place: string) =>
          _(`Fra ${place}`, `From ${place}`, `Frå ${place}`),
        unknownPlace: _('ukjent', 'unknown', 'ukjend'),
      },
      quayPublicCodePrefix: _('', '', ''),
      details: _('Detaljer', 'Details', 'Detaljar'),
      hasSituationsTip: _(
        'Denne reisen har driftsmeldinger. Se detaljer for mer info',
        'There are service messages affecting your journey. See details for more info ',
        'Denne reisa har driftsmeldingar. Sjå detaljar for meir informasjon.',
      ),
      tripIncludesRailReplacementBus: _(
        'Reisen inkluderer buss for tog.',
        'This trip includes rail replacement bus.',
        'Reisa inkluderer buss for tog.',
      ),
      isCancelled: {
        title: _('Innstilt', 'Cancelled', 'Innstilt'),
        label: _(
          'Denne reisen er innstilt',
          'This trip is cancelled',
          'Denne reisa er innstilt',
        ),
      },
    },
    fetchMore: _(
      'Last inn flere reiseforslag',
      'Load more results',
      'Last inn fleire reiseforslag',
    ),
    disabledFetchMore: _(
      'Flere resultater er ikke tilgjengelig ved via-søk',
      'More results are not available with via search',
      'Fleire resultat er ikkje tilgjengeleg ved via-søk',
    ),
    nonTransit: {
      foot: _('Gå', 'Walk', 'Gå'),
      bicycle: _('Sykkel', 'Bike', 'Sykkel'),
      bikeRental: _('Bysykkel', 'City bike', 'Bysykkel'),
      unknown: _('Ukjent', 'Unknown', 'Ukjent'),
    },
    tripSummary: {
      passedTrip: _('Passert reise, ', 'Passed trip, ', 'Passert reise, '),
      header: {
        title: (mode: string, placeName: string) =>
          _(
            `${mode} fra ${placeName}`,
            `${mode} from ${placeName}`,
            `${mode} frå ${placeName}`,
          ),
        flexTransportTitle: (publicCode: string) =>
          _(
            `Henting med ${publicCode}`,
            `Pickup with ${publicCode}`,
            `Henting med ${publicCode}`,
          ),
        totalDuration: _('Reisetid', 'Trip duration', 'Reisetid'),
        time: (startTime: string, endTime: string) =>
          _(
            `Fra klokken ${startTime}, til klokken ${endTime}`,
            `From ${startTime}, to ${endTime}`,
            `Frå klokka ${startTime}, til klokka ${endTime}`,
          ),
      },
      hasSituationsTip: _(
        'Denne reisen har driftsmeldinger. Se detaljer for mer info',
        'There are service messages affecting your journey. See details for more info ',
        'Denne reisa har driftsmeldingar. Sjå detaljar for meir informasjon.',
      ),
      footLeg: {
        walkAndWaitLabel: (walkTime: string, waitTime: string) =>
          _(
            `Gå ${walkTime}. Vent ${waitTime}`,
            `Walk ${walkTime}. Wait ${waitTime}`,
            `Gå ${walkTime}. Vent ${waitTime}`,
          ),
        walkLabel: (time: string) =>
          _(`Gå ${time}`, `Walk ${time}`, `Gå ${time}`),
        walkToStopLabel: (distance: string, stopPlace: string) =>
          _(
            `Gå til ${stopPlace}`,
            `Walk ${distance} to ${stopPlace}`,
            `Gå ${distance} til ${stopPlace}`,
          ),
        waitLabel: (time: string) =>
          _(`Vent ${time}`, `Wait ${time}`, `Vent ${time}`),
      },
      destination: {
        a11yLabel: _('Destinasjon', 'Destination', 'Destinasjon'),
      },
      waitRow: {
        label: _('Vent', 'Wait', 'Vent'),
      },
      footer: {
        fromPlace: (place: string) =>
          _(`Fra ${place}`, `From ${place}`, `Frå ${place}`),
        fromPlaceWithTime: (place: string, time: string) =>
          _(
            `Fra ${place} ${time}`,
            `From ${place} ${time}`,
            `Frå ${place} ${time}`,
          ),
        detailsLabel: _('Detaljer', 'Details', 'Detaljar'),
        detailsHint: _(
          'Aktivér for å vise flere reisedetaljer',
          'Activate to show more trip details',
          'Trykk for meir informasjon om reisa.',
        ),
        requiresBooking: (numberOfBookingsRequired: number) => {
          if (numberOfBookingsRequired > 1) {
            return _(
              `Krever ${numberOfBookingsRequired} reservasjoner`,
              `Requires ${numberOfBookingsRequired} bookings`,
              `Krev ${numberOfBookingsRequired} reservasjonar`,
            );
          } else {
            return _(
              `Krever reservasjon`,
              `Requires booking`,
              `Krev reservasjon`,
            );
          }
        },
      },
      journeySummary: {
        resultNumber: (number: number) =>
          _(
            `Reiseresultat ${number}`,
            `Result number ${number}`,
            `Reiseresultat ${number}`,
          ),
        duration: (duration: string) =>
          _(
            `Reisetid: ${duration}`,
            `Travel time: ${duration}`,
            `Reisetid: ${duration}`,
          ),
        legsDescription: {
          footLegsOnly: _(
            'Hele reisen til fots',
            'Foot legs only',
            'Heile reisa til fots',
          ),
          noSwitching: _('Ingen bytter', 'No transfers', 'Ingen byte'),
          oneSwitch: _('Ett bytte', 'One transfer', 'Eitt byte'),
          someSwitches: (switchCount: number) =>
            _(
              `${switchCount} bytter`,
              `${switchCount} transfers`,
              `${switchCount} byte`,
            ),
        },
        prefixedLineNumber: (number: string) =>
          _(`nummer ${number}`, ` number ${number}`, `nummer ${number}`),
        totalWalkDistance: (meters: string) =>
          _(
            `Totalt ${meters} meter å gå`,
            `Total of ${meters} meters to walk`,
            `Totalt ${meters} meter å gå`,
          ),
        travelTimes: (
          startTime: string,
          endTime: string,
          duration: string,
          startTimeIsApproximation: boolean,
          endTimeIsApproximation: boolean,
        ) => {
          const circaPrefix = 'ca. ';
          const startTimeCircaPrefix = startTimeIsApproximation
            ? circaPrefix
            : '';
          const endTimeCircaPrefix = endTimeIsApproximation ? circaPrefix : '';
          const totalTimeCircaPrefix =
            startTimeIsApproximation || endTimeIsApproximation
              ? circaPrefix
              : '';
          return _(
            `Start ${startTimeCircaPrefix}klokken ${startTime}, ankomst ${endTimeCircaPrefix}klokken ${endTime}. Total reisetid ${
              totalTimeCircaPrefix + duration
            }.`,
            `Start time ${startTimeCircaPrefix + startTime}, arrival time ${
              endTimeCircaPrefix + endTime
            }. Total travel time ${totalTimeCircaPrefix + duration}`,
            `Start ${startTimeCircaPrefix}klokka ${startTime}, framkomst ${endTimeCircaPrefix}klokka ${endTime}. Total reisetid ${
              totalTimeCircaPrefix + duration
            }.`,
          );
        },
        realtime: (
          fromPlace: string,
          realtimeDepartureTime: string,
          scheduledDepartureTime: string,
        ) =>
          _(
            `Klokken ${realtimeDepartureTime} sanntid, klokken ${scheduledDepartureTime} rutetid`,
            `At ${realtimeDepartureTime} realtime, at ${scheduledDepartureTime} scheduled time`,
            `Klokka ${realtimeDepartureTime} sanntid, klokka ${scheduledDepartureTime} rutetid`,
          ),
        noRealTime: (placeName: string, aimedTime: string) =>
          _(`Klokken ${aimedTime}`, `At ${aimedTime}`, `Klokka ${aimedTime}`),
      },
    },
    emptySearchResults: {
      emptySearchResultsTitle: _(
        'Ingen kollektivreiser passer til ditt søk',
        'No public transportation routes match your search criteria',
        'Ingen kollektivreiser passar til søket ditt',
      ),
      emptySearchResultsDetails: _(
        'Prøv å justere på sted eller tidspunkt.',
        'Try adjusting your time or location input.',
        'Prøv å justere på stad eller tidspunkt.',
      ),
      emptySearchResultsDetailsWithFilters: _(
        'Prøv å justere på sted, filter eller tidspunkt.',
        'Try adjusting your time, filters or location input.',
        'Prøv å justere på stad, filter eller tidspunkt.',
      ),
    },
  },
  details: {
    errorDefault: _(
      'Vi kunne ikke oppdatere reiseforslaget ditt. Det kan hende reisen har endra seg eller er utdatert?',
      'We could not update your trip plan. Perhaps your trip has changed or timed out?',
      'Vi kunne ikkje oppdatere reiseforslaget ditt. Det kan hende reisa har endra seg eller er utdatert.',
    ),
    header: {
      backLink: _(
        'Tilbake til reiseforslag',
        'Back to travel suggestions',
        'Tilbake til reiseforslag',
      ),
      title: _('Reisedetaljer', 'Trip details', 'Reisedetaljar'),
      titleFromTo: ({
        fromName,
        toName,
      }: {
        fromName: string;
        toName: string;
      }) =>
        _(
          `${fromName}  -  ${toName}`,
          `${fromName}  -  ${toName}`,
          `${fromName}  -  ${toName}`,
        ),
      travelTime: (duration: string) =>
        _(
          `${duration} reisetid`,
          `${duration} travel time`,
          `${duration} reisetid`,
        ),
    },
    quayPublicCodePrefix: _('', '', ''),
    mapSection: {
      travelTime: (time: string) =>
        _(
          `Total reisetid: ${time}`,
          `Total trip time: ${time}`,
          `Total reisetid: ${time}`,
        ),
      walkDistance: (distance: string) =>
        _(
          `Total gangavstand: ${distance} m`,
          `Total walking distance: ${distance} m`,
          `Total gangavstand: ${distance} m`,
        ),
    },
    tripSection: {
      walk: {
        label: (duration: string) =>
          _(`Gå i ${duration}`, `Walk for ${duration}`, `Gå i ${duration}`),
      },
      shortWalk: _(
        `Gå i mindre enn ett minutt`,
        `Walk for less than a minute`,
        `Gå i mindre enn eitt minutt`,
      ),
      departureIsRailReplacementBus: _(
        'Buss for tog',
        'Rail replacement bus',
        'Buss for tog',
      ),
      interchange: (
        fromPublicCode: string,
        toPublicCode: string,
        location: string,
      ) =>
        _(
          `Korrespondanse mellom ${fromPublicCode} og ${toPublicCode} på ${location}.`,
          `Correspondance between ${fromPublicCode} and ${toPublicCode} on ${location}.`,
          `Korrespondanse mellom ${fromPublicCode} og ${toPublicCode} på ${location}.`,
        ),
      interchangeWithUnknownFromPublicCode: (
        toPublicCode: string,
        location: string,
      ) =>
        _(
          `Korrespondanse med ${toPublicCode} på ${location}.`,
          `Correspondance with ${toPublicCode} on ${location}.`,
          `Korrespondanse med ${toPublicCode} på ${location}.`,
        ),
      interchangeMaxWait: (maxWaitTime: string) =>
        _(
          `Venter inntil ${maxWaitTime}.`,
          `Waiting up to ${maxWaitTime}.`,
          `Ventar i opp til ${maxWaitTime}.`,
        ),
      wait: {
        label: (time: string) =>
          _(`Vent i ${time}`, `Wait for ${time}`, `Vent i ${time}`),
        shortTime: _('Kort byttetid', 'Short changeover time', 'Kort bytetid'),
      },
      intermediateStops: (count: number) =>
        _(
          `${count} mellomstopp`,
          count > 1
            ? `${count} intermediate stops`
            : `${count} intermediate stop`,
          `${count} mellomstopp`,
        ),
      flexibleTransport: {
        bookOnline: _(`Reserver på nett`, `Book online`, `Reserver på nett`),
        bookByPhone: (phone: string) =>
          _(
            `Reserver på tlf. ${phone}`,
            `Book by phone ${phone}`,
            `Reserver på tlf. ${phone}`,
          ),
        onDemandTransportLabel: _(
          `Bestillingstransport`,
          `On-demand transport`,
          `Bestillingstransport`,
        ),
        needsBookingAndIsAvailable: (formattedTimeForBooking: string) =>
          _(
            `Denne reisen krever reservasjon innen ${formattedTimeForBooking}.`,
            `This trip requires booking before ${formattedTimeForBooking}.`,
            `Denne reisa krev reservasjon innen ${formattedTimeForBooking}.`,
          ),
        needsBookingButIsTooEarly: (formattedTimeForBooking: string) =>
          _(
            `Denne reisen krever reservasjon og kan tidligst reserveres ${formattedTimeForBooking}.`,
            `This trip requires booking and can be booked no earlier than ${formattedTimeForBooking}.`,
            `Denne reisa krev reservasjon og kan tidlegast reserverast ${formattedTimeForBooking}.`,
          ),
        needsBookingButIsTooLate: _(
          `Denne reisen krever reservasjon. Frist for reservasjon har utløpt.`,
          `This trip requires booking. The booking deadline has expired.`,
          `Denne reisa krev reservasjon. Frist for reservasjon har utgått.`,
        ),
        needsBookingWhatIsThis: (publicCode: string) =>
          _(
            `Hva er ${publicCode}?`,
            `What is ${publicCode}?`,
            `Kva er ${publicCode}?`,
          ),
      },
      lineChangeStaySeated: (fromPublicCode: string, toPublicCode: string) =>
        _(
          `Bli sittende. Linjenummeret endres fra ${fromPublicCode} til ${toPublicCode}.`,
          `Stay seated. The line number is changing from ${fromPublicCode} to ${toPublicCode}.`,
          `Bli sittande. Linjenummeret endrar seg frå ${fromPublicCode} til ${toPublicCode}.`,
        ),
    },
    ticketBooking: {
      globalMessage: _(
        'Reisen krever billett som ikke er tilgjengelig i denne appen, eller som må kjøpes fra et annet selskap enn AtB.',
        'This journey requires a ticket that is not available from this app, or must be purchased from a provider other than AtB.',
        'Reisa krev billett som ikkje er tilgjengeleg i denne appen, eller som må kjøpast frå eit anna selskap enn AtB.',
      ),
    },
  },
};

export const Assistant = orgSpecificTranslations(AssistantInternal, {
  nfk: {
    search: {
      lineFilter: {
        example: _(
          'Eksempel: 100, 200, 300',
          'Example: 100, 200, 300',
          'Eksempel: 100, 200, 300',
        ),
      },
    },
    details: {
      ticketBooking: {
        globalMessage: _(
          'Reisen krever billett som ikke er tilgjengelig i denne appen, eller som må kjøpes fra et annet selskap enn Reis Nordland.',
          'This journey requires a ticket that is not available from this app, or must be purchased from a provider other than Nordland.',
          'Reisa krev billett som ikkje er tilgjengeleg i denne appen, eller som må kjøpast frå eit anna selskap enn Reis Nordland.',
        ),
      },
    },
  },
  fram: {
    search: {
      lineFilter: {
        example: _(
          'Eksempel: 905, 902, 901',
          'Example: 905, 902, 901',
          'Eksempel: 905, 902, 901',
        ),
      },
    },
    details: {
      ticketBooking: {
        globalMessage: _(
          'Reisen krever billett som ikke er tilgjengelig i denne appen, eller som må kjøpes fra et annet selskap enn FRAM.',
          'This journey requires a ticket that is not available from this app, or must be purchased from a provider other than FRAM.',
          'Reisa krev billett som ikkje er tilgjengeleg i denne appen, eller som må kjøpast frå eit anna selskap enn FRAM.',
        ),
      },
    },
  },
  farte: {
    search: {
      lineFilter: {
        example: _(
          'Eksempel: R1, P5, 601',
          'Example: R1, P5, 601',
          'Eksempel: R1, P5, 601',
        ),
      },
    },
    details: {
      ticketBooking: {
        globalMessage: _(
          'Reisen krever billett som ikke er tilgjengelig i denne appen, eller som må kjøpes fra et annet selskap enn Farte.',
          'This journey requires a ticket that is not available from this app, or must be purchased from a provider other than Farte.',
          'Reisa krev billett som ikkje er tilgjengeleg i denne appen, eller som må kjøpast frå eit anna selskap enn Farte.',
        ),
      },
    },
  },
  vkt: {
    search: {
      lineFilter: {
        example: _(
          'Eksempel: 03, 100, 113B',
          'Example: 03, 100, 113B',
          'Eksempel: 03, 100, 113B',
        ),
      },
    },
    details: {
      quayPublicCodePrefix: _(' - Spor ', ' - Track ', ' - Spor '),
      ticketBooking: {
        globalMessage: _(
          'Billett til denne reisen kan ikke kjøpes hos VKT. Billett må kjøpes på nettside/app til aktuelt transportselskap.',
          'Tickets for this journey cannot be purchased from VKT. Tickets must be purchased through the website/app of the relevant transport company.',
          'Billett til denne reisa kan ikkje kjøpast hos VKT. Billett må kjøpast på nettside/app til aktuelt transportselskap.',
        ),
      },
    },
    trip: {
      tripPattern: {
        quayPublicCodePrefix: _(' - Spor ', ' - Track ', ' - Spor '),
      },
    },
  },
});
