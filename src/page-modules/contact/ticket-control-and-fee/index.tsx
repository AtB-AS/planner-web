import { FormEventHandler } from 'react';
import { useMachine } from '@xstate/react';
import { formMachine } from './formMachine';
import { PageText } from '@atb/translations';
import { Input } from '../components/input';
import { SectionCard } from '../components/section-card';
import { FeeComplaintForm } from './feeComplaintForm';
import { AnyEventObject } from 'xstate';

export type TicketControlAndFeeContentProps = { title: string };

export const TicketControlAndFeeContent = (
  props: TicketControlAndFeeContentProps,
) => {
  const [state, send] = useMachine(formMachine);
  console.log('typeof state: ', typeof state._nodes);
  console.log('typeof send: ', typeof send);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const res = await response.json();
      console.log(res);
    }
  };

  return (
    <div>
      <SectionCard title={PageText.Contact.ticketControl.title}>
        <FormSelector state={state} send={send} />
      </SectionCard>
      {state.matches('feeComplaintForm') && (
        <FeeComplaintForm state={state} send={send} onSubmit={onSubmit} />
      )}
      {state.matches('refundForm') && (
        <div>
          {/* Todo : Create and add <RefundForm/> */}
          refund
        </div>
      )}
      {state.matches('feedbackForm') && (
        <div>
          {/* Todo : Create and add <FeedbackForm/> */}
          feedback
        </div>
      )}
    </div>
  );
};

type FormSelectorProps = {
  state: any;
  send: (event: any) => void;
};

const FormSelector = ({ state, send }: FormSelectorProps) => {
  return (
    <div>
      <Input
        label={PageText.Contact.ticketControl.optionDescriptions.feeComplaint}
        name="formSelector"
        type="radio"
        checked={state.matches('feeComplaintForm')}
        onChange={() =>
          send({
            type: 'choose.feeComplaintForm',
            target: 'feeComplaintForm',
            title:
              PageText.Contact.ticketControl.optionDescriptions.feeComplaint.no,
          })
        }
      />
      <Input
        label={PageText.Contact.ticketControl.optionDescriptions.refund}
        type="radio"
        name="formSelector"
        checked={state.matches('refundForm')}
        onChange={() =>
          send({
            type: 'choose.refundForm',
            target: 'refundForm',
            title: PageText.Contact.ticketControl.optionDescriptions.refund.no,
          })
        }
      />
      <Input
        label={PageText.Contact.ticketControl.optionDescriptions.feedback}
        type="radio"
        name="formSelector"
        checked={state.matches('feedbackForm')}
        onChange={() =>
          send({
            type: 'choose.feedbackForm',
            target: 'feedbackForm',
            title:
              PageText.Contact.ticketControl.optionDescriptions.feedback.no,
          })
        }
      />
    </div>
  );
};
