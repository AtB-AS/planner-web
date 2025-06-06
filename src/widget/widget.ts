import type { AutocompleteApiReturnType } from '@atb/modules/geocoder';
import type { GeocoderFeature } from '@atb/modules/geocoder';
import type { SearchTime } from '@atb/modules/search-time/types';

import Combobox from '@github/combobox-nav';

import style from './widget.module.css';
import { andIf } from '../utils/css';

const DEFAULT_DEBOUNCE_TIME = 300;

type SettingConstants = {
  URL_BASE: string;
  URL_JS_UMD: string;
  URL_JS_ESM: string;
  URL_CSS: string;
};

const html = String.raw;

const MODULE_VERSION = process.env.MODULE_VERSION;
const COMPRESSED_ORG = process.env.COMPRESSED_ORG;
const ORG_ID = process.env.ORG_ID;
const useDefaultButtonStyle = ORG_ID !== 'fram';

function createSettingsConstants(urlBase: string) {
  if (!urlBase?.startsWith('http')) {
    throw new Error('Missing urlBase in correct schema.');
  }

  if (!urlBase.endsWith('/')) {
    urlBase += '/';
  }

  return {
    URL_BASE: urlBase,
    URL_JS_UMD: `${urlBase}widget/${COMPRESSED_ORG}/${MODULE_VERSION}/planner-web.umd.js`,
    URL_JS_ESM: `${urlBase}widget/${COMPRESSED_ORG}/${MODULE_VERSION}/planner-web.mjs`,
    URL_CSS: `${urlBase}widget/${COMPRESSED_ORG}/${MODULE_VERSION}/planner-web.css`,
  };
}

type OutputOverrideOptions = {
  inheritFont?: boolean;
  singleColumnLayout?: boolean;
};
export type WidgetOptions = {
  urlBase: string;
  language?: Languages;
  outputOverrideOptions?: Partial<OutputOverrideOptions>;
};
export type PlannerWebOutput = {
  output: string;
  init: () => void;
  urls: SettingConstants;
};
export function createWidget({
  urlBase,
  language = 'en',
  outputOverrideOptions = {},
}: WidgetOptions): PlannerWebOutput {
  const texts = translations(language);
  const settings = createSettingsConstants(urlBase);

  const defaultOutputOverrideOptions: OutputOverrideOptions = {
    inheritFont: false,
    singleColumnLayout: false,
    ...outputOverrideOptions,
  };

  const output = createOutput(settings, texts, defaultOutputOverrideOptions);

  return {
    output,
    init,
    urls: settings,
  };
}

function init() {
  tabBar();

  setDefaultTimeForDatetime('pw-assistant');
  setDefaultTimeForDatetime('pw-departures');

  let fromTo = {
    from: undefined as GeocoderFeature | undefined,
    to: undefined as GeocoderFeature | undefined,
  };

  document.addEventListener('search-selected', function (event) {
    const data = event as CustomEvent<SelectedSearchEvent>;
    fromTo[data.detail.key] = data.detail.item;
  });

  document.addEventListener('reset-search', function () {
    // Reset state.
    fromTo = {
      from: undefined,
      to: undefined,
    };

    // Reset input values to empty.
    document
      .querySelectorAll<HTMLInputElement>(
        'input[name="from"], input[name="to"]',
      )
      .forEach((input) => {
        input.value = '';
      });
  });

  document.addEventListener('swap-selected', function () {
    const originalFromValue = fromTo.from;
    fromTo = {
      from: fromTo.to,
      to: originalFromValue,
    };
  });

  document
    .querySelectorAll('[name$=searchTimeSelector]')
    .forEach(function (el) {
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
      submitAssistant(form, fromTo.from, fromTo.to);
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
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      time.value = `${hours}:${minutes}`;
    }
  } catch (e) {}
}

