import { getTextForLanguage } from '@atb/translations/utils';
import { useTranslation, ComponentText } from '@atb/translations';
import style from './filter.module.css';
import { MonoIcon } from '@atb/components/icon';
import { TransportModeFilterOption, TransportModeFilterState } from './types';
import { Typo } from '@atb/components/typography';
import { getTransportModeIcon } from '../icon';
import { filterOptionsWithTransportModes, setAllValues } from './utils';
import { useTheme } from '@atb/modules/theme';
import { TransportModeFilterOptionType } from '@atb-as/config-specs';
import { ChangeEventHandler, useState } from 'react';

type TransportModeFilterProps = {
  filterState: TransportModeFilterState;
  onFilterChange: (filterState: TransportModeFilterState) => void;
};

export default function TransportModeFilter({
  filterState,
  onFilterChange,
}: TransportModeFilterProps) {
  const { t, language } = useTranslation();

  return (
    <div className={style.container}>
      <ul className={style.filter}>
        <li className={style.transportMode}>
          <input
            type="checkbox"
            id="all"
            name="all"
            value="all"
            aria-label={t(ComponentText.TransportModeFilter.allA11y)}
            checked={Object.values(filterState).every(Boolean)}
            onChange={(event) => {
              onFilterChange(setAllValues(filterState, event.target.checked));
            }}
          />
          <label htmlFor="all" aria-hidden>
            {t(ComponentText.TransportModeFilter.all)}
          </label>
        </li>

        {Object.entries(filterState).map(([key, selected]) => {
          const option =
            filterOptionsWithTransportModes[key as TransportModeFilterOption];

          return (
            <li key={option.id} className={style.transportMode}>
              <FilterCheckbox
                option={option}
                checked={selected}
                onChange={(event) => {
                  onFilterChange({
                    ...filterState,
                    [key]: event.target.checked,
                  });
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
  const { isDarkMode } = useTheme();
  const [isHovering, setIsHovering] = useState(false);

  const text = getTextForLanguage(option.text, language);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
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
            mode: option.icon?.transportMode,
            subMode: option.icon?.transportSubMode,
          })}
          overrideMode={
            (checked || isHovering) && !isDarkMode ? 'light' : 'dark'
          }
        />
        <span id={`label-${option.id}`}>{text}</span>
      </label>
    </div>
  );
}
