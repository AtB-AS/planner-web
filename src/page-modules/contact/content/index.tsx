import { FormEventHandler } from 'react';
import style from './content.module.css';

export type ContactContentProps = { title: string };

export const ContactContent = (props: ContactContentProps) => {
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
    <section className={style.container}>
      <h1>Initial title contact schema</h1>
      <form onSubmit={onSubmit}>
        <button type="submit">Send</button>
      </form>
    </section>
  );
};
