import { Input, SectionCard } from '../../components';
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
    <div>
      <SectionCard
        title={t(PageText.Contact.ticketControl.postponePayment.title)}
      >
        <Typo.p textType="body__primary">
          {t(PageText.Contact.ticketControl.postponePayment.info)}
        </Typo.p>

        <Input
          label={t(PageText.Contact.input.feeNumber.label)}
          type="text"
          name="feeNumber"
          value={state.context.feeNumber || ''}
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
          label={t(PageText.Contact.input.invoiceNumber.label)}
          type="text"
          name="invoiceNumber"
          value={state.context.invoiceNumber || ''}
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
      </SectionCard>
      <SectionCard title={t(PageText.Contact.aboutYouInfo.title)}>
        <Input
          label={t(PageText.Contact.input.firstName.label)}
          type="text"
          autoComplete="given-name additional-name"
          name="firstName"
          value={state.context.firstName || ''}
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
          label={t(PageText.Contact.input.lastName.label)}
          type="text"
          autoComplete="family-name"
          name="lastName"
          value={state.context.lastName || ''}
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
          label={t(PageText.Contact.input.email.label)}
          type="email"
          name="email"
          value={state.context.email || ''}
          errorMessage={state.context?.errorMessages['email']?.[0]}
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
