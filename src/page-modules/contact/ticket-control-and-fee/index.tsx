import { FormEventHandler } from 'react';
import { useMachine } from '@xstate/react';
import { formMachine } from './formMachine';

export type TicketControlAndFeeContentProps = { title: string };

export const TicketControlAndFeeContent = (
  props: TicketControlAndFeeContentProps,
) => {
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
      //console.log(res);
    }
  };

  return (
    <div>
      <div>
        <h1>
          Check 1{' '}
          <input
            type="checkbox"
            name="aggreement1"
            value="aggreement1"
            onChange={
              state.matches('idle')
                ? () => send({ type: 'agree1', target: 'idle2' })
                : () => send({ type: 'disagree1', target: 'idle' })
            }
          />
        </h1>
      </div>

      {state.matches('agreement2') && (
        <div>
          <h1>
            Check 2{' '}
            <input
              type="checkbox"
              name="aggreement2"
              value="aggreement2"
              onChange={
                state.matches({ agreement2: 'idle2' })
                  ? () => send({ type: 'agree2', target: 'fill' })
                  : () => send({ type: 'disagree2', target: 'idle2' })
              }
            />
          </h1>
        </div>
      )}

      {state.matches({ agreement2: 'form' }) && (
        <div>
          <form>
            <h1>Informasjon om gebyret</h1>
            <div>
              <label htmlFor="gebyrnummer">Gebyrnummer:</label>
              <input
                type="text"
                id="gebyrnummer"
                pattern="[0-9]*" // Valgfritt: Begrens inndata til tall
              />
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="useCase"
                  //checked={}
                  //onChange={handleOptionChange}
                />
                App
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  value="useCase"
                  //checked={selectedOption === 'useCase'}
                  //onChange={handleOptionChange}
                />
                Reisekort
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  value="useCase"
                  //checked={selectedOption === 'useCase'}
                  //onChange={handleOptionChange}
                />
                Annet
              </label>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
