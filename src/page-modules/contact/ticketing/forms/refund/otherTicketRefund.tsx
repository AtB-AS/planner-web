import { PageText, useTranslation } from '@atb/translations';
import { ticketingFormEvents } from '../../events';
import { TicketingContextType } from '../../ticketingStateMachine';
import { Typo } from '@atb/components/typography';
import {
  SectionCard,
  Input,
  Checkbox,
  Select,
  Textarea,
  FileInput,
} from '../../../components';

type OtherTicketRefundProps = {
  state: { context: TicketingContextType };
  send: (event: typeof ticketingFormEvents) => void;
};

type RefundSectionProps = Pick<OtherTicketRefundProps, 'state' | 'send'>;

const RefundSection = ({ state, send }: RefundSectionProps) => {
  const { t } = useTranslation();
  return (
    <SectionCard
      title={t(PageText.Contact.ticketing.refund.otherTicketRefund.label)}
    >
      <Select
        label={t(PageText.Contact.input.refundReason.label)}
        value={state.context.ticketType}
        valueToId={(option) => option.id}
        valueToText={(option) => t(option.name)}
        onChange={(value) => {
          if (!value) return;
          send({
            type: 'ON_INPUT_CHANGE',
            inputName: 'ticketType',
            value: value,
          });
        }}
        placeholder={t(PageText.Contact.input.refundReason.optionLabel)}
        options={PageText.Contact.input.ticketType.tickets}
        error={
          state.context?.errorMessages['ticketType']?.[0]
            ? t(state.context?.errorMessages['ticketType'][0])
            : undefined
        }
      />
      <Input
        label={t(PageText.Contact.input.travelCardNumber.label)}
        type="number"
        name="travelCardNumber"
        value={state.context.travelCardNumber || ''}
        errorMessage={state.context.errorMessages['travelCardNumber']?.[0]}
        onChange={(e) =>
          send({
            type: 'ON_INPUT_CHANGE',
            inputName: 'travelCardNumber',
            value: e.target.value,
          })
        }
      />

      <Input
        label={t(PageText.Contact.input.customerNumber.label)}
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
              (bulletPoint) => t(bulletPoint),
            ),
        }}
      />

      <Typo.p textType="body__primary">
        {t(PageText.Contact.input.refundReason.question)}
      </Typo.p>

      <Textarea
        value={state.context.refundReason || ''}
        onChange={(e) =>
          send({
            type: 'ON_INPUT_CHANGE',
            inputName: 'question',
            value: e.target.value,
          })
        }
        error={
          state.context.errorMessages['question']?.[0]
            ? t(state.context.errorMessages['question']?.[0]).toString()
            : undefined
        }
      />

      <Input
        label={t(PageText.Contact.input.amount.label)}
        type="text"
        name="amount"
        value={state.context.amount || ''}
        errorMessage={state.context?.errorMessages['amount']?.[0]}
        onChange={(e) =>
          send({
            type: 'ON_INPUT_CHANGE',
            inputName: 'amount',
            value: e.target.value,
          })
        }
      />
      <Typo.p textType="body__primary">
        {t(PageText.Contact.input.amount.info)}
      </Typo.p>

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
  );
};

type AboutYouSectionProps = Pick<OtherTicketRefundProps, 'state' | 'send'>;

const AboutYouSection = ({ state, send }: AboutYouSectionProps) => {
  const { t } = useTranslation();
  return (
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
        label={t(PageText.Contact.input.address.label)}
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
        label={t(PageText.Contact.input.postalCode.label)}
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
        label={t(PageText.Contact.input.city.label)}
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

      <Checkbox
        label={t(PageText.Contact.input.bankInformation.checkbox)}
        checked={state.context.hasInternationalBankAccount}
        onChange={() =>
          send({
            type: 'ON_INPUT_CHANGE',
            inputName: 'hasInternationalBankAccount',
            value: !state.context.hasInternationalBankAccount,
          })
        }
      />

      {!state.context.hasInternationalBankAccount && (
        <Input
          label={t(
            PageText.Contact.input.bankInformation.bankAccountNumber.label,
          )}
          type="number"
          name="bankAccountNumber"
          value={state.context.bankAccountNumber || ''}
          errorMessage={state.context?.errorMessages['bankAccountNumber']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'bankAccountNumber',
              value: e.target.value,
            })
          }
        />
      )}

      {state.context.hasInternationalBankAccount && (
        <div>
          <Input
            label={t(PageText.Contact.input.bankInformation.IBAN.label)}
            type="string"
            name="IBAN"
            value={state.context.IBAN || ''}
            errorMessage={state.context?.errorMessages['IBAN']?.[0]}
            onChange={(e) =>
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'IBAN',
                value: e.target.value,
              })
            }
          />

          <Input
            label={t(PageText.Contact.input.bankInformation.SWIFT.label)}
            type="string"
            name="SWIFT"
            value={state.context.SWIFT || ''}
            errorMessage={state.context?.errorMessages['SWIFT']?.[0]}
            onChange={(e) =>
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'SWIFT',
                value: e.target.value,
              })
            }
          />
        </div>
      )}
    </SectionCard>
  );
};

export const OtherTicketRefund = ({ state, send }: OtherTicketRefundProps) => {
  return (
    <div>
      <RefundSection state={state} send={send} />
      <AboutYouSection state={state} send={send} />
    </div>
  );
};

export default OtherTicketRefund;
