import { TranslatedString } from '@atb/translations';
import { validationRules } from './validationRules';

export type InputErrorMessages = {
  [key: string]: TranslatedString[];
};

export const commonInputValidator = (context: any): InputErrorMessages => {
  const inputErrorMessages: InputErrorMessages = {};

  Object.keys(context).forEach((inputName) => {
    const rules = validationRules[inputName];
    if (!rules) return;

    for (const { validate, errorMessage } of rules) {
      const isValid = validate(context[inputName]);
      if (!isValid) {
        addErrorMessage(inputName, errorMessage, inputErrorMessages);
        return; // Stop the loop after the first error is found
      }
    }
  });

  return inputErrorMessages;
};

function addErrorMessage(
  inputName: string,
  errorMessage: TranslatedString,
  inputErrorMessages: InputErrorMessages,
): void {
  if (!inputErrorMessages[inputName]) {
    inputErrorMessages[inputName] = [];
  }
  inputErrorMessages[inputName].push(errorMessage);
}

export default commonInputValidator;
