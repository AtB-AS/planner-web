import { TranslatedString } from '@atb/translations';

export type InputErrorMessages = {
  [key: string]: TranslatedString[];
};

// Utility function to add error messages
export const addErrorMessage = (
  context: any,
  inputName: string,
  validCondition: boolean,
  errorMessages: InputErrorMessages,
  errorMessage: TranslatedString,
) => {
  if (context.hasOwnProperty(inputName) && !validCondition) {
    if (!errorMessages[inputName]) {
      errorMessages[inputName] = [];
    }
    errorMessages[inputName].push(errorMessage);
  }
};
