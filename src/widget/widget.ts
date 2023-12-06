import type { AutocompleteApiReturnType } from '@atb/page-modules/departures/client';
import type { GeocoderFeature } from '@atb/page-modules/departures';
import type { SearchTime } from '@atb/modules/search-time/types';

import Combobox from '@github/combobox-nav';

import style from './widget.module.css';

const DEFAULT_DEBOUNCE_TIME = 300;

type SettingConstants = {
  URL_BASE: string;
  URL_JS_UMD: string;
  URL_JS_ESM: string;
  URL_CSS: string;
};

const html = String.raw;

function createSettingsConstants(urlBase: string) {
  if (!urlBase?.startsWith('http')) {
    throw new Error('Missing urlBase in correct schema.');
  }

  if (!urlBase.endsWith('/')) {
    urlBase += '/';
  }

  return {
    URL_BASE: urlBase,
    URL_JS_UMD: `${urlBase}widget/planner-web.umd.js`,
    URL_JS_ESM: `${urlBase}widget/planner-web.mjs`,
    URL_CSS: `${urlBase}widget/style.css`,
  };
}

export type WidgetOptions = {
  urlBase: string;
};
export type PlannerWebOutput = {
  output: string;
  init: () => void;
  urls: SettingConstants;
};
export function createWidget({ urlBase }: WidgetOptions): PlannerWebOutput {
  const settings = createSettingsConstants(urlBase);
  const output = createOutput(settings);
  return {
    output,
    init,
    urls: settings,
  };
}

function init() {
  tabBar();

  setDefaultTimeForDatetime('pw-assistant');
  setDefaultTimeForDatetime('pw-departure');

  let fromTo = {
    from: undefined as GeocoderFeature | undefined,
    to: undefined as GeocoderFeature | undefined,
  };

  document.addEventListener('search-selected', function (event) {
    const data = event as CustomEvent<SelectedSearchEvent>;
    fromTo[data.detail.key] = data.detail.item;
  });

  document.querySelectorAll('[name=searchTimeSelector]').forEach(function (el) {
    el.addEventListener('change', function (e) {
      const input = e.currentTarget as HTMLInputElement;
      const hidden = input.value === 'now';
      document.querySelectorAll('.js-search-date-details').forEach((el) => {
        (el as HTMLElement).hidden = hidden;
      });
    });
  });
  document
    .querySelector('#pw-form-departures')
    ?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      submitDeparture(form, fromTo.from!);
    });

  document
    .querySelector('#pw-form-assistant')
    ?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      submitAssistant(form, fromTo.from!, fromTo.to);
    });
}

function setDefaultTimeForDatetime(prefix: string) {
  const date = document.querySelector<HTMLInputElement>(
    `#${prefix}-searchTimeSelector-date`,
  );
  const time = document.querySelector<HTMLInputElement>(
    `#${prefix}-searchTimeSelector-time`,
  );

  try {
    if (date) {
      date.valueAsDate = new Date();
    }
    if (time) {
      const now = new Date();
      now.setSeconds(0);
      now.setMilliseconds(0);
      time.valueAsDate = now;
    }
  } catch (e) {}
}

function getSearchTime(formData: FormData): SearchTime {
  const searchTimeSelector = formData.get('searchTimeSelector');

  if (searchTimeSelector === 'now') {
    return {
      mode: 'now',
    };
  } else {
    const date = formData.get('dateinput');
    const time = formData.get('timeinput');
    if (date && time) {
      const datetime = new Date(`${date}T${time}`);
      return {
        mode: searchTimeSelector == 'arriveBy' ? 'arriveBy' : 'departBy',
        dateTime: datetime.getTime(),
      };
    }
    return {
      mode: 'now',
    };
  }
}

function submitAssistant(
  form: HTMLFormElement,
  from: GeocoderFeature,
  to?: GeocoderFeature,
) {
  const url = form.action;
  const searchTime = getSearchTime(new FormData(form));
  const query = createTripQueryForAssistant({ from, to }, searchTime);
  const params = new URLSearchParams(query);
  window.location.href = `${url}?${params.toString()}`;
}
function submitDeparture(form: HTMLFormElement, from: GeocoderFeature) {
  const url = form.action;
  const searchTime = getSearchTime(new FormData(form));
  const query = createTripQueryForDeparture(from, searchTime);
  const params = new URLSearchParams(query);
  window.location.href = `${url}?${params.toString()}`;
}

