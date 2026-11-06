import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { FeatureCategory, type GeocoderFeature } from '@atb/modules/geocoder';
import { createWidget } from '../widget';

const URL_BASE = 'http://widget.test/';
const DEBOUNCE_MS = 300;

function feature(id: string, name: string): GeocoderFeature {
  return {
    id,
    name,
    locality: 'Trondheim',
    category: [FeatureCategory.ONSTREET_BUS],
    layer: 'venue',
    geometry: { coordinates: [10.4, 63.4] },
  };
}

const lerkendal = feature('NSR:StopPlace:1', 'Lerkendal');
const moholt = feature('NSR:StopPlace:2', 'Moholt');
const moa = feature('NSR:StopPlace:3', 'Moa');
const osloS = feature('NSR:StopPlace:4', 'Oslo S');

type PendingRequest = {
  url: string;
  q: string;
  signal?: AbortSignal;
  resolve: (data: GeocoderFeature[]) => void;
  fail: () => void;
};

let requests: PendingRequest[] = [];
let selected: Array<GeocoderFeature | undefined> = [];
// Which field each selection was for ("from" or "to").
let selectedKeys: string[] = [];
let output: string;

function onSearchSelected(event: Event) {
  const { detail } = event as CustomEvent<{
    key: string;
    item?: GeocoderFeature;
  }>;
  selected.push(detail.item);
  selectedKeys.push(detail.key);
}

// Each autocomplete request stays pending until the test responds to it, so
// the tests decide the order responses arrive in.
// Like a real fetch, an aborted request rejects with an AbortError.
const fetchMock = vi.fn((url: string, init?: RequestInit) => {
  return new Promise((resolve, reject) => {
    const q = url.split('?q=')[1] ?? '';
    const signal = init?.signal ?? undefined;
    signal?.addEventListener('abort', () =>
      reject(new DOMException('Aborted', 'AbortError')),
    );
    requests.push({
      url,
      q: decodeURIComponent(q),
      signal,
      resolve: (data) => resolve({ ok: true, json: async () => data }),
      fail: () => resolve({ ok: false, json: async () => ({}) }),
    });
  });
});

const getCurrentPositionMock = vi.fn();

function getInput() {
  return document.querySelector<HTMLInputElement>('#pw-from-1-input')!;
}

function getList() {
  return document.querySelector<HTMLUListElement>('#from-popup-1')!;
}

