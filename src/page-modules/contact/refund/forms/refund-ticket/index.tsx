import style from '../../..//contact.module.css';
import { StateFrom } from 'xstate';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { Typo } from '@atb/components/typography';
import { SectionCard, Radio, Checkbox } from '../../../components';
import AppTicketRefund from './appTicketRefund';
import Link from 'next/link';
import { refundStateMachine, RefundTicketForm } from '../../refundFormMachine';
import { RefundFormEvents } from '../../events';

type RefundFormsProps = {
  state: StateFrom<typeof refundStateMachine>;
  send: (event: typeof RefundFormEvents) => void;
};

export const RefundForms = ({ state, send }: RefundFormsProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <SectionCard
        title={t(
          PageText.Contact.ticketing.refund.initialAgreement
            .ticketRefundAvailability.title,
        )}
      >
        <ul className={style.rules__list}>
          {PageText.Contact.ticketing.refund.initialAgreement.ticketRefundAvailability.rules.map(
            (rule: TranslatedString, index: number) => (
              <li key={index}>
                <Typo.p textType="body__primary">{t(rule)}</Typo.p>
              </li>
            ),
          )}
        </ul>
      </SectionCard>
      <SectionCard
        title={t(
          PageText.Contact.ticketing.refund.initialAgreement
            .refundableTicketTypes.title,
        )}
      >
        <ul className={style.rules__list}>
          {PageText.Contact.ticketing.refund.initialAgreement.refundableTicketTypes.rules.map(
            (rule: TranslatedString, index: number) => (
              <li key={index}>
                <Typo.p textType="body__primary">{t(rule)}</Typo.p>
              </li>
            ),
          )}
        </ul>
        <Typo.p textType="body__primary">
          {t(
            PageText.Contact.ticketing.refund.initialAgreement
              .refundableTicketTypes.info.text,
          )}{' '}
          <Link href={'travel-guarantee'}>
            {t(
              PageText.Contact.ticketing.refund.initialAgreement
                .refundableTicketTypes.info.link,
            )}
          </Link>
        </Typo.p>
        <Checkbox
          label={t(
            PageText.Contact.ticketing.refund.initialAgreement
              .refundableTicketTypes.checkbox,
          )}
          checked={state.context.isInitialAgreementChecked}
          onChange={() =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'isInitialAgreementChecked',
              value: !state.context.isInitialAgreementChecked,
            })
          }
        />
      </SectionCard>

      {state.context.isInitialAgreementChecked && (
        <SectionCard title={t(PageText.Contact.ticketing.refund.description)}>
          <ul className={style.form_options__list}>
            {Object.values(RefundTicketForm).map((refundTicketForm) => (
              <li key={refundTicketForm}>
                <Radio
                  label={t(
                    PageText.Contact.ticketing.refund[refundTicketForm].label,
                  )}
                  checked={state.matches({
                    editing: { refundOfTicket: refundTicketForm },
                  })}
                  onChange={(e) =>
                    send({
                      type: 'SELECT_REFUND_TICKET_FORM',
                      refundTicketForm: refundTicketForm,
                    })
                  }
                />
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {state.matches({ editing: { refundOfTicket: 'appTicketRefund' } }) && (
        <AppTicketRefund state={state} send={send} />
      )}
    </div>
  );
};

export default RefundForms;
