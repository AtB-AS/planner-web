(function(f,S){typeof exports=="object"&&typeof module<"u"?S(exports):typeof define=="function"&&define.amd?define(["exports"],S):(f=typeof globalThis<"u"?globalThis:f||self,S(f.PlannerWeb={}))})(this,function(f){"use strict";class S{constructor(e,i,{tabInsertsSuggestions:n,defaultFirstOption:r,scrollIntoViewOptions:c}={}){this.input=e,this.list=i,this.tabInsertsSuggestions=n??!0,this.defaultFirstOption=r??!1,this.scrollIntoViewOptions=c,this.isComposing=!1,i.id||(i.id=`combobox-${Math.random().toString().slice(2,6)}`),this.ctrlBindings=!!navigator.userAgent.match(/Macintosh/),this.keyboardEventHandler=l=>W(l,this),this.compositionEventHandler=l=>H(l,this),this.inputHandler=this.clearSelection.bind(this),e.setAttribute("role","combobox"),e.setAttribute("aria-controls",i.id),e.setAttribute("aria-expanded","false"),e.setAttribute("aria-autocomplete","list"),e.setAttribute("aria-haspopup","listbox")}destroy(){this.clearSelection(),this.stop(),this.input.removeAttribute("role"),this.input.removeAttribute("aria-controls"),this.input.removeAttribute("aria-expanded"),this.input.removeAttribute("aria-autocomplete"),this.input.removeAttribute("aria-haspopup")}start(){this.input.setAttribute("aria-expanded","true"),this.input.addEventListener("compositionstart",this.compositionEventHandler),this.input.addEventListener("compositionend",this.compositionEventHandler),this.input.addEventListener("input",this.inputHandler),this.input.addEventListener("keydown",this.keyboardEventHandler),this.list.addEventListener("click",k),this.indicateDefaultOption()}stop(){this.clearSelection(),this.input.setAttribute("aria-expanded","false"),this.input.removeEventListener("compositionstart",this.compositionEventHandler),this.input.removeEventListener("compositionend",this.compositionEventHandler),this.input.removeEventListener("input",this.inputHandler),this.input.removeEventListener("keydown",this.keyboardEventHandler),this.list.removeEventListener("click",k)}indicateDefaultOption(){var e;this.defaultFirstOption&&((e=Array.from(this.list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')).filter(T)[0])===null||e===void 0||e.setAttribute("data-combobox-option-default","true"))}navigate(e=1){const i=Array.from(this.list.querySelectorAll('[aria-selected="true"]')).filter(T)[0],n=Array.from(this.list.querySelectorAll('[role="option"]')).filter(T),r=n.indexOf(i);if(r===n.length-1&&e===1||r===0&&e===-1){this.clearSelection(),this.input.focus();return}let c=e===1?0:n.length-1;if(i&&r>=0){const d=r+e;d>=0&&d<n.length&&(c=d)}const l=n[c];if(l)for(const d of n)d.removeAttribute("data-combobox-option-default"),l===d?(this.input.setAttribute("aria-activedescendant",l.id),l.setAttribute("aria-selected","true"),x(l),l.scrollIntoView(this.scrollIntoViewOptions)):d.removeAttribute("aria-selected")}clearSelection(){this.input.removeAttribute("aria-activedescendant");for(const e of this.list.querySelectorAll('[aria-selected="true"]'))e.removeAttribute("aria-selected");this.indicateDefaultOption()}}function W(t,e){if(!(t.shiftKey||t.metaKey||t.altKey)&&!(!e.ctrlBindings&&t.ctrlKey)&&!e.isComposing)switch(t.key){case"Enter":I(e.input,e.list)&&t.preventDefault();break;case"Tab":e.tabInsertsSuggestions&&I(e.input,e.list)&&t.preventDefault();break;case"Escape":e.clearSelection();break;case"ArrowDown":e.navigate(1),t.preventDefault();break;case"ArrowUp":e.navigate(-1),t.preventDefault();break;case"n":e.ctrlBindings&&t.ctrlKey&&(e.navigate(1),t.preventDefault());break;case"p":e.ctrlBindings&&t.ctrlKey&&(e.navigate(-1),t.preventDefault());break;default:if(t.ctrlKey)break;e.clearSelection()}}function k(t){if(!(t.target instanceof Element))return;const e=t.target.closest('[role="option"]');e&&e.getAttribute("aria-disabled")!=="true"&&q(e,{event:t})}function I(t,e){const i=e.querySelector('[aria-selected="true"], [data-combobox-option-default="true"]');return i?(i.getAttribute("aria-disabled")==="true"||i.click(),!0):!1}function q(t,e){t.dispatchEvent(new CustomEvent("combobox-commit",{bubbles:!0,detail:e}))}function x(t){t.dispatchEvent(new Event("combobox-select",{bubbles:!0}))}function T(t){return!t.hidden&&!(t instanceof HTMLInputElement&&t.type==="hidden")&&(t.offsetWidth>0||t.offsetHeight>0)}function H(t,e){e.isComposing=t.type==="compositionstart",document.getElementById(e.input.getAttribute("aria-controls")||"")&&e.clearSelection()}const o={"override-light":"theme-module__override-light",light:"theme-module__light",assistant:'"../page-modules/assistant/assistant.module.css"',departures:'"../page-modules/departures/departures.module.css"',search:'"../components/search/search.module.css"',selector:'"../modules/search-time/selector/selector.module.css"',buttonComponent:'"../components/button/button.module.css"',hidden:"widget-module__hidden",lightWrapper:"widget-module__lightWrapper theme-module__light",wrapper:"widget-module__wrapper theme-module__override-light",form:"widget-module__form assistant-module__container",nav:"widget-module__nav",tabs:"widget-module__tabs",tabSelected:"widget-module__tabSelected",main:"widget-module__main assistant-module__main",heading:"widget-module__heading assistant-module__heading",inputBoxes:"widget-module__inputBoxes",search_container:"widget-module__search_container search-module__container",search_inputContainer:"widget-module__search_inputContainer search-module__inputContainer",search_label:"widget-module__search_label search-module__label typography-module__typo-body__secondary",search_input:"widget-module__search_input search-module__input",search_inputLast:"widget-module__search_inputLast",button_geolocation:"widget-module__button_geolocation departures-module__geolocationButton",selector_group:"widget-module__selector_group selector-module__departureDateSelector",selector_options:"widget-module__selector_options selector-module__options",selector_options__small:"widget-module__selector_options__small selector-module__options",selector_option:"widget-module__selector_option selector-module__option selector-module__option",selector_option__text:"widget-module__selector_option__text selector-module__option__text",selector_option__label:"widget-module__selector_option__label selector-module__option__label",selector_option__input:"widget-module__selector_option__input selector-module__option__input",selector_dateAndTimeSelectorsWrapper:"widget-module__selector_dateAndTimeSelectorsWrapper selector-module__dateAndTimeSelectorsWrapper",selector_dateAndTimeSelectorsWrapper__hidden:"widget-module__selector_dateAndTimeSelectorsWrapper__hidden",selector_dateAndTimeSelectors:"widget-module__selector_dateAndTimeSelectors selector-module__dateAndTimeSelectors",selector_dateSelector:"widget-module__selector_dateSelector selector-module__dateSelector",selector_timeSelector:"widget-module__selector_timeSelector selector-module__timeSelector",buttonGroup:"widget-module__buttonGroup",button:"widget-module__button","button--disabled":"widget-module__button--disabled",listItem:"widget-module__listItem",itemIcon:"widget-module__itemIcon",itemLocality:"widget-module__itemLocality search-module__itemLocality typography-module__typo-body__secondary",popupContainer:"widget-module__popupContainer search-module__menu",messageBox:"widget-module__messageBox"};var C={MODULE_VERSION:"2.2.2",COMPRESSED_ORG:"IYFwRkA"};const F=300,w=String.raw,A=C.MODULE_VERSION,L=C.COMPRESSED_ORG;function N(t){if(!(t!=null&&t.startsWith("http")))throw new Error("Missing urlBase in correct schema.");return t.endsWith("/")||(t+="/"),{URL_BASE:t,URL_JS_UMD:`${t}widget/${L}/${A}/planner-web.umd.js`,URL_JS_ESM:`${t}widget/${L}/${A}/planner-web.mjs`,URL_CSS:`${t}widget/${L}/${A}/planner-web.css`}}function R({urlBase:t,language:e="en"}){const i=ae(e),n=N(t);return{output:U(n,i),init:G,urls:n}}function G(){var e,i;Q(),D("pw-assistant"),D("pw-departure");let t={from:void 0,to:void 0};document.addEventListener("search-selected",function(n){const r=n;t[r.detail.key]=r.detail.item}),document.querySelectorAll("[name=searchTimeSelector]").forEach(function(n){n.addEventListener("change",function(r){const l=r.currentTarget.value==="now";document.querySelectorAll(".js-search-date-details").forEach(d=>{d.hidden=l})})}),(e=document.querySelector("#pw-form-departures"))==null||e.addEventListener("submit",n=>{n.preventDefault();const r=n.currentTarget;K(r,t.from)}),(i=document.querySelector("#pw-form-assistant"))==null||i.addEventListener("submit",n=>{n.preventDefault();const r=n.currentTarget;V(r,t.from,t.to)})}function D(t){const e=document.querySelector(`#${t}-searchTimeSelector-date`),i=document.querySelector(`#${t}-searchTimeSelector-time`);try{if(e&&(e.valueAsDate=new Date),i){const n=new Date;n.setSeconds(0),n.setMilliseconds(0),i.valueAsDate=n}}catch{}}function M(t){const e=t.get("searchTimeSelector");if(e==="now")return{mode:"now"};{const i=t.get("dateinput"),n=t.get("timeinput");if(i&&n){const r=new Date(`${i}T${n}`);return{mode:e=="arriveBy"?"arriveBy":"departBy",dateTime:r.getTime()}}return{mode:"now"}}}function V(t,e,i){const n=t.action,r=M(new FormData(t)),c=ee({from:e,to:i},r),l=new URLSearchParams(c);window.location.href=`${n}?${l.toString()}`}function K(t,e){const i=t.action,n=M(new FormData(t)),r=te(e,n),c=new URLSearchParams(r);window.location.href=`${i}?${c.toString()}`}class E extends HTMLElement{constructor(){super()}connectedCallback(){const e=this;e.hidden=!0,e.classList.add(o.messageBox),document.addEventListener("pw-errorMessage",function(i){const n=i;e.textContent=n.detail.message,e.hidden=!1}),document.addEventListener("pw-errorMessage-clear",function(i){e.hidden=!0}),e.addEventListener("click",function(){E.clearMessageBox()})}static clearMessageBox(){document.dispatchEvent(new CustomEvent("pw-errorMessage-clear",{bubbles:!0}))}}function U({URL_BASE:t},e){function i(a){const s=r(a),p=b("span",[a.name]),m=b("span",[a.locality??""],o.itemLocality),_=b("li",[s,p,m],o.listItem);return _.role="option",_.setAttribute("data-feature-id",a.id),_}function n(a){const s=b("span",[a]);return b("li",[s],o.listItem)}function r(a){const s=J(a.category),p=b("img");p.src=`${t}assets/mono/light/${s.icon}.svg`,p.alt=s.alt,p.role="img";const m=b("div",[p],o.itemIcon);return m.ariaHidden="true",m}class c extends HTMLElement{constructor(){super()}connectedCallback(){const s=this,p=s.getAttribute("data-mode")??"assistant";this.querySelector("button").addEventListener("click",async _=>{var g;E.clearMessageBox();try{const h=await ne(t,e),y=(g=s.parentElement)==null?void 0:g.querySelector("input");y&&(y.value=h?`${h.name}, ${h.locality}`:y.value),document.dispatchEvent(new CustomEvent("search-selected",{bubbles:!0,detail:{mode:p,key:"from",item:h}}))}catch(h){h instanceof Error&&document.dispatchEvent(new CustomEvent("pw-errorMessage",{bubbles:!0,detail:{message:h.message}}))}})}}customElements.define("pw-geobutton",c),customElements.define("pw-messagebox",E);class l extends HTMLElement{constructor(){super(),this.dataList={}}getItem(s){return this.dataList[s]}setItems(s){this.dataList={};for(let p of s)this.dataList[p.id]=p}connectedCallback(){const s=this,p=Y(this.getAttribute("data-debounce-ms"),F),m=this.querySelector("input"),_=this.querySelector("#"+this.getAttribute("for"));let g=new S(m,_,{scrollIntoViewOptions:!1});function h(u){u?g.start():(g.clearSelection(),g.stop()),_.hidden=!u}function y(){s.setItems([]),_.innerHTML="";const u=n(e.noResults);_.appendChild(u),h(!0)}const ce=B(async u=>{try{if(!u.value){_.innerHTML="";return}const v=await oe(t,u.value);if(v.length===0)return y();s.setItems(v),_.innerHTML="";for(let $ of v){const de=i($);_.appendChild(de)}h(!0)}catch{y()}},p);m.addEventListener("keydown",u=>{u.key==="Escape"&&h(!1)}),m.addEventListener("input",u=>ce(u.target)),m.addEventListener("focus",()=>h(!0)),m.addEventListener("blur",B(()=>h(!1),100)),document.addEventListener("click",u=>{P(u.target,this)||h(!1)}),_.addEventListener("combobox-commit",function(u){const v=u.target.getAttribute("data-feature-id"),$=v?s.getItem(v):void 0;m.value=$?`${$.name}, ${$.locality}`:m.value,document.dispatchEvent(new CustomEvent("search-selected",{bubbles:!0,detail:{mode:"assistant",key:m.name,item:$}})),_.hidden=!0,g.clearSelection(),g.stop()})}}customElements.define("pw-autocomplete",l);const d=w`
    <div class="${o.buttonGroup}">
      <button type="submit" class="${o.button}" aria-disabled="true">
        <span>${e.searchButton}</span>
      </button>
    </div>
  `,j=(a,s=!0)=>w`
    <div class="${o.inputBoxes}">
      <p class="${o.heading}">${e.searchTime.title}</p>
      <div>
        <div
          class="${o.selector_options} ${s?"":o.selector_options__small}"
        >
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="searchTimeSelector"
              aria-labelled-by="${a}-now"
              class="${o.selector_option__input}"
              value="now"
              checked=""
            />
            <span aria-hidden="true" class="${o.selector_option__label}">
              <span class="${o.selector_option__text}" id="${a}-now">
                ${e.searchTime.now}
              </span>
            </span>
          </label>
          <label class="${o.selector_option}">
            <input
              type="radio"
              name="searchTimeSelector"
              aria-labelled-by="${a}-depart"
              class="${o.selector_option__input}"
              value="departBy"
            />
            <span aria-hidden="true" class="${o.selector_option__label}">
              <span
                class="${o.selector_option__text}"
                id="${a}-depart"
              >
                ${e.searchTime.depart}
              </span>
            </span>
          </label>
          ${s?w`
                <label class="${o.selector_option}">
                  <input
                    type="radio"
                    name="searchTimeSelector"
                    aria-labelled-by="${a}-arrival"
                    class="${o.selector_option__input}"
                    value="arriveBy"
                  />
                  <span
                    aria-hidden="true"
                    class="${o.selector_option__label}"
                  >
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
    </div>
  `,se=w`
    <form
      class="${o.form}"
      action="${t}/assistant"
      id="pw-form-assistant"
      method="get"
    >
      <div class="${o.main}">
        <div class="${o.inputBoxes}">
          <p class="${o.heading}">${e.assistant.title}</p>
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
                  src="${t}/assets/mono/light/places/City.svg"
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
        </div>
        ${j("pw-assistant")}
      </div>
      ${d}
    </form>
  `,le=w`
    <form
      class="${o.form}"
      action="${t}/departures"
      id="pw-form-departures"
      method="get"
    >
      <div class="${o.main}">
        <div class="${o.inputBoxes}">
          <p class="${o.heading}">${e.departure.title}</p>
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
                  src="${t}/assets/mono/light/places/City.svg"
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
        ${j("pw-departure",!1)}
      </div>
      ${d}
    </form>
  `;return w`
    <div class="${o.wrapper} ${o.lightWrapper}">
      <nav class="${o.nav}">
        <ul class="${o.tabs} js-tablist">
          <li>
            <a
              href="/assistant"
              class="${o.tabSelected}"
              id="pw-assistant-tab"
            >
              ${e.assistant.link}
            </a>
          </li>
          <li>
            <a href="/departures" id="pw-departures-tab">
              ${e.departure.link}
            </a>
          </li>
        </ul>
      </nav>
      <div class="js-tabpanel" id="pw-assistant">${se}</div>
      <div class="js-tabpanel ${o.hidden}" id="pw-departures">
        ${le}
      </div>
    </div>
  `}function Q(){var t;(t=document.querySelector(".js-tablist"))==null||t.addEventListener("click",function(e){var l;const i=(l=e.target)==null?void 0:l.closest("a");if(!i)return;const n=i.getAttribute("href");if(!n)return;const r=n.replace("/","");e.preventDefault();const c=document.querySelector("#pw-"+r);c&&(E.clearMessageBox(),document.querySelectorAll(".js-tabpanel").forEach(d=>{d.classList.add(o.hidden)}),document.querySelectorAll(".js-tablist a").forEach(d=>{d.classList.remove(o.tabSelected)}),c.classList.remove(o.hidden),i.classList.add(o.tabSelected))})}function B(t,e){let i=null;return function(...n){clearTimeout(i),i=setTimeout(()=>{t(...n)},e)}}function b(t,e=[],i=""){const n=document.createElement(t);if(Array.isArray(e))for(let r of e){let c=typeof r=="string"?document.createTextNode(r):r;n.appendChild(c)}return n.className=i,n}function Y(t,e){const i=parseInt(t,10);return Number.isNaN(i)?e:i}function P(t,e){return t===e?!0:!t||!t.parentElement?!1:P(t.parentElement,e)}function J(t){switch(z(t)[0]){case"bus":return{icon:"transportation-entur/Bus",alt:"bus"};case"tram":return{icon:"transportation-entur/Tram",alt:"tram"};case"rail":return{icon:"transportation-entur/Train",alt:"rail"};case"airport":return{icon:"transportation-entur/Plane",alt:"air"};case"boat":return{icon:"transportation-entur/Ferry",alt:"water"};case"unknown":default:return{icon:"map/Pin",alt:"unknown"}}}function z(t){return t.map(X).filter((e,i,n)=>n.indexOf(e)===i)}function X(t){switch(t){case"onstreetBus":case"busStation":case"coachStation":return"bus";case"onstreetTram":case"tramStation":return"tram";case"railStation":case"metroStation":return"rail";case"airport":return"airport";case"harbourPort":case"ferryPort":case"ferryStop":return"boat";default:return"unknown"}}function Z(t,e){const i=e?{toId:e.id,toLon:e.geometry.coordinates[0].toString(),toLat:e.geometry.coordinates[1].toString(),toLayer:e.layer}:void 0;return{fromId:t.id,fromLon:t.geometry.coordinates[0].toString(),fromLat:t.geometry.coordinates[1].toString(),fromLayer:t.layer,...i}}function ee(t,e){const i=e.mode!=="now"?{searchMode:e.mode,searchTime:e.dateTime.toString()}:{searchMode:e.mode},n=Z(t.from,t.to);return{...i,...n}}function te(t,e){const i=e.mode!=="now"?{searchMode:e.mode,searchTime:e.dateTime.toString()}:{searchMode:e.mode};return t.layer=="venue"?{...i,id:t.id}:{...i,lon:t.geometry.coordinates[0].toString(),lat:t.geometry.coordinates[1].toString()}}async function oe(t,e){const i=`${t}api/departures/autocomplete?q=${e}`,n=await fetch(i);if(!n.ok)throw new Error(`Error fetching autocomplete data from ${i}`);return await n.json()}async function O(t,e){const n=await(await fetch(`${t}api/departures/reverse?lat=${e.latitude}&lon=${e.longitude}`)).json();if(n)return n}async function ne(t,e){return new Promise(function(i,n){navigator.geolocation.getCurrentPosition(async r=>{const c=await O(t,r.coords);i(c)},r=>{n(new Error(ie(r.code,e)))},{enableHighAccuracy:!0,timeout:1e4})})}function ie(t,e){switch(t){case GeolocationPositionError.PERMISSION_DENIED:return e.geoTexts.denied;case GeolocationPositionError.TIMEOUT:return e.geoTexts.timeout;case GeolocationPositionError.POSITION_UNAVAILABLE:default:return e.geoTexts.unavailable}}const re={nb:{noResults:"Ingen resultater",geoButton:"Finn min posisjon",geoTexts:{denied:"Du må endre stedsinnstillinger i nettleseren din for å bruke din posisjon i reisesøket.",unavailable:"Posisjonen din er ikke tilgjengelig.",timeout:"Det tok for lang tid å hente posisjonen din. Prøv på nytt."},searchButton:"Finn avganger",placeholder:"adresse, kai eller holdeplass",assistant:{link:"Planlegg reisen",title:"Hvor vil du reise?",from:"Fra",to:"Til"},departure:{link:"Avganger",title:"Hvor vil du reise fra?",from:"string"},searchTime:{title:"Når vil du reise?",now:"Nå",arrive:"Ankomst",depart:"Avreise",date:"Dato",time:"Tid"}},nn:{noResults:"Ingen resultat",geoButton:"Finn min posisjon",geoTexts:{denied:"Du må endre posisjonsinnstillingane i nettlesaren din for å bruke din posisjon i reisesøket.",unavailable:"Posisjonen din er ikkje tilgjengeleg.",timeout:"Det tok for lang tid å hente posisjonen din. Prøv på nytt."},searchButton:"Finn avgangar",placeholder:"adresse, kai eller haldeplass",assistant:{link:"Planlegg reisa",title:"Kor vil du reise?",from:"Frå",to:"Til"},departure:{link:"Avgangar",title:"Kor vil du reise frå?",from:"Frå"},searchTime:{title:"Når vil du reise?",now:"No",arrive:"Ankomst",depart:"Avreise",date:"Dato",time:"Tid"}},en:{noResults:"No results",geoButton:"Find my position",geoTexts:{denied:"You must change location settings in your browser to use your position in the travel search.",unavailable:"Your position is not available.",timeout:"It took too long to retrieve your position. Try again."},searchButton:"Find departures",placeholder:"address, quay, or stop",assistant:{link:"Plan your journey",title:"Where do you want to travel?",from:"From",to:"To"},departure:{link:"Departures",title:"Where do you want to travel from?",from:"From"},searchTime:{title:"When do you want to travel?",now:"Now",arrive:"Arrival",depart:"Departure",date:"Date",time:"Time"}}};function ae(t){return re[t]}f.createWidget=R,f.reverse=O,Object.defineProperty(f,Symbol.toStringTag,{value:"Module"})});
