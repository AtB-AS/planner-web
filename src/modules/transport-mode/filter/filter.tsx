import { getTextForLanguage } from '@atb/translations/utils';
import { useTranslation, ComponentText } from '@atb/translations';
import style from './filter.module.css';
import { ColorIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import { TransportIcon } from '../icon';
import { TransportModeFilterOptionType } from '@atb-as/config-specs';
import { ChangeEventHandler, useState } from 'react';
import { getOrgData } from '@atb/modules/org-data';

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
  const isFlexibleTransportEnabled = false; //remove when AtB-bestill will be enabled in tripPatterns

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
      <Typo.h3 textType="body__m" className={style.heading}>
        {t(ComponentText.TransportModeFilter.label)}
      </Typo.h3>

      <ul className={style.filter}>
        <li
          className={[style.transportMode, style.allTransportModes].join(' ')}
        >
          <div className={style.transportModeContainer}>
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
                onChangeWrapper(
                  event.target.checked ? data?.map((option) => option.id) : [],
                );
              }}
            />

            <label
              htmlFor="all"
              aria-hidden
              className={style.transportModeElement}
            >
              <CheckBoxIcon
                checked={
                  !localFilterState || localFilterState.length === data.length
                }
              />

              <span>{t(ComponentText.TransportModeFilter.all)}</span>
            </label>
          </div>
        </li>

        {data
          .filter((option) =>
            isFlexibleTransportEnabled
              ? true
              : option.id !== 'flexibleTransport',
          )
          .map((option) => {
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
                  <Typo.p textType="body__xs" className={style.infoText}>
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
    <div className={style.transportModeContainer}>
      <input
        type="checkbox"
        id={option.id}
        name={option.id}
        value={option.id}
        checked={checked}
        onChange={onChange}
        aria-labelledby={`label-${option.id}`}
      />

      <label
        htmlFor={option.id}
        aria-hidden
        className={style.transportModeElement}
      >
        <CheckBoxIcon checked={checked} />

        <TransportIcon
          mode={{
            transportMode: option.icon.transportMode,
            transportSubModes: option.icon?.transportSubMode
              ? [option.icon.transportSubMode]
              : [],
          }}
          isFlexible={option.id == 'flexibleTransport'}
          size="small"
        />
        <span id={`label-${option.id}`}>{text}</span>
      </label>
    </div>
  );
}

function CheckBoxIcon({ checked }: { checked: boolean }) {
  return checked ? (
    <ColorIcon icon="input/CheckboxChecked" />
  ) : (
    <ColorIcon icon="input/CheckboxUnchecked" />
  );
}
