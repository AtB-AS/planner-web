import { TransportModeType } from './types';
import { Line } from '.';
import { FormEvent } from 'react';
import { InputErrorMessages } from './validation';

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

const formFieldsPrefixes = [
  'input__',
  'textarea__',
  'select__',
  'searchable_select__',
];

export const findOrderFormFields = (e: FormEvent<HTMLFormElement>): string[] =>
  Array.from(e.currentTarget.elements)
    .filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        formFieldsPrefixes.some((prefix) => el.id.startsWith(prefix)),
    )
    .map((el) => el.id.split('__')[1]);

export const scrollToFirstErrorMessage = (id: string | undefined): void => {
  if (!id) return;

  const element = formFieldsPrefixes
    .map((prefix) => document.getElementById(`${prefix}${id}`))
    .find((el): el is HTMLElement => el !== null);

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.focus();
  }
};

export const findFirstErrorMessage = (
  formFields: string[] | undefined,
  errors: InputErrorMessages,
): string | undefined => {
  if (!formFields) return undefined;

  for (const field of formFields) {
    if (errors[field]) {
      return field;
    }
  }
};
