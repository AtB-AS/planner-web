import type { AutocompleteApiReturnType } from '@atb/page-modules/departures/client';
import type { GeocoderFeature } from '@atb/page-modules/departures';
import style from './widget.module.css';

import Combobox from '@github/combobox-nav';

const URL_BASE = import.meta.env.VITE_WIDGET_BASE_URL;

export { URL_BASE };
export const URL_JS_UMD = `${URL_BASE}widget/planner-web.umd.js`;
export const URL_JS_ESM = `${URL_BASE}widget/planner-web.mjs`;
export const URL_CSS = `${URL_BASE}widget/style.css`;

const DEFAULT_DEBOUNCE_TIME = 300;

const html = String.raw;

const buttons = html`
  <div class="${style.buttonGroup}">
    <button type="submit" class="${style.button}" aria-disabled="true">
      <span>Finn avganger</span>
    </button>
  </div>
`;
const searchTime = html`
  <div class="${style.inputBoxes}">
    <p class="${style.heading}">Når vil du reise?</p>
    <div class="${style.selector_departureDateSelector}">
      <div class="${style.selector_options}">
        <label class="${style.selector_option}"
          ><input
            type="radio"
            name="searchTimeSelector"
            aria-label="Nå"
            class="${style.selector_option__input}"
            value="now"
            checked=""
          /><span aria-hidden="true" class="${style.selector_option__label}"
            ><span class="${style.selector_option__text}">Nå</span></span
          ></label
        ><label class="${style.selector_option}"
          ><input
            type="radio"
            name="searchTimeSelector"
            aria-label="Ankomst"
            class="${style.selector_option__input}"
            value="arriveBy"
          /><span aria-hidden="true" class="${style.selector_option__label}"
            ><span class="${style.selector_option__text}">Ankomst</span></span
          ></label
        ><label class="${style.selector_option}"
          ><input
            type="radio"
            name="searchTimeSelector"
            aria-label="Avgang"
            class="${style.selector_option__input}"
            value="departBy"
          /><span aria-hidden="true" class="${style.selector_option__label}"
            ><span class="${style.selector_option__text}">Avgang</span></span
          ></label
        >
      </div>
      <div class="${style.selector_dateAndTimeSelectorsWrapper} ">
        <div class="${style.selector_dateAndTimeSelectors}">
          <div class="${style.selector_dateSelector}">
            <label for="searchTimeSelector-date">Dato</label
            ><input
              type="date"
              id="searchTimeSelector-date"
              value="2023-11-10"
            />
          </div>
          <div class="${style.selector_timeSelector}">
            <label for="searchTimeSelector-time">Tid</label
            ><input type="time" id="searchTimeSelector-time" value="12:19" />
          </div>
        </div>
      </div>
    </div>
  </div>
`;
const assistant = html`
  <form class="${style.form}" action="/assistant" method="get">
    <div class="${style.main}">
      <div class="${style.inputBoxes}">
        <p class="${style.heading}">Hvor vil du reise?</p>
        <div class="${style.search_container}">
          <label
            class="${style.search_label}"
            for="pw-from-1-input"
            id="pw-from-1-label"
            >Fra</label
          >
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
              />
              <ul id="from-popup-1" class="${style.popupContainer}" hidden></ul>
            </pw-autocomplete>
          </div>
          <button
            class="${style.button_geolocation}"
            title="Finn min posisjon"
            aria-label="Finn min posisjon"
            type="button"
          >
            <img
              src="/assets/mono/light/places/City.svg"
              width="20"
              height="20"
              role="none"
              alt=""
            />
          </button>
          <ul
            class="search_menu__b2MHL"
            role="listbox"
            aria-labelledby="downshift-3-label"
            id="downshift-3-menu"
          ></ul>
        </div>
        <div class="${style.search_container}">
          <label
            class="${style.search_label}"
            for="downshift-3-input"
            id="downshift-3-label"
            >Til</label
          >
          <div
            class="${style.search_inputContainer}"
            role="combobox"
            aria-expanded="false"
            aria-haspopup="listbox"
            aria-labelledby="downshift-3-label"
          >
            <pw-autocomplete for="to-popup-1">
              <input
                class="${style.search_input} ${style.search_inputLast}"
                aria-autocomplete="list"
                aria-labelledby="downshift-3-label"
                autocomplete="off"
                id="downshift-3-input"
                name="to"
                value=""
              />
              <ul id="to-popup-1" class="${style.popupContainer}" hidden></ul>
            </pw-autocomplete>
          </div>
          <ul
            class="search_menu__b2MHL"
            role="listbox"
            aria-labelledby="downshift-3-label"
            id="downshift-3-menu"
          ></ul>
        </div>
      </div>
      ${searchTime}
    </div>
    ${buttons}
  </form>
`;
const departures = html`
  <form class="${style.form}">
    <div class="${style.main}">
      <div class="${style.inputBoxes}">
        <p class="${style.heading}">Hvor vil du reise?</p>
        <div class="${style.search_container}">
          <label
            class="${style.search_label}"
            for="downshift-3-input"
            id="downshift-3-label"
            >Fra</label
          >
          <div
            class="${style.search_inputContainer}"
            role="combobox"
            aria-expanded="false"
            aria-haspopup="listbox"
            aria-labelledby="downshift-3-label"
          >
            <input
              class="${style.search_input}"
              aria-autocomplete="list"
              aria-labelledby="downshift-3-label"
              autocomplete="off"
              id="downshift-3-input"
              value=""
            />
          </div>
          <button
            class="${style.button_geolocation}"
            title="Finn min posisjon"
            aria-label="Finn min posisjon"
            type="button"
          >
            <img
              src="/assets/mono/light/places/City.svg"
              width="20"
              height="20"
              role="none"
              alt=""
            />
          </button>
          <ul
            class="search_menu__b2MHL"
            role="listbox"
            aria-labelledby="downshift-3-label"
            id="downshift-3-menu"
          ></ul>
        </div>
      </div>
      ${searchTime}
    </div>
    ${buttons}
  </form>
`;

