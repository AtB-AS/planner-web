import { SectionCard } from '../../components/section-card';
import { ComponentText, PageText, useTranslation } from '@atb/translations';
import { useLines } from '../../lines/use-lines';
import { TransportModeType } from '@atb-as/config-specs';
import { Input } from '../../components/input';
import { Line } from '../..';
import Select from '../../components/input/select';
import { TravelGuaranteeFormEvents } from '../events';
import { ContextProps } from '../travelGuaranteeFormMachine';
import ErrorMessage from '../../components/input/error-message';
import { Checkbox } from '../../components/input/checkbox';
import { Textarea } from '../../components/input/textarea';
import { FileInput } from '../../components/input/file';

type RefundCarFormProps = {
  state: { context: ContextProps };
  send: (event: typeof TravelGuaranteeFormEvents) => void;
};

export const RefundCarForm = ({ state, send }: RefundCarFormProps) => {
  const { t } = useTranslation();
  const { getLinesByMode, getQuaysByLine } = useLines();

  return (
    <div>
      <SectionCard
        title={t(
          PageText.Contact.travelGuarantee.refundTaxi.aboutYourTrip.title,
        )}
      >
        <Input
          label={PageText.Contact.input.kilometersDriven.label}
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
          label={PageText.Contact.input.fromAddress.label}
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
          label={PageText.Contact.input.toAddress.label}
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

        <Select
          label={t(PageText.Contact.input.line.label)}
          value={state.context.line}
          disabled={!state.context.transportMode}
          onChange={(value: Line | undefined) => {
            if (!value) return;
            send({
              type: 'ON_LINE_CHANGE',
              value: value,
            });
          }}
          options={getLinesByMode(
            state.context.transportMode as TransportModeType,
          )}
          valueToId={(line: Line) => line.id}
          valueToText={(line: Line) => line.name}
          placeholder={t(PageText.Contact.input.line.optionLabel)}
          error={
            state.context?.errorMessages['line']?.[0]
              ? t(state.context?.errorMessages['line']?.[0])
              : undefined
          }
        />

        <Select
          label={t(PageText.Contact.input.fromStop.label)}
          value={state.context.fromStop}
          disabled={!state.context.line}
          onChange={(value) => {
            if (!value) return;
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'fromStop',
              value: value,
            });
          }}
          options={
            state.context.line?.id ? getQuaysByLine(state.context.line.id) : []
          }
          placeholder={t(PageText.Contact.input.fromStop.optionLabel)}
          error={
            state.context?.errorMessages['fromStop']?.[0]
              ? t(state.context?.errorMessages['fromStop']?.[0])
              : undefined
          }
          valueToId={(quay: Line['quays'][0]) => quay.id}
          valueToText={(quay: Line['quays'][0]) => quay.name}
        />

        <Select
          label={t(PageText.Contact.input.toStop.label)}
          value={state.context.toStop}
          disabled={!state.context.line}
          onChange={(value) => {
            if (!value) return;
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'toStop',
              value: value,
            });
          }}
          placeholder={t(PageText.Contact.input.toStop.optionLabel)}
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
        <Input
          label={PageText.Contact.input.plannedDepartureTime.label}
          type="time"
          name="time"
          value={state.context.plannedDepartureTime}
          errorMessage={
            state.context?.errorMessages['plannedDepartureTime']?.[0]
          }
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'plannedDepartureTime',
              value: e.target.value,
            })
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
              value: value,
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
          valueToId={(option) => option.id}
          valueToText={(option) => t(option.name)}
        />
      </SectionCard>

      <SectionCard title={t(PageText.Contact.input.feedback.optionalTitle)}>
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
      </SectionCard>
      <SectionCard title={t(PageText.Contact.aboutYouInfo.title)}>
        <Input
          label={PageText.Contact.input.firstName.label}
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
          label={PageText.Contact.input.lastName.label}
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
          label={PageText.Contact.input.address.label}
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
          label={PageText.Contact.input.postalCode.label}
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
          label={PageText.Contact.input.city.label}
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
          label={PageText.Contact.input.email.label}
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
          label={PageText.Contact.input.phoneNumber.label}
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

        <Checkbox
          label={t(PageText.Contact.input.bankAccountNumber.checkbox)}
          checked={state.context.hasInternationalBankAccount}
          onChange={() =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'hasInternationalBankAccount',
              value: !state.context.hasInternationalBankAccount,
            })
          }
        />

        {!state.context.hasInternationalBankAccount && (
          <Input
            label={PageText.Contact.input.bankAccountNumber.notForeignLabel}
            type="number"
            name="bankAccountNumber"
            value={state.context.bankAccountNumber || ''}
            errorMessage={
              state.context?.errorMessages['bankAccountNumber']?.[0]
            }
            onChange={(e) =>
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'bankAccountNumber',
                value: e.target.value,
              })
            }
          />
        )}

        {state.context.hasInternationalBankAccount && (
          <div>
            <Input
              label={PageText.Contact.input.bankAccountNumber.IBAN}
              type="string"
              name="IBAN"
              value={state.context.IBAN || ''}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'IBAN',
                  value: e.target.value,
                })
              }
            />

            <Input
              label={PageText.Contact.input.bankAccountNumber.SWIFT}
              type="string"
              name="SWIFT"
              value={state.context.SWIFT || ''}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'SWIFT',
                  value: e.target.value,
                })
              }
            />
            {state.context?.errorMessages['bankAccountNumber']?.[0] && (
              <ErrorMessage
                message={t(
                  state.context?.errorMessages['bankAccountNumber']?.[0],
                )}
              />
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default RefundCarForm;
