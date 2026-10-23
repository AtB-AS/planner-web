class G {
  constructor(e, n, { tabInsertsSuggestions: i, firstOptionSelectionMode: r, scrollIntoViewOptions: l } = {}) {
    this.input = e, this.list = n, this.tabInsertsSuggestions = i ?? !0, this.firstOptionSelectionMode = r ?? "none", this.scrollIntoViewOptions = l ?? { block: "nearest", inline: "nearest" }, this.isComposing = !1, n.id || (n.id = `combobox-${Math.random().toString().slice(2, 6)}`), this.ctrlBindings = !!navigator.userAgent.match(/Macintosh/), this.keyboardEventHandler = (c) => W(c, this), this.compositionEventHandler = (c) => Q(c, this), this.inputHandler = this.clearSelection.bind(this), e.setAttribute("role", "combobox"), e.setAttribute("aria-controls", n.id), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-autocomplete", "list"), e.setAttribute("aria-haspopup", "listbox");
  }
  destroy() {
    this.clearSelection(), this.stop(), this.input.removeAttribute("role"), this.input.removeAttribute("aria-controls"), this.input.removeAttribute("aria-expanded"), this.input.removeAttribute("aria-autocomplete"), this.input.removeAttribute("aria-haspopup");
  }
  start() {
    this.input.setAttribute("aria-expanded", "true"), this.input.addEventListener("compositionstart", this.compositionEventHandler), this.input.addEventListener("compositionend", this.compositionEventHandler), this.input.addEventListener("input", this.inputHandler), this.input.addEventListener("keydown", this.keyboardEventHandler), this.list.addEventListener("click", A), this.resetSelection();
  }
  stop() {
    this.clearSelection(), this.input.setAttribute("aria-expanded", "false"), this.input.removeEventListener("compositionstart", this.compositionEventHandler), this.input.removeEventListener("compositionend", this.compositionEventHandler), this.input.removeEventListener("input", this.inputHandler), this.input.removeEventListener("keydown", this.keyboardEventHandler), this.list.removeEventListener("click", A);
  }
  indicateDefaultOption() {
    var e;
    this.firstOptionSelectionMode === "active" ? (e = Array.from(this.list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')).filter($)[0]) === null || e === void 0 || e.setAttribute("data-combobox-option-default", "true") : this.firstOptionSelectionMode === "selected" && this.navigate(1);
  }
  navigate(e = 1) {
    const n = Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter($)[0], i = Array.from(this.list.querySelectorAll('[role="option"]')).filter($), r = i.indexOf(n);
    if (r === i.length - 1 && e === 1 || r === 0 && e === -1) {
      this.clearSelection(), this.input.focus();
      return;
    }
    let l = e === 1 ? 0 : i.length - 1;
    if (n && r >= 0) {
      const g = r + e;
      g >= 0 && g < i.length && (l = g);
    }
    const c = i[l];
    if (c)
      for (const g of i)
        g.removeAttribute("data-combobox-option-default"), c === g ? (this.input.setAttribute("aria-activedescendant", c.id), c.setAttribute("aria-selected", "true"), U(c), c.scrollIntoView(this.scrollIntoViewOptions)) : g.removeAttribute("aria-selected");
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
        e.resetSelection();
    }
}
function A(t) {
  if (!(t.target instanceof Element))
    return;
  const e = t.target.closest('[role="option"]');
  e && e.getAttribute("aria-disabled") !== "true" && K(e, { event: t });
}
function k(t, e) {
  const n = e.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');
  return n ? (n.getAttribute("aria-disabled") === "true" || n.click(), !0) : !1;
}
function K(t, e) {
  t.dispatchEvent(new CustomEvent("combobox-commit", { bubbles: !0, detail: e }));
}
function U(t) {
  t.dispatchEvent(new Event("combobox-select", { bubbles: !0 }));
}
function $(t) {
  return !t.hidden && !(t instanceof HTMLInputElement && t.type === "hidden") && (t.offsetWidth > 0 || t.offsetHeight > 0);
}
function Q(t, e) {
  e.isComposing = t.type === "compositionstart", document.getElementById(e.input.getAttribute("aria-controls") || "") && e.clearSelection();
}
const J = "widget-module__hidden", Y = "widget-module__wrapper", X = "widget-module__form assistant-module__container", z = "widget-module__form_departures widget-module__form assistant-module__container", ee = "widget-module__nav", te = "widget-module__tabs", oe = "widget-module__tabSelected", ne = "widget-module__main assistant-module__main", ie = "widget-module__heading assistant-module__heading", re = "widget-module__inputBoxes", se = "widget-module__searchSection assistant-module__searchSection", ae = "widget-module__search_container search-module__container", le = "widget-module__search_inputContainer search-module__inputContainer", ce = "widget-module__search_label search-module__label typography-module__typo-body__m", de = "widget-module__search_input search-module__input", ue = "widget-module__search_inputLast", pe = "widget-module__button_swap assistant-module__swapButton assistant-module__searchInputButton", me = "widget-module__selector_group selector-module__departureDateSelector", he = "widget-module__selector_options radio-segments-module__options", _e = "widget-module__selector_options__small radio-segments-module__options", fe = "widget-module__buttonLightOutline", ge = "widget-module__selector_option radio-segments-module__option", ve = "widget-module__selector_option__text radio-segments-module__option__text", Ce = "widget-module__selector_option__label radio-segments-module__option__label", we = "widget-module__selector_option__input radio-segments-module__option__input", be = "widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper", ye = "widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors", Se = "widget-module__selector_dateSelector selector-module__dateSelector", $e = "widget-module__selector_timeSelector selector-module__timeSelector", Le = "widget-module__buttonGroup", Ee = "widget-module__listItem search-module__item", Te = "widget-module__itemTitle search-module__itemName", Ie = "widget-module__itemIcon undefined", Me = "widget-module__transportIcon", He = "widget-module__transportIcon__bus", Ae = "widget-module__transportIcon__tram", ke = "widget-module__transportIcon__rail", Be = "widget-module__transportIcon__air", Ve = "widget-module__transportIcon__water", xe = "widget-module__itemLocality search-module__itemLocality typography-module__typo-body__s", De = "widget-module__itemText search-module__itemInfo", Ze = "widget-module__popupContainer search-module__menu", Fe = "widget-module__messageBox", je = "widget-module__inheritFont", o = {
  hidden: J,
  wrapper: Y,
  form: X,
  form_departures: z,
  nav: ee,
  tabs: te,
  tabSelected: oe,
  main: ne,
  heading: ie,
  inputBoxes: re,
  searchSection: se,
  search_container: ae,
  search_inputContainer: le,
  search_label: ce,
  search_input: de,
  search_inputLast: ue,
  button_swap: pe,
  selector_group: me,
  selector_options: he,
  selector_options__small: _e,
  buttonLightOutline: fe,
  selector_option: ge,
  selector_option__text: ve,
  selector_option__label: Ce,
  selector_option__input: we,
  selector_dateAndTimeSelectorsWrapper: be,
  selector_dateAndTimeSelectors: ye,
  selector_dateSelector: Se,
  selector_timeSelector: $e,
  buttonGroup: Le,
  listItem: Ee,
  itemTitle: Te,
  itemIcon: Ie,
  transportIcon: Me,
  transportIcon__bus: He,
  transportIcon__tram: Ae,
  transportIcon__rail: ke,
  transportIcon__air: Be,
  transportIcon__water: Ve,
  itemLocality: xe,
  itemText: De,
  popupContainer: Ze,
  messageBox: Fe,
  inheritFont: je
};
function B(t) {
  return Object.entries(t).reduce(function(e, n) {
    return n[1] ? e + " " + n[0] : e;
  }, "");
}
const qe = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28.325 34.585C27.635 34.585 27.075 34.025 27.075 33.335V6.66504C27.075 5.97504 27.635 5.41504 28.325 5.41504C29.015 5.41504 29.575 5.97504 29.575 6.66504V33.335C29.575 34.025 29.015 34.585 28.325 34.585Z" fill="black"/>
<path d="M28.325 34.585C28.005 34.585 27.6849 34.4646 27.4449 34.2146L22.4449 29.2146C21.9549 28.7246 21.9549 27.9346 22.4449 27.4446C22.9349 26.9546 23.7249 26.9546 24.2149 27.4446L28.3349 31.5646L32.4549 27.4446C32.9449 26.9546 33.7349 26.9546 34.2249 27.4446C34.7149 27.9346 34.7149 28.7246 34.2249 29.2146L29.2249 34.2146C28.9849 34.4546 28.6649 34.5846 28.3449 34.5846L28.325 34.585Z" fill="black"/>
<path d="M16.665 12.925C16.345 12.925 16.025 12.805 15.785 12.555L11.665 8.43498L7.54499 12.555C7.05499 13.045 6.26497 13.045 5.77497 12.555C5.28497 12.065 5.28497 11.275 5.77497 10.785L10.775 5.78498C11.265 5.29498 12.055 5.29498 12.545 5.78498L17.545 10.785C18.035 11.275 18.035 12.065 17.545 12.555C17.305 12.795 16.985 12.925 16.665 12.925Z" fill="black"/>
<path d="M11.665 34.585C10.975 34.585 10.415 34.025 10.415 33.335V6.66504C10.415 5.97504 10.975 5.41504 11.665 5.41504C12.355 5.41504 12.915 5.97504 12.915 6.66504V33.335C12.915 34.025 12.355 34.585 11.665 34.585Z" fill="black"/>
</svg>
`, Oe = `<svg width="40" height="40" viewBox="0 0 40 40" fill="#000000" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 10.5C2 8.84314 3.34315 7.5 5 7.5H30C34.9706 7.5 39 11.5294 39 16.5V24.5C39 26.1569 37.6569 27.5 36 27.5C36 24.1863 33.3137 21.5 30 21.5C26.6863 21.5 24 24.1863 24 27.5H17C17 24.1863 14.3137 21.5 11 21.5C7.68629 21.5 5 24.1863 5 27.5C3.34315 27.5 2 26.1569 2 24.5V10.5ZM5 11.5C5 10.9478 5.44772 10.5 6 10.5H8.99579C9.54807 10.5 9.99579 10.9478 9.99579 11.5V16.5C9.99579 17.0522 9.54807 17.5 8.99579 17.5H6C5.5 17.5 5 17 5 16.5V11.5ZM13.0109 10.5C12.4586 10.5 12.0109 10.9478 12.0109 11.5L12 16.5C12 17 12.5 17.5 13 17.5H17.0109C17.5632 17.5 18.0109 17.0522 18.0109 16.5V11.5C18.0109 10.9478 17.5632 10.5 17.0109 10.5H13.0109ZM20.0259 11.5C20.0259 10.9478 20.4736 10.5 21.0259 10.5H25.0259C25.5782 10.5 26.0259 10.9478 26.0259 11.5V16.5C26.0259 17.0522 25.5782 17.5 25.0259 17.5H22.0259C20.9213 17.5 20 17.6046 20 16.5L20.0259 11.5ZM29.0409 10.5C28.4886 10.5 28.0409 10.9478 28.0409 11.5V16.5C28.0409 17.0522 28.4886 17.5 29.0409 17.5H35.0409C35.5932 17.5 36.0409 17.0522 36.0409 16.5C36.0409 13.1863 33.3546 10.5 30.0409 10.5H29.0409Z" fill="#000000"/>
<path d="M15 27.5C15 29.7091 13.2091 31.5 11 31.5C8.79086 31.5 7 29.7091 7 27.5C7 25.2909 8.79086 23.5 11 23.5C13.2091 23.5 15 25.2909 15 27.5Z" fill="#000000"/>
<path d="M34 27.5C34 29.7091 32.2091 31.5 30 31.5C27.7909 31.5 26 29.7091 26 27.5C26 25.2909 27.7909 23.5 30 23.5C32.2091 23.5 34 25.2909 34 27.5Z" fill="#000000"/>
</svg>
`, Pe = `<svg width="40" height="40" viewBox="0 0 40 40" fill="#000000" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 14.75C2 13.0931 3.34315 11.75 5 11.75H30C34.9706 11.75 39 15.7794 39 20.75V26.75C39 28.4069 37.6636 29.75 36.0067 29.75C26.2304 29.75 7.68998 29.75 5 29.75C3.34315 29.75 2 28.4069 2 26.75V14.75ZM5 15.75C5 15.1978 5.44772 14.75 6 14.75H8.99579C9.54807 14.75 9.99579 15.1978 9.99579 15.75V20.75C9.99579 21.3022 9.54807 21.75 8.99579 21.75H6C5.5 21.75 5 21.25 5 20.75V15.75ZM13.0109 14.75C12.4586 14.75 12.0109 15.1978 12.0109 15.75L12 20.75C12 21.25 12.5 21.75 13 21.75H17.0109C17.5632 21.75 18.0109 21.3022 18.0109 20.75V15.75C18.0109 15.1978 17.5632 14.75 17.0109 14.75H13.0109ZM20.0259 15.75C20.0259 15.1978 20.4736 14.75 21.0259 14.75H25.0259C25.5782 14.75 26.0259 15.1978 26.0259 15.75V20.75C26.0259 21.3022 25.5782 21.75 25.0259 21.75H22.0259C20.9213 21.75 20 21.8546 20 20.75L20.0259 15.75ZM29.0409 14.75C28.4886 14.75 28.0409 15.1978 28.0409 15.75V20.75C28.0409 21.3022 28.4886 21.75 29.0409 21.75H35.0409C35.5932 21.75 36.0409 21.3022 36.0409 20.75C36.0409 17.4363 33.3546 14.75 30.0409 14.75H29.0409Z" fill="#000000"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 32.75C2.75 32.0596 3.30964 31.5 4 31.5L37 31.5C37.6904 31.5 38.25 32.0596 38.25 32.75C38.25 33.4404 37.6904 34 37 34L4 34C3.30964 34 2.75 33.4404 2.75 32.75Z" fill="#000000"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.75 7.75C14.75 7.05964 15.3096 6.5 16 6.5H24C24.4936 6.5 24.941 6.79051 25.1419 7.24145C25.3427 7.69239 25.2593 8.21929 24.9291 8.58621L20.4291 13.5862C19.9673 14.0993 19.1769 14.1409 18.6638 13.6791C18.1507 13.2173 18.1091 12.4269 18.5709 11.9138L21.1933 9H16C15.3096 9 14.75 8.44036 14.75 7.75Z" fill="#000000"/>
</svg>
`, Ne = `<svg width="40" height="40" viewBox="0 0 40 40" fill="#000000" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.66992 5.00008C1.66992 4.08008 2.41008 3.33008 3.33008 3.33008H15.5601C18.8001 3.33008 21.9601 4.38008 24.5601 6.33008L34.3301 13.6601C36.8501 15.5501 38.3301 18.5101 38.3301 21.6601C38.3301 24.4201 36.1001 26.6601 33.3301 26.6601H3.33008C2.41008 26.6601 1.66992 25.9101 1.66992 24.9901V21.2401H13.3398C14.0298 21.2401 14.5898 20.6801 14.5898 19.9901C14.5898 15.6201 11.0399 12.0701 6.66992 12.0701H1.66992V4.99008V5.00008ZM1.66992 14.5801V18.7501H11.9399C11.3799 16.3601 9.22992 14.5801 6.66992 14.5801H1.66992ZM32.3301 16.3301C32.6401 16.5601 32.9199 16.8101 33.1699 17.0801H28.3301C24.4201 17.0801 21.25 13.9101 21.25 10.0001V8.15008C21.7 8.40008 22.1401 8.69008 22.5601 9.00008L32.3301 16.3301Z" fill="#000000"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.66992 31.67C1.66992 30.75 2.41008 30 3.33008 30H36.6699C37.5899 30 38.3301 30.75 38.3301 31.67C38.3301 32.59 37.5899 33.34 36.6699 33.34H3.33008C2.41008 33.34 1.66992 32.59 1.66992 31.67Z" fill="#000000"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M10 30C10.92 30 11.6699 30.75 11.6699 31.67V35C11.6699 35.92 10.92 36.67 10 36.67C9.08 36.67 8.33008 35.92 8.33008 35V31.67C8.33008 30.75 9.08 30 10 30ZM20 30C20.92 30 21.6699 30.75 21.6699 31.67V35C21.6699 35.92 20.92 36.67 20 36.67C19.08 36.67 18.3301 35.92 18.3301 35V31.67C18.3301 30.75 19.08 30 20 30ZM30 30C30.92 30 31.6699 30.75 31.6699 31.67V35C31.6699 35.92 30.92 36.67 30 36.67C29.08 36.67 28.3301 35.92 28.3301 35V31.67C28.3301 30.75 29.08 30 30 30Z" fill="#000000"/>
</svg>
`, Re = `<svg width="40" height="40" viewBox="0 0 40 40" fill="#000000" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M20 2.5C29.665 2.5 37.5 10.335 37.5 20C37.5 29.665 29.665 37.5 20 37.5C10.335 37.5 2.5 29.665 2.5 20C2.5 10.335 10.335 2.5 20 2.5ZM20 5.5C11.9919 5.5 5.5 11.9919 5.5 20C5.5 28.0081 11.9919 34.5 20 34.5C28.0081 34.5 34.5 28.0081 34.5 20C34.5 11.9919 28.0081 5.5 20 5.5Z" fill="#000000"/>
<path d="M13.9575 15.665C13.1525 15.665 12.5 15.0125 12.5 14.2075C12.5 13.4025 13.1525 12.75 13.9575 12.75H26.03C26.835 12.75 27.4875 13.4025 27.4875 14.2075C27.4875 15.0125 26.835 15.665 26.03 15.665H21.45V28.79C21.45 29.5963 20.7963 30.25 19.99 30.25C19.1837 30.25 18.53 29.5963 18.53 28.79V15.665H13.9575Z" fill="#000000"/>
</svg>
`, Ge = `<svg width="40" height="40" viewBox="0 0 40 40" fill="#000000" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M23.3295 7.0555C26.0035 3.31257 31.4515 2.55368 34.9335 4.64245C35.1095 4.748 35.2567 4.89523 35.3623 5.07115C37.4767 8.59435 36.5458 13.2834 33.403 15.9422L30.9588 18.01L33.2312 26.6433C33.6478 28.2263 33.1922 29.9115 32.0347 31.0688L29.8403 33.2627C29.5733 33.5295 29.2002 33.6615 28.8248 33.6217C28.4495 33.582 28.1122 33.3747 27.9072 33.0578L22.2278 24.2825L19.0047 27.505L19.531 32.2407C19.5728 32.618 19.441 32.9942 19.1723 33.2627L16.8017 35.6328C16.5176 35.9168 16.1143 36.047 15.7177 35.9827C15.3211 35.9183 14.9797 35.6673 14.8 35.308L11.4303 28.5702L4.69109 25.2012C4.33165 25.0215 4.08052 24.68 4.01615 24.2833C3.95179 23.8867 4.08205 23.4832 4.36622 23.1992L6.73685 20.829C7.00535 20.5605 7.3813 20.4287 7.75867 20.4707L12.4956 20.9968L15.7185 17.7747L6.94169 12.0968C6.6247 11.8917 6.41739 11.5543 6.3776 11.1789C6.33784 10.8035 6.46987 10.4302 6.73685 10.1633L8.9312 7.96937C10.0888 6.81205 11.7739 6.3566 13.3569 6.7731L21.9213 9.02643L23.3295 7.0555Z" fill="#000000"/>
</svg>
`, We = `<svg width="40" height="40" viewBox="0 0 40 40" fill="#000000" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.8165 10.8085C19.5665 10.4785 20.4269 10.4785 21.1769 10.8085L31.7369 15.4785C33.9969 16.4785 35.0566 19.0685 34.1466 21.3585L33.5367 22.9085C33.5367 22.9085 33.4769 22.9085 33.4469 22.9085H29.5665C28.8765 22.9085 28.3165 23.4685 28.3165 24.1585C28.3165 24.8485 28.8765 25.4085 29.5665 25.4085H32.5465L31.0065 29.2885C30.6965 29.2185 30.3665 29.1785 30.0265 29.1685C27.8565 29.0785 26.1866 30.0785 24.9366 31.3785C24.1366 30.7285 22.4465 29.4385 20.2565 29.2785C18.0765 29.1285 16.3365 30.0585 15.0265 31.3785L14.9567 31.3285C14.1767 30.7485 12.3966 29.4485 10.1466 29.3085C9.75661 29.2885 9.37672 29.2985 9.01672 29.3385L7.45666 25.4085H10.4166C11.1066 25.4085 11.6666 24.8485 11.6666 24.1585C11.6666 23.4685 11.1066 22.9085 10.4166 22.9085H6.46692L5.85657 21.3585C4.94657 19.0685 6.00672 16.4685 8.26672 15.4785L18.8165 10.8085Z" fill="#000000"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.89649 9.53877C9.12649 6.95877 11.2865 4.98877 13.8765 4.98877H26.1167C28.7067 4.98877 30.8667 6.95877 31.0967 9.53877L31.6567 15.6788C31.7367 16.5988 31.0665 17.4088 30.1465 17.4888C29.2265 17.5688 28.4164 16.8988 28.3364 15.9788L27.7764 9.83877C27.6964 8.97877 26.9767 8.31877 26.1167 8.31877H13.8765C13.0165 8.31877 12.2968 8.97877 12.2168 9.83877L11.6567 15.9788C11.5767 16.8988 10.7667 17.5688 9.84669 17.4888C8.92669 17.4088 8.25643 16.5988 8.33643 15.6788L8.89649 9.53877Z" fill="#000000"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.996 1.65869C20.916 1.65869 21.6659 2.40869 21.6659 3.32869V6.65869C21.6659 7.57869 20.916 8.32869 19.996 8.32869C19.076 8.32869 18.326 7.57869 18.326 6.65869V3.32869C18.326 2.40869 19.076 1.65869 19.996 1.65869Z" fill="#000000"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M35.2758 34.9786C35.2758 34.9786 35.3662 34.9086 35.4462 34.8286C36.0762 34.1586 37.1361 34.1286 37.8061 34.7586C38.4761 35.3886 38.5059 36.4386 37.8759 37.1186C37.3059 37.7286 36.606 38.1786 35.766 38.3086C34.936 38.4286 34.2059 38.1986 33.6459 37.9086C33.0959 37.6286 32.616 37.2386 32.226 36.8986C32.026 36.7286 31.7658 36.4886 31.5258 36.2686C31.3558 36.1186 31.2061 35.9786 31.0961 35.8786C30.3161 35.1786 29.946 35.0186 29.766 35.0086C29.766 35.0086 29.6663 35.0086 29.4863 35.1286C29.2663 35.2786 28.936 35.5986 28.516 36.2386H28.5058C28.0158 36.9786 27.4059 37.5986 26.6259 37.9186C25.7959 38.2686 24.9861 38.1986 24.3061 37.9686C23.6761 37.7586 23.126 37.3886 22.686 37.0686C22.376 36.8386 22.046 36.5586 21.746 36.3186C21.646 36.2286 21.5362 36.1486 21.4462 36.0686C20.5862 35.3686 20.1361 35.1286 19.8461 35.1086H19.8359C19.8359 35.1086 19.3458 35.0586 18.5058 36.3086C18.0558 37.0086 17.4559 37.5986 16.6459 37.8886C15.8259 38.1886 15.046 38.0786 14.416 37.8686C13.816 37.6586 13.2759 37.3286 12.8359 37.0186C12.5359 36.8186 12.2162 36.5786 11.9262 36.3586C11.7962 36.2586 11.6658 36.1586 11.5458 36.0786C10.6558 35.4286 10.1458 35.1686 9.79583 35.1486C9.69583 35.1486 9.25581 35.1186 8.52581 36.2386H8.51605C7.78605 37.3386 6.68601 38.3086 5.22601 38.3086C3.76601 38.3086 2.65622 37.3386 1.94622 36.2386C1.43622 35.4686 1.6562 34.4386 2.4262 33.9286C3.1962 33.4286 4.23626 33.6386 4.73626 34.4186C4.97626 34.7886 5.14601 34.9186 5.22601 34.9586C5.30601 34.9186 5.48626 34.7886 5.73626 34.4086C6.86626 32.6886 8.28579 31.7186 10.0058 31.8186C11.4658 31.9086 12.7158 32.7886 13.5258 33.3886C13.7058 33.5186 13.866 33.6386 14.016 33.7486C14.266 33.9386 14.4963 34.1086 14.7363 34.2686C15.1063 34.5186 15.346 34.6586 15.516 34.7086C15.526 34.7086 15.5358 34.7086 15.5458 34.7086C15.5858 34.6686 15.646 34.5886 15.726 34.4686C16.896 32.6986 18.3261 31.6486 20.0761 31.7686C21.5661 31.8786 22.7958 32.8586 23.5458 33.4686C23.6958 33.5886 23.8262 33.6986 23.9462 33.7986C24.2162 34.0186 24.446 34.2086 24.686 34.3886C25.026 34.6486 25.2459 34.7586 25.3759 34.8086C25.4359 34.7586 25.556 34.6486 25.726 34.3986C26.836 32.7086 28.196 31.5886 29.916 31.6686C31.416 31.7386 32.5959 32.7386 33.3159 33.3786C33.5459 33.5886 33.7161 33.7386 33.8661 33.8886C34.0361 34.0486 34.1959 34.1886 34.416 34.3786C34.746 34.6786 34.9962 34.8486 35.1762 34.9486C35.2262 34.9686 35.2558 34.9886 35.2758 34.9986V34.9786Z" fill="#000000"/>
</svg>
`;
var D = { MODULE_VERSION: "3.28.0", COMPRESSED_ORG: "GYJwhgtkA" };
const Ke = 300, b = String.raw, L = D.MODULE_VERSION, E = D.COMPRESSED_ORG;
function Ue(t) {
  if (!t?.startsWith("http"))
    throw new Error("Missing urlBase in correct schema.");
  return t.endsWith("/") || (t += "/"), {
    URL_BASE: t,
    URL_JS_UMD: `${t}widget/${E}/${L}/planner-web.umd.js`,
    URL_JS_ESM: `${t}widget/${E}/${L}/planner-web.mjs`,
    URL_CSS: `${t}widget/${E}/${L}/planner-web.css`
  };
}
function _t({
  urlBase: t,
  language: e = "en",
  outputOverrideOptions: n = {}
}) {
  const i = mt(e), r = Ue(t), l = {
    inheritFont: !1,
    layoutMode: "doubleColumn",
    ...n
  };
  return {
    output: Xe(r, i, l),
    init: Qe,
    urls: r
  };
}
function Qe() {
  ze(), V("pw-assistant"), V("pw-departures");
  let t = {
    from: void 0,
    to: void 0
  };
  document.addEventListener("search-selected", function(e) {
    const n = e;
    t[n.detail.key] = n.detail.item;
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
    e.addEventListener("change", function(n) {
      const r = n.currentTarget.value === "now";
      document.querySelectorAll(".js-search-date-details").forEach((l) => {
        l.hidden = r;
      });
    });
  }), document.querySelector("#pw-form-departures")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const n = e.currentTarget;
    Ye(n, t.from);
  }), document.querySelector("#pw-form-assistant")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const n = e.currentTarget;
    Je(n, t.from, t.to);
  });
}
function V(t) {
  const e = document.querySelector(
    `#${t}-searchTimeSelector-date`
  ), n = document.querySelector(
    `#${t}-searchTimeSelector-time`
  );
  try {
    if (e && (e.valueAsDate = /* @__PURE__ */ new Date()), n) {
      const i = /* @__PURE__ */ new Date(), r = String(i.getHours()).padStart(2, "0"), l = String(i.getMinutes()).padStart(2, "0");
      n.value = `${r}:${l}`;
    }
  } catch {
  }
}
function Z(t, e) {
  const n = t.get(`${e}-searchTimeSelector`);
  if (n === "now")
    return {
      mode: "now"
    };
  {
    const i = t.get("dateinput"), r = t.get("timeinput");
    if (i && r) {
      const l = /* @__PURE__ */ new Date(`${i}T${r}`);
      return {
        mode: n == "arriveBy" ? "arriveBy" : "departBy",
        dateTime: l.getTime()
      };
    }
    return {
      mode: "now"
    };
  }
}
function Je(t, e, n) {
  const i = t.action, r = Z(new FormData(t), "pw-assistant"), l = st({ from: e, to: n }, r), c = new URLSearchParams(l);
  window.location.href = `${i}?${c.toString()}`;
}
function Ye(t, e) {
  const n = t.action, i = Z(new FormData(t), "pw-departures"), r = at(i, e), l = new URLSearchParams(r);
  e?.layer === "venue" ? window.location.href = `${n}/${e.id}?${l.toString()}` : window.location.href = `${n}?${l.toString()}`;
}
class y extends HTMLElement {
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
      y.clearMessageBox();
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
function Xe({ URL_BASE: t }, e, n) {
  function i(s) {
    const d = l(s), f = _("span", [s.name], o.itemTitle), p = _("span", [s.locality ?? ""], o.itemLocality), u = _("div", [f, p], o.itemText), h = _("li", [u, d], o.listItem);
    return h.role = "option", h.setAttribute("data-feature-id", s.id), h;
  }
  function r(s) {
    const d = _("span", [s]);
    return _("li", [d], o.listItem);
  }
  function l(s) {
    const d = nt(s.category);
    let f;
    if (d.length)
      f = d.map(c);
    else {
      const u = !!s.housenumber, h = _("img");
      h.src = u ? `${t}assets/mono/light/places/House.svg` : `${t}assets/mono/light/map/Pin.svg`, h.alt = u ? "address" : "unknown", h.role = "img", f = [h];
    }
    const p = _("div", f, o.itemIcon);
    return p.ariaHidden = "true", p;
  }
  function c(s) {
    const d = _(
      "span",
      [],
      B({
        [o.transportIcon]: !0,
        [o.transportIcon__bus]: s === "bus",
        [o.transportIcon__tram]: s === "tram",
        [o.transportIcon__rail]: s === "rail" || s === "metro",
        [o.transportIcon__air]: s === "air",
        [o.transportIcon__water]: s === "water"
      })
    );
    return d.innerHTML = x(ot[s], 20), d;
  }
  class g extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.querySelector("button").addEventListener("click", async () => {
        y.clearMessageBox();
        const f = document.getElementsByClassName(
          "widget-module__search_input"
        ), [p, u] = Array.from(f);
        [p.value, u.value] = [u.value, p.value], document.dispatchEvent(new CustomEvent("swap-selected"));
      });
    }
  }
  customElements.define("pw-swapbutton", g), customElements.define("pw-messagebox", y);
  class j extends HTMLElement {
    constructor() {
      super(), this.dataList = {};
    }
    getItem(d) {
      return this.dataList[d];
    }
    setItems(d) {
      this.dataList = {};
      for (let f of d)
        this.dataList[f.id] = f;
    }
    connectedCallback() {
      const d = this, f = tt(
        this.getAttribute("data-debounce-ms"),
        Ke
      ), p = this.querySelector("input"), u = this.querySelector(
        "#" + this.getAttribute("for")
      );
      let h = new G(p, u, {
        tabInsertsSuggestions: !0,
        scrollIntoViewOptions: !1
      });
      const P = function() {
        const a = _("img");
        a.src = `${t}assets/mono/places/Location.svg`, a.role = "img";
        const m = _("div", [a], o.itemIcon);
        a.ariaHidden = "true";
        const v = _("span", [e.geoButton], o.itemTitle), w = _("div", [v], o.itemText), S = _("li", [w, m], o.listItem);
        return S.classList.add("itemLocation"), S.role = "option", S;
      };
      function C(a) {
        const m = P();
        a ? (u.appendChild(m), h.start()) : (u.innerHTML = "", h.clearSelection(), h.stop()), u.hidden = !a;
      }
      function M() {
        d.setItems([]), u.innerHTML = "";
        const a = r(e.noResults);
        u.appendChild(a), C(!0);
      }
      function H() {
        if (u && !u.hidden && p.value.trim() !== "") {
          const a = u.firstElementChild;
          a && a.dispatchEvent(
            new CustomEvent("combobox-commit", {
              bubbles: !0
            })
          );
        }
      }
      const N = et(async (a) => {
        try {
          if (!a.value) {
            u.innerHTML = "";
            return;
          }
          const m = await lt(t, a.value);
          if (m.length === 0)
            return M();
          d.setItems(m), u.innerHTML = "";
          for (let v of m) {
            const w = i(v);
            u.appendChild(w);
          }
          C(!0);
        } catch {
          M();
        }
      }, f);
      p.addEventListener("keydown", (a) => {
        a.key === "Escape" && (H(), C(!1));
      }), p.addEventListener(
        "input",
        (a) => N(a.target)
      ), p.addEventListener("focus", () => C(!0)), p.addEventListener("blur", () => {
        H(), C(!1);
      }), document.addEventListener("click", (a) => {
        F(a.target, this) || C(!1);
      });
      const R = async function() {
        y.clearMessageBox();
        try {
          const a = await dt(t, e), m = d.parentElement?.querySelector("input");
          m && (m.value = a ? `${a.name}` : m.value), document.dispatchEvent(
            new CustomEvent("search-selected", {
              bubbles: !0,
              detail: {
                key: "from",
                item: a
              }
            })
          );
        } catch (a) {
          a instanceof Error && document.dispatchEvent(
            new CustomEvent("pw-errorMessage", {
              bubbles: !0,
              detail: {
                message: a.message
              }
            })
          );
        }
      };
      u.addEventListener("combobox-commit", function(a) {
        a.target.classList.contains("itemLocation") && R();
        const m = a.target.getAttribute(
          "data-feature-id"
        ), v = m ? d.getItem(m) : void 0;
        let w = p.value;
        v && (w = `${v.name}`), p.value = w, document.dispatchEvent(
          new CustomEvent("search-selected", {
            bubbles: !0,
            detail: {
              key: p.name,
              item: v
            }
          })
        ), u.hidden = !0, h.clearSelection(), h.stop();
      });
    }
  }
  customElements.define("pw-autocomplete", j);
  const T = (s) => b`
    <div class="${o.buttonGroup}">
      <button
        type="submit"
        class="${o.buttonLightOutline}"
      >
        <span>${s}</span>
      </button>
    </div>
  `, I = (s, d = !0) => b`
    <fieldset class="${o.inputBoxes}">
      <legend class="${o.heading}">${e.searchTime.title}</legend>
      <div class="${o.selector_group}">
        <div
          class="${o.selector_options} ${d ? "" : o.selector_options__small}"
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
          ${d ? b`
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
  `, q = b`
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
                ${x(qe, 20)}
              </button>
            </pw-swapbutton>
            <pw-messagebox></pw-messagebox>
          </div>
        </fieldset>
        ${n.layoutMode !== "compact" ? I("pw-assistant") : ""}
      </div>
      ${T(e.searchButton)}
    </form>
  `, O = b`
    <form
      class="${o.form_departures}"
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
        ${n.layoutMode !== "compact" ? I("pw-departures", !1) : ""}
      </div>
      ${T(e.departure.searchButton)}
    </form>
  `;
  return b`
    <div
      data-theme="light"
      data-layout="${n.singleColumnLayout ? "singleColumn" : n.layoutMode}"
      class="${B({
    [o.wrapper]: !0,
    [o.inheritFont]: n.inheritFont ?? !1
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
      <div class="js-tabpanel" id="pw-assistant">${q}</div>
      <div class="js-tabpanel ${o.hidden}" id="pw-departures">
        ${O}
      </div>
    </div>
  `;
}
function ze() {
  document.querySelector(".js-tablist")?.addEventListener("click", function(t) {
    t.preventDefault(), t.stopPropagation();
    const e = t.target?.closest("a");
    if (!e) return;
    const n = e.getAttribute("data-mode");
    if (!n) return;
    const i = document.querySelector("#pw-" + n);
    if (!i) return;
    y.clearMessageBox(), document.querySelectorAll(".js-tabpanel").forEach((c) => {
      c.classList.add(o.hidden);
    }), document.querySelectorAll(".js-tablist a").forEach((c) => {
      c.classList.remove(o.tabSelected);
    }), i.classList.remove(o.hidden), e.classList.add(o.tabSelected);
    const r = document.querySelectorAll(
      `input[type="radio"][name="pw-${n}-searchTimeSelector"]`
    ), l = Array.from(r).find(
      (c) => c.checked
    )?.value;
    document.querySelectorAll(".js-search-date-details").forEach((c) => {
      c.hidden = l === "now";
    }), document.dispatchEvent(
      new CustomEvent("reset-search", {
        bubbles: !0
      })
    );
  });
}
function et(t, e) {
  let n = null;
  return function(...i) {
    clearTimeout(n), n = setTimeout(() => {
      t(...i);
    }, e);
  };
}
function _(t, e = [], n = "") {
  const i = document.createElement(t);
  if (Array.isArray(e))
    for (let r of e) {
      let l = typeof r == "string" ? document.createTextNode(r) : r;
      i.appendChild(l);
    }
  return i.className = n, i;
}
function x(t, e) {
  return t.replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"').replace(/width="\d+"/, `width="${e}"`).replace(/height="\d+"/, `height="${e}"`).replace("<svg", '<svg aria-hidden="true" focusable="false"');
}
function tt(t, e) {
  const n = parseInt(t, 10);
  return Number.isNaN(n) ? e : n;
}
function F(t, e) {
  return t === e ? !0 : !t || !t.parentElement ? !1 : F(t.parentElement, e);
}
const ot = {
  bus: Oe,
  tram: Pe,
  rail: Ne,
  air: Ge,
  water: We,
  metro: Re
};
function nt(t) {
  return t.map(it).filter((e) => e !== void 0).filter((e, n, i) => i.indexOf(e) === n);
}
function it(t) {
  switch (t) {
    case "onstreetBus":
    case "busStation":
    case "coachStation":
      return "bus";
    case "onstreetTram":
    case "tramStation":
      return "tram";
    case "railStation":
      return "rail";
    case "airport":
      return "air";
    case "harbourPort":
    case "ferryPort":
    case "ferryStop":
      return "water";
    case "metroStation":
      return "metro";
    default:
      return;
  }
}
function rt(t, e) {
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
function st(t, e) {
  const n = e.mode !== "now" ? {
    searchMode: e.mode,
    searchTime: e.dateTime.toString()
  } : { searchMode: e.mode }, i = rt(
    t.from,
    t.to
  );
  return {
    ...n,
    ...i
  };
}
function at(t, e) {
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
async function lt(t, e) {
  const n = `${t}api/departures/autocomplete?q=${e}`, i = await fetch(n);
  if (!i.ok)
    throw new Error(`Error fetching autocomplete data from ${n}`);
  return await i.json();
}
async function ct(t, e) {
  const i = await (await fetch(
    `${t}api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`
  )).json();
  if (i)
    return i;
}
async function dt(t, e) {
  return new Promise(function(n, i) {
    navigator.geolocation.getCurrentPosition(
      async (r) => {
        const l = await ct(t, r.coords);
        n(l);
      },
      (r) => {
        i(new Error(ut(r.code, e)));
      },
      { enableHighAccuracy: !0, timeout: 1e4 }
    );
  });
}
function ut(t, e) {
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
const pt = {
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
      link: "Finn reise",
      title: "Hvor vil du reise?",
      from: "Fra",
      to: "Til"
    },
    departure: {
      link: "Se avganger",
      title: "Hvor vil du reise fra?",
      from: "Fra",
      searchButton: "Finn avganger"
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
      link: "Finn reise",
      title: "Kor vil du reise?",
      from: "Frå",
      to: "Til"
    },
    departure: {
      link: "Sjå avganger",
      title: "Kor vil du reise frå?",
      from: "Frå",
      searchButton: "Finn avgangar"
    },
    searchTime: {
      title: "Når vil du reise?",
      now: "No",
      arrive: "Framkomst",
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
    searchButton: "Find trip",
    placeholder: "Location or address",
    assistant: {
      link: "Find trip",
      title: "Where do you want to travel?",
      from: "From",
      to: "To"
    },
    departure: {
      link: "See departures",
      title: "Where do you want to travel from?",
      from: "From",
      searchButton: "Find departures"
    },
    searchTime: {
      title: "When do you want to travel?",
      now: "Now",
      arrive: "Arrive by",
      depart: "Leave at",
      date: "Date",
      time: "Time"
    }
  }
};
function mt(t) {
  return pt[t];
}
export {
  _t as createWidget,
  ct as reverse
};
