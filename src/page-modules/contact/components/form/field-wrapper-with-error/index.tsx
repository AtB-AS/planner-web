import { TranslatedString, useTranslation } from '@atb/translations';
import { PropsWithChildren } from 'react';
import { ErrorMessage } from '@atb/components/error-message';

export type FieldWrapperWithErrorProps = PropsWithChildren<{
  errorMessage?: TranslatedString;
}>;

export const FieldWrapperWithError = ({
  errorMessage,
  children,
}: FieldWrapperWithErrorProps) => {
  const { t } = useTranslation();

  return (
    <div>
      {children}
      {errorMessage && <ErrorMessage message={t(errorMessage)} />}
    </div>
  );
};

export default FieldWrapperWithError;
