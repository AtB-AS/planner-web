import { PageText, useTranslation } from '@atb/translations';
import { MeansOfTransportContextProps } from '../means-of-transport-form-machine';
import { useLines } from '../../lines/use-lines';
import { Typo } from '@atb/components/typography';
import { TransportModeType } from '../../types';
import { Line } from '../..';
import { meansOfTransportFormEvents } from '../events';
import {
  Fieldset,
  Select,
  Input,
  Textarea,
  SearchableSelect,
  getLineOptions,
  getStopOptions,
  DateSelector,
} from '../../components';

type StopFormProps = {
  state: { context: MeansOfTransportContextProps };
  send: (event: typeof meansOfTransportFormEvents) => void;
};

export const StopForm = ({ state, send }: StopFormProps) => {
  const { t } = useTranslation();
  const { getLinesByMode, getQuaysByLine } = useLines();

  return (
    <>
      <Fieldset title={t(PageText.Contact.modeOfTransport.stop.description)}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.modeOfTransport.stop.info)}
        </Typo.p>
      </Fieldset>

      <Fieldset title={t(PageText.Contact.modeOfTransport.stop.about.title)}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.modeOfTransport.stop.about.description)}
        </Typo.p>

        <Select
          id="transportMode"
          label={t(PageText.Contact.input.transportMode.label)}
          value={state.context.transportMode || ''}
          onChange={(value) =>
            send({
              type: 'ON_TRANSPORTMODE_CHANGE',
              value: value as TransportModeType,
            })
          }
          isRequired
          error={
            state.context?.errorMessages['transportMode']?.[0]
              ? t(state.context?.errorMessages['transportMode']?.[0])
              : undefined
          }
          valueToId={(val: string) => val}
          valueToText={(val: string) =>
            t(
              PageText.Contact.input.transportMode.modes[
                val as TransportModeType
              ],
            )
          }
          options={['bus', 'expressboat', 'ferry']}
          placeholder={t(PageText.Contact.input.transportMode.optionLabel)}
        />

        <SearchableSelect
          id="line"
          label={t(PageText.Contact.input.line.label)}
          value={state.context.line}
          placeholder={t(PageText.Contact.input.line.optionLabel)}
          isDisabled={!state.context.transportMode}
          options={getLineOptions(
            getLinesByMode(state.context.transportMode as TransportModeType),
          )}
          onChange={(value: Line | undefined) => {
            send({
              type: 'ON_LINE_CHANGE',
              value: value,
            });
          }}
          isRequired
          error={
            state.context?.errorMessages['line']?.[0] &&
            t(state.context?.errorMessages['line']?.[0])
          }
        />

        <SearchableSelect
          id="stop"
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
          isRequired
          error={
            state.context?.errorMessages['stop']?.[0]
              ? t(state.context?.errorMessages['stop']?.[0])
              : undefined
          }
        />

        <DateSelector
          id="date"
          label={t(PageText.Contact.input.date.label)}
          isRequired
          value={state.context.date}
          onChange={(date) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'date',
              value: date,
            })
          }
        />
      </Fieldset>

      <Fieldset title={t(PageText.Contact.input.feedback.title)}>
        <Textarea
          id="feedback"
          description={t(PageText.Contact.input.feedback.description)}
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
              ? t(state.context.errorMessages['feedback']?.[0])
              : undefined
          }
          fileInputProps={{
            id: 'attachments',
            name: 'attachments',
            label: t(PageText.Contact.input.feedback.attachment),
            onChange: (files) => {
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'attachments',
                value: files,
              });
            },
          }}
        />
      </Fieldset>
      <Fieldset title={t(PageText.Contact.aboutYouInfo.optionalTitle)}>
        <Input
          id="firstName"
          label={t(PageText.Contact.input.firstName.label)}
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
          id="lastName"
          label={t(PageText.Contact.input.lastName.label)}
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
          id="email"
          label={t(PageText.Contact.input.email.label)}
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
      </Fieldset>
    </>
  );
};

export default StopForm;
