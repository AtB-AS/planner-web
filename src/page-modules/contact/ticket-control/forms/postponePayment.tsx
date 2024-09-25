import { Input } from '../../components/input';
import { SectionCard } from '../../components/section-card';
import { PageText, useTranslation } from '@atb/translations';
import { ticketControlFormEvents } from '../events';
import { ContextProps } from '../ticket-controll-form-machine';
import { Typo } from '@atb/components/typography';

type PostponePaymentFormProps = {
  state: { context: ContextProps };
  send: (event: typeof ticketControlFormEvents) => void;
};

export const PostponePaymentForm = ({
  state,
  send,
}: PostponePaymentFormProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <SectionCard title={PageText.Contact.ticketControl.postponePayment.title}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.ticketControl.postponePayment.info)}
        </Typo.p>

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
              inputName: 'feeNumber',
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
              inputName: 'invoiceNumber',
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
              inputName: 'firstName',
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
              inputName: 'lastName',
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
              inputName: 'email',
              value: e.target.value,
            })
          }
        />
      </SectionCard>
    </div>
  );
};

export default PostponePaymentForm;
