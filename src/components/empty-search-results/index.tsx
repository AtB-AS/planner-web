import { Image } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import style from './empty-search-results.module.css';

export type EmptySearchResultsProps = {
  title: string;
  details: string;
};

export default function EmptySearchResults({
  title,
  details,
}: EmptySearchResultsProps) {
  return (
    <div className={style.container}>
      <div>
        <Image image="OnBehalfOf" alt="" width="113" />
      </div>
      <div className={style.text}>
        <Typo.h3 textType="body__primary--bold">{title}</Typo.h3>
        <Typo.span textType="body__secondary">{details}</Typo.span>
      </div>
    </div>
  );
}
