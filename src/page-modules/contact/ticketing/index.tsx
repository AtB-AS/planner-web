import style from '../contact.module.css';
import { PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { FormEventHandler } from 'react';
import { FormCategory, ticketingStateMachine } from './ticketingStateMachine';
import { Button } from '@atb/components/button';
import { SectionCard, Radio } from '../components';
import PriceAndTicketTypesForm from './forms/priceAndTicketTypesForm';
import AppForms from './forms/app';
import WebshopForms from './forms/webshop';
import TravelCardForms from './forms/travel-card';

const TicketingContent = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(ticketingStateMachine);
  const displaySubmitButton =
    state.context.formType && state.context.formType !== 'orderTravelCard';

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    send({ type: 'SUBMIT' });
  };

  return (
    <form onSubmit={onSubmit} className={style.form}>
      <SectionCard title={t(PageText.Contact.ticketing.title)}>
        <ul className={style.form_options__list}>
          {Object.values(FormCategory).map((formCategory) => (
            <li key={formCategory}>
              <Radio
                label={t(PageText.Contact.ticketing[formCategory].description)}
                checked={state.matches({ editing: formCategory })}
                onChange={() =>
                  send({
                    type: 'SELECT_FORM_CATEGORY',
                    formCategory: formCategory,
                  })
                }
              />
            </li>
          ))}
        </ul>
      </SectionCard>

      {state.matches({ editing: 'priceAndTicketTypes' }) && (
        <PriceAndTicketTypesForm state={state} send={send} />
      )}

      {state.matches({ editing: 'app' }) && (
        <AppForms state={state} send={send} />
      )}

      {state.matches({ editing: 'webshop' }) && (
        <WebshopForms state={state} send={send} />
      )}

      {state.matches({ editing: 'travelCard' }) && (
        <TravelCardForms state={state} send={send} />
      )}

      {displaySubmitButton && (
        <Button
          title={t(PageText.Contact.submit)}
          mode={'interactive_0--bordered'}
          buttonProps={{ type: 'submit' }}
          state={state.matches('submitting') ? 'loading' : undefined}
          className={style.submitButton}
        />
      )}
    </form>
  );
};

export default TicketingContent;
