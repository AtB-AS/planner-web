import { TranslatedString } from '@atb/translations';

export type InputErrorMessages = {
  [key: string]: TranslatedString[];
};

// Utility function to add error messages
export const addErrorMessage = (
  context: any,
  field: string,
  validCondition: boolean,
  errorMessages: InputErrorMessages,
  errorMessage: TranslatedString,
) => {
  if (context.hasOwnProperty(field) && !validCondition) {
    if (!errorMessages[field]) {
      errorMessages[field] = [];
    }
    errorMessages[field].push(errorMessage);
  }
};
