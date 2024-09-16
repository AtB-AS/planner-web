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
  const { lines, getLinesByMode, getQuaysByLine } = useLines();
  const [state, send] = useMachine(fetchMachine);

  // Local state to force re-render to display errors.
  const [displayErrorsDummyState, setDisplayErrorsDummyState] = useState(true);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    send({ type: 'VALIDATE' });

    //// Force a re-render.
    if (Object.keys(state.context.errorMessages).length > 0) {
      setDisplayErrorsDummyState(!displayErrorsDummyState);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <FormSelector state={state} send={send} />
      {state.hasTag('taxi') && (
        <div>
          <SectionCard
            title={
              PageText.Contact.travelGuarantee.refundTaxi.information.title
            }
          ></SectionCard>
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
                  type: 'SET_TRANSPORT_MODE',
                  transportMode: value as TransportModeType,
                })
              }
              error={
                state.context?.errorMessages['transportMode']
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

            {state.context.transportMode && (
              <Select
                label={t(PageText.Contact.inputFields.line.label)}
                value={state.context.line}
                onChange={(value: Line | undefined) => {
                  if (!value) return;
                  send({
                    type: 'SET_LINE',
                    line: value,
                  });
                }}
                options={getLinesByMode(
                  state.context.transportMode as TransportModeType,
                )}
                valueToId={(line: Line) => line.id}
                valueToText={(line: Line) => line.name}
                placeholder={t(PageText.Contact.inputFields.line.optionLabel)}
                error={
                  state.context?.errorMessages['line']
                    ? t(state.context?.errorMessages['line']?.[0])
                    : undefined
                }
              />
            )}

            {state.context.line && (
              <>
                <Select
                  label={t(PageText.Contact.inputFields.fromStop.label)}
                  value={state.context.fromStop}
                  onChange={(value) => {
                    if (!value) return;
                    send({
                      type: 'SET_FROM_STOP',
                      fromStop: value,
                    });
                  }}
                  options={getQuaysByLine(state.context.line.id)}
                  placeholder={t(
                    PageText.Contact.inputFields.fromStop.optionLabel,
                  )}
                  error={
                    state.context?.errorMessages['fromStop']
                      ? t(state.context?.errorMessages['fromStop']?.[0])
                      : undefined
                  }
                  valueToId={(quay: Line['quays'][0]) => quay.id}
                  valueToText={(quay: Line['quays'][0]) => quay.name}
                />

                <Select
                  label={t(PageText.Contact.inputFields.toStop.label)}
                  value={state.context.toStop}
                  onChange={(value) => {
                    if (!value) return;
                    send({
                      type: 'SET_TO_STOP',
                      toStop: value,
                    });
                  }}
                  placeholder={t(
                    PageText.Contact.inputFields.toStop.optionLabel,
                  )}
                  options={getQuaysByLine(state.context.line.id)}
                  error={
                    state.context?.errorMessages['toStop']
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
                      type: 'SET_DATE',
                      date: e.target.value,
                    })
                  }
                />
                <Input
                  label={PageText.Contact.inputFields.departureTime}
                  type="time"
                  name="time"
                  value={state.context.plannedDepartureTime}
                  onChange={(e) =>
                    send({
                      type: 'SET_PLANNED_DEPARTURE_TIME',
                      plannedDepartureTime: e.target.value,
                    })
                  }
                />
              </>
            )}
            <Select
              label={t(
                PageText.Contact.inputFields.reasonForTransportFailure.label,
              )}
              value={state.context.reasonForTransportFailure}
              onChange={(value) => {
                if (!value) return;
                send({
                  type: 'SET_REASON_FOR_TRANSPORT_FAILIURE',
                  reasonForTransportFailure: value,
                });
              }}
              placeholder={t(PageText.Contact.inputFields.toStop.optionLabel)}
              options={PageText.Contact.inputFields.reasonForTransportFailure.options.map(
                (option) => ({
                  id: option.id,
                  name: option.name,
                }),
              )}
              error={
                state.context?.errorMessages['reasonForTransportFailure']
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
        </div>
      )}

      {state.hasTag('car') && (
        <div>
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
                state.context?.errorMessages['kilometresDriven']?.[0] ||
                undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_KILOMETRES_DRIVEN',
                  kilometersDriven: e.target.value,
                })
              }
            />
          </SectionCard>
          <SectionCard
            title={
              PageText.Contact.travelGuarantee.refundCar.aboutThePlanedTrip
                .title
            }
          ></SectionCard>
        </div>
      )}
      {state.hasTag('selected') && (
        <div>
          <SectionCard
            title={PageText.Contact.travelGuarantee.optionalFeedback.title}
          >
            <textarea
              className={style.feedback}
              name="feedback"
              value={state.context.feedback}
              onChange={(e) =>
                send({
                  type: 'SET_FEEDBACK',
                  feedback: e.target.value,
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
                  type: 'SET_FIRSTNAME',
                  firstName: e.target.value,
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
                  type: 'SET_LASTNAME',
                  lastName: e.target.value,
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
                  type: 'SET_ADDRESS',
                  address: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.inputFields.postalCode.label}
              type="text"
              name="postalCode"
              value={state.context.postalCode}
              errorMessage={
                state.context?.errorMessages['postalCode']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_POSTAL_CODE',
                  postalCode: e.target.value,
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
                  type: 'SET_CITY',
                  city: e.target.value,
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
                  type: 'SET_EMAIL',
                  email: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.inputFields.phoneNumber.label}
              type="text"
              name="phoneNumber"
              value={state.context.phoneNumber}
              errorMessage={
                state.context?.errorMessages['phoneNumber']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_PHONENUMBER',
                  phoneNumber: e.target.value,
                })
              }
            />

            {!state.context.isBankAccountForeign && (
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
                    type: 'SET_BANK_ACCOUNT_NUMBER',
                    bankAccountNumber: e.target.value,
                  })
                }
              />
            )}

            <Checkbox
              label={t(PageText.Contact.inputFields.bankAccountNumber.checkbox)}
              checked={state.context.isBankAccountForeign}
              onChange={() => send({ type: 'SET_BANK_ACCOUNT_FOREIGN' })}
            />

            {state.context.isBankAccountForeign && (
              <div>
                <Input
                  label={PageText.Contact.inputFields.bankAccountNumber.IBAN}
                  type="text"
                  name="bankAccountNumber"
                  value={state.context.IBAN}
                  onChange={(e) =>
                    send({
                      type: 'SET_IBAN',
                      IBAN: e.target.value,
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
                      type: 'SET_SWIFT',
                      SWIFT: e.target.value,
                    })
                  }
                />
                {state.context?.errorMessages['bankAccountNumber'] && (
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
          />
        </div>
      )}
    </form>
  );
};

export default RefundForm;
