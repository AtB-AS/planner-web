import { PageText, useTranslation } from '@atb/translations';
import { ticketingFormEvents } from '../../events';
import { TicketingContextType } from '../../ticketingStateMachine';
import { Fieldset, Textarea, Input } from '../../../components';

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
    <>
      <Fieldset
        title={t(PageText.Contact.ticketing.webshop.webshopTicketing.title)}
      >
        <Input
          id="orderId"
          label={t(PageText.Contact.input.orderId.label(false))}
          type="text"
          name="orderId"
          value={state.context.orderId || ''}
          isRequired
          modalContent={{
            description: t(PageText.Contact.input.orderId.description),
            bulletPoints:
              PageText.Contact.input.orderId.descriptionBulletPoints.map(
                (bulletPoint) => t(bulletPoint),
              ),
          }}
          errorMessage={state.context?.errorMessages['orderId']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'orderId',
              value: e.target.value,
            })
          }
        />
      </Fieldset>

      <Fieldset title={t(PageText.Contact.input.question.title)} isRequired>
        <Textarea
          id="question"
          description={t(PageText.Contact.input.question.info)}
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
          fileInputProps={{
            id: 'attachments',
            name: 'attachments',
            label: t(PageText.Contact.input.question.attachment),
            onChange: (files) => {
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'attachments',
                value: files,
              });
            },
          }}
        />
      </Fieldset>
      <Fieldset title={t(PageText.Contact.aboutYouInfo.title)}>
        <Input
          id="customerNumber"
          label={t(PageText.Contact.input.customerNumber.labelOptional)}
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
          modalContent={{
            description: t(PageText.Contact.input.customerNumber.description),
          }}
        />
        <Input
          id="firstName"
          label={t(PageText.Contact.input.firstName.label)}
          type="text"
          autoComplete="given-name additional-name"
          name="firstName"
          isRequired
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
          id="lastName"
          label={t(PageText.Contact.input.lastName.label)}
          type="text"
          autoComplete="family-name"
          name="lastName"
          isRequired
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
          id="email"
          label={t(PageText.Contact.input.email.label)}
          type="email"
          autoComplete="email"
          name="email"
          isRequired
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
        <Input
          id="phoneNumber"
          label={t(PageText.Contact.input.phoneNumber.label)}
          type="tel"
          autoComplete="tel"
          name="phoneNumber"
          isRequired
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
      </Fieldset>
    </>
  );
};

export default WebshopTicketingForm;
