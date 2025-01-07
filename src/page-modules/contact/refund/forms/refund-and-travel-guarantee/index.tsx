import style from '../../..//contact.module.css';
import { StateFrom } from 'xstate';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import {
  RefundAndTravelGuarantee,
  refundStateMachine,
} from '../../refundFormMachine';
import { RefundFormEvents } from '../../events';
import {
  Checkbox,
  SectionCard,
  Radio,
} from '@atb/page-modules/contact/components';
import { Typo } from '@atb/components/typography';
import Link from 'next/link';
import RefundTaxiForm from './refundTaxiForm';
import RefundCarForm from './refundCarForm';

type RefundAndTravelGuaranteeFormsProps = {
  state: StateFrom<typeof refundStateMachine>;
  send: (event: typeof RefundFormEvents) => void;
};

export const RefundAndTravelGuaranteeForms = ({
  state,
  send,
}: RefundAndTravelGuaranteeFormsProps) => {
  const { t } = useTranslation();
  const displayRefundTaxiForm =
    state.context.isInitialAgreementChecked &&
    state.context.formType === 'refundTaxi';
  const displayRefundCarForm =
    state.context.isInitialAgreementChecked &&
    state.context.formType === 'refundCar';

  return (
    <div>
      <SectionCard title={t(PageText.Contact.refund.agreement.title)}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.refund.agreement.delayedRefundText)}
        </Typo.p>

        <Typo.p textType="body__primary">
          {t(PageText.Contact.refund.agreement.ticketRefundText)}
        </Typo.p>

        <div>
          <Typo.p textType="heading__component">
            {t(
              PageText.Contact.refund.agreement.travelGuaranteeExceptions.label,
            )}
          </Typo.p>

          <ul className={style.rules__list}>
            {PageText.Contact.refund.agreement.travelGuaranteeExceptions.exceptions.map(
              (exception, index) => (
                <li key={index}>
                  <Typo.p textType="body__primary">{t(exception.text)}</Typo.p>
                  {exception.examples.length > 0 && (
                    <ul className={style.rules__list}>
                      {exception.examples.map(
                        (example: TranslatedString, exampleIndex: number) => (
                          <li key={exampleIndex}>
                            <Typo.p textType="body__primary">
                              {t(example)}
                            </Typo.p>
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </li>
              ),
            )}
          </ul>
        </div>

        <Typo.p textType="body__primary">
          {t(
            PageText.Contact.refund.agreement.travelGuaranteeExceptions
              .exclusion,
          )}{' '}
          <Link
            href={t(
              PageText.Contact.refund.agreement.travelGuaranteeExceptions.link
                .href,
            )}
          >
            {t(
              PageText.Contact.refund.agreement.travelGuaranteeExceptions.link
                .text,
            )}
          </Link>
        </Typo.p>

        <Checkbox
          label={t(
            PageText.Contact.ticketControl.feeComplaint.firstAgreement.checkbox,
          )}
          checked={state.context.isInitialAgreementChecked}
          onChange={() =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'isInitialAgreementChecked',
              value: !state.context.isInitialAgreementChecked,
            })
          }
        />
      </SectionCard>

      {state.context.isInitialAgreementChecked && (
        <SectionCard title={t(PageText.Contact.refund.agreement.title)}>
          <ul className={style.form_options__list}>
            {Object.values(RefundAndTravelGuarantee).map((refundForm) => (
              <li key={refundForm}>
                <Radio
                  label={t(
                    PageText.Contact.refund.refundAndTravelGuarantee[refundForm]
                      .label,
                  )}
                  checked={state.context.formType === (refundForm as unknown)}
                  onChange={() =>
                    send({
                      type: 'SELECT_REFUND_AND_TRAVEL_GUARANTEE_FORM',
                      refundAndTravelGuarantee: refundForm,
                    })
                  }
                />
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {displayRefundTaxiForm && <RefundTaxiForm state={state} send={send} />}
      {displayRefundCarForm && <RefundCarForm state={state} send={send} />}
    </div>
  );
};

export default RefundAndTravelGuaranteeForms;
