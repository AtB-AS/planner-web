import { formatLocaleTime, secondsToDuration } from '@atb/utils/date';
import { type TripPattern } from '@atb/page-modules/assistant/server/journey-planner/validators';
import style from './trip-pattern.module.css';
import { ComponentText, useTranslation } from '@atb/translations';
import { Typo } from '@atb/components/typography';
import { motion } from 'framer-motion';
import { Button } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import { TransportIconWithLabel } from '@atb/components/transport-mode/transport-icon';

type TripPatternProps = {
  tripPattern: TripPattern;
  index: number;
};
export function TripPattern({ tripPattern, index }: TripPatternProps) {
  const { t, language } = useTranslation();

  const duration = secondsToDuration(tripPattern.duration, language);
  const fromPlace = tripPattern.legs[0].fromPlace.name ?? '';

  return (
    <motion.div
      className={style.tripPattern}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{
        delay: index * 0.1, // staggerChildren on parent only works first render
      }}
    >
      <header className={style.header}>
        <Typo.span textType="body__secondary--bold">
          {t(ComponentText.TripPattern.busFrom)} {fromPlace}
        </Typo.span>
        <Typo.span
          textType="body__secondary"
          className={style.header__duration}
        >
          {duration}
        </Typo.span>
      </header>

      <div className={style.legs}>
        {tripPattern.legs.map((leg, i) => (
          <div
            key={`leg-${leg.expectedStartTime}-${i}`}
            className={style.legs__leg}
          >
            <div className={style.legs__leg__icon}>
              {leg.mode ? (
                <TransportIconWithLabel
                  mode={{ mode: leg.mode }}
                  label={leg.line?.publicCode}
                />
              ) : (
                <div className={style.legs__leg__walkIcon}>
                  <MonoIcon icon={'transportation/Walk'} />
                </div>
              )}
            </div>

            <Typo.span textType="body__tertiary">
              {formatLocaleTime(tripPattern.expectedEndTime, language)}
            </Typo.span>
          </div>
        ))}

        <div className={style.legs__lastLeg}>
          <div className={style.legs__lastLeg__line}></div>
          <div className={style.legs__lastLeg__destination}>
            <div className={style.legs__lastLeg__destination__icon}>
              <MonoIcon icon={'places/Destination'} />
            </div>
            <Typo.span textType="body__tertiary">
              {formatLocaleTime(tripPattern.expectedEndTime, language)}
            </Typo.span>
          </div>
        </div>
      </div>

      <footer className={style.footer}>
        <Button
          title={t(ComponentText.TripPattern.details)}
          size="compact" // TODO: no padding with this size, should there be some? Makes hover look weird.
          icon={{ right: <MonoIcon icon={'navigation/ArrowRight'} /> }}
          onClick={() => {
            alert('TODO: Implement details for trip pattern');
          }}
        />
      </footer>
    </motion.div>
  );
}
