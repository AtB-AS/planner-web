class R {
  constructor(e, n, { tabInsertsSuggestions: i, firstOptionSelectionMode: s, scrollIntoViewOptions: a } = {}) {
    this.input = e, this.list = n, this.tabInsertsSuggestions = i ?? !0, this.firstOptionSelectionMode = s ?? "none", this.scrollIntoViewOptions = a ?? { block: "nearest", inline: "nearest" }, this.isComposing = !1, n.id || (n.id = `combobox-${Math.random().toString().slice(2, 6)}`), this.ctrlBindings = !!navigator.userAgent.match(/Macintosh/), this.keyboardEventHandler = (c) => W(c, this), this.compositionEventHandler = (c) => V(c, this), this.inputHandler = this.clearSelection.bind(this), e.setAttribute("role", "combobox"), e.setAttribute("aria-controls", n.id), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-autocomplete", "list"), e.setAttribute("aria-haspopup", "listbox");
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
    this.firstOptionSelectionMode === "active" ? (e = Array.from(this.list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')).filter(L)[0]) === null || e === void 0 || e.setAttribute("data-combobox-option-default", "true") : this.firstOptionSelectionMode === "selected" && this.navigate(1);
  }
  navigate(e = 1) {
    const n = Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter(L)[0], i = Array.from(this.list.querySelectorAll('[role="option"]')).filter(L), s = i.indexOf(n);
    if (s === i.length - 1 && e === 1 || s === 0 && e === -1) {
      this.clearSelection(), this.input.focus();
      return;
    }
    let a = e === 1 ? 0 : i.length - 1;
    if (n && s >= 0) {
      const h = s + e;
      h >= 0 && h < i.length && (a = h);
    }
    const c = i[a];
    if (c)
      for (const h of i)
        h.removeAttribute("data-combobox-option-default"), c === h ? (this.input.setAttribute("aria-activedescendant", c.id), c.setAttribute("aria-selected", "true"), G(c), c.scrollIntoView(this.scrollIntoViewOptions)) : h.removeAttribute("aria-selected");
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
        M(e.input, e.list) && t.preventDefault();
        break;
      case "Tab":
        e.tabInsertsSuggestions && M(e.input, e.list) && t.preventDefault();
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
  e && e.getAttribute("aria-disabled") !== "true" && H(e, { event: t });
}
function M(t, e) {
  const n = e.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');
  return n ? (n.getAttribute("aria-disabled") === "true" || H(n), !0) : !1;
}
function H(t, e) {
  t.dispatchEvent(new CustomEvent("combobox-commit", { bubbles: !0, detail: e }));
}
function G(t) {
  t.dispatchEvent(new Event("combobox-select", { bubbles: !0 }));
}
function L(t) {
  return !t.hidden && !(t instanceof HTMLInputElement && t.type === "hidden") && (t.offsetWidth > 0 || t.offsetHeight > 0);
}
function V(t, e) {
  e.isComposing = t.type === "compositionstart", document.getElementById(e.input.getAttribute("aria-controls") || "") && e.clearSelection();
}
const U = '"../page-modules/assistant/assistant.module.css"', K = '"../page-modules/departures/departures.module.css"', Q = '"../components/search/search.module.css"', Y = '"../modules/search-time/selector/selector.module.css"', J = '"../components/button/button.module.css"', z = "widget-module__hidden", X = "widget-module__wrapper", Z = "widget-module__form", ee = "widget-module__nav", te = "widget-module__tabs", oe = "widget-module__tabSelected", ne = "widget-module__main", ie = "widget-module__heading assistant-module__heading", se = "widget-module__inputBoxes", ae = "widget-module__searchSection assistant-module__searchSection", re = "widget-module__search_container search-module__container", le = "widget-module__search_inputContainer search-module__inputContainer", ce = "widget-module__search_label search-module__label typography-module__typo-body__secondary", de = "widget-module__search_input search-module__input", ue = "widget-module__search_inputLast", pe = "widget-module__button_swap assistant-module__searchInputButton", me = "widget-module__selector_group selector-module__departureDateSelector", he = "widget-module__selector_options selector-module__options", _e = "widget-module__selector_options__small selector-module__options", fe = "widget-module__selector_option selector-module__option", ge = "widget-module__selector_option__text selector-module__option__text", be = "widget-module__selector_option__label selector-module__option__label", ve = "widget-module__selector_option__input selector-module__option__input", we = "widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper", ye = "widget-module__selector_dateAndTimeSelectorsWrapper__hidden", Se = "widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors", $e = "widget-module__selector_dateSelector selector-module__dateSelector", Ee = "widget-module__selector_timeSelector selector-module__timeSelector", Te = "widget-module__buttonGroup", Le = "widget-module__button", Ae = "widget-module__buttonLightOutline", ke = "widget-module__listItem search-module__item", Ie = "widget-module__itemTitle search-module__itemName", Ce = "widget-module__itemIcon undefined", Me = "widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary", De = "widget-module__itemText search-module__itemInfo", He = "widget-module__popupContainer search-module__menu", Be = "widget-module__messageBox", je = "widget-module__inheritFont", o = {
  assistant: U,
  departures: K,
  search: Q,
  selector: Y,
  buttonComponent: J,
  hidden: z,
  wrapper: X,
  form: Z,
  nav: ee,
  tabs: te,
  tabSelected: oe,
  main: ne,
  heading: ie,
  inputBoxes: se,
  searchSection: ae,
  search_container: re,
  search_inputContainer: le,
  search_label: ce,
  search_input: de,
  search_inputLast: ue,
  button_swap: pe,
  selector_group: me,
  selector_options: he,
  selector_options__small: _e,
  selector_option: fe,
  selector_option__text: ge,
  selector_option__label: be,
  selector_option__input: ve,
  selector_dateAndTimeSelectorsWrapper: we,
  selector_dateAndTimeSelectorsWrapper__hidden: ye,
  selector_dateAndTimeSelectors: Se,
  selector_dateSelector: $e,
  selector_timeSelector: Ee,
  buttonGroup: Te,
  button: Le,
  buttonLightOutline: Ae,
  "button--disabled": "widget-module__button--disabled",
  listItem: ke,
  itemTitle: Ie,
  itemIcon: Ce,
  itemLocality: Me,
  itemText: De,
  popupContainer: He,
  messageBox: Be,
  inheritFont: je
};
function xe(t) {
  return Object.entries(t).reduce(function(e, n) {
    return n[1] ? e + " " + n[0] : e;
  }, "");
}
var B = { MODULE_VERSION: "3.1.1", COMPRESSED_ORG: "HYMw1kA", ORG_ID: "nfk" };
const Pe = 300, S = String.raw, A = B.MODULE_VERSION, k = B.COMPRESSED_ORG;
function Fe(t) {
  if (!(t != null && t.startsWith("http")))
    throw new Error("Missing urlBase in correct schema.");
  return t.endsWith("/") || (t += "/"), {
    URL_BASE: t,
    URL_JS_UMD: `${t}widget/${k}/${A}/planner-web.umd.js`,
    URL_JS_ESM: `${t}widget/${k}/${A}/planner-web.mjs`,
    URL_CSS: `${t}widget/${k}/${A}/planner-web.css`
  };
}
function st({
  urlBase: t,
  language: e = "en",
  outputOverrideOptions: n = {}
}) {
  const i = nt(e), s = Fe(t), a = {
    inheritFont: !1,
    ...n
  };
  return {
    output: Re(s, i, a),
    init: qe,
    urls: s
  };
}
function qe() {
  var e, n;
  We(), D("pw-assistant"), D("pw-departures");
  let t = {
    from: void 0,
    to: void 0
  };
  document.addEventListener("search-selected", function(i) {
    const s = i;
    t[s.detail.key] = s.detail.item;
  }), document.addEventListener("reset-search", function() {
    t = {
      from: void 0,
      to: void 0
    }, document.querySelectorAll(
      'input[name="from"], input[name="to"]'
    ).forEach((i) => {
      i.value = "";
    });
  }), document.addEventListener("swap-selected", function() {
    const i = t.from;
    t = {
      from: t.to,
      to: i
    };
  }), document.querySelectorAll("[name$=searchTimeSelector]").forEach(function(i) {
    i.addEventListener("change", function(s) {
      const c = s.currentTarget.value === "now";
      document.querySelectorAll(".js-search-date-details").forEach((h) => {
        h.hidden = c;
      });
    });
  }), (e = document.querySelector("#pw-form-departures")) == null || e.addEventListener("submit", (i) => {
    i.preventDefault();
    const s = i.currentTarget;
    Ne(s, t.from);
  }), (n = document.querySelector("#pw-form-assistant")) == null || n.addEventListener("submit", (i) => {
    i.preventDefault();
    const s = i.currentTarget;
    Oe(s, t.from, t.to);
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
      const i = /* @__PURE__ */ new Date(), s = String(i.getHours()).padStart(2, "0"), a = String(i.getMinutes()).padStart(2, "0");
      n.value = `${s}:${a}`;
    }
  } catch {
  }
}
function j(t, e) {
  const n = t.get(`${e}-searchTimeSelector`);
  if (n === "now")
    return {
      mode: "now"
    };
  {
    const i = t.get("dateinput"), s = t.get("timeinput");
    if (i && s) {
      const a = /* @__PURE__ */ new Date(`${i}T${s}`);
      return {
        mode: n == "arriveBy" ? "arriveBy" : "departBy",
        dateTime: a.getTime()
      };
    }
    return {
      mode: "now"
    };
  }
}
function Oe(t, e, n) {
  const i = t.action, s = j(new FormData(t), "pw-assistant"), a = Je({ from: e, to: n }, s), c = new URLSearchParams(a);
  window.location.href = `${i}?${c.toString()}`;
}
function Ne(t, e) {
  const n = t.action, i = j(new FormData(t), "pw-departures"), s = ze(i, e), a = new URLSearchParams(s);
  (e == null ? void 0 : e.layer) === "venue" ? window.location.href = `${n}/${e.id}?${a.toString()}` : window.location.href = `${n}?${a.toString()}`;
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
function Re({ URL_BASE: t }, e, n) {
  function i(l) {
    const d = a(l), _ = f("span", [l.name], o.itemTitle), p = f("span", [l.locality ?? ""], o.itemLocality), m = f("div", [_, p], o.itemText), v = f("li", [d, m], o.listItem);
    return v.role = "option", v.setAttribute("data-feature-id", l.id), v;
  }
  function s(l) {
    const d = f("span", [l]);
    return f("li", [d], o.listItem);
  }
  function a(l) {
    const d = Ue(l.category), _ = f("img");
    _.src = `${t}assets/mono/light/${d.icon}.svg`, _.alt = d.alt, _.role = "img";
    const p = f("div", [_], o.itemIcon);
    return p.ariaHidden = "true", p;
  }
  class c extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.querySelector("button").addEventListener("click", async () => {
        $.clearMessageBox();
        const _ = document.getElementsByClassName(
          "widget-module__search_input"
        ), [p, m] = Array.from(_);
        [p.value, m.value] = [m.value, p.value], document.dispatchEvent(new CustomEvent("swap-selected"));
      });
    }
  }
  customElements.define("pw-swapbutton", c), customElements.define("pw-messagebox", $);
  class h extends HTMLElement {
    constructor() {
      super(), this.dataList = {};
    }
    getItem(d) {
      return this.dataList[d];
    }
    setItems(d) {
      this.dataList = {};
      for (let _ of d)
        this.dataList[_.id] = _;
    }
    connectedCallback() {
      const d = this, _ = Ve(
        this.getAttribute("data-debounce-ms"),
        Pe
      ), p = this.querySelector("input"), m = this.querySelector(
        "#" + this.getAttribute("for")
      );
      let v = new R(p, m, {
        tabInsertsSuggestions: !0,
        scrollIntoViewOptions: !1
      });
      const q = function() {
        const r = f("img");
        r.src = `${t}assets/mono/places/Location.svg`, r.role = "img";
        const u = f("div", [r], o.itemIcon);
        r.ariaHidden = "true";
        const g = f("span", [e.geoButton], o.itemTitle), y = f("div", [g], o.itemText), T = f("li", [u, y], o.listItem);
        return T.classList.add("itemLocation"), T.role = "option", T;
      };
      function w(r) {
        const u = q();
        r ? (m.appendChild(u), v.start()) : (m.innerHTML = "", v.clearSelection(), v.stop()), m.hidden = !r;
      }
      function I() {
        d.setItems([]), m.innerHTML = "";
        const r = s(e.noResults);
        m.appendChild(r), w(!0);
      }
      const O = Ge(async (r) => {
        try {
          if (!r.value) {
            m.innerHTML = "";
            return;
          }
          const u = await Xe(t, r.value);
          if (u.length === 0)
            return I();
          d.setItems(u), m.innerHTML = "";
          for (let g of u) {
            const y = i(g);
            m.appendChild(y);
          }
          w(!0);
        } catch {
          I();
        }
      }, _);
      p.addEventListener("keydown", (r) => {
        r.key === "Escape" && w(!1);
      }), p.addEventListener(
        "input",
        (r) => O(r.target)
      ), p.addEventListener("focus", () => w(!0)), p.addEventListener("blur", () => w(!1)), document.addEventListener("click", (r) => {
        x(r.target, this) || w(!1);
      });
      const N = async function() {
        var r;
        $.clearMessageBox();
        try {
          const u = await et(t, e), g = (r = d.parentElement) == null ? void 0 : r.querySelector("input");
          g && (g.value = u ? `${u.name}` : g.value), document.dispatchEvent(
            new CustomEvent("search-selected", {
              bubbles: !0,
              detail: {
                key: "from",
                item: u
              }
            })
          );
        } catch (u) {
          u instanceof Error && document.dispatchEvent(
            new CustomEvent("pw-errorMessage", {
              bubbles: !0,
              detail: {
                message: u.message
              }
            })
          );
        }
      };
      m.addEventListener("combobox-commit", function(r) {
        r.target.classList.contains("itemLocation") && N();
        const u = r.target.getAttribute(
          "data-feature-id"
        ), g = u ? d.getItem(u) : void 0;
        let y = p.value;
        g && (y = `${g.name}`), p.value = y, document.dispatchEvent(
          new CustomEvent("search-selected", {
            bubbles: !0,
            detail: {
              key: p.name,
              item: g
            }
          })
        ), m.hidden = !0, v.clearSelection(), v.stop();
      });
    }
  }
  customElements.define("pw-autocomplete", h);
  const E = S`
    <div class="${o.buttonGroup}">
      <button
        type="submit"
        class="${o.button}"
      >
        <span>${e.searchButton}</span>
      </button>
    </div>
  `, b = (l, d = !0) => S`
    <fieldset class="${o.inputBoxes}">
      <legend class="${o.heading}">${e.searchTime.title}</legend>
      <div>
        <div
          class="${o.selector_options} ${d ? "" : o.selector_options__small}"
        >
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="${l}-searchTimeSelector"
              class="${o.selector_option__input}"
              value="now"
              checked=""
            />
            <span class="${o.selector_option__label}">
              <span class="${o.selector_option__text}" id="${l}-now">
                ${e.searchTime.now}
              </span>
            </span>
          </label>
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="${l}-searchTimeSelector"
              class="${o.selector_option__input}"
              value="departBy"
            />
            <span class="${o.selector_option__label}">
              <span
                class="${o.selector_option__text}"
                id="${l}-depart"
              >
                ${e.searchTime.depart}
              </span>
            </span>
          </label>
          ${d ? S`
                <label class="${o.selector_option}">
                  <input
                    type="radio"
                    name="${l}-searchTimeSelector"
                    class="${o.selector_option__input}"
                    value="arriveBy"
                  />
                  <span class="${o.selector_option__label}">
                    <span
                      class="${o.selector_option__text}"
                      id="${l}-arrival"
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
              <label for="${`${l}-searchTimeSelector-date`}">
                ${e.searchTime.date}
              </label>
              <input
                type="date"
                name="dateinput"
                id="${`${l}-searchTimeSelector-date`}"
              />
            </div>
            <div class="${o.selector_timeSelector}">
              <label for="${`${l}-searchTimeSelector-time`}">
                ${e.searchTime.time}
              </label>
              <input
                type="time"
                name="timeinput"
                step="60"
                id="${`${l}-searchTimeSelector-time`}"
              />
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  `, P = S`
    <form
      class="${o.form}"
      action="${t}/assistant"
      id="pw-form-assistant"
      method="get"
    >
      <div class="${o.main}">
        <fieldset class="${o.inputBoxes}">
          <legend class="${o.heading}">${e.assistant.title}</legend>
          <div class="${o.searchSection}">
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
            </div>

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
            <pw-swapbutton mode="assistant">
              <button
                class="${o.button_swap}"
                title="${e.geoButton}"
                aria-label="${e.geoButton}"
                type="button"
              >
                <img
                  src="${t}/assets/mono/actions/Swap.svg"
                  width="20"
                  height="20"
                  role="none"
                  alt=""
                />
              </button>
            </pw-swapbutton>
            <pw-messagebox></pw-messagebox>
          </div>
        </fieldset>
        ${n.layoutMode !== "compact" ? b("pw-assistant") : ""}
      </div>
      ${E}
    </form>
  `, F = S`
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
          </div>
          <pw-messagebox></pw-messagebox>
        </fieldset>
        ${n.layoutMode !== "compact" ? b("pw-departures", !1) : ""}
      </div>
      ${E}
    </form>
  `;
  return S`
    <div
      data-theme="light"
      data-layout="${n.singleColumnLayout ? "singleColumn" : n.layoutMode}"
      class="${xe({
    [o.wrapper]: !0,
    [o.inheritFont]: n.inheritFont ?? !1
  })} "
    >
      <nav class="${o.nav}">
        <ul class="${o.tabs} js-tablist">
          <li
            class="${o.tabSelected}"
            data-mode="assistant"
            id="pw-assistant-tab"
          >
            <a href="/assistant">${e.assistant.link}</a>
          </li>
          <li data-mode="departures" id="pw-departures-tab">
            <a href="/departures">${e.departure.link}</a>
          </li>
        </ul>
      </nav>
      <div class="js-tabpanel" id="pw-assistant">${P}</div>
      <div class="js-tabpanel ${o.hidden}" id="pw-departures">
        ${F}
      </div>
    </div>
  `;
}
function We() {
  var t;
  (t = document.querySelector(".js-tablist")) == null || t.addEventListener("click", function(e) {
    var h, E;
    e.preventDefault(), e.stopPropagation();
    const n = (h = e.target) == null ? void 0 : h.closest("li");
    if (!n) return;
    const i = n.getAttribute("data-mode");
    if (!i) return;
    const s = document.querySelector("#pw-" + i);
    if (!s) return;
    $.clearMessageBox(), document.querySelectorAll(".js-tabpanel").forEach((b) => {
      b.classList.add(o.hidden);
    }), document.querySelectorAll(".js-tablist li").forEach((b) => {
      b.classList.remove(o.tabSelected);
    }), s.classList.remove(o.hidden), n.classList.add(o.tabSelected);
    const a = document.querySelectorAll(
      `input[type="radio"][name="pw-${i}-searchTimeSelector"]`
    ), c = (E = Array.from(a).find(
      (b) => b.checked
    )) == null ? void 0 : E.value;
    document.querySelectorAll(".js-search-date-details").forEach((b) => {
      b.hidden = c === "now";
    }), document.dispatchEvent(
      new CustomEvent("reset-search", {
        bubbles: !0
      })
    );
  });
}
function Ge(t, e) {
  let n = null;
  return function(...i) {
    clearTimeout(n), n = setTimeout(() => {
      t(...i);
    }, e);
  };
}
function f(t, e = [], n = "") {
  const i = document.createElement(t);
  if (Array.isArray(e))
    for (let s of e) {
      let a = typeof s == "string" ? document.createTextNode(s) : s;
      i.appendChild(a);
    }
  return i.className = n, i;
}
function Ve(t, e) {
  const n = parseInt(t, 10);
  return Number.isNaN(n) ? e : n;
}
function x(t, e) {
  return t === e ? !0 : !t || !t.parentElement ? !1 : x(t.parentElement, e);
}
function Ue(t) {
  switch (Ke(t)[0]) {
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
function Ke(t) {
  return t.map(Qe).filter((e, n, i) => i.indexOf(e) === n);
}
function Qe(t) {
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
function Ye(t, e) {
  if (!t) return {};
  const n = e ? {
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
    ...n
  };
}
function Je(t, e) {
  const n = e.mode !== "now" ? {
    searchMode: e.mode,
    searchTime: e.dateTime.toString()
  } : { searchMode: e.mode }, i = Ye(
    t.from,
    t.to
  );
  return {
    ...n,
    ...i
  };
}
function ze(t, e) {
  const n = t.mode !== "now" ? {
    searchMode: t.mode,
    searchTime: t.dateTime.toString()
  } : { searchMode: t.mode };
  return !e || e.layer == "venue" ? {
    ...n
  } : {
    ...n,
    name: e.name,
    lon: e.geometry.coordinates[0].toString(),
    lat: e.geometry.coordinates[1].toString()
  };
}
async function Xe(t, e) {
  const n = `${t}api/departures/autocomplete?q=${e}`, i = await fetch(n);
  if (!i.ok)
    throw new Error(`Error fetching autocomplete data from ${n}`);
  return await i.json();
}
async function Ze(t, e) {
  const i = await (await fetch(
    `${t}api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`
  )).json();
  if (i)
    return i;
}
async function et(t, e) {
  return new Promise(function(n, i) {
    navigator.geolocation.getCurrentPosition(
      async (s) => {
        const a = await Ze(t, s.coords);
        n(a);
      },
      (s) => {
        i(new Error(tt(s.code, e)));
      },
      { enableHighAccuracy: !0, timeout: 1e4 }
    );
  });
}
function tt(t, e) {
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
const ot = {
  nb: {
    noResults: "Ingen resultater",
    geoButton: "Min posisjon",
    geoTexts: {
      denied: "Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.",
      unavailable: "Posisjonen din er ikke tilgjengelig.",
      timeout: "Det tok for lang tid å hente posisjonen din. Prøv på nytt."
    },
    searchButton: "Finn reise",
    placeholder: "Sted eller adresse",
    assistant: {
      link: "Planlegg reise",
      title: "Hei, hvor vil du reise?",
      from: "Fra",
      to: "Til"
    },
    departure: {
      link: "Se avganger",
      title: "Hei, hvor vil du reise fra?",
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
    geoButton: "Min posisjon",
    geoTexts: {
      denied: "Du må endre posisjonsinnstillingane i nettlesaren din for å bruke din posisjon i reisesøket.",
      unavailable: "Posisjonen din er ikkje tilgjengeleg.",
      timeout: "Det tok for lang tid å hente posisjonen din. Prøv på nytt."
    },
    searchButton: "Finn reise",
    placeholder: "Stad eller adresse",
    assistant: {
      link: "Planlegg reise",
      title: "Hei, kor vil du reise?",
      from: "Frå",
      to: "Til"
    },
    departure: {
      link: "Sjå avgangar",
      title: "Hei, kor vil du reise frå?",
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
    geoButton: "My location",
    geoTexts: {
      denied: "You must change location settings in your browser to use your position in the travel search.",
      unavailable: "Your position is not available.",
      timeout: "It took too long to retrieve your position. Try again."
    },
    searchButton: "Find journey",
    placeholder: "Location or address",
    assistant: {
      link: "Find journey",
      title: "Hi, where do you want to travel?",
      from: "From",
      to: "To"
    },
    departure: {
      link: "See departures",
      title: "Hi, where do you want to travel from?",
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
function nt(t) {
  return ot[t];
}
export {
  st as createWidget,
  Ze as reverse
};
