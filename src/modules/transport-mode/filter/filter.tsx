import { getTextForLanguage } from '@atb/translations/utils';
import { useTranslation, ComponentText } from '@atb/translations';
import style from './filter.module.css';
import { MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import { getTransportModeIcon } from '../icon';
import { TransportModeFilterOptionType } from '@atb-as/config-specs';
import { ChangeEventHandler, useState } from 'react';

type TransportModeFilterProps = {
  filterState: string[] | null;
  onChange: (transportModeFilter: string[] | null) => void;
  data?: TransportModeFilterOptionType[];
};

export default function TransportModeFilter({
  filterState,
  onChange,
  data,
}: TransportModeFilterProps) {
  const { t, language } = useTranslation();

  // Local filter state used for updating the checkbox states before the URL
  // state is updated to reflect the changed filters.
  const [localFilterState, setLocalFilterState] = useState(filterState);

  const onChangeWrapper = (transportModeFilter: string[] | null) => {
    setLocalFilterState(transportModeFilter);
    onChange(transportModeFilter);
  };

  if (!data) {
    return null;
  }

  return (
    <div>
      <Typo.p textType="body__primary--bold" className={style.heading}>
        {t(ComponentText.TransportModeFilter.label)}
      </Typo.p>

      <ul className={style.filter}>
        <li className={style.transportMode}>
          <input
            type="checkbox"
            id="all"
            name="all"
            value="all"
            aria-label={t(ComponentText.TransportModeFilter.allA11y)}
            checked={
              !localFilterState || localFilterState.length === data.length
            }
            onChange={(event) => {
              onChangeWrapper(event.target.checked ? null : []);
            }}
          />

          <label htmlFor="all" aria-hidden>
            <span>{t(ComponentText.TransportModeFilter.all)}</span>

            <div className={style.checkboxBackground}>
              <Check className={style.checkboxCheck} />
            </div>
          </label>
        </li>

        {data.map((option) => {
          return (
            <li key={option.id} className={style.transportMode}>
              <FilterCheckbox
                option={option}
                checked={
                  !localFilterState ||
                  (localFilterState?.includes(option.id) ?? false)
                }
                onChange={(event) => {
                  // No filter is applied when filterState is `null`, same
                  // as "All" being checked.
                  if (!localFilterState) {
                    // Only set the clicked filter as filter.
                    onChangeWrapper([option.id]);
                  } else {
                    if (event.target.checked) {
                      // Add the checked filter to the filter state.
                      onChangeWrapper([...localFilterState, option.id]);
                    } else {
                      // Remove the unchecked filter from the filter state.
                      onChangeWrapper(
                        localFilterState.filter((id) => id !== option.id),
                      );
                    }
                  }
                }}
              />

              {option.description && (
                <Typo.p textType="body__tertiary" className={style.infoText}>
                  {getTextForLanguage(option.description, language) ?? ''}
                </Typo.p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type FilterCheckboxProps = {
  option: TransportModeFilterOptionType;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

function FilterCheckbox({ option, checked, onChange }: FilterCheckboxProps) {
  const { language } = useTranslation();

  const text = getTextForLanguage(option.text, language);

  return (
    <div>
      <input
        type="checkbox"
        id={option.id}
        name={option.id}
        value={option.id}
        checked={checked}
        onChange={onChange}
        aria-labelledby={`label-${option.id}`}
      />

      <label htmlFor={option.id} aria-hidden>
        <MonoIcon
          icon={getTransportModeIcon({
            transportMode: option.icon?.transportMode,
            transportSubModes: option.icon?.transportSubMode
              ? [option.icon.transportSubMode]
              : undefined,
          })}
        />
        <span id={`label-${option.id}`}>{text}</span>

        <div className={style.checkboxBackground}>
          <Check className={style.checkboxCheck} />
        </div>
      </label>
    </div>
  );
}

function Check({ className }: { className: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={className}
    >
      <path
        d="M10.8979 3.77299L4.89795 9.77299C4.84569 9.82543 4.78359 9.86704 4.71522 9.89543C4.64685 9.92382 4.57354 9.93843 4.49951 9.93843C4.42548 9.93843 4.35217 9.92382 4.2838 9.89543C4.21543 9.86704 4.15333 9.82543 4.10107 9.77299L1.47607 7.14799C1.42375 7.09566 1.38224 7.03355 1.35393 6.96518C1.32561 6.89682 1.31104 6.82355 1.31104 6.74955C1.31104 6.67555 1.32561 6.60228 1.35393 6.53392C1.38224 6.46555 1.42375 6.40344 1.47607 6.35111C1.5284 6.29879 1.59051 6.25728 1.65888 6.22897C1.72724 6.20065 1.80051 6.18607 1.87451 6.18607C1.94851 6.18607 2.02178 6.20065 2.09014 6.22897C2.15851 6.25728 2.22062 6.29879 2.27295 6.35111L4.49998 8.57814L10.102 2.97705C10.2077 2.87138 10.351 2.81201 10.5004 2.81201C10.6499 2.81201 10.7932 2.87138 10.8989 2.97705C11.0046 3.08272 11.0639 3.22604 11.0639 3.37549C11.0639 3.52493 11.0046 3.66825 10.8989 3.77393L10.8979 3.77299Z"
        fill="var(--static-background-background_2-text)"
      />
    </svg>
  );
}
