import { useTransportationThemeColor } from '@atb/modules/transport-mode';
import { DecorationLine, TripRow } from '@atb/modules/trip-details';
import { MonoIcon } from '@atb/components/icon';
import { MessageBox } from '@atb/components/message-box';
import { TripPatternWithDetails } from '../../server/journey-planner/validators';
import { getPlaceName } from '../utils';
import { PageText, useTranslation } from '@atb/translations';

import style from './trip-section.module.css';
import { secondsToDuration } from '@atb/utils/date';

export type InterchangeDetails = {
  publicCode: string;
  fromPlace: string;
};

export type InterchangeSectionProps = {
  interchangeDetails: InterchangeDetails;
  publicCode?: string | null;
  maximumWaitTime?: number;
  staySeated: boolean | undefined | null;
};

export function InterchangeSection(props: InterchangeSectionProps) {
  const { t } = useTranslation();
  const unknownTransportationColor = useTransportationThemeColor({
    transportMode: 'unknown',
    transportSubModes: undefined,
  });

  const message = useInterchangeTextTranslation(props);

  return (
    <div className={style.rowContainer}>
      <DecorationLine color={unknownTransportationColor.backgroundColor} />
      <TripRow rowLabel={<MonoIcon icon="actions/Interchange" />}>
        <MessageBox noStatusIcon type="info" message={message} />
      </TripRow>
    </div>
  );
}

function useInterchangeTextTranslation({
  publicCode,
  interchangeDetails,
  maximumWaitTime = 0,
  staySeated,
}: InterchangeSectionProps) {
  const { t, language } = useTranslation();

  // If maximum wait time is defined or over 0, append it to the message.
  const appendWaitTime = (text: string) =>
    maximumWaitTime > 0
      ? [
          text,
          t(
            PageText.Assistant.details.tripSection.interchangeMaxWait(
              secondsToDuration(maximumWaitTime, language),
            ),
          ),
        ].join(' ')
      : text;

  if (publicCode && staySeated) {
    return appendWaitTime(
      t(
        PageText.Assistant.details.tripSection.lineChangeStaySeated(
          interchangeDetails.publicCode,
          publicCode,
        ),
      ),
    );
  }
  if (publicCode) {
    return appendWaitTime(
      t(
        PageText.Assistant.details.tripSection.interchange(
          publicCode,
          interchangeDetails.publicCode,
          interchangeDetails.fromPlace,
        ),
      ),
    );
  }

  return appendWaitTime(
    t(
      PageText.Assistant.details.tripSection.interchangeWithUnknownFromPublicCode(
        interchangeDetails.publicCode,
        interchangeDetails.fromPlace,
      ),
    ),
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
