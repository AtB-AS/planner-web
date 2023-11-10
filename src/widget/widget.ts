import style from './widget.module.css';

const html = String.raw;

export const output = html`
  <div class="${style.wrapper}">
    <form class="${style.form}">
      <div class="${style.main}">
        <div>
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
        <div>
          <p class="${style.heading}">Når vil du reise?</p>
          <div class="departure-date-selector_departureDateSelector__Fi7tg">
            <div class="departure-date-selector_options__yYoHr">
              <label class="departure-date-selector_option__LWD0K"
                ><input
                  type="radio"
                  name="departureDateSelector"
                  aria-label="Nå"
                  class="departure-date-selector_option__input___RIte"
                  checked=""
                  value="now"
                /><span
                  aria-hidden="true"
                  class="departure-date-selector_option__label__dkaL_"
                  ><span
                    class="departure-date-selector_option__selected__AiilZ"
                    style="opacity: 1"
                  ></span
                  ><span class="departure-date-selector_option__text__2UuXR"
                    >Nå</span
                  ></span
                ></label
              ><label class="departure-date-selector_option__LWD0K"
                ><input
                  type="radio"
                  name="departureDateSelector"
                  aria-label="Ankomst"
                  class="departure-date-selector_option__input___RIte"
                  value="arrival"
                /><span
                  aria-hidden="true"
                  class="departure-date-selector_option__label__dkaL_"
                  ><span class="departure-date-selector_option__text__2UuXR"
                    >Ankomst</span
                  ></span
                ></label
              ><label class="departure-date-selector_option__LWD0K"
                ><input
                  type="radio"
                  name="departureDateSelector"
                  aria-label="Avgang"
                  class="departure-date-selector_option__input___RIte"
                  value="departure"
                /><span
                  aria-hidden="true"
                  class="departure-date-selector_option__label__dkaL_"
                  ><span class="departure-date-selector_option__text__2UuXR"
                    >Avgang</span
                  ></span
                ></label
              >
            </div>
          </div>
        </div>
      </div>
      <div class="departures_buttons__vDSTI">
        <button
          type="button"
          class="button_button__TIoc7 typography_typo-body__primary__kiR5z button_button--interactive_2__3dbxX button_button--size_small__ekxO4 button_button--radius_top-bottom__qd_4d button_button--radius_top-bottom__qd_4d departures_button__l2h50"
          aria-disabled="false"
        >
          <span class="button_button__text__I8D_Z">Flere valg</span
          ><img
            src="/assets/mono/light/actions/Adjust.svg"
            width="20"
            height="20"
            role="none"
            alt=""
          /></button
        ><button
          type="submit"
          class="button_button__TIoc7 typography_typo-body__primary__kiR5z button_button--interactive_0__WdcFs button_button--disabled__2zVrc button_button--size_small__ekxO4 button_button--radius_top-bottom__qd_4d button_button--radius_top-bottom__qd_4d departures_button__l2h50"
          disabled=""
          aria-disabled="true"
        >
          <span class="button_button__text__I8D_Z">Finn avganger</span>
        </button>
      </div>
    </form>
  </div>
`;
