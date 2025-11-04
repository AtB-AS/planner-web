import LabeledInput from '@atb/components/labled-input';
import { Typo } from '@atb/components/typography';
import { getOrgData } from '@atb/modules/org-data';
import { PageText, useTranslation } from '@atb/translations';
import { ChangeEvent, FocusEvent, useEffect, useState } from 'react';
import style from './line-filter.module.css';
import { swrFetcher } from '@atb/modules/api-browser';
import { LinesApiReturnType } from '../client';
import { isDefined, isTruthy } from '@atb/utils/presence';
import useSWRImmutable from 'swr/immutable';

type LineFilterProps = {
  filterState: string[] | null;
  onChange: (lineFilter: string[] | null) => void;
};

export default function LineFilter({ filterState, onChange }: LineFilterProps) {
  const { t } = useTranslation();

  const { authorityId } = getOrgData();

  const { data } = useSWRImmutable<LinesApiReturnType>(
    `api/assistant/lines/${authorityId}`,
    swrFetcher,
  );
  const [localFilterState, setLocalFilterState] = useState('');
  const [unknownPublicCodes, setUnknownPublicCodes] = useState<string[]>([]);

  const sanitizeInput = (input: string): string => {
    // Replace commas and spaces with a single space
    return input.replaceAll(/[, ]+/g, ' ').trim();
  };

  const onChangeWrapper = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setLocalFilterState(input);

    if (!input) {
      onChange(null);
    } else {
      const sanitizedInput = sanitizeInput(input);
      const lines = sanitizedInput
        .split(' ')
        .flatMap((line) => data?.[line] || [])
        .filter(isDefined);
      onChange(lines);
    }
  };

  const onBlurWrapper = (event: FocusEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const sanitizedInput = sanitizeInput(input);
    const lines = sanitizedInput
      .split(' ')
      .flatMap((line) => {
        const lineCode = data?.[line];
        return !lineCode ? line : null;
      })
      .filter(isTruthy);
    setUnknownPublicCodes(lines);
  };

  const mapFilterStateToLineCodes = () => {
    if (!data || !filterState) return '';
    return filterState
      .map((line) => {
        for (let id in data) {
          if (data[id]?.includes(line)) {
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
      <Typo.h3 textType="body__m" className={style.heading}>
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
        onBlur={onBlurWrapper}
        validationError={
          unknownPublicCodes.length > 0
            ? t(
                PageText.Assistant.search.lineFilter.unknownLines(
                  unknownPublicCodes,
                ),
              )
            : undefined
        }
      />

      <Typo.p textType="body__xs" className={style.infoText}>
        {t(PageText.Assistant.search.lineFilter.example)}
      </Typo.p>
    </div>
  );
}
