import FormSelector from './form-selector';
import { SectionCard } from '../components/section-card';
import { ComponentText, PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { travelGuaranteeFormMachine } from './travelGuaranteeFormMachine';
import { Input } from '../components/input';
import { TransportModeType } from '@atb/modules/transport-mode';
import { useLines } from '../lines/use-lines';
import { Line } from '..';
import { FormEventHandler, useEffect } from 'react';
import style from '../contact.module.css';
import { Button } from '@atb/components/button';

export const RefundForm = () => {
  const { t } = useTranslation();
  const { lines, getLinesByMode, getQuaysByLine } = useLines();
  const [state, send] = useMachine(travelGuaranteeFormMachine, {
    input: {
      isChecked: false,
      date: new Date().toISOString().split('T')[0],
      time: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
    },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    console.log('Jeg er her ', state.value);
    if (!state.matches('submitting')) return;
    console.log('Jeg er også her');

    const response = await fetch('/api/travel-guarantee', {
      method: 'POST',
      body: JSON.stringify({
        transportMode: state.context.transportMode,
        line: state.context.line?.name,
        fromStop: state.context.departureLocation?.name,
        toStop: state.context.arrivalLocation?.name,
        date: state.context.date,
        departureTime: state.context.time,
        feedback: state.context.feedback,
        firstName: state.context.firstname,
        lastName: state.context.lastname,
        email: state.context.email,
      }),
    });

    if (response.ok) {
      const res = await response.json();
      send({ type: 'RESOLVE' });
    } else {
      send({ type: 'FALIURE' });
    }
  };

  useEffect(() => {
    console.log('Hallo: ', state.value);
  }, [state]);

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
            <label>
              {t(PageText.Contact.ticketControl.feedback.transportMode.label)}
            </label>
            <select
              name="transportModes"
              defaultValue={'DEFAULT'}
              value={state.context.transportMode}
              onChange={(e) =>
                send({
                  type: 'SET_TRANSPORT_MODE',
                  transportMode: e.target.value as TransportModeType,
                })
              }
            >
              <option
                label={t(
                  PageText.Contact.ticketControl.feedback.transportMode
                    .optionLabel,
                )}
                disabled
                value="DEFAULT"
              />
              <option value="bus">
                {t(ComponentText.TransportMode.modes['bus'])}
              </option>
              <option value="water">
                {' '}
                {t(ComponentText.TransportMode.modes['water'])}
              </option>
            </select>

            {state.context.transportMode && (
              <>
                <label>
                  {t(PageText.Contact.ticketControl.feedback.line.label)}
                </label>

                <select
                  name="lines"
                  defaultValue={'DEFAULT'}
                  value={state.context.line?.id}
                  onChange={(e) =>
                    send({
                      type: 'SET_LINE',
                      line: lines?.filter(
                        (line) => line.id === e.target.value,
                      )[0] as Line,
                    })
                  }
                >
                  <option
                    label={t(
                      PageText.Contact.ticketControl.feedback.line.optionLabel,
                    )}
                    disabled
                    value={'DEFAULT'}
                  />
                  {getLinesByMode(
                    state.context.transportMode as TransportModeType,
                  ).map((line) => (
                    <option key={line.id} value={line.id}>
                      {line.name}
                    </option>
                  ))}
                </select>
                {false && (
                  <label
                  // className={andIf({
                  //   [style.feedback_label__error]: isLineUndefined,
                  // })}
                  >
                    {t(
                      PageText.Contact.ticketControl.feedback.line.errorMessage,
                    )}
                  </label>
                )}
              </>
            )}

            {state.context.line && (
              <>
                <label>
                  {t(
                    PageText.Contact.ticketControl.feedback.departureLocation
                      .label,
                  )}
                </label>

                <select
                  name="departure"
                  defaultValue={'DEFAULT'}
                  value={state.context.departureLocation?.id}
                  onChange={(e) =>
                    send({
                      type: 'SET_DEPARTURE_LOCATON',
                      departureLocation: state.context.line?.quays.filter(
                        (quay) => quay.id === e.target.value,
                      )[0] as Line['quays'][0],
                    })
                  }
                >
                  <option
                    label={t(
                      PageText.Contact.ticketControl.feedback.departureLocation
                        .optionLabel,
                    )}
                    disabled
                    value={'DEFAULT'}
                  />
                  {getQuaysByLine(state.context.line.id).map((quay) => (
                    <option key={quay.id} value={quay.id}>
                      {quay.name}
                    </option>
                  ))}
                </select>
                {!state.context.line && (
                  <label
                  //className={andIf({
                  //  [style.feedback_label__error]:
                  //    isDepartureLocationUndefined,
                  //})}
                  >
                    {t(
                      PageText.Contact.ticketControl.feedback.departureLocation
                        .errorMessage,
                    )}
                  </label>
                )}
              </>
            )}
          </SectionCard>
        </div>
      )}

      {state.hasTag('car') && (
        <div>
          <SectionCard
            title={
              PageText.Contact.travelGuarantee.refundCar.aboutTheCarTrip.title
            }
          ></SectionCard>
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
            {/* Todo button to add attatchments */}
          </SectionCard>
          <SectionCard title={PageText.Contact.aboutYouInfo.title}>
            <Input
              label={PageText.Contact.aboutYouInfo.firstname}
              type="text"
              name="firstname"
              value={state.context.firstname}
              errorMessage={
                state.hasTag('empty')
                  ? PageText.Contact.aboutYouInfo.errorMessage
                  : undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_FIRSTNAME',
                  firstname: e.target.value,
                })
              }
            />
            {/*
            <Input
              label={PageText.Contact.aboutYouInfo.lastname}
              type="text"
              name="lastname"
              value={state.context.lastname}
              errorMessage={
                isLastnameEmpty
                  ? PageText.Contact.aboutYouInfo.errorMessage
                  : undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_LASTNAME',
                  lastname: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.aboutYouInfo.address}
              type="text"
              name="address"
              value={state.context.address}
              errorMessage={
                isAddressEmpty
                  ? PageText.Contact.aboutYouInfo.errorMessage
                  : undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_ADDRESS',
                  address: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.aboutYouInfo.postalCode}
              type="text"
              name="postalCode"
              value={state.context.postalCode}
              errorMessage={
                isPostalCodeEmpty
                  ? PageText.Contact.aboutYouInfo.errorMessage
                  : undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_POSTAL_CODE',
                  postalCode: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.aboutYouInfo.city}
              type="text"
              name="city"
              value={state.context.city}
              errorMessage={
                isCityEmpty
                  ? PageText.Contact.aboutYouInfo.errorMessage
                  : undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_CITY',
                  city: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.aboutYouInfo.email}
              type="email"
              name="email"
              value={state.context.email}
              errorMessage={
                isEmailEmpty
                  ? PageText.Contact.aboutYouInfo.errorMessage
                  : undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_EMAIL',
                  email: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.aboutYouInfo.phonenumber}
              type="text"
              name="phonenumber"
              value={state.context.phonenumber}
              errorMessage={
                isPhonenumberEmpty
                  ? PageText.Contact.aboutYouInfo.errorMessage
                  : undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_PHONENUMMBER',
                  phonenumber: e.target.value,
                })
              }
            />

            {!isBankAccountForeign && (
              <Input
                label={PageText.Contact.aboutYouInfo.bankAccount.label}
                type="text"
                name="bankAccount"
                value={state.context.bankAccount}
                errorMessage={
                  isBankAccountEmpty
                    ? PageText.Contact.aboutYouInfo.bankAccount
                        .errorMessageBankAccount
                    : undefined
                }
                onChange={(e) =>
                  send({
                    type: 'SET_BANK_ACCOUNT',

                    bankAccount: e.target.value,
                  })
                }
              />
            )}

            <Input
              label={PageText.Contact.aboutYouInfo.bankAccount.checkbox}
              type="checkbox"
              name="firstAgreement"
              checked={isBankAccountForeign}
              onChange={() => setBankAccountForeign(!isBankAccountForeign)}
            />
              */}
          </SectionCard>
          <Button
            title={t(PageText.Contact.submit)}
            mode={'interactive_0--bordered'}
            buttonProps={{ type: 'submit' }}
            onClick={() => {
              console.log('buttonCLicked');
              send({ type: 'SUBMIT' });
            }}
          />
        </div>
      )}
    </form>
  );
};

export default RefundForm;
