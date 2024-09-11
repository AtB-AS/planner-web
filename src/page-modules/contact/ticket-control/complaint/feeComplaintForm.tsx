import { FormEventHandler, useState } from 'react';
import style from '../ticket-control.module.css';
import { Button } from '@atb/components/button';
import { Input } from '../../components/input';
import { SectionCard } from '../../components/section-card';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { formMachine } from './complaintFormMachine';
import { andIf } from '@atb/utils/css';
import { TicketData } from '../../server/types';

export const FeeComplaintForm = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(formMachine);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!state.can({ type: 'SUBMIT' })) return;

    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(state.context),
    });

    if (response.ok) {
      const res = await response.json();
      send({ type: 'RESOLVE' });
    } else {
      send({ type: 'FALIURE' });
    }
  };

  const agreesFirstAgreement = state.matches('secondAgreement');
  const agreesSecondAgreement = state.matches('editing');
  const isAppSelected = state.context.ticketStorageMode === 'App';
  const isTravelcardSelected = state.context.ticketStorageMode === 'Travelcard';
  const [isBankAccountForeign, setBankAccountForeign] = useState(false);

  const FirstAgreement = () => {
    return (
      <SectionCard
        title={PageText.Contact.ticketControl.feeComplaint.firstAgreement.title}
      >
        <p>
          {t(
            PageText.Contact.ticketControl.feeComplaint.firstAgreement.question,
          )}
        </p>
        <div>
          <h4>
            {t(
              PageText.Contact.ticketControl.feeComplaint.firstAgreement
                .labelRules,
            )}
          </h4>
          <ul className={style.list}>
            {PageText.Contact.ticketControl.feeComplaint.firstAgreement.rules.map(
              (rule: TranslatedString, index: number) => (
                <li key={index}>{t(rule)}</li>
              ),
            )}
          </ul>
        </div>

        <Input
          label={
            PageText.Contact.ticketControl.feeComplaint.firstAgreement.checkbox
          }
          type="checkbox"
          name="firstAgreement"
          checked={agreesFirstAgreement}
          onChange={() =>
            send({
              type: !agreesFirstAgreement
                ? 'agreeFirstAgreement'
                : 'disagreeFirstAgreement',
            })
          }
        />
      </SectionCard>
    );
  };

  const SecondAgreement = () => {
    return (
      <SectionCard
        title={
          PageText.Contact.ticketControl.feeComplaint.secondAgreement.title
        }
      >
        <ul className={style.list}>
          {PageText.Contact.ticketControl.feeComplaint.secondAgreement.rules.map(
            (rule: TranslatedString, index: number) => (
              <li key={index}>{t(rule)}</li>
            ),
          )}
        </ul>
        <p>
          {t(PageText.Contact.ticketControl.feeComplaint.secondAgreement.info)}
        </p>

        <Input
          label={
            PageText.Contact.ticketControl.feeComplaint.secondAgreement.checkbox
          }
          type="checkbox"
          name="secondAgreement"
          checked={agreesSecondAgreement}
          onChange={() =>
            send({
              type: !agreesSecondAgreement
                ? 'agreeSecondAgreement'
                : 'disagreeSecondAgreement',
            })
          }
        />
      </SectionCard>
    );
  };

  return (
    <div>
      {state.hasTag('firstAgreement') && <FirstAgreement />}
      {state.hasTag('secondAgreement') && <SecondAgreement />}
      {state.hasTag('editing') && (
        <form onSubmit={onSubmit}>
          <SectionCard
            title={PageText.Contact.ticketControl.feeComplaint.title}
          >
            <Input
              label={PageText.Contact.ticketControl.feeComplaint.fee.inputlabel}
              type="text"
              name="feeNumber"
              value={state.context.feeNumber}
              errorMessage={
                state.hasTag('emptyFeeNumber')
                  ? PageText.Contact.ticketControl.feeComplaint.fee.errorMessage
                  : undefined
              }
              onChange={(e) =>
                send({
                  type: 'SET_FEE_NUMBER',
                  feeNumber: e.target.value,
                })
              }
            />

            <h4>
              {t(
                PageText.Contact.ticketControl.feeComplaint.ticketStorage
                  .question,
              )}
            </h4>

            <div>
              <Input
                label={
                  PageText.Contact.ticketControl.feeComplaint.ticketStorage.app
                    .title
                }
                type="radio"
                name="ticketStorage"
                checked={isAppSelected}
                onChange={() =>
                  send({
                    type: 'SET_TICKET_STORAGE_MODE',
                    ticketStorageMode: 'App',
                  })
                }
              />

              <Input
                label={
                  PageText.Contact.ticketControl.feeComplaint.ticketStorage
                    .travelcard.title
                }
                type="radio"
                name="ticketStorage"
                checked={isTravelcardSelected}
                onChange={() =>
                  send({
                    type: 'SET_TICKET_STORAGE_MODE',
                    ticketStorageMode: 'Travelcard',
                  })
                }
              />
              {state.hasTag('undefinedTicketStorageMode') && (
                <label className={style.feedback_label__error}>
                  {t(
                    PageText.Contact.ticketControl.feeComplaint.ticketStorage
                      .errorMessage,
                  )}
                </label>
              )}
            </div>

            {isAppSelected && (
              <div>
                <Input
                  label={
                    PageText.Contact.ticketControl.feeComplaint.ticketStorage
                      .app.registeredMobile.label
                  }
                  type="text"
                  name="registeredMobile"
                  value={state.context.registeredMobile}
                  errorMessage={
                    state.hasTag('undefinedRegisteredMobile')
                      ? PageText.Contact.ticketControl.feeComplaint
                          .ticketStorage.app.registeredMobile.errorMessage
                      : undefined
                  }
                  onChange={(e) =>
                    send({
                      type: 'SET_REGISTERED_MOBILE',
                      registeredMobile: e.target.value,
                    })
                  }
                />

                <Input
                  label={
                    PageText.Contact.ticketControl.feeComplaint.ticketStorage
                      .app.customerNumber.label
                  }
                  type="number"
                  name="customerNumber"
                  value={state.context.customerNumber}
                  errorMessage={
                    state.hasTag('undefinedCustomerNumber')
                      ? PageText.Contact.ticketControl.feeComplaint
                          .ticketStorage.app.customerNumber.errorMessage
                      : undefined
                  }
                  onChange={(e) =>
                    send({
                      type: 'SET_CUSTOMER_NUMBER',
                      customerNumber: e.target.value,
                    })
                  }
                />
              </div>
            )}
            {isTravelcardSelected && (
              <Input
                label={
                  PageText.Contact.ticketControl.feeComplaint.ticketStorage
                    .travelcard.title
                }
                type="text"
                name="travelcard"
                value={state.context.travelcard}
                errorMessage={
                  state.hasTag('undefinedTravelcard')
                    ? PageText.Contact.ticketControl.feeComplaint.ticketStorage
                        .travelcard.errorMessage
                    : undefined
                }
                onChange={(e) =>
                  send({
                    type: 'SET_TRAVELCARD',
                    travelcard: e.target.value,
                  })
                }
              />
            )}
          </SectionCard>
          <SectionCard title={PageText.Contact.feedback.question}>
            <textarea
              className={andIf({
                [style.feedback]: true,
                [style.feedback__error]: state.hasTag('emptyFeedback'),
              })}
              name="feedback"
              value={state.context.feedback}
              onChange={(e) =>
                send({
                  type: 'SET_FEEDBACK',
                  feedback: e.target.value,
                })
              }
            />
            {state.hasTag('emptyFeedback') && (
              <label className={style.feedback_label__error}>
                {t(PageText.Contact.feedback.errorMessage)}
              </label>
            )}
          </SectionCard>
          <SectionCard title={PageText.Contact.aboutYouInfo.title}>
            <Input
              label={PageText.Contact.aboutYouInfo.firstname}
              type="text"
              name="firstname"
              value={state.context.firstname}
              errorMessage={
                state.hasTag('emptyFirstname')
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
            <Input
              label={PageText.Contact.aboutYouInfo.lastname}
              type="text"
              name="lastname"
              value={state.context.lastname}
              errorMessage={
                state.hasTag('emptyLastname')
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
                state.hasTag('emptyAddress')
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
                state.hasTag('emptyPostalCode')
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
                state.hasTag('emptyCity')
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
                state.hasTag('emptyEmail')
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
                state.hasTag('emptyPhonenumber')
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
                  state.hasTag('emptyBankAccount')
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

            {isBankAccountForeign && (
              <div>
                <Input
                  label={PageText.Contact.aboutYouInfo.bankAccount.iban}
                  type="text"
                  name="bankAccount"
                  value={state.context.iban}
                  onChange={(e) =>
                    send({
                      type: 'SET_IBAN',
                      iban: e.target.value,
                    })
                  }
                />
                <Input
                  label={PageText.Contact.aboutYouInfo.bankAccount.swift}
                  type="text"
                  name="bankAccount"
                  value={state.context.swift}
                  onChange={(e) =>
                    send({
                      type: 'SET_SWIFT',
                      swift: e.target.value,
                    })
                  }
                />
                {state.hasTag('emptyBankAccount') && (
                  <label className={style.feedback_label__error}>
                    {t(
                      PageText.Contact.aboutYouInfo.bankAccount
                        .errorMessageBankAccount,
                    )}
                  </label>
                )}
              </div>
            )}
          </SectionCard>
          <Button
            title={t(PageText.Contact.submit)}
            mode={'interactive_0--bordered'}
            buttonProps={{ type: 'submit' }}
          />
        </form>
      )}
    </div>
  );
};
