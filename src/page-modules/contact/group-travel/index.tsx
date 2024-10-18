import { useMachine } from '@xstate/react';
import { groupTravelStateMachine } from './group-travel-state-machine';
import { SectionCard } from '../components/section-card';
import { PageText, useTranslation } from '@atb/translations';
import style from '../contact.module.css';
import { RadioInput } from '../components/input/radio';
import { Typo } from '@atb/components/typography';
import { useLines } from '../lines/use-lines';
import { Line } from '../server/journey-planner/validators';
import { Input } from '../components/input';
import { Textarea } from '../components/input/textarea';
import { Button } from '@atb/components/button';
import SearchableSelect from '../components/input/searchable-select';
import {
  getLineOptions,
  getStopOptions,
} from '../components/input/searchable-select/utils';

export default function GroupTravelContent() {
  const { t } = useTranslation();
  const [state, send] = useMachine(groupTravelStateMachine);
  const { getLinesByMode, getQuaysByLine } = useLines();
  const { formData, travelType, errors } = state.context;

  const handleInputChange = (field: string, value: any) => {
    send({
      type: 'UPDATE_FORM_DATA',
      formData: {
        ...formData,
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send({ type: 'SUBMIT' });
  };

  return (
    <div>
      <SectionCard title={t(PageText.Contact.groupTravel.title)}>
        <ul className={style.form_options__list}>
          <li>
            <RadioInput
              label={t(PageText.Contact.groupTravel.travelTypeBus.radioLabel)}
              value={'bus'}
              checked={travelType === 'bus'}
              onChange={(e) =>
                send({ type: 'SELECT_TRAVEL_TYPE', travelType: 'bus' })
              }
            />
          </li>
          <li>
            <RadioInput
              label={t(PageText.Contact.groupTravel.travelTypeBoat.radioLabel)}
              value={'boat'}
              checked={travelType === 'boat'}
              onChange={(e) =>
                send({ type: 'SELECT_TRAVEL_TYPE', travelType: 'boat' })
              }
            />
          </li>
        </ul>
      </SectionCard>

      {travelType === 'bus' && (
        <form onSubmit={handleSubmit}>
          <SectionCard
            title={t(PageText.Contact.groupTravel.travelTypeBus.radioLabel)}
          >
            {PageText.Contact.groupTravel.travelTypeBus.paragraphs.map(
              (paragraph, i) => (
                <Typo.p key={`bus-info-${i}`} textType="body__primary">
                  {t(paragraph)}
                </Typo.p>
              ),
            )}

            <Typo.p textType="heading__component">
              {t(PageText.Contact.groupTravel.travelTypeBus.kindergarden.title)}
            </Typo.p>

            {PageText.Contact.groupTravel.travelTypeBus.kindergarden.paragraphs.map(
              (paragraph, i) => (
                <Typo.p
                  key={`bus-kindergarden-info-${i}`}
                  textType="body__primary"
                >
                  {t(paragraph)}
                </Typo.p>
              ),
            )}

            <Typo.p textType="heading__component">
              {t(PageText.Contact.groupTravel.travelTypeBus.form.title)}
            </Typo.p>

            <Typo.p textType="body__primary">
              {t(PageText.Contact.groupTravel.travelTypeBus.form.info)}
            </Typo.p>
          </SectionCard>

          <SectionCard
            title={t(
              PageText.Contact.groupTravel.travelTypeBus.form.travelInformation
                .title,
            )}
          >
            <Input
              label={
                PageText.Contact.groupTravel.travelTypeBus.form
                  .travelInformation.dateOfTravel.title
              }
              type="date"
              name="date"
              value={formData.dateOfTravel}
              onChange={(e) =>
                handleInputChange('dateOfTravel', e.target.value)
              }
              errorMessage={
                errors.dateOfTravel
                  ? PageText.Contact.input.date.errorMessages.empty
                  : undefined
              }
            />

            <SearchableSelect
              label={t(
                PageText.Contact.groupTravel.travelTypeBus.form
                  .travelInformation.line.title,
              )}
              value={formData.line}
              onChange={(value: Line | undefined) => {
                if (!value) return;
                handleInputChange('line', value);
              }}
              options={getLineOptions(getLinesByMode('bus'))}
              placeholder={t(PageText.Contact.input.line.optionLabel)}
              error={
                errors.line
                  ? t(PageText.Contact.input.line.errorMessages.empty)
                  : undefined
              }
            />

            <SearchableSelect
              label={t(
                PageText.Contact.groupTravel.travelTypeBus.form
                  .travelInformation.fromStop.title,
              )}
              value={formData.fromStop}
              isDisabled={!formData.line}
              onChange={(value) => {
                if (!value) return;
                handleInputChange('fromStop', value);
              }}
              options={getStopOptions(getQuaysByLine(formData.line?.id ?? ''))}
              placeholder={t(PageText.Contact.input.fromStop.optionLabel)}
              error={
                errors.fromStop
                  ? t(PageText.Contact.input.fromStop.errorMessages.empty)
                  : undefined
              }
            />
            <Input
              label={
                PageText.Contact.groupTravel.travelTypeBus.form
                  .travelInformation.departureTime.title
              }
              type="time"
              name="time"
              value={formData.departureTime}
              onChange={(e) =>
                handleInputChange('departureTime', e.target.value)
              }
              errorMessage={
                errors.departureTime
                  ? PageText.Contact.input.plannedDepartureTime.errorMessages
                      .empty
                  : undefined
              }
            />

            <SearchableSelect
              label={t(
                PageText.Contact.groupTravel.travelTypeBus.form
                  .travelInformation.toStop.title,
              )}
              value={formData.toStop}
              isDisabled={!formData.line}
              onChange={(value) => {
                if (!value) return;
                handleInputChange('toStop', value);
              }}
              placeholder={t(PageText.Contact.input.toStop.optionLabel)}
              options={getStopOptions(getQuaysByLine(formData.line?.id ?? ''))}
              error={
                errors.toStop
                  ? t(PageText.Contact.input.toStop.errorMessages.empty)
                  : undefined
              }
            />
          </SectionCard>

          <SectionCard
            title={t(
              PageText.Contact.groupTravel.travelTypeBus.form.travelReturn
                .title,
            )}
          >
            <SearchableSelect
              label={t(
                PageText.Contact.groupTravel.travelTypeBus.form.travelReturn
                  .line.title,
              )}
              value={formData.returnLine}
              onChange={(value: Line | undefined) => {
                if (!value) return;
                handleInputChange('returnLine', value);
              }}
              options={getLineOptions(getLinesByMode('bus'))}
              placeholder={t(PageText.Contact.input.line.optionLabel)}
            />

            <SearchableSelect
              label={t(
                PageText.Contact.groupTravel.travelTypeBus.form.travelReturn
                  .fromStop.title,
              )}
              value={formData.returnFromStop}
              isDisabled={!formData.returnLine}
              onChange={(value) => {
                if (!value) return;
                handleInputChange('returnFromStop', value);
              }}
              options={getStopOptions(getQuaysByLine(formData.line?.id ?? ''))}
              placeholder={t(PageText.Contact.input.fromStop.optionLabel)}
            />
            <Input
              label={
                PageText.Contact.groupTravel.travelTypeBus.form.travelReturn
                  .departureTime.title
              }
              type="time"
              name="time"
              value={formData.returnDepartureTime}
              onChange={(e) =>
                handleInputChange('returnDepartureTime', e.target.value)
              }
            />

            <SearchableSelect
              label={t(
                PageText.Contact.groupTravel.travelTypeBus.form.travelReturn
                  .toStop.title,
              )}
              value={formData.returnToStop}
              isDisabled={!formData.returnLine}
              onChange={(value) => {
                if (!value) return;
                handleInputChange('returnToStop', value);
              }}
              placeholder={t(PageText.Contact.input.toStop.optionLabel)}
              options={getStopOptions(getQuaysByLine(formData.line?.id ?? ''))}
            />
          </SectionCard>

          <SectionCard
            title={t(
              PageText.Contact.groupTravel.travelTypeBus.form.groupInformation
                .title,
            )}
          >
            <Input
              label={
                PageText.Contact.groupTravel.travelTypeBus.form.groupInformation
                  .groupSize.title
              }
              type="number"
              name="groupSize"
              value={formData.groupSize}
              onChange={(e) => handleInputChange('groupSize', e.target.value)}
              errorMessage={
                errors.groupSize
                  ? PageText.Contact.groupTravel.travelTypeBus.form
                      .groupInformation.groupSize.error
                  : undefined
              }
            />
            <Typo.p textType="body__primary">
              {t(
                PageText.Contact.groupTravel.travelTypeBus.form.groupInformation
                  .groupInfo.title,
              )}
            </Typo.p>
            <Textarea
              value={formData.groupInfo}
              onChange={(e) => handleInputChange('groupInfo', e.target.value)}
              error={
                errors.groupInfo
                  ? t(
                      PageText.Contact.groupTravel.travelTypeBus.form
                        .groupInformation.groupInfo.error,
                    )
                  : undefined
              }
            />
            <Input
              label={
                PageText.Contact.groupTravel.travelTypeBus.form.groupInformation
                  .firstName.title
              }
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              errorMessage={
                errors.firstName
                  ? PageText.Contact.groupTravel.travelTypeBus.form
                      .groupInformation.firstName.error
                  : undefined
              }
            />
            <Input
              label={
                PageText.Contact.groupTravel.travelTypeBus.form.groupInformation
                  .lastName.title
              }
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              errorMessage={
                errors.lastName
                  ? PageText.Contact.groupTravel.travelTypeBus.form
                      .groupInformation.lastName.error
                  : undefined
              }
            />
            <Input
              label={
                PageText.Contact.groupTravel.travelTypeBus.form.groupInformation
                  .responsiblePersonPhone.title
              }
              type="tel"
              name="responsiblePersonPhone"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              errorMessage={
                errors.phoneNumber
                  ? PageText.Contact.groupTravel.travelTypeBus.form
                      .groupInformation.responsiblePersonPhone.error
                  : undefined
              }
            />
            <Input
              label={
                PageText.Contact.groupTravel.travelTypeBus.form.groupInformation
                  .responsiblePersonEmail.title
              }
              type="email"
              name="responsiblePersonEmail"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              errorMessage={
                errors.email
                  ? PageText.Contact.groupTravel.travelTypeBus.form
                      .groupInformation.responsiblePersonEmail.error
                  : undefined
              }
            />
          </SectionCard>

          <Button
            title={t(PageText.Contact.submit)}
            mode={'interactive_0--bordered'}
            buttonProps={{ type: 'submit' }}
            state={
              state.matches({ busForm: 'submitting' }) ? 'loading' : undefined
            }
            className={style.submitButton}
          />
        </form>
      )}

      {travelType === 'boat' && (
        <SectionCard
          title={t(PageText.Contact.groupTravel.travelTypeBoat.radioLabel)}
        >
          <Typo.p textType="body__primary">
            <span>
              {t(
                PageText.Contact.groupTravel.travelTypeBoat.contactInformation
                  .info,
              )}
              &nbsp;
              <a
                href={t(
                  PageText.Contact.groupTravel.travelTypeBoat.contactInformation
                    .url,
                )}
                target="_blank"
                rel="noreferrer"
              >
                {t(
                  PageText.Contact.groupTravel.travelTypeBoat.contactInformation
                    .externalLink,
                )}
              </a>
            </span>
          </Typo.p>
          <Typo.p textType="body__primary">
            {t(PageText.Contact.groupTravel.travelTypeBoat.discountInformation)}
          </Typo.p>
        </SectionCard>
      )}
    </div>
  );
}
