import { ChangeEvent, CSSProperties, useState } from 'react';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ModuleText,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import { SEARCH_MODES, SearchMode, SearchTime } from '../types';
import style from './selector.module.css';
import { setTimezoneIfNeeded } from '@atb/utils/date';

type SearchTimeSelectorProps = {
  onChange: (state: SearchTime) => void;
  initialState?: SearchTime;
  options?: SearchMode[];
};

export default function SearchTimeSelector({
  onChange,
  initialState = { mode: 'now' },
  options = SEARCH_MODES,
}: SearchTimeSelectorProps) {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState<SearchTime>(initialState);
  const initialDate = setTimezoneIfNeeded(
    'dateTime' in initialState ? new Date(initialState.dateTime) : new Date(),
  ) as Date;

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState(() =>
    format(initialDate, 'HH:mm'),
  );

  const internalOnStateChange = (state: SearchMode) => {
    const newState =
      state === 'now'
        ? {
            mode: state,
          }
        : {
            mode: state,
            dateTime: new Date(
              selectedDate.toISOString().slice(0, 10) + 'T' + selectedTime,
            ).getTime(),
          };

    setSelectedMode(newState);
    onChange(newState);
  };

  const resetToCurrentTime = () => {
    const newState = {
      mode: selectedMode.mode,
      dateTime: setTimezoneIfNeeded(new Date()).getTime(),
    };
    setSelectedTime(() => format(newState.dateTime, 'HH:mm'));
    setSelectedMode(newState);
    onChange(newState);
  };

  const resetToCurrentDate = () => {
    const newState = {
      mode: selectedMode.mode,
      dateTime: setTimezoneIfNeeded(new Date()).getTime(),
    };
    setSelectedDate(new Date(newState.dateTime));
    setSelectedMode(newState);
    onChange(newState);
  };

  const isPastDate = (selectedDate: string) => {
    const today = new Date().toISOString().split('T')[0];

    // If reselecting from (selectedYear < current year) to current year, the date will automatically be reset to the current date.
    if (selectedDate.substring(0, 4) < initialDate.getFullYear().toString()) {
      resetToCurrentDate();
    }

    // To ensure that the time is not past whenever reselecting back the current date.
    if (selectedDate <= today) resetToCurrentTime();
    return selectedDate < today;
  };

  const internalOnDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;
    if (isPastDate(event.target.value)) return;

    setSelectedDate(new Date(event.target.value));

    onChange({
      mode: selectedMode.mode,
      dateTime: new Date(event.target.value + 'T' + selectedTime).getTime(),
    });
  };

  const internalOnTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;

    setSelectedTime(event.target.value);

    onChange({
      mode: selectedMode.mode,
      dateTime: new Date(
        selectedDate.toISOString().slice(0, 10) + 'T' + event.target.value,
      ).getTime(),
    });
  };

  return (
    <div className={style.departureDateSelector}>
      <div
        className={style.options}
        style={{ '--number-of-options': options.length } as CSSProperties}
      >
        {options.map((state) => (
          <label key={state} className={style.option}>
            <input
              type="radio"
              name="searchTimeSelector"
              value={state}
              checked={selectedMode.mode === state}
              onChange={() => internalOnStateChange(state)}
              aria-label={stateToLabel(state, t)}
              className={style.option__input}
            />

            <span className={style.option__label}>
              {selectedMode.mode === state && (
                <motion.span
                  layoutId="searchTimeSelector"
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
        {selectedMode.mode !== 'now' && (
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
                <label htmlFor="searchTimeSelector-date">
                  {t(ModuleText.SearchTime.date)}
                </label>
                <input
                  type="date"
                  id="searchTimeSelector-date"
                  value={selectedDate.toISOString().slice(0, 10)}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={internalOnDateChange}
                />
              </div>
              <div className={style.timeSelector}>
                <label htmlFor="searchTimeSelector-time">
                  {t(ModuleText.SearchTime.time)}
                </label>

                <input
                  type="time"
                  id="searchTimeSelector-time"
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

function stateToLabel(state: SearchMode, t: TranslateFunction): string {
  switch (state) {
    case 'now':
      return t(ModuleText.SearchTime.now);
    case 'arriveBy':
      return t(ModuleText.SearchTime.arrival);
    case 'departBy':
      return t(ModuleText.SearchTime.departure);
  }
}
