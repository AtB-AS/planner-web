import { PageText, useTranslation } from '@atb/translations';
import { RefundContextProps } from '../../refundFormMachine';
import { RefundFormEvents } from '../../events';
import { Typo } from '@atb/components/typography';
import { PurchasePlatformType } from '../../../types';
import {
  Fieldset,
  Input,
  Textarea,
  FileInput,
  Select,
} from '../../../components';

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

      <Typo.p textType="body__primary">
        {t(PageText.Contact.input.refundReason.question)}
      </Typo.p>

      <Textarea
        id="refundReason"
        value={state.context.refundReason || ''}
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
      />
      <FileInput
        name="attachments"
        onChange={(files) => {
          send({
            type: 'ON_INPUT_CHANGE',
            inputName: 'attachments',
            value: files,
          });
        }}
        label={t(PageText.Contact.input.feedback.attachment)}
      />
    </Fieldset>
  );
};

export default AppTicketRefund;
