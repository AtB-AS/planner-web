import { Button, ButtonLink } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import { PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { FormEventHandler } from 'react';
import { Fieldset, Input, Textarea } from '../components';
import style from '../contact.module.css';
import { findOrderFormFields } from '../utils';
import { journeyInfoStateMachine } from './journeyInfoStateMachine';

export default function JourneyInfoContent() {
  const { t } = useTranslation();
  const [state, send] = useMachine(journeyInfoStateMachine);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    send({ type: 'SUBMIT', orderedFormFieldNames: findOrderFormFields(e) });
  };

  return (
    <form onSubmit={onSubmit} className={style.form}>
      <Fieldset
        title={t(PageText.Contact.journeyInfo.input.question.title)}
        isRequired
      >
        <div className={style.extraInfo}>
          <p>{t(PageText.Contact.journeyInfo.info.useTravelSearch)}</p>

          <div className={style.extraInfo__buttonContainer}>
            <ButtonLink
              href="/"
              mode="interactive_0"
              title={t(PageText.Contact.journeyInfo.info.useTravelSearchLink)}
              icon={{
                right: (
                  <MonoIcon icon="navigation/ArrowRight" overrideMode="dark" />
                ),
              }}
            />
          </div>
        </div>

        <Textarea
          id="question"
          description={t(PageText.Contact.journeyInfo.input.question.info)}
          value={state.context.question || ''}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'question',
              value: e.target.value,
            })
          }
          error={
            state.context.errorMessages['question']?.[0]
              ? t(state.context.errorMessages['question']?.[0])
              : undefined
          }
          fileInputProps={{
            id: 'attachments',
            name: 'attachments',
            iconLabel: t(
              PageText.Contact.journeyInfo.input.question.attachment,
            ),
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
      </Fieldset>

      <Button
        title={t(PageText.Contact.submit)}
        mode={'interactive_0--bordered'}
        buttonProps={{ type: 'submit' }}
        state={state.matches('submitting') ? 'loading' : undefined}
        className={style.submitButton}
      />
    </form>
  );
}
