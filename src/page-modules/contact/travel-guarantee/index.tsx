import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { fetchMachine, FormType } from './travelGuaranteeFormMachine';
import { FormEventHandler, useState } from 'react';
import { Button } from '@atb/components/button';
import RefundTaxiForm from './forms/refundTaxiForm';
import RefundCarForm from './forms/refundCarForm';
import style from '../contact.module.css';
import { Typo } from '@atb/components/typography';
import { SectionCard, Radio, Checkbox } from '../components';
import Link from 'next/link';

const TravelGuaranteeContent = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(fetchMachine);

  // Local state to force re-render to display errors.
  const [forceRerender, setForceRerender] = useState(false);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    send({ type: 'VALIDATE' });

    // Force a re-render with dummy state.
    if (Object.keys(state.context.errorMessages).length > 0) {
      setForceRerender(!forceRerender);
    }
  };

  return (
    <form onSubmit={onSubmit} className={style.form}>
      <SectionCard title={t(PageText.Contact.travelGuarantee.title)}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.travelGuarantee.agreement.delayedRefundText)}
        </Typo.p>

        <Typo.p textType="body__primary">
          {t(PageText.Contact.travelGuarantee.agreement.ticketRefundText)}
        </Typo.p>

        <Typo.p textType="heading__component">
          {t(
            PageText.Contact.travelGuarantee.agreement.travelGuaranteeExceptions
              .label,
          )}
        </Typo.p>

        <ul className={style.rules__list}>
          {PageText.Contact.travelGuarantee.agreement.travelGuaranteeExceptions.exceptions.map(
            (exception, index) => (
              <li key={index}>
                <Typo.p textType="body__primary">{t(exception.text)}</Typo.p>
                {exception.examples.length > 0 && (
                  <ul className={style.rules__list}>
                    {exception.examples.map(
                      (example: TranslatedString, exampleIndex: number) => (
                        <li key={exampleIndex}>
                          <Typo.p textType="body__primary">{t(example)}</Typo.p>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </li>
            ),
          )}
        </ul>

        <Typo.p textType="body__primary">
          {t(
            PageText.Contact.travelGuarantee.agreement.travelGuaranteeExceptions
              .exclusion,
          )}{' '}
          <Link
            href={t(
              PageText.Contact.travelGuarantee.agreement
                .travelGuaranteeExceptions.link.href,
            )}
          >
            {t(
              PageText.Contact.travelGuarantee.agreement
                .travelGuaranteeExceptions.link.text,
            )}
          </Link>
        </Typo.p>

        <Checkbox
          label={t(
            PageText.Contact.ticketControl.feeComplaint.firstAgreement.checkbox,
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

      {state.context.isIntialAgreementChecked && (
        <SectionCard title={t(PageText.Contact.ticketControl.title)}>
          <ul className={style.form_options__list}>
            {Object.values(FormType).map((formType) => (
              <li key={formType}>
                <Radio
                  label={t(
                    PageText.Contact.travelGuarantee[formType].description,
                  )}
                  value={formType}
                  checked={state.context.formType === formType}
                  onChange={(e) => {
                    send({
                      type: 'ON_INPUT_CHANGE',
                      inputName: 'formType',
                      value: e.target.value,
                    });
                  }}
                />
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
      {state.context.formType === 'refundTaxi' && (
        <RefundTaxiForm state={state} send={send} />
      )}
      {state.context.formType === 'refundCar' && (
        <RefundCarForm state={state} send={send} />
      )}

      {state.context.formType && (
        <Button
          title={t(PageText.Contact.submit)}
          mode={'interactive_0--bordered'}
          buttonProps={{ type: 'submit' }}
          state={state.matches('submitting') ? 'loading' : undefined}
          className={style.submitButton}
        />
      )}
    </form>
  );
};

export default TravelGuaranteeContent;
