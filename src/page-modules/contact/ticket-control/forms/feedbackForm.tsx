import { PageText, useTranslation } from '@atb/translations';
import { Line } from '../..';
import { Typo } from '@atb/components/typography';
import { ticketControlFormEvents } from '../events';
import { TicketControlContextProps } from '../ticket-control-form-machine';
import { TransportModeType } from '../../types';
import { useLines } from '../../lines/use-lines';
import {
  Input,
  Textarea,
  Fieldset,
  Select,
  SearchableSelect,
  getLineOptions,
  getStopOptions,
  DateSelector,
  TimeSelector,
} from '../../components';

type FeedbackFormProps = {
  state: { context: TicketControlContextProps };
  send: (event: typeof ticketControlFormEvents) => void;
};

export const FeedbackForm = ({ state, send }: FeedbackFormProps) => {
  const { t } = useTranslation();
  const { getLinesByMode, getQuaysByLine } = useLines();

  return (
    <>
      <Fieldset title={t(PageText.Contact.ticketControl.feedback.title)}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.ticketControl.feedback.info)}
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
          error={
            state.context?.errorMessages['line']?.[0] &&
            t(state.context?.errorMessages['line']?.[0])
          }
        />

        <SearchableSelect
          id="fromStop"
          label={t(PageText.Contact.input.fromStop.optionalLabel)}
          value={state.context.fromStop}
          placeholder={t(PageText.Contact.input.fromStop.optionLabel)}
          isDisabled={!state.context.line}
          options={getStopOptions(getQuaysByLine(state.context.line?.id ?? ''))}
          onChange={(value) => {
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'fromStop',
              value: value,
            });
          }}
        />

        <SearchableSelect
          id="toStop"
          label={t(PageText.Contact.input.toStop.optionalLabel)}
          value={state.context.toStop}
          placeholder={t(PageText.Contact.input.toStop.optionLabel)}
          isDisabled={!state.context.line}
          options={getStopOptions(getQuaysByLine(state.context.line?.id ?? ''))}
          onChange={(value) => {
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'toStop',
              value: value,
            });
          }}
        />

        <DateSelector
          id="date"
          label={PageText.Contact.input.date.ticketControl.label}
          value={state.context.dateOfTicketControl}
          onChange={(dateOfTicketControl: string) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'dateOfTicketControl',
              value: dateOfTicketControl,
            })
          }
          errorMessage={
            state.context?.errorMessages['dateOfTicketControl']?.[0]
          }
        />

        <TimeSelector
          id="plannedDepartureTime"
          label={PageText.Contact.input.time.ticketControl.label}
          value={state.context.timeOfTicketControl || ''}
          onChange={(timeOfTicketControl: string) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'timeOfTicketControl',
              value: timeOfTicketControl,
            })
          }
          errorMessage={
            state.context?.errorMessages['timeOfTicketControl']?.[0]
          }
        />
      </Fieldset>
      <Fieldset title={t(PageText.Contact.input.feedback.title)}>
        <Textarea
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
            state.context.errorMessages['feedback']?.[0] &&
            t(state.context.errorMessages['feedback']?.[0])
          }
          fileInputProps={{
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

      <Fieldset title={t(PageText.Contact.aboutYouInfo.title)}>
        <Input
          id="firstName"
          label={t(PageText.Contact.input.firstName.label)}
          type="text"
          autoComplete="given-name additonal-name"
          name="firstName"
          value={state.context.firstName || ''}
          errorMessage={
            state.context?.errorMessages['firstName']?.[0] || undefined
          }
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
          autoComplete="family-name"
          name="lastName"
          value={state.context.lastName || ''}
          errorMessage={
            state.context?.errorMessages['lastName']?.[0] || undefined
          }
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
          errorMessage={state.context?.errorMessages['email']?.[0] || undefined}
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

export default FeedbackForm;
