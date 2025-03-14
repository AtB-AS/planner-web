(function(f,S){typeof exports=="object"&&typeof module<"u"?S(exports):typeof define=="function"&&define.amd?define(["exports"],S):(f=typeof globalThis<"u"?globalThis:f||self,S(f.PlannerWeb={}))})(this,function(f){"use strict";class S{constructor(e,n,{tabInsertsSuggestions:i,firstOptionSelectionMode:r,scrollIntoViewOptions:s}={}){this.input=e,this.list=n,this.tabInsertsSuggestions=i??!0,this.firstOptionSelectionMode=r??"none",this.scrollIntoViewOptions=s??{block:"nearest",inline:"nearest"},this.isComposing=!1,n.id||(n.id=`combobox-${Math.random().toString().slice(2,6)}`),this.ctrlBindings=!!navigator.userAgent.match(/Macintosh/),this.keyboardEventHandler=c=>H(c,this),this.compositionEventHandler=c=>x(c,this),this.inputHandler=this.clearSelection.bind(this),e.setAttribute("role","combobox"),e.setAttribute("aria-controls",n.id),e.setAttribute("aria-expanded","false"),e.setAttribute("aria-autocomplete","list"),e.setAttribute("aria-haspopup","listbox")}destroy(){this.clearSelection(),this.stop(),this.input.removeAttribute("role"),this.input.removeAttribute("aria-controls"),this.input.removeAttribute("aria-expanded"),this.input.removeAttribute("aria-autocomplete"),this.input.removeAttribute("aria-haspopup")}start(){this.input.setAttribute("aria-expanded","true"),this.input.addEventListener("compositionstart",this.compositionEventHandler),this.input.addEventListener("compositionend",this.compositionEventHandler),this.input.addEventListener("input",this.inputHandler),this.input.addEventListener("keydown",this.keyboardEventHandler),this.list.addEventListener("mousedown",I),this.resetSelection()}stop(){this.clearSelection(),this.input.setAttribute("aria-expanded","false"),this.input.removeEventListener("compositionstart",this.compositionEventHandler),this.input.removeEventListener("compositionend",this.compositionEventHandler),this.input.removeEventListener("input",this.inputHandler),this.input.removeEventListener("keydown",this.keyboardEventHandler),this.list.removeEventListener("mousedown",I)}indicateDefaultOption(){var e;this.firstOptionSelectionMode==="active"?(e=Array.from(this.list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')).filter(A)[0])===null||e===void 0||e.setAttribute("data-combobox-option-default","true"):this.firstOptionSelectionMode==="selected"&&this.navigate(1)}navigate(e=1){const n=Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter(A)[0],i=Array.from(this.list.querySelectorAll('[role="option"]')).filter(A),r=i.indexOf(n);if(r===i.length-1&&e===1||r===0&&e===-1){this.clearSelection(),this.input.focus();return}let s=e===1?0:i.length-1;if(n&&r>=0){const m=r+e;m>=0&&m<i.length&&(s=m)}const c=i[s];if(c)for(const m of i)m.removeAttribute("data-combobox-option-default"),c===m?(this.input.setAttribute("aria-activedescendant",c.id),c.setAttribute("aria-selected","true"),W(c),c.scrollIntoView(this.scrollIntoViewOptions)):m.removeAttribute("aria-selected")}clearSelection(){this.input.removeAttribute("aria-activedescendant");for(const e of this.list.querySelectorAll('[aria-selected="true"], [data-combobox-option-default="true"]'))e.removeAttribute("aria-selected"),e.removeAttribute("data-combobox-option-default")}resetSelection(){this.clearSelection(),this.indicateDefaultOption()}}function H(t,e){if(!(t.shiftKey||t.metaKey||t.altKey)&&!(!e.ctrlBindings&&t.ctrlKey)&&!e.isComposing)switch(t.key){case"Enter":D(e.input,e.list)&&t.preventDefault();break;case"Tab":e.tabInsertsSuggestions&&D(e.input,e.list)&&t.preventDefault();break;case"Escape":e.clearSelection();break;case"ArrowDown":e.navigate(1),t.preventDefault();break;case"ArrowUp":e.navigate(-1),t.preventDefault();break;case"n":e.ctrlBindings&&t.ctrlKey&&(e.navigate(1),t.preventDefault());break;case"p":e.ctrlBindings&&t.ctrlKey&&(e.navigate(-1),t.preventDefault());break;default:if(t.ctrlKey)break;e.resetSelection()}}function I(t){if(!(t.target instanceof Element))return;const e=t.target.closest('[role="option"]');e&&e.getAttribute("aria-disabled")!=="true"&&M(e,{event:t})}function D(t,e){const n=e.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');return n?(n.getAttribute("aria-disabled")==="true"||M(n),!0):!1}function M(t,e){t.dispatchEvent(new CustomEvent("combobox-commit",{bubbles:!0,detail:e}))}function W(t){t.dispatchEvent(new Event("combobox-select",{bubbles:!0}))}function A(t){return!t.hidden&&!(t instanceof HTMLInputElement&&t.type==="hidden")&&(t.offsetWidth>0||t.offsetHeight>0)}function x(t,e){e.isComposing=t.type==="compositionstart",document.getElementById(e.input.getAttribute("aria-controls")||"")&&e.clearSelection()}const o={"override-light":"theme-module__override-light",light:"theme-module__light",assistant:'"../page-modules/assistant/assistant.module.css"',departures:'"../page-modules/departures/departures.module.css"',search:'"../components/search/search.module.css"',selector:'"../modules/search-time/selector/selector.module.css"',buttonComponent:'"../components/button/button.module.css"',hidden:"widget-module__hidden",lightWrapper:"widget-module__lightWrapper theme-module__light",wrapper:"widget-module__wrapper theme-module__override-light",form:"widget-module__form assistant-module__container",nav:"widget-module__nav",tabs:"widget-module__tabs",tabSelected:"widget-module__tabSelected",main:"widget-module__main assistant-module__main",heading:"widget-module__heading assistant-module__heading",inputBoxes:"widget-module__inputBoxes",search_container:"widget-module__search_container search-module__container",search_inputContainer:"widget-module__search_inputContainer search-module__inputContainer",search_label:"widget-module__search_label search-module__label typography-module__typo-body__secondary",search_input:"widget-module__search_input search-module__input",search_inputLast:"widget-module__search_inputLast",button_geolocation:"widget-module__button_geolocation departures-module__geolocationButton",selector_group:"widget-module__selector_group selector-module__departureDateSelector",selector_options:"widget-module__selector_options selector-module__options",selector_options__small:"widget-module__selector_options__small selector-module__options",selector_option:"widget-module__selector_option selector-module__option",selector_option__text:"widget-module__selector_option__text selector-module__option__text",selector_option__label:"widget-module__selector_option__label selector-module__option__label",selector_option__input:"widget-module__selector_option__input selector-module__option__input",selector_dateAndTimeSelectorsWrapper:"widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper",selector_dateAndTimeSelectorsWrapper__hidden:"widget-module__selector_dateAndTimeSelectorsWrapper__hidden",selector_dateAndTimeSelectors:"widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors",selector_dateSelector:"widget-module__selector_dateSelector selector-module__dateSelector",selector_timeSelector:"widget-module__selector_timeSelector selector-module__timeSelector",buttonGroup:"widget-module__buttonGroup",button:"widget-module__button",buttonLightOutline:"widget-module__buttonLightOutline","button--disabled":"widget-module__button--disabled",listItem:"widget-module__listItem",itemIcon:"widget-module__itemIcon",itemLocality:"widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary",popupContainer:"widget-module__popupContainer search-module__menu",messageBox:"widget-module__messageBox",inheritFont:"widget-module__inheritFont",singleColumnLayout:"widget-module__singleColumnLayout"};function N(t){return Object.entries(t).reduce(function(e,n){return n[1]?e+" "+n[0]:e},"")}var O={MODULE_VERSION:"2.27.0",COMPRESSED_ORG:"HYMw1kA",ORG_ID:"nfk"};const R=300,y=String.raw,k=O.MODULE_VERSION,C=O.COMPRESSED_ORG;function G(t){if(!(t!=null&&t.startsWith("http")))throw new Error("Missing urlBase in correct schema.");return t.endsWith("/")||(t+="/"),{URL_BASE:t,URL_JS_UMD:`${t}widget/${C}/${k}/planner-web.umd.js`,URL_JS_ESM:`${t}widget/${C}/${k}/planner-web.mjs`,URL_CSS:`${t}widget/${C}/${k}/planner-web.css`}}function K({urlBase:t,language:e="en",outputOverrideOptions:n={}}){const i=ce(e),r=G(t),s={inheritFont:!1,singleColumnLayout:!1,...n};return{output:Y(r,i,s),init:U,urls:r}}function U(){var e,n;J(),B("pw-assistant"),B("pw-departures");let t={from:void 0,to:void 0};document.addEventListener("search-selected",function(i){const r=i;t[r.detail.key]=r.detail.item}),document.addEventListener("reset-search",function(){t={from:void 0,to:void 0},document.querySelectorAll('input[name="from"], input[name="to"]').forEach(i=>{i.value=""})}),document.querySelectorAll("[name$=searchTimeSelector]").forEach(function(i){i.addEventListener("change",function(r){const c=r.currentTarget.value==="now";document.querySelectorAll(".js-search-date-details").forEach(m=>{m.hidden=c})})}),(e=document.querySelector("#pw-form-departures"))==null||e.addEventListener("submit",i=>{i.preventDefault();const r=i.currentTarget;Q(r,t.from)}),(n=document.querySelector("#pw-form-assistant"))==null||n.addEventListener("submit",i=>{i.preventDefault();const r=i.currentTarget;V(r,t.from,t.to)})}function B(t){const e=document.querySelector(`#${t}-searchTimeSelector-date`),n=document.querySelector(`#${t}-searchTimeSelector-time`);try{if(e&&(e.valueAsDate=new Date),n){const i=new Date,r=String(i.getHours()).padStart(2,"0"),s=String(i.getMinutes()).padStart(2,"0");n.value=`${r}:${s}`}}catch{}}function j(t,e){const n=t.get(`${e}-searchTimeSelector`);if(n==="now")return{mode:"now"};{const i=t.get("dateinput"),r=t.get("timeinput");if(i&&r){const s=new Date(`${i}T${r}`);return{mode:n=="arriveBy"?"arriveBy":"departBy",dateTime:s.getTime()}}return{mode:"now"}}}function V(t,e,n){const i=t.action,r=j(new FormData(t),"pw-assistant"),s=ne({from:e,to:n},r),c=new URLSearchParams(s);window.location.href=`${i}?${c.toString()}`}function Q(t,e){const n=t.action,i=j(new FormData(t),"pw-departures"),r=ie(i,e),s=new URLSearchParams(r);(e==null?void 0:e.layer)==="venue"?window.location.href=`${n}/${e.id}?${s.toString()}`:window.location.href=`${n}?${s.toString()}`}class E extends HTMLElement{constructor(){super()}connectedCallback(){const e=this;e.hidden=!0,e.classList.add(o.messageBox),document.addEventListener("pw-errorMessage",function(n){const i=n;e.textContent=i.detail.message,e.hidden=!1}),document.addEventListener("pw-errorMessage-clear",function(n){e.hidden=!0}),e.addEventListener("click",function(){E.clearMessageBox()})}static clearMessageBox(){document.dispatchEvent(new CustomEvent("pw-errorMessage-clear",{bubbles:!0}))}}function Y({URL_BASE:t},e,n){function i(a){const u=s(a),_=b("span",[a.name]),d=b("span",[a.locality??""],o.itemLocality),l=b("li",[u,_,d],o.listItem);return l.role="option",l.setAttribute("data-feature-id",a.id),l}function r(a){const u=b("span",[a]);return b("li",[u],o.listItem)}function s(a){const u=Z(a.category),_=b("img");_.src=`${t}assets/mono/light/${u.icon}.svg`,_.alt=u.alt,_.role="img";const d=b("div",[_],o.itemIcon);return d.ariaHidden="true",d}class c extends HTMLElement{constructor(){super()}connectedCallback(){const u=this;this.querySelector("button").addEventListener("click",async()=>{var d;E.clearMessageBox();try{const l=await se(t,e),g=(d=u.parentElement)==null?void 0:d.querySelector("input");g&&(g.value=l?`${l.name}, ${l.locality}`:g.value),document.dispatchEvent(new CustomEvent("search-selected",{bubbles:!0,detail:{key:"from",item:l}}))}catch(l){l instanceof Error&&document.dispatchEvent(new CustomEvent("pw-errorMessage",{bubbles:!0,detail:{message:l.message}}))}})}}customElements.define("pw-geobutton",c),customElements.define("pw-messagebox",E);class m extends HTMLElement{constructor(){super(),this.dataList={}}getItem(u){return this.dataList[u]}setItems(u){this.dataList={};for(let _ of u)this.dataList[_.id]=_}connectedCallback(){const u=this,_=X(this.getAttribute("data-debounce-ms"),R),d=this.querySelector("input"),l=this.querySelector("#"+this.getAttribute("for"));let g=new S(d,l,{tabInsertsSuggestions:!0,scrollIntoViewOptions:!1});function $(p){p?g.start():(g.clearSelection(),g.stop()),l.hidden=!p}function q(){u.setItems([]),l.innerHTML="";const p=r(e.noResults);l.appendChild(p),$(!0)}const pe=z(async p=>{try{if(!p.value){l.innerHTML="";return}const v=await re(t,p.value);if(v.length===0)return q();u.setItems(v),l.innerHTML="";for(let w of v){const L=i(w);l.appendChild(L)}$(!0)}catch{q()}},_);d.addEventListener("keydown",p=>{p.key==="Escape"&&$(!1)}),d.addEventListener("input",p=>pe(p.target)),d.addEventListener("focus",()=>$(!0)),d.addEventListener("blur",()=>$(!1)),document.addEventListener("click",p=>{P(p.target,this)||$(!1)}),l.addEventListener("combobox-commit",function(p){const v=p.target.getAttribute("data-feature-id"),w=v?u.getItem(v):void 0;let L=d.value;w&&(L=`${w.name}`,w.locality&&(L+=`, ${w.locality}`)),d.value=L,document.dispatchEvent(new CustomEvent("search-selected",{bubbles:!0,detail:{key:d.name,item:w}})),l.hidden=!0,g.clearSelection(),g.stop()})}}customElements.define("pw-autocomplete",m);const T=y`
    <div class="${o.buttonGroup}">
      <button
        type="submit"
        class="${o.button}"
      >
        <span>${e.searchButton}</span>
      </button>
    </div>
  `,h=(a,u=!0)=>y`
    <fieldset class="${o.inputBoxes}">
      <legend class="${o.heading}">${e.searchTime.title}</legend>
      <div>
        <div
          class="${o.selector_options} ${u?"":o.selector_options__small}"
        >
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="${a}-searchTimeSelector"
              class="${o.selector_option__input}"
              value="now"
              checked=""
            />
            <span class="${o.selector_option__label}">
              <span class="${o.selector_option__text}" id="${a}-now">
                ${e.searchTime.now}
              </span>
            </span>
          </label>
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="${a}-searchTimeSelector"
              class="${o.selector_option__input}"
              value="departBy"
            />
            <span class="${o.selector_option__label}">
              <span
                class="${o.selector_option__text}"
                id="${a}-depart"
              >
                ${e.searchTime.depart}
              </span>
            </span>
          </label>
          ${u?y`
                <label class="${o.selector_option}">
                  <input
                    type="radio"
                    name="${a}-searchTimeSelector"
                    class="${o.selector_option__input}"
                    value="arriveBy"
                  />
                  <span class="${o.selector_option__label}">
                    <span
                      class="${o.selector_option__text}"
                      id="${a}-arrival"
                    >
                      ${e.searchTime.arrive}
                    </span>
                  </span>
                </label>
              `:""}
        </div>
        <div
          class="${o.selector_dateAndTimeSelectorsWrapper} js-search-date-details"
          hidden
        >
          <div class="${o.selector_dateAndTimeSelectors}">
            <div class="${o.selector_dateSelector}">
              <label for="${`${a}-searchTimeSelector-date`}">
                ${e.searchTime.date}
              </label>
              <input
                type="date"
                name="dateinput"
                id="${`${a}-searchTimeSelector-date`}"
              />
            </div>
            <div class="${o.selector_timeSelector}">
              <label for="${`${a}-searchTimeSelector-time`}">
                ${e.searchTime.time}
              </label>
              <input
                type="time"
                name="timeinput"
                step="60"
                id="${`${a}-searchTimeSelector-time`}"
              />
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  `,ue=y`
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
        ${h("pw-assistant")}
      </div>
      ${T}
    </form>
  `,de=y`
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
        ${h("pw-departures",!1)}
      </div>
      ${T}
    </form>
  `;return y`
    <div
      class="${N({[o.wrapper]:!0,[o.lightWrapper]:!0,[o.inheritFont]:n.inheritFont??!1,[o.singleColumnLayout]:n.singleColumnLayout??!1})}"
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
      <div class="js-tabpanel" id="pw-assistant">${ue}</div>
      <div class="js-tabpanel ${o.hidden}" id="pw-departures">
        ${de}
      </div>
    </div>
  `}function J(){var t;(t=document.querySelector(".js-tablist"))==null||t.addEventListener("click",function(e){var m,T;e.preventDefault();const n=(m=e.target)==null?void 0:m.closest("a");if(!n)return;const i=n.getAttribute("data-mode");if(!i)return;const r=document.querySelector("#pw-"+i);if(!r)return;E.clearMessageBox(),document.querySelectorAll(".js-tabpanel").forEach(h=>{h.classList.add(o.hidden)}),document.querySelectorAll(".js-tablist a").forEach(h=>{h.classList.remove(o.tabSelected)}),r.classList.remove(o.hidden),n.classList.add(o.tabSelected);const s=document.querySelectorAll(`input[type="radio"][name="pw-${i}-searchTimeSelector"]`),c=(T=Array.from(s).find(h=>h.checked))==null?void 0:T.value;document.querySelectorAll(".js-search-date-details").forEach(h=>{h.hidden=c==="now"}),document.dispatchEvent(new CustomEvent("reset-search",{bubbles:!0}))})}function z(t,e){let n=null;return function(...i){clearTimeout(n),n=setTimeout(()=>{t(...i)},e)}}function b(t,e=[],n=""){const i=document.createElement(t);if(Array.isArray(e))for(let r of e){let s=typeof r=="string"?document.createTextNode(r):r;i.appendChild(s)}return i.className=n,i}function X(t,e){const n=parseInt(t,10);return Number.isNaN(n)?e:n}function P(t,e){return t===e?!0:!t||!t.parentElement?!1:P(t.parentElement,e)}function Z(t){switch(ee(t)[0]){case"bus":return{icon:"transportation-entur/Bus",alt:"bus"};case"tram":return{icon:"transportation-entur/Tram",alt:"tram"};case"rail":return{icon:"transportation-entur/Train",alt:"rail"};case"airport":return{icon:"transportation-entur/Plane",alt:"air"};case"boat":return{icon:"transportation-entur/Ferry",alt:"water"};case"unknown":default:return{icon:"map/Pin",alt:"unknown"}}}function ee(t){return t.map(te).filter((e,n,i)=>i.indexOf(e)===n)}function te(t){switch(t){case"onstreetBus":case"busStation":case"coachStation":return"bus";case"onstreetTram":case"tramStation":return"tram";case"railStation":case"metroStation":return"rail";case"airport":return"airport";case"harbourPort":case"ferryPort":case"ferryStop":return"boat";default:return"unknown"}}function oe(t,e){if(!t)return{};const n=e?{toId:e.id,toLon:e.geometry.coordinates[0].toString(),toLat:e.geometry.coordinates[1].toString(),toLayer:e.layer}:void 0;return{fromId:t.id,fromLon:t.geometry.coordinates[0].toString(),fromLat:t.geometry.coordinates[1].toString(),fromLayer:t.layer,...n}}function ne(t,e){const n=e.mode!=="now"?{searchMode:e.mode,searchTime:e.dateTime.toString()}:{searchMode:e.mode},i=oe(t.from,t.to);return{...n,...i}}function ie(t,e){const n=t.mode!=="now"?{searchMode:t.mode,searchTime:t.dateTime.toString()}:{searchMode:t.mode};return!e||e.layer=="venue"?{...n}:{...n,lon:e.geometry.coordinates[0].toString(),lat:e.geometry.coordinates[1].toString()}}async function re(t,e){const n=`${t}api/departures/autocomplete?q=${e}`,i=await fetch(n);if(!i.ok)throw new Error(`Error fetching autocomplete data from ${n}`);return await i.json()}async function F(t,e){const i=await(await fetch(`${t}api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`)).json();if(i)return i}async function se(t,e){return new Promise(function(n,i){navigator.geolocation.getCurrentPosition(async r=>{const s=await F(t,r.coords);n(s)},r=>{i(new Error(ae(r.code,e)))},{enableHighAccuracy:!0,timeout:1e4})})}function ae(t,e){switch(t){case GeolocationPositionError.PERMISSION_DENIED:return e.geoTexts.denied;case GeolocationPositionError.TIMEOUT:return e.geoTexts.timeout;case GeolocationPositionError.POSITION_UNAVAILABLE:default:return e.geoTexts.unavailable}}const le={nb:{noResults:"Ingen resultater",geoButton:"Finn min posisjon",geoTexts:{denied:"Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.",unavailable:"Posisjonen din er ikke tilgjengelig.",timeout:"Det tok for lang tid å hente posisjonen din. Prøv på nytt."},searchButton:"Finn avganger",placeholder:"adresse, kai eller holdeplass",assistant:{link:"Planlegg reisen",title:"Hvor vil du reise?",from:"Fra",to:"Til"},departure:{link:"Avganger",title:"Hvor vil du reise fra?",from:"Fra"},searchTime:{title:"Når vil du reise?",now:"Nå",arrive:"Ankomst",depart:"Avreise",date:"Dato",time:"Tid"}},nn:{noResults:"Ingen resultat",geoButton:"Finn min posisjon",geoTexts:{denied:"Du må endre posisjonsinnstillingane i nettlesaren din for å bruke din posisjon i reisesøket.",unavailable:"Posisjonen din er ikkje tilgjengeleg.",timeout:"Det tok for lang tid å hente posisjonen din. Prøv på nytt."},searchButton:"Finn avgangar",placeholder:"adresse, kai eller haldeplass",assistant:{link:"Planlegg reisa",title:"Kor vil du reise?",from:"Frå",to:"Til"},departure:{link:"Avgangar",title:"Kor vil du reise frå?",from:"Frå"},searchTime:{title:"Når vil du reise?",now:"No",arrive:"Ankomst",depart:"Avreise",date:"Dato",time:"Tid"}},en:{noResults:"No results",geoButton:"Find my position",geoTexts:{denied:"You must change location settings in your browser to use your position in the travel search.",unavailable:"Your position is not available.",timeout:"It took too long to retrieve your position. Try again."},searchButton:"Find departures",placeholder:"address, quay, or stop",assistant:{link:"Plan your journey",title:"Where do you want to travel?",from:"From",to:"To"},departure:{link:"Departures",title:"Where do you want to travel from?",from:"From"},searchTime:{title:"When do you want to travel?",now:"Now",arrive:"Arrival",depart:"Departure",date:"Date",time:"Time"}}};function ce(t){return le[t]}f.createWidget=K,f.reverse=F,Object.defineProperty(f,Symbol.toStringTag,{value:"Module"})});
