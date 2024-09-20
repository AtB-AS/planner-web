import { PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { modeOfTransportFormMachine } from './mode-of-transport-form-machine';
import { useLines } from '../lines/use-lines';
import { FormEventHandler, useState } from 'react';
import ModeOfTransportFormSelector from './mode-of-transport-form-selector';
import { SectionCard } from '../components/section-card';
import { Typo } from '@atb/components/typography';
import Select from '../components/input/select';
import { ComponentText } from '@atb/translations';
import { Input } from '../components/input';
import { TransportModeType } from '@atb-as/config-specs';
import style from '../contact.module.css';
import { Button } from '@atb/components/button';
import { Line } from '..';
import { Checkbox } from '../components/input/checkbox';
import ErrorMessage from '../components/input/error-message';

export const ModsOfTransportContent = () => {
  const { t } = useTranslation();
  const { getLinesByMode, getQuaysByLine } = useLines();
  const [state, send] = useMachine(modeOfTransportFormMachine);

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
      {state.hasTag('driverCrewFeedback') && (
        <div>
          <SectionCard
            title={
              PageText.Contact.modeOfTransport.driverCrewFeedback.aboutTheTrip
                .title
            }
          >
            <Typo.p textType="body__primary">
              {t(
                PageText.Contact.modeOfTransport.driverCrewFeedback.aboutTheTrip
                  .description,
              )}
            </Typo.p>

            <Select
              label={t(PageText.Contact.inputFields.routeArea.label).toString()}
              value={state.context.routeArea}
              valueToId={(option) => option.id}
              valueToText={(option) => t(option.name)}
              onChange={(value) => {
                if (!value) return;
                send({
                  type: 'UPDATE_FIELD',
                  field: 'routeArea',
                  value: value,
                });
              }}
              placeholder={t(
                PageText.Contact.inputFields.routeArea.optionLabel,
              )}
              options={PageText.Contact.inputFields.routeArea.options}
              error={
                state.context?.errorMessages['reasonForTransportFailure']?.[0]
                  ? t(
                      state.context?.errorMessages[
                        'reasonForTransportFailure'
                      ]?.[0],
                    )
                  : undefined
              }
            />
            <Select
              label={t(
                PageText.Contact.inputFields.transportMode.label,
              ).toString()}
              value={state.context.transportMode}
              onChange={(value) =>
                send({
                  type: 'UPDATE_FIELD',
                  field: 'transportMode',
                  value: value as TransportModeType,
                })
              }
              error={
                state.context?.errorMessages['transportMode']?.[0]
                  ? t(state.context?.errorMessages['transportMode']?.[0])
                  : undefined
              }
              valueToText={(val: TransportModeType) =>
                t(ComponentText.TransportMode.modes[val])
              }
              valueToId={(val: TransportModeType) => val}
              options={['bus', 'water'] as TransportModeType[]}
              placeholder={t(
                PageText.Contact.inputFields.transportMode.optionLabel,
              )}
            />

            <Select
              label={t(PageText.Contact.inputFields.line.label)}
              value={state.context.line}
              disabled={!state.context.transportMode}
              onChange={(value: Line | undefined) => {
                if (!value) return;
                send({
                  type: 'UPDATE_FIELD',
                  field: 'line',
                  value: value,
                });
              }}
              options={getLinesByMode(
                state.context.transportMode as TransportModeType,
              )}
              valueToId={(line: Line) => line.id}
              valueToText={(line: Line) => line.name}
              placeholder={t(PageText.Contact.inputFields.line.optionLabel)}
              error={
                state.context?.errorMessages['line']?.[0]
                  ? t(state.context?.errorMessages['line']?.[0])
                  : undefined
              }
            />

            <Select
              label={t(PageText.Contact.inputFields.fromStop.label)}
              value={state.context.fromStop}
              disabled={!state.context.line}
              onChange={(value) => {
                if (!value) return;
                send({
                  type: 'UPDATE_FIELD',
                  field: 'fromStop',
                  value: value,
                });
              }}
              options={
                state.context.line?.id
                  ? getQuaysByLine(state.context.line.id)
                  : []
              }
              placeholder={t(PageText.Contact.inputFields.fromStop.optionLabel)}
              error={
                state.context?.errorMessages['fromStop']?.[0]
                  ? t(state.context?.errorMessages['fromStop']?.[0])
                  : undefined
              }
              valueToId={(quay: Line['quays'][0]) => quay.id}
              valueToText={(quay: Line['quays'][0]) => quay.name}
            />

            <Select
              label={t(PageText.Contact.inputFields.toStop.label)}
              value={state.context.toStop}
              disabled={!state.context.line}
              onChange={(value) => {
                if (!value) return;
                send({
                  type: 'UPDATE_FIELD',
                  field: 'toStop',
                  value: value,
                });
              }}
              placeholder={t(PageText.Contact.inputFields.toStop.optionLabel)}
              options={
                state.context.line?.id
                  ? getQuaysByLine(state.context.line.id)
                  : []
              }
              error={
                state.context?.errorMessages['toStop']?.[0]
                  ? t(state.context?.errorMessages['toStop']?.[0])
                  : undefined
              }
              valueToId={(quay: Line['quays'][0]) => quay.id}
              valueToText={(quay: Line['quays'][0]) => quay.name}
            />

            <Input
              label={PageText.Contact.inputFields.date}
              type="date"
              name="date"
              value={state.context.date}
              onChange={(e) =>
                send({
                  type: 'UPDATE_FIELD',
                  field: 'date',
                  value: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.inputFields.plannedDepartureTime}
              type="time"
              name="time"
              value={state.context.plannedDepartureTime}
              onChange={(e) =>
                send({
                  type: 'UPDATE_FIELD',
                  field: 'plannedDepartureTime',
                  value: e.target.value,
                })
              }
            />
          </SectionCard>
        </div>
      )}
      {state.hasTag('transportFeedback') && <div>transportFeedback</div>}
      {state.hasTag('delayEarlyCancellationReport') && (
        <div>delayEarlyCancellationReport</div>
      )}
      {state.hasTag('stopDockFeedback') && <div>stopDockFeedback</div>}
      {state.hasTag('routeOfferFeedback') && <div>routeOfferFeedback</div>}
      {state.hasTag('incidentReport') && <div>incidentReport</div>}
      {state.hasTag('selected') && (
        <div>
          <SectionCard
            title={PageText.Contact.inputFields.feedback.title}
          ></SectionCard>
          <SectionCard
            title={PageText.Contact.inputFields.feedback.optionalTitle}
          >
            <Input
              label={PageText.Contact.inputFields.firstName.label}
              type="text"
              name="firstName"
              value={state.context.firstName}
              errorMessage={
                state.context?.errorMessages['firstName']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'UPDATE_FIELD',
                  field: 'firstName',
                  value: e.target.value,
                })
              }
            />

            <Input
              label={PageText.Contact.inputFields.lastName.label}
              type="text"
              name="lastName"
              value={state.context.lastName}
              errorMessage={
                state.context?.errorMessages['lastName']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'UPDATE_FIELD',
                  field: 'lastName',
                  value: e.target.value,
                })
              }
            />

            <Input
              label={PageText.Contact.inputFields.email.label}
              type="email"
              name="email"
              value={state.context.email}
              errorMessage={
                state.context?.errorMessages['email']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'UPDATE_FIELD',
                  field: 'email',
                  value: e.target.value,
                })
              }
            />
          </SectionCard>
          <Button
            title={t(PageText.Contact.submit)}
            mode={'interactive_0--bordered'}
            buttonProps={{ type: 'submit' }}
          />
        </div>
      )}
    </form>
  );
};

export default ModsOfTransportContent;
