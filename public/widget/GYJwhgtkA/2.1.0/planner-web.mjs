class H {
  constructor(e, n, { tabInsertsSuggestions: i, defaultFirstOption: a, scrollIntoViewOptions: c } = {}) {
    this.input = e, this.list = n, this.tabInsertsSuggestions = i ?? !0, this.defaultFirstOption = a ?? !1, this.scrollIntoViewOptions = c, this.isComposing = !1, n.id || (n.id = `combobox-${Math.random().toString().slice(2, 6)}`), this.ctrlBindings = !!navigator.userAgent.match(/Macintosh/), this.keyboardEventHandler = (l) => x(l, this), this.compositionEventHandler = (l) => N(l, this), this.inputHandler = this.clearSelection.bind(this), e.setAttribute("role", "combobox"), e.setAttribute("aria-controls", n.id), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-autocomplete", "list"), e.setAttribute("aria-haspopup", "listbox");
  }
  destroy() {
    this.clearSelection(), this.stop(), this.input.removeAttribute("role"), this.input.removeAttribute("aria-controls"), this.input.removeAttribute("aria-expanded"), this.input.removeAttribute("aria-autocomplete"), this.input.removeAttribute("aria-haspopup");
  }
  start() {
    this.input.setAttribute("aria-expanded", "true"), this.input.addEventListener("compositionstart", this.compositionEventHandler), this.input.addEventListener("compositionend", this.compositionEventHandler), this.input.addEventListener("input", this.inputHandler), this.input.addEventListener("keydown", this.keyboardEventHandler), this.list.addEventListener("click", L), this.indicateDefaultOption();
  }
  stop() {
    this.clearSelection(), this.input.setAttribute("aria-expanded", "false"), this.input.removeEventListener("compositionstart", this.compositionEventHandler), this.input.removeEventListener("compositionend", this.compositionEventHandler), this.input.removeEventListener("input", this.inputHandler), this.input.removeEventListener("keydown", this.keyboardEventHandler), this.list.removeEventListener("click", L);
  }
  indicateDefaultOption() {
    var e;
    this.defaultFirstOption && ((e = Array.from(this.list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')).filter(S)[0]) === null || e === void 0 || e.setAttribute("data-combobox-option-default", "true"));
  }
  navigate(e = 1) {
    const n = Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter(S)[0], i = Array.from(this.list.querySelectorAll('[role="option"]')).filter(S), a = i.indexOf(n);
    if (a === i.length - 1 && e === 1 || a === 0 && e === -1) {
      this.clearSelection(), this.input.focus();
      return;
    }
    let c = e === 1 ? 0 : i.length - 1;
    if (n && a >= 0) {
      const d = a + e;
      d >= 0 && d < i.length && (c = d);
    }
    const l = i[c];
    if (l)
      for (const d of i)
        d.removeAttribute("data-combobox-option-default"), l === d ? (this.input.setAttribute("aria-activedescendant", l.id), l.setAttribute("aria-selected", "true"), W(l), l.scrollIntoView(this.scrollIntoViewOptions)) : d.removeAttribute("aria-selected");
  }
  clearSelection() {
    this.input.removeAttribute("aria-activedescendant");
    for (const e of this.list.querySelectorAll('[aria-selected="true"]'))
      e.removeAttribute("aria-selected");
    this.indicateDefaultOption();
  }
}
function x(t, e) {
  if (!(t.shiftKey || t.metaKey || t.altKey) && !(!e.ctrlBindings && t.ctrlKey) && !e.isComposing)
    switch (t.key) {
      case "Enter":
        k(e.input, e.list) && t.preventDefault();
        break;
      case "Tab":
        e.tabInsertsSuggestions && k(e.input, e.list) && t.preventDefault();
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
        e.clearSelection();
    }
}
function L(t) {
  if (!(t.target instanceof Element))
    return;
  const e = t.target.closest('[role="option"]');
  e && e.getAttribute("aria-disabled") !== "true" && F(e, { event: t });
}
function k(t, e) {
  const n = e.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');
  return n ? (n.getAttribute("aria-disabled") === "true" || n.click(), !0) : !1;
}
function F(t, e) {
  t.dispatchEvent(new CustomEvent("combobox-commit", { bubbles: !0, detail: e }));
}
function W(t) {
  t.dispatchEvent(new Event("combobox-select", { bubbles: !0 }));
}
function S(t) {
  return !t.hidden && !(t instanceof HTMLInputElement && t.type === "hidden") && (t.offsetWidth > 0 || t.offsetHeight > 0);
}
function N(t, e) {
  e.isComposing = t.type === "compositionstart", document.getElementById(e.input.getAttribute("aria-controls") || "") && e.clearSelection();
}
const R = "theme-module__light", G = '"../page-modules/assistant/assistant.module.css"', U = '"../page-modules/departures/departures.module.css"', V = '"../components/search/search.module.css"', K = '"../modules/search-time/selector/selector.module.css"', Q = '"../components/button/button.module.css"', J = "widget-module__hidden", Y = "widget-module__lightWrapper theme-module__light", z = "widget-module__wrapper theme-module__override-light", X = "widget-module__form assistant-module__container", Z = "widget-module__nav", ee = "widget-module__tabs", te = "widget-module__tabSelected", oe = "widget-module__main assistant-module__main", ne = "widget-module__heading assistant-module__heading", ie = "widget-module__inputBoxes", ae = "widget-module__search_container search-module__container", re = "widget-module__search_inputContainer search-module__inputContainer", se = "widget-module__search_label search-module__label typography-module__typo-body__secondary", le = "widget-module__search_input search-module__input", ce = "widget-module__search_inputLast", de = "widget-module__button_geolocation departures-module__geolocationButton", ue = "widget-module__selector_group selector-module__departureDateSelector", pe = "widget-module__selector_options selector-module__options", me = "widget-module__selector_options__small selector-module__options", _e = "widget-module__selector_option selector-module__option selector-module__option", he = "widget-module__selector_option__text selector-module__option__text", ge = "widget-module__selector_option__label selector-module__option__label", fe = "widget-module__selector_option__input selector-module__option__input", be = "widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper", ve = "widget-module__selector_dateAndTimeSelectorsWrapper__hidden", we = "widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors", ye = "widget-module__selector_dateSelector selector-module__dateSelector", $e = "widget-module__selector_timeSelector selector-module__timeSelector", Se = "widget-module__buttonGroup", Ee = "widget-module__button", Te = "widget-module__listItem", Ae = "widget-module__itemIcon", Le = "widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary", ke = "widget-module__popupContainer search-module__menu", Ie = "widget-module__messageBox", o = {
  "override-light": "theme-module__override-light",
  light: R,
  assistant: G,
  departures: U,
  search: V,
  selector: K,
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
  search_container: ae,
  search_inputContainer: re,
  search_label: se,
  search_input: le,
  search_inputLast: ce,
  button_geolocation: de,
  selector_group: ue,
  selector_options: pe,
  selector_options__small: me,
  selector_option: _e,
  selector_option__text: he,
  selector_option__label: ge,
  selector_option__input: fe,
  selector_dateAndTimeSelectorsWrapper: be,
  selector_dateAndTimeSelectorsWrapper__hidden: ve,
  selector_dateAndTimeSelectors: we,
  selector_dateSelector: ye,
  selector_timeSelector: $e,
  buttonGroup: Se,
  button: Ee,
  "button--disabled": "widget-module__button--disabled",
  listItem: Te,
  itemIcon: Ae,
  itemLocality: Le,
  popupContainer: ke,
  messageBox: Ie
};
var D = { MODULE_VERSION: "2.1.0", COMPRESSED_ORG: "GYJwhgtkA" };
const Ce = 300, y = String.raw, E = D.MODULE_VERSION, T = D.COMPRESSED_ORG;
function De(t) {
  if (!(t != null && t.startsWith("http")))
    throw new Error("Missing urlBase in correct schema.");
  return t.endsWith("/") || (t += "/"), {
    URL_BASE: t,
    URL_JS_UMD: `${t}widget/${T}/${E}/planner-web.umd.js`,
    URL_JS_ESM: `${t}widget/${T}/${E}/planner-web.mjs`,
    URL_CSS: `${t}widget/${T}/${E}/planner-web.css`
  };
}
function ze({
  urlBase: t,
  language: e = "en"
}) {
  const n = Je(e), i = De(t);
  return {
    output: Pe(i, n),
    init: Me,
    urls: i
  };
}
function Me() {
  var e, n;
  je(), I("pw-assistant"), I("pw-departure");
  let t = {
    from: void 0,
    to: void 0
  };
  document.addEventListener("search-selected", function(i) {
    const a = i;
    t[a.detail.key] = a.detail.item;
  }), document.querySelectorAll("[name=searchTimeSelector]").forEach(function(i) {
    i.addEventListener("change", function(a) {
      const l = a.currentTarget.value === "now";
      document.querySelectorAll(".js-search-date-details").forEach((d) => {
        d.hidden = l;
      });
    });
  }), (e = document.querySelector("#pw-form-departures")) == null || e.addEventListener("submit", (i) => {
    i.preventDefault();
    const a = i.currentTarget;
    Oe(a, t.from);
  }), (n = document.querySelector("#pw-form-assistant")) == null || n.addEventListener("submit", (i) => {
    i.preventDefault();
    const a = i.currentTarget;
    Be(a, t.from, t.to);
  });
}
function I(t) {
  const e = document.querySelector(
    `#${t}-searchTimeSelector-date`
  ), n = document.querySelector(
    `#${t}-searchTimeSelector-time`
  );
  try {
    if (e && (e.valueAsDate = /* @__PURE__ */ new Date()), n) {
      const i = /* @__PURE__ */ new Date();
      i.setSeconds(0), i.setMilliseconds(0), n.valueAsDate = i;
    }
  } catch {
  }
}
function M(t) {
  const e = t.get("searchTimeSelector");
  if (e === "now")
    return {
      mode: "now"
    };
  {
    const n = t.get("dateinput"), i = t.get("timeinput");
    if (n && i) {
      const a = /* @__PURE__ */ new Date(`${n}T${i}`);
      return {
        mode: e == "arriveBy" ? "arriveBy" : "departBy",
        dateTime: a.getTime()
      };
    }
    return {
      mode: "now"
    };
  }
}
function Be(t, e, n) {
  const i = t.action, a = M(new FormData(t)), c = Ne({ from: e, to: n }, a), l = new URLSearchParams(c);
  window.location.href = `${i}?${l.toString()}`;
}
function Oe(t, e) {
  const n = t.action, i = M(new FormData(t)), a = Re(e, i), c = new URLSearchParams(a);
  window.location.href = `${n}?${c.toString()}`;
}
class $ extends HTMLElement {
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
      $.clearMessageBox();
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
function Pe({ URL_BASE: t }, e) {
  function n(r) {
    const s = a(r), p = b("span", [r.name]), m = b("span", [r.locality ?? ""], o.itemLocality), _ = b("li", [s, p, m], o.listItem);
    return _.role = "option", _.setAttribute("data-feature-id", r.id), _;
  }
  function i(r) {
    const s = b("span", [r]);
    return b("li", [s], o.listItem);
  }
  function a(r) {
    const s = He(r.category), p = b("img");
    p.src = `${t}assets/mono/light/${s.icon}.svg`, p.alt = s.alt, p.role = "img";
    const m = b("div", [p], o.itemIcon);
    return m.ariaHidden = "true", m;
  }
  class c extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const s = this, p = s.getAttribute("data-mode") ?? "assistant";
      this.querySelector("button").addEventListener("click", async (_) => {
        var g;
        $.clearMessageBox();
        try {
          const h = await Ve(e), v = (g = s.parentElement) == null ? void 0 : g.querySelector("input");
          v && (v.value = h ? `${h.name}, ${h.locality}` : v.value), document.dispatchEvent(
            new CustomEvent("search-selected", {
              bubbles: !0,
              detail: {
                mode: p,
                key: "from",
                item: h
              }
            })
          );
        } catch (h) {
          h instanceof Error && document.dispatchEvent(
            new CustomEvent("pw-errorMessage", {
              bubbles: !0,
              detail: {
                message: h.message
              }
            })
          );
        }
      });
    }
  }
  customElements.define("pw-geobutton", c), customElements.define("pw-messagebox", $);
  class l extends HTMLElement {
    constructor() {
      super(), this.dataList = {};
    }
    getItem(s) {
      return this.dataList[s];
    }
    setItems(s) {
      this.dataList = {};
      for (let p of s)
        this.dataList[p.id] = p;
    }
    connectedCallback() {
      const s = this, p = qe(
        this.getAttribute("data-debounce-ms"),
        Ce
      ), m = this.querySelector("input"), _ = this.querySelector(
        "#" + this.getAttribute("for")
      );
      let g = new H(m, _, {
        scrollIntoViewOptions: !1
      });
      function h(u) {
        u ? g.start() : (g.clearSelection(), g.stop()), _.hidden = !u;
      }
      function v() {
        s.setItems([]), _.innerHTML = "";
        const u = i(e.noResults);
        _.appendChild(u), h(!0);
      }
      const j = C(async (u) => {
        try {
          if (!u.value) {
            _.innerHTML = "";
            return;
          }
          const f = await Ge(u.value);
          if (f.length === 0)
            return v();
          s.setItems(f), _.innerHTML = "";
          for (let w of f) {
            const q = n(w);
            _.appendChild(q);
          }
          h(!0);
        } catch {
          v();
        }
      }, p);
      m.addEventListener("keydown", (u) => {
        u.key === "Escape" && h(!1);
      }), m.addEventListener(
        "input",
        (u) => j(u.target)
      ), m.addEventListener("focus", () => h(!0)), m.addEventListener(
        "blur",
        // Blur after properly selecting
        C(() => h(!1), 100)
      ), document.addEventListener("click", (u) => {
        B(u.target, this) || h(!1);
      }), _.addEventListener("combobox-commit", function(u) {
        const f = u.target.getAttribute(
          "data-feature-id"
        ), w = f ? s.getItem(f) : void 0;
        m.value = w ? `${w.name}, ${w.locality}` : m.value, document.dispatchEvent(
          new CustomEvent("search-selected", {
            bubbles: !0,
            detail: {
              mode: "assistant",
              key: m.name,
              item: w
            }
          })
        ), _.hidden = !0, g.clearSelection(), g.stop();
      });
    }
  }
  customElements.define("pw-autocomplete", l);
  const d = y`
    <div class="${o.buttonGroup}">
      <button type="submit" class="${o.button}" aria-disabled="true">
        <span>${e.searchButton}</span>
      </button>
    </div>
  `, A = (r, s = !0) => y`
    <div class="${o.inputBoxes}">
      <p class="${o.heading}">${e.searchTime.title}</p>
      <div>
        <div
          class="${o.selector_options} ${s ? "" : o.selector_options__small}"
        >
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="searchTimeSelector"
              aria-labelled-by="${r}-now"
              class="${o.selector_option__input}"
              value="now"
              checked=""
            />
            <span aria-hidden="true" class="${o.selector_option__label}">
              <span class="${o.selector_option__text}" id="${r}-now">
                ${e.searchTime.now}
              </span>
            </span>
          </label>
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="searchTimeSelector"
              aria-labelled-by="${r}-depart"
              class="${o.selector_option__input}"
              value="departBy"
            />
            <span aria-hidden="true" class="${o.selector_option__label}">
              <span
                class="${o.selector_option__text}"
                id="${r}-depart"
              >
                ${e.searchTime.depart}
              </span>
            </span>
          </label>
          ${s ? y`
                <label class="${o.selector_option}">
                  <input
                    type="radio"
                    name="searchTimeSelector"
                    aria-labelled-by="${r}-arrival"
                    class="${o.selector_option__input}"
                    value="arriveBy"
                  />
                  <span
                    aria-hidden="true"
                    class="${o.selector_option__label}"
                  >
                    <span
                      class="${o.selector_option__text}"
                      id="${r}-arrival"
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
              <label for="${`${r}-searchTimeSelector-date`}">
                ${e.searchTime.date}
              </label>
              <input
                type="date"
                name="dateinput"
                id="${`${r}-searchTimeSelector-date`}"
              />
            </div>
            <div class="${o.selector_timeSelector}">
              <label for="${`${r}-searchTimeSelector-time`}">
                ${e.searchTime.time}
              </label>
              <input
                type="time"
                name="timeinput"
                step="60"
                id="${`${r}-searchTimeSelector-time`}"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  `, O = y`
    <form
      class="${o.form}"
      action="${t}/assistant"
      id="pw-form-assistant"
      method="get"
    >
      <div class="${o.main}">
        <div class="${o.inputBoxes}">
          <p class="${o.heading}">${e.assistant.title}</p>
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
              role="combobox"
              aria-expanded="false"
              aria-haspopup="listbox"
              aria-labelledby="pw-from-1-label"
            >
              <pw-autocomplete for="from-popup-1">
                <input
                  class="${o.search_input}"
                  aria-autocomplete="list"
                  aria-labelledby="pw-from-1-label"
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
                  src="${t}/assets/mono/light/places/City.svg"
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
              role="combobox"
              aria-expanded="false"
              aria-haspopup="listbox"
              aria-labelledby="pw-to-1-label"
            >
              <pw-autocomplete for="to-popup-1">
                <input
                  class="${o.search_input} ${o.search_inputLast}"
                  aria-autocomplete="list"
                  aria-labelledby="pw-to-1-label"
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
        </div>
        ${A("pw-assistant")}
      </div>
      ${d}
    </form>
  `, P = y`
    <form
      class="${o.form}"
      action="${t}/departures"
      id="pw-form-departures"
      method="get"
    >
      <div class="${o.main}">
        <div class="${o.inputBoxes}">
          <p class="${o.heading}">${e.departure.title}</p>
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
              role="combobox"
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
                  src="${t}/assets/mono/light/places/City.svg"
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
        ${A("pw-departure", !1)}
      </div>
      ${d}
    </form>
  `;
  return y`
    <div class="${o.wrapper} ${o.lightWrapper}">
      <nav class="${o.nav}">
        <ul class="${o.tabs} js-tablist">
          <li>
            <a
              href="/assistant"
              class="${o.tabSelected}"
              id="pw-assistant-tab"
            >
              ${e.assistant.link}
            </a>
          </li>
          <li>
            <a href="/departures" id="pw-departures-tab">
              ${e.departure.link}
            </a>
          </li>
        </ul>
      </nav>
      <div class="js-tabpanel" id="pw-assistant">${O}</div>
      <div class="js-tabpanel ${o.hidden}" id="pw-departures">
        ${P}
      </div>
    </div>
  `;
}
function je() {
  var t;
  (t = document.querySelector(".js-tablist")) == null || t.addEventListener("click", function(e) {
    var l;
    const n = (l = e.target) == null ? void 0 : l.closest("a");
    if (!n)
      return;
    const i = n.getAttribute("href");
    if (!i)
      return;
    const a = i.replace("/", "");
    e.preventDefault();
    const c = document.querySelector("#pw-" + a);
    c && ($.clearMessageBox(), document.querySelectorAll(".js-tabpanel").forEach((d) => {
      d.classList.add(o.hidden);
    }), document.querySelectorAll(".js-tablist a").forEach((d) => {
      d.classList.remove(o.tabSelected);
    }), c.classList.remove(o.hidden), n.classList.add(o.tabSelected));
  });
}
function C(t, e) {
  let n = null;
  return function(...i) {
    clearTimeout(n), n = setTimeout(() => {
      t(...i);
    }, e);
  };
}
function b(t, e = [], n = "") {
  const i = document.createElement(t);
  if (Array.isArray(e))
    for (let a of e) {
      let c = typeof a == "string" ? document.createTextNode(a) : a;
      i.appendChild(c);
    }
  return i.className = n, i;
}
function qe(t, e) {
  const n = parseInt(t, 10);
  return Number.isNaN(n) ? e : n;
}
function B(t, e) {
  return t === e ? !0 : !t || !t.parentElement ? !1 : B(t.parentElement, e);
}
function He(t) {
  switch (xe(t)[0]) {
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
function xe(t) {
  return t.map(Fe).filter((e, n, i) => i.indexOf(e) === n);
}
function Fe(t) {
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
function We(t, e) {
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
function Ne(t, e) {
  const n = e.mode !== "now" ? {
    searchMode: e.mode,
    searchTime: e.dateTime.toString()
  } : { searchMode: e.mode }, i = We(
    t.from,
    t.to
  );
  return {
    ...n,
    ...i
  };
}
function Re(t, e) {
  const n = e.mode !== "now" ? {
    searchMode: e.mode,
    searchTime: e.dateTime.toString()
  } : { searchMode: e.mode };
  return t.layer == "venue" ? {
    ...n,
    id: t.id
  } : {
    ...n,
    lon: t.geometry.coordinates[0].toString(),
    lat: t.geometry.coordinates[1].toString()
  };
}
async function Ge(t) {
  const e = `/api/departures/autocomplete?q=${t}`, n = await fetch(e);
  if (!n.ok)
    throw new Error(`Error fetching autocomplete data from ${e}`);
  return await n.json();
}
async function Ue(t) {
  const n = await (await fetch(
    `/api/departures/reverse?lat=${t.latitude}&lon=${t.longitude}`
  )).json();
  if (n)
    return n;
}
async function Ve(t) {
  return new Promise(function(e, n) {
    navigator.geolocation.getCurrentPosition(
      async (i) => {
        const a = await Ue(i.coords);
        e(a);
      },
      (i) => {
        n(new Error(Ke(i.code, t)));
      },
      { enableHighAccuracy: !0, timeout: 1e4 }
    );
  });
}
function Ke(t, e) {
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
const Qe = {
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
      from: "string"
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
      denied: "Du må endre stadinnstillingane i nettlesaren din for å bruke din posisjon i reisesøket.",
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
function Je(t) {
  return Qe[t];
}
export {
  ze as createWidget,
  Ue as reverse
};
