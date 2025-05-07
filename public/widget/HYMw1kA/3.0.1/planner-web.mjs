class P {
  constructor(e, o, { tabInsertsSuggestions: i, firstOptionSelectionMode: a, scrollIntoViewOptions: s } = {}) {
    this.input = e, this.list = o, this.tabInsertsSuggestions = i ?? !0, this.firstOptionSelectionMode = a ?? "none", this.scrollIntoViewOptions = s ?? { block: "nearest", inline: "nearest" }, this.isComposing = !1, o.id || (o.id = `combobox-${Math.random().toString().slice(2, 6)}`), this.ctrlBindings = !!navigator.userAgent.match(/Macintosh/), this.keyboardEventHandler = (c) => N(c, this), this.compositionEventHandler = (c) => W(c, this), this.inputHandler = this.clearSelection.bind(this), e.setAttribute("role", "combobox"), e.setAttribute("aria-controls", o.id), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-autocomplete", "list"), e.setAttribute("aria-haspopup", "listbox");
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
    const o = Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter(T)[0], i = Array.from(this.list.querySelectorAll('[role="option"]')).filter(T), a = i.indexOf(o);
    if (a === i.length - 1 && e === 1 || a === 0 && e === -1) {
      this.clearSelection(), this.input.focus();
      return;
    }
    let s = e === 1 ? 0 : i.length - 1;
    if (o && a >= 0) {
      const m = a + e;
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
function N(t, e) {
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
  const o = e.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');
  return o ? (o.getAttribute("aria-disabled") === "true" || M(o), !0) : !1;
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
function W(t, e) {
  e.isComposing = t.type === "compositionstart", document.getElementById(e.input.getAttribute("aria-controls") || "") && e.clearSelection();
}
const R = '"../page-modules/assistant/assistant.module.css"', G = '"../page-modules/departures/departures.module.css"', K = '"../components/search/search.module.css"', U = '"../modules/search-time/selector/selector.module.css"', V = '"../components/button/button.module.css"', Q = "widget-module__hidden", Y = "widget-module__wrapper", J = "widget-module__form assistant-module__container", z = "widget-module__nav", X = "widget-module__tabs", Z = "widget-module__tabSelected", ee = "widget-module__main assistant-module__main", te = "widget-module__heading assistant-module__heading", oe = "widget-module__inputBoxes", ne = "widget-module__search_container search-module__container", ie = "widget-module__search_inputContainer search-module__inputContainer", ae = "widget-module__search_label search-module__label typography-module__typo-body__secondary", se = "widget-module__search_input search-module__input", re = "widget-module__search_inputLast", le = "widget-module__button_geolocation departures-module__geolocationButton", ce = "widget-module__selector_group selector-module__departureDateSelector", ue = "widget-module__selector_options selector-module__options", de = "widget-module__selector_options__small selector-module__options", pe = "widget-module__selector_option selector-module__option", me = "widget-module__selector_option__text selector-module__option__text", he = "widget-module__selector_option__label selector-module__option__label", _e = "widget-module__selector_option__input selector-module__option__input", fe = "widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper", ge = "widget-module__selector_dateAndTimeSelectorsWrapper__hidden", be = "widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors", ve = "widget-module__selector_dateSelector selector-module__dateSelector", we = "widget-module__selector_timeSelector selector-module__timeSelector", ye = "widget-module__buttonGroup", $e = "widget-module__button", Se = "widget-module__buttonLightOutline", Ee = "widget-module__listItem", Te = "widget-module__itemIcon", Le = "widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary", Ae = "widget-module__popupContainer search-module__menu", ke = "widget-module__messageBox", Ce = "widget-module__inheritFont", Ie = "widget-module__singleColumnLayout", n = {
  assistant: R,
  departures: G,
  search: K,
  selector: U,
  buttonComponent: V,
  hidden: Q,
  wrapper: Y,
  form: J,
  nav: z,
  tabs: X,
  tabSelected: Z,
  main: ee,
  heading: te,
  inputBoxes: oe,
  search_container: ne,
  search_inputContainer: ie,
  search_label: ae,
  search_input: se,
  search_inputLast: re,
  button_geolocation: le,
  selector_group: ce,
  selector_options: ue,
  selector_options__small: de,
  selector_option: pe,
  selector_option__text: me,
  selector_option__label: he,
  selector_option__input: _e,
  selector_dateAndTimeSelectorsWrapper: fe,
  selector_dateAndTimeSelectorsWrapper__hidden: ge,
  selector_dateAndTimeSelectors: be,
  selector_dateSelector: ve,
  selector_timeSelector: we,
  buttonGroup: ye,
  button: $e,
  buttonLightOutline: Se,
  "button--disabled": "widget-module__button--disabled",
  listItem: Ee,
  itemIcon: Te,
  itemLocality: Le,
  popupContainer: Ae,
  messageBox: ke,
  inheritFont: Ce,
  singleColumnLayout: Ie
};
function De(t) {
  return Object.entries(t).reduce(function(e, o) {
    return o[1] ? e + " " + o[0] : e;
  }, "");
}
var B = { MODULE_VERSION: "3.0.1", COMPRESSED_ORG: "HYMw1kA", ORG_ID: "nfk" };
const Me = 300, y = String.raw, L = B.MODULE_VERSION, A = B.COMPRESSED_ORG;
function Be(t) {
  if (!(t != null && t.startsWith("http")))
    throw new Error("Missing urlBase in correct schema.");
  return t.endsWith("/") || (t += "/"), {
    URL_BASE: t,
    URL_JS_UMD: `${t}widget/${A}/${L}/planner-web.umd.js`,
    URL_JS_ESM: `${t}widget/${A}/${L}/planner-web.mjs`,
    URL_CSS: `${t}widget/${A}/${L}/planner-web.css`
  };
}
function et({
  urlBase: t,
  language: e = "en",
  outputOverrideOptions: o = {}
}) {
  const i = Xe(e), a = Be(t), s = {
    inheritFont: !1,
    singleColumnLayout: !1,
    ...o
  };
  return {
    output: qe(a, i, s),
    init: Fe,
    urls: a
  };
}
function Fe() {
  var e, o;
  He(), D("pw-assistant"), D("pw-departures");
  let t = {
    from: void 0,
    to: void 0
  };
  document.addEventListener("search-selected", function(i) {
    const a = i;
    t[a.detail.key] = a.detail.item;
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
    i.addEventListener("change", function(a) {
      const c = a.currentTarget.value === "now";
      document.querySelectorAll(".js-search-date-details").forEach((m) => {
        m.hidden = c;
      });
    });
  }), (e = document.querySelector("#pw-form-departures")) == null || e.addEventListener("submit", (i) => {
    i.preventDefault();
    const a = i.currentTarget;
    je(a, t.from);
  }), (o = document.querySelector("#pw-form-assistant")) == null || o.addEventListener("submit", (i) => {
    i.preventDefault();
    const a = i.currentTarget;
    Oe(a, t.from, t.to);
  });
}
function D(t) {
  const e = document.querySelector(
    `#${t}-searchTimeSelector-date`
  ), o = document.querySelector(
    `#${t}-searchTimeSelector-time`
  );
  try {
    if (e && (e.valueAsDate = /* @__PURE__ */ new Date()), o) {
      const i = /* @__PURE__ */ new Date(), a = String(i.getHours()).padStart(2, "0"), s = String(i.getMinutes()).padStart(2, "0");
      o.value = `${a}:${s}`;
    }
  } catch {
  }
}
function F(t, e) {
  const o = t.get(`${e}-searchTimeSelector`);
  if (o === "now")
    return {
      mode: "now"
    };
  {
    const i = t.get("dateinput"), a = t.get("timeinput");
    if (i && a) {
      const s = /* @__PURE__ */ new Date(`${i}T${a}`);
      return {
        mode: o == "arriveBy" ? "arriveBy" : "departBy",
        dateTime: s.getTime()
      };
    }
    return {
      mode: "now"
    };
  }
}
function Oe(t, e, o) {
  const i = t.action, a = F(new FormData(t), "pw-assistant"), s = Ke({ from: e, to: o }, a), c = new URLSearchParams(s);
  window.location.href = `${i}?${c.toString()}`;
}
function je(t, e) {
  const o = t.action, i = F(new FormData(t), "pw-departures"), a = Ue(i, e), s = new URLSearchParams(a);
  (e == null ? void 0 : e.layer) === "venue" ? window.location.href = `${o}/${e.id}?${s.toString()}` : window.location.href = `${o}?${s.toString()}`;
}
class E extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const e = this;
    e.hidden = !0, e.classList.add(n.messageBox), document.addEventListener("pw-errorMessage", function(o) {
      const i = o;
      e.textContent = i.detail.message, e.hidden = !1;
    }), document.addEventListener("pw-errorMessage-clear", function(o) {
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
function qe({ URL_BASE: t }, e, o) {
  function i(r) {
    const u = s(r), h = v("span", [r.name]), d = v("span", [r.locality ?? ""], n.itemLocality), l = v("li", [u, h, d], n.listItem);
    return l.role = "option", l.setAttribute("data-feature-id", r.id), l;
  }
  function a(r) {
    const u = v("span", [r]);
    return v("li", [u], n.listItem);
  }
  function s(r) {
    const u = xe(r.category), h = v("img");
    h.src = `${t}assets/mono/light/${u.icon}.svg`, h.alt = u.alt, h.role = "img";
    const d = v("div", [h], n.itemIcon);
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
          const l = await Ye(t, e), f = (d = u.parentElement) == null ? void 0 : d.querySelector("input");
          f && (f.value = l ? `${l.name}, ${l.locality}` : f.value), document.dispatchEvent(
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
        Me
      ), d = this.querySelector("input"), l = this.querySelector(
        "#" + this.getAttribute("for")
      );
      let f = new P(d, l, {
        tabInsertsSuggestions: !0,
        scrollIntoViewOptions: !1
      });
      function w(p) {
        p ? f.start() : (f.clearSelection(), f.stop()), l.hidden = !p;
      }
      function k() {
        u.setItems([]), l.innerHTML = "";
        const p = a(e.noResults);
        l.appendChild(p), w(!0);
      }
      const H = Pe(async (p) => {
        try {
          if (!p.value) {
            l.innerHTML = "";
            return;
          }
          const g = await Ve(t, p.value);
          if (g.length === 0)
            return k();
          u.setItems(g), l.innerHTML = "";
          for (let b of g) {
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
        (p) => H(p.target)
      ), d.addEventListener("focus", () => w(!0)), d.addEventListener("blur", () => w(!1)), document.addEventListener("click", (p) => {
        O(p.target, this) || w(!1);
      }), l.addEventListener("combobox-commit", function(p) {
        const g = p.target.getAttribute(
          "data-feature-id"
        ), b = g ? u.getItem(g) : void 0;
        let S = d.value;
        b && (S = `${b.name}`, b.locality && (S += `, ${b.locality}`)), d.value = S, document.dispatchEvent(
          new CustomEvent("search-selected", {
            bubbles: !0,
            detail: {
              key: d.name,
              item: b
            }
          })
        ), l.hidden = !0, f.clearSelection(), f.stop();
      });
    }
  }
  customElements.define("pw-autocomplete", m);
  const $ = (r) => y`
    <div class="${n.buttonGroup}">
      <button
        type="submit"
        class="${n.button}"
      >
        <span>${r}</span>
      </button>
    </div>
  `, _ = (r, u = !0) => y`
    <fieldset class="${n.inputBoxes}">
      <legend class="${n.heading}">${e.searchTime.title}</legend>
      <div>
        <div
          class="${n.selector_options} ${u ? "" : n.selector_options__small}"
        >
          <label class="${n.selector_option}">
            <input
              type="radio"
              name="${r}-searchTimeSelector"
              class="${n.selector_option__input}"
              value="now"
              checked=""
            />
            <span class="${n.selector_option__label}">
              <span class="${n.selector_option__text}" id="${r}-now">
                ${e.searchTime.now}
              </span>
            </span>
          </label>
          <label class="${n.selector_option}">
            <input
              type="radio"
              name="${r}-searchTimeSelector"
              class="${n.selector_option__input}"
              value="departBy"
            />
            <span class="${n.selector_option__label}">
              <span
                class="${n.selector_option__text}"
                id="${r}-depart"
              >
                ${e.searchTime.depart}
              </span>
            </span>
          </label>
          ${u ? y`
                <label class="${n.selector_option}">
                  <input
                    type="radio"
                    name="${r}-searchTimeSelector"
                    class="${n.selector_option__input}"
                    value="arriveBy"
                  />
                  <span class="${n.selector_option__label}">
                    <span
                      class="${n.selector_option__text}"
                      id="${r}-arrival"
                    >
                      ${e.searchTime.arrive}
                    </span>
                  </span>
                </label>
              ` : ""}
        </div>
        <div
          class="${n.selector_dateAndTimeSelectorsWrapper} js-search-date-details"
          hidden
        >
          <div class="${n.selector_dateAndTimeSelectors}">
            <div class="${n.selector_dateSelector}">
              <label for="${`${r}-searchTimeSelector-date`}">
                ${e.searchTime.date}
              </label>
              <input
                type="date"
                name="dateinput"
                id="${`${r}-searchTimeSelector-date`}"
              />
            </div>
            <div class="${n.selector_timeSelector}">
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
    </fieldset>
  `, j = y`
    <form
      class="${n.form}"
      action="${t}/assistant"
      id="pw-form-assistant"
      method="get"
    >
      <div class="${n.main}">
        <fieldset class="${n.inputBoxes}">
          <legend class="${n.heading}">${e.assistant.title}</legend>
          <div class="${n.search_container}">
            <label
              class="${n.search_label}"
              for="pw-from-1-input"
              id="pw-from-1-label"
            >
              ${e.assistant.from}
            </label>
            <div
              class="${n.search_inputContainer}"
              aria-haspopup="listbox"
              aria-labelledby="pw-from-1-label"
            >
              <pw-autocomplete for="from-popup-1">
                <input
                  class="${n.search_input}"
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
                  class="${n.popupContainer}"
                  hidden
                ></ul>
              </pw-autocomplete>
            </div>
            <pw-geobutton mode="assistant">
              <button
                class="${n.button_geolocation}"
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
          <div class="${n.search_container}">
            <label
              class="${n.search_label}"
              for="pw-to-1-input"
              id="pw-to-1-label"
            >
              ${e.assistant.to}
            </label>
            <div
              class="${n.search_inputContainer}"
              aria-haspopup="listbox"
              aria-labelledby="pw-to-1-label"
            >
              <pw-autocomplete for="to-popup-1">
                <input
                  class="${n.search_input} ${n.search_inputLast}"
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
                  class="${n.popupContainer}"
                  hidden
                ></ul>
              </pw-autocomplete>
            </div>
          </div>
        </fieldset>
        ${_("pw-assistant")}
      </div>
      ${$(e.assistantSearchButton)}
    </form>
  `, q = y`
    <form
      class="${n.form}"
      action="${t}/departures"
      id="pw-form-departures"
      method="get"
    >
      <div class="${n.main}">
        <fieldset class="${n.inputBoxes}">
          <legend class="${n.heading}">${e.departure.title}</legend>
          <div class="${n.search_container}">
            <label
              class="${n.search_label}"
              for="pw-from-2-input"
              id="pw-from-2-label"
            >
              ${e.departure.from}
            </label>
            <div
              class="${n.search_inputContainer}"
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
                  placeholder="${e.placeholder}"
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
      ${$(e.departuresSearchButton)}
    </form>
  `;
  return y`
    <div
      data-theme="light"
      class="${De({
    [n.wrapper]: !0,
    [n.inheritFont]: o.inheritFont ?? !1,
    [n.singleColumnLayout]: o.singleColumnLayout ?? !1
  })}"
    >
      <nav class="${n.nav}">
        <ul class="${n.tabs} js-tablist">
          <li>
            <a
              href="/assistant"
              class="${n.tabSelected}"
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
      <div class="js-tabpanel" id="pw-assistant">${j}</div>
      <div class="js-tabpanel ${n.hidden}" id="pw-departures">
        ${q}
      </div>
    </div>
  `;
}
function He() {
  var t;
  (t = document.querySelector(".js-tablist")) == null || t.addEventListener("click", function(e) {
    var m, $;
    e.preventDefault(), e.stopPropagation();
    const o = (m = e.target) == null ? void 0 : m.closest("a");
    if (!o) return;
    const i = o.getAttribute("data-mode");
    if (!i) return;
    const a = document.querySelector("#pw-" + i);
    if (!a) return;
    E.clearMessageBox(), document.querySelectorAll(".js-tabpanel").forEach((_) => {
      _.classList.add(n.hidden);
    }), document.querySelectorAll(".js-tablist a").forEach((_) => {
      _.classList.remove(n.tabSelected);
    }), a.classList.remove(n.hidden), o.classList.add(n.tabSelected);
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
function Pe(t, e) {
  let o = null;
  return function(...i) {
    clearTimeout(o), o = setTimeout(() => {
      t(...i);
    }, e);
  };
}
function v(t, e = [], o = "") {
  const i = document.createElement(t);
  if (Array.isArray(e))
    for (let a of e) {
      let s = typeof a == "string" ? document.createTextNode(a) : a;
      i.appendChild(s);
    }
  return i.className = o, i;
}
function Ne(t, e) {
  const o = parseInt(t, 10);
  return Number.isNaN(o) ? e : o;
}
function O(t, e) {
  return t === e ? !0 : !t || !t.parentElement ? !1 : O(t.parentElement, e);
}
function xe(t) {
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
  return t.map(Re).filter((e, o, i) => i.indexOf(e) === o);
}
function Re(t) {
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
function Ge(t, e) {
  if (!t) return {};
  const o = e ? {
    toId: e.id,
    toName: e.name,
    toLon: e.geometry.coordinates[0].toString(),
    toLat: e.geometry.coordinates[1].toString(),
    toLayer: e.layer
  } : void 0;
  return {
    fromId: t.id,
    fromName: t.name,
    fromLon: t.geometry.coordinates[0].toString(),
    fromLat: t.geometry.coordinates[1].toString(),
    fromLayer: t.layer,
    ...o
  };
}
function Ke(t, e) {
  const o = e.mode !== "now" ? {
    searchMode: e.mode,
    searchTime: e.dateTime.toString()
  } : { searchMode: e.mode }, i = Ge(
    t.from,
    t.to
  );
  return {
    ...o,
    ...i
  };
}
function Ue(t, e) {
  const o = t.mode !== "now" ? {
    searchMode: t.mode,
    searchTime: t.dateTime.toString()
  } : { searchMode: t.mode };
  return !e || e.layer == "venue" ? {
    ...o
  } : {
    ...o,
    name: e.name,
    lon: e.geometry.coordinates[0].toString(),
    lat: e.geometry.coordinates[1].toString()
  };
}
async function Ve(t, e) {
  const o = `${t}api/departures/autocomplete?q=${e}`, i = await fetch(o);
  if (!i.ok)
    throw new Error(`Error fetching autocomplete data from ${o}`);
  return await i.json();
}
async function Qe(t, e) {
  const i = await (await fetch(
    `${t}api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`
  )).json();
  if (i)
    return i;
}
async function Ye(t, e) {
  return new Promise(function(o, i) {
    navigator.geolocation.getCurrentPosition(
      async (a) => {
        const s = await Qe(t, a.coords);
        o(s);
      },
      (a) => {
        i(new Error(Je(a.code, e)));
      },
      { enableHighAccuracy: !0, timeout: 1e4 }
    );
  });
}
function Je(t, e) {
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
const ze = {
  nb: {
    noResults: "Ingen resultater",
    geoButton: "Finn min posisjon",
    geoTexts: {
      denied: "Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.",
      unavailable: "Posisjonen din er ikke tilgjengelig.",
      timeout: "Det tok for lang tid å hente posisjonen din. Prøv på nytt."
    },
    assistantSearchButton: "Finn reise",
    departuresSearchButton: "Finn avganger",
    placeholder: "adresse, kai eller holdeplass",
    assistant: {
      link: "Finn reise",
      title: "Hvor vil du reise?",
      from: "Fra",
      to: "Til"
    },
    departure: {
      link: "Se avganger",
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
    assistantSearchButton: "Finn reise",
    departuresSearchButton: "Finn avganger",
    placeholder: "adresse, kai eller haldeplass",
    assistant: {
      link: "Finn reise",
      title: "Kor vil du reise?",
      from: "Frå",
      to: "Til"
    },
    departure: {
      link: "Sjå avganger",
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
    assistantSearchButton: "Find journey",
    departuresSearchButton: "Find departures",
    placeholder: "address, quay, or stop",
    assistant: {
      link: "Find journey",
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
function Xe(t) {
  return ze[t];
}
export {
  et as createWidget,
  Qe as reverse
};
