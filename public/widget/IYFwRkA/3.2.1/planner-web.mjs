class R {
  constructor(e, o, { tabInsertsSuggestions: i, firstOptionSelectionMode: a, scrollIntoViewOptions: r } = {}) {
    this.input = e, this.list = o, this.tabInsertsSuggestions = i ?? !0, this.firstOptionSelectionMode = a ?? "none", this.scrollIntoViewOptions = r ?? { block: "nearest", inline: "nearest" }, this.isComposing = !1, o.id || (o.id = `combobox-${Math.random().toString().slice(2, 6)}`), this.ctrlBindings = !!navigator.userAgent.match(/Macintosh/), this.keyboardEventHandler = (l) => G(l, this), this.compositionEventHandler = (l) => V(l, this), this.inputHandler = this.clearSelection.bind(this), e.setAttribute("role", "combobox"), e.setAttribute("aria-controls", o.id), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-autocomplete", "list"), e.setAttribute("aria-haspopup", "listbox");
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
    this.firstOptionSelectionMode === "active" ? (e = Array.from(this.list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')).filter(E)[0]) === null || e === void 0 || e.setAttribute("data-combobox-option-default", "true") : this.firstOptionSelectionMode === "selected" && this.navigate(1);
  }
  navigate(e = 1) {
    const o = Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter(E)[0], i = Array.from(this.list.querySelectorAll('[role="option"]')).filter(E), a = i.indexOf(o);
    if (a === i.length - 1 && e === 1 || a === 0 && e === -1) {
      this.clearSelection(), this.input.focus();
      return;
    }
    let r = e === 1 ? 0 : i.length - 1;
    if (o && a >= 0) {
      const f = a + e;
      f >= 0 && f < i.length && (r = f);
    }
    const l = i[r];
    if (l)
      for (const f of i)
        f.removeAttribute("data-combobox-option-default"), l === f ? (this.input.setAttribute("aria-activedescendant", l.id), l.setAttribute("aria-selected", "true"), W(l), l.scrollIntoView(this.scrollIntoViewOptions)) : f.removeAttribute("aria-selected");
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
function G(t, e) {
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
  e && e.getAttribute("aria-disabled") !== "true" && B(e, { event: t });
}
function M(t, e) {
  const o = e.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');
  return o ? (o.getAttribute("aria-disabled") === "true" || B(o), !0) : !1;
}
function B(t, e) {
  t.dispatchEvent(new CustomEvent("combobox-commit", { bubbles: !0, detail: e }));
}
function W(t) {
  t.dispatchEvent(new Event("combobox-select", { bubbles: !0 }));
}
function E(t) {
  return !t.hidden && !(t instanceof HTMLInputElement && t.type === "hidden") && (t.offsetWidth > 0 || t.offsetHeight > 0);
}
function V(t, e) {
  e.isComposing = t.type === "compositionstart", document.getElementById(e.input.getAttribute("aria-controls") || "") && e.clearSelection();
}
const U = "widget-module__hidden", K = "widget-module__wrapper", Q = "widget-module__form assistant-module__container", J = "widget-module__nav", Y = "widget-module__tabs", z = "widget-module__tabSelected", X = "widget-module__main assistant-module__main", Z = "widget-module__heading assistant-module__heading", ee = "widget-module__inputBoxes", te = "widget-module__searchSection assistant-module__searchSection", oe = "widget-module__search_container search-module__container", ne = "widget-module__search_inputContainer search-module__inputContainer", ie = "widget-module__search_label search-module__label typography-module__typo-body__secondary", ae = "widget-module__search_input search-module__input", se = "widget-module__search_inputLast", re = "widget-module__button_swap assistant-module__searchInputButton", le = "widget-module__selector_options selector-module__options", ce = "widget-module__selector_options__small selector-module__options", ue = "widget-module__selector_option selector-module__option", de = "widget-module__selector_option__text selector-module__option__text", pe = "widget-module__selector_option__label selector-module__option__label", me = "widget-module__selector_option__input selector-module__option__input", he = "widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper", _e = "widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors", fe = "widget-module__selector_dateSelector selector-module__dateSelector", ge = "widget-module__selector_timeSelector selector-module__timeSelector", be = "widget-module__buttonGroup", ve = "widget-module__button", we = "widget-module__listItem search-module__item", ye = "widget-module__itemTitle search-module__itemName", $e = "widget-module__itemIcon undefined", Se = "widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary", Ee = "widget-module__itemText search-module__itemInfo", Te = "widget-module__popupContainer search-module__menu", Le = "widget-module__messageBox", Ae = "widget-module__inheritFont", n = {
  hidden: U,
  wrapper: K,
  form: Q,
  nav: J,
  tabs: Y,
  tabSelected: z,
  main: X,
  heading: Z,
  inputBoxes: ee,
  searchSection: te,
  search_container: oe,
  search_inputContainer: ne,
  search_label: ie,
  search_input: ae,
  search_inputLast: se,
  button_swap: re,
  selector_options: le,
  selector_options__small: ce,
  selector_option: ue,
  selector_option__text: de,
  selector_option__label: pe,
  selector_option__input: me,
  selector_dateAndTimeSelectorsWrapper: he,
  selector_dateAndTimeSelectors: _e,
  selector_dateSelector: fe,
  selector_timeSelector: ge,
  buttonGroup: be,
  button: ve,
  listItem: we,
  itemTitle: ye,
  itemIcon: $e,
  itemLocality: Se,
  itemText: Ee,
  popupContainer: Te,
  messageBox: Le,
  inheritFont: Ae
};
function ke(t) {
  return Object.entries(t).reduce(function(e, o) {
    return o[1] ? e + " " + o[0] : e;
  }, "");
}
var x = { MODULE_VERSION: "3.2.1", COMPRESSED_ORG: "IYFwRkA" };
const Ie = 300, y = String.raw, T = x.MODULE_VERSION, L = x.COMPRESSED_ORG;
function Ce(t) {
  if (!t?.startsWith("http"))
    throw new Error("Missing urlBase in correct schema.");
  return t.endsWith("/") || (t += "/"), {
    URL_BASE: t,
    URL_JS_UMD: `${t}widget/${L}/${T}/planner-web.umd.js`,
    URL_JS_ESM: `${t}widget/${L}/${T}/planner-web.mjs`,
    URL_CSS: `${t}widget/${L}/${T}/planner-web.css`
  };
}
function ze({
  urlBase: t,
  language: e = "en",
  outputOverrideOptions: o = {}
}) {
  const i = Je(e), a = Ce(t), r = {
    inheritFont: !1,
    layoutMode: "doubleColumn",
    ...o
  };
  return {
    output: xe(a, i, r),
    init: Me,
    urls: a
  };
}
function Me() {
  He(), D("pw-assistant"), D("pw-departures");
  let t = {
    from: void 0,
    to: void 0
  };
  document.addEventListener("search-selected", function(e) {
    const o = e;
    t[o.detail.key] = o.detail.item;
  }), document.addEventListener("reset-search", function() {
    t = {
      from: void 0,
      to: void 0
    }, document.querySelectorAll(
      'input[name="from"], input[name="to"]'
    ).forEach((e) => {
      e.value = "";
    });
  }), document.addEventListener("swap-selected", function() {
    const e = t.from;
    t = {
      from: t.to,
      to: e
    };
  }), document.querySelectorAll("[name$=searchTimeSelector]").forEach(function(e) {
    e.addEventListener("change", function(o) {
      const a = o.currentTarget.value === "now";
      document.querySelectorAll(".js-search-date-details").forEach((r) => {
        r.hidden = a;
      });
    });
  }), document.querySelector("#pw-form-departures")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const o = e.currentTarget;
    Be(o, t.from);
  }), document.querySelector("#pw-form-assistant")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const o = e.currentTarget;
    De(o, t.from, t.to);
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
      const i = /* @__PURE__ */ new Date(), a = String(i.getHours()).padStart(2, "0"), r = String(i.getMinutes()).padStart(2, "0");
      o.value = `${a}:${r}`;
    }
  } catch {
  }
}
function H(t, e) {
  const o = t.get(`${e}-searchTimeSelector`);
  if (o === "now")
    return {
      mode: "now"
    };
  {
    const i = t.get("dateinput"), a = t.get("timeinput");
    if (i && a) {
      const r = /* @__PURE__ */ new Date(`${i}T${a}`);
      return {
        mode: o == "arriveBy" ? "arriveBy" : "departBy",
        dateTime: r.getTime()
      };
    }
    return {
      mode: "now"
    };
  }
}
function De(t, e, o) {
  const i = t.action, a = H(new FormData(t), "pw-assistant"), r = Re({ from: e, to: o }, a), l = new URLSearchParams(r);
  window.location.href = `${i}?${l.toString()}`;
}
function Be(t, e) {
  const o = t.action, i = H(new FormData(t), "pw-departures"), a = Ge(i, e), r = new URLSearchParams(a);
  e?.layer === "venue" ? window.location.href = `${o}/${e.id}?${r.toString()}` : window.location.href = `${o}?${r.toString()}`;
}
class $ extends HTMLElement {
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
function xe({ URL_BASE: t }, e, o) {
  function i(c) {
    const u = r(c), h = _("span", [c.name], n.itemTitle), d = _("span", [c.locality ?? ""], n.itemLocality), p = _("div", [h, d], n.itemText), g = _("li", [u, p], n.listItem);
    return g.role = "option", g.setAttribute("data-feature-id", c.id), g;
  }
  function a(c) {
    const u = _("span", [c]);
    return _("li", [u], n.listItem);
  }
  function r(c) {
    const u = Pe(c.category), h = _("img");
    h.src = `${t}assets/mono/light/${u.icon}.svg`, h.alt = u.alt, h.role = "img";
    const d = _("div", [h], n.itemIcon);
    return d.ariaHidden = "true", d;
  }
  class l extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.querySelector("button").addEventListener("click", async () => {
        $.clearMessageBox();
        const h = document.getElementsByClassName(
          "widget-module__search_input"
        ), [d, p] = Array.from(h);
        [d.value, p.value] = [p.value, d.value], document.dispatchEvent(new CustomEvent("swap-selected"));
      });
    }
  }
  customElements.define("pw-swapbutton", l), customElements.define("pw-messagebox", $);
  class f extends HTMLElement {
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
      const u = this, h = Fe(
        this.getAttribute("data-debounce-ms"),
        Ie
      ), d = this.querySelector("input"), p = this.querySelector(
        "#" + this.getAttribute("for")
      );
      let g = new R(d, p, {
        tabInsertsSuggestions: !0,
        scrollIntoViewOptions: !1
      });
      const q = function() {
        const s = _("img");
        s.src = `${t}assets/mono/places/Location.svg`, s.role = "img";
        const m = _("div", [s], n.itemIcon);
        s.ariaHidden = "true";
        const b = _("span", [e.geoButton], n.itemTitle), w = _("div", [b], n.itemText), S = _("li", [m, w], n.listItem);
        return S.classList.add("itemLocation"), S.role = "option", S;
      };
      function v(s) {
        const m = q();
        s ? (p.appendChild(m), g.start()) : (p.innerHTML = "", g.clearSelection(), g.stop()), p.hidden = !s;
      }
      function I() {
        u.setItems([]), p.innerHTML = "";
        const s = a(e.noResults);
        p.appendChild(s), v(!0);
      }
      const N = je(async (s) => {
        try {
          if (!s.value) {
            p.innerHTML = "";
            return;
          }
          const m = await We(t, s.value);
          if (m.length === 0)
            return I();
          u.setItems(m), p.innerHTML = "";
          for (let b of m) {
            const w = i(b);
            p.appendChild(w);
          }
          v(!0);
        } catch {
          I();
        }
      }, h);
      d.addEventListener("keydown", (s) => {
        s.key === "Escape" && v(!1);
      }), d.addEventListener(
        "input",
        (s) => N(s.target)
      ), d.addEventListener("focus", () => v(!0)), d.addEventListener("blur", () => v(!1)), document.addEventListener("click", (s) => {
        j(s.target, this) || v(!1);
      });
      const O = async function() {
        $.clearMessageBox();
        try {
          const s = await Ue(t, e), m = u.parentElement?.querySelector("input");
          m && (m.value = s ? `${s.name}` : m.value), document.dispatchEvent(
            new CustomEvent("search-selected", {
              bubbles: !0,
              detail: {
                key: "from",
                item: s
              }
            })
          );
        } catch (s) {
          s instanceof Error && document.dispatchEvent(
            new CustomEvent("pw-errorMessage", {
              bubbles: !0,
              detail: {
                message: s.message
              }
            })
          );
        }
      };
      p.addEventListener("combobox-commit", function(s) {
        s.target.classList.contains("itemLocation") && O();
        const m = s.target.getAttribute(
          "data-feature-id"
        ), b = m ? u.getItem(m) : void 0;
        let w = d.value;
        b && (w = `${b.name}`), d.value = w, document.dispatchEvent(
          new CustomEvent("search-selected", {
            bubbles: !0,
            detail: {
              key: d.name,
              item: b
            }
          })
        ), p.hidden = !0, g.clearSelection(), g.stop();
      });
    }
  }
  customElements.define("pw-autocomplete", f);
  const A = y`
    <div class="${n.buttonGroup}">
      <button
        type="submit"
        class="${n.button}"
      >
        <span>${e.searchButton}</span>
      </button>
    </div>
  `, k = (c, u = !0) => y`
    <fieldset class="${n.inputBoxes}">
      <legend class="${n.heading}">${e.searchTime.title}</legend>
      <div>
        <div
          class="${n.selector_options} ${u ? "" : n.selector_options__small}"
        >
          <label class="${n.selector_option}">
            <input
              type="radio"
              name="${c}-searchTimeSelector"
              class="${n.selector_option__input}"
              value="now"
              checked=""
            />
            <span class="${n.selector_option__label}">
              <span class="${n.selector_option__text}" id="${c}-now">
                ${e.searchTime.now}
              </span>
            </span>
          </label>
          <label class="${n.selector_option}">
            <input
              type="radio"
              name="${c}-searchTimeSelector"
              class="${n.selector_option__input}"
              value="departBy"
            />
            <span class="${n.selector_option__label}">
              <span
                class="${n.selector_option__text}"
                id="${c}-depart"
              >
                ${e.searchTime.depart}
              </span>
            </span>
          </label>
          ${u ? y`
                <label class="${n.selector_option}">
                  <input
                    type="radio"
                    name="${c}-searchTimeSelector"
                    class="${n.selector_option__input}"
                    value="arriveBy"
                  />
                  <span class="${n.selector_option__label}">
                    <span
                      class="${n.selector_option__text}"
                      id="${c}-arrival"
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
              <label for="${`${c}-searchTimeSelector-date`}">
                ${e.searchTime.date}
              </label>
              <input
                type="date"
                name="dateinput"
                id="${`${c}-searchTimeSelector-date`}"
              />
            </div>
            <div class="${n.selector_timeSelector}">
              <label for="${`${c}-searchTimeSelector-time`}">
                ${e.searchTime.time}
              </label>
              <input
                type="time"
                name="timeinput"
                step="60"
                id="${`${c}-searchTimeSelector-time`}"
              />
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  `, F = y`
    <form
      class="${n.form}"
      action="${t}/assistant"
      id="pw-form-assistant"
      method="get"
    >
      <div class="${n.main}">
        <fieldset class="${n.inputBoxes}">
          <legend class="${n.heading}">${e.assistant.title}</legend>
          <div class="${n.searchSection}">
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
            </div>

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
            <pw-swapbutton mode="assistant">
              <button
                class="${n.button_swap}"
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
        ${o.layoutMode !== "compact" ? k("pw-assistant") : ""}
      </div>
      ${A}
    </form>
  `, P = y`
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
          </div>
          <pw-messagebox></pw-messagebox>
        </fieldset>
        ${o.layoutMode !== "compact" ? k("pw-departures", !1) : ""}
      </div>
      ${A}
    </form>
  `;
  return y`
    <div
      data-theme="light"
      data-layout="${o.singleColumnLayout ? "singleColumn" : o.layoutMode}"
      class="${ke({
    [n.wrapper]: !0,
    [n.inheritFont]: o.inheritFont ?? !1
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
      <div class="js-tabpanel" id="pw-assistant">${F}</div>
      <div class="js-tabpanel ${n.hidden}" id="pw-departures">
        ${P}
      </div>
    </div>
  `;
}
function He() {
  document.querySelector(".js-tablist")?.addEventListener("click", function(t) {
    t.preventDefault(), t.stopPropagation();
    const e = t.target?.closest("a");
    if (!e) return;
    const o = e.getAttribute("data-mode");
    if (!o) return;
    const i = document.querySelector("#pw-" + o);
    if (!i) return;
    $.clearMessageBox(), document.querySelectorAll(".js-tabpanel").forEach((l) => {
      l.classList.add(n.hidden);
    }), document.querySelectorAll(".js-tablist a").forEach((l) => {
      l.classList.remove(n.tabSelected);
    }), i.classList.remove(n.hidden), e.classList.add(n.tabSelected);
    const a = document.querySelectorAll(
      `input[type="radio"][name="pw-${o}-searchTimeSelector"]`
    ), r = Array.from(a).find(
      (l) => l.checked
    )?.value;
    document.querySelectorAll(".js-search-date-details").forEach((l) => {
      l.hidden = r === "now";
    }), document.dispatchEvent(
      new CustomEvent("reset-search", {
        bubbles: !0
      })
    );
  });
}
function je(t, e) {
  let o = null;
  return function(...i) {
    clearTimeout(o), o = setTimeout(() => {
      t(...i);
    }, e);
  };
}
function _(t, e = [], o = "") {
  const i = document.createElement(t);
  if (Array.isArray(e))
    for (let a of e) {
      let r = typeof a == "string" ? document.createTextNode(a) : a;
      i.appendChild(r);
    }
  return i.className = o, i;
}
function Fe(t, e) {
  const o = parseInt(t, 10);
  return Number.isNaN(o) ? e : o;
}
function j(t, e) {
  return t === e ? !0 : !t || !t.parentElement ? !1 : j(t.parentElement, e);
}
function Pe(t) {
  switch (qe(t)[0]) {
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
function qe(t) {
  return t.map(Ne).filter((e, o, i) => i.indexOf(e) === o);
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
function Oe(t, e) {
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
function Re(t, e) {
  const o = e.mode !== "now" ? {
    searchMode: e.mode,
    searchTime: e.dateTime.toString()
  } : { searchMode: e.mode }, i = Oe(
    t.from,
    t.to
  );
  return {
    ...o,
    ...i
  };
}
function Ge(t, e) {
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
async function We(t, e) {
  const o = `${t}api/departures/autocomplete?q=${e}`, i = await fetch(o);
  if (!i.ok)
    throw new Error(`Error fetching autocomplete data from ${o}`);
  return await i.json();
}
async function Ve(t, e) {
  const i = await (await fetch(
    `${t}api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`
  )).json();
  if (i)
    return i;
}
async function Ue(t, e) {
  return new Promise(function(o, i) {
    navigator.geolocation.getCurrentPosition(
      async (a) => {
        const r = await Ve(t, a.coords);
        o(r);
      },
      (a) => {
        i(new Error(Ke(a.code, e)));
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
    geoButton: "Min posisjon",
    geoTexts: {
      denied: "Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.",
      unavailable: "Posisjonen din er ikke tilgjengelig.",
      timeout: "Det tok for lang tid å hente posisjonen din. Prøv på nytt."
    },
    searchButton: "Finn reise",
    placeholder: "Sted eller adresse",
    assistant: {
      link: "Reisesøk",
      title: "Hei, hvor vil du reise?",
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
    geoButton: "Min posisjon",
    geoTexts: {
      denied: "Du må endre posisjonsinnstillingane i nettlesaren din for å bruke din posisjon i reisesøket.",
      unavailable: "Posisjonen din er ikkje tilgjengeleg.",
      timeout: "Det tok for lang tid å hente posisjonen din. Prøv på nytt."
    },
    searchButton: "Finn reise",
    placeholder: "Stad eller adresse",
    assistant: {
      link: "Reisesøk",
      title: "Hei, kor vil du reise?",
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
    geoButton: "My location",
    geoTexts: {
      denied: "You must change location settings in your browser to use your position in the travel search.",
      unavailable: "Your position is not available.",
      timeout: "It took too long to retrieve your position. Try again."
    },
    searchButton: "Find journey",
    placeholder: "Location or address",
    assistant: {
      link: "Journey search",
      title: "Hi, where do you want to travel?",
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
  Ve as reverse
};
