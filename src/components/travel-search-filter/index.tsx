import { getTextForLanguage } from '@atb/translations/utils';
import { useTranslation } from '@atb/translations';
import { ChangeEvent, useState } from 'react';
import style from './travel-search-filter.module.css';
import { getTransportModeIconPath } from '@atb/components/travel-search-filter/utils';
import { MonoIcon } from '@atb/components/icon';
import { TransportModeFilterOptionWithSelectionType } from '@atb/components/travel-search-filter/types';
import { Typo } from '@atb/components/typography';

const defaultTravelSearchFilter: TransportModeFilterOptionWithSelectionType[] =
  [
    {
      id: 'bus',
      icon: {
        transportMode: 'bus',
      },
      text: [
        { lang: 'nob', value: 'Buss' },
        { lang: 'eng', value: 'Bus' },
        { lang: 'nno', value: 'Buss' },
      ],
      modes: [
        {
          transportMode: 'bus',
          transportSubModes: [
            'dedicatedLaneBus',
            'demandAndResponseBus',
            'expressBus',
            'localBus',
            'highFrequencyBus',
            'mobilityBus',
            'mobilityBusForRegisteredDisabled',
            'nightBus',
            'postBus',
            'railReplacementBus',
            'regionalBus',
            'riverBus',
            'schoolAndPublicServiceBus',
            'schoolBus',
            'shuttleBus',
            'sightseeingBus',
            'specialNeedsBus',
          ],
        },
        { transportMode: 'coach' },
        { transportMode: 'trolleybus' },
      ],
      selected: true,
    },
    {
      id: 'rail',
      icon: {
        transportMode: 'rail',
      },
      text: [
        { lang: 'nob', value: 'Tog' },
        { lang: 'eng', value: 'Train' },
        { lang: 'nno', value: 'Tog' },
      ],
      modes: [
        { transportMode: 'rail' },
        {
          transportMode: 'bus',
          transportSubModes: ['railReplacementBus'],
        },
      ],
      selected: true,
    },
    {
      id: 'expressboat',
      icon: {
        transportMode: 'water',
        transportSubMode: 'highSpeedPassengerService',
      },
      text: [
        { lang: 'nob', value: 'Hurtigbåt' },
        { lang: 'eng', value: 'Express boat' },
        { lang: 'nno', value: 'Hurtigbåt' },
      ],
      modes: [
        {
          transportMode: 'water',
          transportSubModes: [
            'highSpeedPassengerService',
            'highSpeedVehicleService',
            'sightseeingService',
            'localPassengerFerry',
            'internationalPassengerFerry',
          ],
        },
      ],
      selected: true,
    },
    {
      id: 'ferry',
      icon: {
        transportMode: 'water',
      },
      text: [
        { lang: 'nob', value: 'Bilferge' },
        { lang: 'eng', value: 'Car ferry' },
        { lang: 'nno', value: 'Bilferje' },
      ],
      modes: [
        {
          transportMode: 'water',
          transportSubModes: [
            'highSpeedVehicleService',
            'internationalCarFerry',
            'localCarFerry',
            'nationalCarFerry',
          ],
        },
      ],
      selected: true,
    },
    {
      id: 'airportbus',
      icon: {
        transportMode: 'bus',
      },
      text: [
        { lang: 'nob', value: 'Flybuss' },
        { lang: 'eng', value: 'Airport bus' },
        { lang: 'nno', value: 'Flybuss' },
      ],
      modes: [
        {
          transportMode: 'bus',
          transportSubModes: ['airportLinkBus'],
        },
      ],
      selected: true,
    },
    {
      id: 'air',
      icon: {
        transportMode: 'air',
      },
      text: [
        { lang: 'nob', value: 'Fly' },
        { lang: 'eng', value: 'Plane' },
        { lang: 'nno', value: 'Fly' },
      ],
      modes: [{ transportMode: 'air' }],
      selected: true,
    },
    {
      id: 'other',
      icon: {
        transportMode: 'unknown',
      },
      text: [
        { lang: 'nob', value: 'Annet' },
        { lang: 'eng', value: 'Other' },
        { lang: 'nno', value: 'Andre transportmiddel' },
      ],
      description: [
        { lang: 'nob', value: 'Trikk, t-bane, gondoler, kabelbane, …' },
        { lang: 'eng', value: 'Tram, metro, cableway, funicular, …' },
        { lang: 'nno', value: 'Trikk, t-bane, gondolar, kabelbane, …' },
      ],
      modes: [
        { transportMode: 'tram' },
        { transportMode: 'metro' },
        { transportMode: 'cableway' },
        { transportMode: 'funicular' },
        { transportMode: 'monorail' },
        { transportMode: 'lift' },
      ],
      selected: true,
    },
  ];

type TravelSearchFilterProps = {
  transportModes?: TransportModeFilterOptionWithSelectionType[];
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function TravelSearchFilter({}: TravelSearchFilterProps) {
  const { language } = useTranslation();

  const [transportModes, setTransportModes] = useState(
    defaultTravelSearchFilter,
  );

  return (
    <div className={style.container}>
      <ul className={style.filter}>
        <li className={style.transportMode}>
          <input
            type="checkbox"
            id="all"
            name="all"
            value="all"
            checked={transportModes.every((m) => m.selected)}
            onChange={(event) => {
              setTransportModes((transportModes) =>
                transportModes.map((m) => ({
                  ...m,
                  selected: event.target.checked,
                })),
              );
            }}
          />
          {/* TODO: Add translation */}
          <label htmlFor="all">All</label>
        </li>

        {transportModes.map((mode) => {
          const text = getTextForLanguage(mode.text, language);

          return (
            <li key={mode.id} className={style.transportMode}>
              <div>
                <input
                  type="checkbox"
                  id={mode.id}
                  name={mode.id}
                  value={mode.id}
                  checked={mode.selected}
                  onChange={(event) => {
                    setTransportModes(
                      transportModes.map((m) =>
                        m.id === mode.id
                          ? { ...m, selected: event.target.checked }
                          : m,
                      ),
                    );
                  }}
                />
                <label htmlFor={mode.id}>
                  <MonoIcon
                    icon={getTransportModeIconPath(
                      mode.icon?.transportMode,
                      mode.icon?.transportSubMode,
                    )}
                    overrideMode="dark"
                  />
                  <span>{text}</span>
                </label>
              </div>

              {mode.description && (
                <Typo.p textType="body__tertiary" className={style.infoText}>
                  {getTextForLanguage(mode.description, language) ?? ''}
                </Typo.p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
