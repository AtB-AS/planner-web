import { PageText, useTranslation } from '@atb/translations';
import { ticketingFormEvents } from '../../events';
import { TicketingContextType } from '../../ticketingStateMachine';
import { Typo } from '@atb/components/typography';
import { Fieldset, Textarea, FileInput, Input } from '../../../components';
import style from '../../../contact.module.css';

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
        <ul className={style.rules__list}>
          {PageText.Contact.input.orderId.descriptionBulletPoints.map(
            (desc, index) => (
              <li key={index}>
                <Typo.p textType="body__primary">{t(desc)}</Typo.p>
              </li>
            ),
          )}
        </ul>

        <Input
          id="orderId"
          label={t(PageText.Contact.input.orderId.label(false))}
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
      </Fieldset>

      <Fieldset title={t(PageText.Contact.input.question.title)}>
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
        />
        <Input
          id="firstName"
          label={t(PageText.Contact.input.firstName.labelOptional)}
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
          id="lastName"
          label={t(PageText.Contact.input.lastName.labelOptional)}
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
          id="email"
          label={t(
            PageText.Contact.input.email
              .labelOptionalIfCustomerNumberIsProvided,
          )}
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
          id="phoneNumber"
          label={t(PageText.Contact.input.phoneNumber.labelOptional)}
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
      </Fieldset>
    </>
  );
};

export default WebshopTicketingForm;
