import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { SectionCard } from '../components/section-card';
import { Input } from '../components/input';
import style from '../contact.module.css';
import { RadioInput } from '../components/input/radio';

type FormSelectorProps = {
  state: any;
  send: any;
};

export const FormSelector = ({ state, send }: FormSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div>
      {!state.context.isIntialAgreementChecked && (
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
          <ul className={style.rules__list}>
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
            checked={state.context.isChecked}
            onChange={() => send({ type: 'TOGGLE' })}
          />
        </SectionCard>
      )}

      {state.context.isIntialAgreementChecked && (
        <SectionCard title={PageText.Contact.travelGuarantee.title}>
          <ul>
            <RadioInput
              label={t(
                PageText.Contact.travelGuarantee.subPageTitles.refundTaxi,
              )}
              checked={state.hasTag('taxi')}
              onChange={() => send({ type: 'TAXI' })}
            />
            <RadioInput
              label={t(
                PageText.Contact.travelGuarantee.subPageTitles.refundCar,
              )}
              checked={state.hasTag('car')}
              onChange={() => send({ type: 'CAR' })}
            />
            <RadioInput
              label={t(
                PageText.Contact.travelGuarantee.subPageTitles
                  .refundOtherPublicTransport,
              )}
              checked={state.hasTag('other')}
              onChange={() => send({ type: 'OTHER' })}
            />
          </ul>
        </SectionCard>
      )}
    </div>
  );
};

export default FormSelector;
