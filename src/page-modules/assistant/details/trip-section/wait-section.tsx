import { Typo } from '@atb/components/typography';
import { useTransportationThemeColor } from '@atb/modules/transport-mode';
import { DecorationLine, TripRow } from '@atb/modules/trip-details';
import { PageText, useTranslation } from '@atb/translations';
import { secondsToDuration } from '@atb/utils/date';
import style from './trip-section.module.css';
import { ColorIcon, MonoIcon } from '@atb/components/icon';
import { MessageBox } from '@atb/modules/situations';

export type WaitSectionProps = {
  waitTimeInSeconds: number;
};

export default function WaitSection({ waitTimeInSeconds }: WaitSectionProps) {
  const { t, language } = useTranslation();
  const unknownTransportationColor = useTransportationThemeColor({
    mode: 'unknown',
    subMode: undefined,
  });
  const waitTime = secondsToDuration(waitTimeInSeconds, language);
  const shortWait = waitTimeInSeconds <= 180;

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
