import { ChangeEvent, useState } from 'react';
import style from './departure-date-selector.module.css';
import { ComponentText, Language, useTranslation } from '@atb/translations';
import { TFunc } from '@leile/lobo-t';

export enum DepartureDateState {
  Now = 'now',
  Arrival = 'arrival',
  Departure = 'departure',
}

type DepartureDateSelectorProps = {
  initialState?: DepartureDateState;
  onStateChange?: (state: DepartureDateState) => void;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
};

export default function DepartureDateSelector({
  initialState = DepartureDateState.Now,
  onDateChange,
  onTimeChange,
}: DepartureDateSelectorProps) {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] =
    useState<DepartureDateState>(initialState);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  });

  const internalOnDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value));
    onDateChange(new Date(event.target.value));
  };

  const internalOnTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
    onTimeChange(event.target.value);
  };

  return (
    <div className={style.departureDateSelector}>
      <div className={style.options}>
        {Object.values(DepartureDateState).map((state) => (
          <div key={state} className={style.option}>
            <label>
              <input
                type="radio"
                name="departureDateSelector"
                value={state}
                checked={selectedOption === state}
                onChange={() => setSelectedOption(state)}
                aria-label={stateToLabel(state, t)}
              />
              <span aria-hidden>{stateToLabel(state, t)}</span>
            </label>
          </div>
        ))}
      </div>

      {selectedOption !== DepartureDateState.Now && (
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
      )}
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
