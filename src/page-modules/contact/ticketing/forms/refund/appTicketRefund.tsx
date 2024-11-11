import { PageText, useTranslation } from '@atb/translations';
import { ticketingFormEvents } from '../../events';
import { TicketingContextType } from '../../ticketingStateMachine';
import { Typo } from '@atb/components/typography';
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
        modalDescription={t(PageText.Contact.input.customerNumber.description)}
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
        label={PageText.Contact.input.orderId.label(true)}
        type="text"
        name="orderId"
        modalDescription={t(PageText.Contact.input.orderId.description)}
        modalBulletPoints={
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
    </SectionCard>
  );
};

export default AppTicketRefund;
