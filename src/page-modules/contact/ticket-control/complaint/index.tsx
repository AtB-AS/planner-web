import { FormEventHandler, useState } from 'react';
import style from '../../contact.module.css';
import { Button } from '@atb/components/button';
import { Input } from '../../components/input';
import { SectionCard } from '../../components/section-card';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { formMachine } from './complaintFormMachine';
import { Checkbox } from '../../components/input/checkbox';
import { Typo } from '@atb/components/typography';
import { RadioInput } from '../../components/input/radio';
import { Textarea } from '../../components/input/textarea';

export const FeeComplaintForm = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(formMachine);

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

  const FirstAgreement = () => {
    return (
      <SectionCard
        title={PageText.Contact.ticketControl.feeComplaint.firstAgreement.title}
      >
        <Typo.p textType="body__primary">
          {t(
            PageText.Contact.ticketControl.feeComplaint.firstAgreement.question,
          )}
        </Typo.p>
        <div>
          <Typo.p textType="body__primary--bold">
            {t(
              PageText.Contact.ticketControl.feeComplaint.firstAgreement
                .labelRules,
            )}
          </Typo.p>
          <ul className={style.rules__list}>
            {PageText.Contact.ticketControl.feeComplaint.firstAgreement.rules.map(
              (rule: TranslatedString, index: number) => (
                <li key={index}>
                  <Typo.span textType="body__primary">{t(rule)}</Typo.span>
                </li>
              ),
            )}
          </ul>
        </div>

        <Checkbox
          label={t(
            PageText.Contact.ticketControl.feeComplaint.firstAgreement.checkbox,
          )}
          checked={state.context.agreesFirstAgreement}
          onChange={(value) => {
            console.log(state.context.agreesFirstAgreement);
            console.log('value:', value);
            send({
              type: 'TOOGLE_AGREEMENT',
              field: 'agreesFirstAgreement',
              value: value, //!state.context.agreesFirstAgreement,
            });
          }}
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
        <ul className={style.rules__list}>
          {PageText.Contact.ticketControl.feeComplaint.secondAgreement.rules.map(
            (rule: TranslatedString, index: number) => (
              <li key={index}>
                <Typo.span textType="body__primary">{t(rule)}</Typo.span>
              </li>
            ),
          )}
        </ul>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.ticketControl.feeComplaint.secondAgreement.info)}
        </Typo.p>

        <Checkbox
          label={t(
            PageText.Contact.ticketControl.feeComplaint.secondAgreement
              .checkbox,
          )}
          checked={state.context.agreesSecondAgreement}
          onChange={() =>
            send({
              type: 'TOOGLE_AGREEMENT',
              field: 'agreesSecondAgreement',
              value: !state.context.agreesSecondAgreement,
            })
          }
        />
      </SectionCard>
    );
  };

  return (
    <div>
      <FirstAgreement />
      {state.context.agreesFirstAgreement && <SecondAgreement />}
      {state.context.agreesSecondAgreement && (
        <form onSubmit={onSubmit}>
          {/*
          <SectionCard
            title={PageText.Contact.ticketControl.feeComplaint.title}
          >
            <Input
              label={PageText.Contact.ticketControl.feeComplaint.fee.inputlabel}
              type="text"
              name="feeNumber"
              value={state.context.feeNumber}
              errorMessage={
                isFeeNumberEmpty
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

            <Typo.h3 textType="heading__component">
              {t(
                PageText.Contact.ticketControl.feeComplaint.ticketStorage
                  .question,
              )}
            </Typo.h3>

            <div>
              <RadioInput
                label={t(
                  PageText.Contact.ticketControl.feeComplaint.ticketStorage.app
                    .title,
                )}
                name="ticketStorage"
                checked={isAppSelected}
                onChange={() =>
                  send({
                    type: 'SET_TICKET_STORAGE_MODE',
                    ticketStorageMode: 'App',
                  })
                }
              />
              <RadioInput
                label={t(
                  PageText.Contact.ticketControl.feeComplaint.ticketStorage
                    .travelcard.title,
                )}
                name="ticketStorage"
                checked={isTravelcardSelected}
                onChange={() =>
                  send({
                    type: 'SET_TICKET_STORAGE_MODE',
                    ticketStorageMode: 'Travelcard',
                  })
                }
              />
              {undefinedTicketStoreageMode && (
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
                  defaultValue={undefined}
                  errorMessage={
                    isRegisteredMobileUndefined
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
                  defaultValue={undefined}
                  errorMessage={
                    isCustomerNumberUndefined
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
                defaultValue={undefined}
                errorMessage={
                  isTravelcardUndefined
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
            <Textarea
              value={state.context.feedback}
              onChange={(e) =>
                send({
                  type: 'SET_FEEDBACK',
                  feedback: e.target.value,
                })
              }
              error={
                isFeedbackEmpty
                  ? t(PageText.Contact.feedback.errorMessage)
                  : undefined
              }
            />
          </SectionCard>
          <SectionCard title={PageText.Contact.aboutYouInfo.title}>
            <Input
              label={PageText.Contact.aboutYouInfo.firstname}
              type="text"
              name="firstname"
              value={state.context.firstname}
              errorMessage={
                isFirstnameEmpty
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

                {isBankAccountEmpty && (
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
            onClick={() => send({ type: 'SUBMIT' })}
          />
          */}
        </form>
      )}
    </div>
  );
};

export default FeeComplaintForm;
