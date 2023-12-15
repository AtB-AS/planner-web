import { MapWithHeader } from '@atb/components/map';
import {
  DepartureData,
  Quay,
  Departure,
} from '@atb/page-modules/departures/server/journey-planner';
import style from './stop-place.module.css';
import { ColorIcon, MonoIcon } from '@atb/components/icon';
import {
  formatLocaleTime,
  formatSimpleTime,
  formatToClockOrRelativeMinutes,
  isInPast,
  secondsBetween,
} from '@atb/utils/date';
import { PageText, useTranslation } from '@atb/translations';
import dictionary from '@atb/translations/dictionary';
import Link from 'next/link';
import { Typo } from '@atb/components/typography';
import { useState } from 'react';
import { and, andIf } from '@atb/utils/css';
import { useRouter } from 'next/router';
import { Departures } from '@atb/translations/pages';
import { nextDepartures } from '../client';
import { Button } from '@atb/components/button';
import LineChip from '@atb/components/line-chip';
import {
  SituationMessageBox,
  SituationOrNoticeIcon,
} from '@atb/modules/situations';
import { screenReaderPause } from '@atb/components/typography/utils';

export type StopPlaceProps = {
  departures: DepartureData;
};
export function StopPlace({ departures }: StopPlaceProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isHoveringRefreshButton, setIsHoveringRefreshButton] = useState(false);
  return (
    <section className={style.stopPlaceContainer}>
      <div className={style.quaysContainer}>
        <Link
          href={router.asPath}
          className={style.refreshButtonLink}
          onMouseEnter={() => setIsHoveringRefreshButton(true)}
          onMouseLeave={() => setIsHoveringRefreshButton(false)}
        >
          <Typo.span textType="body__primary">
            {t(PageText.Departures.stopPlace.quaySection.refreshButton)}
          </Typo.span>
          <MonoIcon
            icon={'actions/ArrowsCounterClockwise'}
            interactiveColor="interactive_1"
            interactiveState={isHoveringRefreshButton ? 'hover' : undefined}
          />
        </Link>
        {departures.quays.map((quay) => (
          <EstimatedCallList key={quay.id} quay={quay} />
        ))}
      </div>
      <div className={style.mapContainer}>
        <MapWithHeader
          name={departures.stopPlace.name}
          position={departures.stopPlace.position}
          layer="venue"
          onSelectStopPlace={(id) => router.push(`/departures/${id}`)}
          transportModes={departures.stopPlace.transportMode}
        />
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
    const data = await nextDepartures(quay.id, date.toISOString());

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
          {quay.situations.length > 0 &&
            quay.situations.map((situation) => (
              <li key={situation.id}>
                <SituationMessageBox
                  situation={situation}
                  borderRadius={false}
                />
              </li>
            ))}
          {departures.length > 0 ? (
            <>
              {departures.map((departure) => (
                <EstimatedCallItem
                  key={departure.id}
                  departure={departure}
                  quayId={quay.id}
                />
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
  quayId: string;
  departure: Departure;
};

export function EstimatedCallItem({
  quayId,
  departure,
}: EstimatedCallItemProps) {
  return (
    <li>
      <Link
        className={style.listItem}
        href={`details/${departure.id}?date=${departure.date}&fromQuayId=${quayId}`}
      >
        <div className={style.transportInfo}>
          {(departure.transportMode || departure.publicCode) && (
            <>
              {departure.cancelled ? (
                <ColorIcon
                  icon="status/Error"
                  className={style.situationIcon}
                />
              ) : (
                <SituationOrNoticeIcon
                  situations={departure.situations}
                  notices={departure.notices}
                  className={style.situationIcon}
                />
              )}

              <LineChip
                transportMode={departure.transportMode || 'unknown'}
                publicCode={departure.publicCode}
                transportSubmode={departure.transportSubmode}
              />
            </>
          )}

          <p>{departure.name}</p>
        </div>

        <DepartureTime
          cancelled={departure.cancelled}
          expectedDepartureTime={departure.expectedDepartureTime}
          aimedDepartureTime={departure.aimedDepartureTime}
        />
      </Link>
    </li>
  );
}

type DepartureTimeProps = {
  expectedDepartureTime: string;
  aimedDepartureTime: string;
  cancelled?: boolean;
};
export function DepartureTime({
  expectedDepartureTime,
  aimedDepartureTime,
  cancelled = false,
}: DepartureTimeProps) {
  const { t, language } = useTranslation();

  return (
    <div className={style.departureTime}>
      <Typo.p
        textType="body__primary--bold"
        className={cancelled ? style.departureTime__cancelled : ''}
        aria-label={
          cancelled
            ? `${screenReaderPause} ${t(
                PageText.Departures.stopPlace.quaySection.cancelled,
              )}`
            : ''
        }
      >
        {isInPast(expectedDepartureTime)
          ? formatSimpleTime(expectedDepartureTime)
          : formatToClockOrRelativeMinutes(
              expectedDepartureTime,
              language,
              t(dictionary.date.units.now),
            )}
      </Typo.p>
      {isMoreThanOneMinuteDelayed(
        expectedDepartureTime,
        aimedDepartureTime,
      ) && (
        <Typo.span
          textType="body__tertiary--strike"
          aria-label={
            t(dictionary.a11yRouteTimePrefix) +
            formatLocaleTime(aimedDepartureTime, language)
          }
        >
          {formatLocaleTime(aimedDepartureTime, language)}
        </Typo.span>
      )}
    </div>
  );
}

const isMoreThanOneMinuteDelayed = (
  aimedDepartureTime: string,
  expectedDepartureTime: string,
) => secondsBetween(expectedDepartureTime, aimedDepartureTime) >= 60;
