import { FormEventHandler } from 'react';
import style from '../ticket-control.module.css';
import { Button } from '@atb/components/button';
import { Input } from '../../components/input';
import { SectionCard } from '../../components/section-card';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { formMachine } from './formMachine';

export const FeeComplaintForm = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(formMachine);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const res = await response.json();
    }
  };

  const agreesFirstAgreement = state.matches('firstAgreement');
  const agreesSecondAgreement = state.matches({
    secondAgreement: 'idleSecondAgreement',
  });
  const isSecondAgreementDisplayed = state.matches('secondAgreement');
  const isFormDisplayed = state.matches({
    secondAgreement: 'form',
  });
  const isAppSelected = state.matches({
    secondAgreement: { form: { ticketStorageMode: 'app' } },
  });

  const isTravelcardSelected = state.matches({
    secondAgreement: {
      form: { ticketStorageMode: 'travelcard' },
    },
  });

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
          name="aggreement1"
          checked={!agreesFirstAgreement}
          onChange={() =>
            send(
              agreesFirstAgreement
                ? { type: 'agreeFirstAgreement', target: 'secondAgreement' }
                : {
                    type: 'disagreeFirstAgreement',
                    target: 'feeComplaintForm',
                  },
            )
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
          name="aggreement2"
          checked={!agreesSecondAgreement}
          onChange={() =>
            send(
              agreesSecondAgreement
                ? { type: 'agreeSecondAgreement', target: 'form' }
                : {
                    type: 'disagreeSecondAgreement',
                    target: 'secondAgreement',
                  },
            )
          }
        />
      </SectionCard>
    );
  };

  const Form = () => {
    return (
      <form onSubmit={onSubmit}>
        <SectionCard title={PageText.Contact.ticketControl.feeComplaint.title}>
          <Input
            label={PageText.Contact.ticketControl.feeComplaint.fee.inputlabel}
            type="text"
            name="feeNumber"
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
                  type: 'select.app',
                  target: 'app',
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
                  type: 'select.travelcard',
                  target: 'travelcard',
                })
              }
            />
          </div>

          <br />
          {isAppSelected && (
            <div>
              <Input
                label={
                  PageText.Contact.ticketControl.feeComplaint.ticketStorage.app
                    .registeredMobile
                }
                type="tel"
                name="registeredMobile"
              />
              <Input
                label={
                  PageText.Contact.ticketControl.feeComplaint.ticketStorage.app
                    .customerNumber
                }
                type="number"
                name="customerNumber"
              />
            </div>
          )}
          {isTravelcardSelected && (
            <Input
              label={
                PageText.Contact.ticketControl.feeComplaint.ticketStorage
                  .travelcard.title
              }
              type="number"
              name="travelcard"
            />
          )}
        </SectionCard>
        <SectionCard title={PageText.Contact.feedbackQuestion}>
          <textarea name="feedback" className={style.feedback} />
        </SectionCard>
        <SectionCard title={PageText.Contact.aboutYouInfo.title}>
          <Input
            label={PageText.Contact.aboutYouInfo.firstAndMiddleName}
            type="text"
            name="firstAndMiddleName"
          />
          <Input
            label={PageText.Contact.aboutYouInfo.surname}
            type="text"
            name="lastname"
          />
          <Input
            label={PageText.Contact.aboutYouInfo.address}
            type="text"
            name="address"
          />
          <Input
            label={PageText.Contact.aboutYouInfo.postalCode}
            type="tel"
            name="postalCode"
          />
          <Input
            label={PageText.Contact.aboutYouInfo.city}
            type="text"
            name="city"
          />
          <Input
            label={PageText.Contact.aboutYouInfo.email}
            type="email"
            name="email"
          />
          <Input
            label={PageText.Contact.aboutYouInfo.mobile}
            type="tel"
            name="mobile"
          />
          <Input
            label={PageText.Contact.aboutYouInfo.bankAccount}
            type="text"
            name="bankAccount"
          />
        </SectionCard>
        <Button
          title={t(PageText.Contact.submit)}
          mode={'interactive_0--bordered'}
          buttonProps={{ type: 'submit' }}
        />
      </form>
    );
  };

  return (
    <div>
      <FirstAgreement />
      {isSecondAgreementDisplayed && <SecondAgreement />}
      {isFormDisplayed && <Form />}
    </div>
  );
};
