import {
  ModuleText,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import { fromLocalTimeToCET, setTimezone } from '@atb/utils/date';
import { format, isFuture, isToday, subDays } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { CSSProperties, useState } from 'react';
import { SEARCH_MODES, SearchMode, SearchTime } from '../types';
import DateSelector from './date-selector';
import style from './selector.module.css';
import TimeSelector from './time-selector';

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
  const initialDate = setTimezone(
    'dateTime' in initialState
      ? new Date(fromLocalTimeToCET(initialState.dateTime))
      : new Date(),
  ) as Date;

  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState(() =>
    format(initialDate, 'HH:mm'),
  );

  const [isTimeUpdated, setTimeUpdated] = useState<boolean>(false);

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
      dateTime: setTimezone(new Date()).getTime(),
    };
    setSelectedTime(() => format(newState.dateTime, 'HH:mm'));
    setSelectedMode(newState);
    onChange(newState);
  };

  const resetToCurrentDate = () => {
    const newState = {
      mode: selectedMode.mode,
      dateTime: setTimezone(new Date()).getTime(),
    };
    setSelectedDate(new Date(newState.dateTime));
    setSelectedMode(newState);
    onChange(newState);
  };

  const internalOnDateChange = (date: string) => {
    if (!date) return;

    if (date < yesterday) {
      resetToCurrentDate();
      resetToCurrentTime();
      return;
    }

    const newDate = new Date(date);
    // resets time to early morning when moving away from today
    // does not reset time when the date is already in the future
    const newTime =
      isToday(selectedDate) && isFuture(newDate) && !isTimeUpdated
        ? '06:00'
        : selectedTime;

    setSelectedDate(newDate);
    setSelectedTime(newTime);

    onChange({
      mode: selectedMode.mode,
      dateTime: new Date(date + 'T' + newTime).getTime(),
    });
  };

  const internalOnTimeChange = (time: string) => {
    if (!time) return;

    setSelectedTime(time);

    onChange({
      mode: selectedMode.mode,
      dateTime: new Date(
        selectedDate.toISOString().slice(0, 10) + 'T' + time,
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
          <label
            key={state}
            className={style.option}
            data-testid={'searchTimeSelector-' + state}
          >
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
                <span className={style.option__selected} />
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
              <DateSelector
                min={yesterday}
                value={selectedDate}
                onChange={internalOnDateChange}
              />

              <TimeSelector
                selectedTime={selectedTime}
                onChange={internalOnTimeChange}
                onValueChanged={setTimeUpdated}
              />
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
