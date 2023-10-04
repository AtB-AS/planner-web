import { useDarkMode } from '@atb/modules/theme';
import { icons, Illustrations } from './generated-icons';

export type IllustrationProps = Omit<JSX.IntrinsicElements['img'], 'src'> & {
  image: Illustrations;
  alt: string;
};

export function Illustration({ image, ...props }: IllustrationProps) {
  const [isDarkMode] = useDarkMode();
  const currentIcon = icons['illustration'][image];

  if (!currentIcon.darkable) {
    const totalPath = `/assets/${currentIcon.relative}`;
    // eslint-disable-next-line
    return <img src={totalPath} {...props} />;
  } else {
    const totalPath = `/assets/${specifyDarkOrLight(
      currentIcon.relative,
      isDarkMode,
    )}`;

    // eslint-disable-next-line
    return <img src={totalPath} {...props} />;
  }
}

function specifyDarkOrLight(src: string | undefined, isDarkMode: boolean) {
  const paths = src?.replace(/\/(dark|light)\//, '/').split('/') ?? [];
  const darkModeString = isDarkMode ? 'dark' : 'light';
  return [...paths.slice(0, -1), darkModeString, paths.slice(-1)].join('/');
}
