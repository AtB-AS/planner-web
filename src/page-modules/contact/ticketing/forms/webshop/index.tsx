import style from '../../..//contact.module.css';
import { StateFrom } from 'xstate';
import { PageText, useTranslation } from '@atb/translations';
import {
  WebshopForm,
  ticketingStateMachine,
} from '../../ticketingStateMachine';
import { ticketingFormEvents } from '../../events';
import { SectionCard, Radio } from '../../../components';
import WebshopAccountForm from './webshopAccountForm';
import WebshopTicketingForm from './webshopTicketingForm';

type AppFormsProps = {
  state: StateFrom<typeof ticketingStateMachine>;
  send: (event: typeof ticketingFormEvents) => void;
};

export const WebshopForms = ({ state, send }: AppFormsProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <SectionCard title={t(PageText.Contact.ticketing.webshop.description)}>
        <ul className={style.form_options__list}>
          {Object.values(WebshopForm).map((webshopForm) => (
            <li key={webshopForm}>
              <Radio
                label={t(PageText.Contact.ticketing.webshop[webshopForm].label)}
                checked={state.matches({ editing: { webshop: webshopForm } })}
                onChange={(e) =>
                  send({
                    type: 'SELECT_WEBSHOP_FORM',
                    webshopForm: webshopForm,
                  })
                }
              />
            </li>
          ))}
        </ul>
      </SectionCard>

      {state.matches({ editing: { webshop: 'webshopTicketing' } }) && (
        <WebshopTicketingForm state={state} send={send} />
      )}
      {state.matches({ editing: { webshop: 'webshopAccount' } }) && (
        <WebshopAccountForm state={state} send={send} />
      )}
    </div>
  );
};

export default WebshopForms;
