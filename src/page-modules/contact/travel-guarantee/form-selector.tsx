import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { SectionCard } from '../components/section-card';
import { Input } from '../components/input';
import style from '../contact.module.css';
import { RadioInput } from '../components/input/radio';
import { Typo } from '@atb/components/typography';
import { Checkbox } from '../components/input/checkbox';

type FormSelectorProps = {
  state: any;
  send: any;
};

export const FormSelector = ({ state, send }: FormSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div>
      {!state.context.isIntialAgreementChecked && (
        <SectionCard title={t(PageText.Contact.travelGuarantee.title)}>
          <Typo.p textType="body__primary">
            {t(PageText.Contact.travelGuarantee.agreement.delayedRefundText)}
          </Typo.p>

          <Typo.p textType="body__primary">
            {t(PageText.Contact.travelGuarantee.agreement.ticketRefundText)}
          </Typo.p>

          <Typo.p textType="heading__component">
            {t(
              PageText.Contact.travelGuarantee.agreement
                .travelGuaranteeExceptions.label,
            )}
          </Typo.p>

          <Typo.p textType="body__primary">
            {t(
              PageText.Contact.travelGuarantee.agreement
                .travelGuaranteeExceptions.minimumTimeToNextDeparture,
            )}
          </Typo.p>

          <Typo.p textType="body__primary">
            {t(
              PageText.Contact.travelGuarantee.agreement
                .travelGuaranteeExceptions.externalFactors,
            )}
          </Typo.p>
          <ul className={style.rules__list}>
            {PageText.Contact.travelGuarantee.agreement.travelGuaranteeExceptions.examples.map(
              (example: TranslatedString, index: number) => (
                <li key={index}>
                  <Typo.p textType="body__primary">{t(example)}</Typo.p>
                </li>
              ),
            )}
          </ul>

          <Typo.p textType="body__primary">
            {t(
              PageText.Contact.travelGuarantee.agreement
                .travelGuaranteeExceptions.exclusion,
            )}
          </Typo.p>

          <Checkbox
            label={t(
              PageText.Contact.ticketControl.feeComplaint.firstAgreement
                .checkbox,
            )}
            checked={state.context.isIntialAgreementChecked}
            onChange={() =>
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'isIntialAgreementChecked',
                value: !state.context.isIntialAgreementChecked,
              })
            }
          />
        </SectionCard>
      )}

      {state.context.isIntialAgreementChecked && (
        <SectionCard title={t(PageText.Contact.travelGuarantee.title)}>
          <ul>
            <RadioInput
              label={t(
                PageText.Contact.travelGuarantee.subPageTitles.refundTaxi
                  .description,
              )}
              checked={state.hasTag('taxi')}
              onChange={() => send({ type: 'TAXI' })}
            />
            <RadioInput
              label={t(
                PageText.Contact.travelGuarantee.subPageTitles.refundCar
                  .description,
              )}
              checked={state.hasTag('car')}
              onChange={() => send({ type: 'CAR' })}
            />
            <RadioInput
              label={t(
                PageText.Contact.travelGuarantee.subPageTitles
                  .refundOtherPublicTransport.description,
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
