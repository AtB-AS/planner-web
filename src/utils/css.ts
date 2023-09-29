export function and(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
export function andIf(classes: Record<string, boolean>): string {
  return Object.entries(classes).reduce(function (acc, item) {
    if (!item[1]) {
      return acc;
    }
    return acc + ' ' + item[0];
  }, '');
}
