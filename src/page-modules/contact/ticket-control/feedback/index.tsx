import { FormEventHandler } from 'react';
import { Button } from '@atb/components/button';
import { SectionCard } from '../../components/section-card';
import { ComponentText, PageText, useTranslation } from '@atb/translations';
import { useLines } from '../../lines/use-lines';
import { TransportModeType } from '@atb-as/config-specs';
import { Input } from '../../components/input';
import { formMachine } from './feedbackformMachine';
import { useMachine } from '@xstate/react';
import { Line } from '../..';
import { Textarea } from '../../components/input/textarea';
import Select from '../../components/input/select';
import { Typo } from '@atb/components/typography';

export const FeedbackForm = () => {
  const { t } = useTranslation();
  const { lines, getLinesByMode, getQuaysByLine } = useLines();
  const [state, send] = useMachine(formMachine, {
    input: {
      date: new Date().toISOString().split('T')[0],
      time: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
    },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!state.matches('submitting')) return;

    const response = await fetch('/api/contact/ticket-control', {
      method: 'POST',
      body: JSON.stringify({
        transportMode: state.context.transportMode,
        line: state.context.line?.name,
        fromStop: state.context.departureLocation?.name,
        toStop: state.context.arrivalLocation?.name,
        date: state.context.date,
        departureTime: state.context.time,
        feedback: state.context.feedback,
        firstName: state.context.firstname,
        lastName: state.context.lastname,
        email: state.context.email,
      }),
    });

    if (response.ok) {
      const res = await response.json();
      send({ type: 'RESOLVE' });
    } else {
      send({ type: 'FALIURE' });
    }
  };

  const isTransportModeUndefined = state.matches({
    editing: { transportMode: { error: 'undefinedTransportMode' } },
  });

  const isLineUndefined = state.matches({
    editing: { line: { error: 'undefinedLine' } },
  });

  const isDepartureLocationUndefined = state.matches({
    editing: {
      departureLocation: { error: 'undefinedDepartureLocation' },
    },
  });
  const isArrivalLocationUndefined = state.matches({
    editing: {
      arrivalLocation: { error: 'undefinedArrivalLocation' },
    },
  });

  const isFeedbackEmpty = state.matches({
    editing: { feedback: { error: 'emptyFeedback' } },
  });

  const isFirstnameEmpty = state.matches({
    editing: { firstname: { error: 'emptyFirstname' } },
  });

  const isLastnameEmpty = state.matches({
    editing: { lastname: { error: 'emptyLastname' } },
  });

  const isEmailEmpty = state.matches({
    editing: { email: { error: 'emptyEmail' } },
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionCard title={PageText.Contact.ticketControl.feedback.title}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.ticketControl.feedback.info)}
        </Typo.p>

        <Select
          label={t(PageText.Contact.ticketControl.feedback.locationQuestion)}
          value={state.context.transportMode}
          onChange={(value) =>
            send({
              type: 'SET_TRANSPORT_MODE',
              transportMode: value as TransportModeType,
            })
          }
          error={
            isTransportModeUndefined
              ? t(
                  PageText.Contact.ticketControl.feedback.transportMode
                    .errorMessage,
                )
              : undefined
          }
          valueToText={(val: TransportModeType) =>
            t(ComponentText.TransportMode.modes[val])
          }
          valueToId={(val: TransportModeType) => val}
          options={['bus', 'water'] as TransportModeType[]}
          placeholder={t(
            PageText.Contact.ticketControl.feedback.transportMode.optionLabel,
          )}
        />
        {state.context.transportMode && (
          <Select
            label={t(PageText.Contact.ticketControl.feedback.line.label)}
            value={state.context.line}
            onChange={(value: Line | undefined) => {
              if (!value) return;
              send({
                type: 'SET_LINE',
                line: value,
              });
            }}
            options={getLinesByMode(
              state.context.transportMode as TransportModeType,
            )}
            valueToId={(line: Line) => line.id}
            valueToText={(line: Line) => line.name}
            placeholder={t(
              PageText.Contact.ticketControl.feedback.line.optionLabel,
            )}
            error={
              isLineUndefined
                ? t(PageText.Contact.ticketControl.feedback.line.errorMessage)
                : undefined
            }
          />
        )}

        {state.context.line && (
          <>
            <Select
              label={t(
                PageText.Contact.ticketControl.feedback.departureLocation.label,
              )}
              value={state.context.departureLocation}
              onChange={(value) => {
                if (!value) return;
                send({
                  type: 'SET_DEPARTURE_LOCATON',
                  departureLocation: value,
                });
              }}
              options={getQuaysByLine(state.context.line.id)}
              placeholder={t(
                PageText.Contact.ticketControl.feedback.departureLocation
                  .optionLabel,
              )}
              error={
                isDepartureLocationUndefined
                  ? t(
                      PageText.Contact.ticketControl.feedback.departureLocation
                        .errorMessage,
                    )
                  : undefined
              }
              valueToId={(quay: Line['quays'][0]) => quay.id}
              valueToText={(quay: Line['quays'][0]) => quay.name}
            />

            <Select
              label={t(
                PageText.Contact.ticketControl.feedback.arrivalLocation.label,
              )}
              value={state.context.arrivalLocation}
              onChange={(value) => {
                if (!value) return;
                send({
                  type: 'SET_ARRIVAL_LOCATON',
                  arrivalLocation: value,
                });
              }}
              placeholder={t(
                PageText.Contact.ticketControl.feedback.arrivalLocation
                  .optionLabel,
              )}
              options={getQuaysByLine(state.context.line.id)}
              error={
                isArrivalLocationUndefined
                  ? t(
                      PageText.Contact.ticketControl.feedback.arrivalLocation
                        .errorMessage,
                    )
                  : undefined
              }
              valueToId={(quay: Line['quays'][0]) => quay.id}
              valueToText={(quay: Line['quays'][0]) => quay.name}
            />

            <Input
              label={PageText.Contact.ticketControl.feedback.date}
              type="date"
              name="date"
              value={state.context.date}
              onChange={(e) =>
                send({
                  type: 'SET_DATE',
                  date: e.target.value,
                })
              }
            />
            <Input
              label={PageText.Contact.ticketControl.feedback.departureTime}
              type="time"
              name="time"
              value={state.context.time}
              onChange={(e) =>
                send({
                  type: 'SET_TIME',
                  time: e.target.value,
                })
              }
            />
          </>
        )}
      </SectionCard>
      <SectionCard title={PageText.Contact.inputFields.feedback.title}>
        <Textarea
          value={state.context.feedback}
          onChange={(e) =>
            send({
              type: 'SET_FEEDBACK',
              feedback: e.target.value,
            })
          }
          error={undefined}
        />
        {/* Todo button to add attatchments */}
      </SectionCard>
      <SectionCard title={PageText.Contact.aboutYouInfo.title}>
        <Input
          label={PageText.Contact.aboutYouInfo.firstname}
          type="text"
          name="firstname"
          value={state.context.firstname}
          errorMessage={
            isFirstnameEmpty
              ? PageText.Contact.aboutYouInfo.errorMessage
              : undefined
          }
          onChange={(e) =>
            send({
              type: 'SET_FIRSTNAME',
              firstname: e.target.value,
            })
          }
        />
        <Input
          label={PageText.Contact.aboutYouInfo.lastname}
          type="text"
          name="lastname"
          value={state.context.lastname}
          errorMessage={
            isLastnameEmpty
              ? PageText.Contact.aboutYouInfo.errorMessage
              : undefined
          }
          onChange={(e) =>
            send({
              type: 'SET_LASTNAME',
              lastname: e.target.value,
            })
          }
        />
        <Input
          label={PageText.Contact.aboutYouInfo.email}
          type="email"
          name="email"
          value={state.context.email}
          errorMessage={
            isEmailEmpty
              ? PageText.Contact.aboutYouInfo.errorMessage
              : undefined
          }
          onChange={(e) =>
            send({
              type: 'SET_EMAIL',
              email: e.target.value,
            })
          }
        />
      </SectionCard>
      <Button
        title={t(PageText.Contact.submit)}
        mode={'interactive_0--bordered'}
        buttonProps={{ type: 'submit' }}
        onClick={() => send({ type: 'SUBMIT' })}
      />
    </form>
  );
};

export default FeedbackForm;
