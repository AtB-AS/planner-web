import style from '../../contact.module.css';
import { Input } from '../../components/input';
import { SectionCard } from '../../components/section-card';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { Checkbox } from '../../components/input/checkbox';
import { Typo } from '@atb/components/typography';
import { RadioInput } from '../../components/input/radio';
import { Textarea } from '../../components/input/textarea';
import ErrorMessage from '../../components/input/error-message';
import { FileInput } from '../../components/input/file';
import { ContextProps } from '../ticket-control-form-machine';
import { ticketControlFormEvents } from '../events';

type FeeComplaintFormProps = {
  state: { context: ContextProps };
  send: (event: typeof ticketControlFormEvents) => void;
};

export const FeeComplaintForm = ({ state, send }: FeeComplaintFormProps) => {
  const { t } = useTranslation();

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
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'agreesFirstAgreement',
              value: !state.context.agreesFirstAgreement,
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
              type: 'ON_INPUT_CHANGE',
              inputName: 'agreesSecondAgreement',
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
        <div>
          <SectionCard
            title={PageText.Contact.ticketControl.feeComplaint.title}
          >
            <Input
              label={PageText.Contact.inputFields.feeNumber.label}
              type="text"
              name="feeNumber"
              value={state.context.feeNumber || ''}
              errorMessage={state.context?.errorMessages['feeNumber']?.[0]}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'feeNumber',
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
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'isAppTicketStorageMode',
                  value: !state.context.isAppTicketStorageMode,
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
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'isAppTicketStorageMode',
                  value: !state.context.isAppTicketStorageMode,
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
                  type="tel"
                  name="appPhoneNumber"
                  value={state.context.appPhoneNumber || ''}
                  errorMessage={
                    state.context?.errorMessages['appPhoneNumber']?.[0]
                  }
                  onChange={(e) =>
                    send({
                      type: 'ON_INPUT_CHANGE',
                      inputName: 'appPhoneNumber',
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
                  value={state.context.customerNumber || ''}
                  errorMessage={
                    state.context?.errorMessages['customerNumber']?.[0]
                  }
                  onChange={(e) =>
                    send({
                      type: 'ON_INPUT_CHANGE',
                      inputName: 'customerNumber',
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
                type="number"
                name="travelCardNumber"
                value={state.context.travelCardNumber || ''}
                errorMessage={
                  state.context.errorMessages['travelCardNumber']?.[0]
                }
                onChange={(e) =>
                  send({
                    type: 'ON_INPUT_CHANGE',
                    inputName: 'travelCardNumber',
                    value: e.target.value,
                  })
                }
              />
            )}
          </SectionCard>
          <SectionCard title={PageText.Contact.inputFields.feedback.title}>
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
              label={t(PageText.Contact.inputFields.feedback.attachment)}
            />
          </SectionCard>

          <SectionCard title={PageText.Contact.aboutYouInfo.title}>
            <Input
              label={PageText.Contact.inputFields.firstName.label}
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
              label={PageText.Contact.inputFields.lastName.label}
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
              label={PageText.Contact.inputFields.address.label}
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
              label={PageText.Contact.inputFields.postalCode.label}
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
              label={PageText.Contact.inputFields.city.label}
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
              label={PageText.Contact.inputFields.email.label}
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
              label={PageText.Contact.inputFields.phoneNumber.label}
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

            {!state.context.hasInternationalBankAccount && (
              <Input
                label={
                  PageText.Contact.inputFields.bankAccountNumber.notForeignLabel
                }
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
                  type="number"
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
                  label={PageText.Contact.inputFields.bankAccountNumber.SWIFT}
                  type="number"
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
      )}
    </div>
  );
};

export default FeeComplaintForm;
