import style from '../contact.module.css';
import { PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { FormEventHandler, useState } from 'react';
import { SectionCard } from '../components/section-card';
import { RadioInput } from '../components/input/radio';
import {
  EditingState,
  ticketsAppFormMachine,
} from './tickets-app-form-machine';
import AppForms from './forms/app';
import PriceAndTicketTypesForm from './forms/priceAndTicketTypesForm';
import { Button } from '@atb/components/button';

const TicketsAppContent = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(ticketsAppFormMachine);

  // Local state to force re-render to display errors.
  const [forceRerender, setForceRerender] = useState(false);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    send({ type: 'VALIDATE' });

    // Force a re-render with dummy state.
    if (Object.keys(state.context.errorMessages).length > 0) {
      setForceRerender(!forceRerender);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <SectionCard title={t(PageText.Contact.ticketsApp.title)}>
        <ul className={style.form_options__list}>
          {Object.values(EditingState).map((editingState) => (
            <li key={editingState}>
              <RadioInput
                label={t(PageText.Contact.ticketsApp[editingState].description)}
                checked={state.matches({ editing: editingState })}
                onChange={(e) => {
                  send({
                    type: 'ON_SET_STATE',
                    target: editingState,
                  });
                }}
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
        />
      )}
    </form>
  );
};

export default TicketsAppContent;
