import { useMachine } from '@xstate/react';
import { meansOfTransportFormMachine } from './means-of-transport-form-machine';
import ModeOfTransportFormSelector from './means-of-transport-form-selector';
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

export const MeansOfTransportContent = () => {
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
    <form onSubmit={onSubmit}>
      <ModeOfTransportFormSelector state={state} send={send} />
      {state.hasTag('driverForm') && <DriverForm state={state} send={send} />}
      {state.hasTag('transportationForm') && (
        <TransportationForm state={state} send={send} />
      )}
      {state.hasTag('delayForm') && <DelayForm state={state} send={send} />}
      {state.hasTag('stopForm') && <StopForm state={state} send={send} />}
      {state.hasTag('serviceOfferingForm') && (
        <ServiceOfferingForm state={state} send={send} />
      )}
      {state.hasTag('injuryForm') && <InjuryForm state={state} send={send} />}
      {state.hasTag('selected') && (
        <Button
          title={t(PageText.Contact.submit)}
          mode={'interactive_0--bordered'}
          buttonProps={{ type: 'submit' }}
        />
      )}
      {state.hasTag('success') && <div>success!</div>}
    </form>
  );
};

export default MeansOfTransportContent;
