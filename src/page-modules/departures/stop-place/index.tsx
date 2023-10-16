import { MapWithHeader } from '@atb/components/map';
import {
  DepartureData,
  Quay,
  Departure,
} from '@atb/page-modules/departures/server/journey-planner';
import style from './stop-place.module.css';
import { MonoIcon } from '@atb/components/icon';
import {
  formatLocaleTime,
  formatToClockOrRelativeMinutes,
  secondsBetween,
} from '@atb/utils/date';
import { PageText, useTranslation } from '@atb/translations';
import dictionary from '@atb/translations/dictionary';
import { TransportIcon } from '@atb/components/transport-mode';
import Link from 'next/link';
import { Typo } from '@atb/components/typography';
import { useState } from 'react';
import { and, andIf } from '@atb/utils/css';
import { useRouter } from 'next/router';
import { Departures } from '@atb/translations/pages';
import { useTransportationThemeColor } from '@atb/components/transport-mode/transport-icon';
import { nextDepartures } from '../client';
import { Button } from '@atb/components/button';
import { ButtonLink } from '@atb/components/button';

export type StopPlaceProps = {
  departures: DepartureData;
};
export function StopPlace({ departures }: StopPlaceProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isHoveringRefreshButton, setIsHoveringRefreshButton] = useState(false);
  return (
    <section className={style.stopPlaceContainer}>
      <div className={style.mapContainer}>
        <MapWithHeader
          id={departures.stopPlace.id}
          name={departures.stopPlace.name}
          position={[
            departures.stopPlace.position.lon,
            departures.stopPlace.position.lat,
          ]}
          layer="venue"
          onSelectStopPlace={(id) => router.push(`/departures/${id}`)}
          transportModes={departures.stopPlace.transportMode}
        />
      </div>
      <div className={style.quaysContainer}>
        <Link
          href={`/departures/${departures.stopPlace.id}`}
          className={style.refreshButtonLink}
          onMouseEnter={() => setIsHoveringRefreshButton(true)}
          onMouseLeave={() => setIsHoveringRefreshButton(false)}
        >
          <Typo.span textType="body__primary">
            {t(PageText.Departures.stopPlace.quaySection.refreshButton)}
          </Typo.span>
          <MonoIcon
            icon={'actions/Swap'}
            interactiveColor="interactive_1"
            interactiveState={isHoveringRefreshButton ? 'hover' : undefined}
          />
        </Link>
        {departures.quays.map((quay) => (
          <EstimatedCallList key={quay.id} quay={quay} />
        ))}
      </div>
    </section>
  );
}

type EstimatedCallListProps = {
  quay: Quay;
};

export function EstimatedCallList({ quay }: EstimatedCallListProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [departures, setDepartures] = useState<Departure[]>(quay.departures);
  const [isFetchingDepartures, setIsFetchingDepartures] =
    useState<boolean>(false);

  const getMoreDepartures = async () => {
    setIsFetchingDepartures(true);
    const latestDeparture = departures[departures.length - 1];

    const date = new Date(latestDeparture.aimedDepartureTime);
    const data = await nextDepartures(quay.id, date.toUTCString());

    const set = new Set(departures.map((departure) => departure.id));
    const filteredDepartures = data.departures.filter(
      (departure) => !set.has(departure.id),
    );

    setDepartures([...departures, ...filteredDepartures]);
    setIsFetchingDepartures(false);
  };

  return (
    <div>
      <button
        className={andIf({
          [style.listHeader]: true,
          [style['listHeader--collapsed']]: isCollapsed,
        })}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={
          isCollapsed
            ? t(Departures.stopPlace.quaySection.a11yExpand)
            : t(Departures.stopPlace.quaySection.a11yMinimize)
        }
      >
        <div className={style.flex__row}>
          <Typo.h3
            className={style.textColor__secondary}
            textType="body__secondary--bold"
          >
            {quay.publicCode
              ? [quay.name, quay.publicCode].join(' ')
              : quay.name}
          </Typo.h3>
          {quay.description && (
            <Typo.span
              className={style.textColor__secondary}
              textType="body__tertiary"
            >
              {quay.description}
            </Typo.span>
          )}
        </div>

        <MonoIcon
          icon={isCollapsed ? 'navigation/ExpandMore' : 'navigation/ExpandLess'}
        />
      </button>
      {!isCollapsed && (
        <ul>
          {departures.length > 0 ? (
            <>
              {departures.map((departure) => (
                <EstimatedCallItem key={departure.id} departure={departure} />
              ))}
            </>
          ) : (
            <li className={style.listItem}>
              <Typo.p
                textType="body__secondary"
                className={style.fontColor__secondary}
              >
                {t(PageText.Departures.stopPlace.noDepartures)}
              </Typo.p>
            </li>
          )}
          <li>
            <Button
              className={and(style.listItem, style.listItem__last)}
              aria-label={t(Departures.stopPlace.quaySection.a11yToQuayHint)}
              onClick={getMoreDepartures}
              state={isFetchingDepartures ? 'loading' : undefined}
              title={t(Departures.stopPlace.quaySection.moreDepartures)}
              icon={{ right: <MonoIcon icon={'navigation/ExpandMore'} /> }}
            />
          </li>
        </ul>
      )}
    </div>
  );
}

type EstimatedCallItemProps = {
  departure: Departure;
};

export function EstimatedCallItem({ departure }: EstimatedCallItemProps) {
  const transportationColor = useTransportationThemeColor({
    mode: departure.transportMode || 'unknown',
    subMode: departure.transportSubmode,
  });

  return (
    <li>
      <Link
        className={style.listItem}
        href={`/departures/details/${departure.id}`}
      >
        <div className={style.transportInfo}>
          {(departure.transportMode || departure.publicCode) && (
            <div
              className={style.lineChip}
              style={{
                backgroundColor: transportationColor.backgroundColor,
                color: transportationColor.textColor,
              }}
            >
              {departure.transportMode && (
                <TransportIcon
                  mode={{
                    mode: departure.transportMode,
                    subMode: departure.transportSubmode,
                  }}
                />
              )}

              <p className={style.lineChip__publicCode}>
                {departure.publicCode}
              </p>
            </div>
          )}

          <p>{departure.name}</p>
        </div>

        <DepartureTime departure={departure} />
      </Link>
    </li>
  );
}

export function DepartureTime({ departure }: EstimatedCallItemProps) {
  const { t, language } = useTranslation();
  return (
    <div className={style.departureTime}>
      <Typo.p textType="body__primary--bold">
        {formatToClockOrRelativeMinutes(
          departure.expectedDepartureTime,
          language,
          t(dictionary.date.units.now),
        )}
      </Typo.p>
      {isMoreThanOneMinuteDelayed(
        departure.expectedDepartureTime,
        departure.aimedDepartureTime,
      ) && (
        <Typo.span
          textType="body__tertiary--strike"
          aria-label={
            t(dictionary.a11yRouteTimePrefix) +
            formatLocaleTime(departure.aimedDepartureTime, language)
          }
        >
          {formatLocaleTime(departure.aimedDepartureTime, language)}
        </Typo.span>
      )}
    </div>
  );
}

const isMoreThanOneMinuteDelayed = (
  aimedDepartureTime: string,
  expectedDepartureTime: string,
) => secondsBetween(expectedDepartureTime, aimedDepartureTime) >= 60;