export const output = html`
  <div class="${style.wrapper}">
    <nav class="${style.nav}">
      <ul class="${style.tabs} js-tablist">
        <li>
          <a
            href="/assistant"
            class="${style.tabSelected}"
            id="pw-assistant-tab"
            >Planlegg reisen</a
          >
        </li>
        <li><a href="/departures" id="pw-departures-tab">Finn avganger</a></li>
      </ul>
    </nav>
    <div class="js-tabpanel" id="pw-assistant">${assistant}</div>
    <div class="js-tabpanel ${style.hidden}" id="pw-departures">
      ${departures}
    </div>
  </div>
`;

function tabBar() {
  document
    .querySelector<HTMLUListElement>('.js-tablist')
    ?.addEventListener('click', function (e) {
      const tab = (e.target as HTMLElement)?.closest('a');

      if (!tab) return;
      const href = tab.getAttribute('href');
      if (!href) return;
      e.preventDefault();
      const tabpanel = document.querySelector(href.replace('/', '#pw-'));
      if (!tabpanel) return;

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

async function autocomplete(q: string) {
  const url = `/api/departures/autocomplete?q=${q}`;
  const result = await fetch(url);

  if (!result.ok) {
    throw new Error(`Error fetching autocomplete data from ${url}`);
  }

  const data = (await result.json()) as AutocompleteApiReturnType;
  return data;
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

export function init() {
  tabBar();

  document.addEventListener('search-selected', function (event) {
    console.log('Selected', event);
  });
}

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

    let combobox = new Combobox(input, list);

    function toggleList(show?: boolean) {
      if (!show) {
        combobox.clearSelection();
        combobox.stop();
      } else {
        combobox.start();
      }

      list.hidden = !show;
    }

    const fetcher = debounce(async (el: HTMLInputElement) => {
      const data = await autocomplete(el.value);

      self.setItems(data);
      list.innerHTML = '';
      for (let item of data) {
        const li = searchItem(item);
        list.appendChild(li);
      }

      toggleList(true);
    }, debounceTime);

    input.addEventListener('keydown', (event) => {
      if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
        toggleList(true);
        combobox.navigate(event.key === 'ArrowDown' ? 1 : -1);
      }

      if (event.key === 'Escape') {
        toggleList(false);
      }
    });
    input.addEventListener('input', (e) => {
      fetcher(e.target as HTMLInputElement);
    });
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
      document.dispatchEvent(
        new CustomEvent('search-selected', {
          bubbles: true,
          detail: {
            key: input.name,
            item: itemId ? self.getItem(itemId) : undefined,
          },
        }),
      );

      list.hidden = true;
      combobox.clearSelection();
      combobox.stop();
    });
  }
}

function searchItem(item: GeocoderFeature) {
  const img = venueIcon(item);
  const title = el('span', [item.name]);
  const locality = el('span', [item.locality ?? ''], style.itemLocality);
  const li = el('li', [img, title, locality], style.listItem);
  li.role = 'option';
  li.setAttribute('data-feature-id', item.id);
  return li;
}

function venueIcon(item: GeocoderFeature) {
  const icon = iconData(item.category);

  // http://localhost:3000/assets/mono/light/transportation-entur/Bus.svg
  const img = el('img');
  img.src = `${URL_BASE}assets/mono/light/${icon.icon}.svg`;
  img.alt = icon.alt;
  img.role = 'img';

  const div = el('div', [img], style.itemIcon);
  div.ariaHidden = 'true';
  return div;
}

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

customElements.define('pw-autocomplete', AutocompleteBox);

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
