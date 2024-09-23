import { PageText, useTranslation } from '@atb/translations';
import { ContextProps } from '../mode-of-transport-form-machine';
import { useLines } from '../../lines/use-lines';
import { FormEventHandler, useState } from 'react';
import { SectionCard } from '../../components/section-card';
import { Typo } from '@atb/components/typography';
import Select from '../../components/input/select';
import { ComponentText } from '@atb/translations';
import { Input } from '../../components/input';
import { TransportModeType } from '@atb-as/config-specs';
import { Button } from '@atb/components/button';
import { Line } from '../..';
import { FileInput } from '../../components/input/file';
import { Textarea } from '../../components/input/textarea';
import { machineEvents } from '../../machineEvents';

type ServiceOfferingFormProps = {
  state: {
    hasTag(arg0: string): boolean | undefined;
    context: ContextProps;
  };
  send: (event: typeof machineEvents) => void;
};

export const ServiceOfferingForm = ({
  state,
  send,
}: ServiceOfferingFormProps) => {
  const { t } = useTranslation();
  const { getLinesByMode, getQuaysByLine } = useLines();

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
      <SectionCard
        title={PageText.Contact.modeOfTransport.serviceOfferingForm.description}
      >
        <Typo.p textType="body__primary">
          {t(PageText.Contact.modeOfTransport.serviceOfferingForm.info)}
        </Typo.p>
      </SectionCard>

      <SectionCard
        title={PageText.Contact.modeOfTransport.serviceOfferingForm.about.title}
      >
        <Typo.p textType="body__primary">
          {t(
            PageText.Contact.modeOfTransport.serviceOfferingForm.about
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
          placeholder={t(PageText.Contact.inputFields.routeArea.optionLabel)}
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
          label={t(PageText.Contact.inputFields.transportMode.label).toString()}
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
      </SectionCard>

      <SectionCard title={PageText.Contact.inputFields.feedback.title}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.inputFields.feedback.description)}
        </Typo.p>
        <Textarea
          value={state.context.feedback}
          onChange={(e) =>
            send({
              type: 'UPDATE_FIELD',
              field: 'feedback',
              value: e.target.value,
            })
          }
          error={
            state.context.errorMessages['feedback']?.[0]
              ? t(state.context.errorMessages['feedback']?.[0]).toString()
              : undefined
          }
        />
        <FileInput
          name="attachments"
          label={t(PageText.Contact.inputFields.feedback.attachment)}
          onChange={(files) => {
            send({
              type: 'UPDATE_FIELD',
              field: 'attachments',
              value: files,
            });
          }}
        />
      </SectionCard>
      <SectionCard title={PageText.Contact.inputFields.feedback.optionalTitle}>
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
      </SectionCard>
      <Button
        title={t(PageText.Contact.submit)}
        mode={'interactive_0--bordered'}
        buttonProps={{ type: 'submit' }}
      />
    </form>
  );
};

export default ServiceOfferingForm;
