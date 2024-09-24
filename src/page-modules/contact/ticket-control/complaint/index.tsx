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
import ErrorMessage from '../../components/input/error-message';
import { FileInput } from '../../components/input/file';

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
          onChange={() =>
            send({ type: 'TOGGLE', field: 'agreesFirstAgreement' })
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
              type: 'TOGGLE',
              field: 'agreesSecondAgreement',
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
          <SectionCard
            title={PageText.Contact.ticketControl.feeComplaint.title}
          >
            <Input
              label={PageText.Contact.inputFields.feeNumber.label}
              type="text"
              name="feeNumber"
              value={state.context.feeNumber}
              errorMessage={
                state.context?.errorMessages['feeNumber']?.[0] || undefined
              }
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  field: 'feeNumber',
                  value: e.target.value,
                })
              }
            />

            <Typo.h3 textType="heading__component">
              {t(PageText.Contact.inputFields.ticketStorage.question)}
            </Typo.h3>

            <RadioInput
              label={t(PageText.Contact.inputFields.ticketStorage.app.title)}
              name="isAppTicketStorageMode"
              checked={state.context.isAppTicketStorageMode}
              onChange={() =>
                send({
                  type: 'TOGGLE',
                  field: 'isAppTicketStorageMode',
                })
              }
            />
            <RadioInput
              label={t(
                PageText.Contact.inputFields.ticketStorage.travelCardNumber
                  .label,
              )}
              name="isAppTicketStorageMode"
              checked={!state.context.isAppTicketStorageMode}
              onChange={() =>
                send({
                  type: 'TOGGLE',
                  field: 'isAppTicketStorageMode',
                })
              }
            />

            {state.context.isAppTicketStorageMode && (
              <div>
                <Input
                  label={
                    PageText.Contact.inputFields.ticketStorage.app
                      .appPhoneNumber.label
                  }
                  type="text"
                  name="appPhoneNumber"
                  value={state.context.appPhoneNumber}
                  errorMessage={
                    state.context?.errorMessages['appPhoneNumber']?.[0] ||
                    undefined
                  }
                  onChange={(e) =>
                    send({
                      type: 'ON_INPUT_CHANGE',
                      field: 'appPhoneNumber',
                      value: e.target.value,
                    })
                  }
                />

                <Input
                  label={
                    PageText.Contact.inputFields.ticketStorage.app
                      .customerNumber.label
                  }
                  type="number"
                  name="customerNumber"
                  value={state.context.customerNumber}
                  defaultValue={undefined}
                  errorMessage={
                    state.context?.errorMessages['appPhoneNumber']?.[0] ||
                    undefined
                  }
                  onChange={(e) =>
                    send({
                      type: 'ON_INPUT_CHANGE',
                      field: 'customerNumber',
                      value: e.target.value,
                    })
                  }
                />
              </div>
            )}
            {!state.context.isAppTicketStorageMode && (
              <Input
                label={
                  PageText.Contact.inputFields.ticketStorage.travelCardNumber
                    .label
                }
                type="text"
                name="travelCardNumber"
                value={state.context.travelCardNumber}
                errorMessage={
                  state.context.errorMessages['travelCardNumber']?.[0] ||
                  undefined
                }
                onChange={(e) =>
                  send({
                    type: 'ON_INPUT_CHANGE',
                    field: 'travelCardNumber',
                    value: e.target.value,
                  })
                }
              />
            )}
          </SectionCard>
          <SectionCard title={PageText.Contact.inputFields.feedback.title}>
            <Textarea
              value={state.context.feedback}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  field: 'feedback',
                  value: e.target.value,
                })
              }
              error={
                state.context.errorMessages['feedback']?.[0]
                  ? t(state.context.errorMessages['feedback']?.[0]).toString()
                  : undefined
              }
            />

            <FileInput
              name="attachments"
              onChange={(files) => {
                send({
                  type: 'ON_INPUT_CHANGE',
                  field: 'attachments',
                  value: files,
                });
              }}
              label={t(PageText.Contact.inputFields.feedback.attachment)}
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
                  field: 'firstName',
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
                  field: 'lastName',
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
                  field: 'address',
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
                  field: 'postalCode',
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
                  field: 'city',
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
                  field: 'email',
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
                  field: 'phoneNumber',
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
                    field: 'bankAccountNumber',
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
                  type: 'TOGGLE',
                  field: 'hasInternationalBankAccount',
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
                      field: 'IBAN',
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
                      field: 'SWIFT',
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
          />
        </form>
      )}
    </div>
  );
};

export default FeeComplaintForm;
