# Widget

The widget (`widget.ts`) is a standalone bundle embedded on external sites such
as atb.no. It doesn't use React or the web app's `Search` component.

## Autocomplete

Leaving a field (blur) after typing, without choosing a suggestion, picks the
suggestion highlighted with the arrow keys, or else the first one. This differs
from the web app on purpose: typed text must be carried over to the planner,
using the first suggestion if none is selected
(https://github.com/AtB-AS/kundevendt/issues/20821). Don't flag it as a bug.

If no suggestion matches (no results, none yet, suggestions for older text, or
the text was cleared), the text is kept and the selection is cleared. Only
selected places are sent to the planner, so this stops a place the field no
longer shows from being searched for.

Escape only closes the list. It never picks a suggestion, not even a highlighted
one. Leaving the field afterwards follows the rules above, and since the list is
closed, no suggestion matches.

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
  the field's label keeps the list open. Clicks elsewhere move focus away, so
  blur closes the list. Don't flag host pages that block `mousedown` as a case
  where the list stays open.
- Pressing Enter without a highlighted suggestion submits the form as it is. The
  typed text isn't resolved first, so the previous selection (or none) is sent.
  This is intended; don't flag it or suggest resolving the text on Enter or
  submit.
- Whether a field has been edited is worked out by comparing its text with the
  selected place's name (`data-selected-name` on the input), not kept as a flag.
  Swap and reset move or clear that name with the text. Don't suggest an
  `isDirty` flag instead; it went out of step whenever the text changed from
  code.
- Focusing a field that holds a selected place opens nothing and sends no
  search, like the web app. "Use my location" is reached by clearing the text.
  Don't suggest opening the list on focus.

Expected behaviour is covered in `__tests__/autocomplete.test.ts`. Keep it in
sync when changing the autocomplete. Tests marked `it.fails` describe known
bugs; change them to `it` when fixing.