function getSearchTime(formData: FormData, prefix: string): SearchTime {
  const searchTimeSelector = formData.get(`${prefix}-searchTimeSelector`);

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
  from?: GeocoderFeature,
  to?: GeocoderFeature,
) {
  const url = form.action;
  const searchTime = getSearchTime(new FormData(form), 'pw-assistant');
  const query = createTripQueryForAssistant({ from, to }, searchTime);
  const params = new URLSearchParams(query);
  window.location.href = `${url}?${params.toString()}`;
}
function submitDeparture(form: HTMLFormElement, from?: GeocoderFeature) {
  const url = form.action;
  const searchTime = getSearchTime(new FormData(form), 'pw-departures');
  const query = createTripQueryForDeparture(searchTime, from);
  const params = new URLSearchParams(query);
  if (from?.layer === 'venue') {
    window.location.href = `${url}/${from.id}?${params.toString()}`;
  } else {
    window.location.href = `${url}?${params.toString()}`;
  }
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

function createOutput(
  { URL_BASE }: SettingConstants,
  texts: Texts,
  outputOverrideOptions: OutputOverrideOptions,
) {
  function searchItem(item: GeocoderFeature) {
    const img = venueIcon(item);
    const title = el('span', [item.name], style.itemTitle);
    const locality = el('span', [item.locality ?? ''], style.itemLocality);
    const itemText = el('div', [title, locality], style.itemText);
    const li = el('li', [img, itemText], style.listItem);
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

  class SwapButton extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const button = this.querySelector('button')!;

      button.addEventListener('click', async () => {
        MessageBox.clearMessageBox();
        const searchInputs = document.getElementsByClassName(
          'widget-module__search_input',
        );
        const [input1, input2] = Array.from(searchInputs) as HTMLInputElement[];
        [input1.value, input2.value] = [input2.value, input1.value];

        document.dispatchEvent(new CustomEvent('swap-selected'));
      });
    }
  }

  customElements.define('pw-swapbutton', SwapButton);
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
        tabInsertsSuggestions: true,
        scrollIntoViewOptions: false,
      });

      const createLocationItem = function () {
        const img = el('img');
        img.src = `${URL_BASE}assets/mono/places/Location.svg`;
        img.role = 'img';
        const divImg = el('div', [img], style.itemIcon);
        img.ariaHidden = 'true';
        const title = el('span', [texts.geoButton], style.itemTitle);
        const text = el('div', [title], style.itemText);
        const li = el('li', [divImg, text], style.listItem);
        li.classList.add('itemLocation');
        li.role = 'option';
        return li;
      };

      function toggleList(show?: boolean) {
        const locationLi = createLocationItem();
        if (!show) {
          list.innerHTML = '';
          combobox.clearSelection();
          combobox.stop();
        } else {
          list.appendChild(locationLi);
          combobox.start();
        }
        list.hidden = !show;
      }

      function showEmpty() {
        self.setItems([]);
        list.innerHTML = '';
        const li = messageItem(texts.noResults);
        list.appendChild(li);
        toggleList(true);
      }

      const fetcher = debounce(async (input: HTMLInputElement) => {
        try {
          if (!input.value) {
            list.innerHTML = '';
            return;
          }
          const data = await autocomplete(URL_BASE, input.value);
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
      input.addEventListener('blur', () => toggleList(false));
      document.addEventListener('click', (e) => {
        if (!hasParent(e.target as HTMLElement, this)) {
          toggleList(false);
        }
      });

      const setGeolocationPlace = async function () {
        MessageBox.clearMessageBox();
        try {
          const item = await getGeolocation(URL_BASE, texts);

          const input = self.parentElement?.querySelector('input');
          if (input) {
            input.value = item ? `${item.name}` : input.value;
          }
          document.dispatchEvent(
            new CustomEvent('search-selected', {
              bubbles: true,
              detail: {
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
      };

      list.addEventListener('combobox-commit', function (event) {
        if ((event.target as HTMLElement).classList.contains('itemLocation')) {
          setGeolocationPlace();
        }
        const itemId = (event.target as HTMLElement).getAttribute(
          'data-feature-id',
        );
        const item = itemId ? self.getItem(itemId) : undefined;
        let newValue = input.value;
        if (item) {
          newValue = `${item.name}`;
        }
        input.value = newValue;
        document.dispatchEvent(
          new CustomEvent('search-selected', {
            bubbles: true,
            detail: {
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
      <button
        type="submit"
        class="${useDefaultButtonStyle
          ? style.button
          : style.buttonLightOutline}"
      >
        <span>${texts.searchButton}</span>
      </button>
    </div>
  `;

  const searchTime = (prefix: string, withArriveBy: boolean = true) => html`
    <fieldset class="${style.inputBoxes}">
      <legend class="${style.heading}">${texts.searchTime.title}</legend>
      <div>
        <div
          class="${style.selector_options} ${!withArriveBy
            ? style.selector_options__small
            : ''}"
        >
          <label class="${style.selector_option}">
            <input
              type="radio"
              name="${prefix}-searchTimeSelector"
              class="${style.selector_option__input}"
              value="now"
              checked=""
            />
            <span class="${style.selector_option__label}">
              <span class="${style.selector_option__text}" id="${prefix}-now">
                ${texts.searchTime.now}
              </span>
            </span>
          </label>
          <label class="${style.selector_option}">
            <input
              type="radio"
              name="${prefix}-searchTimeSelector"
              class="${style.selector_option__input}"
              value="departBy"
            />
            <span class="${style.selector_option__label}">
              <span
                class="${style.selector_option__text}"
                id="${prefix}-depart"
              >
                ${texts.searchTime.depart}
              </span>
            </span>
          </label>
          ${withArriveBy
            ? html`
                <label class="${style.selector_option}">
                  <input
                    type="radio"
                    name="${prefix}-searchTimeSelector"
                    class="${style.selector_option__input}"
                    value="arriveBy"
                  />
                  <span class="${style.selector_option__label}">
                    <span
                      class="${style.selector_option__text}"
                      id="${prefix}-arrival"
                    >
                      ${texts.searchTime.arrive}
                    </span>
                  </span>
                </label>
              `
            : ''}
        </div>
        <div
          class="${style.selector_dateAndTimeSelectorsWrapper} js-search-date-details"
          hidden
        >
          <div class="${style.selector_dateAndTimeSelectors}">
            <div class="${style.selector_dateSelector}">
              <label for="${`${prefix}-searchTimeSelector-date`}">
                ${texts.searchTime.date}
              </label>
              <input
                type="date"
                name="dateinput"
                id="${`${prefix}-searchTimeSelector-date`}"
              />
            </div>
            <div class="${style.selector_timeSelector}">
              <label for="${`${prefix}-searchTimeSelector-time`}">
                ${texts.searchTime.time}
              </label>
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
    </fieldset>
  `;
  const assistant = html`
    <form
      class="${style.form}"
      action="${URL_BASE}/assistant"
      id="pw-form-assistant"
      method="get"
    >
      <div class="${style.main}">
        <fieldset class="${style.inputBoxes}">
          <legend class="${style.heading}">${texts.assistant.title}</legend>
          <div class="${style.searchSection}">
            <div class="${style.search_container}">
              <label
                class="${style.search_label}"
                for="pw-from-1-input"
                id="pw-from-1-label"
              >
                ${texts.assistant.from}
              </label>
              <div
                class="${style.search_inputContainer}"
                aria-haspopup="listbox"
                aria-labelledby="pw-from-1-label"
              >
                <pw-autocomplete for="from-popup-1">
                  <input
                    class="${style.search_input}"
                    aria-expanded="false"
                    aria-autocomplete="list"
                    autocomplete="off"
                    id="pw-from-1-input"
                    name="from"
                    value=""
                    placeholder="${texts.placeholder}"
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
            </div>

            <div class="${style.search_container}">
              <label
                class="${style.search_label}"
                for="pw-to-1-input"
                id="pw-to-1-label"
              >
                ${texts.assistant.to}
              </label>
              <div
                class="${style.search_inputContainer}"
                aria-haspopup="listbox"
                aria-labelledby="pw-to-1-label"
              >
                <pw-autocomplete for="to-popup-1">
                  <input
                    class="${style.search_input} ${style.search_inputLast}"
                    aria-expanded="false"
                    aria-autocomplete="list"
                    autocomplete="off"
                    id="pw-to-1-input"
                    name="to"
                    value=""
                    placeholder="${texts.placeholder}"
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
            <pw-swapbutton mode="assistant">
              <button
                class="${style.button_swap}"
                title="${texts.geoButton}"
                aria-label="${texts.geoButton}"
                type="button"
              >
                <img
                  src="${URL_BASE}/assets/mono/actions/Swap.svg"
                  width="20"
                  height="20"
                  role="none"
                  alt=""
                />
              </button>
            </pw-swapbutton>
            <pw-messagebox></pw-messagebox>
          </div>
        </fieldset>
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
        <fieldset class="${style.inputBoxes}">
          <legend class="${style.heading}">${texts.departure.title}</legend>
          <div class="${style.search_container}">
            <label
              class="${style.search_label}"
              for="pw-from-2-input"
              id="pw-from-2-label"
            >
              ${texts.departure.from}
            </label>
            <div
              class="${style.search_inputContainer}"
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
                  placeholder="${texts.placeholder}"
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
          </div>
          <pw-messagebox></pw-messagebox>
        </fieldset>
        ${searchTime('pw-departures', false)}
      </div>
      ${buttons}
    </form>
  `;

  const output = html`
    <div
      data-theme="light"
      class="${andIf({
        [style.wrapper]: true,
        [style.inheritFont]: outputOverrideOptions.inheritFont ?? false,
        [style.singleColumnLayout]:
          outputOverrideOptions.singleColumnLayout ?? false,
      })}"
    >
      <nav class="${style.nav}">
        <ul class="${style.tabs} js-tablist">
          <li>
            <a
              href="/assistant"
              class="${style.tabSelected}"
              id="pw-assistant-tab"
              data-mode="assistant"
            >
              ${texts.assistant.link}
            </a>
          </li>
          <li>
            <a href="/departures" id="pw-departures-tab" data-mode="departures">
              ${texts.departure.link}
            </a>
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
      e.preventDefault();
      e.stopPropagation();

      const tab = (e.target as HTMLElement)?.closest('a');
      if (!tab) return;

      const mode = tab.getAttribute('data-mode');
      if (!mode) return;

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

      const searchTimeSelectors = document.querySelectorAll<HTMLInputElement>(
        `input[type="radio"][name="pw-${mode}-searchTimeSelector"]`,
      );

      const selectedSearchTime = Array.from(searchTimeSelectors).find(
        (radio) => radio.checked,
      )?.value;

      document.querySelectorAll('.js-search-date-details').forEach((el) => {
        (el as HTMLElement).hidden = selectedSearchTime === 'now';
      });

      document.dispatchEvent(
        new CustomEvent('reset-search', {
          bubbles: true,
        }),
      );
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

function featuresToFromToQuery(from?: GeocoderFeature, to?: GeocoderFeature) {
  if (!from) return {};

  const toFlattened = to
    ? {
        toId: to.id,
        toName: to.name,
        toLon: to.geometry.coordinates[0].toString(),
        toLat: to.geometry.coordinates[1].toString(),
        toLayer: to.layer as string,
      }
    : undefined;
  return {
    fromId: from.id,
    fromName: from.name,
    fromLon: from.geometry.coordinates[0].toString(),
    fromLat: from.geometry.coordinates[1].toString(),
    fromLayer: from.layer as string,
    ...toFlattened,
  };
}

function createTripQueryForAssistant(
  fromTo: { from?: GeocoderFeature; to?: GeocoderFeature },
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
  searchTime: SearchTime,
  from?: GeocoderFeature,
): Record<string, string> {
  const searchTimeQuery: Record<string, string> =
    searchTime.mode !== 'now'
      ? {
          searchMode: searchTime.mode,
          searchTime: searchTime.dateTime.toString(),
        }
      : { searchMode: searchTime.mode };

  if (!from || from.layer == 'venue') {
    return {
      ...searchTimeQuery,
    };
  }

  return {
    ...searchTimeQuery,
    name: from.name,
    lon: from.geometry.coordinates[0].toString(),
    lat: from.geometry.coordinates[1].toString(),
  };
}

async function autocomplete(urlBase: string, q: string) {
  const url = `${urlBase}api/departures/autocomplete?q=${q}`;
  const result = await fetch(url);

  if (!result.ok) {
    throw new Error(`Error fetching autocomplete data from ${url}`);
  }

  const data = (await result.json()) as AutocompleteApiReturnType;
  return data;
}

export async function reverse(urlBase: string, coords: GeolocationCoordinates) {
  const result = await fetch(
    `${urlBase}api/departures/reverse?lat=${coords.latitude}&lon=${coords.longitude}`,
  );

  const data = await result.json();
  if (!data) {
    return undefined;
  }
  return data as GeocoderFeature;
}

async function getGeolocation(
  urlBase: string,
  texts: Texts,
): Promise<GeocoderFeature | undefined> {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const reversedPosition = await reverse(urlBase, position.coords);
        resolve(reversedPosition);
      },
      (error) => {
        reject(new Error(getErrorMessage(error.code, texts)));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}

function getErrorMessage(code: number, texts: Texts) {
  switch (code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return texts.geoTexts.denied;
    case GeolocationPositionError.TIMEOUT:
      return texts.geoTexts.timeout;
    case GeolocationPositionError.POSITION_UNAVAILABLE:
    default:
      return texts.geoTexts.unavailable;
  }
}

type Texts = {
  noResults: string;
  geoButton: string;
  geoTexts: {
    denied: string;
    unavailable: string;
    timeout: string;
  };
  searchButton: string;
  placeholder: string;
  assistant: {
    link: string;
    title: string;
    from: string;
    to: string;
  };
  departure: {
    link: string;
    title: string;
    from: string;
  };
  searchTime: {
    title: string;
    now: string;
    arrive: string;
    depart: string;
    date: string;
    time: string;
  };
};
type Languages = 'nb' | 'nn' | 'en';

const texts: Record<Languages, Texts> = {
  nb: {
    noResults: 'Ingen resultater',
    geoButton: 'Min posisjon',
    geoTexts: {
      denied:
        'Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.',
      unavailable: 'Posisjonen din er ikke tilgjengelig.',
      timeout: 'Det tok for lang tid å hente posisjonen din. Prøv på nytt.',
    },
    searchButton: 'Finn reise',
    placeholder: 'Sted eller adresse',
    assistant: {
      link: 'Reisesøk',
      title: 'Hvor vil du reise?',
      from: 'Fra',
      to: 'Til',
    },
    departure: {
      link: 'Avganger',
      title: 'Hvor vil du reise fra?',
      from: 'Fra',
    },
    searchTime: {
      title: 'Når vil du reise?',
      now: 'Nå',
      arrive: 'Ankomst',
      depart: 'Avreise',
      date: 'Dato',
      time: 'Tid',
    },
  },
  nn: {
    noResults: 'Ingen resultat',
    geoButton: 'Min posisjon',
    geoTexts: {
      denied:
        'Du må endre posisjonsinnstillingane i nettlesaren din for å bruke din posisjon i reisesøket.',
      unavailable: 'Posisjonen din er ikkje tilgjengeleg.',
      timeout: 'Det tok for lang tid å hente posisjonen din. Prøv på nytt.',
    },
    searchButton: 'Finn reise',
    placeholder: 'Stad eller adresse',
    assistant: {
      link: 'Reisesøk',
      title: 'Kor vil du reise?',
      from: 'Frå',
      to: 'Til',
    },
    departure: {
      link: 'Avgangar',
      title: 'Kor vil du reise frå?',
      from: 'Frå',
    },
    searchTime: {
      title: 'Når vil du reise?',
      now: 'No',
      arrive: 'Ankomst',
      depart: 'Avreise',
      date: 'Dato',
      time: 'Tid',
    },
  },
  en: {
    noResults: 'No results',
    geoButton: 'My location',
    geoTexts: {
      denied:
        'You must change location settings in your browser to use your position in the travel search.',
      unavailable: 'Your position is not available.',
      timeout: 'It took too long to retrieve your position. Try again.',
    },
    searchButton: 'Find journey',
    placeholder: 'Location or address',
    assistant: {
      link: 'Journey search',
      title: 'Where do you want to travel?',
      from: 'From',
      to: 'To',
    },
    departure: {
      link: 'Departures',
      title: 'Where do you want to travel from?',
      from: 'From',
    },
    searchTime: {
      title: 'When do you want to travel?',
      now: 'Now',
      arrive: 'Arrival',
      depart: 'Departure',
      date: 'Date',
      time: 'Time',
    },
  },
};

function translations(lang: Languages): Texts {
  return texts[lang];
}
