import { ChangeEvent, useState } from 'react';
import style from './departure-date-selector.module.css';
import { ComponentText, Language, useTranslation } from '@atb/translations';
import { TFunc } from '@leile/lobo-t';
import { AnimatePresence, motion } from 'framer-motion';

export enum DepartureDateState {
  Now = 'now',
  Arrival = 'arrival',
  Departure = 'departure',
}

export type DepartureDate =
  | {
      type: DepartureDateState.Now;
    }
  | {
      type: DepartureDateState.Arrival;
      dateTime: number;
    }
  | {
      type: DepartureDateState.Departure;
      dateTime: number;
    };

type DepartureDateSelectorProps = {
  initialState?: DepartureDate;
  onChange: (state: DepartureDate) => void;
};

export default function DepartureDateSelector({
  initialState = { type: DepartureDateState.Now },
  onChange,
}: DepartureDateSelectorProps) {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] =
    useState<DepartureDate>(initialState);
  const initialDate =
    'dateTime' in initialState ? new Date(initialState.dateTime) : new Date();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState(() => {
    const hours = initialDate.getHours().toString().padStart(2, '0');
    const minutes = initialDate.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  });

  const internalOnStateChange = (state: DepartureDateState) => {
    const newState =
      state === DepartureDateState.Now
        ? {
            type: state,
          }
        : {
            type: state,
            dateTime: new Date(
              selectedDate.toISOString().slice(0, 10) + 'T' + selectedTime,
            ).getTime(),
          };

    setSelectedOption(newState);

    onChange(newState);
  };

  const internalOnDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;

    setSelectedDate(new Date(event.target.value));

    onChange({
      type: selectedOption.type,
      dateTime: new Date(event.target.value + 'T' + selectedTime).getTime(),
    });
  };

  const internalOnTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;

    setSelectedTime(event.target.value);

    onChange({
      type: selectedOption.type,
      dateTime: new Date(
        selectedDate.toISOString().slice(0, 10) + 'T' + event.target.value,
      ).getTime(),
    });
  };

  return (
    <div className={style.departureDateSelector}>
      <div className={style.options}>
        {Object.values(DepartureDateState).map((state) => (
          <label key={state} className={style.option}>
            <input
              type="radio"
              name="departureDateSelector"
              value={state}
              checked={selectedOption.type === state}
              onChange={() => internalOnStateChange(state)}
              aria-label={stateToLabel(state, t)}
              className={style.option__input}
            />

            <span aria-hidden className={style.option__label}>
              {selectedOption.type === state && (
                <motion.span
                  layoutId="departureDateSelector"
                  className={style.option__selected}
                />
              )}
              <span className={style.option__text}>
                {stateToLabel(state, t)}
              </span>
            </span>
          </label>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {selectedOption.type !== DepartureDateState.Now && (
          <motion.div
            className={style.dateAndTimeSelectorsWrapper}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className={style.dateAndTimeSelectors}>
              <div className={style.dateSelector}>
                <label htmlFor="departureDateSelector">
                  {t(ComponentText.DepartureDateSelector.date)}
                </label>
                <input
                  type="date"
                  id="departureDateSelector"
                  value={selectedDate.toISOString().slice(0, 10)}
                  onChange={internalOnDateChange}
                />
              </div>
              <div className={style.timeSelector}>
                <label htmlFor="departureTimeSelector">
                  {t(ComponentText.DepartureDateSelector.time)}
                </label>

                <input
                  type="time"
                  id="departureTimeSelector"
                  value={selectedTime}
                  onChange={internalOnTimeChange}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function stateToLabel(
  state: DepartureDateState,
  t: TFunc<typeof Language>,
): string {
  switch (state) {
    case DepartureDateState.Now:
      return t(ComponentText.DepartureDateSelector.now);
    case DepartureDateState.Arrival:
      return t(ComponentText.DepartureDateSelector.arrival);
    case DepartureDateState.Departure:
      return t(ComponentText.DepartureDateSelector.departure);
  }
}
