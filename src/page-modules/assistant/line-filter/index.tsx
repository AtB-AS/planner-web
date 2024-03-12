import { Typo } from '@atb/components/typography';
import { PageText, useTranslation } from '@atb/translations';
import { ChangeEvent, useEffect, useState } from 'react';
import style from './line-filter.module.css';
import { getOrgData } from '@atb/modules/org-data';
import LabeledInput from '@atb/components/labled-input';
import useSWR from 'swr';
type LineFilterProps = {
  filterState: string[] | null;
  onChange: (lineFilter: string[] | null) => void;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LineFilter({ filterState, onChange }: LineFilterProps) {
  const { t } = useTranslation();

  const { authorityId } = getOrgData();

  const { data, error, isLoading } = useSWR(
    `api/assistant/lines/${authorityId}`,
    fetcher,
  );

  const [localFilterState, setLocalFilterState] = useState('');
  const onChangeWrapper = (event: ChangeEvent<HTMLInputElement>) => {
    if (error || isLoading) return;
    const lineFilter = event.target.value;
    setLocalFilterState(lineFilter);
    if (!lineFilter) {
      onChange(null);
    } else {
      const publicCodes = lineFilter
        .split(',')
        .map((publicCode) => `${publicCode.trim()}`);

      const lines = publicCodes
        .map((publicCode) => data.publicCodeLineList[publicCode])
        .filter((line) => line !== undefined);

      onChange(lines);
    }
  };

  useEffect(() => {
    const mapFromLineIdToPublicCode = () => {
      if (!data) return;
      const lines =
        filterState
          ?.map((line) => data.linePublicCodeList[line])
          .filter((line, index, lines) => lines.indexOf(line) === index)
          .join(', ') ?? '';
      return lines;
    };
    const lines = mapFromLineIdToPublicCode();
    if (lines) setLocalFilterState(lines);
  }, [data]);

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
        value={localFilterState}
        onChange={onChangeWrapper}
      />

      <Typo.p textType="body__tertiary" className={style.infoText}>
        {t(PageText.Assistant.search.lineFilter.example)}
      </Typo.p>
    </div>
  );
}
