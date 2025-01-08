import { PageText, useTranslation } from '@atb/translations';
import { SectionCard, Input, Textarea, FileInput } from '../../../components';
import { RefundContextProps } from '../../refundFormMachine';
import { RefundFormEvents } from '../../events';
import { Typo } from '@atb/components/typography';

type AppTicketRefundProps = {
  state: { context: RefundContextProps };
  send: (event: typeof RefundFormEvents) => void;
};

export const AppTicketRefund = ({ state, send }: AppTicketRefundProps) => {
  const { t } = useTranslation();

  return (
    <SectionCard
      title={t(PageText.Contact.ticketing.refund.appTicketRefund.label)}
    >
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

      <Typo.p textType="body__primary">
        {t(PageText.Contact.input.refundReason.question)}
      </Typo.p>

      <Textarea
        value={state.context.refundReason || ''}
        onChange={(e) =>
          send({
            type: 'ON_INPUT_CHANGE',
            inputName: 'refundReason',
            value: e.target.value,
          })
        }
        error={
          state.context.errorMessages['refundReason']?.[0] &&
          t(state.context.errorMessages['refundReason']?.[0]).toString()
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
    </SectionCard>
  );
};

export default AppTicketRefund;
