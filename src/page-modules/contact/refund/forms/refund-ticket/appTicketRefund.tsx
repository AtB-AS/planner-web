import { PageText, useTranslation } from '@atb/translations';
import { RefundContextProps } from '../../refundFormMachine';
import { RefundFormEvents } from '../../events';
import { PurchasePlatformType } from '../../../types';
import { Fieldset, Input, Textarea, Select } from '../../../components';

type AppTicketRefundProps = {
  state: { context: RefundContextProps };
  send: (event: typeof RefundFormEvents) => void;
};

export const AppTicketRefund = ({ state, send }: AppTicketRefundProps) => {
  const { t } = useTranslation();

  return (
    <Fieldset
      title={t(PageText.Contact.ticketing.refund.appTicketRefund.label)}
    >
      <Input
        id="customerNumber"
        label={t(PageText.Contact.input.customerNumber.label)}
        type="text"
        name="customerNumber"
        value={state.context.customerNumber || ''}
        isRequired
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
        id="orderId"
        label={t(PageText.Contact.input.orderId.label(true))}
        type="text"
        name="orderId"
        value={state.context.orderId || ''}
        isRequired
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
          bulletPoints:
            PageText.Contact.input.orderId.descriptionBulletPoints.map(
              (bulletPoint) => t(bulletPoint),
            ),
        }}
      />

      <Select
        id="purchasePlatform"
        label={t(PageText.Contact.input.purchasePlatform.label)}
        value={state.context.purchasePlatform || ''}
        onChange={(value) =>
          send({
            type: 'ON_PURCHASE_PLATFORM_CHANGE',
            value: value as PurchasePlatformType,
          })
        }
        isRequired
        error={
          state.context?.errorMessages['purchasePlatform']?.[0]
            ? t(state.context?.errorMessages['purchasePlatform']?.[0])
            : undefined
        }
        valueToId={(val: string) => val}
        valueToText={(val: string) =>
          t(
            PageText.Contact.input.purchasePlatform.platforms[
              val as PurchasePlatformType
            ],
          )
        }
        options={['enturApp', 'enturWeb', 'framApp', 'framWeb']}
        placeholder={t(PageText.Contact.input.purchasePlatform.optionLabel)}
      />

      <Textarea
        id="refundReason"
        description={t(PageText.Contact.input.refundReason.question)}
        value={state.context.refundReason || ''}
        isRequired
        onChange={(e) =>
          send({
            type: 'ON_INPUT_CHANGE',
            inputName: 'refundReason',
            value: e.target.value,
          })
        }
        error={
          state.context.errorMessages['refundReason']?.[0]
            ? t(state.context.errorMessages['refundReason']?.[0])
            : undefined
        }
        fileInputProps={{
          id: 'attachments',
          iconLabel: t(PageText.Contact.input.feedback.attachment.receipt),
          name: 'attachments',
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
  );
};

type AboutYouSectionProps = Pick<AppTicketRefundProps, 'state' | 'send'>;

const AboutYouSection = ({ state, send }: AboutYouSectionProps) => {
  const { t } = useTranslation();
  return (
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
        id="address"
        label={t(PageText.Contact.input.address.label)}
        type="text"
        autoComplete="street-address"
        name="address"
        value={state.context.address || ''}
        isRequired
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
        id="postalCode"
        label={t(PageText.Contact.input.postalCode.label)}
        type="text"
        autoComplete="postal-code"
        name="postalCode"
        value={state.context.postalCode || ''}
        isRequired
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
        id="city"
        label={t(PageText.Contact.input.city.label)}
        type="text"
        name="city"
        value={state.context.city || ''}
        isRequired
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
        id="email"
        label={t(PageText.Contact.input.email.label)}
        type="email"
        autoComplete="email"
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
      <Input
        id="phoneNumber"
        label={t(PageText.Contact.input.phoneNumber.label)}
        type="tel"
        name="phoneNumber"
        value={state.context.phoneNumber || ''}
        isRequired
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
  );
};

export default function AppTicketRefundContent({
  state,
  send,
}: AppTicketRefundProps) {
  return (
    <>
      <AppTicketRefund state={state} send={send} />
      <AboutYouSection state={state} send={send} />
    </>
  );
}
