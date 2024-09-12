import FormSelector from './form-selector';
import { SectionCard } from '../components/section-card';
import { ComponentText, PageText, useTranslation } from '@atb/translations';
import { useMachine } from '@xstate/react';
import { travelGuaranteeFormMachine } from './travelGuaranteeFormMachine';
import { Input } from '../components/input';
import { TransportModeType } from '@atb/modules/transport-mode';
import { useLines } from '../lines/use-lines';
import { Line } from '..';
import { andIf } from '@atb/utils/css';

export const RefundForm = () => {
  const { t } = useTranslation();
  const { lines, getLinesByMode, getQuaysByLine } = useLines();
  const [state, send] = useMachine(travelGuaranteeFormMachine, {
    input: {
      isChecked: false,
      date: new Date().toISOString().split('T')[0],
      time: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
    },
  });

  return (
    <div>
      <FormSelector state={state} send={send} />
      {state.hasTag('taxi') && (
        <div>
          <SectionCard
            title={
              PageText.Contact.travelGuarantee.refundTaxi.information.title
            }
          ></SectionCard>
          <SectionCard
            title={
              PageText.Contact.travelGuarantee.refundTaxi.aboutYourTrip.title
            }
          >
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
                  PageText.Contact.ticketControl.feedback.transportMode
                    .optionLabel,
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
                {false && (
                  <label
                  // className={andIf({
                  //   [style.feedback_label__error]: isLineUndefined,
                  // })}
                  >
                    {t(
                      PageText.Contact.ticketControl.feedback.line.errorMessage,
                    )}
                  </label>
                )}
              </>
            )}

            {state.context.line && (
              <>
                <label>
                  {t(
                    PageText.Contact.ticketControl.feedback.departureLocation
                      .label,
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
                {!state.context.line && (
                  <label
                  //className={andIf({
                  //  [style.feedback_label__error]:
                  //    isDepartureLocationUndefined,
                  //})}
                  >
                    {t(
                      PageText.Contact.ticketControl.feedback.departureLocation
                        .errorMessage,
                    )}
                  </label>
                )}
              </>
            )}
          </SectionCard>
        </div>
      )}

      {state.hasTag('car') && (
        <div>
          <SectionCard
            title={
              PageText.Contact.travelGuarantee.refundCar.aboutTheCarTrip.title
            }
          ></SectionCard>
          <SectionCard
            title={
              PageText.Contact.travelGuarantee.refundCar.aboutThePlanedTrip
                .title
            }
          ></SectionCard>
        </div>
      )}
      {state.hasTag('selected') && (
        <div>
          <SectionCard
            title={PageText.Contact.travelGuarantee.optionalFeedback.title}
          ></SectionCard>
          <SectionCard
            title={PageText.Contact.aboutYouInfo.title}
          ></SectionCard>
        </div>
      )}
    </div>
  );
};

export default RefundForm;
