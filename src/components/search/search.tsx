import Downshift, { type A11yStatusMessageOptions } from 'downshift';
import { ReactNode, useState } from 'react';
import { useAutocomplete } from '@atb/page-modules/departures/client';
import style from './search.module.css';
import VenueIcon from '@atb/components/venue-icon';
import { andIf } from '@atb/utils/css';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { logSpecificEvent } from '@atb/modules/firebase';
import { ComponentText, useTranslation } from '@atb/translations';

type SearchProps = {
  label: string;
  placeholder: string;
  onChange: (selection: any) => void;
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
  const { data } = useAutocomplete(query, autocompleteFocusPoint);
  const { t } = useTranslation();

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

  return (
    <Downshift<GeocoderFeature>
      onInputValueChange={(inputValue) => {
        logSpecificEvent('select_search');
        return setQuery(inputValue || '');
      }}
      onChange={onChange}
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
            />
          </div>

          {button ?? null}

          <ul className={style.menu} {...getMenuProps()}>
            {isOpen &&
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
                >
                  <div className={style.itemIcon} aria-hidden>
                    <VenueIcon categories={item.category} />
                  </div>
                  <span className={style.itemName}>{item.name}</span>
                  <span className={style.itemLocality}>{item.locality}</span>
                </li>
              ))}
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
