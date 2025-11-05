import style from '../../../contact.module.css';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { Typo } from '@atb/components/typography';
import { Fieldset } from '../../../components';
import Link from 'next/link';

export const OrderTravelCardForm = () => {
  const { t } = useTranslation();

  return (
    <Fieldset
      title={t(PageText.Contact.ticketing.travelCard.orderTravelCard.label)}
    >
      <ul className={style.rules__list}>
        {PageText.Contact.ticketing.travelCard.orderTravelCard.detailsList.map(
          (paragraph: TranslatedString, index: number) => (
            <li key={`info-paragraph-${index}`}>
              <Typo.p textType="body__m">{t(paragraph)}</Typo.p>
            </li>
          ),
        )}
        <li>
          {t(
            PageText.Contact.ticketing.travelCard.orderTravelCard.detailWithUrl
              .detail,
          )}{' '}
          <Link
            href={t(
              PageText.Contact.ticketing.travelCard.orderTravelCard
                .detailWithUrl.href,
            )}
          >
            {t(
              PageText.Contact.ticketing.travelCard.orderTravelCard
                .detailWithUrl.linkText,
            )}
          </Link>
          .
        </li>
      </ul>
    </Fieldset>
  );
};

export default OrderTravelCardForm;
