import { useDarkMode } from '@atb/modules/theme';
import { icons, Images } from './generated-icons';

type ColorImageProps = Omit<React.JSX.IntrinsicElements['img'], 'src'> & {
  image: Images;
};

export function Image({ image, ...props }: ColorImageProps) {
  const [isDarkMode] = useDarkMode();

  const extras = { role: 'none', alt: '' };
  const currentIcon = icons['images'][image];

  if (!currentIcon.darkable) {
    const totalPath = `/assets/${currentIcon.relative}`;
    // eslint-disable-next-line
    return <img {...extras} src={totalPath} {...props} />;
  } else {
    const totalPath = `/assets/${specifyDarkOrLight(
      currentIcon.relative,
      isDarkMode,
    )}`;

    // eslint-disable-next-line
    return <img {...extras} src={totalPath} {...props} />;
  }
}

function specifyDarkOrLight(src: string | undefined, isDarkMode: boolean) {
  const paths = src?.replace(/\/(dark|light)\//, '/').split('/') ?? [];
  const darkModeString = isDarkMode ? 'dark' : 'light';
  return [...paths.slice(0, -1), darkModeString, paths.slice(-1)].join('/');
}
