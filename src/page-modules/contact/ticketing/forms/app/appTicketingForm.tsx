import { PageText, useTranslation } from '@atb/translations';
import { ticketingFormEvents } from '../../events';
import { TicketingContextType } from '../../ticketingStateMachine';
import { Typo } from '@atb/components/typography';
import { SectionCard, Input, Textarea, FileInput } from '../../../components';

type AppTicketingFormProps = {
  state: { context: TicketingContextType };
  send: (event: typeof ticketingFormEvents) => void;
};

export const AppTicketingForm = ({ state, send }: AppTicketingFormProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <SectionCard title={t(PageText.Contact.ticketing.app.appTicketing.title)}>
        <Input
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
          modalContent={{
            description: t(PageText.Contact.input.orderId.description),
            instruction: t(PageText.Contact.input.orderId.instruction),
            bulletPoints:
              PageText.Contact.input.orderId.descriptionBulletPoints.map(
                (bulletpoint) => t(bulletpoint),
              ),
          }}
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
              ? t(state.context.errorMessages['question']?.[0])
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
          label={t(PageText.Contact.input.customerNumber.labelOptional)}
          type="text"
          name="customerNumber"
          value={state.context.customerNumber || ''}
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
          autoComplete="email"
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
        <Input
          label={t(PageText.Contact.input.phoneNumber.label)}
          type="tel"
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

export default AppTicketingForm;
