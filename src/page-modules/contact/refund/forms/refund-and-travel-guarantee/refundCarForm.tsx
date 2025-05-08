import { PageText, useTranslation } from '@atb/translations';
import { useLines } from '../../../lines/use-lines';
import { TransportModeType, ReasonForTransportFailure } from '../../../types';
import { Line } from '../../..';
import { RefundFormEvents } from '../../events';
import { RefundContextProps } from '../../refundFormMachine';
import {
  Fieldset,
  Input,
  Select,
  Textarea,
  SearchableSelect,
  getLineOptions,
  getStopOptions,
  DateSelector,
  TimeSelector,
} from '../../../components';
import { Checkbox } from '@atb/components/checkbox';

type RefundCarFormProps = {
  state: { context: RefundContextProps };
  send: (event: typeof RefundFormEvents) => void;
};

export const RefundCarForm = ({ state, send }: RefundCarFormProps) => {
  const { t } = useTranslation();
  const { getLinesByMode, getQuaysByLine } = useLines();

  return (
    <>
      <Fieldset title={t(PageText.Contact.refund.refundTaxi.carTrip.title)}>
        <Input
          id="kilometersDriven"
          label={t(PageText.Contact.input.kilometersDriven.label)}
          type="text"
          name="kilometersDriven"
          value={state.context.kilometersDriven || ''}
          isRequired
          errorMessage={
            state.context?.errorMessages['kilometersDriven']?.[0] || undefined
          }
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'kilometersDriven',
              value: e.target.value,
            })
          }
        />
        <Input
          id="fromAddress"
          label={t(PageText.Contact.input.fromAddress.label)}
          type="text"
          name="fromAddress"
          value={state.context.fromAddress || ''}
          isRequired
          errorMessage={
            state.context?.errorMessages['fromAddress']?.[0] || undefined
          }
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'fromAddress',
              value: e.target.value,
            })
          }
        />
        <Input
          id="toAddress"
          label={t(PageText.Contact.input.toAddress.label)}
          type="text"
          name="toAddress"
          value={state.context.toAddress || ''}
          isRequired
          errorMessage={
            state.context?.errorMessages['toAddress']?.[0] || undefined
          }
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'toAddress',
              value: e.target.value,
            })
          }
        />
      </Fieldset>
      <Fieldset
        title={t(PageText.Contact.refund.refundTaxi.aboutYourTrip.title)}
      >
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

        <Select
          id="reasonForTransportFailure"
          label={t(PageText.Contact.input.reasonForTransportFailure.label)}
          value={state.context.reasonForTransportFailure}
          disabled={!state.context.line}
          onChange={(value) => {
            if (!value) return;
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'reasonForTransportFailure',
              value: value as ReasonForTransportFailure,
            });
          }}
          placeholder={t(
            PageText.Contact.input.reasonForTransportFailure.optionLabel,
          )}
          options={PageText.Contact.input.reasonForTransportFailure.options}
          isRequired
          error={
            state.context?.errorMessages['reasonForTransportFailure']?.[0]
              ? t(
                  state.context?.errorMessages[
                    'reasonForTransportFailure'
                  ]?.[0],
                )
              : undefined
          }
          valueToId={(option: ReasonForTransportFailure) => option.id}
          valueToText={(option: ReasonForTransportFailure) => t(option.name)}
        />
      </Fieldset>

      <Fieldset title={t(PageText.Contact.input.feedback.optionalTitle)}>
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
          autoComplete="given-name additional-name"
          name="firstName"
          value={state.context.firstName || ''}
          isRequired
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
          autoComplete="family-name"
          name="lastName"
          value={state.context.lastName || ''}
          isRequired
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
          id="address"
          label={t(PageText.Contact.input.address.label)}
          type="text"
          autoComplete="street-address"
          name="address"
          value={state.context.address || ''}
          isRequired
          errorMessage={state.context?.errorMessages['address']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'address',
              value: e.target.value,
            })
          }
        />
        <Input
          id="postalCode"
          label={t(PageText.Contact.input.postalCode.label)}
          type="text"
          autoComplete="postal-code"
          name="postalCode"
          value={state.context.postalCode || ''}
          isRequired
          errorMessage={state.context?.errorMessages['postalCode']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'postalCode',
              value: e.target.value,
            })
          }
        />
        <Input
          id="city"
          label={t(PageText.Contact.input.city.label)}
          type="text"
          name="city"
          value={state.context.city || ''}
          isRequired
          errorMessage={state.context?.errorMessages['city']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'city',
              value: e.target.value,
            })
          }
        />
        <Input
          id="email"
          label={t(PageText.Contact.input.email.label)}
          type="email"
          autoComplete="email"
          name="email"
          value={state.context.email || ''}
          isRequired
          errorMessage={state.context?.errorMessages['email']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'email',
              value: e.target.value,
            })
          }
        />

        <Input
          id="phoneNumber"
          label={t(PageText.Contact.input.phoneNumber.label)}
          type="tel"
          name="phoneNumber"
          value={state.context.phoneNumber || ''}
          isRequired
          errorMessage={state.context?.errorMessages['phoneNumber']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'phoneNumber',
              value: e.target.value,
            })
          }
        />

        <Input
          id="bankAccountNumber"
          label={t(
            PageText.Contact.input.bankInformation.bankAccountNumber.label,
          )}
          placeholder={t(
            PageText.Contact.input.bankInformation.bankAccountNumber
              .placeholder,
          )}
          type="text"
          name="bankAccountNumber"
          value={state.context.bankAccountNumber || ''}
          disabled={state.context.hasInternationalBankAccount}
          isRequired
          errorMessage={state.context?.errorMessages['bankAccountNumber']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'bankAccountNumber',
              value: e.target.value,
            })
          }
        />

        <Checkbox
          label={t(PageText.Contact.input.bankInformation.checkbox)}
          checked={state.context.hasInternationalBankAccount}
          onChange={() =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'hasInternationalBankAccount',
              value: !state.context.hasInternationalBankAccount,
            })
          }
        />

        {state.context.hasInternationalBankAccount && (
          <>
            <Input
              id="IBAN"
              label={t(PageText.Contact.input.bankInformation.IBAN.label)}
              type="string"
              name="IBAN"
              value={state.context.IBAN || ''}
              isRequired
              errorMessage={state.context?.errorMessages['IBAN']?.[0]}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'IBAN',
                  value: e.target.value,
                })
              }
            />

            <Input
              id="SWIFT"
              label={t(PageText.Contact.input.bankInformation.SWIFT.label)}
              type="string"
              name="SWIFT"
              value={state.context.SWIFT || ''}
              isRequired
              errorMessage={state.context?.errorMessages['SWIFT']?.[0]}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'SWIFT',
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

export default RefundCarForm;
