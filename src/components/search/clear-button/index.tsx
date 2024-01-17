import { MonoIcon } from '@atb/components/icon';
import { ComponentText, useTranslation } from '@atb/translations';

type ClearButtonProps = {
  onClear: () => void;
  className?: string;
};
export default function ClearButton({ onClear, className }: ClearButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      className={className}
      onClick={onClear}
      title={t(ComponentText.ClearButton.alt)}
      aria-label={t(ComponentText.ClearButton.alt)}
      type="button"
    >
      <MonoIcon icon="actions/Clear" />
    </button>
  );
}
