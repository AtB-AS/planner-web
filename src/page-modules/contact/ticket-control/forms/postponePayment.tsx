import { Input, Fieldset } from '../../components';
import { PageText, useTranslation } from '@atb/translations';
import { ticketControlFormEvents } from '../events';
import { TicketControlContextProps } from '../ticket-control-form-machine';
import { Typo } from '@atb/components/typography';

type PostponePaymentFormProps = {
  state: { context: TicketControlContextProps };
  send: (event: typeof ticketControlFormEvents) => void;
};

export const PostponePaymentForm = ({
  state,
  send,
}: PostponePaymentFormProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Fieldset title={t(PageText.Contact.ticketControl.postponePayment.title)}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.ticketControl.postponePayment.info)}
        </Typo.p>

        <Input
          id="feeNumber"
          label={t(PageText.Contact.input.feeNumber.label)}
          type="text"
          name="feeNumber"
          value={state.context.feeNumber || ''}
          isRequired
          errorMessage={state.context?.errorMessages['feeNumber']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'feeNumber',
              value: e.target.value,
            })
          }
          modalContent={{
            description: t(PageText.Contact.input.feeNumber.description),
          }}
        />

        <Input
          id="invoiceNumber"
          label={t(PageText.Contact.input.invoiceNumber.label)}
          type="text"
          name="invoiceNumber"
          value={state.context.invoiceNumber || ''}
          isRequired
          errorMessage={state.context?.errorMessages['invoiceNumber']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'invoiceNumber',
              value: e.target.value,
            })
          }
          modalContent={{
            description: t(PageText.Contact.input.invoiceNumber.description),
          }}
        />
      </Fieldset>
      <Fieldset title={t(PageText.Contact.aboutYouInfo.title)}>
        <Input
          id="firstName"
          label={t(PageText.Contact.input.firstName.label)}
          type="text"
          autoComplete="given-name additional-name"
          name="firstName"
          value={state.context.firstName || ''}
          isRequired
          errorMessage={state.context?.errorMessages['firstName']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'firstName',
              value: e.target.value,
            })
          }
        />
        <Input
          id="lastName"
          label={t(PageText.Contact.input.lastName.label)}
          type="text"
          autoComplete="family-name"
          name="lastName"
          value={state.context.lastName || ''}
          isRequired
          errorMessage={state.context?.errorMessages['lastName']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'lastName',
              value: e.target.value,
            })
          }
        />
        <Input
          id="email"
          label={t(PageText.Contact.input.email.label)}
          type="email"
          name="email"
          value={state.context.email || ''}
          isRequired
          errorMessage={state.context?.errorMessages['email']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'email',
              value: e.target.value,
            })
          }
        />
      </Fieldset>
    </>
  );
};

export default PostponePaymentForm;
