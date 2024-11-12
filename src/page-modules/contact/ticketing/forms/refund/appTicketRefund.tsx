import { PageText, useTranslation } from '@atb/translations';
import { ticketingFormEvents } from '../../events';
import { TicketingContextType } from '../../ticketingStateMachine';
import { SectionCard, Input } from '../../../components';

type AppTicketRefundProps = {
  state: { context: TicketingContextType };
  send: (event: typeof ticketingFormEvents) => void;
};

export const AppTicketRefund = ({ state, send }: AppTicketRefundProps) => {
  const { t } = useTranslation();

  return (
    <SectionCard
      title={t(PageText.Contact.ticketing.refund.appTicketRefund.label)}
    >
      <Input
        label={PageText.Contact.input.customerNumber.label}
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
        label={PageText.Contact.input.orderId.label(true)}
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
          bulletPoints: PageText.Contact.input.orderId.descriptionBulletPoints,
        }}
      />
    </SectionCard>
  );
};

export default AppTicketRefund;
