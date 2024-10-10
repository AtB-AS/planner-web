import style from '../../..//contact.module.css';
import { StateFrom } from 'xstate';
import { SectionCard } from '../../../components/section-card';
import { PageText, useTranslation } from '@atb/translations';
import { AppForm, ticketingStateMachine } from '../../ticketingStateMachine';
import { RadioInput } from '../../../components/input/radio';
import AppAccountForm from './appAccountForm';
import AppTicketingForm from './appTicketingForm';
import AppTravelSuggestionForm from './appTravelSuggestionForm';
import { ticketingFormEvents } from '../../events';

type AppFormsProps = {
  state: StateFrom<typeof ticketingStateMachine>;
  send: (event: typeof ticketingFormEvents) => void;
};

export const AppForms = ({ state, send }: AppFormsProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <SectionCard title={t(PageText.Contact.ticketing.app.description)}>
        <ul className={style.form_options__list}>
          {Object.values(AppForm).map((appForm) => (
            <li key={appForm}>
              <RadioInput
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
      </SectionCard>

      {state.matches({ editing: { app: 'appTicketing' } }) && (
        <AppTicketingForm state={state} send={send} />
      )}
      {state.matches({ editing: { app: 'appTravelSuggestion' } }) && (
        <AppTravelSuggestionForm state={state} send={send} />
      )}
      {state.matches({ editing: { app: 'appAccount' } }) && (
        <AppAccountForm state={state} send={send} />
      )}
    </div>
  );
};

export default AppForms;
