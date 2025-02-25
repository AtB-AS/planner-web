import Downshift, { type A11yStatusMessageOptions } from 'downshift';
import { ReactNode, useState } from 'react';
import { useAutocomplete } from '@atb/page-modules/departures/client';
import style from './search.module.css';
import VenueIcon from '@atb/components/venue-icon';
import { andIf } from '@atb/utils/css';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { logSpecificEvent } from '@atb/modules/firebase';
import { ComponentText, useTranslation } from '@atb/translations';
import useLocalStorage from '@atb/utils/use-localstorage';
import { Typo } from '../typography';

type SearchProps = {
  label: string;
  placeholder: string;
  onChange: (selection: GeocoderFeature) => void;
  button?: ReactNode;
  initialFeature?: GeocoderFeature;
  selectedItem?: GeocoderFeature;
  autocompleteFocusPoint?: GeocoderFeature;
  testID?: string;
};

export default function Search({
  label,
  placeholder,
  onChange,
  button,
  initialFeature,
  selectedItem,
  autocompleteFocusPoint,
  testID,
}: SearchProps) {
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const { data } = useAutocomplete(query, autocompleteFocusPoint);
  const { t } = useTranslation();
  const [recentFeatureSearches, setRecentFeatureSearches] = useLocalStorage<
    GeocoderFeature[]
  >('recentFeatureSearches', []);

  function getA11yStatusMessage({
    isOpen,
    resultCount,
    previousResultCount,
  }: A11yStatusMessageOptions<GeocoderFeature>) {
    if (!isOpen) {
      return '';
    }

    if (!resultCount) {
      return t(ComponentText.SearchInput.noResults);
    }

    if (resultCount !== previousResultCount) {
      return t(ComponentText.SearchInput.results(resultCount));
    }

    return '';
  }

  const handleOnChange = (feature: GeocoderFeature | null) => {
    if (!feature) return;
    // Add to recent searches, or move to top of list if already in list
    setRecentFeatureSearches([
      feature,
      ...recentFeatureSearches.filter((f) => f.id !== feature.id).splice(0, 4),
    ]);
    onChange(feature);
  };

  return (
    <Downshift<GeocoderFeature>
      onInputValueChange={(inputValue) => {
        logSpecificEvent('select_search');
        return setQuery(inputValue || '');
      }}
      onChange={handleOnChange}
      itemToString={geocoderFeatureToString}
      selectedItem={selectedItem || initialFeature || null}
      getA11yStatusMessage={getA11yStatusMessage}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        getRootProps,
      }) => (
        <div className={style.container}>
          <label className={style.label} {...getLabelProps()}>
            {label}
          </label>

          <div
            className={style.inputContainer}
            {...getRootProps({}, { suppressRefError: true })}
          >
            <input
              type="text"
              className={style.input}
              placeholder={placeholder}
              {...getInputProps()}
              data-testid={testID}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </div>

          {button ?? null}

          <ul className={style.menu} {...getMenuProps()}>
            {isOpen &&
              inputValue !== '' &&
              data?.map((item, index) => (
                <li
                  className={andIf({
                    [style.item]: true,
                    [style.itemHighlighted]: highlightedIndex === index,
                  })}
                  key={item.id}
                  {...getItemProps({
                    index,
                    item,
                  })}
                  data-testid={`list-item-${index}`}
                >
                  <div className={style.itemIcon} aria-hidden>
                    <VenueIcon categories={item.category} />
                  </div>
                  <span className={style.itemName}>{item.name}</span>
                  <span className={style.itemLocality}>{item.locality}</span>
                </li>
              ))}
            {focus && inputValue === '' && (
              <>
                {recentFeatureSearches.length > 0 && (
                  <li className={style.item}>
                    <Typo.span
                      textType="body__secondary"
                      className={style.menuHeading}
                    >
                      {t(ComponentText.SearchInput.recentSearches)}
                    </Typo.span>
                  </li>
                )}
                {recentFeatureSearches.map((item, index) => (
                  <li
                    className={andIf({
                      [style.item]: true,
                      [style.itemHighlighted]: highlightedIndex === index,
                    })}
                    key={item.id}
                    {...getItemProps({
                      index,
                      item,
                    })}
                    data-testid={`list-item-${index}`}
                  >
                    <div className={style.itemIcon} aria-hidden>
                      <VenueIcon categories={item.category} />
                    </div>
                    <span className={style.itemName}>{item.name}</span>
                    <span className={style.itemLocality}>{item.locality}</span>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      )}
    </Downshift>
  );
}

function geocoderFeatureToString(
  feature: GeocoderFeature | null | undefined,
): string {
  return feature
    ? `${feature.name}${feature.locality ? ', ' + feature.locality : ''}`
    : '';
}
