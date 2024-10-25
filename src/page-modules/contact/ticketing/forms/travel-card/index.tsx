import style from '../../..//contact.module.css';
import { StateFrom } from 'xstate';
import { PageText, useTranslation } from '@atb/translations';
import {
  TravelCardForm,
  ticketingStateMachine,
} from '../../ticketingStateMachine';
import { ticketingFormEvents } from '../../events';
import { SectionCard, Radio } from '../../../components';
import TravelCardQuestionForm from './travelCardQuestionForm';
import OrderTravelCardForm from './orderTravelCardForm';

type TravelcardFormsProps = {
  state: StateFrom<typeof ticketingStateMachine>;
  send: (event: typeof ticketingFormEvents) => void;
};

export const TravelCardForms = ({ state, send }: TravelcardFormsProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <SectionCard title={t(PageText.Contact.ticketing.travelCard.description)}>
        <ul className={style.form_options__list}>
          {Object.values(TravelCardForm).map((travelCardForm) => (
            <li key={travelCardForm}>
              <Radio
                label={t(
                  PageText.Contact.ticketing.travelCard[travelCardForm].label,
                )}
                checked={state.matches({
                  editing: { travelCard: travelCardForm },
                })}
                onChange={(e) =>
                  send({
                    type: 'SELECT_TRAVELCARD_FORM',
                    travelCardForm: travelCardForm,
                  })
                }
              />
            </li>
          ))}
        </ul>
      </SectionCard>

      {state.matches({ editing: { travelCard: 'orderTravelCard' } }) && (
        <OrderTravelCardForm state={state} send={send} />
      )}
      {state.matches({ editing: { travelCard: 'travelCardQuestion' } }) && (
        <TravelCardQuestionForm state={state} send={send} />
      )}
    </div>
  );
};

export default TravelCardForms;
