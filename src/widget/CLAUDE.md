# Widget

The widget (`widget.ts`) is a standalone bundle embedded on external sites such
as atb.no. It doesn't use React or the web app's `Search` component.

## Autocomplete

Leaving a field (blur or Escape) after typing, without choosing a suggestion,
picks the first suggestion. This differs from the web app on purpose: typed text
must be carried over to the planner, using the first suggestion if none is
selected (https://github.com/AtB-AS/kundevendt/issues/20821). Don't flag it as a
bug.

### Decisions already made

Don't suggest changing these in reviews:

- Out-of-date searches are cancelled with `abortSearch()`, which cancels the
  debounce and aborts the request with an `AbortController`. This is on purpose:
  it also stops the download. Don't suggest replacing it with comparing the
  query text or a request counter. (Tracking which text the list belongs to is
  fine as an addition, e.g. to stop blur picking from an old list, but not as a
  replacement for the aborts.)
- `abortSearch()` is called in several handlers (input, commit, blur, Escape,
  and at the start of a search). Some calls overlap. That's intended, so each
  handler is safe on its own. Don't suggest removing the "redundant" calls.
- The outside-click handler does nothing while the input has focus, so clicking
  the field's label keeps the list open.
- Focusing a field that holds a selected place opens nothing and sends no
  search, like the web app. "Use my location" is reached by clearing the text.
  Don't suggest opening the list on focus.

Expected behaviour is covered in `__tests__/autocomplete.test.ts`. Keep it in
sync when changing the autocomplete. Tests marked `it.fails` describe known
bugs; change them to `it` when fixing.
