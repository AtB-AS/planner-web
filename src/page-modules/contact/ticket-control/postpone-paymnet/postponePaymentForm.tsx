import { FormEventHandler } from 'react';
import { Button } from '@atb/components/button';
import { Input } from '../../components/input';
import { SectionCard } from '../../components/section-card';
import { PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { formMachine } from './postponePaymentFormMachine';

export const PostponePaymentForm = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(formMachine);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!state.matches('submitting')) return;

    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        feeNumber: state.context.feeNumber,
        invoiceNumber: state.context.invoiceNumber,
        firstName: state.context.firstname,
        lastName: state.context.lastname,
        email: state.context.email,
      }),
    });

    if (response.ok) {
      const res = await response.json();
      send({ type: 'RESOLVE' });
    } else {
      send({ type: 'FALIURE' });
    }
  };

  const isFeeNumberEmpty = state.hasTag('emptyFeeNumber');
  const isInvoiceNumberEmpty = state.hasTag('emptyInvoiceNumber');
  const isFirstnameEmpty = state.hasTag('emptyFirstname');
  const isLastnameEmpty = state.hasTag('emptyLastname');
  const isEmailEmpty = state.hasTag('emptyEmail');

  return (
    <form onSubmit={onSubmit}>
      <SectionCard title={PageText.Contact.ticketControl.postponePayment.title}>
        <p>{t(PageText.Contact.ticketControl.postponePayment.info)}</p>

        <Input
          label={PageText.Contact.ticketControl.postponePayment.fee.inputlabel}
          type="text"
          name="feeNumber"
          value={state.context.feeNumber}
          description={
            PageText.Contact.ticketControl.postponePayment.fee.description
          }
          errorMessage={
            isFeeNumberEmpty
              ? PageText.Contact.ticketControl.feeComplaint.fee.errorMessage
              : undefined
          }
          onChange={(e) =>
            send({
              type: 'SET_FEE_NUMBER',
              feeNumber: e.target.value,
            })
          }
        />

        <Input
          label={
            PageText.Contact.ticketControl.postponePayment.invoiceNumber
              .inputlabel
          }
          type="text"
          name="invoiceNumber"
          value={state.context.invoiceNumber}
          description={
            PageText.Contact.ticketControl.postponePayment.invoiceNumber
              .description
          }
          errorMessage={
            isInvoiceNumberEmpty
              ? PageText.Contact.ticketControl.postponePayment.invoiceNumber
                  .errorMessage
              : undefined
          }
          onChange={(e) =>
            send({
              type: 'SET_INVOICE_NUMBER',
              invoiceNumber: e.target.value,
            })
          }
        />
      </SectionCard>
      <SectionCard title={PageText.Contact.aboutYouInfo.title}>
        <Input
          label={PageText.Contact.aboutYouInfo.firstname}
          type="text"
          name="firstname"
          value={state.context.firstname}
          errorMessage={
            isFirstnameEmpty
              ? PageText.Contact.aboutYouInfo.errorMessage
              : undefined
          }
          onChange={(e) =>
            send({
              type: 'SET_FIRSTNAME',
              firstname: e.target.value,
            })
          }
        />
        <Input
          label={PageText.Contact.aboutYouInfo.lastname}
          type="text"
          name="lastname"
          value={state.context.lastname}
          errorMessage={
            isLastnameEmpty
              ? PageText.Contact.aboutYouInfo.errorMessage
              : undefined
          }
          onChange={(e) =>
            send({
              type: 'SET_LASTNAME',
              lastname: e.target.value,
            })
          }
        />
        <Input
          label={PageText.Contact.aboutYouInfo.email}
          type="email"
          name="email"
          value={state.context.email}
          errorMessage={
            isEmailEmpty
              ? PageText.Contact.aboutYouInfo.errorMessage
              : undefined
          }
          onChange={(e) =>
            send({
              type: 'SET_EMAIL',
              email: e.target.value,
            })
          }
        />
      </SectionCard>
      <Button
        title={t(PageText.Contact.submit)}
        mode={'interactive_0--bordered'}
        buttonProps={{ type: 'submit' }}
        onClick={() => send({ type: 'SUBMIT' })}
      />
    </form>
  );
};

export default PostponePaymentForm;
