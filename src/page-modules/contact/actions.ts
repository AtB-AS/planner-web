import { assign } from 'xstate';

export const toggleFiled = assign(({ context, event }: any) => {
  if (event.type === 'TOGGLE') {
    const { field } = event;
    return {
      ...context,
      [field]: !context[field],
    };
  }
  return context;
});

export const updateField = assign(({ context, event }: any) => {
  if (event.type === 'UPDATE_FIELD') {
    const { field, value } = event;
    // Remove errorMessages if any
    context.errorMessages[field] = [];
    return {
      ...context,
      [field]: value,
    };
  }
  return context;
});