function type(input: HTMLInputElement, text: string) {
  input.value = text;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

async function flush() {
  await vi.advanceTimersByTimeAsync(0);
}

async function waitForDebounce() {
  await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
}

function requestFor(q: string) {
  const request = requests.find((r) => r.q === q);
  if (!request) {
    throw new Error(
      `No autocomplete request for "${q}". Requests: ${requests.map((r) => `"${r.q}"`).join(', ')}`,
    );
  }
  return request;
}

function takeRequest(q: string) {
  const request = requestFor(q);
  requests = requests.filter((r) => r !== request);
  return request;
}

async function respond(q: string, data: GeocoderFeature[]) {
  takeRequest(q).resolve(data);
  await flush();
}

async function respondWithError(q: string) {
  takeRequest(q).fail();
  await flush();
}

/** Types text, waits for the results and leaves the field without choosing. */
async function typeAndLeave(
  input: HTMLInputElement,
  text: string,
  data: GeocoderFeature[],
) {
  input.focus();
  type(input, text);
  await waitForDebounce();
  await respond(text, data);
  input.blur();
  await flush();
}

describe('widget autocomplete', () => {
  beforeAll(() => {
    // createWidget registers the custom elements, which can only be done once.
    output = createWidget({ urlBase: URL_BASE }).output;
  });

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    vi.stubGlobal('fetch', fetchMock);
    // Picking "Use my location" asks the browser for the position.
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition: getCurrentPositionMock },
    });
    requests = [];
    selected = [];
    selectedKeys = [];
    // Mounting the markup again gives each test fresh autocomplete elements.
    // happy-dom runs connectedCallback before the children are parsed when
    // setting innerHTML on a connected element, so parse it detached first.
    const container = document.createElement('div');
    container.innerHTML = output;
    document.body.replaceChildren(container);
    document.addEventListener('search-selected', onSearchSelected);
  });

  afterEach(() => {
    document.removeEventListener('search-selected', onSearchSelected);
    fetchMock.mockClear();
    getCurrentPositionMock.mockClear();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('shows "Use my location" on first focus when the field is empty', () => {
    const input = getInput();
    expect(input.value).toBe('');

    input.focus();

    const list = getList();
    expect(list.hidden).toBe(false);
    expect(list.children).toHaveLength(1);
    expect(list.firstElementChild).toHaveClass('itemLocation');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('picks the first suggestion when leaving the field without choosing (kundevendt#20821)', async () => {
    const input = getInput();

    await typeAndLeave(input, 'Lerk', [lerkendal]);

    expect(input.value).toBe('Lerkendal');
    expect(selected.at(-1)).toEqual(lerkendal);
  });

  describe('never picks "Use my location" on blur (#839)', () => {
    it('when leaving a field with a selected place without typing', async () => {
      const input = getInput();
      await typeAndLeave(input, 'Lerk', [lerkendal]);

      input.focus();
      input.blur();
      await flush();
      await waitForDebounce();

      expect(input.value).toBe('Lerkendal');
      expect(getCurrentPositionMock).not.toHaveBeenCalled();
    });

    it('when leaving before the suggestions have arrived', async () => {
      const input = getInput();

      // The list only holds "Use my location" at this point.
      input.focus();
      type(input, 'Lerk');
      input.blur();
      await flush();

      expect(getCurrentPositionMock).not.toHaveBeenCalled();
    });
  });

  it('picks the clicked suggestion, not the first one (#835)', async () => {
    const input = getInput();
    input.focus();
    type(input, 'Mo');
    await waitForDebounce();
    await respond('Mo', [moa, moholt]);

    const option = getList().querySelector<HTMLElement>(
      `[data-feature-id="${moholt.id}"]`,
    )!;
    // Pressing the item must not take focus from the input, or blur would
    // pick the first suggestion before the click is handled.
    const mousedown = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    option.dispatchEvent(mousedown);
    expect(mousedown.defaultPrevented).toBe(true);
    option.click();
    await flush();

    expect(input.value).toBe('Moholt');
    expect(selected).toEqual([moholt]);

    // Leaving the field afterwards keeps the clicked suggestion.
    input.blur();
    await flush();
    expect(input.value).toBe('Moholt');
    expect(selected).toEqual([moholt]);
  });

  it('does not reopen the list when suggestions arrive after leaving the field (#839)', async () => {
    const input = getInput();
    input.focus();
    type(input, 'Lerk');
    await waitForDebounce();

    input.blur();
    await flush();
    await respond('Lerk', [lerkendal]);

    expect(getList().hidden).toBe(true);
  });

  it('changes nothing when focusing and leaving a field without typing', async () => {
    const input = getInput();
    await typeAndLeave(input, 'Lerk', [lerkendal]);
    selected = [];

    input.focus();
    await waitForDebounce();
    input.blur();
    await flush();

    expect(input.value).toBe('Lerkendal');
    expect(selected).toEqual([]);
  });

  describe('"Use my location" is always the last item', () => {
    function expectLocationLast() {
      const list = getList();
      expect(list.hidden).toBe(false);
      expect(list.lastElementChild).toHaveClass('itemLocation');
      expect(list.querySelectorAll('.itemLocation')).toHaveLength(1);
    }

    it('after the suggestions', async () => {
      const input = getInput();
      input.focus();
      type(input, 'Mo');
      await waitForDebounce();
      await respond('Mo', [moa, moholt]);

      expectLocationLast();
      expect(getList().children).toHaveLength(3);
    });

    it('after "No results"', async () => {
      const input = getInput();
      input.focus();
      type(input, 'xyzzy');
      await waitForDebounce();
      await respond('xyzzy', []);

      expectLocationLast();
      expect(getList()).toHaveTextContent('No results');
    });
  });

  it('treats whitespace-only text as empty', async () => {
    const input = getInput();
    input.focus();
    type(input, '  ');
    await waitForDebounce();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(getList().hidden).toBe(false);
    expect(getList().children).toHaveLength(1);
    expect(getList().firstElementChild).toHaveClass('itemLocation');
  });

  it('shows "Use my location" again when the text is cleared', async () => {
    const input = getInput();
    input.focus();
    type(input, 'Lerk');
    await waitForDebounce();
    await respond('Lerk', [lerkendal]);
    fetchMock.mockClear();

    type(input, '');
    await waitForDebounce();

    const list = getList();
    expect(list.hidden).toBe(false);
    expect(list.children).toHaveLength(1);
    expect(list.firstElementChild).toHaveClass('itemLocation');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows "No results" when the request fails and picks nothing on blur', async () => {
    const input = getInput();
    input.focus();
    type(input, 'Lerk');
    await waitForDebounce();
    await respondWithError('Lerk');

    const list = getList();
    expect(list.hidden).toBe(false);
    expect(list).toHaveTextContent('No results');

    input.blur();
    await flush();

    expect(input.value).toBe('Lerk');
    expect(selected.filter(Boolean)).toEqual([]);
    expect(getCurrentPositionMock).not.toHaveBeenCalled();
  });

  it('closes the list when clicking outside the widget', () => {
    const input = getInput();
    input.focus();
    expect(getList().hidden).toBe(false);

    // In a browser, pressing somewhere else moves focus away before the click.
    // happy-dom doesn't do that, so do it here.
    input.blur();
    document.body.click();

    expect(getList().hidden).toBe(true);
  });

  it("keeps the list open when clicking the field's label", async () => {
    const input = getInput();
    input.focus();
    type(input, 'Mo');
    await waitForDebounce();

    // Clicking the label keeps focus in the input, so the user is still in
    // the field.
    document.querySelector<HTMLElement>('#pw-from-1-label')!.click();
    expect(document.activeElement).toBe(input);
    expect(getList().hidden).toBe(false);
    expect(requestFor('Mo').signal?.aborted).toBe(false);

    await respond('Mo', [moa]);
    expect(getList().hidden).toBe(false);
    expect(
      getList().querySelector(`[data-feature-id="${moa.id}"]`),
    ).not.toBeNull();
  });

  // Escape only closes the list. It never picks a suggestion.
  describe('Escape', () => {
    function pressEscape(input: HTMLInputElement) {
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
    }

    it('closes the list without picking a suggestion after typing', async () => {
      const input = getInput();
      input.focus();
      type(input, 'Lerk');
      await waitForDebounce();
      await respond('Lerk', [lerkendal, moholt]);

      pressEscape(input);
      await flush();

      expect(input.value).toBe('Lerk');
      expect(selected).toEqual([]);
      expect(getList().hidden).toBe(true);
    });

    it('leaving the field afterwards does not pick the closed suggestions', async () => {
      const input = getInput();
      input.focus();
      type(input, 'Lerk');
      await waitForDebounce();
      await respond('Lerk', [lerkendal]);

      pressEscape(input);
      input.blur();
      await flush();

      // No suggestion matches any more, so the text is kept and the selection
      // cleared.
      expect(input.value).toBe('Lerk');
      expect(selected).toEqual([undefined]);
    });

    it('never picks "Use my location" (#839)', async () => {
      const input = getInput();
      input.focus();
      type(input, 'Lerk');

      // The list only holds "Use my location" at this point.
      pressEscape(input);
      await flush();

      expect(getCurrentPositionMock).not.toHaveBeenCalled();
      expect(getList().hidden).toBe(true);

      // The search that was waiting for the debounce is cancelled, so it
      // doesn't reopen the list.
      await waitForDebounce();
      expect(fetchMock).not.toHaveBeenCalled();
      expect(getList().hidden).toBe(true);
    });

    it('closes the list without changing anything when nothing was typed', async () => {
      const input = getInput();
      await typeAndLeave(input, 'Lerk', [lerkendal]);
      selected = [];

      input.focus();
      await waitForDebounce();
      pressEscape(input);
      await flush();

      expect(input.value).toBe('Lerkendal');
      expect(selected).toEqual([]);
      expect(getList().hidden).toBe(true);
    });
  });

  it('sends the search text unchanged, even with special characters', async () => {
    const input = getInput();
    input.focus();

    const text = 'Sjøsiden & Co #1 + 2';
    type(input, text);
    await waitForDebounce();

    // Check what the server receives rather than the exact encoding, since
    // encoders differ (e.g. `%20` or `+` for spaces).
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.pathname).toBe('/api/departures/autocomplete');
    expect(url.searchParams.get('q')).toBe(text);
  });

  it('does not send a request when focusing a field with unchanged text', async () => {
    const input = getInput();
    await typeAndLeave(input, 'Lerk', [lerkendal]);
    fetchMock.mockClear();

    input.focus();
    await waitForDebounce();

    expect(fetchMock).not.toHaveBeenCalled();
    // Like the web app, focusing a selected place opens nothing.
    expect(getList().hidden).toBe(true);
  });

  describe('cancels searches for older text', () => {
    function shownSuggestions() {
      return Array.from(getList().querySelectorAll('[data-feature-id]'), (li) =>
        li.getAttribute('data-feature-id'),
      );
    }

    it('when the user keeps typing while a request is in flight', async () => {
      const input = getInput();
      input.focus();
      type(input, 'Mo');
      await waitForDebounce();

      type(input, 'Moholt');
      await flush();

      // The request for "Mo" is aborted, and the abort error isn't shown as
      // "No results".
      expect(requestFor('Mo').signal?.aborted).toBe(true);
      expect(getList()).not.toHaveTextContent('No results');

      await waitForDebounce();
      await respond('Moholt', [moholt]);

      expect(shownSuggestions()).toEqual([moholt.id]);
    });

    it('when the text changes just as a response arrives', async () => {
      const input = getInput();
      input.focus();
      type(input, 'Mo');
      await waitForDebounce();

      // The response for "Mo" has arrived, but the text changes before the
      // widget handles it.
      requestFor('Mo').resolve([moa]);
      type(input, 'Moholt');
      await flush();

      expect(shownSuggestions()).toEqual([]);
    });

    it('when a suggestion is chosen before the debounce has fired', async () => {
      const input = getInput();
      input.focus();
      type(input, 'Moho');
      await waitForDebounce();
      await respond('Moho', [moholt]);
      fetchMock.mockClear();

      // Type more and click the suggestion straight away.
      type(input, 'Moholt');
      getList()
        .querySelector<HTMLElement>(`[data-feature-id="${moholt.id}"]`)!
        .click();
      await flush();
      await waitForDebounce();

      expect(fetchMock).not.toHaveBeenCalled();
      expect(input.value).toBe('Moholt');
      expect(selected).toEqual([moholt]);
      expect(getList().hidden).toBe(true);
    });

    it('when a suggestion is chosen while a request is in flight', async () => {
      const input = getInput();
      input.focus();
      type(input, 'Moho');
      await waitForDebounce();
      await respond('Moho', [moholt]);

      type(input, 'Moholt');
      await waitForDebounce();
      getList()
        .querySelector<HTMLElement>(`[data-feature-id="${moholt.id}"]`)!
        .click();
      await flush();

      expect(requestFor('Moholt').signal?.aborted).toBe(true);
      expect(getList().hidden).toBe(true);
    });

    it('when leaving the field before the debounce has fired', async () => {
      const input = getInput();
      input.focus();
      type(input, 'Lerk');
      input.blur();
      await flush();
      await waitForDebounce();

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('picks the suggestion highlighted with the arrow keys', () => {
    function press(input: HTMLInputElement, key: string) {
      input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    }

    let offsetWidth: { mockRestore: () => void };

    beforeEach(() => {
      // combobox-nav skips options without a size, and happy-dom has no
      // layout.
      offsetWidth = vi
        .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
        .mockReturnValue(100);
    });

    afterEach(() => {
      offsetWidth.mockRestore();
    });

    async function highlightSecond(input: HTMLInputElement) {
      input.focus();
      type(input, 'Mo');
      await waitForDebounce();
      await respond('Mo', [moa, moholt]);
      press(input, 'ArrowDown');
      press(input, 'ArrowDown');
      expect(getList().querySelector('[aria-selected="true"]')).toHaveAttribute(
        'data-feature-id',
        moholt.id,
      );
    }

    it('when leaving the field', async () => {
      const input = getInput();
      await highlightSecond(input);

      input.blur();
      await flush();

      expect(input.value).toBe('Moholt');
      expect(selected).toEqual([moholt]);
    });

    it('but not when pressing Escape', async () => {
      const input = getInput();
      await highlightSecond(input);

      press(input, 'Escape');
      await flush();

      expect(input.value).toBe('Mo');
      expect(selected).toEqual([]);
    });
  });

  it('ignores spaces around the text when matching the suggestions', async () => {
    const input = getInput();
    input.focus();
    type(input, 'Moa');
    await waitForDebounce();
    await respond('Moa', [moa]);

    // A trailing space doesn't make the suggestions out of date.
    type(input, 'Moa ');
    input.blur();
    await flush();

    expect(selected).toEqual([moa]);
  });

  it('sets "Use my location" on the field it was chosen in', async () => {
    const location = feature('location', 'Min posisjon');
    getCurrentPositionMock.mockImplementationOnce((success: PositionCallback) =>
      success({
        coords: { latitude: 63.4, longitude: 10.4 },
      } as GeolocationPosition),
    );

    const toInput = document.querySelector<HTMLInputElement>('#pw-to-1-input')!;
    toInput.focus();
    document.querySelector<HTMLElement>('#to-popup-1 .itemLocation')!.click();
    await flush();

    // The reverse lookup of the position.
    const reverse = requests.find((r) => r.url.includes('/reverse'))!;
    reverse.resolve(location as unknown as GeocoderFeature[]);
    await flush();

    expect(toInput.value).toBe('Min posisjon');
    expect(selected.at(-1)).toEqual(location);
    expect(selectedKeys).not.toContain('from');
  });

  describe('keeps the text but clears the selection when no suggestion matches', () => {
    async function selectOsloS(input: HTMLInputElement) {
      await typeAndLeave(input, 'Oslo', [osloS]);
      expect(selected.at(-1)).toEqual(osloS);
      selected = [];
    }

    it('when the text has no results', async () => {
      const input = getInput();
      await selectOsloS(input);

      input.focus();
      type(input, 'xyzzy');
      await waitForDebounce();
      await respond('xyzzy', []);
      input.blur();
      await flush();

      expect(input.value).toBe('xyzzy');
      expect(selected).toEqual([undefined]);
    });

    it('when leaving before the suggestions have arrived', async () => {
      const input = getInput();
      await selectOsloS(input);

      input.focus();
      type(input, 'Lerk');
      input.blur();
      await flush();

      expect(input.value).toBe('Lerk');
      expect(selected).toEqual([undefined]);
      expect(getCurrentPositionMock).not.toHaveBeenCalled();
    });

    it('when the text was cleared', async () => {
      const input = getInput();
      await selectOsloS(input);

      input.focus();
      type(input, '');
      input.blur();
      await flush();

      expect(input.value).toBe('');
      expect(selected).toEqual([undefined]);
    });

    it('when the list still holds suggestions for older text', async () => {
      const input = getInput();
      await selectOsloS(input);

      input.focus();
      type(input, 'Mo');
      await waitForDebounce();
      await respond('Mo', [moa]);

      // Change the text and leave before the search for it has run. The list
      // still holds the suggestions for "Mo", which must not be used.
      type(input, 'Moholt');
      input.blur();
      await flush();

      expect(input.value).toBe('Moholt');
      expect(selected).toEqual([undefined]);
    });
  });
});
