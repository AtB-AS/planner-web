import { translation as _ } from '@atb/translations/commons';
import { TransportModeType } from '@atb/modules/transport-mode';

export const Assistant = {
  title: _('Planlegg reisen', 'Plan travel', 'Planlegg reisa'),
  shortTitle: _('Reiseplanlegger', 'Assistant', 'Reiseplanleggar'),
  search: {
    input: {
      label: _(
        'Hvor vil du reise?',
        'Where do you want to go?',
        'Kor vil du reise?',
      ),
      from: _('Fra', 'From', 'Frå'),
      to: _('Til', 'To', 'Til'),
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
    buttons: {
      find: {
        title: _('Finn avganger', 'Find departures', 'Finn avganger'),
      },
      alternatives: {
        title: _('Flere valg', 'More choices', 'Fleire val'),
      },
    },
  },
  trip: {
    tripPattern: {
      travelFrom: (mode: TransportModeType, place: string) => {
        switch (mode) {
          case 'bus':
          case 'coach':
            return _(
              `Buss fra ${place}`,
              `Bus from ${place}`,
              `Buss frå ${place}`,
            );
          case 'tram':
            return _(
              `Trikk fra ${place}`,
              `Tram from ${place}`,
              `Trikk frå ${place}`,
            );
          case 'metro':
            return _(
              `T-bane fra ${place}`,
              `Metro from ${place}`,
              `T-bane frå ${place}`,
            );
          case 'rail':
            return _(
              `Tog fra ${place}`,
              `Train from ${place}`,
              `Tog frå ${place}`,
            );
          case 'water':
            return _(
              `Båt fra ${place}`,
              `Boat from ${place}`,
              `Båt frå ${place}`,
            );
          case 'air':
            return _(
              `Fly fra ${place}`,
              `Air from ${place}`,
              `Fly frå ${place}`,
            );
          case 'bicycle':
            return _(
              `Sykkel fra ${place}`,
              `Bike from ${place}`,
              `Sykkel frå ${place}`,
            );
          case 'foot':
            return _(
              `Gå fra ${place}`,
              `Walk from ${place}`,
              `Gå frå ${place}`,
            );
          default:
            return _(`Fra ${place}`, `From ${place}`, `Frå ${place}`);
        }
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
    },
    fetchMore: _(
      'Last inn flere reiseforslag',
      'Load more results',
      'Last inn fleire reiseforslag',
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
        'Tilbake til avganger',
        'Back to departures',
        'Tilbake til avgangar',
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
          `Total gangavstand: ${distance}`,
          `Total walking distance: ${distance}`,
          `Total gangavstand: ${distance}`,
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
    },
  },
};
