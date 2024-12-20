import { PageText, useTranslation } from '@atb/translations';
import { SectionCard, Input } from '../../../components';
import { RefundContextProps } from '../../refundFormMachine';
import { RefundFormEvents } from '../../events';

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
    </SectionCard>
  );
};

export default AppTicketRefund;
