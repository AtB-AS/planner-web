(function(f,S){typeof exports=="object"&&typeof module<"u"?S(exports):typeof define=="function"&&define.amd?define(["exports"],S):(f=typeof globalThis<"u"?globalThis:f||self,S(f.PlannerWeb={}))})(this,function(f){"use strict";class S{constructor(e,i,{tabInsertsSuggestions:n,defaultFirstOption:s,scrollIntoViewOptions:r}={}){this.input=e,this.list=i,this.tabInsertsSuggestions=n??!0,this.defaultFirstOption=s??!1,this.scrollIntoViewOptions=r??{block:"nearest",inline:"nearest"},this.isComposing=!1,i.id||(i.id=`combobox-${Math.random().toString().slice(2,6)}`),this.ctrlBindings=!!navigator.userAgent.match(/Macintosh/),this.keyboardEventHandler=d=>H(d,this),this.compositionEventHandler=d=>x(d,this),this.inputHandler=this.clearSelection.bind(this),e.setAttribute("role","combobox"),e.setAttribute("aria-controls",i.id),e.setAttribute("aria-expanded","false"),e.setAttribute("aria-autocomplete","list"),e.setAttribute("aria-haspopup","listbox")}destroy(){this.clearSelection(),this.stop(),this.input.removeAttribute("role"),this.input.removeAttribute("aria-controls"),this.input.removeAttribute("aria-expanded"),this.input.removeAttribute("aria-autocomplete"),this.input.removeAttribute("aria-haspopup")}start(){this.input.setAttribute("aria-expanded","true"),this.input.addEventListener("compositionstart",this.compositionEventHandler),this.input.addEventListener("compositionend",this.compositionEventHandler),this.input.addEventListener("input",this.inputHandler),this.input.addEventListener("keydown",this.keyboardEventHandler),this.list.addEventListener("mousedown",C),this.indicateDefaultOption()}stop(){this.clearSelection(),this.input.setAttribute("aria-expanded","false"),this.input.removeEventListener("compositionstart",this.compositionEventHandler),this.input.removeEventListener("compositionend",this.compositionEventHandler),this.input.removeEventListener("input",this.inputHandler),this.input.removeEventListener("keydown",this.keyboardEventHandler),this.list.removeEventListener("mousedown",C)}indicateDefaultOption(){var e;this.defaultFirstOption&&((e=Array.from(this.list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')).filter(L)[0])===null||e===void 0||e.setAttribute("data-combobox-option-default","true"))}navigate(e=1){const i=Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter(L)[0],n=Array.from(this.list.querySelectorAll('[role="option"]')).filter(L),s=n.indexOf(i);if(s===n.length-1&&e===1||s===0&&e===-1){this.clearSelection(),this.input.focus();return}let r=e===1?0:n.length-1;if(i&&s>=0){const p=s+e;p>=0&&p<n.length&&(r=p)}const d=n[r];if(d)for(const p of n)p.removeAttribute("data-combobox-option-default"),d===p?(this.input.setAttribute("aria-activedescendant",d.id),d.setAttribute("aria-selected","true"),F(d),d.scrollIntoView(this.scrollIntoViewOptions)):p.removeAttribute("aria-selected")}clearSelection(){this.input.removeAttribute("aria-activedescendant");for(const e of this.list.querySelectorAll('[aria-selected="true"]'))e.removeAttribute("aria-selected");this.indicateDefaultOption()}}function H(t,e){if(!(t.shiftKey||t.metaKey||t.altKey)&&!(!e.ctrlBindings&&t.ctrlKey)&&!e.isComposing)switch(t.key){case"Enter":D(e.input,e.list)&&t.preventDefault();break;case"Tab":e.tabInsertsSuggestions&&D(e.input,e.list)&&t.preventDefault();break;case"Escape":e.clearSelection();break;case"ArrowDown":e.navigate(1),t.preventDefault();break;case"ArrowUp":e.navigate(-1),t.preventDefault();break;case"n":e.ctrlBindings&&t.ctrlKey&&(e.navigate(1),t.preventDefault());break;case"p":e.ctrlBindings&&t.ctrlKey&&(e.navigate(-1),t.preventDefault());break;default:if(t.ctrlKey)break;e.clearSelection()}}function C(t){if(!(t.target instanceof Element))return;const e=t.target.closest('[role="option"]');e&&e.getAttribute("aria-disabled")!=="true"&&M(e,{event:t})}function D(t,e){const i=e.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');return i?(i.getAttribute("aria-disabled")==="true"||M(i),!0):!1}function M(t,e){t.dispatchEvent(new CustomEvent("combobox-commit",{bubbles:!0,detail:e}))}function F(t){t.dispatchEvent(new Event("combobox-select",{bubbles:!0}))}function L(t){return!t.hidden&&!(t instanceof HTMLInputElement&&t.type==="hidden")&&(t.offsetWidth>0||t.offsetHeight>0)}function x(t,e){e.isComposing=t.type==="compositionstart",document.getElementById(e.input.getAttribute("aria-controls")||"")&&e.clearSelection()}const o={"override-light":"theme-module__override-light",light:"theme-module__light",assistant:'"../page-modules/assistant/assistant.module.css"',departures:'"../page-modules/departures/departures.module.css"',search:'"../components/search/search.module.css"',selector:'"../modules/search-time/selector/selector.module.css"',buttonComponent:'"../components/button/button.module.css"',hidden:"widget-module__hidden",lightWrapper:"widget-module__lightWrapper theme-module__light",wrapper:"widget-module__wrapper theme-module__override-light",form:"widget-module__form assistant-module__container",nav:"widget-module__nav",tabs:"widget-module__tabs",tabSelected:"widget-module__tabSelected",main:"widget-module__main assistant-module__main",heading:"widget-module__heading assistant-module__heading",inputBoxes:"widget-module__inputBoxes",search_container:"widget-module__search_container search-module__container",search_inputContainer:"widget-module__search_inputContainer search-module__inputContainer",search_label:"widget-module__search_label search-module__label typography-module__typo-body__secondary",search_input:"widget-module__search_input search-module__input",search_inputLast:"widget-module__search_inputLast",button_geolocation:"widget-module__button_geolocation departures-module__geolocationButton",selector_group:"widget-module__selector_group selector-module__departureDateSelector",selector_options:"widget-module__selector_options selector-module__options",selector_options__small:"widget-module__selector_options__small selector-module__options",selector_option:"widget-module__selector_option selector-module__option",selector_option__text:"widget-module__selector_option__text selector-module__option__text",selector_option__label:"widget-module__selector_option__label selector-module__option__label",selector_option__input:"widget-module__selector_option__input selector-module__option__input",selector_dateAndTimeSelectorsWrapper:"widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper",selector_dateAndTimeSelectorsWrapper__hidden:"widget-module__selector_dateAndTimeSelectorsWrapper__hidden",selector_dateAndTimeSelectors:"widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors",selector_dateSelector:"widget-module__selector_dateSelector selector-module__dateSelector",selector_timeSelector:"widget-module__selector_timeSelector selector-module__timeSelector",buttonGroup:"widget-module__buttonGroup",button:"widget-module__button",buttonLightOutline:"widget-module__buttonLightOutline","button--disabled":"widget-module__button--disabled",listItem:"widget-module__listItem",itemIcon:"widget-module__itemIcon",itemLocality:"widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary",popupContainer:"widget-module__popupContainer search-module__menu",messageBox:"widget-module__messageBox"};var B={MODULE_VERSION:"2.15.1",COMPRESSED_ORG:"HYMw1kA",ORG_ID:"nfk"};const N=300,y=String.raw,k=B.MODULE_VERSION,I=B.COMPRESSED_ORG;function R(t){if(!(t!=null&&t.startsWith("http")))throw new Error("Missing urlBase in correct schema.");return t.endsWith("/")||(t+="/"),{URL_BASE:t,URL_JS_UMD:`${t}widget/${I}/${k}/planner-web.umd.js`,URL_JS_ESM:`${t}widget/${I}/${k}/planner-web.mjs`,URL_CSS:`${t}widget/${I}/${k}/planner-web.css`}}function G({urlBase:t,language:e="en"}){const i=le(e),n=R(t);return{output:Q(n,i),init:K,urls:n}}function K(){var e,i;Y(),O("pw-assistant"),O("pw-departures");let t={from:void 0,to:void 0};document.addEventListener("search-selected",function(n){const s=n;t[s.detail.key]=s.detail.item}),document.addEventListener("reset-search",function(){t={from:void 0,to:void 0},document.querySelectorAll('input[name="from"], input[name="to"]').forEach(n=>{n.value=""})}),document.querySelectorAll("[name$=searchTimeSelector]").forEach(function(n){n.addEventListener("change",function(s){const d=s.currentTarget.value==="now";document.querySelectorAll(".js-search-date-details").forEach(p=>{p.hidden=d})})}),(e=document.querySelector("#pw-form-departures"))==null||e.addEventListener("submit",n=>{n.preventDefault();const s=n.currentTarget;V(s,t.from)}),(i=document.querySelector("#pw-form-assistant"))==null||i.addEventListener("submit",n=>{n.preventDefault();const s=n.currentTarget;U(s,t.from,t.to)})}function O(t){const e=document.querySelector(`#${t}-searchTimeSelector-date`),i=document.querySelector(`#${t}-searchTimeSelector-time`);try{if(e&&(e.valueAsDate=new Date),i){const n=new Date;n.setSeconds(0),n.setMilliseconds(0),i.valueAsDate=n}}catch{}}function P(t,e){const i=t.get(`${e}-searchTimeSelector`);if(i==="now")return{mode:"now"};{const n=t.get("dateinput"),s=t.get("timeinput");if(n&&s){const r=new Date(`${n}T${s}`);return{mode:i=="arriveBy"?"arriveBy":"departBy",dateTime:r.getTime()}}return{mode:"now"}}}function U(t,e,i){const n=t.action,s=P(new FormData(t),"pw-assistant"),r=oe({from:e,to:i},s),d=new URLSearchParams(r);window.location.href=`${n}?${d.toString()}`}function V(t,e){const i=t.action,n=P(new FormData(t),"pw-departures"),s=ne(n,e),r=new URLSearchParams(s);(e==null?void 0:e.layer)==="venue"?window.location.href=`${i}/${e.id}?${r.toString()}`:window.location.href=`${i}?${r.toString()}`}class E extends HTMLElement{constructor(){super()}connectedCallback(){const e=this;e.hidden=!0,e.classList.add(o.messageBox),document.addEventListener("pw-errorMessage",function(i){const n=i;e.textContent=n.detail.message,e.hidden=!1}),document.addEventListener("pw-errorMessage-clear",function(i){e.hidden=!0}),e.addEventListener("click",function(){E.clearMessageBox()})}static clearMessageBox(){document.dispatchEvent(new CustomEvent("pw-errorMessage-clear",{bubbles:!0}))}}function Q({URL_BASE:t},e){function i(a){const c=s(a),_=b("span",[a.name]),u=b("span",[a.locality??""],o.itemLocality),l=b("li",[c,_,u],o.listItem);return l.role="option",l.setAttribute("data-feature-id",a.id),l}function n(a){const c=b("span",[a]);return b("li",[c],o.listItem)}function s(a){const c=X(a.category),_=b("img");_.src=`${t}assets/mono/light/${c.icon}.svg`,_.alt=c.alt,_.role="img";const u=b("div",[_],o.itemIcon);return u.ariaHidden="true",u}class r extends HTMLElement{constructor(){super()}connectedCallback(){const c=this;this.querySelector("button").addEventListener("click",async()=>{var u;E.clearMessageBox();try{const l=await se(t,e),g=(u=c.parentElement)==null?void 0:u.querySelector("input");g&&(g.value=l?`${l.name}, ${l.locality}`:g.value),document.dispatchEvent(new CustomEvent("search-selected",{bubbles:!0,detail:{key:"from",item:l}}))}catch(l){l instanceof Error&&document.dispatchEvent(new CustomEvent("pw-errorMessage",{bubbles:!0,detail:{message:l.message}}))}})}}customElements.define("pw-geobutton",r),customElements.define("pw-messagebox",E);class d extends HTMLElement{constructor(){super(),this.dataList={}}getItem(c){return this.dataList[c]}setItems(c){this.dataList={};for(let _ of c)this.dataList[_.id]=_}connectedCallback(){const c=this,_=z(this.getAttribute("data-debounce-ms"),N),u=this.querySelector("input"),l=this.querySelector("#"+this.getAttribute("for"));let g=new S(u,l,{tabInsertsSuggestions:!0,scrollIntoViewOptions:!1});function $(m){m?g.start():(g.clearSelection(),g.stop()),l.hidden=!m}function W(){c.setItems([]),l.innerHTML="";const m=n(e.noResults);l.appendChild(m),$(!0)}const de=J(async m=>{try{if(!m.value){l.innerHTML="";return}const v=await ie(t,m.value);if(v.length===0)return W();c.setItems(v),l.innerHTML="";for(let w of v){const A=i(w);l.appendChild(A)}$(!0)}catch{W()}},_);u.addEventListener("keydown",m=>{m.key==="Escape"&&$(!1)}),u.addEventListener("input",m=>de(m.target)),u.addEventListener("focus",()=>$(!0)),u.addEventListener("blur",()=>$(!1)),document.addEventListener("click",m=>{j(m.target,this)||$(!1)}),l.addEventListener("combobox-commit",function(m){const v=m.target.getAttribute("data-feature-id"),w=v?c.getItem(v):void 0;let A=u.value;w&&(A=`${w.name}`,w.locality&&(A+=`, ${w.locality}`)),u.value=A,document.dispatchEvent(new CustomEvent("search-selected",{bubbles:!0,detail:{key:u.name,item:w}})),l.hidden=!0,g.clearSelection(),g.stop()})}}customElements.define("pw-autocomplete",d);const p=y`
    <div class="${o.buttonGroup}">
      <button
        type="submit"
        class="${o.button}"
      >
        <span>${e.searchButton}</span>
      </button>
    </div>
  `,T=(a,c=!0)=>y`
    <fieldset class="${o.inputBoxes}">
      <legend class="${o.heading}">${e.searchTime.title}</legend>
      <div>
        <div
          class="${o.selector_options} ${c?"":o.selector_options__small}"
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
          ${c?y`
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
  `,h=y`
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
        ${T("pw-assistant")}
      </div>
      ${p}
    </form>
  `,ce=y`
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
        ${T("pw-departures",!1)}
      </div>
      ${p}
    </form>
  `;return y`
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
      <div class="js-tabpanel" id="pw-assistant">${h}</div>
      <div class="js-tabpanel ${o.hidden}" id="pw-departures">
        ${ce}
      </div>
    </div>
  `}function Y(){var t;(t=document.querySelector(".js-tablist"))==null||t.addEventListener("click",function(e){var p,T;e.preventDefault();const i=(p=e.target)==null?void 0:p.closest("a");if(!i)return;const n=i.getAttribute("data-mode");if(!n)return;const s=document.querySelector("#pw-"+n);if(!s)return;E.clearMessageBox(),document.querySelectorAll(".js-tabpanel").forEach(h=>{h.classList.add(o.hidden)}),document.querySelectorAll(".js-tablist a").forEach(h=>{h.classList.remove(o.tabSelected)}),s.classList.remove(o.hidden),i.classList.add(o.tabSelected);const r=document.querySelectorAll(`input[type="radio"][name="pw-${n}-searchTimeSelector"]`),d=(T=Array.from(r).find(h=>h.checked))==null?void 0:T.value;document.querySelectorAll(".js-search-date-details").forEach(h=>{h.hidden=d==="now"}),document.dispatchEvent(new CustomEvent("reset-search",{bubbles:!0}))})}function J(t,e){let i=null;return function(...n){clearTimeout(i),i=setTimeout(()=>{t(...n)},e)}}function b(t,e=[],i=""){const n=document.createElement(t);if(Array.isArray(e))for(let s of e){let r=typeof s=="string"?document.createTextNode(s):s;n.appendChild(r)}return n.className=i,n}function z(t,e){const i=parseInt(t,10);return Number.isNaN(i)?e:i}function j(t,e){return t===e?!0:!t||!t.parentElement?!1:j(t.parentElement,e)}function X(t){switch(Z(t)[0]){case"bus":return{icon:"transportation-entur/Bus",alt:"bus"};case"tram":return{icon:"transportation-entur/Tram",alt:"tram"};case"rail":return{icon:"transportation-entur/Train",alt:"rail"};case"airport":return{icon:"transportation-entur/Plane",alt:"air"};case"boat":return{icon:"transportation-entur/Ferry",alt:"water"};case"unknown":default:return{icon:"map/Pin",alt:"unknown"}}}function Z(t){return t.map(ee).filter((e,i,n)=>n.indexOf(e)===i)}function ee(t){switch(t){case"onstreetBus":case"busStation":case"coachStation":return"bus";case"onstreetTram":case"tramStation":return"tram";case"railStation":case"metroStation":return"rail";case"airport":return"airport";case"harbourPort":case"ferryPort":case"ferryStop":return"boat";default:return"unknown"}}function te(t,e){if(!t)return{};const i=e?{toId:e.id,toLon:e.geometry.coordinates[0].toString(),toLat:e.geometry.coordinates[1].toString(),toLayer:e.layer}:void 0;return{fromId:t.id,fromLon:t.geometry.coordinates[0].toString(),fromLat:t.geometry.coordinates[1].toString(),fromLayer:t.layer,...i}}function oe(t,e){const i=e.mode!=="now"?{searchMode:e.mode,searchTime:e.dateTime.toString()}:{searchMode:e.mode},n=te(t.from,t.to);return{...i,...n}}function ne(t,e){const i=t.mode!=="now"?{searchMode:t.mode,searchTime:t.dateTime.toString()}:{searchMode:t.mode};return!e||e.layer=="venue"?{...i}:{...i,lon:e.geometry.coordinates[0].toString(),lat:e.geometry.coordinates[1].toString()}}async function ie(t,e){const i=`${t}api/departures/autocomplete?q=${e}`,n=await fetch(i);if(!n.ok)throw new Error(`Error fetching autocomplete data from ${i}`);return await n.json()}async function q(t,e){const n=await(await fetch(`${t}api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`)).json();if(n)return n}async function se(t,e){return new Promise(function(i,n){navigator.geolocation.getCurrentPosition(async s=>{const r=await q(t,s.coords);i(r)},s=>{n(new Error(re(s.code,e)))},{enableHighAccuracy:!0,timeout:1e4})})}function re(t,e){switch(t){case GeolocationPositionError.PERMISSION_DENIED:return e.geoTexts.denied;case GeolocationPositionError.TIMEOUT:return e.geoTexts.timeout;case GeolocationPositionError.POSITION_UNAVAILABLE:default:return e.geoTexts.unavailable}}const ae={nb:{noResults:"Ingen resultater",geoButton:"Finn min posisjon",geoTexts:{denied:"Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.",unavailable:"Posisjonen din er ikke tilgjengelig.",timeout:"Det tok for lang tid å hente posisjonen din. Prøv på nytt."},searchButton:"Finn avganger",placeholder:"adresse, kai eller holdeplass",assistant:{link:"Planlegg reisen",title:"Hvor vil du reise?",from:"Fra",to:"Til"},departure:{link:"Avganger",title:"Hvor vil du reise fra?",from:"Fra"},searchTime:{title:"Når vil du reise?",now:"Nå",arrive:"Ankomst",depart:"Avreise",date:"Dato",time:"Tid"}},nn:{noResults:"Ingen resultat",geoButton:"Finn min posisjon",geoTexts:{denied:"Du må endre posisjonsinnstillingane i nettlesaren din for å bruke din posisjon i reisesøket.",unavailable:"Posisjonen din er ikkje tilgjengeleg.",timeout:"Det tok for lang tid å hente posisjonen din. Prøv på nytt."},searchButton:"Finn avgangar",placeholder:"adresse, kai eller haldeplass",assistant:{link:"Planlegg reisa",title:"Kor vil du reise?",from:"Frå",to:"Til"},departure:{link:"Avgangar",title:"Kor vil du reise frå?",from:"Frå"},searchTime:{title:"Når vil du reise?",now:"No",arrive:"Ankomst",depart:"Avreise",date:"Dato",time:"Tid"}},en:{noResults:"No results",geoButton:"Find my position",geoTexts:{denied:"You must change location settings in your browser to use your position in the travel search.",unavailable:"Your position is not available.",timeout:"It took too long to retrieve your position. Try again."},searchButton:"Find departures",placeholder:"address, quay, or stop",assistant:{link:"Plan your journey",title:"Where do you want to travel?",from:"From",to:"To"},departure:{link:"Departures",title:"Where do you want to travel from?",from:"From"},searchTime:{title:"When do you want to travel?",now:"Now",arrive:"Arrival",depart:"Departure",date:"Date",time:"Time"}}};function le(t){return ae[t]}f.createWidget=G,f.reverse=q,Object.defineProperty(f,Symbol.toStringTag,{value:"Module"})});