type ErrorMessage = {
  message: string;
};
class MessageBox extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const self = this;
    self.hidden = true;
    self.classList.add(style.messageBox);
    document.addEventListener('pw-errorMessage', function (event) {
      const data = event as CustomEvent<ErrorMessage>;
      self.textContent = data.detail.message;
      self.hidden = false;
    });
    document.addEventListener('pw-errorMessage-clear', function (event) {
      self.hidden = true;
    });
    self.addEventListener('click', function () {
      MessageBox.clearMessageBox();
    });
  }

  static clearMessageBox() {
    document.dispatchEvent(
      new CustomEvent('pw-errorMessage-clear', {
        bubbles: true,
      }),
    );
  }
}

function createOutput({ URL_BASE }: SettingConstants) {
  function searchItem(item: GeocoderFeature) {
    const img = venueIcon(item);
    const title = el('span', [item.name]);
    const locality = el('span', [item.locality ?? ''], style.itemLocality);
    const li = el('li', [img, title, locality], style.listItem);
    li.role = 'option';
    li.setAttribute('data-feature-id', item.id);
    return li;
  }

  function messageItem(text: string) {
    const title = el('span', [text]);
    const li = el('li', [title], style.listItem);
    return li;
  }

  function venueIcon(item: GeocoderFeature) {
    const icon = iconData(item.category);

    const img = el('img');
    img.src = `${URL_BASE}assets/mono/light/${icon.icon}.svg`;
    img.alt = icon.alt;
    img.role = 'img';

    const div = el('div', [img], style.itemIcon);
    div.ariaHidden = 'true';
    return div;
  }

  class GeoLocationButton extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const self = this;
      const mode = self.getAttribute('data-mode') ?? 'assistant';
      const button = this.querySelector('button')!;

      button.addEventListener('click', async (event) => {
        MessageBox.clearMessageBox();

        try {
          const item = await getGeolocation();
          const input = self.parentElement?.querySelector('input');
          if (input) {
            input.value = item ? `${item.name}, ${item.locality}` : input.value;
          }

          document.dispatchEvent(
            new CustomEvent('search-selected', {
              bubbles: true,
              detail: {
                mode,
                key: 'from',
                item,
              },
            }),
          );
        } catch (e) {
          if (e instanceof Error) {
            document.dispatchEvent(
              new CustomEvent<ErrorMessage>('pw-errorMessage', {
                bubbles: true,
                detail: {
                  message: e.message,
                },
              }),
            );
          }
        }
      });
    }
  }
  customElements.define('pw-geobutton', GeoLocationButton);

  customElements.define('pw-messagebox', MessageBox);

  class AutocompleteBox extends HTMLElement {
    private dataList: Record<string, GeocoderFeature> = {};

    constructor() {
      super();
    }

    getItem(id: string) {
      return this.dataList[id];
    }

    setItems(list: GeocoderFeature[]) {
      this.dataList = {};
      for (let item of list) {
        this.dataList[item.id] = item;
      }
    }

    connectedCallback() {
      const self = this;

      const debounceTime = safeParse(
        this.getAttribute('data-debounce-ms'),
        DEFAULT_DEBOUNCE_TIME,
      );

      const input = this.querySelector('input')!;
      const list = this.querySelector<HTMLElement>(
        '#' + this.getAttribute('for')!,
      )!;

      let combobox = new Combobox(input, list, {
        scrollIntoViewOptions: false,
      });

      function toggleList(show?: boolean) {
        if (!show) {
          combobox.clearSelection();
          combobox.stop();
        } else {
          combobox.start();
        }

        list.hidden = !show;
      }

      function showEmpty() {
        self.setItems([]);
        list.innerHTML = '';
        const li = messageItem('Ingen resultater');
        list.appendChild(li);
        toggleList(true);
      }

      const fetcher = debounce(async (input: HTMLInputElement) => {
        try {
          if (!input.value) {
            list.innerHTML = '';
            return;
          }
          const data = await autocomplete(input.value);
          if (data.length === 0) {
            return showEmpty();
          }

          self.setItems(data);
          list.innerHTML = '';
          for (let item of data) {
            const li = searchItem(item);
            list.appendChild(li);
          }
          toggleList(true);
        } catch (e) {
          showEmpty();
        }
      }, debounceTime);
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          toggleList(false);
        }
      });
      input.addEventListener('input', (e) =>
        fetcher(e.target as HTMLInputElement),
      );
      input.addEventListener('focus', () => toggleList(true));
      input.addEventListener(
        'blur',
        // Blur after properly selecting
        debounce(() => toggleList(false), 100),
      );
      document.addEventListener('click', (e) => {
        if (!hasParent(e.target as HTMLElement, this)) {
          toggleList(false);
        }
      });

      list.addEventListener('combobox-commit', function (event) {
        const itemId = (event.target as HTMLElement).getAttribute(
          'data-feature-id',
        );
        const item = itemId ? self.getItem(itemId) : undefined;
        input.value = item ? `${item.name}, ${item.locality}` : input.value;
        document.dispatchEvent(
          new CustomEvent('search-selected', {
            bubbles: true,
            detail: {
              mode: 'assistant',
              key: input.name,
              item,
            },
          }),
        );

        list.hidden = true;
        combobox.clearSelection();
        combobox.stop();
      });
    }
  }

  customElements.define('pw-autocomplete', AutocompleteBox);

  const buttons = html`
    <div class="${style.buttonGroup}">
      <button type="submit" class="${style.button}" aria-disabled="true">
        <span>Finn avganger</span>
      </button>
    </div>
  `;
  const searchTime = (prefix: string, withArriveBy: boolean = true) => html`
    <div class="${style.inputBoxes}">
      <p class="${style.heading}">Når vil du reise?</p>
      <div>
        <div
          class="${style.selector_options} ${!withArriveBy
            ? style.selector_options__small
            : ''}"
        >
          <label class="${style.selector_option}">
            <input
              type="radio"
              name="searchTimeSelector"
              aria-label="Nå"
              class="${style.selector_option__input}"
              value="now"
              checked=""
            />
            <span aria-hidden="true" class="${style.selector_option__label}">
              <span class="${style.selector_option__text}">Nå</span>
            </span>
          </label>
          ${withArriveBy
            ? html`
                <label class="${style.selector_option}">
                  <input
                    type="radio"
                    name="searchTimeSelector"
                    aria-label="Ankomst"
                    class="${style.selector_option__input}"
                    value="arriveBy"
                  />
                  <span
                    aria-hidden="true"
                    class="${style.selector_option__label}"
                  >
                    <span class="${style.selector_option__text}">Ankomst</span>
                  </span>
                </label>
              `
            : ''}
          <label class="${style.selector_option}">
            <input
              type="radio"
              name="searchTimeSelector"
              aria-label="Avgang"
              class="${style.selector_option__input}"
              value="departBy"
            />
            <span aria-hidden="true" class="${style.selector_option__label}">
              <span class="${style.selector_option__text}">Avgang</span>
            </span>
          </label>
        </div>
        <div
          class="${style.selector_dateAndTimeSelectorsWrapper} js-search-date-details"
          hidden
        >
          <div class="${style.selector_dateAndTimeSelectors}">
            <div class="${style.selector_dateSelector}">
              <label for="${`${prefix}-searchTimeSelector-date`}">Dato</label>
              <input
                type="date"
                name="dateinput"
                id="${`${prefix}-searchTimeSelector-date`}"
              />
            </div>
            <div class="${style.selector_timeSelector}">
              <label for="${`${prefix}-searchTimeSelector-time`}">Tid</label>
              <input
                type="time"
                name="timeinput"
                step="60"
                id="${`${prefix}-searchTimeSelector-time`}"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  const assistant = html`
    <form
      class="${style.form}"
      action="${URL_BASE}/assistant"
      id="pw-form-assistant"
      method="get"
    >
      <div class="${style.main}">
        <div class="${style.inputBoxes}">
          <p class="${style.heading}">Hvor vil du reise?</p>
          <div class="${style.search_container}">
            <label
              class="${style.search_label}"
              for="pw-from-1-input"
              id="pw-from-1-label"
            >
              Fra
            </label>
            <div
              class="${style.search_inputContainer}"
              role="combobox"
              aria-expanded="false"
              aria-haspopup="listbox"
              aria-labelledby="pw-from-1-label"
            >
              <pw-autocomplete for="from-popup-1">
                <input
                  class="${style.search_input}"
                  aria-autocomplete="list"
                  aria-labelledby="pw-from-1-label"
                  autocomplete="off"
                  id="pw-from-1-input"
                  name="from"
                  value=""
                  placeholder="Søk fra adresse, kai eller holdeplass"
                />
                <ul
                  id="from-popup-1"
                  role="listbox"
                  aria-labelledby="pw-from-1-label"
                  class="${style.popupContainer}"
                  hidden
                ></ul>
              </pw-autocomplete>
            </div>
            <pw-geobutton mode="assistant">
              <button
                class="${style.button_geolocation}"
                title="Finn min posisjon"
                aria-label="Finn min posisjon"
                type="button"
              >
                <img
                  src="${URL_BASE}/assets/mono/light/places/City.svg"
                  width="20"
                  height="20"
                  role="none"
                  alt=""
                />
              </button>
            </pw-geobutton>
          </div>
          <pw-messagebox></pw-messagebox>
          <div class="${style.search_container}">
            <label
              class="${style.search_label}"
              for="pw-to-1-input"
              id="pw-to-1-label"
            >
              Til
            </label>
            <div
              class="${style.search_inputContainer}"
              role="combobox"
              aria-expanded="false"
              aria-haspopup="listbox"
              aria-labelledby="pw-to-1-label"
            >
              <pw-autocomplete for="to-popup-1">
                <input
                  class="${style.search_input} ${style.search_inputLast}"
                  aria-autocomplete="list"
                  aria-labelledby="pw-to-1-label"
                  autocomplete="off"
                  id="pw-to-1-input"
                  name="to"
                  value=""
                  placeholder="Søk til adresse, kai eller holdeplass"
                />
                <ul
                  id="to-popup-1"
                  role="listbox"
                  aria-labelledby="pw-to-1-label"
                  class="${style.popupContainer}"
                  hidden
                ></ul>
              </pw-autocomplete>
            </div>
          </div>
        </div>
        ${searchTime('pw-assistant')}
      </div>
      ${buttons}
    </form>
  `;
  const departures = html`
    <form
      class="${style.form}"
      action="${URL_BASE}/departures"
      id="pw-form-departures"
      method="get"
    >
      <div class="${style.main}">
        <div class="${style.inputBoxes}">
          <p class="${style.heading}">Hvor vil du reise fra?</p>
          <div class="${style.search_container}">
            <label
              class="${style.search_label}"
              for="pw-from-2-input"
              id="pw-from-2-label"
            >
              Fra
            </label>
            <div
              class="${style.search_inputContainer}"
              role="combobox"
              aria-expanded="false"
              aria-haspopup="listbox"
              aria-labelledby="pw-from-2-label"
            >
              <pw-autocomplete for="to-popup-2">
                <input
                  class="${style.search_input}"
                  aria-autocomplete="list"
                  aria-labelledby="pw-from-2-label"
                  autocomplete="off"
                  name="from"
                  id="pw-from-2-input"
                  value=""
                  placeholder="Søk fra adresse, kai eller holdeplass"
                />
                <ul
                  id="to-popup-2"
                  role="listbox"
                  aria-labelledby="pw-from-2-label"
                  class="${style.popupContainer}"
                  hidden
                ></ul>
              </pw-autocomplete>
            </div>
            <pw-geobutton mode="departure">
              <button
                class="${style.button_geolocation}"
                title="Finn min posisjon"
                aria-label="Finn min posisjon"
                type="button"
              >
                <img
                  src="${URL_BASE}/assets/mono/light/places/City.svg"
                  width="20"
                  height="20"
                  role="none"
                  alt=""
                />
              </button>
            </pw-geobutton>
          </div>
          <pw-messagebox></pw-messagebox>
        </div>
        ${searchTime('pw-departure', false)}
      </div>
      ${buttons}
    </form>
  `;

  const output = html`
    <div class="${style.wrapper}">
      <nav class="${style.nav}">
        <ul class="${style.tabs} js-tablist">
          <li>
            <a
              href="/assistant"
              class="${style.tabSelected}"
              id="pw-assistant-tab"
            >
              Planlegg reisen
            </a>
          </li>
          <li>
            <a href="/departures" id="pw-departures-tab">Finn avganger</a>
          </li>
        </ul>
      </nav>
      <div class="js-tabpanel" id="pw-assistant">${assistant}</div>
      <div class="js-tabpanel ${style.hidden}" id="pw-departures">
        ${departures}
      </div>
    </div>
  `;

  return output;
}

function tabBar() {
  document
    .querySelector<HTMLUListElement>('.js-tablist')
    ?.addEventListener('click', function (e) {
      const tab = (e.target as HTMLElement)?.closest('a');
      if (!tab) return;

      const href = tab.getAttribute('href');
      if (!href) return;

      const mode = href.replace('/', '');
      e.preventDefault();
      const tabpanel = document.querySelector('#pw-' + mode);
      if (!tabpanel) return;

      MessageBox.clearMessageBox();

      // Hide all tabpanels
      document.querySelectorAll('.js-tabpanel').forEach((panel) => {
        panel.classList.add(style.hidden);
      });
      document.querySelectorAll('.js-tablist a').forEach((panel) => {
        panel.classList.remove(style.tabSelected);
      });
      tabpanel.classList.remove(style.hidden);
      tab.classList.add(style.tabSelected);
    });
}

function debounce(func: Function, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (...args: any[]) {
    clearTimeout(timeoutId!);
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

type SelectedSearchEvent = {
  key: 'from' | 'to';
  item?: GeocoderFeature;
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  children: (HTMLElement | string)[] = [],
  className: string = '',
) {
  const item = document.createElement(tag);
  if (Array.isArray(children)) {
    for (let childP of children) {
      let child =
        typeof childP === 'string' ? document.createTextNode(childP) : childP;
      item.appendChild(child);
    }
  }
  item.className = className;
  return item;
}

function safeParse(input: string | null, defaultValue: number) {
  const parsed = parseInt(input!, 10);
  if (Number.isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
}

function hasParent(el: HTMLElement, parent: HTMLElement) {
  if (el === parent) return true;
  if (!el || !el.parentElement) return false;
  return hasParent(el.parentElement, parent);
}

enum FeatureCategory {
  ONSTREET_BUS = 'onstreetBus',
  ONSTREET_TRAM = 'onstreetTram',
  AIRPORT = 'airport',
  RAIL_STATION = 'railStation',
  METRO_STATION = 'metroStation',
  BUS_STATION = 'busStation',
  COACH_STATION = 'coachStation',
  TRAM_STATION = 'tramStation',
  HARBOUR_PORT = 'harbourPort',
  FERRY_PORT = 'ferryPort',
  FERRY_STOP = 'ferryStop',
  LIFT_STATION = 'liftStation',
  VEHICLE_RAIL_INTERCHANGE = 'vehicleRailInterchange',
  GROUP_OF_STOP_PLACES = 'GroupOfStopPlaces',
  POI = 'poi',
  VEGADRESSE = 'Vegadresse',
  STREET = 'street',
  TETTSTEDDEL = 'tettsteddel',
  BYDEL = 'bydel',
  OTHER = 'other',
}
type VenueIconType = 'bus' | 'tram' | 'rail' | 'airport' | 'boat' | 'unknown';

function iconData(category: FeatureCategory[]) {
  const iconType = getVenueIconTypes(category)[0];
  switch (iconType) {
    case 'bus':
      return { icon: 'transportation-entur/Bus', alt: 'bus' };
    case 'tram':
      return { icon: 'transportation-entur/Tram', alt: 'tram' };
    case 'rail':
      return { icon: 'transportation-entur/Train', alt: 'rail' };
    case 'airport':
      return { icon: 'transportation-entur/Plane', alt: 'air' };
    case 'boat':
      return { icon: 'transportation-entur/Ferry', alt: 'water' };
    case 'unknown':
    default:
      return { icon: 'map/Pin', alt: 'unknown' };
  }
}

function getVenueIconTypes(category: FeatureCategory[]): VenueIconType[] {
  return category
    .map(mapLocationCategoryToVenueType)
    .filter((v, i, arr) => arr.indexOf(v) === i); // get distinct values
}

function mapLocationCategoryToVenueType(
  category: FeatureCategory,
): VenueIconType {
  switch (category) {
    case 'onstreetBus':
    case 'busStation':
    case 'coachStation':
      return 'bus';
    case 'onstreetTram':
    case 'tramStation':
      return 'tram';
    case 'railStation':
    case 'metroStation':
      return 'rail';
    case 'airport':
      return 'airport';
    case 'harbourPort':
    case 'ferryPort':
    case 'ferryStop':
      return 'boat';
    default:
      return 'unknown';
  }
}

function featuresToFromToQuery(from: GeocoderFeature, to?: GeocoderFeature) {
  const toFlattened = to
    ? {
        toId: to.id,
        toLon: to.geometry.coordinates[0].toString(),
        toLat: to.geometry.coordinates[1].toString(),
        toLayer: to.layer as string,
      }
    : undefined;
  return {
    fromId: from.id,
    fromLon: from.geometry.coordinates[0].toString(),
    fromLat: from.geometry.coordinates[1].toString(),
    fromLayer: from.layer as string,
    ...toFlattened,
  };
}

function createTripQueryForAssistant(
  fromTo: { from: GeocoderFeature; to?: GeocoderFeature },
  searchTime: SearchTime,
): Record<string, string> {
  const searchTimeQuery: Record<string, string> =
    searchTime.mode !== 'now'
      ? {
          searchMode: searchTime.mode,
          searchTime: searchTime.dateTime.toString(),
        }
      : { searchMode: searchTime.mode };
  const fromToQuery: Record<string, string> = featuresToFromToQuery(
    fromTo.from,
    fromTo.to,
  );

  return {
    ...searchTimeQuery,
    ...fromToQuery,
  };
}
function createTripQueryForDeparture(
  from: GeocoderFeature,
  searchTime: SearchTime,
): Record<string, string> {
  const searchTimeQuery: Record<string, string> =
    searchTime.mode !== 'now'
      ? {
          searchMode: searchTime.mode,
          searchTime: searchTime.dateTime.toString(),
        }
      : { searchMode: searchTime.mode };

  if (from.layer == 'venue') {
    return {
      ...searchTimeQuery,
      id: from.id,
    };
  }

  return {
    ...searchTimeQuery,
    lon: from.geometry.coordinates[0].toString(),
    lat: from.geometry.coordinates[1].toString(),
  };
}

async function autocomplete(q: string) {
  const url = `/api/departures/autocomplete?q=${q}`;
  const result = await fetch(url);

  if (!result.ok) {
    throw new Error(`Error fetching autocomplete data from ${url}`);
  }

  const data = (await result.json()) as AutocompleteApiReturnType;
  return data;
}

export async function reverse(coords: GeolocationCoordinates) {
  const result = await fetch(
    `/api/departures/reverse?lat=${coords.latitude}&lon=${coords.longitude}`,
  );

  const data = await result.json();
  if (!data) {
    return undefined;
  }
  return data as GeocoderFeature;
}

async function getGeolocation(): Promise<GeocoderFeature | undefined> {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const reversedPosition = await reverse(position.coords);
        resolve(reversedPosition);
      },
      (error) => {
        reject(new Error(getErrorMessage(error.code)));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}

const geoTexts = {
  denied:
    'Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.',
  unavailable: 'Posisjonen din er ikke tilgjengelig.',
  timeout: 'Det tok for lang tid å hente posisjonen din. Prøv på nytt.',
};

function getErrorMessage(code: number) {
  switch (code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return geoTexts.denied;
    case GeolocationPositionError.TIMEOUT:
      return geoTexts.timeout;
    case GeolocationPositionError.POSITION_UNAVAILABLE:
    default:
      return geoTexts.unavailable;
  }
}
