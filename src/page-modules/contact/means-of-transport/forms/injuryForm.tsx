import { PageText, useTranslation } from '@atb/translations';
import { ContextProps } from '../means-of-transport-form-machine';
import { useLines } from '../../lines/use-lines';
import { SectionCard } from '../../components/section-card';
import { Typo } from '@atb/components/typography';
import Select from '../../components/input/select';
import { ComponentText } from '@atb/translations';
import { Input } from '../../components/input';
import { TransportModeType } from '@atb-as/config-specs';
import { Line } from '../..';
import { FileInput } from '../../components/input/file';
import { Textarea } from '../../components/input/textarea';
import { RadioInput } from '../../components/input/radio';
import { meansOfTransportFormEvents } from '../events';

type InjuryFormProps = {
  state: {
    hasTag(arg0: string): boolean | undefined;
    context: ContextProps;
  };
  send: (event: typeof meansOfTransportFormEvents) => void;
};

export const InjuryForm = ({ state, send }: InjuryFormProps) => {
  const { t } = useTranslation();
  const { getLinesByMode, getQuaysByLine } = useLines();

  return (
    <div>
      <SectionCard title={PageText.Contact.modeOfTransport.injury.description}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.modeOfTransport.injury.info)}
        </Typo.p>
      </SectionCard>
      <SectionCard title={PageText.Contact.modeOfTransport.injury.about.title}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.modeOfTransport.injury.about.description)}
        </Typo.p>

        <Select
          label={t(PageText.Contact.inputFields.area.label).toString()}
          value={state.context.area}
          valueToId={(option) => option.id}
          valueToText={(option) => t(option.name)}
          onChange={(value) => {
            if (!value) return;
            send({
              type: 'UPDATE_FIELD',
              field: 'area',
              value: value,
            });
          }}
          placeholder={t(PageText.Contact.inputFields.area.optionLabel)}
          options={PageText.Contact.inputFields.area.options}
          error={
            state.context?.errorMessages['area']?.[0]
              ? t(state.context?.errorMessages['area']?.[0])
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
            state.context.line?.id ? getQuaysByLine(state.context.line.id) : []
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
            state.context.line?.id ? getQuaysByLine(state.context.line.id) : []
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
      <SectionCard title={PageText.Contact.aboutYouInfo.optionalTitle}>
        <Input
          label={PageText.Contact.inputFields.firstName.label}
          type="text"
          name="firstName"
          value={state.context.firstName}
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
          onChange={(e) =>
            send({
              type: 'UPDATE_FIELD',
              field: 'lastName',
              value: e.target.value,
            })
          }
        />

        <Typo.p textType="body__primary">
          {t(PageText.Contact.inputFields.email.wantsToBeContacted.question)}
        </Typo.p>

        <RadioInput
          label={t(PageText.Contact.inputFields.email.wantsToBeContacted.yes)}
          name="wantsToBeContacted"
          checked={state.context.wantsToBeContacted}
          onChange={() =>
            send({
              type: 'TOGGLE',
              field: 'wantsToBeContacted',
            })
          }
        />
        <RadioInput
          label={t(PageText.Contact.inputFields.email.wantsToBeContacted.no)}
          name="wantsToBeContacted"
          checked={!state.context.wantsToBeContacted}
          onChange={() =>
            send({
              type: 'TOGGLE',
              field: 'wantsToBeContacted',
            })
          }
        />
        {state.context.wantsToBeContacted && (
          <Input
            label={PageText.Contact.inputFields.email.wantsToBeContacted.label}
            type="email"
            name="email"
            value={state.context.email}
            onChange={(e) =>
              send({
                type: 'UPDATE_FIELD',
                field: 'email',
                value: e.target.value,
              })
            }
          />
        )}
      </SectionCard>
    </div>
  );
};

export default InjuryForm;
