import { PageText, useTranslation } from '@atb/translations';
import { formatToClock } from '@atb/utils/date';
import { Typo } from '@atb/components/typography';
import { getTimeRepresentationType } from '@atb/modules/time-representation';
import style from './departure-time.module.css';

type DepartureTimeProps = {
  aimedDepartureTime: string;
  expectedDepartureTime: string;
  realtime: boolean;
};

export default function DepartureTime({
  aimedDepartureTime,
  expectedDepartureTime,
  realtime,
}: DepartureTimeProps) {
  const { t, language } = useTranslation();

  const representationType = getTimeRepresentationType({
    aimedTime: aimedDepartureTime,
    expectedTime: expectedDepartureTime,
    missingRealTime: !realtime,
  });
  const scheduled = formatToClock(aimedDepartureTime, language, 'floor');

  const expected = expectedDepartureTime
    ? formatToClock(expectedDepartureTime, language, 'floor')
    : '';

  switch (representationType) {
    case 'significant-difference': {
      return (
        <div className={style.significantDifferenceContainer}>
          <div className={style.significantDifference}>
            <Typo.p
              textType="body__primary"
              aria-label={`${t(
                PageText.Departures.details.time.expectedPrefix,
              )} ${expected}`}
            >
              {expected}
            </Typo.p>
          </div>
          <Typo.p
            textType="body__tertiary"
            color="secondary"
            aria-label={`${t(
              PageText.Departures.details.time.aimedPrefix,
            )} ${scheduled}`}
            style={{ textDecorationLine: 'line-through' }}
          >
            {scheduled}
          </Typo.p>
        </div>
      );
    }
    case 'no-realtime': {
      return <Typo.p textType="body__primary">{scheduled}</Typo.p>;
    }
    default: {
      return (
        <div className={style.expectedContainer}>
          <Typo.p textType="body__primary">{expected}</Typo.p>
        </div>
      );
    }
  }
}
