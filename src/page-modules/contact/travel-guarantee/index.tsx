import { PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import {
  FormCategory,
  travelGuaranteeStateMachine,
} from './travelGuaranteeFormMachine';
import { FormEventHandler } from 'react';
import { Button } from '@atb/components/button';
import style from '../contact.module.css';
import { SectionCard, Radio } from '../components';
import RefundAndTravelGuaranteeForms from './forms/refund-and-travel-guarantee';

const TravelGuaranteeContent = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(travelGuaranteeStateMachine);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    send({ type: 'SUBMIT' });
  };

  return (
    <form onSubmit={onSubmit} className={style.form}>
      <SectionCard title={t(PageText.Contact.travelGuarantee.title)}>
        <ul className={style.form_options__list}>
          {Object.values(FormCategory).map((formCategory) => (
            <li key={formCategory}>
              <Radio
                label={t(
                  PageText.Contact.travelGuarantee[formCategory].description,
                )}
                checked={state.matches({ editing: formCategory })}
                onChange={() =>
                  send({
                    type: 'SELECT_FORM_CATEGORY',
                    formCategory: formCategory,
                  })
                }
              />
            </li>
          ))}
        </ul>
      </SectionCard>

      {state.matches({ editing: 'refundAndTravelGuarantee' }) && (
        <RefundAndTravelGuaranteeForms state={state} send={send} />
      )}

      {state.context.formType && (
        <Button
          title={t(PageText.Contact.submit)}
          mode={'interactive_0--bordered'}
          buttonProps={{ type: 'submit' }}
          state={state.matches('submitting') ? 'loading' : undefined}
          className={style.submitButton}
        />
      )}
    </form>
  );
};

export default TravelGuaranteeContent;
