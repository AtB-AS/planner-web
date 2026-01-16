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
import {
  GlobalMessageContextEnum,
  GlobalMessages,
} from '@atb/modules/global-messages';
import {
  ExtendedDepartureQuayType,
  ExtendedDeparturesType,
  ExtendedDepartureType,
} from '@atb/page-modules/departures/types.ts';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/modules/graphql-types/journeyplanner-types_v3.generated';

export type StopPlaceProps = {
  departures: ExtendedDeparturesType;
};

export function StopPlace({ departures }: StopPlaceProps) {
  const { t } = useTranslation();
  const {
    color: { interactive },
  } = useTheme();
  const router = useRouter();
  const [isHoveringRefreshButton, setIsHoveringRefreshButton] = useState(false);

  // if the stop place contains mode === Bus, then append LocalBus into it so the header color is correct
  // this change is made, so the logic on the transport icon color assignment can be consistent with the app
  const submodes =
    departures.stopPlace.transportSubmode &&
    departures.stopPlace.transportMode?.includes(TransportMode.Bus)
      ? [...departures.stopPlace.transportSubmode, TransportSubmode.LocalBus]
      : departures.stopPlace.transportSubmode;

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

      <GlobalMessages
        className={style.stopPlaceMessages}
        context={GlobalMessageContextEnum.plannerWebDepartures}
      />
      <div className={style.quaysContainer}>
        <button
          onClick={() => router.reload()}
          className={style.refreshButton}
          onMouseEnter={() => setIsHoveringRefreshButton(true)}
          onMouseLeave={() => setIsHoveringRefreshButton(false)}
        >
          <Typo.span textType="body__m">
            {t(PageText.Departures.stopPlace.quaySection.refreshButton)}
          </Typo.span>
          <MonoIcon
            icon={'actions/ArrowsCounterClockwise'}
            interactiveColor={interactive[1]}
            interactiveState={isHoveringRefreshButton ? 'hover' : undefined}
          />
        </button>
        {departures.stopPlace.quays.map((quay) => (
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
          transportSubmodes={[TransportSubmode.LocalBus]}
        />
      </div>
    </section>
  );
}

type EstimatedCallListProps = {
  quay: ExtendedDepartureQuayType;
};

export function EstimatedCallList({ quay }: EstimatedCallListProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [departures, setDepartures] = useState<ExtendedDepartureType[]>(
    quay.estimatedCalls,
  );
  const [isFetchingDepartures, setIsFetchingDepartures] = useState(false);

  const getMoreDepartures = async () => {
    setIsFetchingDepartures(true);
    const latestDeparture = departures[departures.length - 1];

    const date = new Date(latestDeparture.aimedDepartureTime);
    const data = await nextDepartures(quay.id, date.toISOString());

    const getKey = (departure: ExtendedDepartureType) =>
      `${departure.serviceJourney.id} - ${departure.aimedDepartureTime}`;
    // Filter out departures we already have
    const filteredDepartures = data.filter(
      (departure) => !departures.find((d) => getKey(d) === getKey(departure)),
    );

    setDepartures([...departures, ...filteredDepartures]);
    setIsFetchingDepartures(false);
  };

  return (
    <div data-testid="estimatedCallsList">
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
            textType="body__s__strong"
            testID="quayName"
          >
            {formatQuayName(t, quay.name, quay.publicCode)}
          </Typo.h3>
          {quay.description && (
            <Typo.span
              className={style.textColor__secondary}
              textType="body__xs"
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
              {departures.map((departure, index) => (
                <EstimatedCallItem
                  key={departure.id}
                  departure={departure}
                  quayId={quay.id}
                  testID={`estimatedCallItem-${quay.publicCode}`}
                />
              ))}
            </>
          ) : (
            <li className={style.listItem}>
              <Typo.p textType="body__s" className={style.fontColor__secondary}>
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
  departure: ExtendedDepartureType;
  testID?: string;
};

export function EstimatedCallItem({
  quayId,
  departure,
  testID,
}: EstimatedCallItemProps) {
  const { t } = useTranslation();
  const lineName = formatDestinationDisplay(t, departure.destinationDisplay);
  return (
    <li>
      <Link
        className={style.listItem}
        href={`details/${departure.id}?date=${departure.date}&fromQuayId=${quayId}`}
        data-testid={testID}
      >
        <div className={style.transportInfo}>
          {(departure.serviceJourney.line.transportMode ||
            departure.serviceJourney.line.publicCode) && (
            <>
              {departure.cancellation ? (
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
                transportMode={
                  departure.serviceJourney.line.transportMode || 'unknown'
                }
                publicCode={departure.serviceJourney.line.publicCode}
                transportSubmode={
                  departure.serviceJourney.line.transportSubmode
                }
              />
            </>
          )}

          <Typo.p
            className={departure.cancellation ? style.textColor__secondary : ''}
            textType={departure.cancellation ? 'body__m__strike' : 'body__m'}
          >
            {lineName}
          </Typo.p>
        </div>

        <DepartureTime
          cancelled={departure.cancellation}
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
