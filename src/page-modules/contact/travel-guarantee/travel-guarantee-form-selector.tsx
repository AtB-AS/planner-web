import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { SectionCard } from '../components/section-card';
import style from '../contact.module.css';
import { Typo } from '@atb/components/typography';
import { Checkbox } from '../components/input/checkbox';
import { FormSelector } from '../components/form-selector';
import { machineEvents } from '../machineEvents';
import { ContextProps } from './travelGuaranteeFormMachine';
import { FormSelectorOption } from '../components/form-selector/form-selector';

type TravelGuaranteeFormSelectorProps = {
  state: {
    hasTag(arg0: string): boolean | undefined;
    context: ContextProps;
  };
  send: (event: typeof machineEvents) => void; // Function to send events to the state machine
};

export const TravelGuaranteeFormSelector = ({
  state,
  send,
}: TravelGuaranteeFormSelectorProps) => {
  const { t } = useTranslation();

  const options = [
    {
      label: t(
        PageText.Contact.travelGuarantee.subPageTitles.refundTaxi.description,
      ),
      checked: state.hasTag('taxi'),
      onChange: () => send({ type: 'TAXI' }),
    },
    {
      label: t(
        PageText.Contact.travelGuarantee.subPageTitles.refundCar.description,
      ),
      checked: state.hasTag('car'),
      onChange: () => send({ type: 'CAR' }),
    },
    {
      label: t(
        PageText.Contact.travelGuarantee.subPageTitles
          .refundOtherPublicTransport.description,
      ),
      checked: state.hasTag('other'),
      onChange: () => send({ type: 'OTHER' }),
    },
  ] as FormSelectorOption[];

  return (
    <div>
      {!state.context.isIntialAgreementChecked && (
        <SectionCard title={PageText.Contact.travelGuarantee.title}>
          <Typo.p textType="body__primary">
            {t(
              PageText.Contact.travelGuarantee.layoutAgreement
                .delayedRefundText,
            )}
          </Typo.p>

          <Typo.p textType="body__primary">
            {t(
              PageText.Contact.travelGuarantee.layoutAgreement.ticketRefundText,
            )}
          </Typo.p>

          <Typo.p textType="heading__component">
            {t(
              PageText.Contact.travelGuarantee.layoutAgreement
                .travelGuaranteeExceptions.label,
            )}
          </Typo.p>

          <Typo.p textType="body__primary">
            {t(
              PageText.Contact.travelGuarantee.layoutAgreement
                .travelGuaranteeExceptions.minimumTimeToNextDeparture,
            )}
          </Typo.p>

          <Typo.p textType="body__primary">
            {t(
              PageText.Contact.travelGuarantee.layoutAgreement
                .travelGuaranteeExceptions.externalFactors,
            )}
          </Typo.p>
          <ul className={style.rules__list}>
            {PageText.Contact.travelGuarantee.layoutAgreement.travelGuaranteeExceptions.examples.map(
              (example: TranslatedString, index: number) => (
                <li key={index}>
                  <Typo.p textType="body__primary">{t(example)}</Typo.p>
                </li>
              ),
            )}
          </ul>

          <Typo.p textType="body__primary">
            {t(
              PageText.Contact.travelGuarantee.layoutAgreement
                .travelGuaranteeExceptions.exclusion,
            )}
          </Typo.p>

          <Checkbox
            label={t(
              PageText.Contact.ticketControl.feeComplaint.firstAgreement
                .checkbox,
            )}
            checked={state.context.isIntialAgreementChecked}
            onChange={() =>
              send({ type: 'TOGGLE', field: 'isIntialAgreementChecked' })
            }
          />
        </SectionCard>
      )}

      {state.context.isIntialAgreementChecked && (
        <FormSelector
          title={PageText.Contact.travelGuarantee.title}
          options={options}
        />
      )}
    </div>
  );
};

export default TravelGuaranteeFormSelector;
