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
  resolve: (data: GeocoderFeature[]) => void;
  fail: () => void;
};

let requests: PendingRequest[] = [];
let selected: Array<GeocoderFeature | undefined> = [];
let output: string;

function onSearchSelected(event: Event) {
  const { detail } = event as CustomEvent<{ item?: GeocoderFeature }>;
  selected.push(detail.item);
}

// Each autocomplete request stays pending until the test responds to it, so
// the tests decide the order responses arrive in.
const fetchMock = vi.fn((url: string) => {
  return new Promise((resolve) => {
    const q = url.split('?q=')[1] ?? '';
    requests.push({
      url,
      q: decodeURIComponent(q),
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

function takeRequest(q: string) {
  const request = requests.find((r) => r.q === q);
  if (!request) {
    throw new Error(
      `No autocomplete request for "${q}". Requests: ${requests.map((r) => `"${r.q}"`).join(', ')}`,
    );
  }
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

/** Answers any pending requests for `q`, such as the one sent on focus. */
async function respondIfRequested(q: string, data: GeocoderFeature[]) {
  if (requests.some((r) => r.q === q)) {
    await respond(q, data);
  }
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

      // Leave right away, while "Use my location" may be the only item.
      input.focus();
      input.blur();
      await flush();
      await waitForDebounce();
      await respondIfRequested('Lerkendal', [lerkendal]);

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
    await respondIfRequested('Lerkendal', [moholt]);
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

    document.body.click();

    expect(getList().hidden).toBe(true);
  });

  // Escape works like blur: after typing, it picks the first suggestion
  // (kundevendt#20821: "Use the first suggestion from the AutoComplete if
  // none is selected").
  describe('Escape', () => {
    function pressEscape(input: HTMLInputElement) {
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
    }

    it('picks the first suggestion after typing (kundevendt#20821)', async () => {
      const input = getInput();
      input.focus();
      type(input, 'Lerk');
      await waitForDebounce();
      await respond('Lerk', [lerkendal, moholt]);

      pressEscape(input);
      await flush();

      expect(input.value).toBe('Lerkendal');
      expect(selected).toEqual([lerkendal]);
      expect(getList().hidden).toBe(true);
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
    });

    it('closes the list without changing anything when nothing was typed', async () => {
      const input = getInput();
      await typeAndLeave(input, 'Lerk', [lerkendal]);
      selected = [];

      input.focus();
      await waitForDebounce();
      await respondIfRequested('Lerkendal', [moholt]);
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

  // The it.fails tests below describe the expected behaviour and fail on the
  // current code. Change them to `it` once the fix is in.

  it.fails(
    'does not pick a suggestion for older text when leaving the field quickly',
    async () => {
      const input = getInput();
      await typeAndLeave(input, 'Lerkendal', [lerkendal]);

      // Focusing fetches suggestions for the text already in the field.
      input.focus();
      await waitForDebounce();
      if (requests.some((r) => r.q === 'Lerkendal')) {
        await respond('Lerkendal', [lerkendal]);
      }

      // Change the text and leave before the debounce has fired.
      selected = [];
      type(input, 'Moholt');
      input.blur();
      await flush();

      // The list still holds the "Lerkendal" suggestions, which must not be used.
      expect(input.value).toBe('Moholt');
      expect(selected).not.toContainEqual(lerkendal);

      await waitForDebounce();
      await respond('Moholt', [moholt]);

      expect(selected).not.toContainEqual(lerkendal);
      expect(input.value).toBe('Moholt');
      expect(selected.at(-1)).toEqual(moholt);
    },
  );

  it.fails('ignores responses that arrive after a newer one', async () => {
    const input = getInput();
    input.focus();

    type(input, 'Mo');
    await waitForDebounce();
    type(input, 'Moholt');
    await waitForDebounce();

    // The response for "Moholt" arrives before the one for "Mo".
    await respond('Moholt', [moholt]);
    await respond('Mo', [moa]);

    input.blur();
    await flush();

    expect(input.value).toBe('Moholt');
    expect(selected.at(-1)).toEqual(moholt);
  });

  it.fails('clears the selection when the text has no results', async () => {
    const input = getInput();
    await typeAndLeave(input, 'Oslo', [osloS]);
    expect(selected.at(-1)).toEqual(osloS);

    input.focus();
    await waitForDebounce();
    if (requests.some((r) => r.q === 'Oslo S')) {
      await respond('Oslo S', [osloS]);
    }

    type(input, 'xyzzy');
    await waitForDebounce();
    await respond('xyzzy', []);
    input.blur();
    await flush();

    expect(input.value).toBe('xyzzy');
    expect(selected.at(-1)).toBeUndefined();
  });
});
