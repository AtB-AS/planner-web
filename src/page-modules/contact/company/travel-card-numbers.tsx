import {
  Button,
  ErrorMessage,
  Typo,
  useTranslation,
  type InputErrorMessages,
} from '@mrfylke/contact-form';
import { CompanyText as tx } from './text.ts';
import style from './company.module.css';

type Props = {
  values: string[];
  errors: InputErrorMessages;
  onChange: (values: string[]) => void;
};

export default function TravelCardNumbers({ values, errors, onChange }: Props) {
  const { t } = useTranslation();
  const label = t(tx.order.travelCardNumber);

  return (
    <div
      role="group"
      aria-labelledby="travelCardNumbers-label"
      className={style.travelCards}
    >
      <label id="travelCardNumbers-label" htmlFor="input__travelCardNumber0">
        <Typo.span textType="body__m">{label}</Typo.span>
      </label>
      <Typo.p textType="body__s" id="travelCardNumbers-description">
        {t(tx.order.travelCardNumberInfo)}
      </Typo.p>

      {values.map((value, i) => {
        const error = errors[`travelCardNumber${i}`]?.[0];
        return (
          <div key={i}>
            <div className={style.travelCardRow}>
              <input
                id={`input__travelCardNumber${i}`}
                name={`travelCardNumber${i}`}
                className={`${style.input} ${error ? style.inputError : ''}`}
                inputMode="numeric"
                aria-label={values.length > 1 ? `${label} ${i + 1}` : undefined}
                aria-invalid={!!error}
                aria-describedby={`travelCardNumbers-description${
                  error ? ` error-input__travelCardNumber${i}` : ''
                }`}
                value={value}
                onChange={(e) =>
                  onChange(
                    values.map((v, j) =>
                      j === i ? e.target.value.replace(/\s/g, '') : v,
                    ),
                  )
                }
              />
              {values.length > 1 && (
                <Button
                  title={t(tx.order.removeTravelCard)}
                  mode="interactive_0--bordered"
                  buttonProps={{
                    'aria-label': `${t(tx.order.removeTravelCard)} ${label} ${i + 1}`,
                  }}
                  onClick={() => onChange(values.filter((_, j) => j !== i))}
                />
              )}
            </div>
            {error && (
              <ErrorMessage
                message={t(error)}
                id={`error-input__travelCardNumber${i}`}
              />
            )}
          </div>
        );
      })}

      <Button
        title={t(tx.order.addTravelCard)}
        mode="interactive_0--bordered"
        onClick={() => onChange([...values, ''])}
      />
    </div>
  );
}
