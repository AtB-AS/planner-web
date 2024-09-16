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

export const RefundForm = () => {
  const { t } = useTranslation();
  const { lines, getLinesByMode, getQuaysByLine } = useLines();
  const [state, send] = useMachine(fetchMachine);

  // Local state to force re-render to display errors.
  const [displayErrorsDummyState, setDisplayErrorsDummyState] = useState(true);
  const [isBankAccountForeign, setBankAccountForeign] = useState(false);

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
                  label={t(
                    PageText.Contact.inputFields.departureLocation.label,
                  )}
                  value={state.context.departureLocation}
                  onChange={(value) => {
                    if (!value) return;
                    send({
                      type: 'SET_DEPARTURE_LOCATION',
                      departureLocation: value,
                    });
                  }}
                  options={getQuaysByLine(state.context.line.id)}
                  placeholder={t(
                    PageText.Contact.inputFields.departureLocation.optionLabel,
                  )}
                  error={
                    state.context?.errorMessages['departureLocation']
                      ? t(
                          state.context?.errorMessages[
                            'departureLocation'
                          ]?.[0],
                        )
                      : undefined
                  }
                  valueToId={(quay: Line['quays'][0]) => quay.id}
                  valueToText={(quay: Line['quays'][0]) => quay.name}
                />

                <Select
                  label={t(PageText.Contact.inputFields.arrivalLocation.label)}
                  value={state.context.arrivalLocation}
                  onChange={(value) => {
                    if (!value) return;
                    send({
                      type: 'SET_ARRIVAL_LOCATION',
                      arrivalLocation: value,
                    });
                  }}
                  placeholder={t(
                    PageText.Contact.inputFields.arrivalLocation.optionLabel,
                  )}
                  options={getQuaysByLine(state.context.line.id)}
                  error={
                    state.context?.errorMessages['arrivalLocation']
                      ? t(state.context?.errorMessages['arrivalLocation']?.[0])
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
                  value={state.context.time}
                  onChange={(e) =>
                    send({
                      type: 'SET_TIME',
                      time: e.target.value,
                    })
                  }
                />
              </>
            )}
          </SectionCard>
        </div>
      )}

      {state.hasTag('car') && <div>car</div>}
      {state.hasTag('other') && <div>other</div>}
      {state.hasTag('selected') && (
        <div>
          <SectionCard
            title={PageText.Contact.travelGuarantee.optionalFeedback.title}
          >
            <textarea
              className={style.feedback}
              name="feedback"
              //value={state.context.feedback}
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
              label={PageText.Contact.inputFields.firstname.label}
              type="text"
              name="firstname"
              value={state.context.firstname}
              errorMessage={
                state.context?.errorMessages['firstname']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_FIRSTNAME',
                  firstname: e.target.value,
                })
              }
            />

            <Input
              label={PageText.Contact.inputFields.lastname.label}
              type="text"
              name="lastname"
              value={state.context.lastname}
              errorMessage={
                state.context?.errorMessages['lastname']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_LASTNAME',
                  lastname: e.target.value,
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
              label={PageText.Contact.inputFields.phonenumber.label}
              type="text"
              name="phonenumber"
              value={state.context.phonenumber}
              errorMessage={
                state.context?.errorMessages['phonenumber']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_PHONENUMBER',
                  phonenumber: e.target.value,
                })
              }
            />

            {!isBankAccountForeign && (
              <Input
                label={PageText.Contact.inputFields.bankAccount.notForeignLabel}
                type="text"
                name="bankAccount"
                value={state.context.bankAccount}
                errorMessage={
                  state.context?.errorMessages['bankAccount']?.[0] || undefined
                }
                onChange={(e) =>
                  send({
                    type: 'SET_BANK_ACCOUNT',

                    bankAccount: e.target.value,
                  })
                }
              />
            )}

            <Checkbox
              label={t(PageText.Contact.aboutYouInfo.bankAccount.checkbox)}
              checked={isBankAccountForeign}
              onChange={() => setBankAccountForeign(!isBankAccountForeign)}
            />

            {isBankAccountForeign && (
              <div>
                <Input
                  label={PageText.Contact.aboutYouInfo.bankAccount.iban}
                  type="text"
                  name="bankAccount"
                  value={state.context.IBAN}
                  onChange={(e) =>
                    send({
                      type: 'SET_IBAN',
                      IBAN: e.target.value,
                    })
                  }
                />

                <Input
                  label={PageText.Contact.aboutYouInfo.bankAccount.swift}
                  type="text"
                  name="bankAccount"
                  value={state.context.SWIFT}
                  onChange={(e) =>
                    send({
                      type: 'SET_SWIFT',
                      SWIFT: e.target.value,
                    })
                  }
                />
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
