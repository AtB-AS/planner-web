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

    rules.forEach(({ validate, errorMessage }) => {
      const isValid = validate(context[inputName]);
      if (!isValid)
        addErrorMessage(inputName, errorMessage, inputErrorMessages);
    });
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
