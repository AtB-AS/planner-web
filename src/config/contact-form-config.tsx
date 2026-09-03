import type {
  ContactFormConfig,
  FormSchemaName,
  IconComponent,
} from '@mrfylke/contact-form';
import { buildEnabledPageIds, useTheme } from '@mrfylke/contact-form';
import { adaptAtbTheme } from '@mrfylke/contact-form/config';
import { theme } from '@atb/modules/theme';
import { byOrg } from '@atb/modules/org-data';
import {
  CommonText,
  ComponentText,
  PageText,
  ServerText,
} from '@atb/translations';

function createIconComponent(iconName: string): IconComponent {
  const Icon = ({
    size = 'normal',
    className,
    style,
    alt = '',
  }: {
    size?: 'small' | 'normal' | 'large';
    className?: string;
    style?: React.CSSProperties;
    alt?: string;
  }) => {
    const { isDarkMode } = useTheme();
    const sizeMap = { small: 16, normal: 20, large: 28 };
    const px = sizeMap[size];
    const mode = isDarkMode ? 'dark' : 'light';
    const assetPath = `/assets/mono/${mode}/${iconName}.svg`;
    return (
      <img
        src={assetPath}
        width={px}
        height={px}
        className={className}
        style={style}
        alt={alt}
      />
    );
  };
  Icon.displayName = `Icon(${iconName})`;
  return Icon;
}

const iconSet: ContactFormConfig['icons'] = {
  'transportation/BusFill': createIconComponent('transportation/BusFill'),
  'transportation/TramFill': createIconComponent('transportation/TramFill'),
  'transportation/TrainFill': createIconComponent('transportation/TrainFill'),
  'transportation/WalkFill': createIconComponent('transportation/WalkFill'),
  'transportation/BicycleFill': createIconComponent(
    'transportation/BicycleFill',
  ),
  'transportation/PlaneFill': createIconComponent('transportation/PlaneFill'),
  'transportation/BoatFill': createIconComponent('transportation/BoatFill'),
  'transportation/FerryFill': createIconComponent('transportation/FerryFill'),
  'transportation/MetroFill': createIconComponent('transportation/MetroFill'),
  'transportation/UnknownFill': createIconComponent(
    'transportation/UnknownFill',
  ),
  'actions/Close': createIconComponent('actions/Close'),
  'actions/Clear': createIconComponent('actions/Clear'),
  'actions/Add': createIconComponent('actions/Add'),
  'status/CheckmarkFill': createIconComponent('status/CheckmarkFill'),
  'status/ErrorFill': createIconComponent('status/ErrorFill'),
};

const contactFormTheme = adaptAtbTheme(theme);

const submitEndpoint = '/api/contact/submit';

const onSubmit = (
  schemaName: FormSchemaName,
  state: Record<string, unknown>,
): Promise<Response> => {
  return fetch(submitEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...state, formType: schemaName }),
  });
};

export const contactFormConfig: ContactFormConfig = {
  theme: contactFormTheme,
  icons: iconSet,
  api: {
    onSubmit,
  },
  features: {
    enableFileUploads: true,
  },
  pages: {
    enabledPageIds:
      byOrg({
        fram: buildEnabledPageIds([
          'ticket-control',
          'refund',
          'means-of-transport',
          'ticketing',
          'lost-property-external',
          'group-travel',
          'journey-info',
        ]),
      }) ??
      buildEnabledPageIds([
        'ticket-control',
        'refund',
        'means-of-transport',
        'ticketing',
        'lost-property',
        'group-travel',
        'journey-info',
      ]),
  },
  formSchemaOverrides: byOrg({
    fram: {
      refund: {
        enabledFormCategories: [
          'refundOfTicket',
          'refundAndTravelGuarantee',
          'residualValueOnTravelCard',
        ],
      },
    },
  }),
  translations: {
    pages: PageText,
    components: ComponentText,
    common: CommonText,
    server: ServerText,
  },
};
