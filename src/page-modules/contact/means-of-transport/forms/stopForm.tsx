import { PageText, useTranslation } from '@atb/translations';
import { ContextProps } from '../means-of-transport-form-machine';
import { useLines } from '../../lines/use-lines';
import { Typo } from '@atb/components/typography';
import { ComponentText } from '@atb/translations';
import { TransportModeType } from '@atb-as/config-specs';
import { Line } from '../..';
import { meansOfTransportFormEvents } from '../events';
import {
  SectionCard,
  Select,
  Input,
  FileInput,
  Textarea,
  SearchableSelect,
  getLineOptions,
  getStopOptions,
} from '../../components';

type StopFormProps = {
  state: { context: ContextProps };
  send: (event: typeof meansOfTransportFormEvents) => void;
};

export const StopForm = ({ state, send }: StopFormProps) => {
  const { t } = useTranslation();
  const { getLinesByMode, getQuaysByLine } = useLines();

  return (
    <div>
      <SectionCard title={t(PageText.Contact.modeOfTransport.stop.description)}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.modeOfTransport.stop.info)}
        </Typo.p>
      </SectionCard>

      <SectionCard title={t(PageText.Contact.modeOfTransport.stop.about.title)}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.modeOfTransport.stop.about.description)}
        </Typo.p>

        <Select
          label={t(PageText.Contact.input.transportMode.label).toString()}
          value={state.context.transportMode}
          onChange={(value) =>
            send({
              type: 'ON_TRANSPORTMODE_CHANGE',
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
          placeholder={t(PageText.Contact.input.transportMode.optionLabel)}
        />

        <SearchableSelect
          label={t(PageText.Contact.input.line.label)}
          value={state.context.line}
          isDisabled={!state.context.transportMode}
          onChange={(value: Line | undefined) => {
            send({
              type: 'ON_LINE_CHANGE',
              value: value,
            });
          }}
          options={getLineOptions(
            getLinesByMode(state.context.transportMode as TransportModeType),
          )}
          placeholder={t(PageText.Contact.input.line.optionLabel)}
          error={
            state.context?.errorMessages['line']?.[0]
              ? t(state.context?.errorMessages['line']?.[0])
              : undefined
          }
        />

        <SearchableSelect
          label={t(PageText.Contact.input.stop.label)}
          value={state.context.stop}
          isDisabled={!state.context.line}
          onChange={(value) => {
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'stop',
              value: value,
            });
          }}
          options={getStopOptions(getQuaysByLine(state.context.line?.id ?? ''))}
          placeholder={t(PageText.Contact.input.fromStop.optionLabel)}
          error={
            state.context?.errorMessages['fromStop']?.[0]
              ? t(state.context?.errorMessages['fromStop']?.[0])
              : undefined
          }
        />

        <Input
          label={PageText.Contact.input.date.label}
          type="date"
          name="date"
          value={state.context.date}
          errorMessage={state.context?.errorMessages['date']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'date',
              value: e.target.value,
            })
          }
        />
      </SectionCard>

      <SectionCard title={t(PageText.Contact.input.feedback.title)}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.input.feedback.description)}
        </Typo.p>
        <Textarea
          value={state.context.feedback || ''}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'feedback',
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
          label={t(PageText.Contact.input.feedback.attachment)}
          onChange={(files) => {
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'attachments',
              value: files,
            });
          }}
        />
      </SectionCard>
      <SectionCard title={t(PageText.Contact.aboutYouInfo.optionalTitle)}>
        <Input
          label={PageText.Contact.input.firstName.label}
          type="text"
          name="firstName"
          value={state.context.firstName || ''}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'firstName',
              value: e.target.value,
            })
          }
        />

        <Input
          label={PageText.Contact.input.lastName.label}
          type="text"
          name="lastName"
          value={state.context.lastName || ''}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'lastName',
              value: e.target.value,
            })
          }
        />

        <Input
          label={PageText.Contact.input.email.label}
          type="email"
          name="email"
          value={state.context.email || ''}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'email',
              value: e.target.value,
            })
          }
        />
      </SectionCard>
    </div>
  );
};

export default StopForm;
