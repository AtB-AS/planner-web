import { PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { FormCategory, refundStateMachine } from './refundFormMachine';
import { FormEventHandler } from 'react';
import { Button } from '@atb/components/button';
import style from '../contact.module.css';
import { Fieldset, Radio } from '../components';
import RefundAndTravelGuaranteeForms from './forms/refund-and-travel-guarantee';
import RefundTicketForms from './forms/refund-ticket';
import { ResidualValueOnTravelCard } from './forms/residualValueOnTravelCard';

const RefundContent = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(refundStateMachine);
  const displaySubmitButton =
    state.context.formType &&
    state.context.formType !== 'residualValueOnTravelCard';

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    send({ type: 'SUBMIT' });
  };

  return (
    <form onSubmit={onSubmit} className={style.form}>
      <Fieldset title={t(PageText.Contact.refund.title)}>
        <ul className={style.form_options__list}>
          {Object.values(FormCategory).map((formCategory) => (
            <li key={formCategory}>
              <Radio
                label={t(PageText.Contact.refund[formCategory].description)}
                checked={state.matches({ editing: formCategory })}
                onChange={() =>
                  send({
                    type: 'SELECT_FORM_CATEGORY',
                    formCategory: formCategory,
                  })
                }
              />
            </li>
          ))}
        </ul>
      </Fieldset>

      {state.matches({ editing: 'refundOfTicket' }) && (
        <RefundTicketForms state={state} send={send} />
      )}

      {state.matches({ editing: 'refundAndTravelGuarantee' }) && (
        <RefundAndTravelGuaranteeForms state={state} send={send} />
      )}

      {state.matches({ editing: 'residualValueOnTravelCard' }) && (
        <ResidualValueOnTravelCard />
      )}

      {displaySubmitButton && (
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

export default RefundContent;
