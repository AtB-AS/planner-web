class O {
  constructor(t, o, { tabInsertsSuggestions: s, defaultFirstOption: i, scrollIntoViewOptions: l } = {}) {
    this.input = t, this.list = o, this.tabInsertsSuggestions = s ?? !0, this.defaultFirstOption = i ?? !1, this.scrollIntoViewOptions = l, this.isComposing = !1, o.id || (o.id = `combobox-${Math.random().toString().slice(2, 6)}`), this.ctrlBindings = !!navigator.userAgent.match(/Macintosh/), this.keyboardEventHandler = (a) => j(a, this), this.compositionEventHandler = (a) => F(a, this), this.inputHandler = this.clearSelection.bind(this), t.setAttribute("role", "combobox"), t.setAttribute("aria-controls", o.id), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-autocomplete", "list"), t.setAttribute("aria-haspopup", "listbox");
  }
  destroy() {
    this.clearSelection(), this.stop(), this.input.removeAttribute("role"), this.input.removeAttribute("aria-controls"), this.input.removeAttribute("aria-expanded"), this.input.removeAttribute("aria-autocomplete"), this.input.removeAttribute("aria-haspopup");
  }
  start() {
    this.input.setAttribute("aria-expanded", "true"), this.input.addEventListener("compositionstart", this.compositionEventHandler), this.input.addEventListener("compositionend", this.compositionEventHandler), this.input.addEventListener("input", this.inputHandler), this.input.addEventListener("keydown", this.keyboardEventHandler), this.list.addEventListener("click", A), this.indicateDefaultOption();
  }
  stop() {
    this.clearSelection(), this.input.setAttribute("aria-expanded", "false"), this.input.removeEventListener("compositionstart", this.compositionEventHandler), this.input.removeEventListener("compositionend", this.compositionEventHandler), this.input.removeEventListener("input", this.inputHandler), this.input.removeEventListener("keydown", this.keyboardEventHandler), this.list.removeEventListener("click", A);
  }
  indicateDefaultOption() {
    var t;
    this.defaultFirstOption && ((t = Array.from(this.list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')).filter($)[0]) === null || t === void 0 || t.setAttribute("data-combobox-option-default", "true"));
  }
  navigate(t = 1) {
    const o = Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter($)[0], s = Array.from(this.list.querySelectorAll('[role="option"]')).filter($), i = s.indexOf(o);
    if (i === s.length - 1 && t === 1 || i === 0 && t === -1) {
      this.clearSelection(), this.input.focus();
      return;
    }
    let l = t === 1 ? 0 : s.length - 1;
    if (o && i >= 0) {
      const c = i + t;
      c >= 0 && c < s.length && (l = c);
    }
    const a = s[l];
    if (a)
      for (const c of s)
        c.removeAttribute("data-combobox-option-default"), a === c ? (this.input.setAttribute("aria-activedescendant", a.id), a.setAttribute("aria-selected", "true"), P(a), a.scrollIntoView(this.scrollIntoViewOptions)) : c.removeAttribute("aria-selected");
  }
  clearSelection() {
    this.input.removeAttribute("aria-activedescendant");
    for (const t of this.list.querySelectorAll('[aria-selected="true"]'))
      t.removeAttribute("aria-selected");
    this.indicateDefaultOption();
  }
}
function j(e, t) {
  if (!(e.shiftKey || e.metaKey || e.altKey) && !(!t.ctrlBindings && e.ctrlKey) && !t.isComposing)
    switch (e.key) {
      case "Enter":
        L(t.input, t.list) && e.preventDefault();
        break;
      case "Tab":
        t.tabInsertsSuggestions && L(t.input, t.list) && e.preventDefault();
        break;
      case "Escape":
        t.clearSelection();
        break;
      case "ArrowDown":
        t.navigate(1), e.preventDefault();
        break;
      case "ArrowUp":
        t.navigate(-1), e.preventDefault();
        break;
      case "n":
        t.ctrlBindings && e.ctrlKey && (t.navigate(1), e.preventDefault());
        break;
      case "p":
        t.ctrlBindings && e.ctrlKey && (t.navigate(-1), e.preventDefault());
        break;
      default:
        if (e.ctrlKey)
          break;
        t.clearSelection();
    }
}
function A(e) {
  if (!(e.target instanceof Element))
    return;
  const t = e.target.closest('[role="option"]');
  t && t.getAttribute("aria-disabled") !== "true" && B(t, { event: e });
}
function L(e, t) {
  const o = t.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');
  return o ? (o.getAttribute("aria-disabled") === "true" || o.click(), !0) : !1;
}
function B(e, t) {
  e.dispatchEvent(new CustomEvent("combobox-commit", { bubbles: !0, detail: t }));
}
function P(e) {
  e.dispatchEvent(new Event("combobox-select", { bubbles: !0 }));
}
function $(e) {
  return !e.hidden && !(e instanceof HTMLInputElement && e.type === "hidden") && (e.offsetWidth > 0 || e.offsetHeight > 0);
}
function F(e, t) {
  t.isComposing = e.type === "compositionstart", document.getElementById(t.input.getAttribute("aria-controls") || "") && t.clearSelection();
}
const N = '"../page-modules/assistant/assistant.module.css"', W = '"../page-modules/departures/departures.module.css"', U = '"../components/search/search.module.css"', V = '"../modules/search-time/selector/selector.module.css"', G = '"../components/button/button.module.css"', K = "widget-module__hidden", Q = "widget-module__wrapper theme-module__override-light", R = "widget-module__form assistant-module__container", J = "widget-module__nav", z = "widget-module__tabs", X = "widget-module__tabSelected", Y = "widget-module__main assistant-module__main", Z = "widget-module__heading assistant-module__heading", ee = "widget-module__inputBoxes", te = "widget-module__search_container search-module__container", oe = "widget-module__search_inputContainer search-module__inputContainer", ne = "widget-module__search_label search-module__label typography-module__typo-body__secondary", se = "widget-module__search_input search-module__input", ie = "widget-module__search_inputLast", ae = "widget-module__button_geolocation departures-module__geolocationButton", re = "widget-module__selector_group selector-module__departureDateSelector", le = "widget-module__selector_options selector-module__options", ce = "widget-module__selector_options__small selector-module__options", de = "widget-module__selector_option selector-module__option selector-module__option", ue = "widget-module__selector_option__text selector-module__option__text", pe = "widget-module__selector_option__label selector-module__option__label", me = "widget-module__selector_option__input selector-module__option__input", _e = "widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper", he = "widget-module__selector_dateAndTimeSelectorsWrapper__hidden", fe = "widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors", be = "widget-module__selector_dateSelector selector-module__dateSelector", ge = "widget-module__selector_timeSelector selector-module__timeSelector", ve = "widget-module__buttonGroup departures-module__buttons", we = "widget-module__button", ye = "widget-module__listItem", Se = "widget-module__itemIcon", $e = "widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary", Ee = "widget-module__popupContainer search-module__menu", Te = "widget-module__messageBox", n = {
  "override-light": "theme-module__override-light",
  assistant: N,
  departures: W,
  search: U,
  selector: V,
  buttonComponent: G,
  hidden: K,
  wrapper: Q,
  form: R,
  nav: J,
  tabs: z,
  tabSelected: X,
  main: Y,
  heading: Z,
  inputBoxes: ee,
  search_container: te,
  search_inputContainer: oe,
  search_label: ne,
  search_input: se,
  search_inputLast: ie,
  button_geolocation: ae,
  selector_group: re,
  selector_options: le,
  selector_options__small: ce,
  selector_option: de,
  selector_option__text: ue,
  selector_option__label: pe,
  selector_option__input: me,
  selector_dateAndTimeSelectorsWrapper: _e,
  selector_dateAndTimeSelectorsWrapper__hidden: he,
  selector_dateAndTimeSelectors: fe,
  selector_dateSelector: be,
  selector_timeSelector: ge,
  buttonGroup: ve,
  button: we,
  "button--disabled": "widget-module__button--disabled",
  listItem: ye,
  itemIcon: Se,
  itemLocality: $e,
  popupContainer: Ee,
  messageBox: Te
};
var Ae = { MODULE_VERSION: "0.2.0" };
const Le = 300, y = String.raw, E = Ae.MODULE_VERSION;
function ke(e) {
  if (!(e != null && e.startsWith("http")))
    throw new Error("Missing urlBase in correct schema.");
  return e.endsWith("/") || (e += "/"), {
    URL_BASE: e,
    URL_JS_UMD: `${e}widget/${E}/planner-web.umd.js`,
    URL_JS_ESM: `${e}widget/${E}/planner-web.mjs`,
    URL_CSS: `${e}widget/${E}/planner-web.css`
  };
}
function Ke({ urlBase: e }) {
  const t = ke(e);
  return {
    output: De(t),
    init: Ie,
    urls: t
  };
}
function Ie() {
  var t, o;
  Me(), k("pw-assistant"), k("pw-departure");
  let e = {
    from: void 0,
    to: void 0
  };
  document.addEventListener("search-selected", function(s) {
    const i = s;
    e[i.detail.key] = i.detail.item;
  }), document.querySelectorAll("[name=searchTimeSelector]").forEach(function(s) {
    s.addEventListener("change", function(i) {
      const a = i.currentTarget.value === "now";
      document.querySelectorAll(".js-search-date-details").forEach((c) => {
        c.hidden = a;
      });
    });
  }), (t = document.querySelector("#pw-form-departures")) == null || t.addEventListener("submit", (s) => {
    s.preventDefault();
    const i = s.currentTarget;
    Ce(i, e.from);
  }), (o = document.querySelector("#pw-form-assistant")) == null || o.addEventListener("submit", (s) => {
    s.preventDefault();
    const i = s.currentTarget;
    xe(i, e.from, e.to);
  });
}
function k(e) {
  const t = document.querySelector(
    `#${e}-searchTimeSelector-date`
  ), o = document.querySelector(
    `#${e}-searchTimeSelector-time`
  );
  try {
    if (t && (t.valueAsDate = /* @__PURE__ */ new Date()), o) {
      const s = /* @__PURE__ */ new Date();
      s.setSeconds(0), s.setMilliseconds(0), o.valueAsDate = s;
    }
  } catch {
  }
}
function x(e) {
  const t = e.get("searchTimeSelector");
  if (t === "now")
    return {
      mode: "now"
    };
  {
    const o = e.get("dateinput"), s = e.get("timeinput");
    if (o && s) {
      const i = /* @__PURE__ */ new Date(`${o}T${s}`);
      return {
        mode: t == "arriveBy" ? "arriveBy" : "departBy",
        dateTime: i.getTime()
      };
    }
    return {
      mode: "now"
    };
  }
}
function xe(e, t, o) {
  const s = e.action, i = x(new FormData(e)), l = Pe({ from: t, to: o }, i), a = new URLSearchParams(l);
  window.location.href = `${s}?${a.toString()}`;
}
function Ce(e, t) {
  const o = e.action, s = x(new FormData(e)), i = Fe(t, s), l = new URLSearchParams(i);
  window.location.href = `${o}?${l.toString()}`;
}
class S extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const t = this;
    t.hidden = !0, t.classList.add(n.messageBox), document.addEventListener("pw-errorMessage", function(o) {
      const s = o;
      t.textContent = s.detail.message, t.hidden = !1;
    }), document.addEventListener("pw-errorMessage-clear", function(o) {
      t.hidden = !0;
    }), t.addEventListener("click", function() {
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
function De({ URL_BASE: e }) {
  function t(d) {
    const r = s(d), p = g("span", [d.name]), m = g("span", [d.locality ?? ""], n.itemLocality), _ = g("li", [r, p, m], n.listItem);
    return _.role = "option", _.setAttribute("data-feature-id", d.id), _;
  }
  function o(d) {
    const r = g("span", [d]);
    return g("li", [r], n.listItem);
  }
  function s(d) {
    const r = qe(d.category), p = g("img");
    p.src = `${e}assets/mono/light/${r.icon}.svg`, p.alt = r.alt, p.role = "img";
    const m = g("div", [p], n.itemIcon);
    return m.ariaHidden = "true", m;
  }
  class i extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const r = this, p = r.getAttribute("data-mode") ?? "assistant";
      this.querySelector("button").addEventListener("click", async (_) => {
        var f;
        S.clearMessageBox();
        try {
          const h = await Ue(), v = (f = r.parentElement) == null ? void 0 : f.querySelector("input");
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
  customElements.define("pw-geobutton", i), customElements.define("pw-messagebox", S);
  class l extends HTMLElement {
    constructor() {
      super(), this.dataList = {};
    }
    getItem(r) {
      return this.dataList[r];
    }
    setItems(r) {
      this.dataList = {};
      for (let p of r)
        this.dataList[p.id] = p;
    }
    connectedCallback() {
      const r = this, p = He(
        this.getAttribute("data-debounce-ms"),
        Le
      ), m = this.querySelector("input"), _ = this.querySelector(
        "#" + this.getAttribute("for")
      );
      let f = new O(m, _, {
        scrollIntoViewOptions: !1
      });
      function h(u) {
        u ? f.start() : (f.clearSelection(), f.stop()), _.hidden = !u;
      }
      function v() {
        r.setItems([]), _.innerHTML = "";
        const u = o("Ingen resultater");
        _.appendChild(u), h(!0);
      }
      const H = I(async (u) => {
        try {
          if (!u.value) {
            _.innerHTML = "";
            return;
          }
          const b = await Ne(u.value);
          if (b.length === 0)
            return v();
          r.setItems(b), _.innerHTML = "";
          for (let w of b) {
            const q = t(w);
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
        (u) => H(u.target)
      ), m.addEventListener("focus", () => h(!0)), m.addEventListener(
        "blur",
        // Blur after properly selecting
        I(() => h(!1), 100)
      ), document.addEventListener("click", (u) => {
        C(u.target, this) || h(!1);
      }), _.addEventListener("combobox-commit", function(u) {
        const b = u.target.getAttribute(
          "data-feature-id"
        ), w = b ? r.getItem(b) : void 0;
        m.value = w ? `${w.name}, ${w.locality}` : m.value, document.dispatchEvent(
          new CustomEvent("search-selected", {
            bubbles: !0,
            detail: {
              mode: "assistant",
              key: m.name,
              item: w
            }
          })
        ), _.hidden = !0, f.clearSelection(), f.stop();
      });
    }
  }
  customElements.define("pw-autocomplete", l);
  const a = y`
    <div class="${n.buttonGroup}">
      <button type="submit" class="${n.button}" aria-disabled="true">
        <span>Finn avganger</span>
      </button>
    </div>
  `, c = (d, r = !0) => y`
    <div class="${n.inputBoxes}">
      <p class="${n.heading}">Når vil du reise?</p>
      <div>
        <div
          class="${n.selector_options} ${r ? "" : n.selector_options__small}"
        >
          <label class="${n.selector_option}">
            <input
              type="radio"
              name="searchTimeSelector"
              aria-label="Nå"
              class="${n.selector_option__input}"
              value="now"
              checked=""
            />
            <span aria-hidden="true" class="${n.selector_option__label}">
              <span class="${n.selector_option__text}">Nå</span>
            </span>
          </label>
          ${r ? y`
                <label class="${n.selector_option}">
                  <input
                    type="radio"
                    name="searchTimeSelector"
                    aria-label="Ankomst"
                    class="${n.selector_option__input}"
                    value="arriveBy"
                  />
                  <span
                    aria-hidden="true"
                    class="${n.selector_option__label}"
                  >
                    <span class="${n.selector_option__text}">Ankomst</span>
                  </span>
                </label>
              ` : ""}
          <label class="${n.selector_option}">
            <input
              type="radio"
              name="searchTimeSelector"
              aria-label="Avgang"
              class="${n.selector_option__input}"
              value="departBy"
            />
            <span aria-hidden="true" class="${n.selector_option__label}">
              <span class="${n.selector_option__text}">Avgang</span>
            </span>
          </label>
        </div>
        <div
          class="${n.selector_dateAndTimeSelectorsWrapper} js-search-date-details"
          hidden
        >
          <div class="${n.selector_dateAndTimeSelectors}">
            <div class="${n.selector_dateSelector}">
              <label for="${`${d}-searchTimeSelector-date`}">Dato</label>
              <input
                type="date"
                name="dateinput"
                id="${`${d}-searchTimeSelector-date`}"
              />
            </div>
            <div class="${n.selector_timeSelector}">
              <label for="${`${d}-searchTimeSelector-time`}">Tid</label>
              <input
                type="time"
                name="timeinput"
                step="60"
                id="${`${d}-searchTimeSelector-time`}"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  `, D = y`
    <form
      class="${n.form}"
      action="${e}/assistant"
      id="pw-form-assistant"
      method="get"
    >
      <div class="${n.main}">
        <div class="${n.inputBoxes}">
          <p class="${n.heading}">Hvor vil du reise?</p>
          <div class="${n.search_container}">
            <label
              class="${n.search_label}"
              for="pw-from-1-input"
              id="pw-from-1-label"
            >
              Fra
            </label>
            <div
              class="${n.search_inputContainer}"
              role="combobox"
              aria-expanded="false"
              aria-haspopup="listbox"
              aria-labelledby="pw-from-1-label"
            >
              <pw-autocomplete for="from-popup-1">
                <input
                  class="${n.search_input}"
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
                  class="${n.popupContainer}"
                  hidden
                ></ul>
              </pw-autocomplete>
            </div>
            <pw-geobutton mode="assistant">
              <button
                class="${n.button_geolocation}"
                title="Finn min posisjon"
                aria-label="Finn min posisjon"
                type="button"
              >
                <img
                  src="${e}/assets/mono/light/places/City.svg"
                  width="20"
                  height="20"
                  role="none"
                  alt=""
                />
              </button>
            </pw-geobutton>
          </div>
          <pw-messagebox></pw-messagebox>
          <div class="${n.search_container}">
            <label
              class="${n.search_label}"
              for="pw-to-1-input"
              id="pw-to-1-label"
            >
              Til
            </label>
            <div
              class="${n.search_inputContainer}"
              role="combobox"
              aria-expanded="false"
              aria-haspopup="listbox"
              aria-labelledby="pw-to-1-label"
            >
              <pw-autocomplete for="to-popup-1">
                <input
                  class="${n.search_input} ${n.search_inputLast}"
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
                  class="${n.popupContainer}"
                  hidden
                ></ul>
              </pw-autocomplete>
            </div>
          </div>
        </div>
        ${c("pw-assistant")}
      </div>
      ${a}
    </form>
  `, M = y`
    <form
      class="${n.form}"
      action="${e}/departures"
      id="pw-form-departures"
      method="get"
    >
      <div class="${n.main}">
        <div class="${n.inputBoxes}">
          <p class="${n.heading}">Hvor vil du reise fra?</p>
          <div class="${n.search_container}">
            <label
              class="${n.search_label}"
              for="pw-from-2-input"
              id="pw-from-2-label"
            >
              Fra
            </label>
            <div
              class="${n.search_inputContainer}"
              role="combobox"
              aria-expanded="false"
              aria-haspopup="listbox"
              aria-labelledby="pw-from-2-label"
            >
              <pw-autocomplete for="to-popup-2">
                <input
                  class="${n.search_input}"
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
                  class="${n.popupContainer}"
                  hidden
                ></ul>
              </pw-autocomplete>
            </div>
            <pw-geobutton mode="departure">
              <button
                class="${n.button_geolocation}"
                title="Finn min posisjon"
                aria-label="Finn min posisjon"
                type="button"
              >
                <img
                  src="${e}/assets/mono/light/places/City.svg"
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
        ${c("pw-departure", !1)}
      </div>
      ${a}
    </form>
  `;
  return y`
    <div class="${n.wrapper}">
      <nav class="${n.nav}">
        <ul class="${n.tabs} js-tablist">
          <li>
            <a
              href="/assistant"
              class="${n.tabSelected}"
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
      <div class="js-tabpanel" id="pw-assistant">${D}</div>
      <div class="js-tabpanel ${n.hidden}" id="pw-departures">
        ${M}
      </div>
    </div>
  `;
}
function Me() {
  var e;
  (e = document.querySelector(".js-tablist")) == null || e.addEventListener("click", function(t) {
    var a;
    const o = (a = t.target) == null ? void 0 : a.closest("a");
    if (!o)
      return;
    const s = o.getAttribute("href");
    if (!s)
      return;
    const i = s.replace("/", "");
    t.preventDefault();
    const l = document.querySelector("#pw-" + i);
    l && (S.clearMessageBox(), document.querySelectorAll(".js-tabpanel").forEach((c) => {
      c.classList.add(n.hidden);
    }), document.querySelectorAll(".js-tablist a").forEach((c) => {
      c.classList.remove(n.tabSelected);
    }), l.classList.remove(n.hidden), o.classList.add(n.tabSelected));
  });
}
function I(e, t) {
  let o = null;
  return function(...s) {
    clearTimeout(o), o = setTimeout(() => {
      e(...s);
    }, t);
  };
}
function g(e, t = [], o = "") {
  const s = document.createElement(e);
  if (Array.isArray(t))
    for (let i of t) {
      let l = typeof i == "string" ? document.createTextNode(i) : i;
      s.appendChild(l);
    }
  return s.className = o, s;
}
function He(e, t) {
  const o = parseInt(e, 10);
  return Number.isNaN(o) ? t : o;
}
function C(e, t) {
  return e === t ? !0 : !e || !e.parentElement ? !1 : C(e.parentElement, t);
}
function qe(e) {
  switch (Oe(e)[0]) {
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
function Oe(e) {
  return e.map(je).filter((t, o, s) => s.indexOf(t) === o);
}
function je(e) {
  switch (e) {
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
function Be(e, t) {
  const o = t ? {
    toId: t.id,
    toLon: t.geometry.coordinates[0].toString(),
    toLat: t.geometry.coordinates[1].toString(),
    toLayer: t.layer
  } : void 0;
  return {
    fromId: e.id,
    fromLon: e.geometry.coordinates[0].toString(),
    fromLat: e.geometry.coordinates[1].toString(),
    fromLayer: e.layer,
    ...o
  };
}
function Pe(e, t) {
  const o = t.mode !== "now" ? {
    searchMode: t.mode,
    searchTime: t.dateTime.toString()
  } : { searchMode: t.mode }, s = Be(
    e.from,
    e.to
  );
  return {
    ...o,
    ...s
  };
}
function Fe(e, t) {
  const o = t.mode !== "now" ? {
    searchMode: t.mode,
    searchTime: t.dateTime.toString()
  } : { searchMode: t.mode };
  return e.layer == "venue" ? {
    ...o,
    id: e.id
  } : {
    ...o,
    lon: e.geometry.coordinates[0].toString(),
    lat: e.geometry.coordinates[1].toString()
  };
}
async function Ne(e) {
  const t = `/api/departures/autocomplete?q=${e}`, o = await fetch(t);
  if (!o.ok)
    throw new Error(`Error fetching autocomplete data from ${t}`);
  return await o.json();
}
async function We(e) {
  const o = await (await fetch(
    `/api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`
  )).json();
  if (o)
    return o;
}
async function Ue() {
  return new Promise(function(e, t) {
    navigator.geolocation.getCurrentPosition(
      async (o) => {
        const s = await We(o.coords);
        e(s);
      },
      (o) => {
        t(new Error(Ve(o.code)));
      },
      { enableHighAccuracy: !0, timeout: 1e4 }
    );
  });
}
const T = {
  denied: "Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.",
  unavailable: "Posisjonen din er ikke tilgjengelig.",
  timeout: "Det tok for lang tid å hente posisjonen din. Prøv på nytt."
};
function Ve(e) {
  switch (e) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return T.denied;
    case GeolocationPositionError.TIMEOUT:
      return T.timeout;
    case GeolocationPositionError.POSITION_UNAVAILABLE:
    default:
      return T.unavailable;
  }
}
export {
  Ke as createWidget,
  We as reverse
};
