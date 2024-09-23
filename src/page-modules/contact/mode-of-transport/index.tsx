import { useMachine } from '@xstate/react';
import { modeOfTransportFormMachine } from './mode-of-transport-form-machine';
import ModeOfTransportFormSelector from './mode-of-transport-form-selector';
import {
  DelayForm,
  DriverForm,
  InjuryForm,
  ServiceOfferingForm,
  StopForm,
  TransportationForm,
} from './forms';

export const ModsOfTransportContent = () => {
  const [state, send] = useMachine(modeOfTransportFormMachine);

  return (
    <div>
      <ModeOfTransportFormSelector state={state} send={send} />
      {state.hasTag('driverForm') && <DriverForm />}
      {state.hasTag('transportationForm') && <TransportationForm />}
      {state.hasTag('delayForm') && <DelayForm />}
      {state.hasTag('stopForm') && <StopForm />}
      {state.hasTag('serviceOfferingForm') && <ServiceOfferingForm />}
      {state.hasTag('injuryForm') && <InjuryForm />}
      {state.hasTag('success') && <div>success!</div>}
    </div>
  );
};

export default ModsOfTransportContent;
