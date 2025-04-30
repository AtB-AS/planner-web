import style from '../../..//contact.module.css';
import { StateFrom } from 'xstate';
import { PageText, useTranslation } from '@atb/translations';
import { AppForm, ticketingStateMachine } from '../../ticketingStateMachine';
import AppAccountForm from './appAccountForm';
import AppTicketingForm from './appTicketingForm';
import AppTravelSuggestionForm from './appTravelSuggestionForm';
import { ticketingFormEvents } from '../../events';
import { Fieldset, Radio } from '../../../components';

type AppFormsProps = {
  state: StateFrom<typeof ticketingStateMachine>;
  send: (event: typeof ticketingFormEvents) => void;
};

export const AppForms = ({ state, send }: AppFormsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Fieldset title={t(PageText.Contact.ticketing.app.description)}>
        <ul className={style.form_options__list}>
          {Object.values(AppForm).map((appForm) => (
            <li key={appForm}>
              <Radio
                label={t(PageText.Contact.ticketing.app[appForm].label)}
                checked={state.matches({ editing: { app: appForm } })}
                onChange={(e) =>
                  send({
                    type: 'SELECT_APP_FORM',
                    appForm: appForm,
                  })
                }
              />
            </li>
          ))}
        </ul>
      </Fieldset>

      {state.matches({ editing: { app: 'appTicketing' } }) && (
        <AppTicketingForm state={state} send={send} />
      )}
      {state.matches({ editing: { app: 'appTravelSuggestion' } }) && (
        <AppTravelSuggestionForm state={state} send={send} />
      )}
      {state.matches({ editing: { app: 'appAccount' } }) && (
        <AppAccountForm state={state} send={send} />
      )}
    </>
  );
};

export default AppForms;
