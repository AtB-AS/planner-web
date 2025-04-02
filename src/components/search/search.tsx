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
import { useGeolocation } from './use-geolocation';
import { MonoIcon } from '../icon';
import { LoadingIcon } from '../loading';

type SearchProps = {
  label: string;
  placeholder: string;
  onChange: (selection: GeocoderFeature) => void;
  onGeolocationError?: (error: string | null) => void;
  button?: ReactNode;
  initialFeature?: GeocoderFeature;
  selectedItem?: GeocoderFeature;
  autocompleteFocusPoint?: GeocoderFeature;
  onlyStopPlaces?: boolean;
  testID?: string;
};

export default function Search({
  label,
  placeholder,
  onChange,
  onGeolocationError,
  button,
  initialFeature,
  selectedItem,
  autocompleteFocusPoint,
  onlyStopPlaces = false,
  testID,
}: SearchProps) {
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const { data } = useAutocomplete(
    query,
    autocompleteFocusPoint,
    onlyStopPlaces,
  );
  const { t } = useTranslation();
  const [recentFeatureSearches, setRecentFeatureSearches] = useLocalStorage<
    GeocoderFeature[]
  >('recentFeatureSearches', []);
  const {
    getPosition,
    isLoading: isGeolocationLoading,
    isUnavailable: isGeolocationUnavailable,
    isError: isGeolocationError,
  } = useGeolocation(onChange, onGeolocationError);

  function getA11yStatusMessage({
    isOpen,
    resultCount,
    previousResultCount,
    inputValue,
  }: A11yStatusMessageOptions<GeocoderFeature | 'location'>) {
    if (focus && inputValue === '') {
      return t(
        ComponentText.SearchInput.previousResultA11yLabel(
          recentFeatureSearches.length,
        ),
      );
    }

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

  const handleOnChange = (feature: GeocoderFeature | 'location' | null) => {
    if (!feature) return;
    if (feature === 'location') {
      getPosition();
      return;
    }
    // Add to recent searches, or move to top of list if already in list
    setRecentFeatureSearches([
      feature,
      ...recentFeatureSearches.filter((f) => f.id !== feature.id).splice(0, 2),
    ]);
    onChange(feature);
  };

  return (
    <Downshift<GeocoderFeature | 'location'>
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
                  <div className={style.itemInfo}>
                    <span className={style.itemName}>{item.name}</span>
                    <span className={style.itemLocality}>{item.locality}</span>
                  </div>
                </li>
              ))}
            {focus && inputValue === '' && (
              <>
                <li
                  className={andIf({
                    [style.item]: true,
                    [style.itemHighlighted]: highlightedIndex === 0,
                  })}
                  {...getItemProps({
                    index: 0,
                    item: 'location',
                  })}
                  data-testid={`list-item-0`}
                >
                  <div className={style.itemIcon} aria-hidden>
                    {isGeolocationLoading ? (
                      <LoadingIcon />
                    ) : (
                      <MonoIcon icon="places/Location" />
                    )}
                  </div>
                  <div className={style.itemInfo}>
                    <span className={style.itemName}>
                      {isGeolocationUnavailable || isGeolocationError
                        ? t(ComponentText.SearchInput.positionNotAvailable)
                        : t(ComponentText.SearchInput.myPosition)}
                    </span>
                  </div>
                </li>
                {recentFeatureSearches.length > 0 && (
                  <li className={style.item}>
                    <span className={style.menuHeading}>
                      {t(ComponentText.SearchInput.recentSearches)}
                    </span>
                  </li>
                )}
                {recentFeatureSearches.map((item, index) => (
                  <li
                    className={andIf({
                      [style.item]: true,
                      [style.itemHighlighted]: highlightedIndex === index + 1,
                    })}
                    key={item.id}
                    {...getItemProps({
                      index: index + 1,
                      item,
                    })}
                    data-testid={`list-item-${index + 1}`}
                  >
                    <div className={style.itemIcon} aria-hidden>
                      <VenueIcon categories={item.category} />
                    </div>
                    <div className={style.itemInfo}>
                      <span className={style.itemName}>{item.name}</span>
                      <span className={style.itemLocality}>
                        {item.locality}
                      </span>
                    </div>
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
  feature: GeocoderFeature | 'location' | null | undefined,
): string {
  if (feature === 'location') {
    // Location has been selected, but it hasn't been resolved to a feature yet
    return '';
  }
  return feature
    ? `${feature.name}${feature.locality ? ', ' + feature.locality : ''}`
    : '';
}
