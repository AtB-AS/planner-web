import { PageText, useTranslation } from '@atb/translations';
import { ticketingFormEvents } from '../../events';
import { TicketingContextType } from '../../ticketingStateMachine';
import { Typo } from '@atb/components/typography';
import { SectionCard, Textarea, FileInput, Input } from '../../../components';

type WebshopTicketingFormProps = {
  state: { context: TicketingContextType };
  send: (event: typeof ticketingFormEvents) => void;
};

export const WebshopTicketingForm = ({
  state,
  send,
}: WebshopTicketingFormProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <SectionCard
        title={t(PageText.Contact.ticketing.webshop.webshopTicketing.title)}
      >
        <Typo.p textType="body__primary">
          {t(PageText.Contact.input.orderId.info)}
        </Typo.p>
        <Input
          label={PageText.Contact.input.orderId.label}
          type="text"
          name="orderId"
          value={state.context.orderId || ''}
          errorMessage={state.context?.errorMessages['orderId']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'orderId',
              value: e.target.value,
            })
          }
        />
      </SectionCard>

      <SectionCard title={t(PageText.Contact.input.question.title)}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.input.question.info)}
        </Typo.p>
        <Textarea
          value={state.context.question || ''}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'question',
              value: e.target.value,
            })
          }
          error={
            state.context.errorMessages['question']?.[0]
              ? t(state.context.errorMessages['question'][0])
              : undefined
          }
        />
        <FileInput
          name="attachments"
          label={t(PageText.Contact.input.question.attachment)}
          onChange={(files) => {
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'attachments',
              value: files,
            });
          }}
        />
      </SectionCard>
      <SectionCard title={t(PageText.Contact.aboutYouInfo.title)}>
        <Input
          label={PageText.Contact.input.customerNumber.labelOptional}
          type="text"
          name="customerNumber"
          value={state.context.customerNumber || ''}
          errorMessage={state.context?.errorMessages['customerNumber']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'customerNumber',
              value: e.target.value,
            })
          }
        />
        <Input
          label={PageText.Contact.input.firstName.labelOptional}
          type="text"
          autoComplete="given-name additional-name"
          name="firstName"
          value={state.context.firstName || ''}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'firstName',
              value: e.target.value,
            })
          }
        />

        <Input
          label={PageText.Contact.input.lastName.labelOptional}
          type="text"
          autoComplete="family-name"
          name="lastName"
          value={state.context.lastName || ''}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'lastName',
              value: e.target.value,
            })
          }
        />
        <Input
          label={
            PageText.Contact.input.email.labelOptionalIfCustomerNumberIsProvided
          }
          type="email"
          autoComplete="email"
          name="email"
          value={state.context.email || ''}
          errorMessage={
            state.context.customerNumber
              ? undefined
              : state.context?.errorMessages['email']?.[0]
          }
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'email',
              value: e.target.value,
            })
          }
        />
        <Input
          label={PageText.Contact.input.phoneNumber.labelOptional}
          type="phoneNumber"
          autoComplete="tel"
          name="phoneNumber"
          value={state.context.phoneNumber || ''}
          errorMessage={state.context?.errorMessages['phoneNumber']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'phoneNumber',
              value: e.target.value,
            })
          }
        />
      </SectionCard>
    </div>
  );
};

export default WebshopTicketingForm;
