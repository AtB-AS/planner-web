import { FormEventHandler } from 'react';
import { useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { refundTaxiFormMachine } from './refundTaxiFormMachine';

export const RefundTaxiForm = () => {
  const { t } = useTranslation();
  const [state, send] = useMachine(refundTaxiFormMachine);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!state.matches('submitting')) return;

    const response = await fetch('/api/contact/travel-guarentee', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const res = await response.json();
      send({ type: 'RESOLVE' });
    } else {
      send({ type: 'FALIURE' });
    }
  };

  return <div>Hello RefundTaxiForm</div>;
};

export default RefundTaxiForm;
