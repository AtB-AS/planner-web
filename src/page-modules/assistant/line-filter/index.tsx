import LabeledInput, { LabeledInputProps } from '@atb/components/labled-input';
import { Typo } from '@atb/components/typography';
import { getOrgData } from '@atb/modules/org-data';
import { PageText, useTranslation } from '@atb/translations';
import { ChangeEvent, useEffect, useState } from 'react';
import style from './line-filter.module.css';
import useSWR from 'swr';
import { swrFetcher } from '@atb/modules/api-browser';
type LineFilterProps = {
  filterState: string[] | null;
  onChange: (lineFilter: string[] | null) => void;
};

export default function LineFilter({ filterState, onChange }: LineFilterProps) {
  const { t } = useTranslation();

  const { authorityId } = getOrgData();

  const { data } = useSWR(`api/assistant/lines/${authorityId}`, swrFetcher);
  const [localFilterState, setLocalFilterState] = useState('');

  const onChangeWrapper = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setLocalFilterState(input);

    if (!input) {
      onChange(null);
    } else {
      const lines = input
        .split(',')
        .flatMap((line) => data[line.trim()])
        .filter(Boolean);
      onChange(lines);
    }
  };

  const mapFilterStateToLineCodes = () => {
    if (!data || !filterState) return '';
    return filterState
      .map((line) => {
        for (let id in data) {
          if (data[id].includes(line)) {
            return id;
          }
        }
        return null;
      })
      .filter(Boolean)
      .join(', ');
  };

  useEffect(() => {
    setLocalFilterState(mapFilterStateToLineCodes());
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={style.container}>
      <Typo.h3 textType="body__primary--bold" className={style.heading}>
        {t(PageText.Assistant.search.lineFilter.label)}
      </Typo.h3>

      <LabeledInput
        label={t(PageText.Assistant.search.lineFilter.lineSearch.label)}
        placeholder={t(
          PageText.Assistant.search.lineFilter.lineSearch.placeholder,
        )}
        type="text"
        value={localFilterState}
        onChange={onChangeWrapper}
      />

      <Typo.p textType="body__tertiary" className={style.infoText}>
        {t(PageText.Assistant.search.lineFilter.example)}
      </Typo.p>
    </div>
  );
}
