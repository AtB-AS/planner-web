import { FormEventHandler } from 'react';
import { Button } from '@atb/components/button';
import { SectionCard } from '../../components/section-card';
import { ComponentText, PageText, useTranslation } from '@atb/translations';
import { useLines } from '../../lines/use-lines';
import { TransportModeType } from '@atb-as/config-specs';
import { Input } from '../../components/input';
import style from '../ticket-control.module.css';
import { formMachine } from './feedbackformMachine';
import { useMachine } from '@xstate/react';
import { andIf } from '@atb/utils/css';
import { Line } from '../..';

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

    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(state.context),
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
        <p>{t(PageText.Contact.ticketControl.feedback.info)}</p>
        <p>{t(PageText.Contact.ticketControl.feedback.locationQuestion)}</p>

        <label>
          {t(PageText.Contact.ticketControl.feedback.transportMode.label)}
        </label>

        <select
          name="transportModes"
          value={state.context.transportMode}
          onChange={(e) =>
            send({
              type: 'SET_TRANSPORT_MODE',
              transportMode: e.target.value as TransportModeType,
            })
          }
        >
          <option
            label={t(
              PageText.Contact.ticketControl.feedback.transportMode.optionLabel,
            )}
            selected
            disabled
            value={undefined}
          />
          <option value="bus">
            {t(ComponentText.TransportMode.modes['bus'])}
          </option>
          <option value="water">
            {' '}
            {t(ComponentText.TransportMode.modes['water'])}
          </option>
        </select>
        {isTransportModeUndefined && (
          <label
            className={andIf({
              [style.feedback_label__error]: isTransportModeUndefined,
            })}
          >
            {t(
              PageText.Contact.ticketControl.feedback.transportMode
                .errorMessage,
            )}
          </label>
        )}

        {state.context.transportMode && (
          <>
            <label>
              {t(PageText.Contact.ticketControl.feedback.line.label)}
            </label>

            <select
              name="lines"
              value={state.context.line?.id}
              onChange={(e) =>
                send({
                  type: 'SET_LINE',
                  line: lines?.filter(
                    (line) => line.id === e.target.value,
                  )[0] as Line,
                })
              }
            >
              <option
                label={t(
                  PageText.Contact.ticketControl.feedback.line.optionLabel,
                )}
                selected
                disabled
                value={undefined}
              />
              {getLinesByMode(
                state.context.transportMode as TransportModeType,
              ).map((line) => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </select>
            {isLineUndefined && (
              <label
                className={andIf({
                  [style.feedback_label__error]: isLineUndefined,
                })}
              >
                {t(PageText.Contact.ticketControl.feedback.line.errorMessage)}
              </label>
            )}
          </>
        )}

        {state.context.line && (
          <>
            <label>
              {t(
                PageText.Contact.ticketControl.feedback.departureLocation.label,
              )}
            </label>

            <select
              name="departure"
              value={state.context.departureLocation?.id}
              onChange={(e) =>
                send({
                  type: 'SET_DEPARTURE_LOCATON',
                  departureLocation: state.context.line?.quays.filter(
                    (quay) => quay.id === e.target.value,
                  )[0] as Line['quays'][0],
                })
              }
            >
              <option
                label={t(
                  PageText.Contact.ticketControl.feedback.departureLocation
                    .optionLabel,
                )}
                selected
                disabled
                value={undefined}
              />
              {getQuaysByLine(state.context.line.id).map((quay) => (
                <option key={quay.id} value={quay.id}>
                  {quay.name}
                </option>
              ))}
            </select>
            {isDepartureLocationUndefined && (
              <label
                className={andIf({
                  [style.feedback_label__error]: isDepartureLocationUndefined,
                })}
              >
                {t(
                  PageText.Contact.ticketControl.feedback.departureLocation
                    .errorMessage,
                )}
              </label>
            )}
          </>
        )}

        {state.context.line && (
          <>
            <label>
              {t(PageText.Contact.ticketControl.feedback.arrivalLocation.label)}
            </label>

            <select
              name="arrival"
              value={state.context.arrivalLocation?.id}
              onChange={(e) =>
                send({
                  type: 'SET_ARRIVAL_LOCATON',
                  arrivalLocation: state.context.line?.quays.filter(
                    (quay) => quay.id === e.target.value,
                  )[0] as Line['quays'][0],
                })
              }
            >
              <option
                label={t(
                  PageText.Contact.ticketControl.feedback.arrivalLocation
                    .optionLabel,
                )}
                selected
                disabled
                value={undefined}
              />
              {getQuaysByLine(state.context.line.id).map((quay) => (
                <option key={quay.id} value={quay.id}>
                  {quay.name}
                </option>
              ))}
            </select>
            {isArrivalLocationUndefined && (
              <label
                className={andIf({
                  [style.feedback_label__error]: isArrivalLocationUndefined,
                })}
              >
                {t(
                  PageText.Contact.ticketControl.feedback.arrivalLocation
                    .errorMessage,
                )}
              </label>
            )}

            <div>
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
            </div>
          </>
        )}
      </SectionCard>
      <SectionCard title={PageText.Contact.feedback.question}>
        <textarea
          className={andIf({
            [style.feedback]: true,
            [style.feedback__error]: isFeedbackEmpty,
          })}
          name="feedback"
          value={state.context.feedback}
          onChange={(e) =>
            send({
              type: 'SET_FEEDBACK',
              feedback: e.target.value,
            })
          }
        />
        {isFeedbackEmpty && (
          <label className={style.feedback_label__error}>
            {t(PageText.Contact.feedback.errorMessage)}
          </label>
        )}
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
