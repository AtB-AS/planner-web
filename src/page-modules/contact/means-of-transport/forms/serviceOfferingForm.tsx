import { PageText, useTranslation } from '@atb/translations';
import { ContextProps } from '../means-of-transport-form-machine';
import { useLines } from '../../lines/use-lines';
import { SectionCard } from '../../components/section-card';
import { Typo } from '@atb/components/typography';
import Select from '../../components/input/select';
import { ComponentText } from '@atb/translations';
import { Input } from '../../components/input';
import { TransportModeType } from '@atb-as/config-specs';
import { Line } from '../..';
import { FileInput } from '../../components/input/file';
import { Textarea } from '../../components/input/textarea';
import { meansOfTransportFormEvents } from '../events';
import SearchableSelect from '../../components/input/searchable-select';
import {
  getLineOptions,
  getStopOptions,
} from '../../components/input/searchable-select/utils';

type ServiceOfferingFormProps = {
  state: { context: ContextProps };
  send: (event: typeof meansOfTransportFormEvents) => void;
};

export const ServiceOfferingForm = ({
  state,
  send,
}: ServiceOfferingFormProps) => {
  const { t } = useTranslation();
  const { getLinesByMode } = useLines();

  return (
    <div>
      <SectionCard
        title={t(PageText.Contact.modeOfTransport.serviceOffering.description)}
      >
        <Typo.p textType="body__primary">
          {t(PageText.Contact.modeOfTransport.serviceOffering.info)}
        </Typo.p>
      </SectionCard>

      <SectionCard
        title={t(PageText.Contact.modeOfTransport.serviceOffering.about.title)}
      >
        <Typo.p textType="body__primary">
          {t(
            PageText.Contact.modeOfTransport.serviceOffering.about.description,
          )}
        </Typo.p>

        <Select
          label={t(PageText.Contact.input.area.label).toString()}
          value={state.context.area}
          valueToId={(option) => option.id}
          valueToText={(option) => t(option.name)}
          onChange={(value) => {
            if (!value) return;
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'area',
              value: value,
            });
          }}
          placeholder={t(PageText.Contact.input.area.optionLabel)}
          options={PageText.Contact.input.area.options}
          error={
            state.context?.errorMessages['area']?.[0]
              ? t(state.context?.errorMessages['area']?.[0])
              : undefined
          }
        />

        <Select
          label={t(PageText.Contact.input.transportMode.label).toString()}
          value={state.context.transportMode}
          onChange={(value) =>
            send({
              type: 'ON_TRANSPORTMODE_CHANGE',
              value: value as TransportModeType,
            })
          }
          error={
            state.context?.errorMessages['transportMode']?.[0]
              ? t(state.context?.errorMessages['transportMode']?.[0])
              : undefined
          }
          valueToText={(val: TransportModeType) =>
            t(ComponentText.TransportMode.modes[val])
          }
          valueToId={(val: TransportModeType) => val}
          options={['bus', 'water'] as TransportModeType[]}
          placeholder={t(PageText.Contact.input.transportMode.optionLabel)}
        />

        <SearchableSelect
          label={t(PageText.Contact.input.line.label)}
          value={state.context.line}
          isDisabled={!state.context.transportMode}
          onChange={(value: Line | undefined) => {
            send({
              type: 'ON_LINE_CHANGE',
              value: value,
            });
          }}
          options={getLineOptions(
            getLinesByMode(state.context.transportMode as TransportModeType),
          )}
          placeholder={t(PageText.Contact.input.line.optionLabel)}
          error={
            state.context?.errorMessages['line']?.[0]
              ? t(state.context?.errorMessages['line']?.[0])
              : undefined
          }
        />
      </SectionCard>

      <SectionCard title={t(PageText.Contact.input.feedback.title)}>
        <Typo.p textType="body__primary">
          {t(PageText.Contact.input.feedback.description)}
        </Typo.p>
        <Textarea
          value={state.context.feedback || ''}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'feedback',
              value: e.target.value,
            })
          }
          error={
            state.context.errorMessages['feedback']?.[0]
              ? t(state.context.errorMessages['feedback']?.[0]).toString()
              : undefined
          }
        />
        <FileInput
          name="attachments"
          label={t(PageText.Contact.input.feedback.attachment)}
          onChange={(files) => {
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'attachments',
              value: files,
            });
          }}
        />
      </SectionCard>
      <SectionCard title={t(PageText.Contact.aboutYouInfo.optionalTitle)}>
        <Input
          label={PageText.Contact.input.firstName.label}
          type="text"
          name="firstName"
          value={state.context.firstName || ''}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'firstName',
              value: e.target.value,
            })
          }
        />

        <Input
          label={PageText.Contact.input.lastName.label}
          type="text"
          name="lastName"
          value={state.context.lastName || ''}
          onChange={(e) =>
            send({
              type: 'ON_INPUT_CHANGE',
              inputName: 'lastName',
              value: e.target.value,
            })
          }
        />
      </SectionCard>
    </div>
  );
};

export default ServiceOfferingForm;
