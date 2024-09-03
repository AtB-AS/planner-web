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
      console.log(res);
    }
  };

  const doesAgree1 = state.matches('firstAgreement');
  const showSecondAgreement = state.matches('secondAgreement');
  const doesAgree2 = state.matches({ secondAgreement: 'idleSecondAgreement' });
  const showForm = state.matches({
    secondAgreement: 'form',
  });
  const appSelected = state.matches({
    secondAgreement: { form: { ticketStorageMode: 'app' } },
  });

  const travelcardSelected = state.matches({
    secondAgreement: {
      form: { ticketStorageMode: 'travelcard' },
    },
  });

  return (
    <div>
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
          checked={!doesAgree1}
          onChange={() =>
            send(
              doesAgree1
                ? { type: 'agreeFirstAgreement', target: 'secondAgreement' }
                : {
                    type: 'disagreeFirstAgreement',
                    target: 'feeComplaintForm',
                  },
            )
          }
        />
      </SectionCard>

      {showSecondAgreement && (
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
            {t(
              PageText.Contact.ticketControl.feeComplaint.secondAgreement.info,
            )}
          </p>

          <Input
            label={
              PageText.Contact.ticketControl.feeComplaint.secondAgreement
                .checkbox
            }
            type="checkbox"
            name="aggreement2"
            checked={!doesAgree2}
            onChange={() =>
              send(
                doesAgree2
                  ? { type: 'agreeSecondAgreement', target: 'form' }
                  : {
                      type: 'disagreeSecondAgreement',
                      target: 'secondAgreement',
                    },
              )
            }
          />
        </SectionCard>
      )}

      {showForm && (
        <form onSubmit={onSubmit}>
          <SectionCard
            title={PageText.Contact.ticketControl.feeComplaint.title}
          >
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
                checked={appSelected}
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
                checked={travelcardSelected}
                onChange={() =>
                  send({
                    type: 'select.travelcard',
                    target: 'travelcard',
                  })
                }
              />
            </div>

            <br />
            {appSelected && (
              <div>
                <Input
                  label={
                    PageText.Contact.ticketControl.feeComplaint.ticketStorage
                      .app.registeredMobile
                  }
                  type="tel"
                  name="registeredMobile"
                />
                <Input
                  label={
                    PageText.Contact.ticketControl.feeComplaint.ticketStorage
                      .app.customerNumber
                  }
                  type="number"
                  name="customerNumber"
                />
              </div>
            )}
            {travelcardSelected && (
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
      )}
    </div>
  );
};
