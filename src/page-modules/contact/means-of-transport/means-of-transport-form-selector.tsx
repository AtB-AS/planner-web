import { PageText, useTranslation } from '@atb/translations';
import { SectionCard } from '../components/section-card';
import { RadioInput } from '../components/input/radio';
import { ContextProps } from './means-of-transport-form-machine';
import { machineEvents } from '../machineEvents';

type MeansOfTransportFormSelectorProps = {
  state: {
    hasTag(arg0: string): boolean | undefined;
    context: ContextProps;
  };
  send: (event: typeof machineEvents) => void;
};

export const MeansOfTransportFormSelector = ({
  state,
  send,
}: MeansOfTransportFormSelectorProps) => {
  const { t } = useTranslation();

  return (
    <SectionCard title={PageText.Contact.travelGuarantee.title}>
      <ul>
        <RadioInput
          label={t(PageText.Contact.modeOfTransport.driverForm.description)}
          checked={state.hasTag('driverForm')}
          onChange={() => send({ type: 'DRIVER_FORM' })}
        />
        <RadioInput
          label={t(
            PageText.Contact.modeOfTransport.transportationForm.description,
          )}
          checked={state.hasTag('transportationForm')}
          onChange={() => send({ type: 'TRANSPORTATION_FORM' })}
        />
        <RadioInput
          label={t(PageText.Contact.modeOfTransport.delayForm.description)}
          checked={state.hasTag('delayForm')}
          onChange={() => send({ type: 'DELAY_FORM' })}
        />
        <RadioInput
          label={t(PageText.Contact.modeOfTransport.stopForm.description)}
          checked={state.hasTag('stopForm')}
          onChange={() => send({ type: 'STOP_FORM' })}
        />
        <RadioInput
          label={t(
            PageText.Contact.modeOfTransport.serviceOfferingForm.description,
          )}
          checked={state.hasTag('serviceOfferingForm')}
          onChange={() => send({ type: 'SERVICE_OFFERING_FORM' })}
        />
        <RadioInput
          label={t(PageText.Contact.modeOfTransport.injuryForm.description)}
          checked={state.hasTag('injuryForm')}
          onChange={() => send({ type: 'INJURY_FORM' })}
        />
      </ul>
    </SectionCard>
  );
};

export default MeansOfTransportFormSelector;
