# Widget

The widget (`widget.ts`) is a standalone bundle embedded on external sites such
as atb.no. It doesn't use React or the web app's `Search` component.

## Autocomplete

Leaving a field (blur or Escape) after typing, without choosing a suggestion,
picks the first suggestion. This differs from the web app on purpose: typed text
must be carried over to the planner, using the first suggestion if none is
selected (https://github.com/AtB-AS/kundevendt/issues/20821). Don't flag it as a
bug.

Expected behaviour is covered in `__tests__/autocomplete.test.ts`. Keep it in
sync when changing the autocomplete. Tests marked `it.fails` describe known
bugs; change them to `it` when fixing.
