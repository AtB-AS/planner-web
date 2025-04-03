export const isDefined = <T>(value: T): value is NonNullable<T> =>
  value !== undefined && value !== null;

export const isTruthy = <T>(value: T): value is NonNullable<T> => !!value;
