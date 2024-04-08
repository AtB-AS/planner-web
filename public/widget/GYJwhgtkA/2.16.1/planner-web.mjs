class H {
  constructor(e, i, { tabInsertsSuggestions: n, defaultFirstOption: a, scrollIntoViewOptions: r } = {}) {
    this.input = e, this.list = i, this.tabInsertsSuggestions = n ?? !0, this.defaultFirstOption = a ?? !1, this.scrollIntoViewOptions = r ?? { block: "nearest", inline: "nearest" }, this.isComposing = !1, i.id || (i.id = `combobox-${Math.random().toString().slice(2, 6)}`), this.ctrlBindings = !!navigator.userAgent.match(/Macintosh/), this.keyboardEventHandler = (u) => F(u, this), this.compositionEventHandler = (u) => N(u, this), this.inputHandler = this.clearSelection.bind(this), e.setAttribute("role", "combobox"), e.setAttribute("aria-controls", i.id), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-autocomplete", "list"), e.setAttribute("aria-haspopup", "listbox");
  }
  destroy() {
    this.clearSelection(), this.stop(), this.input.removeAttribute("role"), this.input.removeAttribute("aria-controls"), this.input.removeAttribute("aria-expanded"), this.input.removeAttribute("aria-autocomplete"), this.input.removeAttribute("aria-haspopup");
  }
  start() {
    this.input.setAttribute("aria-expanded", "true"), this.input.addEventListener("compositionstart", this.compositionEventHandler), this.input.addEventListener("compositionend", this.compositionEventHandler), this.input.addEventListener("input", this.inputHandler), this.input.addEventListener("keydown", this.keyboardEventHandler), this.list.addEventListener("mousedown", I), this.indicateDefaultOption();
  }
  stop() {
    this.clearSelection(), this.input.setAttribute("aria-expanded", "false"), this.input.removeEventListener("compositionstart", this.compositionEventHandler), this.input.removeEventListener("compositionend", this.compositionEventHandler), this.input.removeEventListener("input", this.inputHandler), this.input.removeEventListener("keydown", this.keyboardEventHandler), this.list.removeEventListener("mousedown", I);
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
    let r = e === 1 ? 0 : n.length - 1;
    if (i && a >= 0) {
      const p = a + e;
      p >= 0 && p < n.length && (r = p);
    }
    const u = n[r];
    if (u)
      for (const p of n)
        p.removeAttribute("data-combobox-option-default"), u === p ? (this.input.setAttribute("aria-activedescendant", u.id), u.setAttribute("aria-selected", "true"), W(u), u.scrollIntoView(this.scrollIntoViewOptions)) : p.removeAttribute("aria-selected");
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
  e && e.getAttribute("aria-disabled") !== "true" && M(e, { event: t });
}
function C(t, e) {
  const i = e.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');
  return i ? (i.getAttribute("aria-disabled") === "true" || M(i), !0) : !1;
}
function M(t, e) {
  t.dispatchEvent(new CustomEvent("combobox-commit", { bubbles: !0, detail: e }));
}
function W(t) {
  t.dispatchEvent(new Event("combobox-select", { bubbles: !0 }));
}
function T(t) {
  return !t.hidden && !(t instanceof HTMLInputElement && t.type === "hidden") && (t.offsetWidth > 0 || t.offsetHeight > 0);
}
function N(t, e) {
  e.isComposing = t.type === "compositionstart", document.getElementById(e.input.getAttribute("aria-controls") || "") && e.clearSelection();
}
const x = "theme-module__light", R = '"../page-modules/assistant/assistant.module.css"', G = '"../page-modules/departures/departures.module.css"', K = '"../components/search/search.module.css"', U = '"../modules/search-time/selector/selector.module.css"', V = '"../components/button/button.module.css"', Q = "widget-module__hidden", J = "widget-module__lightWrapper theme-module__light", Y = "widget-module__wrapper theme-module__override-light", z = "widget-module__form assistant-module__container", X = "widget-module__nav", Z = "widget-module__tabs", ee = "widget-module__tabSelected", te = "widget-module__main assistant-module__main", oe = "widget-module__heading assistant-module__heading", ne = "widget-module__inputBoxes", ie = "widget-module__search_container search-module__container", ae = "widget-module__search_inputContainer search-module__inputContainer", re = "widget-module__search_label search-module__label typography-module__typo-body__secondary", se = "widget-module__search_input search-module__input", le = "widget-module__search_inputLast", ce = "widget-module__button_geolocation departures-module__geolocationButton", ue = "widget-module__selector_group selector-module__departureDateSelector", de = "widget-module__selector_options selector-module__options", pe = "widget-module__selector_options__small selector-module__options", me = "widget-module__selector_option selector-module__option", he = "widget-module__selector_option__text selector-module__option__text", _e = "widget-module__selector_option__label selector-module__option__label", ge = "widget-module__selector_option__input selector-module__option__input", fe = "widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper", be = "widget-module__selector_dateAndTimeSelectorsWrapper__hidden", ve = "widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors", we = "widget-module__selector_dateSelector selector-module__dateSelector", ye = "widget-module__selector_timeSelector selector-module__timeSelector", $e = "widget-module__buttonGroup", Se = "widget-module__button", Ee = "widget-module__buttonLightOutline", Te = "widget-module__listItem", Le = "widget-module__itemIcon", Ae = "widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary", ke = "widget-module__popupContainer search-module__menu", Ie = "widget-module__messageBox", o = {
  "override-light": "theme-module__override-light",
  light: x,
  assistant: R,
  departures: G,
  search: K,
  selector: U,
  buttonComponent: V,
  hidden: Q,
  lightWrapper: J,
  wrapper: Y,
  form: z,
  nav: X,
  tabs: Z,
  tabSelected: ee,
  main: te,
  heading: oe,
  inputBoxes: ne,
  search_container: ie,
  search_inputContainer: ae,
  search_label: re,
  search_input: se,
  search_inputLast: le,
  button_geolocation: ce,
  selector_group: ue,
  selector_options: de,
  selector_options__small: pe,
  selector_option: me,
  selector_option__text: he,
  selector_option__label: _e,
  selector_option__input: ge,
  selector_dateAndTimeSelectorsWrapper: fe,
  selector_dateAndTimeSelectorsWrapper__hidden: be,
  selector_dateAndTimeSelectors: ve,
  selector_dateSelector: we,
  selector_timeSelector: ye,
  buttonGroup: $e,
  button: Se,
  buttonLightOutline: Ee,
  "button--disabled": "widget-module__button--disabled",
  listItem: Te,
  itemIcon: Le,
  itemLocality: Ae,
  popupContainer: ke,
  messageBox: Ie
};
var O = { MODULE_VERSION: "2.16.1", COMPRESSED_ORG: "GYJwhgtkA", ORG_ID: "fram" };
const Ce = 300, y = String.raw, L = O.MODULE_VERSION, A = O.COMPRESSED_ORG;
function De(t) {
  if (!(t != null && t.startsWith("http")))
    throw new Error("Missing urlBase in correct schema.");
  return t.endsWith("/") || (t += "/"), {
    URL_BASE: t,
    URL_JS_UMD: `${t}widget/${A}/${L}/planner-web.umd.js`,
    URL_JS_ESM: `${t}widget/${A}/${L}/planner-web.mjs`,
    URL_CSS: `${t}widget/${A}/${L}/planner-web.css`
  };
}
function Xe({
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
      const u = a.currentTarget.value === "now";
      document.querySelectorAll(".js-search-date-details").forEach((p) => {
        p.hidden = u;
      });
    });
  }), (e = document.querySelector("#pw-form-departures")) == null || e.addEventListener("submit", (n) => {
    n.preventDefault();
    const a = n.currentTarget;
    Be(a, t.from);
  }), (i = document.querySelector("#pw-form-assistant")) == null || i.addEventListener("submit", (n) => {
    n.preventDefault();
    const a = n.currentTarget;
    Oe(a, t.from, t.to);
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
      const n = /* @__PURE__ */ new Date(), a = String(n.getHours()).padStart(2, "0"), r = String(n.getMinutes()).padStart(2, "0");
      i.value = `${a}:${r}`;
    }
  } catch {
  }
}
function B(t, e) {
  const i = t.get(`${e}-searchTimeSelector`);
  if (i === "now")
    return {
      mode: "now"
    };
  {
    const n = t.get("dateinput"), a = t.get("timeinput");
    if (n && a) {
      const r = /* @__PURE__ */ new Date(`${n}T${a}`);
      return {
        mode: i == "arriveBy" ? "arriveBy" : "departBy",
        dateTime: r.getTime()
      };
    }
    return {
      mode: "now"
    };
  }
}
function Oe(t, e, i) {
  const n = t.action, a = B(new FormData(t), "pw-assistant"), r = Re({ from: e, to: i }, a), u = new URLSearchParams(r);
  window.location.href = `${n}?${u.toString()}`;
}
function Be(t, e) {
  const i = t.action, n = B(new FormData(t), "pw-departures"), a = Ge(n, e), r = new URLSearchParams(a);
  (e == null ? void 0 : e.layer) === "venue" ? window.location.href = `${i}/${e.id}?${r.toString()}` : window.location.href = `${i}?${r.toString()}`;
}
class E extends HTMLElement {
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
function Pe({ URL_BASE: t }, e) {
  function i(s) {
    const c = a(s), h = v("span", [s.name]), d = v("span", [s.locality ?? ""], o.itemLocality), l = v("li", [c, h, d], o.listItem);
    return l.role = "option", l.setAttribute("data-feature-id", s.id), l;
  }
  function n(s) {
    const c = v("span", [s]);
    return v("li", [c], o.listItem);
  }
  function a(s) {
    const c = Fe(s.category), h = v("img");
    h.src = `${t}assets/mono/light/${c.icon}.svg`, h.alt = c.alt, h.role = "img";
    const d = v("div", [h], o.itemIcon);
    return d.ariaHidden = "true", d;
  }
  class r extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const c = this;
      this.querySelector("button").addEventListener("click", async () => {
        var d;
        E.clearMessageBox();
        try {
          const l = await Ve(t, e), g = (d = c.parentElement) == null ? void 0 : d.querySelector("input");
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
  customElements.define("pw-geobutton", r), customElements.define("pw-messagebox", E);
  class u extends HTMLElement {
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
      const c = this, h = He(
        this.getAttribute("data-debounce-ms"),
        Ce
      ), d = this.querySelector("input"), l = this.querySelector(
        "#" + this.getAttribute("for")
      );
      let g = new H(d, l, {
        tabInsertsSuggestions: !0,
        scrollIntoViewOptions: !1
      });
      function w(m) {
        m ? g.start() : (g.clearSelection(), g.stop()), l.hidden = !m;
      }
      function k() {
        c.setItems([]), l.innerHTML = "";
        const m = n(e.noResults);
        l.appendChild(m), w(!0);
      }
      const q = qe(async (m) => {
        try {
          if (!m.value) {
            l.innerHTML = "";
            return;
          }
          const f = await Ke(t, m.value);
          if (f.length === 0)
            return k();
          c.setItems(f), l.innerHTML = "";
          for (let b of f) {
            const S = i(b);
            l.appendChild(S);
          }
          w(!0);
        } catch {
          k();
        }
      }, h);
      d.addEventListener("keydown", (m) => {
        m.key === "Escape" && w(!1);
      }), d.addEventListener(
        "input",
        (m) => q(m.target)
      ), d.addEventListener("focus", () => w(!0)), d.addEventListener("blur", () => w(!1)), document.addEventListener("click", (m) => {
        P(m.target, this) || w(!1);
      }), l.addEventListener("combobox-commit", function(m) {
        const f = m.target.getAttribute(
          "data-feature-id"
        ), b = f ? c.getItem(f) : void 0;
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
  customElements.define("pw-autocomplete", u);
  const p = y`
    <div class="${o.buttonGroup}">
      <button
        type="submit"
        class="${o.buttonLightOutline}"
      >
        <span>${e.searchButton}</span>
      </button>
    </div>
  `, $ = (s, c = !0) => y`
    <fieldset class="${o.inputBoxes}">
      <legend class="${o.heading}">${e.searchTime.title}</legend>
      <div>
        <div
          class="${o.selector_options} ${c ? "" : o.selector_options__small}"
        >
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="${s}-searchTimeSelector"
              class="${o.selector_option__input}"
              value="now"
              checked=""
            />
            <span class="${o.selector_option__label}">
              <span class="${o.selector_option__text}" id="${s}-now">
                ${e.searchTime.now}
              </span>
            </span>
          </label>
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="${s}-searchTimeSelector"
              class="${o.selector_option__input}"
              value="departBy"
            />
            <span class="${o.selector_option__label}">
              <span
                class="${o.selector_option__text}"
                id="${s}-depart"
              >
                ${e.searchTime.depart}
              </span>
            </span>
          </label>
          ${c ? y`
                <label class="${o.selector_option}">
                  <input
                    type="radio"
                    name="${s}-searchTimeSelector"
                    class="${o.selector_option__input}"
                    value="arriveBy"
                  />
                  <span class="${o.selector_option__label}">
                    <span
                      class="${o.selector_option__text}"
                      id="${s}-arrival"
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
              <label for="${`${s}-searchTimeSelector-date`}">
                ${e.searchTime.date}
              </label>
              <input
                type="date"
                name="dateinput"
                id="${`${s}-searchTimeSelector-date`}"
              />
            </div>
            <div class="${o.selector_timeSelector}">
              <label for="${`${s}-searchTimeSelector-time`}">
                ${e.searchTime.time}
              </label>
              <input
                type="time"
                name="timeinput"
                step="60"
                id="${`${s}-searchTimeSelector-time`}"
              />
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  `, _ = y`
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
        ${$("pw-assistant")}
      </div>
      ${p}
    </form>
  `, j = y`
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
        ${$("pw-departures", !1)}
      </div>
      ${p}
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
      <div class="js-tabpanel" id="pw-assistant">${_}</div>
      <div class="js-tabpanel ${o.hidden}" id="pw-departures">
        ${j}
      </div>
    </div>
  `;
}
function je() {
  var t;
  (t = document.querySelector(".js-tablist")) == null || t.addEventListener("click", function(e) {
    var p, $;
    e.preventDefault();
    const i = (p = e.target) == null ? void 0 : p.closest("a");
    if (!i)
      return;
    const n = i.getAttribute("data-mode");
    if (!n)
      return;
    const a = document.querySelector("#pw-" + n);
    if (!a)
      return;
    E.clearMessageBox(), document.querySelectorAll(".js-tabpanel").forEach((_) => {
      _.classList.add(o.hidden);
    }), document.querySelectorAll(".js-tablist a").forEach((_) => {
      _.classList.remove(o.tabSelected);
    }), a.classList.remove(o.hidden), i.classList.add(o.tabSelected);
    const r = document.querySelectorAll(
      `input[type="radio"][name="pw-${n}-searchTimeSelector"]`
    ), u = ($ = Array.from(r).find(
      (_) => _.checked
    )) == null ? void 0 : $.value;
    document.querySelectorAll(".js-search-date-details").forEach((_) => {
      _.hidden = u === "now";
    }), document.dispatchEvent(
      new CustomEvent("reset-search", {
        bubbles: !0
      })
    );
  });
}
function qe(t, e) {
  let i = null;
  return function(...n) {
    clearTimeout(i), i = setTimeout(() => {
      t(...n);
    }, e);
  };
}
function v(t, e = [], i = "") {
  const n = document.createElement(t);
  if (Array.isArray(e))
    for (let a of e) {
      let r = typeof a == "string" ? document.createTextNode(a) : a;
      n.appendChild(r);
    }
  return n.className = i, n;
}
function He(t, e) {
  const i = parseInt(t, 10);
  return Number.isNaN(i) ? e : i;
}
function P(t, e) {
  return t === e ? !0 : !t || !t.parentElement ? !1 : P(t.parentElement, e);
}
function Fe(t) {
  switch (We(t)[0]) {
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
function We(t) {
  return t.map(Ne).filter((e, i, n) => n.indexOf(e) === i);
}
function Ne(t) {
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
function xe(t, e) {
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
function Re(t, e) {
  const i = e.mode !== "now" ? {
    searchMode: e.mode,
    searchTime: e.dateTime.toString()
  } : { searchMode: e.mode }, n = xe(
    t.from,
    t.to
  );
  return {
    ...i,
    ...n
  };
}
function Ge(t, e) {
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
async function Ke(t, e) {
  const i = `${t}api/departures/autocomplete?q=${e}`, n = await fetch(i);
  if (!n.ok)
    throw new Error(`Error fetching autocomplete data from ${i}`);
  return await n.json();
}
async function Ue(t, e) {
  const n = await (await fetch(
    `${t}api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`
  )).json();
  if (n)
    return n;
}
async function Ve(t, e) {
  return new Promise(function(i, n) {
    navigator.geolocation.getCurrentPosition(
      async (a) => {
        const r = await Ue(t, a.coords);
        i(r);
      },
      (a) => {
        n(new Error(Qe(a.code, e)));
      },
      { enableHighAccuracy: !0, timeout: 1e4 }
    );
  });
}
function Qe(t, e) {
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
const Je = {
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
  return Je[t];
}
export {
  Xe as createWidget,
  Ue as reverse
};
