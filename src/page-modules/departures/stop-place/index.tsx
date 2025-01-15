import { Button } from '@atb/components/button';
import { DepartureTime } from '@atb/components/departure-time';
import { ColorIcon, MonoIcon } from '@atb/components/icon';
import LineChip from '@atb/components/line-chip';
import { MapWithHeader } from '@atb/components/map';
import {
  OpenGraphDescription,
  OpenGraphImage,
} from '@atb/components/open-graph';
import ScreenReaderOnly from '@atb/components/screen-reader-only';
import { Typo } from '@atb/components/typography';
import {
  isSituationValidAtDate,
  SituationMessageBox,
  SituationOrNoticeIcon,
} from '@atb/modules/situations';
import {
  Departure,
  DepartureData,
  Quay,
} from '@atb/page-modules/departures/server/journey-planner';
import { PageText, useTranslation } from '@atb/translations';
import { Departures } from '@atb/translations/pages';
import { and, andIf } from '@atb/utils/css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { nextDepartures } from '../client';
import style from './stop-place.module.css';
import { formatDestinationDisplay } from '../utils';
import { useTheme } from '@atb/modules/theme';
import { formatQuayName } from '@atb/page-modules/departures/details/utils';

export type StopPlaceProps = {
  departures: DepartureData;
};

export function StopPlace({ departures }: StopPlaceProps) {
  const { t } = useTranslation();
  const {
    color: { interactive },
  } = useTheme();
  const router = useRouter();
  const [isHoveringRefreshButton, setIsHoveringRefreshButton] = useState(false);

  return (
    <section className={style.stopPlaceContainer}>
      <OpenGraphImage
        image={`api/departures/og-departure?stopPlaceId=${departures.stopPlace.id}`}
      />

      {/* Hard coded to norwegian as this should be the default for sharing links where
      we dont know what language to show. */}
      <OpenGraphDescription
        description={`Sanntidsoversikt over alle avganger og holdeplasser fra ${departures.stopPlace.name}.`}
      />

      <ScreenReaderOnly
        text={t(PageText.Departures.stopPlace.quaySection.resultsLoaded)}
        role="status"
      />

      <div className={style.quaysContainer}>
        <button
          onClick={() => router.reload()}
          className={style.refreshButton}
          onMouseEnter={() => setIsHoveringRefreshButton(true)}
          onMouseLeave={() => setIsHoveringRefreshButton(false)}
        >
          <Typo.span textType="body__primary">
            {t(PageText.Departures.stopPlace.quaySection.refreshButton)}
          </Typo.span>
          <MonoIcon
            icon={'actions/ArrowsCounterClockwise'}
            interactiveColor={interactive[1]}
            interactiveState={isHoveringRefreshButton ? 'hover' : undefined}
          />
        </button>
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
            {formatQuayName(t, quay.name, quay.publicCode)}
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
            quay.situations
              .filter(isSituationValidAtDate(new Date()))
              .map((situation) => (
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
  const { t } = useTranslation();
  const lineName = formatDestinationDisplay(t, departure.destinationDisplay);
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

          <Typo.p
            className={departure.cancelled ? style.textColor__secondary : ''}
            textType={
              departure.cancelled ? 'body__primary--strike' : 'body__primary'
            }
          >
            {lineName}
          </Typo.p>
        </div>

        <DepartureTime
          cancelled={departure.cancelled}
          expectedDepartureTime={departure.expectedDepartureTime}
          aimedDepartureTime={departure.aimedDepartureTime}
          relativeTime
          realtime={departure.realtime}
          withRealtimeIndicator
        />
      </Link>
    </li>
  );
}
