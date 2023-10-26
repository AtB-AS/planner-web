import Downshift from 'downshift';
import { ReactNode, useState } from 'react';
import { useAutocomplete } from '@atb/page-modules/departures/client';
import style from './search.module.css';
import VenueIcon from '@atb/components/venue-icon';
import { andIf } from '@atb/utils/css';
import { GeocoderFeature } from '@atb/page-modules/departures';

type SearchProps = {
  label: string;
  onChange: (selection: any) => void;
  button?: ReactNode;
  initialFeature?: GeocoderFeature;
  selectedItem?: GeocoderFeature;
};

export default function Search({
  label,
  onChange,
  button,
  initialFeature,
  selectedItem,
}: SearchProps) {
  const [query, setQuery] = useState('');
  const { data } = useAutocomplete(query);

  return (
    <Downshift<GeocoderFeature>
      onInputValueChange={(inputValue) => setQuery(inputValue || '')}
      onChange={onChange}
      itemToString={geocoderFeatureToString}
      selectedItem={selectedItem || initialFeature || null}
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
            <input className={style.input} {...getInputProps()} />
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
                    <VenueIcon category={item.category} />
                  </div>
                  <span className={style.itemName}>
                    {highlightSearchText(inputValue, item.name).map(
                      ({ part, highlight }) => {
                        if (!part) return null;
                        if (highlight)
                          return <span key={item.id + part}>{part}</span>;
                        else
                          return <strong key={item.id + part}>{part}</strong>;
                      },
                    )}
                  </span>
                  <span className={style.itemLocality}>{item.locality}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </Downshift>
  );
}

function highlightSearchText(input: string | null, name: string) {
  if (!input) return [{ part: name, highlight: false }];

  let startIndex = name.toLowerCase().indexOf(input.toLowerCase());

  if (startIndex !== -1) {
    let endIndex = startIndex + input.length;
    return [
      {
        part: name.substring(0, startIndex),
        highlight: false,
      },
      {
        part: name.substring(startIndex, endIndex),
        highlight: true,
      },
      {
        part: name.substring(endIndex),
        highlight: false,
      },
    ];
  } else {
    return [{ part: name, highlight: false }];
  }
}
function geocoderFeatureToString(
  feature: GeocoderFeature | null | undefined,
): string {
  return feature ? `${feature.name}, ${feature.locality}` : '';
}
