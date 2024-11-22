class H {
  constructor(e, n, { tabInsertsSuggestions: i, firstOptionSelectionMode: r, scrollIntoViewOptions: s } = {}) {
    this.input = e, this.list = n, this.tabInsertsSuggestions = i ?? !0, this.firstOptionSelectionMode = r ?? "none", this.scrollIntoViewOptions = s ?? { block: "nearest", inline: "nearest" }, this.isComposing = !1, n.id || (n.id = `combobox-${Math.random().toString().slice(2, 6)}`), this.ctrlBindings = !!navigator.userAgent.match(/Macintosh/), this.keyboardEventHandler = (c) => W(c, this), this.compositionEventHandler = (c) => N(c, this), this.inputHandler = this.clearSelection.bind(this), e.setAttribute("role", "combobox"), e.setAttribute("aria-controls", n.id), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-autocomplete", "list"), e.setAttribute("aria-haspopup", "listbox");
  }
  destroy() {
    this.clearSelection(), this.stop(), this.input.removeAttribute("role"), this.input.removeAttribute("aria-controls"), this.input.removeAttribute("aria-expanded"), this.input.removeAttribute("aria-autocomplete"), this.input.removeAttribute("aria-haspopup");
  }
  start() {
    this.input.setAttribute("aria-expanded", "true"), this.input.addEventListener("compositionstart", this.compositionEventHandler), this.input.addEventListener("compositionend", this.compositionEventHandler), this.input.addEventListener("input", this.inputHandler), this.input.addEventListener("keydown", this.keyboardEventHandler), this.list.addEventListener("mousedown", C), this.resetSelection();
  }
  stop() {
    this.clearSelection(), this.input.setAttribute("aria-expanded", "false"), this.input.removeEventListener("compositionstart", this.compositionEventHandler), this.input.removeEventListener("compositionend", this.compositionEventHandler), this.input.removeEventListener("input", this.inputHandler), this.input.removeEventListener("keydown", this.keyboardEventHandler), this.list.removeEventListener("mousedown", C);
  }
  indicateDefaultOption() {
    var e;
    this.firstOptionSelectionMode === "active" ? (e = Array.from(this.list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')).filter(T)[0]) === null || e === void 0 || e.setAttribute("data-combobox-option-default", "true") : this.firstOptionSelectionMode === "selected" && this.navigate(1);
  }
  navigate(e = 1) {
    const n = Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter(T)[0], i = Array.from(this.list.querySelectorAll('[role="option"]')).filter(T), r = i.indexOf(n);
    if (r === i.length - 1 && e === 1 || r === 0 && e === -1) {
      this.clearSelection(), this.input.focus();
      return;
    }
    let s = e === 1 ? 0 : i.length - 1;
    if (n && r >= 0) {
      const m = r + e;
      m >= 0 && m < i.length && (s = m);
    }
    const c = i[s];
    if (c)
      for (const m of i)
        m.removeAttribute("data-combobox-option-default"), c === m ? (this.input.setAttribute("aria-activedescendant", c.id), c.setAttribute("aria-selected", "true"), x(c), c.scrollIntoView(this.scrollIntoViewOptions)) : m.removeAttribute("aria-selected");
  }
  clearSelection() {
    this.input.removeAttribute("aria-activedescendant");
    for (const e of this.list.querySelectorAll('[aria-selected="true"], [data-combobox-option-default="true"]'))
      e.removeAttribute("aria-selected"), e.removeAttribute("data-combobox-option-default");
  }
  resetSelection() {
    this.clearSelection(), this.indicateDefaultOption();
  }
}
function W(t, e) {
  if (!(t.shiftKey || t.metaKey || t.altKey) && !(!e.ctrlBindings && t.ctrlKey) && !e.isComposing)
    switch (t.key) {
      case "Enter":
        I(e.input, e.list) && t.preventDefault();
        break;
      case "Tab":
        e.tabInsertsSuggestions && I(e.input, e.list) && t.preventDefault();
        break;
      case "Escape":
        e.clearSelection();
        break;
      case "ArrowDown":
        e.navigate(1), t.preventDefault();
        break;
      case "ArrowUp":
        e.navigate(-1), t.preventDefault();
        break;
      case "n":
        e.ctrlBindings && t.ctrlKey && (e.navigate(1), t.preventDefault());
        break;
      case "p":
        e.ctrlBindings && t.ctrlKey && (e.navigate(-1), t.preventDefault());
        break;
      default:
        if (t.ctrlKey)
          break;
        e.resetSelection();
    }
}
function C(t) {
  if (!(t.target instanceof Element))
    return;
  const e = t.target.closest('[role="option"]');
  e && e.getAttribute("aria-disabled") !== "true" && M(e, { event: t });
}
function I(t, e) {
  const n = e.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');
  return n ? (n.getAttribute("aria-disabled") === "true" || M(n), !0) : !1;
}
function M(t, e) {
  t.dispatchEvent(new CustomEvent("combobox-commit", { bubbles: !0, detail: e }));
}
function x(t) {
  t.dispatchEvent(new Event("combobox-select", { bubbles: !0 }));
}
function T(t) {
  return !t.hidden && !(t instanceof HTMLInputElement && t.type === "hidden") && (t.offsetWidth > 0 || t.offsetHeight > 0);
}
function N(t, e) {
  e.isComposing = t.type === "compositionstart", document.getElementById(e.input.getAttribute("aria-controls") || "") && e.clearSelection();
}
const R = "theme-module__light", G = '"../page-modules/assistant/assistant.module.css"', K = '"../page-modules/departures/departures.module.css"', U = '"../components/search/search.module.css"', V = '"../modules/search-time/selector/selector.module.css"', Q = '"../components/button/button.module.css"', J = "widget-module__hidden", Y = "widget-module__lightWrapper theme-module__light", z = "widget-module__wrapper theme-module__override-light", X = "widget-module__form assistant-module__container", Z = "widget-module__nav", ee = "widget-module__tabs", te = "widget-module__tabSelected", oe = "widget-module__main assistant-module__main", ne = "widget-module__heading assistant-module__heading", ie = "widget-module__inputBoxes", re = "widget-module__search_container search-module__container", se = "widget-module__search_inputContainer search-module__inputContainer", ae = "widget-module__search_label search-module__label typography-module__typo-body__secondary", le = "widget-module__search_input search-module__input", ce = "widget-module__search_inputLast", ue = "widget-module__button_geolocation departures-module__geolocationButton", de = "widget-module__selector_group selector-module__departureDateSelector", pe = "widget-module__selector_options selector-module__options", me = "widget-module__selector_options__small selector-module__options", he = "widget-module__selector_option selector-module__option", _e = "widget-module__selector_option__text selector-module__option__text", ge = "widget-module__selector_option__label selector-module__option__label", fe = "widget-module__selector_option__input selector-module__option__input", be = "widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper", ve = "widget-module__selector_dateAndTimeSelectorsWrapper__hidden", we = "widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors", ye = "widget-module__selector_dateSelector selector-module__dateSelector", $e = "widget-module__selector_timeSelector selector-module__timeSelector", Se = "widget-module__buttonGroup", Ee = "widget-module__button", Te = "widget-module__buttonLightOutline", Le = "widget-module__listItem", Ae = "widget-module__itemIcon", ke = "widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary", Ce = "widget-module__popupContainer search-module__menu", Ie = "widget-module__messageBox", De = "widget-module__inheritFont", Me = "widget-module__singleColumnLayout", o = {
  "override-light": "theme-module__override-light",
  light: R,
  assistant: G,
  departures: K,
  search: U,
  selector: V,
  buttonComponent: Q,
  hidden: J,
  lightWrapper: Y,
  wrapper: z,
  form: X,
  nav: Z,
  tabs: ee,
  tabSelected: te,
  main: oe,
  heading: ne,
  inputBoxes: ie,
  search_container: re,
  search_inputContainer: se,
  search_label: ae,
  search_input: le,
  search_inputLast: ce,
  button_geolocation: ue,
  selector_group: de,
  selector_options: pe,
  selector_options__small: me,
  selector_option: he,
  selector_option__text: _e,
  selector_option__label: ge,
  selector_option__input: fe,
  selector_dateAndTimeSelectorsWrapper: be,
  selector_dateAndTimeSelectorsWrapper__hidden: ve,
  selector_dateAndTimeSelectors: we,
  selector_dateSelector: ye,
  selector_timeSelector: $e,
  buttonGroup: Se,
  button: Ee,
  buttonLightOutline: Te,
  "button--disabled": "widget-module__button--disabled",
  listItem: Le,
  itemIcon: Ae,
  itemLocality: ke,
  popupContainer: Ce,
  messageBox: Ie,
  inheritFont: De,
  singleColumnLayout: Me
};
function Oe(t) {
  return Object.entries(t).reduce(function(e, n) {
    return n[1] ? e + " " + n[0] : e;
  }, "");
}
var O = { MODULE_VERSION: "2.27.0", COMPRESSED_ORG: "C4Jw9gtgzkA", ORG_ID: "troms" };
const Be = 300, y = String.raw, L = O.MODULE_VERSION, A = O.COMPRESSED_ORG;
function je(t) {
  if (!(t != null && t.startsWith("http")))
    throw new Error("Missing urlBase in correct schema.");
  return t.endsWith("/") || (t += "/"), {
    URL_BASE: t,
    URL_JS_UMD: `${t}widget/${A}/${L}/planner-web.umd.js`,
    URL_JS_ESM: `${t}widget/${A}/${L}/planner-web.mjs`,
    URL_CSS: `${t}widget/${A}/${L}/planner-web.css`
  };
}
function ot({
  urlBase: t,
  language: e = "en",
  outputOverrideOptions: n = {}
}) {
  const i = et(e), r = je(t), s = {
    inheritFont: !1,
    singleColumnLayout: !1,
    ...n
  };
  return {
    output: He(r, i, s),
    init: Fe,
    urls: r
  };
}
function Fe() {
  var e, n;
  We(), D("pw-assistant"), D("pw-departures");
  let t = {
    from: void 0,
    to: void 0
  };
  document.addEventListener("search-selected", function(i) {
    const r = i;
    t[r.detail.key] = r.detail.item;
  }), document.addEventListener("reset-search", function() {
    t = {
      from: void 0,
      to: void 0
    }, document.querySelectorAll(
      'input[name="from"], input[name="to"]'
    ).forEach((i) => {
      i.value = "";
    });
  }), document.querySelectorAll("[name$=searchTimeSelector]").forEach(function(i) {
    i.addEventListener("change", function(r) {
      const c = r.currentTarget.value === "now";
      document.querySelectorAll(".js-search-date-details").forEach((m) => {
        m.hidden = c;
      });
    });
  }), (e = document.querySelector("#pw-form-departures")) == null || e.addEventListener("submit", (i) => {
    i.preventDefault();
    const r = i.currentTarget;
    qe(r, t.from);
  }), (n = document.querySelector("#pw-form-assistant")) == null || n.addEventListener("submit", (i) => {
    i.preventDefault();
    const r = i.currentTarget;
    Pe(r, t.from, t.to);
  });
}
function D(t) {
  const e = document.querySelector(
    `#${t}-searchTimeSelector-date`
  ), n = document.querySelector(
    `#${t}-searchTimeSelector-time`
  );
  try {
    if (e && (e.valueAsDate = /* @__PURE__ */ new Date()), n) {
      const i = /* @__PURE__ */ new Date(), r = String(i.getHours()).padStart(2, "0"), s = String(i.getMinutes()).padStart(2, "0");
      n.value = `${r}:${s}`;
    }
  } catch {
  }
}
function B(t, e) {
  const n = t.get(`${e}-searchTimeSelector`);
  if (n === "now")
    return {
      mode: "now"
    };
  {
    const i = t.get("dateinput"), r = t.get("timeinput");
    if (i && r) {
      const s = /* @__PURE__ */ new Date(`${i}T${r}`);
      return {
        mode: n == "arriveBy" ? "arriveBy" : "departBy",
        dateTime: s.getTime()
      };
    }
    return {
      mode: "now"
    };
  }
}
function Pe(t, e, n) {
  const i = t.action, r = B(new FormData(t), "pw-assistant"), s = Ve({ from: e, to: n }, r), c = new URLSearchParams(s);
  window.location.href = `${i}?${c.toString()}`;
}
function qe(t, e) {
  const n = t.action, i = B(new FormData(t), "pw-departures"), r = Qe(i, e), s = new URLSearchParams(r);
  (e == null ? void 0 : e.layer) === "venue" ? window.location.href = `${n}/${e.id}?${s.toString()}` : window.location.href = `${n}?${s.toString()}`;
}
class E extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const e = this;
    e.hidden = !0, e.classList.add(o.messageBox), document.addEventListener("pw-errorMessage", function(n) {
      const i = n;
      e.textContent = i.detail.message, e.hidden = !1;
    }), document.addEventListener("pw-errorMessage-clear", function(n) {
      e.hidden = !0;
    }), e.addEventListener("click", function() {
      E.clearMessageBox();
    });
  }
  static clearMessageBox() {
    document.dispatchEvent(
      new CustomEvent("pw-errorMessage-clear", {
        bubbles: !0
      })
    );
  }
}
function He({ URL_BASE: t }, e, n) {
  function i(a) {
    const u = s(a), h = v("span", [a.name]), d = v("span", [a.locality ?? ""], o.itemLocality), l = v("li", [u, h, d], o.listItem);
    return l.role = "option", l.setAttribute("data-feature-id", a.id), l;
  }
  function r(a) {
    const u = v("span", [a]);
    return v("li", [u], o.listItem);
  }
  function s(a) {
    const u = Re(a.category), h = v("img");
    h.src = `${t}assets/mono/light/${u.icon}.svg`, h.alt = u.alt, h.role = "img";
    const d = v("div", [h], o.itemIcon);
    return d.ariaHidden = "true", d;
  }
  class c extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const u = this;
      this.querySelector("button").addEventListener("click", async () => {
        var d;
        E.clearMessageBox();
        try {
          const l = await ze(t, e), g = (d = u.parentElement) == null ? void 0 : d.querySelector("input");
          g && (g.value = l ? `${l.name}, ${l.locality}` : g.value), document.dispatchEvent(
            new CustomEvent("search-selected", {
              bubbles: !0,
              detail: {
                key: "from",
                item: l
              }
            })
          );
        } catch (l) {
          l instanceof Error && document.dispatchEvent(
            new CustomEvent("pw-errorMessage", {
              bubbles: !0,
              detail: {
                message: l.message
              }
            })
          );
        }
      });
    }
  }
  customElements.define("pw-geobutton", c), customElements.define("pw-messagebox", E);
  class m extends HTMLElement {
    constructor() {
      super(), this.dataList = {};
    }
    getItem(u) {
      return this.dataList[u];
    }
    setItems(u) {
      this.dataList = {};
      for (let h of u)
        this.dataList[h.id] = h;
    }
    connectedCallback() {
      const u = this, h = Ne(
        this.getAttribute("data-debounce-ms"),
        Be
      ), d = this.querySelector("input"), l = this.querySelector(
        "#" + this.getAttribute("for")
      );
      let g = new H(d, l, {
        tabInsertsSuggestions: !0,
        scrollIntoViewOptions: !1
      });
      function w(p) {
        p ? g.start() : (g.clearSelection(), g.stop()), l.hidden = !p;
      }
      function k() {
        u.setItems([]), l.innerHTML = "";
        const p = r(e.noResults);
        l.appendChild(p), w(!0);
      }
      const q = xe(async (p) => {
        try {
          if (!p.value) {
            l.innerHTML = "";
            return;
          }
          const f = await Je(t, p.value);
          if (f.length === 0)
            return k();
          u.setItems(f), l.innerHTML = "";
          for (let b of f) {
            const S = i(b);
            l.appendChild(S);
          }
          w(!0);
        } catch {
          k();
        }
      }, h);
      d.addEventListener("keydown", (p) => {
        p.key === "Escape" && w(!1);
      }), d.addEventListener(
        "input",
        (p) => q(p.target)
      ), d.addEventListener("focus", () => w(!0)), d.addEventListener("blur", () => w(!1)), document.addEventListener("click", (p) => {
        j(p.target, this) || w(!1);
      }), l.addEventListener("combobox-commit", function(p) {
        const f = p.target.getAttribute(
          "data-feature-id"
        ), b = f ? u.getItem(f) : void 0;
        let S = d.value;
        b && (S = `${b.name}`, b.locality && (S += `, ${b.locality}`)), d.value = S, document.dispatchEvent(
          new CustomEvent("search-selected", {
            bubbles: !0,
            detail: {
              key: d.name,
              item: b
            }
          })
        ), l.hidden = !0, g.clearSelection(), g.stop();
      });
    }
  }
  customElements.define("pw-autocomplete", m);
  const $ = y`
    <div class="${o.buttonGroup}">
      <button
        type="submit"
        class="${o.button}"
      >
        <span>${e.searchButton}</span>
      </button>
    </div>
  `, _ = (a, u = !0) => y`
    <fieldset class="${o.inputBoxes}">
      <legend class="${o.heading}">${e.searchTime.title}</legend>
      <div>
        <div
          class="${o.selector_options} ${u ? "" : o.selector_options__small}"
        >
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="${a}-searchTimeSelector"
              class="${o.selector_option__input}"
              value="now"
              checked=""
            />
            <span class="${o.selector_option__label}">
              <span class="${o.selector_option__text}" id="${a}-now">
                ${e.searchTime.now}
              </span>
            </span>
          </label>
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="${a}-searchTimeSelector"
              class="${o.selector_option__input}"
              value="departBy"
            />
            <span class="${o.selector_option__label}">
              <span
                class="${o.selector_option__text}"
                id="${a}-depart"
              >
                ${e.searchTime.depart}
              </span>
            </span>
          </label>
          ${u ? y`
                <label class="${o.selector_option}">
                  <input
                    type="radio"
                    name="${a}-searchTimeSelector"
                    class="${o.selector_option__input}"
                    value="arriveBy"
                  />
                  <span class="${o.selector_option__label}">
                    <span
                      class="${o.selector_option__text}"
                      id="${a}-arrival"
                    >
                      ${e.searchTime.arrive}
                    </span>
                  </span>
                </label>
              ` : ""}
        </div>
        <div
          class="${o.selector_dateAndTimeSelectorsWrapper} js-search-date-details"
          hidden
        >
          <div class="${o.selector_dateAndTimeSelectors}">
            <div class="${o.selector_dateSelector}">
              <label for="${`${a}-searchTimeSelector-date`}">
                ${e.searchTime.date}
              </label>
              <input
                type="date"
                name="dateinput"
                id="${`${a}-searchTimeSelector-date`}"
              />
            </div>
            <div class="${o.selector_timeSelector}">
              <label for="${`${a}-searchTimeSelector-time`}">
                ${e.searchTime.time}
              </label>
              <input
                type="time"
                name="timeinput"
                step="60"
                id="${`${a}-searchTimeSelector-time`}"
              />
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  `, F = y`
    <form
      class="${o.form}"
      action="${t}/assistant"
      id="pw-form-assistant"
      method="get"
    >
      <div class="${o.main}">
        <fieldset class="${o.inputBoxes}">
          <legend class="${o.heading}">${e.assistant.title}</legend>
          <div class="${o.search_container}">
            <label
              class="${o.search_label}"
              for="pw-from-1-input"
              id="pw-from-1-label"
            >
              ${e.assistant.from}
            </label>
            <div
              class="${o.search_inputContainer}"
              aria-haspopup="listbox"
              aria-labelledby="pw-from-1-label"
            >
              <pw-autocomplete for="from-popup-1">
                <input
                  class="${o.search_input}"
                  aria-expanded="false"
                  aria-autocomplete="list"
                  autocomplete="off"
                  id="pw-from-1-input"
                  name="from"
                  value=""
                  placeholder="${e.placeholder}"
                />
                <ul
                  id="from-popup-1"
                  role="listbox"
                  aria-labelledby="pw-from-1-label"
                  class="${o.popupContainer}"
                  hidden
                ></ul>
              </pw-autocomplete>
            </div>
            <pw-geobutton mode="assistant">
              <button
                class="${o.button_geolocation}"
                title="${e.geoButton}"
                aria-label="${e.geoButton}"
                type="button"
              >
                <img
                  src="${t}/assets/mono/light/places/Location.svg"
                  width="20"
                  height="20"
                  role="none"
                  alt=""
                />
              </button>
            </pw-geobutton>
          </div>
          <pw-messagebox></pw-messagebox>
          <div class="${o.search_container}">
            <label
              class="${o.search_label}"
              for="pw-to-1-input"
              id="pw-to-1-label"
            >
              ${e.assistant.to}
            </label>
            <div
              class="${o.search_inputContainer}"
              aria-haspopup="listbox"
              aria-labelledby="pw-to-1-label"
            >
              <pw-autocomplete for="to-popup-1">
                <input
                  class="${o.search_input} ${o.search_inputLast}"
                  aria-expanded="false"
                  aria-autocomplete="list"
                  autocomplete="off"
                  id="pw-to-1-input"
                  name="to"
                  value=""
                  placeholder="${e.placeholder}"
                />
                <ul
                  id="to-popup-1"
                  role="listbox"
                  aria-labelledby="pw-to-1-label"
                  class="${o.popupContainer}"
                  hidden
                ></ul>
              </pw-autocomplete>
            </div>
          </div>
        </fieldset>
        ${_("pw-assistant")}
      </div>
      ${$}
    </form>
  `, P = y`
    <form
      class="${o.form}"
      action="${t}/departures"
      id="pw-form-departures"
      method="get"
    >
      <div class="${o.main}">
        <fieldset class="${o.inputBoxes}">
          <legend class="${o.heading}">${e.departure.title}</legend>
          <div class="${o.search_container}">
            <label
              class="${o.search_label}"
              for="pw-from-2-input"
              id="pw-from-2-label"
            >
              ${e.departure.from}
            </label>
            <div
              class="${o.search_inputContainer}"
              aria-expanded="false"
              aria-haspopup="listbox"
              aria-labelledby="pw-from-2-label"
            >
              <pw-autocomplete for="to-popup-2">
                <input
                  class="${o.search_input}"
                  aria-autocomplete="list"
                  aria-labelledby="pw-from-2-label"
                  autocomplete="off"
                  name="from"
                  id="pw-from-2-input"
                  value=""
                  placeholder="${e.placeholder}"
                />
                <ul
                  id="to-popup-2"
                  role="listbox"
                  aria-labelledby="pw-from-2-label"
                  class="${o.popupContainer}"
                  hidden
                ></ul>
              </pw-autocomplete>
            </div>
            <pw-geobutton mode="departure">
              <button
                class="${o.button_geolocation}"
                title="${e.geoButton}"
                aria-label="${e.geoButton}"
                type="button"
              >
                <img
                  src="${t}/assets/mono/light/places/Location.svg"
                  width="20"
                  height="20"
                  role="none"
                  alt=""
                />
              </button>
            </pw-geobutton>
          </div>
          <pw-messagebox></pw-messagebox>
        </fieldset>
        ${_("pw-departures", !1)}
      </div>
      ${$}
    </form>
  `;
  return y`
    <div
      class="${Oe({
    [o.wrapper]: !0,
    [o.lightWrapper]: !0,
    [o.inheritFont]: n.inheritFont ?? !1,
    [o.singleColumnLayout]: n.singleColumnLayout ?? !1
  })}"
    >
      <nav class="${o.nav}">
        <ul class="${o.tabs} js-tablist">
          <li>
            <a
              href="/assistant"
              class="${o.tabSelected}"
              id="pw-assistant-tab"
              data-mode="assistant"
            >
              ${e.assistant.link}
            </a>
          </li>
          <li>
            <a href="/departures" id="pw-departures-tab" data-mode="departures">
              ${e.departure.link}
            </a>
          </li>
        </ul>
      </nav>
      <div class="js-tabpanel" id="pw-assistant">${F}</div>
      <div class="js-tabpanel ${o.hidden}" id="pw-departures">
        ${P}
      </div>
    </div>
  `;
}
function We() {
  var t;
  (t = document.querySelector(".js-tablist")) == null || t.addEventListener("click", function(e) {
    var m, $;
    e.preventDefault();
    const n = (m = e.target) == null ? void 0 : m.closest("a");
    if (!n) return;
    const i = n.getAttribute("data-mode");
    if (!i) return;
    const r = document.querySelector("#pw-" + i);
    if (!r) return;
    E.clearMessageBox(), document.querySelectorAll(".js-tabpanel").forEach((_) => {
      _.classList.add(o.hidden);
    }), document.querySelectorAll(".js-tablist a").forEach((_) => {
      _.classList.remove(o.tabSelected);
    }), r.classList.remove(o.hidden), n.classList.add(o.tabSelected);
    const s = document.querySelectorAll(
      `input[type="radio"][name="pw-${i}-searchTimeSelector"]`
    ), c = ($ = Array.from(s).find(
      (_) => _.checked
    )) == null ? void 0 : $.value;
    document.querySelectorAll(".js-search-date-details").forEach((_) => {
      _.hidden = c === "now";
    }), document.dispatchEvent(
      new CustomEvent("reset-search", {
        bubbles: !0
      })
    );
  });
}
function xe(t, e) {
  let n = null;
  return function(...i) {
    clearTimeout(n), n = setTimeout(() => {
      t(...i);
    }, e);
  };
}
function v(t, e = [], n = "") {
  const i = document.createElement(t);
  if (Array.isArray(e))
    for (let r of e) {
      let s = typeof r == "string" ? document.createTextNode(r) : r;
      i.appendChild(s);
    }
  return i.className = n, i;
}
function Ne(t, e) {
  const n = parseInt(t, 10);
  return Number.isNaN(n) ? e : n;
}
function j(t, e) {
  return t === e ? !0 : !t || !t.parentElement ? !1 : j(t.parentElement, e);
}
function Re(t) {
  switch (Ge(t)[0]) {
    case "bus":
      return { icon: "transportation-entur/Bus", alt: "bus" };
    case "tram":
      return { icon: "transportation-entur/Tram", alt: "tram" };
    case "rail":
      return { icon: "transportation-entur/Train", alt: "rail" };
    case "airport":
      return { icon: "transportation-entur/Plane", alt: "air" };
    case "boat":
      return { icon: "transportation-entur/Ferry", alt: "water" };
    case "unknown":
    default:
      return { icon: "map/Pin", alt: "unknown" };
  }
}
function Ge(t) {
  return t.map(Ke).filter((e, n, i) => i.indexOf(e) === n);
}
function Ke(t) {
  switch (t) {
    case "onstreetBus":
    case "busStation":
    case "coachStation":
      return "bus";
    case "onstreetTram":
    case "tramStation":
      return "tram";
    case "railStation":
    case "metroStation":
      return "rail";
    case "airport":
      return "airport";
    case "harbourPort":
    case "ferryPort":
    case "ferryStop":
      return "boat";
    default:
      return "unknown";
  }
}
function Ue(t, e) {
  if (!t) return {};
  const n = e ? {
    toId: e.id,
    toLon: e.geometry.coordinates[0].toString(),
    toLat: e.geometry.coordinates[1].toString(),
    toLayer: e.layer
  } : void 0;
  return {
    fromId: t.id,
    fromLon: t.geometry.coordinates[0].toString(),
    fromLat: t.geometry.coordinates[1].toString(),
    fromLayer: t.layer,
    ...n
  };
}
function Ve(t, e) {
  const n = e.mode !== "now" ? {
    searchMode: e.mode,
    searchTime: e.dateTime.toString()
  } : { searchMode: e.mode }, i = Ue(
    t.from,
    t.to
  );
  return {
    ...n,
    ...i
  };
}
function Qe(t, e) {
  const n = t.mode !== "now" ? {
    searchMode: t.mode,
    searchTime: t.dateTime.toString()
  } : { searchMode: t.mode };
  return !e || e.layer == "venue" ? {
    ...n
  } : {
    ...n,
    lon: e.geometry.coordinates[0].toString(),
    lat: e.geometry.coordinates[1].toString()
  };
}
async function Je(t, e) {
  const n = `${t}api/departures/autocomplete?q=${e}`, i = await fetch(n);
  if (!i.ok)
    throw new Error(`Error fetching autocomplete data from ${n}`);
  return await i.json();
}
async function Ye(t, e) {
  const i = await (await fetch(
    `${t}api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`
  )).json();
  if (i)
    return i;
}
async function ze(t, e) {
  return new Promise(function(n, i) {
    navigator.geolocation.getCurrentPosition(
      async (r) => {
        const s = await Ye(t, r.coords);
        n(s);
      },
      (r) => {
        i(new Error(Xe(r.code, e)));
      },
      { enableHighAccuracy: !0, timeout: 1e4 }
    );
  });
}
function Xe(t, e) {
  switch (t) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return e.geoTexts.denied;
    case GeolocationPositionError.TIMEOUT:
      return e.geoTexts.timeout;
    case GeolocationPositionError.POSITION_UNAVAILABLE:
    default:
      return e.geoTexts.unavailable;
  }
}
const Ze = {
  nb: {
    noResults: "Ingen resultater",
    geoButton: "Finn min posisjon",
    geoTexts: {
      denied: "Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.",
      unavailable: "Posisjonen din er ikke tilgjengelig.",
      timeout: "Det tok for lang tid å hente posisjonen din. Prøv på nytt."
    },
    searchButton: "Finn avganger",
    placeholder: "adresse, kai eller holdeplass",
    assistant: {
      link: "Planlegg reisen",
      title: "Hvor vil du reise?",
      from: "Fra",
      to: "Til"
    },
    departure: {
      link: "Avganger",
      title: "Hvor vil du reise fra?",
      from: "Fra"
    },
    searchTime: {
      title: "Når vil du reise?",
      now: "Nå",
      arrive: "Ankomst",
      depart: "Avreise",
      date: "Dato",
      time: "Tid"
    }
  },
  nn: {
    noResults: "Ingen resultat",
    geoButton: "Finn min posisjon",
    geoTexts: {
      denied: "Du må endre posisjonsinnstillingane i nettlesaren din for å bruke din posisjon i reisesøket.",
      unavailable: "Posisjonen din er ikkje tilgjengeleg.",
      timeout: "Det tok for lang tid å hente posisjonen din. Prøv på nytt."
    },
    searchButton: "Finn avgangar",
    placeholder: "adresse, kai eller haldeplass",
    assistant: {
      link: "Planlegg reisa",
      title: "Kor vil du reise?",
      from: "Frå",
      to: "Til"
    },
    departure: {
      link: "Avgangar",
      title: "Kor vil du reise frå?",
      from: "Frå"
    },
    searchTime: {
      title: "Når vil du reise?",
      now: "No",
      arrive: "Ankomst",
      depart: "Avreise",
      date: "Dato",
      time: "Tid"
    }
  },
  en: {
    noResults: "No results",
    geoButton: "Find my position",
    geoTexts: {
      denied: "You must change location settings in your browser to use your position in the travel search.",
      unavailable: "Your position is not available.",
      timeout: "It took too long to retrieve your position. Try again."
    },
    searchButton: "Find departures",
    placeholder: "address, quay, or stop",
    assistant: {
      link: "Plan your journey",
      title: "Where do you want to travel?",
      from: "From",
      to: "To"
    },
    departure: {
      link: "Departures",
      title: "Where do you want to travel from?",
      from: "From"
    },
    searchTime: {
      title: "When do you want to travel?",
      now: "Now",
      arrive: "Arrival",
      depart: "Departure",
      date: "Date",
      time: "Time"
    }
  }
};
function et(t) {
  return Ze[t];
}
export {
  ot as createWidget,
  Ye as reverse
};
