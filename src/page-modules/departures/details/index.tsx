import LineChip from '@atb/components/line-chip';
import { Typo } from '@atb/components/typography';
import style from './details.module.css';
import { ButtonLink } from '@atb/components/button';
import { ColorIcon, MonoIcon } from '@atb/components/icon';
import { useRealtimeText } from './use-realtime-text';
import { addMetadataToEstimatedCalls } from './utils';
import { ServiceJourneyData } from '../server/journey-planner/validators';
import { EstimatedCallRows } from './estimated-call-rows';
import { PageText, useTranslation } from '@atb/translations';
import { Map } from '@atb/components/map';

export type DeparturesDetailsProps = {
  fromQuayId?: string;
  serviceJourney: ServiceJourneyData;
};

export function DeparturesDetails({
  fromQuayId,
  serviceJourney,
}: DeparturesDetailsProps) {
  const { t } = useTranslation();
  const focusedCall =
    serviceJourney.estimatedCalls.find((call) => call.quay.id === fromQuayId) ||
    serviceJourney.estimatedCalls[0];
  const title = `${serviceJourney.line.publicCode} ${focusedCall.destinationDisplay.frontText}`;
  const realtimeText = useRealtimeText(serviceJourney.estimatedCalls);
  const estimatedCallsWithMetadata = addMetadataToEstimatedCalls(
    serviceJourney.estimatedCalls,
    fromQuayId,
    undefined,
  );

  return (
    <section className={style.container}>
      <div className={style.headerContainer}>
        <ButtonLink
          mode="transparent"
          href={`/departures/${focusedCall.quay.stopPlace.id}`}
          title={t(PageText.Departures.details.back)}
          icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
        />
        <div className={style.header}>
          <LineChip
            transportMode={serviceJourney.transportMode}
            transportSubmode={serviceJourney.transportSubmode}
            publicCode={serviceJourney.line.publicCode}
          />
          <Typo.h2 textType="heading--big">{title}</Typo.h2>
        </div>
        {realtimeText && (
          <div className={style.realtimeText}>
            <ColorIcon icon="status/Realtime" size="small" />
            <Typo.h3 textType="body__secondary">{realtimeText}</Typo.h3>
          </div>
        )}
      </div>

      <div className={style.mapContainer}>
        <Map
          position={{
            lon: focusedCall.quay.stopPlace.longitude,
            lat: focusedCall.quay.stopPlace.latitude,
          }}
          mapLegs={serviceJourney.mapLegs}
          initialZoom={13.5}
        />
      </div>

      <div className={style.serviceJourneyContainer}>
        <EstimatedCallRows
          calls={estimatedCallsWithMetadata}
          mode={serviceJourney.transportMode}
        />
      </div>
    </section>
  );
}
