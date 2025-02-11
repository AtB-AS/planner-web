import { useMachine } from '@xstate/react';
import {
  FormType,
  meansOfTransportFormMachine,
} from './means-of-transport-form-machine';
import {
  DelayForm,
  DriverForm,
  InjuryForm,
  ServiceOfferingForm,
  StopForm,
  TransportationForm,
} from './forms';
import { Button } from '@atb/components/button';
import { PageText, useTranslation } from '@atb/translations';
import { FormEventHandler } from 'react';
import { Radio, SectionCard } from '../components';
import style from '../contact.module.css';

const MeansOfTransportContent = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(meansOfTransportFormMachine);
  const displaySubmitButton = state.context.formType;

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    send({ type: 'SUBMIT' });
  };

  return (
    <form onSubmit={onSubmit} className={style.form}>
      <SectionCard title={t(PageText.Contact.modeOfTransport.title)}>
        <ul className={style.form_options__list}>
          {Object.values(FormType).map((formType) => (
            <li key={formType}>
              <Radio
                label={t(
                  PageText.Contact.modeOfTransport[formType].description,
                )}
                checked={state.matches({ editing: formType })}
                onChange={() =>
                  send({
                    type: 'SELECT_FORM_TYPE',
                    formType: formType,
                  })
                }
              />
            </li>
          ))}
        </ul>
      </SectionCard>

      {state.matches({ editing: 'driver' }) && (
        <DriverForm state={state} send={send} />
      )}
      {state.matches({ editing: 'transportation' }) && (
        <TransportationForm state={state} send={send} />
      )}
      {state.matches({ editing: 'delay' }) && (
        <DelayForm state={state} send={send} />
      )}
      {state.matches({ editing: 'stop' }) && (
        <StopForm state={state} send={send} />
      )}
      {state.matches({ editing: 'serviceOffering' }) && (
        <ServiceOfferingForm state={state} send={send} />
      )}
      {state.matches({ editing: 'injury' }) && (
        <InjuryForm state={state} send={send} />
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

export default MeansOfTransportContent;
