import style from '../../..//contact.module.css';
import { StateFrom } from 'xstate';
import { PageText, useTranslation } from '@atb/translations';
import {
  TravelCardForm,
  ticketingStateMachine,
} from '../../ticketingStateMachine';
import { ticketingFormEvents } from '../../events';
import { Fieldset, Radio } from '../../../components';
import TravelCardQuestionForm from './travelCardQuestionForm';
import OrderTravelCard from './orderTravelCard';

type TravelCardFormsProps = {
  state: StateFrom<typeof ticketingStateMachine>;
  send: (event: typeof ticketingFormEvents) => void;
};

export const TravelCardForms = ({ state, send }: TravelCardFormsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Fieldset title={t(PageText.Contact.ticketing.travelCard.description)}>
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
      </Fieldset>

      {state.matches({ editing: { travelCard: 'orderTravelCard' } }) && (
        <OrderTravelCard />
      )}
      {state.matches({ editing: { travelCard: 'travelCardQuestion' } }) && (
        <TravelCardQuestionForm state={state} send={send} />
      )}
    </>
  );
};

export default TravelCardForms;
