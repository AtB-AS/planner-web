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
  TimeSelector,
  Radio,
  FieldWrapperWithError,
} from '../../components';

type TransportationFormProps = {
  state: { context: MeansOfTransportContextProps };
  send: (event: typeof meansOfTransportFormEvents) => void;
};

export const TransportationForm = ({
  state,
  send,
}: TransportationFormProps) => {
  const { t } = useTranslation();
  const { getLinesByMode, getQuaysByLine } = useLines();

  return (
    <>
      <Fieldset
        title={t(PageText.Contact.modeOfTransport.transportation.description)}
      >
        <Typo.p textType="body__primary">
          {t(PageText.Contact.modeOfTransport.transportation.info)}
        </Typo.p>
      </Fieldset>

      <Fieldset
        title={t(PageText.Contact.modeOfTransport.transportation.about.title)}
      >
        <Typo.p textType="body__primary">
          {t(PageText.Contact.modeOfTransport.transportation.about.description)}
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
          id="fromStop"
          label={t(PageText.Contact.input.fromStop.label)}
          value={state.context.fromStop}
          isDisabled={!state.context.line}
          onChange={(value) => {
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'fromStop',
              value: value,
            });
          }}
          options={getStopOptions(getQuaysByLine(state.context.line?.id ?? ''))}
          placeholder={t(PageText.Contact.input.fromStop.optionLabel)}
          isRequired
          error={
            state.context?.errorMessages['fromStop']?.[0]
              ? t(state.context?.errorMessages['fromStop']?.[0])
              : undefined
          }
        />

        <SearchableSelect
          id="toStop"
          label={t(PageText.Contact.input.toStop.label)}
          value={state.context.toStop}
          isDisabled={!state.context.line}
          onChange={(value) => {
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'toStop',
              value: value,
            });
          }}
          placeholder={t(PageText.Contact.input.toStop.optionLabel)}
          options={getStopOptions(getQuaysByLine(state.context.line?.id ?? ''))}
          isRequired
          error={
            state.context?.errorMessages['toStop']?.[0]
              ? t(state.context?.errorMessages['toStop']?.[0])
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
          errorMessage={state.context?.errorMessages['date']?.[0]}
        />

        <TimeSelector
          id="plannedDepartureTime"
          isRequired
          label={t(PageText.Contact.input.plannedDepartureTime.label)}
          value={state.context.plannedDepartureTime}
          onChange={(time: string) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'plannedDepartureTime',
              value: time,
            })
          }
          errorMessage={
            state.context?.errorMessages['plannedDepartureTime']?.[0]
          }
        />
      </Fieldset>

      <Fieldset title={t(PageText.Contact.input.feedback.title)} isRequired>
        <Textarea
          description={t(PageText.Contact.input.feedback.description)}
          id="feedback"
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
      <Fieldset
        title={t(PageText.Contact.aboutYouInfo.optionalTitle)}
        isRequired
      >
        <FieldWrapperWithError
          errorMessage={state.context?.errorMessages['isResponseWanted']?.[0]}
        >
          <Radio
            label={t(PageText.Contact.input.wantedResponse.options.yes)}
            checked={state.context.isResponseWanted === true}
            onChange={() =>
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'isResponseWanted',
                value: true,
              })
            }
          />

          <Radio
            label={t(PageText.Contact.input.wantedResponse.options.no)}
            checked={state.context.isResponseWanted === false}
            onChange={() =>
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'isResponseWanted',
                value: false,
              })
            }
          />
        </FieldWrapperWithError>

        {state.context.isResponseWanted && (
          <>
            <Input
              id="firstName"
              label={t(PageText.Contact.input.firstName.label)}
              type="text"
              name="firstName"
              isRequired
              value={state.context.firstName || ''}
              errorMessage={state.context?.errorMessages['firstName']?.[0]}
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
              isRequired
              value={state.context.lastName || ''}
              errorMessage={state.context?.errorMessages['lastName']?.[0]}
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
              isRequired
              value={state.context.email || ''}
              errorMessage={state.context?.errorMessages['email']?.[0]}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'email',
                  value: e.target.value,
                })
              }
            />
          </>
        )}
      </Fieldset>
    </>
  );
};

export default TransportationForm;
