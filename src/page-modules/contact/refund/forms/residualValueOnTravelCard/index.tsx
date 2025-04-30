import Link from 'next/link';
import { Typo } from '@atb/components/typography';
import { PageText, useTranslation } from '@atb/translations';
import { Fieldset } from '@atb/page-modules/contact/components';

export const ResidualValueOnTravelCard = ({}) => {
  const { t } = useTranslation();
  return (
    <Fieldset
      title={t(PageText.Contact.refund.residualValueOnTravelCard.title)}
    >
      <Typo.p textType="body__primary">
        <Link
          href={t(PageText.Contact.refund.residualValueOnTravelCard.link.href)}
        >
          {t(PageText.Contact.refund.residualValueOnTravelCard.link.text)}
        </Link>
      </Typo.p>

      <Typo.p textType="body__primary">
        {t(
          PageText.Contact.refund.residualValueOnTravelCard
            .monthlyPayoutDetails,
        )}
      </Typo.p>

      <div>
        <Typo.p textType="body__primary--bold">
          {t(
            PageText.Contact.refund.residualValueOnTravelCard
              .automatedProcessNotice.note,
          )}
        </Typo.p>
        <Typo.p textType="body__primary">
          {t(
            PageText.Contact.refund.residualValueOnTravelCard
              .automatedProcessNotice.text,
          )}
        </Typo.p>
      </div>
    </Fieldset>
  );
};
