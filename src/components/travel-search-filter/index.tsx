import { getTextForLanguage } from '@atb/translations/utils';
import { useTranslation, ComponentText } from '@atb/translations';
import style from './travel-search-filter.module.css';
import { MonoIcon } from '@atb/components/icon';
import {
  TravelSearchFilterOption,
  TravelSearchFilterState,
} from '@atb/components/travel-search-filter/types';
import { Typo } from '@atb/components/typography';
import { getTransportModeIcon } from '@atb/components/transport-mode/transport-icon';
import {
  filterOptionsWithTransportModes,
  setAllValues,
} from '@atb/components/travel-search-filter/utils';

type TravelSearchFilterProps = {
  filterState: TravelSearchFilterState;
  onFilterChange: (filterState: TravelSearchFilterState) => void;
};

export default function TravelSearchFilter({
  filterState,
  onFilterChange,
}: TravelSearchFilterProps) {
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
            aria-label={t(ComponentText.TravelSearchFilter.allA11y)}
            checked={Object.values(filterState).every(Boolean)}
            onChange={(event) => {
              onFilterChange(setAllValues(filterState, event.target.checked));
            }}
          />
          <label htmlFor="all">{t(ComponentText.TravelSearchFilter.all)}</label>
        </li>

        {Object.entries(filterState).map(([key, selected]) => {
          const option =
            filterOptionsWithTransportModes[key as TravelSearchFilterOption];

          const text = getTextForLanguage(option.text, language);

          return (
            <li key={option.id} className={style.transportMode}>
              <div>
                <input
                  type="checkbox"
                  id={option.id}
                  name={option.id}
                  value={option.id}
                  checked={selected}
                  onChange={(event) => {
                    onFilterChange({
                      ...filterState,
                      [key]: event.target.checked,
                    });
                  }}
                />
                <label htmlFor={option.id}>
                  <MonoIcon
                    icon={getTransportModeIcon({
                      mode: option.icon?.transportMode,
                      subMode: option.icon?.transportSubMode,
                    })}
                    overrideMode="dark"
                  />
                  <span>{text}</span>
                </label>
              </div>

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
