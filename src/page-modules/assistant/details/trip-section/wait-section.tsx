import { Typo } from '@atb/components/typography';
import { useTransportationThemeColor } from '@atb/modules/transport-mode';
import { DecorationLine, TripRow } from '@atb/modules/trip-details';
import { PageText, useTranslation } from '@atb/translations';
import { secondsBetween, secondsToDuration } from '@atb/utils/date';
import style from './trip-section.module.css';
import { ColorIcon, MonoIcon } from '@atb/components/icon';
import { MessageBox } from '@atb/modules/situations';
import { TripPatternWithDetails } from '../../server/journey-planner/validators';

// Set number of seconds required before showing waiting indicator
const SHOW_WAIT_TIME_THRESHOLD_IN_SECONDS = 30;

// Set number of seconds required before showing short waiting indicator
const SHOW_SHORT_WAIT_TIME_THRESHOLD_IN_SECONDS = 180;

export type WaitSectionProps = {
  legWaitDetails?: LegWaitDetails;
};

export default function WaitSection({ legWaitDetails }: WaitSectionProps) {
  const { t, language } = useTranslation();
  const unknownTransportationColor = useTransportationThemeColor({
    mode: 'unknown',
    subMode: undefined,
  });

  const showWaitSection =
    legWaitDetails &&
    legWaitDetails.mustWaitForNextLeg &&
    legWaitDetails.waitTime > SHOW_WAIT_TIME_THRESHOLD_IN_SECONDS;

  if (!showWaitSection) return null;

  const waitTime = secondsToDuration(legWaitDetails.waitTime, language);
  const shortWait =
    legWaitDetails.waitTime <= SHOW_SHORT_WAIT_TIME_THRESHOLD_IN_SECONDS;

  return (
    <div className={style.rowContainer}>
      <DecorationLine
        hasStart={false}
        hasEnd={false}
        color={unknownTransportationColor.backgroundColor}
      />
      {shortWait && (
        <TripRow rowLabel={<ColorIcon icon="status/Info" size="small" />}>
          <MessageBox
            noStatusIcon
            type="info"
            message={t(PageText.Assistant.details.tripSection.wait.shortTime)}
          />
        </TripRow>
      )}
      <TripRow rowLabel={<MonoIcon icon="time/Time" />}>
        <Typo.p textType="body__secondary" className={style.waitTime}>
          {t(PageText.Assistant.details.tripSection.wait.label(waitTime))}
        </Typo.p>
      </TripRow>
    </div>
  );
}

export type LegWaitDetails = {
  waitTime: number;
  mustWaitForNextLeg: boolean;
};
export function getLegWaitDetails(
  leg: TripPatternWithDetails['legs'][0],
  nextLeg: TripPatternWithDetails['legs'][0],
): LegWaitDetails | undefined {
  if (!nextLeg) return undefined;
  const waitTime = secondsBetween(
    leg.expectedEndTime,
    nextLeg.expectedStartTime,
  );
  const mustWaitForNextLeg = waitTime > 0;

  return {
    waitTime,
    mustWaitForNextLeg,
  };
}
