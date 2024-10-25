import style from '../../../contact.module.css';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { ticketingFormEvents } from '../../events';
import { TicketingContextType } from '../../ticketingStateMachine';
import { Typo } from '@atb/components/typography';
import { SectionCard, Input, Textarea, FileInput } from '../../../components';

type OrderTravelCardFormProps = {
  state: { context: TicketingContextType };
  send: (event: typeof ticketingFormEvents) => void;
};

export const OrderTravelCardForm = ({
  state,
  send,
}: OrderTravelCardFormProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <SectionCard
        title={t(PageText.Contact.ticketing.travelCard.orderTravelCard.label)}
      >
        <ul className={style.rules__list}>
          {PageText.Contact.ticketing.travelCard.orderTravelCard.info.map(
            (paragraph: TranslatedString, index: number) => (
              <li key={`info-paragraph-${index}`}>
                <Typo.p textType="body__primary">{t(paragraph)}</Typo.p>
              </li>
            ),
          )}
        </ul>
      </SectionCard>
      <SectionCard title={t(PageText.Contact.aboutYouInfo.title)}>
        <Input
          label={PageText.Contact.input.firstName.label}
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
          label={PageText.Contact.input.lastName.label}
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
          label={PageText.Contact.input.address.label}
          type="text"
          autoComplete="street-address"
          name="address"
          value={state.context.address || ''}
          errorMessage={state.context?.errorMessages['address']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'address',
              value: e.target.value,
            })
          }
        />
        <Input
          label={PageText.Contact.input.postalCode.label}
          type="number"
          autoComplete="postal-code"
          name="postalCode"
          value={state.context.postalCode || ''}
          errorMessage={state.context?.errorMessages['postalCode']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'postalCode',
              value: e.target.value,
            })
          }
        />
        <Input
          label={PageText.Contact.input.city.label}
          type="text"
          name="city"
          value={state.context.city || ''}
          errorMessage={state.context?.errorMessages['city']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'city',
              value: e.target.value,
            })
          }
        />
        <Input
          label={PageText.Contact.input.email.label}
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
      </SectionCard>
    </div>
  );
};

export default OrderTravelCardForm;
