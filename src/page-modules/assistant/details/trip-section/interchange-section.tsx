import { useTransportationThemeColor } from '@atb/modules/transport-mode';
import { DecorationLine, TripRow } from '@atb/modules/trip-details';
import { MonoIcon } from '@atb/components/icon';
import { MessageBox } from '@atb/components/message-box';
import { TripPatternWithDetails } from '../../server/journey-planner/validators';
import { getPlaceName } from '../utils';
import { PageText, useTranslation } from '@atb/translations';

import style from './trip-section.module.css';

export type InterchangeDetails = {
  publicCode: string;
  fromPlace: string;
};

export type InterchangeSectionProps = {
  interchangeDetails: InterchangeDetails;
  publicCode?: string | null;
};

export function InterchangeSection({
  interchangeDetails,
  publicCode,
}: InterchangeSectionProps) {
  const { t } = useTranslation();
  const unknownTransportationColor = useTransportationThemeColor({
    transportMode: 'unknown',
    transportSubModes: undefined,
  });
  return (
    <div className={style.rowContainer}>
      <DecorationLine color={unknownTransportationColor.backgroundColor} />
      <TripRow rowLabel={<MonoIcon icon="actions/Interchange" />}>
        <MessageBox
          noStatusIcon
          type="info"
          message={
            publicCode
              ? t(
                  PageText.Assistant.details.tripSection.interchange(
                    publicCode,
                    interchangeDetails.publicCode,
                    interchangeDetails.fromPlace,
                  ),
                )
              : t(
                  PageText.Assistant.details.tripSection.interchangeWithUnknownFromPublicCode(
                    interchangeDetails.publicCode,
                    interchangeDetails.fromPlace,
                  ),
                )
          }
        />
      </TripRow>
    </div>
  );
}

export function getInterchangeDetails(
  legs: TripPatternWithDetails['legs'],
  id: string | undefined,
): InterchangeDetails | undefined {
  if (!id) return undefined;
  const interchangeLeg = legs.find(
    (leg) => leg.line && leg.serviceJourney?.id === id,
  );

  if (interchangeLeg?.line?.publicCode) {
    return {
      publicCode: interchangeLeg.line.publicCode,
      fromPlace: getPlaceName(
        interchangeLeg.fromPlace.name,
        interchangeLeg.fromPlace.quay?.name,
        interchangeLeg.fromPlace.quay?.publicCode,
      ),
    };
  }
  return undefined;
}
