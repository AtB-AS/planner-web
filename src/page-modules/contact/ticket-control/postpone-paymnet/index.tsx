import { FormEventHandler, useState } from 'react';
import { Button } from '@atb/components/button';
import { Input } from '../../components/input';
import { SectionCard } from '../../components/section-card';
import { PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { postponePaymentForm } from './postponePaymentFormMachine';

export const PostponePaymentForm = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(postponePaymentForm);

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
      <SectionCard title={PageText.Contact.ticketControl.postponePayment.title}>
        <p>{t(PageText.Contact.ticketControl.postponePayment.info)}</p>

        <Input
          label={PageText.Contact.inputFields.feeNumber.label}
          type="text"
          name="feeNumber"
          value={state.context.feeNumber}
          errorMessage={
            state.context?.errorMessages['feeNumber']?.[0] || undefined
          }
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              field: 'feeNumber',
              value: e.target.value,
            })
          }
        />

        <Input
          label={PageText.Contact.inputFields.invoiceNumber.label}
          type="text"
          name="invoiceNumber"
          value={state.context.invoiceNumber}
          errorMessage={
            state.context?.errorMessages['invoiceNumber']?.[0] || undefined
          }
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              field: 'invoiceNumber',
              value: e.target.value,
            })
          }
        />
      </SectionCard>
      <SectionCard title={PageText.Contact.aboutYouInfo.title}>
        <Input
          label={PageText.Contact.inputFields.firstName.label}
          type="text"
          name="firstName"
          value={state.context.firstName}
          errorMessage={
            state.context?.errorMessages['firstName']?.[0] || undefined
          }
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              field: 'firstName',
              value: e.target.value,
            })
          }
        />
        <Input
          label={PageText.Contact.inputFields.lastName.label}
          type="text"
          name="lastName"
          value={state.context.lastName}
          errorMessage={
            state.context?.errorMessages['lastName']?.[0] || undefined
          }
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              field: 'lastName',
              value: e.target.value,
            })
          }
        />
        <Input
          label={PageText.Contact.inputFields.email.label}
          type="email"
          name="email"
          value={state.context.email}
          errorMessage={state.context?.errorMessages['email']?.[0] || undefined}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              field: 'email',
              value: e.target.value,
            })
          }
        />
      </SectionCard>
      <Button
        title={t(PageText.Contact.submit)}
        mode={'interactive_0--bordered'}
        buttonProps={{ type: 'submit' }}
      />
    </form>
  );
};

export default PostponePaymentForm;
