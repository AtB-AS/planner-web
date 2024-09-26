import FormSelector from './form-selector';
import { SectionCard } from '../components/section-card';
import { ComponentText, PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { fetchMachine } from './travelGuaranteeFormMachine';
import { Input } from '../components/input';
import { TransportModeType } from '@atb-as/config-specs';
import { useLines } from '../lines/use-lines';
import { FormEventHandler, useState } from 'react';
import style from '../contact.module.css';
import { Button } from '@atb/components/button';
import Select from '../components/input/select';
import { Line } from '..';
import { Checkbox } from '../components/input/checkbox';
import ErrorMessage from '../components/input/error-message';

export const RefundForm = () => {
  const { t } = useTranslation();
  const { getLinesByMode, getQuaysByLine } = useLines();
  const [state, send] = useMachine(fetchMachine);

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
      <FormSelector state={state} send={send} />
      {(state.hasTag('taxi') || state.hasTag('car')) && (
        <SectionCard
          title={
            PageText.Contact.travelGuarantee.refundTaxi.aboutYourTrip.title
          }
        >
          <Select
            label={t(
              PageText.Contact.inputFields.transportMode.label,
            ).toString()}
            value={state.context.transportMode}
            onChange={(value) =>
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'transportMode',
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
                type: 'ON_INPUT_CHANGE',
                inputName: 'line',
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
                type: 'ON_INPUT_CHANGE',
                inputName: 'fromStop',
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
                type: 'ON_INPUT_CHANGE',
                inputName: 'toStop',
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
                type: 'ON_INPUT_CHANGE',
                inputName: 'date',
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
                type: 'ON_INPUT_CHANGE',
                inputName: 'plannedDepartureTime',
                value: e.target.value,
              })
            }
          />

          <Select
            label={t(
              PageText.Contact.inputFields.reasonForTransportFailure.label,
            )}
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
              PageText.Contact.inputFields.reasonForTransportFailure
                .optionLabel,
            )}
            options={
              PageText.Contact.inputFields.reasonForTransportFailure.options
            }
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
      )}

      {state.hasTag('car') && (
        <SectionCard
          title={
            PageText.Contact.travelGuarantee.refundCar.aboutTheCarTrip.title
          }
        >
          <Input
            label={PageText.Contact.inputFields.kilometersDriven.label}
            type="text"
            name="km"
            value={state.context.kilometersDriven}
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
        </SectionCard>
      )}
      {state.hasTag('selected') && (
        <div>
          <SectionCard
            title={PageText.Contact.inputFields.feedback.optionalTitle}
          >
            <textarea
              className={style.feedback}
              name="feedback"
              value={state.context.feedback}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'feedback',
                  value: e.target.value,
                })
              }
            />
          </SectionCard>
          <SectionCard title={PageText.Contact.aboutYouInfo.title}>
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
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'firstName',
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
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'lastName',
                  value: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.inputFields.address.label}
              type="text"
              name="address"
              value={state.context.address}
              errorMessage={
                state.context?.errorMessages['address']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'address',
                  value: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.inputFields.postalCode.label}
              type="number"
              name="postalCode"
              value={state.context.postalCode}
              errorMessage={
                state.context?.errorMessages['postalCode']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'postalCode',
                  value: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.inputFields.city.label}
              type="text"
              name="city"
              value={state.context.city}
              errorMessage={
                state.context?.errorMessages['city']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'city',
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
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'email',
                  value: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.inputFields.phoneNumber.label}
              type="tel"
              name="phoneNumber"
              value={state.context.phoneNumber}
              errorMessage={
                state.context?.errorMessages['phoneNumber']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'phoneNumber',
                  value: e.target.value,
                })
              }
            />

            {!state.context.hasInternationalBankAccount && (
              <Input
                label={
                  PageText.Contact.inputFields.bankAccountNumber.notForeignLabel
                }
                type="text"
                name="bankAccountNumber"
                value={state.context.bankAccountNumber}
                errorMessage={
                  state.context?.errorMessages['bankAccountNumber']?.[0] ||
                  undefined
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

            <Checkbox
              label={t(PageText.Contact.inputFields.bankAccountNumber.checkbox)}
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
                  label={PageText.Contact.inputFields.bankAccountNumber.IBAN}
                  type="text"
                  name="bankAccountNumber"
                  value={state.context.IBAN}
                  onChange={(e) =>
                    send({
                      type: 'ON_INPUT_CHANGE',
                      inputName: 'IBAN',
                      value: e.target.value,
                    })
                  }
                />

                <Input
                  label={PageText.Contact.inputFields.bankAccountNumber.SWIFT}
                  type="text"
                  name="bankAccountNumber"
                  value={state.context.SWIFT}
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

          <Button
            title={t(PageText.Contact.submit)}
            mode={'interactive_0--bordered'}
            buttonProps={{ type: 'submit' }}
            state={state.matches('submitting') ? 'loading' : undefined}
          />
        </div>
      )}
    </form>
  );
};

export default RefundForm;
