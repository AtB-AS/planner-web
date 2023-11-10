import style from './widget.module.css';

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
  <form class="${style.form}" action="/assistant" method="GET">
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
              name="from"
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
            <input
              class="${style.search_input} ${style.search_inputLast}"
              aria-autocomplete="list"
              aria-labelledby="downshift-3-label"
              autocomplete="off"
              id="downshift-3-input"
              name="to"
              value=""
            />
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
  document.querySelector('.js-tablist').addEventListener('click', function (e) {
    if (!e.target.closest('a')) return;
    e.preventDefault();
    const tab = e.target.closest('a');
    const href = tab.getAttribute('href');
    const tabpanel = document.querySelector(href.replace('/', '#pw-'));

    // Hide all tabpanels
    document.querySelectorAll('.js-tabpanel').forEach((panel) => {
      panel.classList.add(style.hidden);
    });
    tabpanel.classList.remove(style.hidden);
  });
}

export function init() {
  tabBar();
}
