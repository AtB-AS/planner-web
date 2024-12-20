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
import { FormEventHandler, useState } from 'react';
import { Radio, SectionCard } from '../components';
import style from '../contact.module.css';

const MeansOfTransportContent = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(meansOfTransportFormMachine);

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
    <form onSubmit={onSubmit} className={style.form}>
      <SectionCard title={t(PageText.Contact.modeOfTransport.title)}>
        <ul className={style.form_options__list}>
          {Object.values(FormType).map((formType) => (
            <li key={formType}>
              <Radio
                label={t(
                  PageText.Contact.modeOfTransport[formType].description,
                )}
                value={formType}
                checked={state.context.formType === formType}
                onChange={(e) =>
                  send({
                    type: 'ON_INPUT_CHANGE',
                    inputName: 'formType',
                    value: e.target.value,
                  })
                }
              />
            </li>
          ))}
        </ul>
      </SectionCard>

      {state.context.formType === 'driver' && (
        <DriverForm state={state} send={send} />
      )}
      {state.context.formType === 'transportation' && (
        <TransportationForm state={state} send={send} />
      )}
      {state.context.formType === 'delay' && (
        <DelayForm state={state} send={send} />
      )}
      {state.context.formType === 'stop' && (
        <StopForm state={state} send={send} />
      )}
      {state.context.formType === 'serviceOffering' && (
        <ServiceOfferingForm state={state} send={send} />
      )}
      {state.context.formType === 'injury' && (
        <InjuryForm state={state} send={send} />
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

export default MeansOfTransportContent;
