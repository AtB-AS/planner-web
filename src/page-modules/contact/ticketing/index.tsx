import style from '../contact.module.css';
import { PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { FormEventHandler } from 'react';
import { FormCategory, ticketingStateMachine } from './ticketingStateMachine';
import PriceAndTicketTypesForm from './forms/priceAndTicketTypesForm';
import { Button } from '@atb/components/button';
import { SectionCard, Radio } from '../components';

const TicketingContent = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(ticketingStateMachine);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    send({ type: 'SUBMIT' });
  };

  return (
    <form onSubmit={onSubmit}>
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

      {state.context.formType && (
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
