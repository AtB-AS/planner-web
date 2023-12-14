class j {
  constructor(t, n, { tabInsertsSuggestions: s, defaultFirstOption: i, scrollIntoViewOptions: l } = {}) {
    this.input = t, this.list = n, this.tabInsertsSuggestions = s ?? !0, this.defaultFirstOption = i ?? !1, this.scrollIntoViewOptions = l, this.isComposing = !1, n.id || (n.id = `combobox-${Math.random().toString().slice(2, 6)}`), this.ctrlBindings = !!navigator.userAgent.match(/Macintosh/), this.keyboardEventHandler = (a) => B(a, this), this.compositionEventHandler = (a) => N(a, this), this.inputHandler = this.clearSelection.bind(this), t.setAttribute("role", "combobox"), t.setAttribute("aria-controls", n.id), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-autocomplete", "list"), t.setAttribute("aria-haspopup", "listbox");
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
    var t;
    this.defaultFirstOption && ((t = Array.from(this.list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')).filter($)[0]) === null || t === void 0 || t.setAttribute("data-combobox-option-default", "true"));
  }
  navigate(t = 1) {
    const n = Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter($)[0], s = Array.from(this.list.querySelectorAll('[role="option"]')).filter($), i = s.indexOf(n);
    if (i === s.length - 1 && t === 1 || i === 0 && t === -1) {
      this.clearSelection(), this.input.focus();
      return;
    }
    let l = t === 1 ? 0 : s.length - 1;
    if (n && i >= 0) {
      const c = i + t;
      c >= 0 && c < s.length && (l = c);
    }
    const a = s[l];
    if (a)
      for (const c of s)
        c.removeAttribute("data-combobox-option-default"), a === c ? (this.input.setAttribute("aria-activedescendant", a.id), a.setAttribute("aria-selected", "true"), W(a), a.scrollIntoView(this.scrollIntoViewOptions)) : c.removeAttribute("aria-selected");
  }
  clearSelection() {
    this.input.removeAttribute("aria-activedescendant");
    for (const t of this.list.querySelectorAll('[aria-selected="true"]'))
      t.removeAttribute("aria-selected");
    this.indicateDefaultOption();
  }
}
function B(e, t) {
  if (!(e.shiftKey || e.metaKey || e.altKey) && !(!t.ctrlBindings && e.ctrlKey) && !t.isComposing)
    switch (e.key) {
      case "Enter":
        k(t.input, t.list) && e.preventDefault();
        break;
      case "Tab":
        t.tabInsertsSuggestions && k(t.input, t.list) && e.preventDefault();
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
function L(e) {
  if (!(e.target instanceof Element))
    return;
  const t = e.target.closest('[role="option"]');
  t && t.getAttribute("aria-disabled") !== "true" && F(t, { event: e });
}
function k(e, t) {
  const n = t.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');
  return n ? (n.getAttribute("aria-disabled") === "true" || n.click(), !0) : !1;
}
function F(e, t) {
  e.dispatchEvent(new CustomEvent("combobox-commit", { bubbles: !0, detail: t }));
}
function W(e) {
  e.dispatchEvent(new Event("combobox-select", { bubbles: !0 }));
}
function $(e) {
  return !e.hidden && !(e instanceof HTMLInputElement && e.type === "hidden") && (e.offsetWidth > 0 || e.offsetHeight > 0);
}
function N(e, t) {
  t.isComposing = e.type === "compositionstart", document.getElementById(t.input.getAttribute("aria-controls") || "") && t.clearSelection();
}
const G = "theme-module__light", R = '"../page-modules/assistant/assistant.module.css"', U = '"../page-modules/departures/departures.module.css"', V = '"../components/search/search.module.css"', K = '"../modules/search-time/selector/selector.module.css"', Q = '"../components/button/button.module.css"', J = "widget-module__hidden", Y = "widget-module__lightWrapper theme-module__light", z = "widget-module__wrapper theme-module__override-light", X = "widget-module__form assistant-module__container", Z = "widget-module__nav", ee = "widget-module__tabs", te = "widget-module__tabSelected", oe = "widget-module__main assistant-module__main", ne = "widget-module__heading assistant-module__heading", se = "widget-module__inputBoxes", ie = "widget-module__search_container search-module__container", ae = "widget-module__search_inputContainer search-module__inputContainer", re = "widget-module__search_label search-module__label typography-module__typo-body__secondary", le = "widget-module__search_input search-module__input", ce = "widget-module__search_inputLast", de = "widget-module__button_geolocation departures-module__geolocationButton", ue = "widget-module__selector_group selector-module__departureDateSelector", pe = "widget-module__selector_options selector-module__options", me = "widget-module__selector_options__small selector-module__options", _e = "widget-module__selector_option selector-module__option selector-module__option", he = "widget-module__selector_option__text selector-module__option__text", fe = "widget-module__selector_option__label selector-module__option__label", be = "widget-module__selector_option__input selector-module__option__input", ge = "widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper", ve = "widget-module__selector_dateAndTimeSelectorsWrapper__hidden", we = "widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors", ye = "widget-module__selector_dateSelector selector-module__dateSelector", Se = "widget-module__selector_timeSelector selector-module__timeSelector", $e = "widget-module__buttonGroup", Ee = "widget-module__button", Te = "widget-module__listItem", Ae = "widget-module__itemIcon", Le = "widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary", ke = "widget-module__popupContainer search-module__menu", Ie = "widget-module__messageBox", o = {
  "override-light": "theme-module__override-light",
  light: G,
  assistant: R,
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
  inputBoxes: se,
  search_container: ie,
  search_inputContainer: ae,
  search_label: re,
  search_input: le,
  search_inputLast: ce,
  button_geolocation: de,
  selector_group: ue,
  selector_options: pe,
  selector_options__small: me,
  selector_option: _e,
  selector_option__text: he,
  selector_option__label: fe,
  selector_option__input: be,
  selector_dateAndTimeSelectorsWrapper: ge,
  selector_dateAndTimeSelectorsWrapper__hidden: ve,
  selector_dateAndTimeSelectors: we,
  selector_dateSelector: ye,
  selector_timeSelector: Se,
  buttonGroup: $e,
  button: Ee,
  "button--disabled": "widget-module__button--disabled",
  listItem: Te,
  itemIcon: Ae,
  itemLocality: Le,
  popupContainer: ke,
  messageBox: Ie
};
var C = { MODULE_VERSION: "2.0.0", COMPRESSED_ORG: "GYJwhgtkA" };
const xe = 300, y = String.raw, E = C.MODULE_VERSION, T = C.COMPRESSED_ORG;
function Ce(e) {
  if (!(e != null && e.startsWith("http")))
    throw new Error("Missing urlBase in correct schema.");
  return e.endsWith("/") || (e += "/"), {
    URL_BASE: e,
    URL_JS_UMD: `${e}widget/${T}/${E}/planner-web.umd.js`,
    URL_JS_ESM: `${e}widget/${T}/${E}/planner-web.mjs`,
    URL_CSS: `${e}widget/${T}/${E}/planner-web.css`
  };
}
function Je({ urlBase: e }) {
  const t = Ce(e);
  return {
    output: He(t),
    init: De,
    urls: t
  };
}
function De() {
  var t, n;
  Pe(), I("pw-assistant"), I("pw-departure");
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
    Oe(i, e.from);
  }), (n = document.querySelector("#pw-form-assistant")) == null || n.addEventListener("submit", (s) => {
    s.preventDefault();
    const i = s.currentTarget;
    Me(i, e.from, e.to);
  });
}
function I(e) {
  const t = document.querySelector(
    `#${e}-searchTimeSelector-date`
  ), n = document.querySelector(
    `#${e}-searchTimeSelector-time`
  );
  try {
    if (t && (t.valueAsDate = /* @__PURE__ */ new Date()), n) {
      const s = /* @__PURE__ */ new Date();
      s.setSeconds(0), s.setMilliseconds(0), n.valueAsDate = s;
    }
  } catch {
  }
}
function D(e) {
  const t = e.get("searchTimeSelector");
  if (t === "now")
    return {
      mode: "now"
    };
  {
    const n = e.get("dateinput"), s = e.get("timeinput");
    if (n && s) {
      const i = /* @__PURE__ */ new Date(`${n}T${s}`);
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
function Me(e, t, n) {
  const s = e.action, i = D(new FormData(e)), l = Ne({ from: t, to: n }, i), a = new URLSearchParams(l);
  window.location.href = `${s}?${a.toString()}`;
}
function Oe(e, t) {
  const n = e.action, s = D(new FormData(e)), i = Ge(t, s), l = new URLSearchParams(i);
  window.location.href = `${n}?${l.toString()}`;
}
class S extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const t = this;
    t.hidden = !0, t.classList.add(o.messageBox), document.addEventListener("pw-errorMessage", function(n) {
      const s = n;
      t.textContent = s.detail.message, t.hidden = !1;
    }), document.addEventListener("pw-errorMessage-clear", function(n) {
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
function He({ URL_BASE: e }) {
  function t(d) {
    const r = s(d), p = g("span", [d.name]), m = g("span", [d.locality ?? ""], o.itemLocality), _ = g("li", [r, p, m], o.listItem);
    return _.role = "option", _.setAttribute("data-feature-id", d.id), _;
  }
  function n(d) {
    const r = g("span", [d]);
    return g("li", [r], o.listItem);
  }
  function s(d) {
    const r = je(d.category), p = g("img");
    p.src = `${e}assets/mono/light/${r.icon}.svg`, p.alt = r.alt, p.role = "img";
    const m = g("div", [p], o.itemIcon);
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
          const h = await Ve(), v = (f = r.parentElement) == null ? void 0 : f.querySelector("input");
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
      const r = this, p = qe(
        this.getAttribute("data-debounce-ms"),
        xe
      ), m = this.querySelector("input"), _ = this.querySelector(
        "#" + this.getAttribute("for")
      );
      let f = new j(m, _, {
        scrollIntoViewOptions: !1
      });
      function h(u) {
        u ? f.start() : (f.clearSelection(), f.stop()), _.hidden = !u;
      }
      function v() {
        r.setItems([]), _.innerHTML = "";
        const u = n("Ingen resultater");
        _.appendChild(u), h(!0);
      }
      const P = x(async (u) => {
        try {
          if (!u.value) {
            _.innerHTML = "";
            return;
          }
          const b = await Re(u.value);
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
        (u) => P(u.target)
      ), m.addEventListener("focus", () => h(!0)), m.addEventListener(
        "blur",
        // Blur after properly selecting
        x(() => h(!1), 100)
      ), document.addEventListener("click", (u) => {
        M(u.target, this) || h(!1);
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
    <div class="${o.buttonGroup}">
      <button type="submit" class="${o.button}" aria-disabled="true">
        <span>Finn avganger</span>
      </button>
    </div>
  `, c = (d, r = !0) => y`
    <div class="${o.inputBoxes}">
      <p class="${o.heading}">Når vil du reise?</p>
      <div>
        <div
          class="${o.selector_options} ${r ? "" : o.selector_options__small}"
        >
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="searchTimeSelector"
              aria-label="Nå"
              class="${o.selector_option__input}"
              value="now"
              checked=""
            />
            <span aria-hidden="true" class="${o.selector_option__label}">
              <span class="${o.selector_option__text}">Nå</span>
            </span>
          </label>
          ${r ? y`
                <label class="${o.selector_option}">
                  <input
                    type="radio"
                    name="searchTimeSelector"
                    aria-label="Ankomst"
                    class="${o.selector_option__input}"
                    value="arriveBy"
                  />
                  <span
                    aria-hidden="true"
                    class="${o.selector_option__label}"
                  >
                    <span class="${o.selector_option__text}">Ankomst</span>
                  </span>
                </label>
              ` : ""}
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="searchTimeSelector"
              aria-label="Avgang"
              class="${o.selector_option__input}"
              value="departBy"
            />
            <span aria-hidden="true" class="${o.selector_option__label}">
              <span class="${o.selector_option__text}">Avgang</span>
            </span>
          </label>
        </div>
        <div
          class="${o.selector_dateAndTimeSelectorsWrapper} js-search-date-details"
          hidden
        >
          <div class="${o.selector_dateAndTimeSelectors}">
            <div class="${o.selector_dateSelector}">
              <label for="${`${d}-searchTimeSelector-date`}">Dato</label>
              <input
                type="date"
                name="dateinput"
                id="${`${d}-searchTimeSelector-date`}"
              />
            </div>
            <div class="${o.selector_timeSelector}">
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
  `, O = y`
    <form
      class="${o.form}"
      action="${e}/assistant"
      id="pw-form-assistant"
      method="get"
    >
      <div class="${o.main}">
        <div class="${o.inputBoxes}">
          <p class="${o.heading}">Hvor vil du reise?</p>
          <div class="${o.search_container}">
            <label
              class="${o.search_label}"
              for="pw-from-1-input"
              id="pw-from-1-label"
            >
              Fra
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
                  placeholder="adresse, kai eller holdeplass"
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
          <div class="${o.search_container}">
            <label
              class="${o.search_label}"
              for="pw-to-1-input"
              id="pw-to-1-label"
            >
              Til
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
                  placeholder="adresse, kai eller holdeplass"
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
        ${c("pw-assistant")}
      </div>
      ${a}
    </form>
  `, H = y`
    <form
      class="${o.form}"
      action="${e}/departures"
      id="pw-form-departures"
      method="get"
    >
      <div class="${o.main}">
        <div class="${o.inputBoxes}">
          <p class="${o.heading}">Hvor vil du reise fra?</p>
          <div class="${o.search_container}">
            <label
              class="${o.search_label}"
              for="pw-from-2-input"
              id="pw-from-2-label"
            >
              Fra
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
                  placeholder="adresse, kai eller holdeplass"
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
    <div class="${o.wrapper} ${o.lightWrapper}">
      <nav class="${o.nav}">
        <ul class="${o.tabs} js-tablist">
          <li>
            <a
              href="/assistant"
              class="${o.tabSelected}"
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
      <div class="js-tabpanel" id="pw-assistant">${O}</div>
      <div class="js-tabpanel ${o.hidden}" id="pw-departures">
        ${H}
      </div>
    </div>
  `;
}
function Pe() {
  var e;
  (e = document.querySelector(".js-tablist")) == null || e.addEventListener("click", function(t) {
    var a;
    const n = (a = t.target) == null ? void 0 : a.closest("a");
    if (!n)
      return;
    const s = n.getAttribute("href");
    if (!s)
      return;
    const i = s.replace("/", "");
    t.preventDefault();
    const l = document.querySelector("#pw-" + i);
    l && (S.clearMessageBox(), document.querySelectorAll(".js-tabpanel").forEach((c) => {
      c.classList.add(o.hidden);
    }), document.querySelectorAll(".js-tablist a").forEach((c) => {
      c.classList.remove(o.tabSelected);
    }), l.classList.remove(o.hidden), n.classList.add(o.tabSelected));
  });
}
function x(e, t) {
  let n = null;
  return function(...s) {
    clearTimeout(n), n = setTimeout(() => {
      e(...s);
    }, t);
  };
}
function g(e, t = [], n = "") {
  const s = document.createElement(e);
  if (Array.isArray(t))
    for (let i of t) {
      let l = typeof i == "string" ? document.createTextNode(i) : i;
      s.appendChild(l);
    }
  return s.className = n, s;
}
function qe(e, t) {
  const n = parseInt(e, 10);
  return Number.isNaN(n) ? t : n;
}
function M(e, t) {
  return e === t ? !0 : !e || !e.parentElement ? !1 : M(e.parentElement, t);
}
function je(e) {
  switch (Be(e)[0]) {
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
function Be(e) {
  return e.map(Fe).filter((t, n, s) => s.indexOf(t) === n);
}
function Fe(e) {
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
function We(e, t) {
  const n = t ? {
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
    ...n
  };
}
function Ne(e, t) {
  const n = t.mode !== "now" ? {
    searchMode: t.mode,
    searchTime: t.dateTime.toString()
  } : { searchMode: t.mode }, s = We(
    e.from,
    e.to
  );
  return {
    ...n,
    ...s
  };
}
function Ge(e, t) {
  const n = t.mode !== "now" ? {
    searchMode: t.mode,
    searchTime: t.dateTime.toString()
  } : { searchMode: t.mode };
  return e.layer == "venue" ? {
    ...n,
    id: e.id
  } : {
    ...n,
    lon: e.geometry.coordinates[0].toString(),
    lat: e.geometry.coordinates[1].toString()
  };
}
async function Re(e) {
  const t = `/api/departures/autocomplete?q=${e}`, n = await fetch(t);
  if (!n.ok)
    throw new Error(`Error fetching autocomplete data from ${t}`);
  return await n.json();
}
async function Ue(e) {
  const n = await (await fetch(
    `/api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`
  )).json();
  if (n)
    return n;
}
async function Ve() {
  return new Promise(function(e, t) {
    navigator.geolocation.getCurrentPosition(
      async (n) => {
        const s = await Ue(n.coords);
        e(s);
      },
      (n) => {
        t(new Error(Ke(n.code)));
      },
      { enableHighAccuracy: !0, timeout: 1e4 }
    );
  });
}
const A = {
  denied: "Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.",
  unavailable: "Posisjonen din er ikke tilgjengelig.",
  timeout: "Det tok for lang tid å hente posisjonen din. Prøv på nytt."
};
function Ke(e) {
  switch (e) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return A.denied;
    case GeolocationPositionError.TIMEOUT:
      return A.timeout;
    case GeolocationPositionError.POSITION_UNAVAILABLE:
    default:
      return A.unavailable;
  }
}
export {
  Je as createWidget,
  Ue as reverse
};
