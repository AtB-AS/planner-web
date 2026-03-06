export function parseFilterQuery(
  filterQuery: string | string[] | undefined,
): string[] | null {
  if (!filterQuery) return null;

  return filterQuery.toString().split(',');
}
