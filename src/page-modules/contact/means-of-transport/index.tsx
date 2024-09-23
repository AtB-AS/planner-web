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

export const MeansOfTransportContent = () => {
  const [state, send] = useMachine(meansOfTransportFormMachine);

  return (
    <div>
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
      {state.hasTag('success') && <div>success!</div>}
    </div>
  );
};

export default MeansOfTransportContent;
