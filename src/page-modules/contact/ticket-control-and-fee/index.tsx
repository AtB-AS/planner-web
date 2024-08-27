import { FormEventHandler } from 'react';
import style from './ticket-control-and-fee.module.css';

export type TicketControlAndFeeContentProps = { title: string };

export const TicketControlAndFeeContent = (
  props: TicketControlAndFeeContentProps,
) => {
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

  return (
    <section>
      <form onSubmit={onSubmit}>
        <button type="submit">Send</button>
      </form>
    </section>
  );
};
