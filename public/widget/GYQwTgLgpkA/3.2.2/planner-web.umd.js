(function(b,T){typeof exports=="object"&&typeof module<"u"?T(exports):typeof define=="function"&&define.amd?define(["exports"],T):(b=typeof globalThis<"u"?globalThis:b||self,T(b.PlannerWeb={}))})(this,(function(b){"use strict";class T{constructor(e,o,{tabInsertsSuggestions:i,firstOptionSelectionMode:a,scrollIntoViewOptions:r}={}){this.input=e,this.list=o,this.tabInsertsSuggestions=i??!0,this.firstOptionSelectionMode=a??"none",this.scrollIntoViewOptions=r??{block:"nearest",inline:"nearest"},this.isComposing=!1,o.id||(o.id=`combobox-${Math.random().toString().slice(2,6)}`),this.ctrlBindings=!!navigator.userAgent.match(/Macintosh/),this.keyboardEventHandler=l=>O(l,this),this.compositionEventHandler=l=>W(l,this),this.inputHandler=this.clearSelection.bind(this),e.setAttribute("role","combobox"),e.setAttribute("aria-controls",o.id),e.setAttribute("aria-expanded","false"),e.setAttribute("aria-autocomplete","list"),e.setAttribute("aria-haspopup","listbox")}destroy(){this.clearSelection(),this.stop(),this.input.removeAttribute("role"),this.input.removeAttribute("aria-controls"),this.input.removeAttribute("aria-expanded"),this.input.removeAttribute("aria-autocomplete"),this.input.removeAttribute("aria-haspopup")}start(){this.input.setAttribute("aria-expanded","true"),this.input.addEventListener("compositionstart",this.compositionEventHandler),this.input.addEventListener("compositionend",this.compositionEventHandler),this.input.addEventListener("input",this.inputHandler),this.input.addEventListener("keydown",this.keyboardEventHandler),this.list.addEventListener("mousedown",I),this.resetSelection()}stop(){this.clearSelection(),this.input.setAttribute("aria-expanded","false"),this.input.removeEventListener("compositionstart",this.compositionEventHandler),this.input.removeEventListener("compositionend",this.compositionEventHandler),this.input.removeEventListener("input",this.inputHandler),this.input.removeEventListener("keydown",this.keyboardEventHandler),this.list.removeEventListener("mousedown",I)}indicateDefaultOption(){var e;this.firstOptionSelectionMode==="active"?(e=Array.from(this.list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')).filter(E)[0])===null||e===void 0||e.setAttribute("data-combobox-option-default","true"):this.firstOptionSelectionMode==="selected"&&this.navigate(1)}navigate(e=1){const o=Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter(E)[0],i=Array.from(this.list.querySelectorAll('[role="option"]')).filter(E),a=i.indexOf(o);if(a===i.length-1&&e===1||a===0&&e===-1){this.clearSelection(),this.input.focus();return}let r=e===1?0:i.length-1;if(o&&a>=0){const f=a+e;f>=0&&f<i.length&&(r=f)}const l=i[r];if(l)for(const f of i)f.removeAttribute("data-combobox-option-default"),l===f?(this.input.setAttribute("aria-activedescendant",l.id),l.setAttribute("aria-selected","true"),N(l),l.scrollIntoView(this.scrollIntoViewOptions)):f.removeAttribute("aria-selected")}clearSelection(){this.input.removeAttribute("aria-activedescendant");for(const e of this.list.querySelectorAll('[aria-selected="true"], [data-combobox-option-default="true"]'))e.removeAttribute("aria-selected"),e.removeAttribute("data-combobox-option-default")}resetSelection(){this.clearSelection(),this.indicateDefaultOption()}}function O(t,e){if(!(t.shiftKey||t.metaKey||t.altKey)&&!(!e.ctrlBindings&&t.ctrlKey)&&!e.isComposing)switch(t.key){case"Enter":C(e.input,e.list)&&t.preventDefault();break;case"Tab":e.tabInsertsSuggestions&&C(e.input,e.list)&&t.preventDefault();break;case"Escape":e.clearSelection();break;case"ArrowDown":e.navigate(1),t.preventDefault();break;case"ArrowUp":e.navigate(-1),t.preventDefault();break;case"n":e.ctrlBindings&&t.ctrlKey&&(e.navigate(1),t.preventDefault());break;case"p":e.ctrlBindings&&t.ctrlKey&&(e.navigate(-1),t.preventDefault());break;default:if(t.ctrlKey)break;e.resetSelection()}}function I(t){if(!(t.target instanceof Element))return;const e=t.target.closest('[role="option"]');e&&e.getAttribute("aria-disabled")!=="true"&&M(e,{event:t})}function C(t,e){const o=e.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');return o?(o.getAttribute("aria-disabled")==="true"||M(o),!0):!1}function M(t,e){t.dispatchEvent(new CustomEvent("combobox-commit",{bubbles:!0,detail:e}))}function N(t){t.dispatchEvent(new Event("combobox-select",{bubbles:!0}))}function E(t){return!t.hidden&&!(t instanceof HTMLInputElement&&t.type==="hidden")&&(t.offsetWidth>0||t.offsetHeight>0)}function W(t,e){e.isComposing=t.type==="compositionstart",document.getElementById(e.input.getAttribute("aria-controls")||"")&&e.clearSelection()}const n={hidden:"widget-module__hidden",wrapper:"widget-module__wrapper",form:"widget-module__form assistant-module__container",nav:"widget-module__nav",tabs:"widget-module__tabs",tabSelected:"widget-module__tabSelected",main:"widget-module__main assistant-module__main",heading:"widget-module__heading assistant-module__heading",inputBoxes:"widget-module__inputBoxes",searchSection:"widget-module__searchSection assistant-module__searchSection",search_container:"widget-module__search_container search-module__container",search_inputContainer:"widget-module__search_inputContainer search-module__inputContainer",search_label:"widget-module__search_label search-module__label typography-module__typo-body__secondary",search_input:"widget-module__search_input search-module__input",search_inputLast:"widget-module__search_inputLast",button_swap:"widget-module__button_swap assistant-module__searchInputButton",selector_options:"widget-module__selector_options selector-module__options",selector_options__small:"widget-module__selector_options__small selector-module__options",selector_option:"widget-module__selector_option selector-module__option",selector_option__text:"widget-module__selector_option__text selector-module__option__text",selector_option__label:"widget-module__selector_option__label selector-module__option__label",selector_option__input:"widget-module__selector_option__input selector-module__option__input",selector_dateAndTimeSelectorsWrapper:"widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper",selector_dateAndTimeSelectors:"widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors",selector_dateSelector:"widget-module__selector_dateSelector selector-module__dateSelector",selector_timeSelector:"widget-module__selector_timeSelector selector-module__timeSelector",buttonGroup:"widget-module__buttonGroup",button:"widget-module__button",listItem:"widget-module__listItem search-module__item",itemTitle:"widget-module__itemTitle search-module__itemName",itemIcon:"widget-module__itemIcon undefined",itemLocality:"widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary",itemText:"widget-module__itemText search-module__itemInfo",popupContainer:"widget-module__popupContainer search-module__menu",messageBox:"widget-module__messageBox",inheritFont:"widget-module__inheritFont"};function G(t){return Object.entries(t).reduce(function(e,o){return o[1]?e+" "+o[0]:e},"")}var D={MODULE_VERSION:"3.2.2",COMPRESSED_ORG:"GYQwTgLgpkA"};const R=300,w=String.raw,L=D.MODULE_VERSION,A=D.COMPRESSED_ORG;function V(t){if(!t?.startsWith("http"))throw new Error("Missing urlBase in correct schema.");return t.endsWith("/")||(t+="/"),{URL_BASE:t,URL_JS_UMD:`${t}widget/${A}/${L}/planner-web.umd.js`,URL_JS_ESM:`${t}widget/${A}/${L}/planner-web.mjs`,URL_CSS:`${t}widget/${A}/${L}/planner-web.css`}}function K({urlBase:t,language:e="en",outputOverrideOptions:o={}}){const i=de(e),a=V(t),r={inheritFont:!1,layoutMode:"doubleColumn",...o};return{output:J(a,i,r),init:U,urls:a}}function U(){z(),B("pw-assistant"),B("pw-departures");let t={from:void 0,to:void 0};document.addEventListener("search-selected",function(e){const o=e;t[o.detail.key]=o.detail.item}),document.addEventListener("reset-search",function(){t={from:void 0,to:void 0},document.querySelectorAll('input[name="from"], input[name="to"]').forEach(e=>{e.value=""})}),document.addEventListener("swap-selected",function(){const e=t.from;t={from:t.to,to:e}}),document.querySelectorAll("[name$=searchTimeSelector]").forEach(function(e){e.addEventListener("change",function(o){const a=o.currentTarget.value==="now";document.querySelectorAll(".js-search-date-details").forEach(r=>{r.hidden=a})})}),document.querySelector("#pw-form-departures")?.addEventListener("submit",e=>{e.preventDefault();const o=e.currentTarget;Y(o,t.from)}),document.querySelector("#pw-form-assistant")?.addEventListener("submit",e=>{e.preventDefault();const o=e.currentTarget;Q(o,t.from,t.to)})}function B(t){const e=document.querySelector(`#${t}-searchTimeSelector-date`),o=document.querySelector(`#${t}-searchTimeSelector-time`);try{if(e&&(e.valueAsDate=new Date),o){const i=new Date,a=String(i.getHours()).padStart(2,"0"),r=String(i.getMinutes()).padStart(2,"0");o.value=`${a}:${r}`}}catch{}}function x(t,e){const o=t.get(`${e}-searchTimeSelector`);if(o==="now")return{mode:"now"};{const i=t.get("dateinput"),a=t.get("timeinput");if(i&&a){const r=new Date(`${i}T${a}`);return{mode:o=="arriveBy"?"arriveBy":"departBy",dateTime:r.getTime()}}return{mode:"now"}}}function Q(t,e,o){const i=t.action,a=x(new FormData(t),"pw-assistant"),r=ie({from:e,to:o},a),l=new URLSearchParams(r);window.location.href=`${i}?${l.toString()}`}function Y(t,e){const o=t.action,i=x(new FormData(t),"pw-departures"),a=ae(i,e),r=new URLSearchParams(a);e?.layer==="venue"?window.location.href=`${o}/${e.id}?${r.toString()}`:window.location.href=`${o}?${r.toString()}`}class y extends HTMLElement{constructor(){super()}connectedCallback(){const e=this;e.hidden=!0,e.classList.add(n.messageBox),document.addEventListener("pw-errorMessage",function(o){const i=o;e.textContent=i.detail.message,e.hidden=!1}),document.addEventListener("pw-errorMessage-clear",function(o){e.hidden=!0}),e.addEventListener("click",function(){y.clearMessageBox()})}static clearMessageBox(){document.dispatchEvent(new CustomEvent("pw-errorMessage-clear",{bubbles:!0}))}}function J({URL_BASE:t},e,o){function i(c){const d=r(c),_=h("span",[c.name],n.itemTitle),u=h("span",[c.locality??""],n.itemLocality),p=h("div",[_,u],n.itemText),g=h("li",[d,p],n.listItem);return g.role="option",g.setAttribute("data-feature-id",c.id),g}function a(c){const d=h("span",[c]);return h("li",[d],n.listItem)}function r(c){const d=ee(c.category),_=h("img");_.src=`${t}assets/mono/light/${d.icon}.svg`,_.alt=d.alt,_.role="img";const u=h("div",[_],n.itemIcon);return u.ariaHidden="true",u}class l extends HTMLElement{constructor(){super()}connectedCallback(){this.querySelector("button").addEventListener("click",async()=>{y.clearMessageBox();const _=document.getElementsByClassName("widget-module__search_input"),[u,p]=Array.from(_);[u.value,p.value]=[p.value,u.value],document.dispatchEvent(new CustomEvent("swap-selected"))})}}customElements.define("pw-swapbutton",l),customElements.define("pw-messagebox",y);class f extends HTMLElement{constructor(){super(),this.dataList={}}getItem(d){return this.dataList[d]}setItems(d){this.dataList={};for(let _ of d)this.dataList[_.id]=_}connectedCallback(){const d=this,_=Z(this.getAttribute("data-debounce-ms"),R),u=this.querySelector("input"),p=this.querySelector("#"+this.getAttribute("for"));let g=new T(u,p,{tabInsertsSuggestions:!0,scrollIntoViewOptions:!1});const me=function(){const s=h("img");s.src=`${t}assets/mono/places/Location.svg`,s.role="img";const m=h("div",[s],n.itemIcon);s.ariaHidden="true";const v=h("span",[e.geoButton],n.itemTitle),$=h("div",[v],n.itemText),k=h("li",[m,$],n.listItem);return k.classList.add("itemLocation"),k.role="option",k};function S(s){const m=me();s?(p.appendChild(m),g.start()):(p.innerHTML="",g.clearSelection(),g.stop()),p.hidden=!s}function q(){d.setItems([]),p.innerHTML="";const s=a(e.noResults);p.appendChild(s),S(!0)}const _e=X(async s=>{try{if(!s.value){p.innerHTML="";return}const m=await se(t,s.value);if(m.length===0)return q();d.setItems(m),p.innerHTML="";for(let v of m){const $=i(v);p.appendChild($)}S(!0)}catch{q()}},_);u.addEventListener("keydown",s=>{s.key==="Escape"&&S(!1)}),u.addEventListener("input",s=>_e(s.target)),u.addEventListener("focus",()=>S(!0)),u.addEventListener("blur",()=>S(!1)),document.addEventListener("click",s=>{F(s.target,this)||S(!1)});const he=async function(){y.clearMessageBox();try{const s=await re(t,e),m=d.parentElement?.querySelector("input");m&&(m.value=s?`${s.name}`:m.value),document.dispatchEvent(new CustomEvent("search-selected",{bubbles:!0,detail:{key:"from",item:s}}))}catch(s){s instanceof Error&&document.dispatchEvent(new CustomEvent("pw-errorMessage",{bubbles:!0,detail:{message:s.message}}))}};p.addEventListener("combobox-commit",function(s){s.target.classList.contains("itemLocation")&&he();const m=s.target.getAttribute("data-feature-id"),v=m?d.getItem(m):void 0;let $=u.value;v&&($=`${v.name}`),u.value=$,document.dispatchEvent(new CustomEvent("search-selected",{bubbles:!0,detail:{key:u.name,item:v}})),p.hidden=!0,g.clearSelection(),g.stop()})}}customElements.define("pw-autocomplete",f);const P=w`
    <div class="${n.buttonGroup}">
      <button
        type="submit"
        class="${n.button}"
      >
        <span>${e.searchButton}</span>
      </button>
    </div>
  `,H=(c,d=!0)=>w`
    <fieldset class="${n.inputBoxes}">
      <legend class="${n.heading}">${e.searchTime.title}</legend>
      <div>
        <div
          class="${n.selector_options} ${d?"":n.selector_options__small}"
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
          ${d?w`
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
              `:""}
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
  `,ue=w`
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
        ${o.layoutMode!=="compact"?H("pw-assistant"):""}
      </div>
      ${P}
    </form>
  `,pe=w`
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
        ${o.layoutMode!=="compact"?H("pw-departures",!1):""}
      </div>
      ${P}
    </form>
  `;return w`
    <div
      data-theme="light"
      data-layout="${o.singleColumnLayout?"singleColumn":o.layoutMode}"
      class="${G({[n.wrapper]:!0,[n.inheritFont]:o.inheritFont??!1})}"
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
      <div class="js-tabpanel" id="pw-assistant">${ue}</div>
      <div class="js-tabpanel ${n.hidden}" id="pw-departures">
        ${pe}
      </div>
    </div>
  `}function z(){document.querySelector(".js-tablist")?.addEventListener("click",function(t){t.preventDefault(),t.stopPropagation();const e=t.target?.closest("a");if(!e)return;const o=e.getAttribute("data-mode");if(!o)return;const i=document.querySelector("#pw-"+o);if(!i)return;y.clearMessageBox(),document.querySelectorAll(".js-tabpanel").forEach(l=>{l.classList.add(n.hidden)}),document.querySelectorAll(".js-tablist a").forEach(l=>{l.classList.remove(n.tabSelected)}),i.classList.remove(n.hidden),e.classList.add(n.tabSelected);const a=document.querySelectorAll(`input[type="radio"][name="pw-${o}-searchTimeSelector"]`),r=Array.from(a).find(l=>l.checked)?.value;document.querySelectorAll(".js-search-date-details").forEach(l=>{l.hidden=r==="now"}),document.dispatchEvent(new CustomEvent("reset-search",{bubbles:!0}))})}function X(t,e){let o=null;return function(...i){clearTimeout(o),o=setTimeout(()=>{t(...i)},e)}}function h(t,e=[],o=""){const i=document.createElement(t);if(Array.isArray(e))for(let a of e){let r=typeof a=="string"?document.createTextNode(a):a;i.appendChild(r)}return i.className=o,i}function Z(t,e){const o=parseInt(t,10);return Number.isNaN(o)?e:o}function F(t,e){return t===e?!0:!t||!t.parentElement?!1:F(t.parentElement,e)}function ee(t){switch(te(t)[0]){case"bus":return{icon:"transportation-entur/Bus",alt:"bus"};case"tram":return{icon:"transportation-entur/Tram",alt:"tram"};case"rail":return{icon:"transportation-entur/Train",alt:"rail"};case"airport":return{icon:"transportation-entur/Plane",alt:"air"};case"boat":return{icon:"transportation-entur/Ferry",alt:"water"};case"unknown":default:return{icon:"map/Pin",alt:"unknown"}}}function te(t){return t.map(oe).filter((e,o,i)=>i.indexOf(e)===o)}function oe(t){switch(t){case"onstreetBus":case"busStation":case"coachStation":return"bus";case"onstreetTram":case"tramStation":return"tram";case"railStation":case"metroStation":return"rail";case"airport":return"airport";case"harbourPort":case"ferryPort":case"ferryStop":return"boat";default:return"unknown"}}function ne(t,e){if(!t)return{};const o=e?{toId:e.id,toName:e.name,toLon:e.geometry.coordinates[0].toString(),toLat:e.geometry.coordinates[1].toString(),toLayer:e.layer}:void 0;return{fromId:t.id,fromName:t.name,fromLon:t.geometry.coordinates[0].toString(),fromLat:t.geometry.coordinates[1].toString(),fromLayer:t.layer,...o}}function ie(t,e){const o=e.mode!=="now"?{searchMode:e.mode,searchTime:e.dateTime.toString()}:{searchMode:e.mode},i=ne(t.from,t.to);return{...o,...i}}function ae(t,e){const o=t.mode!=="now"?{searchMode:t.mode,searchTime:t.dateTime.toString()}:{searchMode:t.mode};return!e||e.layer=="venue"?{...o}:{...o,name:e.name,lon:e.geometry.coordinates[0].toString(),lat:e.geometry.coordinates[1].toString()}}async function se(t,e){const o=`${t}api/departures/autocomplete?q=${e}`,i=await fetch(o);if(!i.ok)throw new Error(`Error fetching autocomplete data from ${o}`);return await i.json()}async function j(t,e){const i=await(await fetch(`${t}api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`)).json();if(i)return i}async function re(t,e){return new Promise(function(o,i){navigator.geolocation.getCurrentPosition(async a=>{const r=await j(t,a.coords);o(r)},a=>{i(new Error(le(a.code,e)))},{enableHighAccuracy:!0,timeout:1e4})})}function le(t,e){switch(t){case GeolocationPositionError.PERMISSION_DENIED:return e.geoTexts.denied;case GeolocationPositionError.TIMEOUT:return e.geoTexts.timeout;case GeolocationPositionError.POSITION_UNAVAILABLE:default:return e.geoTexts.unavailable}}const ce={nb:{noResults:"Ingen resultater",geoButton:"Min posisjon",geoTexts:{denied:"Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.",unavailable:"Posisjonen din er ikke tilgjengelig.",timeout:"Det tok for lang tid å hente posisjonen din. Prøv på nytt."},searchButton:"Finn reise",placeholder:"Sted eller adresse",assistant:{link:"Finn reise",title:"Hvor vil du reise?",from:"Fra",to:"Til"},departure:{link:"Se avganger",title:"Hvor vil du reise fra?",from:"Fra"},searchTime:{title:"Når vil du reise?",now:"Dra nå",arrive:"Ankomst",depart:"Avreise",date:"Dato",time:"Tid"}},nn:{noResults:"Ingen resultat",geoButton:"Min posisjon",geoTexts:{denied:"Du må endre posisjonsinnstillingane i nettlesaren din for å bruke din posisjon i reisesøket.",unavailable:"Posisjonen din er ikkje tilgjengeleg.",timeout:"Det tok for lang tid å hente posisjonen din. Prøv på nytt."},searchButton:"Finn reise",placeholder:"Stad eller adresse",assistant:{link:"Finn reise",title:"Kor vil du reise?",from:"Frå",to:"Til"},departure:{link:"Sjå avganger",title:"Kor vil du reise frå?",from:"Frå"},searchTime:{title:"Når vil du reise?",now:"Dra no",arrive:"Framkomst",depart:"Avreise",date:"Dato",time:"Tid"}},en:{noResults:"No results",geoButton:"My location",geoTexts:{denied:"You must change location settings in your browser to use your position in the travel search.",unavailable:"Your position is not available.",timeout:"It took too long to retrieve your position. Try again."},searchButton:"Find trip",placeholder:"Location or address",assistant:{link:"Find trip",title:"Where do you want to travel?",from:"From",to:"To"},departure:{link:"See departures",title:"Where do you want to travel from?",from:"From"},searchTime:{title:"When do you want to travel?",now:"Leave now",arrive:"Arrive by",depart:"Leave at",date:"Date",time:"Time"}}};function de(t){return ce[t]}b.createWidget=K,b.reverse=j,Object.defineProperty(b,Symbol.toStringTag,{value:"Module"})}));
