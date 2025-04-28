import { PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { FormEventHandler } from 'react';
import {
  FormType,
  ticketControlFormMachine,
} from './ticket-control-form-machine';
import style from '../contact.module.css';
import { Button } from '@atb/components/button';
import FeeComplaintForm from './forms/feeComplaintForm';
import FeedbackForm from './forms/feedbackForm';
import PostponePaymentForm from './forms/postponePayment';
import { Fieldset, Radio } from '../components';

const TicketControlPageContent = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(ticketControlFormMachine);
  const displaySubmitButton =
    (state.context.formType === 'feeComplaint' &&
      state.context.agreesSecondAgreement) ||
    (state.context.formType && state.context.formType !== 'feeComplaint');

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    send({ type: 'SUBMIT' });
  };

  return (
    <form onSubmit={onSubmit} className={style.form}>
      <Fieldset title={t(PageText.Contact.ticketControl.title)}>
        <ul className={style.form_options__list}>
          {Object.values(FormType).map((formType) => (
            <li key={formType}>
              <Radio
                label={t(PageText.Contact.ticketControl[formType].description)}
                checked={state.matches({ editing: formType })}
                onChange={() => {
                  send({
                    type: 'SELECT_FORM_TYPE',
                    formType: formType,
                  });
                }}
              />
            </li>
          ))}
        </ul>
      </Fieldset>
      {state.matches({ editing: 'feeComplaint' }) && (
        <FeeComplaintForm state={state} send={send} />
      )}
      {state.matches({ editing: 'feedback' }) && (
        <FeedbackForm state={state} send={send} />
      )}
      {state.matches({ editing: 'postponePayment' }) && (
        <PostponePaymentForm state={state} send={send} />
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

export default TicketControlPageContent;
