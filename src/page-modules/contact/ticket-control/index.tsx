import { PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { FormEventHandler, useState } from 'react';
import {
  FormType,
  ticketControlFormMachine,
} from './ticket-control-form-machine';
import { SectionCard } from '../components/section-card';
import style from '../contact.module.css';
import { RadioInput } from '../components/input/radio';
import FeeComplaintForm from './forms/feeComplaintForm';
import FeedbackForm from './forms/feedbackForm';
import { Button } from '@atb/components/button';
import PostponePaymentForm from './forms/postponePayment';

const TicketControlPageContent = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(ticketControlFormMachine);
  const displaySubmitButton =
    (state.context.formType === 'feeComplaint' &&
      state.context.agreesSecondAgreement) ||
    (state.context.formType && state.context.formType !== 'feeComplaint');

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
    <form onSubmit={onSubmit}>
      <SectionCard title={t(PageText.Contact.ticketControl.title)}>
        <ul className={style.form_options__list}>
          {Object.values(FormType).map((formType) => (
            <li key={formType}>
              <RadioInput
                label={t(PageText.Contact.ticketControl[formType].description)}
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
      {state.context.formType === 'feeComplaint' && (
        <FeeComplaintForm state={state} send={send} />
      )}
      {state.context.formType === 'feedback' && (
        <FeedbackForm state={state} send={send} />
      )}
      {state.context.formType === 'postponePayment' && (
        <PostponePaymentForm state={state} send={send} />
      )}
      {displaySubmitButton && (
        <Button
          title={t(PageText.Contact.submit)}
          mode={'interactive_0--bordered'}
          buttonProps={{ type: 'submit' }}
          state={state.matches('submitting') ? 'loading' : undefined}
        />
      )}
    </form>
  );
};

export default TicketControlPageContent;
