import style from '../../contact.module.css';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { Typo } from '@atb/components/typography';
import { TicketControlContextProps } from '../ticket-control-form-machine';
import { ticketControlFormEvents } from '../events';
import { Input, Radio, Textarea, Fieldset } from '../../components';
import { Checkbox } from '@atb/components/checkbox';

type FeeComplaintFormProps = {
  state: { context: TicketControlContextProps };
  send: (event: typeof ticketControlFormEvents) => void;
};

type FirstAgreementProps = Pick<FeeComplaintFormProps, 'state' | 'send'>;

const FirstAgreement = ({ state, send }: FirstAgreementProps) => {
  const { t } = useTranslation();
  return (
    <Fieldset
      title={t(
        PageText.Contact.ticketControl.feeComplaint.firstAgreement.title,
      )}
    >
      <Typo.p textType="body__primary">
        {t(PageText.Contact.ticketControl.feeComplaint.firstAgreement.question)}
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
    </Fieldset>
  );
};

type SecondAgreementProps = Pick<FeeComplaintFormProps, 'state' | 'send'>;

const SecondAgreement = ({ state, send }: SecondAgreementProps) => {
  const { t } = useTranslation();
  return (
    <Fieldset
      title={t(
        PageText.Contact.ticketControl.feeComplaint.secondAgreement.title,
      )}
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
          PageText.Contact.ticketControl.feeComplaint.secondAgreement.checkbox,
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
    </Fieldset>
  );
};

type FormProps = Pick<FeeComplaintFormProps, 'state' | 'send'>;
const FormContent = ({ state, send }: FormProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Fieldset title={t(PageText.Contact.ticketControl.feeComplaint.title)}>
        <Input
          id="feeNumber"
          label={t(PageText.Contact.input.feeNumber.label)}
          type="text"
          name="feeNumber"
          value={state.context.feeNumber || ''}
          isRequired
          errorMessage={state.context?.errorMessages['feeNumber']?.[0]}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'feeNumber',
              value: e.target.value,
            })
          }
          modalContent={{
            description: t(PageText.Contact.input.feeNumber.description),
          }}
        />

        <Typo.h3 textType="heading__component">
          {t(
            PageText.Contact.ticketControl.feeComplaint.ticketStorage.question,
          )}
        </Typo.h3>

        <div>
          <Radio
            label={t(
              PageText.Contact.ticketControl.feeComplaint.ticketStorage.app
                .title,
            )}
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
          <Radio
            label={t(PageText.Contact.input.travelCardNumber.labelRadioButton)}
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
        </div>

        {state.context.isAppTicketStorageMode && (
          <>
            <Input
              id="appPhoneNumber"
              label={t(PageText.Contact.input.appPhoneNumber.label)}
              type="tel"
              name="appPhoneNumber"
              value={state.context.appPhoneNumber || ''}
              isRequired
              errorMessage={state.context?.errorMessages['appPhoneNumber']?.[0]}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'appPhoneNumber',
                  value: e.target.value,
                })
              }
            />

            <Input
              id="customerNumber"
              label={t(PageText.Contact.input.customerNumber.label)}
              type="number"
              name="customerNumber"
              value={state.context.customerNumber || ''}
              isRequired
              errorMessage={state.context?.errorMessages['customerNumber']?.[0]}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'customerNumber',
                  value: e.target.value,
                })
              }
            />
          </>
        )}

        {!state.context.isAppTicketStorageMode && (
          <Input
            id="travelCardNumber"
            label={t(PageText.Contact.input.travelCardNumber.label)}
            type="text"
            name="travelCardNumber"
            value={state.context.travelCardNumber || ''}
            modalContent={{
              description: t(PageText.Contact.input.travelCardNumber.info),
            }}
            isRequired
            errorMessage={state.context.errorMessages['travelCardNumber']?.[0]}
            onChange={(e) =>
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'travelCardNumber',
                value: e.target.value,
              })
            }
          />
        )}
      </Fieldset>
      <Fieldset title={t(PageText.Contact.input.feedback.title)}>
        <Textarea
          id="feedback"
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
            t(state.context.errorMessages['feedback']?.[0])
          }
          fileInputProps={{
            name: 'attachments',
            label: t(PageText.Contact.input.feedback.attachment),
            onChange: (files) => {
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'attachments',
                value: files,
              });
            },
          }}
        />
      </Fieldset>

      <Fieldset title={t(PageText.Contact.aboutYouInfo.title)}>
        <Input
          id="firstName"
          label={t(PageText.Contact.input.firstName.label)}
          type="text"
          autoComplete="given-name additional-name"
          name="firstName"
          value={state.context.firstName || ''}
          isRequired
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
          id="lastName"
          label={t(PageText.Contact.input.lastName.label)}
          type="text"
          autoComplete="family-name"
          name="lastName"
          value={state.context.lastName || ''}
          isRequired
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
          id="address"
          label={t(PageText.Contact.input.address.label)}
          type="text"
          autoComplete="street-address"
          name="address"
          value={state.context.address || ''}
          isRequired
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
          id="postalCode"
          label={t(PageText.Contact.input.postalCode.label)}
          type="number"
          autoComplete="postal-code"
          name="postalCode"
          value={state.context.postalCode || ''}
          isRequired
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
          id="city"
          label={t(PageText.Contact.input.city.label)}
          type="text"
          name="city"
          value={state.context.city || ''}
          isRequired
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
          id="email"
          label={t(PageText.Contact.input.email.label)}
          type="email"
          autoComplete="email"
          name="email"
          value={state.context.email || ''}
          isRequired
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
          id="phoneNumber"
          label={t(PageText.Contact.input.phoneNumber.label)}
          type="tel"
          name="phoneNumber"
          value={state.context.phoneNumber || ''}
          isRequired
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
          id="bankAccountNumber"
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
          isRequired
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
          <>
            <Input
              id="IBAN"
              label={t(PageText.Contact.input.bankInformation.IBAN.label)}
              type="string"
              name="IBAN"
              value={state.context.IBAN || ''}
              isRequired
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
              id="SWIFT"
              label={t(PageText.Contact.input.bankInformation.SWIFT.label)}
              type="string"
              name="SWIFT"
              value={state.context.SWIFT || ''}
              isRequired
              errorMessage={state.context?.errorMessages['SWIFT']?.[0]}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'SWIFT',
                  value: e.target.value,
                })
              }
            />
          </>
        )}
      </Fieldset>
    </>
  );
};

export const FeeComplaintForm = ({ state, send }: FeeComplaintFormProps) => {
  return (
    <>
      <FirstAgreement state={state} send={send} />
      {state.context.agreesFirstAgreement && (
        <SecondAgreement state={state} send={send} />
      )}
      {state.context.agreesSecondAgreement && (
        <FormContent state={state} send={send} />
      )}
    </>
  );
};

export default FeeComplaintForm;
