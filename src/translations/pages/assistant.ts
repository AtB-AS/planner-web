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
        'adresse, kai eller holdeplass',
        'address, quay or bus stop',
        'adresse, kai eller haldeplass',
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
      placeholder: _('linjenummer', 'line number', 'linjenummer'),
      example: _('Eksempel: 2, 10', 'Example: 2, 10', 'Eksempel: 2, 10'),
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
          noSwitching: _('Ingen bytter', 'No transfers', 'Ingen bytter'),
          oneSwitch: _('Ett bytte', 'One transfer', 'Eitt bytte'),
          someSwitches: (switchCount: number) =>
            _(
              `${switchCount} bytter`,
              `${switchCount} transfers`,
              `${switchCount} bytte`,
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
      wait: {
        label: (time: string) =>
          _(`Vent i ${time}`, `Wait for ${time}`, `Vent i ${time}`),
        shortTime: _('Kort byttetid', 'Short changeover time', 'Kort byttetid'),
      },
      intermediateStops: (count: number) =>
        _(
          `${count} mellomstopp`,
          count > 1
            ? `${count} intermediate stops`
            : `${count} intermediate stop`,
          `${count} mellomstopp`,
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
  },
});
