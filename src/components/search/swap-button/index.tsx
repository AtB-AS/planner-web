import { MonoIcon } from '@atb/components/icon';
import { ComponentText, useTranslation } from '@atb/translations';

type SwapButtonProps = {
  onSwap: () => void;
  className?: string;
};
export default function SwapButton({ onSwap, className }: SwapButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      className={className}
      onClick={onSwap}
      title={t(ComponentText.SwapButton.alt)}
      aria-label={t(ComponentText.SwapButton.alt)}
      type="button"
    >
      <MonoIcon icon="actions/Swap" />
    </button>
  );
}
