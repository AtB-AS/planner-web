import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { SectionCard } from '../components/section-card';
import { RadioInput } from '../components/input/radio';

type FormSelectorProps = {
  state: any;
  send: any;
};

export const ModeOfTransportFormSelector = ({
  state,
  send,
}: FormSelectorProps) => {
  const { t } = useTranslation();

  return (
    <SectionCard title={PageText.Contact.travelGuarantee.title}>
      <ul>
        <RadioInput
          label={t(
            PageText.Contact.modeOfTransport.driverCrewFeedback.description,
          )}
          checked={state.hasTag('driverCrewFeedback')}
          onChange={() => send({ type: 'DRIVER_CREW_FEEDBACK' })}
        />
        <RadioInput
          label={t(
            PageText.Contact.modeOfTransport.transportFeedback.description,
          )}
          checked={state.hasTag('transportFeedback')}
          onChange={() => send({ type: 'TRANSPORT_FEEDBACK' })}
        />
        <RadioInput
          label={t(
            PageText.Contact.modeOfTransport.delayEarlyCancellationReport
              .description,
          )}
          checked={state.hasTag('delayEarlyCancellationReport')}
          onChange={() => send({ type: 'DELAY_EARLY_CANCELLATION_REPORT' })}
        />
        <RadioInput
          label={t(
            PageText.Contact.modeOfTransport.stopDockFeedback.description,
          )}
          checked={state.hasTag('stopDockFeedback')}
          onChange={() => send({ type: 'STOP_DOCK_FEEDBACK' })}
        />
        <RadioInput
          label={t(
            PageText.Contact.modeOfTransport.routeOfferFeedback.description,
          )}
          checked={state.hasTag('routeOfferFeedback')}
          onChange={() => send({ type: 'ROUTE_OFFER_FEEDBACK' })}
        />
        <RadioInput
          label={t(PageText.Contact.modeOfTransport.incidentReport.description)}
          checked={state.hasTag('incidentReport')}
          onChange={() => send({ type: 'INCIDENT_REPORT' })}
        />
      </ul>
    </SectionCard>
  );
};

export default ModeOfTransportFormSelector;
