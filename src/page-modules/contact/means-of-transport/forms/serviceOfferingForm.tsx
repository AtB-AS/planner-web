import { PageText, useTranslation } from '@atb/translations';
import { MeansOfTransportContextProps } from '../means-of-transport-form-machine';
import { useLines } from '../../lines/use-lines';
import { Typo } from '@atb/components/typography';
import { TransportModeType } from '../../types';
import { Line } from '../..';
import { meansOfTransportFormEvents } from '../events';
import {
  Fieldset,
  Select,
  Input,
  Textarea,
  SearchableSelect,
  getLineOptions,
  FieldWrapperWithError,
  Radio,
} from '../../components';

type ServiceOfferingFormProps = {
  state: { context: MeansOfTransportContextProps };
  send: (event: typeof meansOfTransportFormEvents) => void;
};

export const ServiceOfferingForm = ({
  state,
  send,
}: ServiceOfferingFormProps) => {
  const { t } = useTranslation();
  const { getLinesByMode } = useLines();

  return (
    <>
      <Fieldset
        title={t(PageText.Contact.modeOfTransport.serviceOffering.description)}
      >
        <Typo.p textType="body__m">
          {t(PageText.Contact.modeOfTransport.serviceOffering.info)}
        </Typo.p>
      </Fieldset>

      <Fieldset
        title={t(PageText.Contact.modeOfTransport.serviceOffering.about.title)}
      >
        <Typo.p textType="body__m">
          {t(
            PageText.Contact.modeOfTransport.serviceOffering.about.description,
          )}
        </Typo.p>

        <Select
          id="transportMode"
          label={t(PageText.Contact.input.transportMode.label)}
          value={state.context.transportMode || ''}
          onChange={(value) =>
            send({
              type: 'ON_TRANSPORTMODE_CHANGE',
              value: value as TransportModeType,
            })
          }
          isRequired
          error={
            state.context?.errorMessages['transportMode']?.[0]
              ? t(state.context?.errorMessages['transportMode']?.[0])
              : undefined
          }
          valueToId={(val: string) => val}
          valueToText={(val: string) =>
            t(
              PageText.Contact.input.transportMode.modes[
                val as TransportModeType
              ],
            )
          }
          options={['bus', 'expressboat', 'ferry']}
          placeholder={t(PageText.Contact.input.transportMode.optionLabel)}
        />

        <SearchableSelect
          id="line"
          label={t(PageText.Contact.input.line.label)}
          value={state.context.line}
          placeholder={t(PageText.Contact.input.line.optionLabel)}
          isDisabled={!state.context.transportMode}
          options={getLineOptions(
            getLinesByMode(state.context.transportMode as TransportModeType),
          )}
          onChange={(value: Line | undefined) => {
            send({
              type: 'ON_LINE_CHANGE',
              value: value,
            });
          }}
          isRequired
          error={
            state.context?.errorMessages['line']?.[0] &&
            t(state.context?.errorMessages['line']?.[0])
          }
        />
      </Fieldset>

      <Fieldset title={t(PageText.Contact.input.feedback.title)} isRequired>
        <Textarea
          id="feedback"
          description={t(PageText.Contact.input.feedback.description)}
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
              ? t(state.context.errorMessages['feedback']?.[0])
              : undefined
          }
          fileInputProps={{
            id: 'attachments',
            name: 'attachments',
            iconLabel: t(PageText.Contact.input.feedback.attachment.generic),
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
      <Fieldset
        title={t(PageText.Contact.aboutYouInfo.optionalTitle)}
        isRequired
      >
        <FieldWrapperWithError
          errorMessage={state.context?.errorMessages['isResponseWanted']?.[0]}
        >
          <Radio
            label={t(PageText.Contact.input.wantedResponse.options.yes)}
            checked={state.context.isResponseWanted === true}
            onChange={() =>
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'isResponseWanted',
                value: true,
              })
            }
          />

          <Radio
            label={t(PageText.Contact.input.wantedResponse.options.no)}
            checked={state.context.isResponseWanted === false}
            onChange={() =>
              send({
                type: 'ON_INPUT_CHANGE',
                inputName: 'isResponseWanted',
                value: false,
              })
            }
          />
        </FieldWrapperWithError>

        {state.context.isResponseWanted && (
          <>
            <Input
              id="firstName"
              label={t(PageText.Contact.input.firstName.label)}
              type="text"
              name="firstName"
              isRequired
              value={state.context.firstName || ''}
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
              name="lastName"
              isRequired
              value={state.context.lastName || ''}
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
              name="email"
              isRequired
              value={state.context.email || ''}
              errorMessage={state.context?.errorMessages['email']?.[0]}
              onChange={(e) =>
                send({
                  type: 'ON_INPUT_CHANGE',
                  inputName: 'email',
                  value: e.target.value,
                })
              }
            />
          </>
        )}
      </Fieldset>
    </>
  );
};

export default ServiceOfferingForm;
