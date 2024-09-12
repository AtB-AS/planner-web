import { PropsWithChildren, useState } from 'react';
import { SectionCard } from '../components/section-card';
import { Input } from '../components/input';
import { useRouter } from 'next/router';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import style from './layout.module.css';

export type TravelGuarenteePageLayoutProps = PropsWithChildren<{
  title: string;
}>;

function TravelGuarenteePageLayout({
  children,
}: TravelGuarenteePageLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isChecked, setChecked] = useState(false);

  const handleCheckboxToggle = () => {
    setChecked(!isChecked);
  };

  return (
    <div>
      {isChecked && (
        <SectionCard title={PageText.Contact.travelGuarantee.title}>
          <ul>
            <Input
              label={PageText.Contact.travelGuarantee.subPageTitles.refundTaxi}
              type="radio"
              checked={router.pathname.includes('/refund-taxi')}
              onChange={() =>
                router.push(
                  '/contact/travel-guarantee/refund-taxi',
                  undefined,
                  {
                    shallow: true,
                  },
                )
              }
            />
            <Input
              label={PageText.Contact.travelGuarantee.subPageTitles.refundCar}
              type="radio"
              checked={router.pathname.includes('/refund-car')}
              onChange={() =>
                router.push('/contact/travel-guarantee/refund-car', undefined, {
                  shallow: true,
                })
              }
            />
            <Input
              label={
                PageText.Contact.travelGuarantee.subPageTitles
                  .refundOtherPublicTransport
              }
              type="radio"
              checked={router.pathname.includes(
                '/refund-other-public-transport',
              )}
              onChange={() =>
                router.push(
                  '/contact/travel-guarantee/refund-other-public-transport',
                  undefined,
                  {
                    shallow: true,
                  },
                )
              }
            />
          </ul>
        </SectionCard>
      )}

      {!isChecked && (
        <SectionCard title={PageText.Contact.travelGuarantee.title}>
          <p>
            {t(
              PageText.Contact.travelGuarantee.layoutAgreement
                .delayedRefundText,
            )}
          </p>

          <p>
            {t(
              PageText.Contact.travelGuarantee.layoutAgreement.ticketRefundText,
            )}
          </p>

          <h4>
            {t(
              PageText.Contact.travelGuarantee.layoutAgreement
                .travelGuaranteeExceptions.label,
            )}
          </h4>
          <p>
            {t(
              PageText.Contact.travelGuarantee.layoutAgreement
                .travelGuaranteeExceptions.minimumTimeToNextDeparture,
            )}
          </p>

          <p>
            {t(
              PageText.Contact.travelGuarantee.layoutAgreement
                .travelGuaranteeExceptions.externalFactors,
            )}
          </p>
          <ul className={style.list}>
            {PageText.Contact.travelGuarantee.layoutAgreement.travelGuaranteeExceptions.examples.map(
              (example: TranslatedString, index: number) => (
                <li key={index}>{t(example)}</li>
              ),
            )}
          </ul>

          <p>
            {t(
              PageText.Contact.travelGuarantee.layoutAgreement
                .travelGuaranteeExceptions.exclusion,
            )}
          </p>

          <Input
            label={
              PageText.Contact.ticketControl.feeComplaint.firstAgreement
                .checkbox
            }
            type="checkbox"
            name="travelGuaranteeCheckbox"
            checked={isChecked}
            onChange={handleCheckboxToggle}
          />
        </SectionCard>
      )}

      {children}
    </div>
  );
}

export default TravelGuarenteePageLayout;
