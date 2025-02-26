import { translation as _ } from '@atb/translations/commons';

export const SearchInput = {
  noResults: _(
    'Ingen resultater tilgjengelig',
    'No results are available.',
    'Ingen resultat tilgjengeleg',
  ),
  results: (resultCount: number) =>
    _(
      `${resultCount} treff, bruk pil opp og pil ned for navigering. Trykk Enter for å velge.`,
      `${resultCount} result${
        resultCount === 1 ? ' is' : 's are'
      } available, use up and down arrow keys to navigate. Press Enter key to select.`,
      `${resultCount} treff, bruk pil opp og pil ned for navigering. Trykk Enter for å velje.`,
    ),
  previousResultA11yLabel: (resultCount: number) =>
    _(
      `Min posisjon og ${resultCount} tidligere søk, bruk pil opp og pil ned for navigering. Trykk Enter for å velje.`,
      `My location and ${resultCount} previous searches, use up and down arrow keys to navigate. Press Enter key to select.`,
      `Min posisjon og ${resultCount} tidligere søk, bruk pil opp og pil ned for navigering. Trykk Enter for å velje.`,
    ),
  myPosition: _('Min posisjon', 'My location', 'Min posisjon'),
  positionNotAvailable: _(
    'Posisjon ikke tilgjengelig',
    'Position not available',
    'Posisjon ikke tilgjengelig',
  ),
  recentSearches: _(
    'Sist brukte steder',
    'Recently used places',
    'Siste brukte steder',
  ),
};
