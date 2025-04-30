import { PageText, useTranslation } from '@atb/translations';
import { useLines } from '../../../lines/use-lines';
import { TransportModeType } from '../../../types';
import { Line } from '../../..';
import { ReasonForTransportFailure, RefundFormEvents } from '../../events';
import { RefundContextProps } from '../../refundFormMachine';
import {
  Fieldset,
  Input,
  Select,
  Textarea,
  FileInput,
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
          label={t(PageText.Contact.input.kilometersDriven.label)}
          type="text"
          name="km"
          value={state.context.kilometersDriven || ''}
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
          label={t(PageText.Contact.input.fromAddress.label)}
          type="text"
          name="fromAddress"
          value={state.context.fromAddress || ''}
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
          label={t(PageText.Contact.input.toAddress.label)}
          type="toAddress"
          name="km"
          value={state.context.toAddress || ''}
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
          error={
            state.context?.errorMessages['fromStop']?.[0]
              ? t(state.context?.errorMessages['fromStop']?.[0])
              : undefined
          }
        />

        <SearchableSelect
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
          error={
            state.context?.errorMessages['toStop']?.[0]
              ? t(state.context?.errorMessages['toStop']?.[0])
              : undefined
          }
        />

        <DateSelector
          label={PageText.Contact.input.date.label}
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
          label={PageText.Contact.input.plannedDepartureTime.label}
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
            t(state.context.errorMessages['feedback']?.[0]).toString()
          }
        />
        <FileInput
          name="attachments"
          onChange={(files) => {
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'attachments',
              value: files,
            });
          }}
          label={t(PageText.Contact.input.feedback.attachment)}
        />
      </Fieldset>
      <Fieldset title={t(PageText.Contact.aboutYouInfo.title)}>
        <Input
          label={t(PageText.Contact.input.firstName.label)}
          type="text"
          autoComplete="given-name additional-name"
          name="firstName"
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
          label={t(PageText.Contact.input.lastName.label)}
          type="text"
          autoComplete="family-name"
          name="lastName"
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
          label={t(PageText.Contact.input.address.label)}
          type="text"
          autoComplete="street-address"
          name="address"
          value={state.context.address || ''}
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
          label={t(PageText.Contact.input.postalCode.label)}
          type="number"
          autoComplete="postal-code"
          name="postalCode"
          value={state.context.postalCode || ''}
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
          label={t(PageText.Contact.input.city.label)}
          type="text"
          name="city"
          value={state.context.city || ''}
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
          label={t(PageText.Contact.input.email.label)}
          type="email"
          autoComplete="email"
          name="email"
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

        <Input
          label={t(PageText.Contact.input.phoneNumber.label)}
          type="tel"
          name="phoneNumber"
          value={state.context.phoneNumber || ''}
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
          <div>
            <Input
              label={t(PageText.Contact.input.bankInformation.IBAN.label)}
              type="string"
              name="IBAN"
              value={state.context.IBAN || ''}
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
              label={t(PageText.Contact.input.bankInformation.SWIFT.label)}
              type="string"
              name="SWIFT"
              value={state.context.SWIFT || ''}
              errorMessage={state.context?.errorMessages['SWIFT']?.[0]}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'SWIFT',
                  value: e.target.value,
                })
              }
            />
          </div>
        )}
      </Fieldset>
    </>
  );
};

export default RefundCarForm;
