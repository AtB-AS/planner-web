import { TransportModeType } from './types';
import { Line } from '.';

export const shouldShowContactPage = (): boolean => {
  return process.env.NEXT_PUBLIC_CONTACT_API_URL ? true : false;
};

export const convertFilesToBase64 = (
  attachments: File[],
): Promise<{ filename: string; body: string }[]> => {
  const filePromises = attachments.map((file) => {
    return new Promise<{ filename: string; body: string }>(
      (resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            resolve({
              filename: file.name,
              body: result,
            });
          } else {
            reject(new Error('File conversion failed'));
          }
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
      },
    );
  });

  return Promise.all(filePromises);
};

export const setTransportModeAndResetLineAndStops = (
  context: any,
  transporMode: TransportModeType,
) => {
  return {
    ...context,
    transportMode: transporMode,
    line: undefined,
    fromStop: undefined,
    toStop: undefined,
    errorMessages: {
      ...context.errorMessages,
      transportMode: [],
      line: [],
      fromStop: [],
      toStop: [],
    },
  };
};

export const setLineAndResetStops = (context: any, line: Line | undefined) => {
  return {
    ...context,
    line: line,
    fromStop: undefined,
    toStop: undefined,
    errorMessages: {
      ...context.errorMessages,
      line: [],
      fromStop: [],
      toStop: [],
    },
  };
};

export const setBankAccountStatusAndResetBankInformation = (
  context: any,
  hasInternationalBankAccount: boolean,
) => {
  return {
    ...context,
    hasInternationalBankAccount: hasInternationalBankAccount,
    bankAccountNumber: undefined,
    IBAN: undefined,
    SWIFT: undefined,
    errorMessages: {
      ...context.errorMessages,
      bankAccountNumber: [],
    },
  };
};
