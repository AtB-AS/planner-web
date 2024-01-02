class H {
  constructor(e, i, { tabInsertsSuggestions: n, defaultFirstOption: a, scrollIntoViewOptions: s } = {}) {
    this.input = e, this.list = i, this.tabInsertsSuggestions = n ?? !0, this.defaultFirstOption = a ?? !1, this.scrollIntoViewOptions = s, this.isComposing = !1, i.id || (i.id = `combobox-${Math.random().toString().slice(2, 6)}`), this.ctrlBindings = !!navigator.userAgent.match(/Macintosh/), this.keyboardEventHandler = (d) => F(d, this), this.compositionEventHandler = (d) => x(d, this), this.inputHandler = this.clearSelection.bind(this), e.setAttribute("role", "combobox"), e.setAttribute("aria-controls", i.id), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-autocomplete", "list"), e.setAttribute("aria-haspopup", "listbox");
  }
  destroy() {
    this.clearSelection(), this.stop(), this.input.removeAttribute("role"), this.input.removeAttribute("aria-controls"), this.input.removeAttribute("aria-expanded"), this.input.removeAttribute("aria-autocomplete"), this.input.removeAttribute("aria-haspopup");
  }
  start() {
    this.input.setAttribute("aria-expanded", "true"), this.input.addEventListener("compositionstart", this.compositionEventHandler), this.input.addEventListener("compositionend", this.compositionEventHandler), this.input.addEventListener("input", this.inputHandler), this.input.addEventListener("keydown", this.keyboardEventHandler), this.list.addEventListener("click", I), this.indicateDefaultOption();
  }
  stop() {
    this.clearSelection(), this.input.setAttribute("aria-expanded", "false"), this.input.removeEventListener("compositionstart", this.compositionEventHandler), this.input.removeEventListener("compositionend", this.compositionEventHandler), this.input.removeEventListener("input", this.inputHandler), this.input.removeEventListener("keydown", this.keyboardEventHandler), this.list.removeEventListener("click", I);
  }
  indicateDefaultOption() {
    var e;
    this.defaultFirstOption && ((e = Array.from(this.list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')).filter(T)[0]) === null || e === void 0 || e.setAttribute("data-combobox-option-default", "true"));
  }
  navigate(e = 1) {
    const i = Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter(T)[0], n = Array.from(this.list.querySelectorAll('[role="option"]')).filter(T), a = n.indexOf(i);
    if (a === n.length - 1 && e === 1 || a === 0 && e === -1) {
      this.clearSelection(), this.input.focus();
      return;
    }
    let s = e === 1 ? 0 : n.length - 1;
    if (i && a >= 0) {
      const m = a + e;
      m >= 0 && m < n.length && (s = m);
    }
    const d = n[s];
    if (d)
      for (const m of n)
        m.removeAttribute("data-combobox-option-default"), d === m ? (this.input.setAttribute("aria-activedescendant", d.id), d.setAttribute("aria-selected", "true"), N(d), d.scrollIntoView(this.scrollIntoViewOptions)) : m.removeAttribute("aria-selected");
  }
  clearSelection() {
    this.input.removeAttribute("aria-activedescendant");
    for (const e of this.list.querySelectorAll('[aria-selected="true"]'))
      e.removeAttribute("aria-selected");
    this.indicateDefaultOption();
  }
}
function F(t, e) {
  if (!(t.shiftKey || t.metaKey || t.altKey) && !(!e.ctrlBindings && t.ctrlKey) && !e.isComposing)
    switch (t.key) {
      case "Enter":
        C(e.input, e.list) && t.preventDefault();
        break;
      case "Tab":
        e.tabInsertsSuggestions && C(e.input, e.list) && t.preventDefault();
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
function I(t) {
  if (!(t.target instanceof Element))
    return;
  const e = t.target.closest('[role="option"]');
  e && e.getAttribute("aria-disabled") !== "true" && W(e, { event: t });
}
function C(t, e) {
  const i = e.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');
  return i ? (i.getAttribute("aria-disabled") === "true" || i.click(), !0) : !1;
}
function W(t, e) {
  t.dispatchEvent(new CustomEvent("combobox-commit", { bubbles: !0, detail: e }));
}
function N(t) {
  t.dispatchEvent(new Event("combobox-select", { bubbles: !0 }));
}
function T(t) {
  return !t.hidden && !(t instanceof HTMLInputElement && t.type === "hidden") && (t.offsetWidth > 0 || t.offsetHeight > 0);
}
function x(t, e) {
  e.isComposing = t.type === "compositionstart", document.getElementById(e.input.getAttribute("aria-controls") || "") && e.clearSelection();
}
const R = "theme-module__light", G = '"../page-modules/assistant/assistant.module.css"', V = '"../page-modules/departures/departures.module.css"', K = '"../components/search/search.module.css"', U = '"../modules/search-time/selector/selector.module.css"', Q = '"../components/button/button.module.css"', Y = "widget-module__hidden", J = "widget-module__lightWrapper theme-module__light", z = "widget-module__wrapper theme-module__override-light", X = "widget-module__form assistant-module__container", Z = "widget-module__nav", ee = "widget-module__tabs", te = "widget-module__tabSelected", oe = "widget-module__main assistant-module__main", ne = "widget-module__heading assistant-module__heading", ie = "widget-module__inputBoxes", ae = "widget-module__search_container search-module__container", re = "widget-module__search_inputContainer search-module__inputContainer", se = "widget-module__search_label search-module__label typography-module__typo-body__secondary", le = "widget-module__search_input search-module__input", ce = "widget-module__search_inputLast", de = "widget-module__button_geolocation departures-module__geolocationButton", ue = "widget-module__selector_group selector-module__departureDateSelector", pe = "widget-module__selector_options selector-module__options", me = "widget-module__selector_options__small selector-module__options", he = "widget-module__selector_option selector-module__option selector-module__option", _e = "widget-module__selector_option__text selector-module__option__text", ge = "widget-module__selector_option__label selector-module__option__label", be = "widget-module__selector_option__input selector-module__option__input", fe = "widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper", ve = "widget-module__selector_dateAndTimeSelectorsWrapper__hidden", we = "widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors", ye = "widget-module__selector_dateSelector selector-module__dateSelector", $e = "widget-module__selector_timeSelector selector-module__timeSelector", Se = "widget-module__buttonGroup", Ee = "widget-module__button", Te = "widget-module__listItem", Ae = "widget-module__itemIcon", Le = "widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary", ke = "widget-module__popupContainer search-module__menu", Ie = "widget-module__messageBox", o = {
  "override-light": "theme-module__override-light",
  light: R,
  assistant: G,
  departures: V,
  search: K,
  selector: U,
  buttonComponent: Q,
  hidden: Y,
  lightWrapper: J,
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
  selector_option: he,
  selector_option__text: _e,
  selector_option__label: ge,
  selector_option__input: be,
  selector_dateAndTimeSelectorsWrapper: fe,
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
var B = { MODULE_VERSION: "2.6.0", COMPRESSED_ORG: "HYMw1kA" };
const Ce = 300, y = String.raw, A = B.MODULE_VERSION, L = B.COMPRESSED_ORG;
function De(t) {
  if (!(t != null && t.startsWith("http")))
    throw new Error("Missing urlBase in correct schema.");
  return t.endsWith("/") || (t += "/"), {
    URL_BASE: t,
    URL_JS_UMD: `${t}widget/${L}/${A}/planner-web.umd.js`,
    URL_JS_ESM: `${t}widget/${L}/${A}/planner-web.mjs`,
    URL_CSS: `${t}widget/${L}/${A}/planner-web.css`
  };
}
function ze({
  urlBase: t,
  language: e = "en"
}) {
  const i = Ye(e), n = De(t);
  return {
    output: Pe(n, i),
    init: Me,
    urls: n
  };
}
function Me() {
  var e, i;
  je(), D("pw-assistant"), D("pw-departures");
  let t = {
    from: void 0,
    to: void 0
  };
  document.addEventListener("search-selected", function(n) {
    const a = n;
    t[a.detail.key] = a.detail.item;
  }), document.addEventListener("reset-search", function() {
    t = {
      from: void 0,
      to: void 0
    }, document.querySelectorAll(
      'input[name="from"], input[name="to"]'
    ).forEach((n) => {
      n.value = "";
    });
  }), document.querySelectorAll("[name$=searchTimeSelector]").forEach(function(n) {
    n.addEventListener("change", function(a) {
      const d = a.currentTarget.value === "now";
      document.querySelectorAll(".js-search-date-details").forEach((m) => {
        m.hidden = d;
      });
    });
  }), (e = document.querySelector("#pw-form-departures")) == null || e.addEventListener("submit", (n) => {
    n.preventDefault();
    const a = n.currentTarget;
    Oe(a, t.from);
  }), (i = document.querySelector("#pw-form-assistant")) == null || i.addEventListener("submit", (n) => {
    n.preventDefault();
    const a = n.currentTarget;
    Be(a, t.from, t.to);
  });
}
function D(t) {
  const e = document.querySelector(
    `#${t}-searchTimeSelector-date`
  ), i = document.querySelector(
    `#${t}-searchTimeSelector-time`
  );
  try {
    if (e && (e.valueAsDate = /* @__PURE__ */ new Date()), i) {
      const n = /* @__PURE__ */ new Date();
      n.setSeconds(0), n.setMilliseconds(0), i.valueAsDate = n;
    }
  } catch {
  }
}
function O(t, e) {
  const i = t.get(`${e}-searchTimeSelector`);
  if (i === "now")
    return {
      mode: "now"
    };
  {
    const n = t.get("dateinput"), a = t.get("timeinput");
    if (n && a) {
      const s = /* @__PURE__ */ new Date(`${n}T${a}`);
      return {
        mode: i == "arriveBy" ? "arriveBy" : "departBy",
        dateTime: s.getTime()
      };
    }
    return {
      mode: "now"
    };
  }
}
function Be(t, e, i) {
  const n = t.action, a = O(new FormData(t), "pw-assistant"), s = xe({ from: e, to: i }, a), d = new URLSearchParams(s);
  window.location.href = `${n}?${d.toString()}`;
}
function Oe(t, e) {
  const i = t.action, n = O(new FormData(t), "pw-departures"), a = Re(n, e), s = new URLSearchParams(a);
  (e == null ? void 0 : e.layer) === "venue" ? window.location.href = `${i}/${e.id}?${s.toString()}` : window.location.href = `${i}?${s.toString()}`;
}
class S extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const e = this;
    e.hidden = !0, e.classList.add(o.messageBox), document.addEventListener("pw-errorMessage", function(i) {
      const n = i;
      e.textContent = n.detail.message, e.hidden = !1;
    }), document.addEventListener("pw-errorMessage-clear", function(i) {
      e.hidden = !0;
    }), e.addEventListener("click", function() {
      S.clearMessageBox();
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
  function i(r) {
    const c = a(r), h = f("span", [r.name]), u = f("span", [r.locality ?? ""], o.itemLocality), l = f("li", [c, h, u], o.listItem);
    return l.role = "option", l.setAttribute("data-feature-id", r.id), l;
  }
  function n(r) {
    const c = f("span", [r]);
    return f("li", [c], o.listItem);
  }
  function a(r) {
    const c = He(r.category), h = f("img");
    h.src = `${t}assets/mono/light/${c.icon}.svg`, h.alt = c.alt, h.role = "img";
    const u = f("div", [h], o.itemIcon);
    return u.ariaHidden = "true", u;
  }
  class s extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const c = this;
      this.querySelector("button").addEventListener("click", async () => {
        var u;
        S.clearMessageBox();
        try {
          const l = await Ke(t, e), g = (u = c.parentElement) == null ? void 0 : u.querySelector("input");
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
  customElements.define("pw-geobutton", s), customElements.define("pw-messagebox", S);
  class d extends HTMLElement {
    constructor() {
      super(), this.dataList = {};
    }
    getItem(c) {
      return this.dataList[c];
    }
    setItems(c) {
      this.dataList = {};
      for (let h of c)
        this.dataList[h.id] = h;
    }
    connectedCallback() {
      const c = this, h = qe(
        this.getAttribute("data-debounce-ms"),
        Ce
      ), u = this.querySelector("input"), l = this.querySelector(
        "#" + this.getAttribute("for")
      );
      let g = new H(u, l, {
        tabInsertsSuggestions: !0,
        scrollIntoViewOptions: !1
      });
      function v(p) {
        p ? g.start() : (g.clearSelection(), g.stop()), l.hidden = !p;
      }
      function k() {
        c.setItems([]), l.innerHTML = "";
        const p = n(e.noResults);
        l.appendChild(p), v(!0);
      }
      const j = M(async (p) => {
        try {
          if (!p.value) {
            l.innerHTML = "";
            return;
          }
          const b = await Ge(t, p.value);
          if (b.length === 0)
            return k();
          c.setItems(b), l.innerHTML = "";
          for (let w of b) {
            const q = i(w);
            l.appendChild(q);
          }
          v(!0);
        } catch {
          k();
        }
      }, h);
      u.addEventListener("keydown", (p) => {
        p.key === "Escape" && v(!1);
      }), u.addEventListener(
        "input",
        (p) => j(p.target)
      ), u.addEventListener("focus", () => v(!0)), u.addEventListener(
        "blur",
        // Blur after properly selecting
        M(() => v(!1), 100)
      ), document.addEventListener("click", (p) => {
        P(p.target, this) || v(!1);
      }), l.addEventListener("combobox-commit", function(p) {
        const b = p.target.getAttribute(
          "data-feature-id"
        ), w = b ? c.getItem(b) : void 0;
        u.value = w ? `${w.name}, ${w.locality}` : u.value, document.dispatchEvent(
          new CustomEvent("search-selected", {
            bubbles: !0,
            detail: {
              key: u.name,
              item: w
            }
          })
        ), l.hidden = !0, g.clearSelection(), g.stop();
      });
    }
  }
  customElements.define("pw-autocomplete", d);
  const m = y`
    <div class="${o.buttonGroup}">
      <button type="submit" class="${o.button}">
        <span>${e.searchButton}</span>
      </button>
    </div>
  `, $ = (r, c = !0) => y`
    <div class="${o.inputBoxes}">
      <p class="${o.heading}">${e.searchTime.title}</p>
      <div>
        <div
          class="${o.selector_options} ${c ? "" : o.selector_options__small}"
        >
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="${r}-searchTimeSelector"
              aria-labelledby="${r}-now"
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
              name="${r}-searchTimeSelector"
              aria-labelledby="${r}-depart"
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
          ${c ? y`
                <label class="${o.selector_option}">
                  <input
                    type="radio"
                    name="${r}-searchTimeSelector"
                    aria-labelledby="${r}-arrival"
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
  `, E = y`
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
        ${$("pw-assistant")}
      </div>
      ${m}
    </form>
  `, _ = y`
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
        ${$("pw-departures", !1)}
      </div>
      ${m}
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
      <div class="js-tabpanel" id="pw-assistant">${E}</div>
      <div class="js-tabpanel ${o.hidden}" id="pw-departures">
        ${_}
      </div>
    </div>
  `;
}
function je() {
  var t;
  (t = document.querySelector(".js-tablist")) == null || t.addEventListener("click", function(e) {
    var $, E;
    const i = ($ = e.target) == null ? void 0 : $.closest("a");
    if (!i)
      return;
    const n = i.getAttribute("href");
    if (!n)
      return;
    const a = n.replace("/", "");
    e.preventDefault();
    const s = document.querySelector("#pw-" + a);
    if (!s)
      return;
    S.clearMessageBox(), document.querySelectorAll(".js-tabpanel").forEach((_) => {
      _.classList.add(o.hidden);
    }), document.querySelectorAll(".js-tablist a").forEach((_) => {
      _.classList.remove(o.tabSelected);
    }), s.classList.remove(o.hidden), i.classList.add(o.tabSelected);
    const d = document.querySelectorAll(
      `input[type="radio"][name="pw-${a}-searchTimeSelector"]`
    ), m = (E = Array.from(d).find(
      (_) => _.checked
    )) == null ? void 0 : E.value;
    document.querySelectorAll(".js-search-date-details").forEach((_) => {
      _.hidden = m === "now";
    }), document.dispatchEvent(
      new CustomEvent("reset-search", {
        bubbles: !0
      })
    );
  });
}
function M(t, e) {
  let i = null;
  return function(...n) {
    clearTimeout(i), i = setTimeout(() => {
      t(...n);
    }, e);
  };
}
function f(t, e = [], i = "") {
  const n = document.createElement(t);
  if (Array.isArray(e))
    for (let a of e) {
      let s = typeof a == "string" ? document.createTextNode(a) : a;
      n.appendChild(s);
    }
  return n.className = i, n;
}
function qe(t, e) {
  const i = parseInt(t, 10);
  return Number.isNaN(i) ? e : i;
}
function P(t, e) {
  return t === e ? !0 : !t || !t.parentElement ? !1 : P(t.parentElement, e);
}
function He(t) {
  switch (Fe(t)[0]) {
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
function Fe(t) {
  return t.map(We).filter((e, i, n) => n.indexOf(e) === i);
}
function We(t) {
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
function Ne(t, e) {
  if (!t)
    return {};
  const i = e ? {
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
    ...i
  };
}
function xe(t, e) {
  const i = e.mode !== "now" ? {
    searchMode: e.mode,
    searchTime: e.dateTime.toString()
  } : { searchMode: e.mode }, n = Ne(
    t.from,
    t.to
  );
  return {
    ...i,
    ...n
  };
}
function Re(t, e) {
  const i = t.mode !== "now" ? {
    searchMode: t.mode,
    searchTime: t.dateTime.toString()
  } : { searchMode: t.mode };
  return !e || e.layer == "venue" ? {
    ...i
  } : {
    ...i,
    lon: e.geometry.coordinates[0].toString(),
    lat: e.geometry.coordinates[1].toString()
  };
}
async function Ge(t, e) {
  const i = `${t}api/departures/autocomplete?q=${e}`, n = await fetch(i);
  if (!n.ok)
    throw new Error(`Error fetching autocomplete data from ${i}`);
  return await n.json();
}
async function Ve(t, e) {
  const n = await (await fetch(
    `${t}api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`
  )).json();
  if (n)
    return n;
}
async function Ke(t, e) {
  return new Promise(function(i, n) {
    navigator.geolocation.getCurrentPosition(
      async (a) => {
        const s = await Ve(t, a.coords);
        i(s);
      },
      (a) => {
        n(new Error(Ue(a.code, e)));
      },
      { enableHighAccuracy: !0, timeout: 1e4 }
    );
  });
}
function Ue(t, e) {
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
function Ye(t) {
  return Qe[t];
}
export {
  ze as createWidget,
  Ve as reverse
};
