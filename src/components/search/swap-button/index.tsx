import { MonoIcon } from '@atb/components/icon';
import { LoadingIcon } from '@atb/components/loading';
import { ComponentText, useTranslation } from '@atb/translations';

type SwapButtonProps = {
  onSwap: () => void;
  className?: string;
  isLoading?: boolean;
};
export default function SwapButton({
  onSwap,
  className,
  isLoading,
}: SwapButtonProps) {
  const { t } = useTranslation();

  return isLoading ? (
    <div className={className}>
      <LoadingIcon />
    </div>
  ) : (
    <button
      className={className}
      onClick={onSwap}
      title={t(ComponentText.SwapButton.alt)}
      aria-label={t(ComponentText.SwapButton.alt)}
      type="button"
      data-testid="swapButton"
    >
      <MonoIcon icon="actions/Swap" />
    </button>
  );
}
