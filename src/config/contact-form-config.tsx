import type { ContactFormConfig, IconComponent } from '@mrfylke/contact-form';
import type { FormSchemaName } from '@mrfylke/contact-form';
import { useDarkMode } from '@mrfylke/contact-form';
import { adaptAtbTheme } from '@mrfylke/contact-form/config';
import { theme } from '@atb/modules/theme';
import { getOrgData } from '@atb/modules/org-data';
import {
  PageText,
  ComponentText,
  CommonText,
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
    const [isDarkMode] = useDarkMode();
    const sizeMap = { small: 20, normal: 24, large: 32 };
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
  'transportation/BicycleFill': createIconComponent('transportation/BicycleFill'),
  'transportation/PlaneFill': createIconComponent('transportation/PlaneFill'),
  'transportation/BoatFill': createIconComponent('transportation/BoatFill'),
  'transportation/FerryFill': createIconComponent('transportation/FerryFill'),
  'transportation/MetroFill': createIconComponent('transportation/MetroFill'),
  'transportation/UnknownFill': createIconComponent('transportation/UnknownFill'),
  'actions/Close': createIconComponent('actions/Close'),
  'actions/Clear': createIconComponent('actions/Clear'),
  'actions/Add': createIconComponent('actions/Add'),
  'status/CheckmarkFill': createIconComponent('status/CheckmarkFill'),
  'status/ErrorFill': createIconComponent('status/ErrorFill'),
};

const atbThemes = theme;
const contactFormTheme = adaptAtbTheme(atbThemes);

const baseUrl = typeof window !== 'undefined' ? '' : '';
const submitEndpoint = '/api/contact/submit';

const onSubmit = async (
  schemaName: FormSchemaName,
  state: Record<string, unknown>,
): Promise<Response> => {
  const response = await fetch(`${baseUrl}${submitEndpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...state, formType: schemaName }),
  });
  return response;
};

function getContactFormConfig(): ContactFormConfig {
  const org = getOrgData();
  const logo =
    org.fylkeskommune != null
      ? {
          src: org.fylkeskommune.logoSrc,
          srcDark: org.fylkeskommune.logoSrcDark,
          alt: org.fylkeskommune.name,
        }
      : undefined;

  return {
    theme: contactFormTheme,
    icons: iconSet,
    api: {
      baseUrl,
      endpoints: {
        submitForm: submitEndpoint,
        lines: '/api/contact/lines',
      },
      onSubmit,
    },
    org: {
      name: org.fylkeskommune?.name ?? org.orgId,
      supportEmail: org.supportEmail,
      authorityId: org.authorityId,
      logo,
    },
    features: {
      enableDarkMode: true,
      enableFileUploads: true,
    },
    layout: {
      basePath: '/contact',
      backLinkDefault: {
        href: '/',
        label: PageText.Contact.contactPageLayout.homeLink as unknown as Record<
          string,
          string
        >,
      },
      successPath: '/contact/success',
      errorPath: '/contact/error',
    },
    translations: {
      pages: PageText,
      components: ComponentText,
      common: CommonText,
      server: ServerText,
    },
  };
}

export const contactFormConfig = getContactFormConfig();
