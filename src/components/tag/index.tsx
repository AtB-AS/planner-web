import { StatusColorName, useTheme } from '@atb/modules/theme';
import { andIf } from '@atb/utils/css';
import { ColorIcon, MonoIcon, MonoIcons } from '@atb/components/icon';
import { messageTypeToColorIcon } from '@atb/modules/situations';
import { Typo } from '@atb/components/typography';

import style from './tag.module.css';
import { HTMLAttributes } from 'react';

type TagStatuses = 'primary' | 'secondary' | StatusColorName;

type TagSize = 'small' | 'regular';

type BaseTagProps = {
  message: string;
  size?: TagSize;
  textId?: string;
  testID?: string;
};

// Allowed to set icon for secondary, but not for primary or other statuses.
type TagProps =
  | (BaseTagProps & {
      type: 'secondary';
      icon?: MonoIcons;
    })
  | (BaseTagProps & {
      type: Exclude<TagStatuses, 'secondary'>;
      icon?: never;
    });

export const Tag = ({
  message,
  textId,
  testID,
  type,
  size,
  icon,
}: TagProps) => {
  const colors = useTagColors(type);
  const aria = statusToAria(type);

  return (
    <div
      className={andIf({
        [style.container]: true,
        [style.small]: size === 'small',
      })}
      style={colors}
      data-testid={testID ? testID : undefined}
    >
      {type !== 'secondary' && type !== 'primary' && (
        <ColorIcon icon={messageTypeToColorIcon(type)} />
      )}
      {type == 'secondary' && icon && <MonoIcon icon={icon} />}
      <Typo.p textType="body__xs" id={textId} {...aria}>
        {message}
      </Typo.p>
    </div>
  );
};

const useTagColors = (
  type: TagStatuses,
): HTMLAttributes<HTMLDivElement>['style'] => {
  const {
    color: { status, foreground },
  } = useTheme();

  switch (type) {
    case 'primary':
      return {
        backgroundColor: status.info.primary.background,
        borderColor: status.info.primary.background,
        color: foreground.inverse.primary,
      };
    case 'secondary':
      return {
        backgroundColor: 'transparent',
        borderColor: foreground.inverse.disabled,
        color: foreground.dynamic.primary,
      };
    case 'valid':
    case 'error':
    case 'warning':
    case 'info':
      return {
        backgroundColor: status[type].secondary.background,
        borderColor: status[type].primary.background,
        color: status[type].secondary.foreground.primary,
      };
  }
};

function statusToAria(status: TagStatuses): React.JSX.IntrinsicElements['div'] {
  switch (status) {
    case 'primary':
      return { role: 'status' };
    case 'secondary':
      return { role: 'status' };
    case 'error':
      return { role: 'alert' };
    case 'valid':
      return { 'aria-live': 'polite' };
    case 'warning':
      return { 'aria-live': 'polite' };
    case 'info':
      return { role: 'status' };
  }
}
