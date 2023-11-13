import type { AutocompleteApiReturnType } from '@atb/page-modules/departures/client';
import type { GeocoderFeature } from '@atb/page-modules/departures';
import style from './widget.module.css';

import Combobox from '@github/combobox-nav';

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
              <ul id="from-popup-1" hidden></ul>
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
              <ul id="to-popup-1" hidden></ul>
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
    <nav>
      <ul class="${style.tabs} js-tablist">
        <li><a href="/assistant">Planlegg reisen</a></li>
        <li><a href="/departures">Finn avganger</a></li>
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
      tabpanel.classList.remove(style.hidden);
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
        const li = document.createElement('li');
        li.textContent = item.name;
        li.classList.add(style.listItem);
        li.role = 'option';
        li.setAttribute('data-feature-id', item.id);
        list.appendChild(li);
      }

      toggleList(true);
    }, debounceTime);

    input.addEventListener('keydown', (event) => {
      if (['ArrowDown', 'ArrowUp'].includes(event.key) || list.hidden) {
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
