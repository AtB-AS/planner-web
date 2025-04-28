import { ButtonLink } from '@atb/components/button';
import { ColorIcon, MonoIcon } from '@atb/components/icon';
import LineChip from '@atb/components/line-chip';
import { Map } from '@atb/components/map';
import { MessageBox } from '@atb/components/message-box';
import { Typo } from '@atb/components/typography';
import { SituationMessageBox, filterNotices } from '@atb/modules/situations';
import { useRealtimeText } from '@atb/modules/trip-details';
import { PageText, useTranslation } from '@atb/translations';
import style from './details.module.css';
import { EstimatedCallRows } from './estimated-call-rows';
import { addMetadataToEstimatedCalls } from './utils';
import { formatDestinationDisplay } from '../utils';
import {
  GlobalMessageContextEnum,
  GlobalMessages,
} from '@atb/modules/global-messages';
import { ServiceJourneyType } from '@atb/page-modules/departures/types.ts';
import { useEffect } from 'react';

export type DeparturesDetailsProps = {
  fromQuayId?: string;
  serviceJourney: ServiceJourneyType;
  referer?: string;
};

export function DeparturesDetails({
  fromQuayId,
  serviceJourney,
  referer,
}: DeparturesDetailsProps) {
  const { t } = useTranslation();
  const focusedCall =
    serviceJourney.estimatedCalls.find((call) => call.quay.id === fromQuayId) ||
    serviceJourney.estimatedCalls[0];
  const title = `${serviceJourney.line.publicCode} ${formatDestinationDisplay(t, focusedCall.destinationDisplay)}`;
  const realtimeText = useRealtimeText(
    serviceJourney.estimatedCalls.map((c) => ({
      actualDepartureTime: c.actualDepartureTime,
      expectedDepartureTime: c.expectedDepartureTime,
      aimedDepartureTime: c.aimedDepartureTime,
      quayName: c.quay.name,
      realtime: c.realtime,
      cancelled: c.cancellation,
    })),
  );

  const estimatedCallsWithMetadata = addMetadataToEstimatedCalls(
    serviceJourney.estimatedCalls,
    fromQuayId,
    undefined,
  );

  const notices = getNoticesForServiceJourney(serviceJourney, fromQuayId);
  const situations = focusedCall.situations.sort((n1, n2) =>
    n1.id.localeCompare(n2.id),
  );
  const alreadyShownSituationNumbers = situations
    .map((s) => s.situationNumber)
    .filter((s): s is string => !!s);

  const backLink = referer?.includes('departures/')
    ? `/departures/${focusedCall.quay.stopPlace?.id}`
    : referer;

  return (
    <section className={style.container}>
      <div className={style.headerContainer}>
        <ButtonLink
          mode="transparent"
          href={backLink ?? '/'}
          title={
            backLink?.includes('departures/')
              ? t(PageText.Departures.details.backToDepartures)
              : t(PageText.Departures.details.backToAssistant)
          }
          icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
        />
        <div className={style.header}>
          <LineChip
            transportMode={serviceJourney.transportMode ?? 'unknown'}
            transportSubmode={serviceJourney.transportSubmode}
            publicCode={serviceJourney.line.publicCode}
          />
          <Typo.h2 textType="heading--big">{title}</Typo.h2>
        </div>
        <GlobalMessages
          context={GlobalMessageContextEnum.plannerWebDeparturesDetails}
        />
        {realtimeText && !focusedCall.cancellation && (
          <div className={style.realtimeText}>
            <ColorIcon icon="status/Realtime" size="xSmall" />
            <Typo.h3 textType="body__secondary">{realtimeText}</Typo.h3>
          </div>
        )}
      </div>

      <div className={style.mapContainer}>
        <Map
          position={
            focusedCall.quay.stopPlace?.longitude &&
            focusedCall.quay.stopPlace?.latitude
              ? {
                  lon: focusedCall.quay.stopPlace.longitude,
                  lat: focusedCall.quay.stopPlace.latitude,
                }
              : undefined
          }
          mapLegs={serviceJourney.mapLegs}
          initialZoom={13.5}
        />
      </div>

      <div className={style.serviceJourneyContainer}>
        {situations.map((situation) => (
          <SituationMessageBox
            key={`situation-${situation.id}`}
            situation={situation}
          />
        ))}
        {notices.map(
          (notice) =>
            notice.text && (
              <MessageBox
                key={`notice-${notice.id}`}
                type="info"
                message={notice.text}
              />
            ),
        )}
        <EstimatedCallRows
          calls={estimatedCallsWithMetadata}
          mode={serviceJourney.transportMode ?? 'unknown'}
          subMode={serviceJourney.transportSubmode}
          alreadyShownSituationNumbers={alreadyShownSituationNumbers}
        />
      </div>
    </section>
  );
}

export const getNoticesForServiceJourney = (
  serviceJourney: ServiceJourneyType,
  fromQuayId?: string,
) => {
  const focusedEstimatedCall =
    serviceJourney.estimatedCalls?.find(
      ({ quay }) => quay?.id && quay.id === fromQuayId,
    ) ?? serviceJourney.estimatedCalls?.[0];

  return filterNotices([
    ...serviceJourney.notices,
    ...serviceJourney.line.notices,
    ...(focusedEstimatedCall?.notices ?? []),
  ]);
};
