/* home-infra-map-card — built artefact, do not edit. Sources: frontend/src/ */
const G=globalThis,ae=G.ShadowRoot&&(G.ShadyCSS===void 0||G.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,re=Symbol(),Ie=new WeakMap;let Ne=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==re)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o;const e=this.t;if(ae&&i===void 0){const t=e!==void 0&&e.length===1;t&&(i=Ie.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&Ie.set(e,i))}return i}toString(){return this.cssText}};const xt=i=>new Ne(typeof i=="string"?i:i+"",void 0,re),At=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((n,s,a)=>n+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[a+1],i[0]);return new Ne(t,i,re)},St=(i,e)=>{if(ae)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const n=document.createElement("style"),s=G.litNonce;s!==void 0&&n.setAttribute("nonce",s),n.textContent=t.cssText,i.appendChild(n)}},Ee=ae?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const n of e.cssRules)t+=n.cssText;return xt(t)})(i):i,{is:Ct,defineProperty:Pt,getOwnPropertyDescriptor:It,getOwnPropertyNames:Nt,getOwnPropertySymbols:Et,getPrototypeOf:Mt}=Object,J=globalThis,Me=J.trustedTypes,Rt=Me?Me.emptyScript:"",Tt=J.reactiveElementPolyfillSupport,U=(i,e)=>i,oe={toAttribute(i,e){switch(e){case Boolean:i=i?Rt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},Re=(i,e)=>!Ct(i,e),Te={attribute:!0,type:String,converter:oe,reflect:!1,useDefault:!1,hasChanged:Re};Symbol.metadata??=Symbol("metadata"),J.litPropertyMetadata??=new WeakMap;let E=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=Te){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){const t=Symbol(),n=this.getPropertyDescriptor(i,t,e);n!==void 0&&Pt(this.prototype,i,n)}}static getPropertyDescriptor(i,e,t){const{get:n,set:s}=It(this.prototype,i)??{get(){return this[e]},set(a){this[e]=a}};return{get:n,set(a){const o=n?.call(this);s?.call(this,a),this.requestUpdate(i,o,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??Te}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;const i=Mt(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){const e=this.properties,t=[...Nt(e),...Et(e)];for(const n of t)this.createProperty(n,e[n])}const i=this[Symbol.metadata];if(i!==null){const e=litPropertyMetadata.get(i);if(e!==void 0)for(const[t,n]of e)this.elementProperties.set(t,n)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){const e=[];if(Array.isArray(i)){const t=new Set(i.flat(1/0).reverse());for(const n of t)e.unshift(Ee(n))}else i!==void 0&&e.push(Ee(i));return e}static _$Eu(i,e){const t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){const i=new Map,e=this.constructor.elementProperties;for(const t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return St(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){const t=this.constructor.elementProperties.get(i),n=this.constructor._$Eu(i,t);if(n!==void 0&&t.reflect===!0){const s=(t.converter?.toAttribute!==void 0?t.converter:oe).toAttribute(e,t.type);this._$Em=i,s==null?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(i,e){const t=this.constructor,n=t._$Eh.get(i);if(n!==void 0&&this._$Em!==n){const s=t.getPropertyOptions(n),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:oe;this._$Em=n;const o=a.fromAttribute(e,s.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(i,e,t,n=!1,s){if(i!==void 0){const a=this.constructor;if(n===!1&&(s=this[i]),t??=a.getPropertyOptions(i),!((t.hasChanged??Re)(s,e)||t.useDefault&&t.reflect&&s===this._$Ej?.get(i)&&!this.hasAttribute(a._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:n,wrapped:s},a){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,a??e??this[i]),s!==!0||a!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),n===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[n,s]of this._$Ep)this[n]=s;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[n,s]of t){const{wrapped:a}=s,o=this[n];a!==!0||this._$AL.has(n)||o===void 0||this.C(n,void 0,s,o)}}let i=!1;const e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[U("elementProperties")]=new Map,E[U("finalized")]=new Map,Tt?.({ReactiveElement:E}),(J.reactiveElementVersions??=[]).push("2.1.2");const le=globalThis,De=i=>i,Z=le.trustedTypes,Oe=Z?Z.createPolicy("lit-html",{createHTML:i=>i}):void 0,Le="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,ze="?"+A,Dt=`<${ze}>`,S=document,j=()=>S.createComment(""),F=i=>i===null||typeof i!="object"&&typeof i!="function",de=Array.isArray,Ot=i=>de(i)||typeof i?.[Symbol.iterator]=="function",ce=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ue=/-->/g,je=/>/g,C=RegExp(`>|${ce}(?:([^\\s"'>=/]+)(${ce}*=${ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fe=/'/g,He=/"/g,Ve=/^(?:script|style|textarea|title)$/i,qe=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),r=qe(1),We=qe(2),M=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),Be=new WeakMap,P=S.createTreeWalker(S,129);function Ke(i,e){if(!de(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Oe!==void 0?Oe.createHTML(e):e}const Lt=(i,e)=>{const t=i.length-1,n=[];let s,a=e===2?"<svg>":e===3?"<math>":"",o=H;for(let p=0;p<t;p++){const c=i[p];let h,l,u=-1,m=0;for(;m<c.length&&(o.lastIndex=m,l=o.exec(c),l!==null);)m=o.lastIndex,o===H?l[1]==="!--"?o=Ue:l[1]!==void 0?o=je:l[2]!==void 0?(Ve.test(l[2])&&(s=RegExp("</"+l[2],"g")),o=C):l[3]!==void 0&&(o=C):o===C?l[0]===">"?(o=s??H,u=-1):l[1]===void 0?u=-2:(u=o.lastIndex-l[2].length,h=l[1],o=l[3]===void 0?C:l[3]==='"'?He:Fe):o===He||o===Fe?o=C:o===Ue||o===je?o=H:(o=C,s=void 0);const b=o===C&&i[p+1].startsWith("/>")?" ":"";a+=o===H?c+Dt:u>=0?(n.push(h),c.slice(0,u)+Le+c.slice(u)+A+b):c+A+(u===-2?p:b)}return[Ke(i,a+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]};class B{constructor({strings:e,_$litType$:t},n){let s;this.parts=[];let a=0,o=0;const p=e.length-1,c=this.parts,[h,l]=Lt(e,t);if(this.el=B.createElement(h,n),P.currentNode=this.el.content,t===2||t===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=P.nextNode())!==null&&c.length<p;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Le)){const m=l[o++],b=s.getAttribute(u).split(A),_=/([.?@])?(.*)/.exec(m);c.push({type:1,index:a,name:_[2],strings:b,ctor:_[1]==="."?Ut:_[1]==="?"?jt:_[1]==="@"?Ft:Y}),s.removeAttribute(u)}else u.startsWith(A)&&(c.push({type:6,index:a}),s.removeAttribute(u));if(Ve.test(s.tagName)){const u=s.textContent.split(A),m=u.length-1;if(m>0){s.textContent=Z?Z.emptyScript:"";for(let b=0;b<m;b++)s.append(u[b],j()),P.nextNode(),c.push({type:2,index:++a});s.append(u[m],j())}}}else if(s.nodeType===8)if(s.data===ze)c.push({type:2,index:a});else{let u=-1;for(;(u=s.data.indexOf(A,u+1))!==-1;)c.push({type:7,index:a}),u+=A.length-1}a++}}static createElement(e,t){const n=S.createElement("template");return n.innerHTML=e,n}}function R(i,e,t=i,n){if(e===M)return e;let s=n!==void 0?t._$Co?.[n]:t._$Cl;const a=F(e)?void 0:e._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),a===void 0?s=void 0:(s=new a(i),s._$AT(i,t,n)),n!==void 0?(t._$Co??=[])[n]=s:t._$Cl=s),s!==void 0&&(e=R(i,s._$AS(i,e.values),s,n)),e}class zt{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:n}=this._$AD,s=(e?.creationScope??S).importNode(t,!0);P.currentNode=s;let a=P.nextNode(),o=0,p=0,c=n[0];for(;c!==void 0;){if(o===c.index){let h;c.type===2?h=new K(a,a.nextSibling,this,e):c.type===1?h=new c.ctor(a,c.name,c.strings,this,e):c.type===6&&(h=new Ht(a,this,e)),this._$AV.push(h),c=n[++p]}o!==c?.index&&(a=P.nextNode(),o++)}return P.currentNode=S,s}p(e){let t=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}}class K{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,s){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=R(this,e,t),F(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==M&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ot(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&F(this._$AH)?this._$AA.nextSibling.data=e:this.T(S.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:n}=e,s=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=B.createElement(Ke(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===s)this._$AH.p(t);else{const a=new zt(s,this),o=a.u(this.options);a.p(t),this.T(o),this._$AH=a}}_$AC(e){let t=Be.get(e.strings);return t===void 0&&Be.set(e.strings,t=new B(e)),t}k(e){de(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let n,s=0;for(const a of e)s===t.length?t.push(n=new K(this.O(j()),this.O(j()),this,this.options)):n=t[s],n._$AI(a),s++;s<t.length&&(this._$AR(n&&n._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const n=De(e).nextSibling;De(e).remove(),e=n}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,s,a){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=a,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=d}_$AI(e,t=this,n,s){const a=this.strings;let o=!1;if(a===void 0)e=R(this,e,t,0),o=!F(e)||e!==this._$AH&&e!==M,o&&(this._$AH=e);else{const p=e;let c,h;for(e=a[0],c=0;c<a.length-1;c++)h=R(this,p[n+c],t,c),h===M&&(h=this._$AH[c]),o||=!F(h)||h!==this._$AH[c],h===d?e=d:e!==d&&(e+=(h??"")+a[c+1]),this._$AH[c]=h}o&&!s&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ut extends Y{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}}class jt extends Y{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}}class Ft extends Y{constructor(e,t,n,s,a){super(e,t,n,s,a),this.type=5}_$AI(e,t=this){if((e=R(this,e,t,0)??d)===M)return;const n=this._$AH,s=e===d&&n!==d||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,a=e!==d&&(n===d||s);s&&this.element.removeEventListener(this.name,this,n),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class Ht{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){R(this,e)}}const Vt=le.litHtmlPolyfillSupport;Vt?.(B,K),(le.litHtmlVersions??=[]).push("3.3.3");const qt=(i,e,t)=>{const n=t?.renderBefore??e;let s=n._$litPart$;if(s===void 0){const a=t?.renderBefore??null;n._$litPart$=s=new K(e.insertBefore(j(),a),a,void 0,t??{})}return s._$AI(i),s},he=globalThis;let k=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=qt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};k._$litElement$=!0,k.finalized=!0,he.litElementHydrateSupport?.({LitElement:k});const Wt=he.litElementPolyfillSupport;Wt?.({LitElement:k}),(he.litElementVersions??=[]).push("4.2.2");const Bt=i=>(...e)=>({_$litDirective$:i,values:e});let Kt=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,e,t){this._$Ct=i,this._$AM=e,this._$Ci=t}_$AS(i,e){return this.update(i,e)}update(i,e){return this.render(...e)}};const Gt={},Jt=(i,e=Gt)=>i._$AH=e,Zt=Bt(class extends Kt{constructor(){super(...arguments),this.key=d}render(i,e){return this.key=i,e}update(i,[e,t]){return e!==this.key&&(Jt(i),this.key=e),t}}),$="home_infra_map";function I(i){return i?.code??"unknown_error"}function w(i){const e=i;return e?.message??e?.code??String(i)}const pe=i=>i.callWS({type:`${$}/get`});function Yt(i,e){return i.connection.subscribeMessage(e,{type:`${$}/subscribe`})}const Ge=(i,e,t,n)=>i.callWS({type:`${$}/save`,section:e,data:t,expected_revision:n}),Qt=(i,e)=>i.callWS({type:`${$}/probe`,host:e}),Xt=(i,e)=>i.callWS({type:`${$}/preview_entities`,device:e}),ei=i=>i.callWS({type:`${$}/import_opnsense`}),ti=(i,e,t,n)=>i.callWS({type:`${$}/import_opnsense`,apply:!0,vlans:e,devices:t,expected_revision:n}),ii=(i,e)=>i.callWS({type:`${$}/firewall`,device_id:e}),ni=i=>i.callWS({type:`${$}/export`}),si=(i,e)=>i.callWS({type:`${$}/import_yaml`,content:e}),ai=i=>i.callWS({type:`${$}/generate_dashboard`});async function Je(i,e){if(!e.length)return{};const t=new Date,n=new Date(t.getTime()-24*3600*1e3);return i.callWS({type:"history/history_during_period",start_time:n.toISOString(),end_time:t.toISOString(),entity_ids:e,minimal_response:!0,no_attributes:!0,significant_changes_only:!1})}function Ze(i){return`/api/${$}/photo/${encodeURIComponent(i)}`}async function ri(i,e,t){const n=await i.callWS({type:"auth/sign_path",path:Ze(e),expires:3600}),s=n.path.includes("?")?"&":"?";return`${n.path}${s}v=${encodeURIComponent(t)}`}async function oi(i,e,t){if(!i.fetchWithAuth)throw new Error("upload not supported by this frontend");const n=new FormData;n.append("file",t);const s=await i.fetchWithAuth(Ze(e),{method:"POST",body:n}),a=await s.json().catch(()=>({}));if(!s.ok||!a.photo_path)throw new Error(a.message??`HTTP ${s.status}`);return a.photo_path}const li={"card.name":"Home Infra Map","card.description":"Tableaux \xE9lectriques et r\xE9seau de la maison","card.loading":"Chargement\u2026","card.not_configured":"L'int\xE9gration Home Infra Map n'est pas configur\xE9e (Param\xE8tres \u2192 Appareils et services).","card.error":"Erreur : {error}","card.retry":"R\xE9essayer","view.electricity":"\xC9lectricit\xE9","view.network":"R\xE9seau","nview.topology":"Topologie","nview.vlan":"VLAN","nview.switch":"Switch","edit.open":"Modifier","edit.close":"Quitter la modification","edit.title":"Modifier \xB7 {name}","edit.cancel":"Annuler","edit.save":"Enregistrer","edit.saved":"Enregistr\xE9","edit.conflict":"Les donn\xE9es ont \xE9t\xE9 modifi\xE9es ailleurs. Rechargement : vos changements non enregistr\xE9s sont perdus.","edit.refused":"Action refus\xE9e : r\xE9serv\xE9e aux administrateurs.","edit.failed":"\xC9chec : {error}","edit.confirm_delete":"Supprimer \xAB {name} \xBB ?","edit.unsaved":"Modifications non enregistr\xE9es","tools.export":"Exporter","tools.download":"T\xE9l\xE9charger (.yaml)","tools.choose_file":"Choisir un fichier .yaml\u2026","tools.file_too_large":"Fichier trop volumineux (2 Mo au plus).","el.slots":"{used} / {capacity} modules","el.slots_unknown":"{used} modules (largeur du rail non renseign\xE9e)","ee.board_slots":"Modules par rang\xE9e (largeur du rail)","ee.row_capacity":"Modules de cette rang\xE9e (vide = celle du tableau)","ee.add_spacer":"Ajouter un emplacement vide \xE0 la rang\xE9e {label}","check.row_overflow":"Rang\xE9e {row} : {used} modules pour un rail de {capacity} : \xE0 v\xE9rifier","tools.import":"Importer","tools.dashboard":"G\xE9n\xE9rer un exemple de tableau de bord","tools.copy":"Copier","tools.copied":"Copi\xE9","tools.close":"Fermer","tools.import_hint":"Collez un export Home Infra Map ou un fichier de la maison (tableaux / \xE9quipements). Les sections pr\xE9sentes remplacent les donn\xE9es actuelles.","tools.import_run":"Importer","tools.import_done":"Import termin\xE9 : {boards} tableau(x), {modules} modules, {vlans} VLAN, {devices} \xE9quipements.","tools.dashboard_hint":"Copiez ce YAML dans un tableau de bord (Modifier \u2192 \u22EE \u2192 \xC9diteur de configuration), ou carte par carte.","el.no_board":"Aucun tableau. Passez en modification (crayon) pour en cr\xE9er un ou importer un fichier.","el.board":"Tableau","el.rcd_count":"{n} diff\xE9rentiel(s)","el.to_identify":"{n} circuit(s) \xE0 identifier","el.all_identified":"Tous les circuits identifi\xE9s","el.now":"{w} en ce moment","el.warnings":"{n} point(s) \xE0 v\xE9rifier","el.photo":"Photo du tableau","el.row":"Rang\xE9e {label}","el.kind.rcd":"Interrupteur diff\xE9rentiel","el.kind.breaker":"Disjoncteur","el.kind.rcbo":"Disjoncteur diff\xE9rentiel","el.kind.device":"Autre module","el.kind.spacer":"Emplacement vide","el.d.ref":"Rep\xE8re","el.d.circuit":"Circuit","el.d.areas":"Pi\xE8ces","el.d.protected_by":"Prot\xE9g\xE9 par","el.d.no_rcd":"aucun diff\xE9rentiel en amont sur la rang\xE9e","el.d.measure":"Mesure","el.d.energy":"\xC9nergie","el.d.history":"24 h","el.d.notes":"Notes","el.d.warnings":"\xC0 v\xE9rifier","el.d.model":"Mod\xE8le","el.d.entities":"Entit\xE9s","el.d.cable":"c\xE2ble {s} mm\xB2","el.d.no_history":"Pas d'historique","el.d.close":"Fermer le d\xE9tail","el.sensitivity":"{ma} mA","el.type":"type {t}","el.unknown_type":"type ?","el.module_aria":"{kind} {ref} {title} {name}","ck.kind.lighting":"\xC9clairage","ck.kind.sockets":"Prises","ck.kind.dedicated":"Circuit sp\xE9cialis\xE9","ck.kind.cooking":"Cuisson","ck.kind.water_heater":"Chauffe-eau","ck.kind.heating":"Chauffage","ck.kind.feeder":"D\xE9part / sous-tableau","ck.kind.other":"Autre","ck.kind.unknown":"Non identifi\xE9","check.no_rcd":"Aucun diff\xE9rentiel en amont : \xE0 v\xE9rifier","check.no_rcd_30ma":"Pas de diff\xE9rentiel 30 mA en amont ({sensitivity_ma} mA) : \xE0 v\xE9rifier","check.rcd_type_a":"Circuit cuisson / lave-linge derri\xE8re un diff\xE9rentiel type {rcd_type} ({rcd_ref}) : type A attendu, \xE0 v\xE9rifier","check.cable_rating":"Calibre {rating_a} A pour un c\xE2ble de {cable_mm2} mm\xB2 (max {max_a} A) : \xE0 v\xE9rifier","check.kind_rating":"Calibre {rating_a} A \xE9lev\xE9 pour ce type de circuit (max {max_a} A) : \xE0 v\xE9rifier","check.unidentified":"Circuit non identifi\xE9","check.too_many_breakers":"{count} disjoncteurs derri\xE8re ce diff\xE9rentiel (8 au plus conseill\xE9s) : \xE0 v\xE9rifier","check.rcd_sum":"Somme des calibres en aval ({total_a} A) \xE9lev\xE9e pour un diff\xE9rentiel de {rating_a} A (information)","check.disclaimer":"Indications inspir\xE9es de la NF C 15-100, qui ne remplacent pas un \xE9lectricien.","ee.add_module":"Ajouter un module \xE0 la rang\xE9e {label}","ee.add_row":"+ Rang\xE9e","ee.add_board":"+ Tableau","ee.delete_row":"Supprimer la rang\xE9e","ee.delete_board":"Supprimer le tableau","ee.photo_upload":"Importer la photo","ee.photo_uploading":"Envoi de la photo\u2026","ee.photo_remove":"Retirer la photo","ee.move_left":"D\xE9placer \u25C0","ee.move_right":"D\xE9placer \u25B6","ee.delete":"Supprimer","ee.select_hint":"Cliquez sur un module pour le modifier. Glisser-d\xE9poser ou \u25C0 \u25B6 pour r\xE9ordonner.","ee.board_name":"Nom du tableau","ee.board_location":"Emplacement","ee.board_area":"Pi\xE8ce","ee.row_label":"Nom de la rang\xE9e","ee.f.kind":"Type","ee.f.ref":"Rep\xE8re","ee.f.rating":"Calibre \xB7 courbe","ee.f.rcd_rating":"Calibre","ee.f.sensitivity":"Sensibilit\xE9","ee.f.rcd_type":"Type de diff\xE9rentiel","ee.f.circuit":"Circuit","ee.f.circuit_kind":"Type de circuit","ee.f.areas":"Pi\xE8ces","ee.f.power":"Capteur de puissance","ee.f.energy":"Capteur d'\xE9nergie","ee.f.switch":"Interrupteur / relais li\xE9","ee.f.cable":"Section du c\xE2ble","ee.f.width":"Largeur (modules DIN)","ee.f.model":"Mod\xE8le","ee.f.notes":"Notes","ee.f.label":"Libell\xE9","ee.f.entities":"Entit\xE9s li\xE9es (s\xE9par\xE9es par des virgules)","ee.none":"\u2014","net.online":"{n} \xE9quipement(s) en ligne","net.offline":"{n} hors ligne","net.no_devices":"Aucun \xE9quipement. Passez en modification (crayon) pour en ajouter ou importer depuis OPNsense.","net.internet":"Internet","net.port":"port {n}","net.offline_short":"hors ligne","net.unplaced":"Sans port connu","net.wifi_under":"via {name}","net.vlan_tag":"VLAN {tag}","net.untagged":"non tagu\xE9","net.no_vlan":"Sans VLAN","net.devices_n":"{n} \xE9quipement(s)","net.no_switch":"Aucun switch d\xE9clar\xE9. Ajoutez une source SNMP (options de l'int\xE9gration) ou importez un fichier.","net.switch_unavailable":"Switch injoignable : derni\xE8res donn\xE9es connues.","net.port_detail":"Port {n}","net.speed":"{s}","net.poe":"PoE","net.vlans_line":"natif {pvid} \xB7 \xE9tiquet\xE9s {tagged}","net.lldp":"Voisin LLDP","net.seen":"\xC9quipements vus","net.macs":"{n} adresse(s) MAC","net.link_down":"lien coup\xE9","net.link_up":"lien actif","net.ping_unavailable":"Ping indisponible (droits ICMP) : voir le README.","net.gateway":"{name} {delay}","kind.router":"Routeur","kind.switch":"Switch","kind.ap":"Antenne Wi-Fi","kind.server":"Serveur","kind.nas":"NAS","kind.camera":"Cam\xE9ra","kind.iot":"Objet connect\xE9","kind.computer":"Ordinateur","kind.phone":"T\xE9l\xE9phone","kind.printer":"Imprimante","kind.other":"Autre","ds.tab.info":"Infos","ds.tab.firewall":"Pare-feu","ds.tab.history":"Historique","ds.close":"Fermer","ds.online":"En ligne","ds.online_ms":"En ligne \xB7 {ms} ms","ds.offline":"Hors ligne","ds.unknown":"\xC9tat inconnu","ds.blocks_today":"{n} blocage(s) sur 24 h","ds.ip":"Adresse","ds.mac":"MAC","ds.vlan":"VLAN","ds.port":"Port du switch","ds.port_value":"{port} \xB7 {switch}","ds.port_auto":"d\xE9tect\xE9","ds.port_manual":"saisi","ds.last_seen":"vu le {date}","ds.area":"Pi\xE8ce","ds.kind":"Type","ds.parent":"\xC9quipement parent","ds.sensors":"Capteurs","ds.notes":"Notes","ds.no_sensor":"aucun","fw.loading":"Analyse du pare-feu\u2026","fw.not_configured":"OPNsense n'est pas configur\xE9, ou l'analyse du pare-feu est d\xE9sactiv\xE9e (options de l'int\xE9gration).","fw.unavailable":"OPNsense est injoignable : analyse indisponible.","fw.not_an_ip":"L'analyse du pare-feu n\xE9cessite une adresse IP.","fw.what_can":"Ce que l'appareil peut faire \xB7 dans l'ordre d'application","fw.col.rule":"R\xE8gle (commentaire OPNsense)","fw.col.to":"Vers","fw.col.today":"Aujourd'hui","fw.pass":"autoris\xE9","fw.block":"bloqu\xE9","fw.own_rule":"r\xE8gle propre \xE0 l'appareil","fw.probable":"probable","fw.floating":"flottante","fw.blocked_n":"{n} bloqu\xE9e(s)","fw.default_deny":"Aucune r\xE8gle ne correspond ensuite : blocage par d\xE9faut.","fw.unreachable":"{n} r\xE8gle(s) suivante(s) jamais atteinte(s).","fw.redundant":"R\xE8gle(s) masqu\xE9e(s) car couvertes par une r\xE8gle suivante : {list}","fw.who":"Qui peut le joindre","fw.same_network":"m\xEAme r\xE9seau (non filtr\xE9)","fw.partial":"partiel","fw.nat":"Redirection NAT : port {ext} \u2192 {target}","fw.recent":"Derniers blocages","fw.col.time":"Heure","fw.col.dest":"Destination","fw.col.name":"Nom","fw.col.by":"Bloqu\xE9 par","fw.default_rule":"r\xE8gle par d\xE9faut / automatique","fw.no_blocks":"Aucun blocage r\xE9cent.","fw.readonly":"Lecture seule : rien n'est modifi\xE9 sur le routeur. Les noms viennent du journal DNS du routeur (probables).","fw.dest.any":"Internet / partout","fw.dest.router":"routeur ({ip})","fw.dest.private":"r\xE9seaux internes","fw.dest.network":"r\xE9seau {name}","fw.not":"tout sauf {x}","fw.reason.no_sequence":"ordre non garanti (sans num\xE9ro de s\xE9quence)","fw.reason.not_quick":"r\xE8gle flottante non \xAB quick \xBB","fw.reason.tagged":"r\xE8gle avec \xE9tiquette (tag)","fw.reason.route_to":"routage par passerelle","fw.reason.interface_not":"interfaces invers\xE9es","fw.reason.ports_unresolved":"ports non r\xE9solus","fw.reason.alias_url":"alias de type URL","fw.reason.alias_urltable":"alias de type URL","fw.reason.alias_urljson":"alias de type URL","fw.reason.alias_geoip":"alias GeoIP","fw.reason.alias_mac":"alias d'adresses MAC","fw.reason.alias_asn":"alias ASN","fw.reason.alias_dynipv6host":"alias IPv6 dynamique","fw.reason.alias_authgroup":"alias de groupe","fw.reason.alias_internal":"alias interne","fw.reason.alias_unresolved":"alias non r\xE9solu","fw.reason.unknown_token":"adresse inconnue","fw.reason.source_unresolved":"source ind\xE9termin\xE9e","fw.reason.destination_unresolved":"destination ind\xE9termin\xE9e","hist.presence":"Pr\xE9sence \xB7 24 h","hist.latency":"Latence \xB7 24 h","hist.none":"Aucun capteur de pr\xE9sence ou de latence pour cet \xE9quipement.","ne.add":"+ Ajouter un \xE9quipement","ne.import_opnsense":"Tout importer depuis OPNsense","ne.add_title":"Ajouter un \xE9quipement","ne.edit_title":"Modifier \xB7 {name}","ne.create":"Cr\xE9er","ne.f.name":"Nom","ne.f.host":"Adresse IP ou nom","ne.f.vlan":"R\xE9seau (VLAN)","ne.f.mac":"Adresse MAC","ne.f.switch":"Switch","ne.f.port":"Port du switch","ne.f.port_source":"Port fig\xE9 (saisi \xE0 la main)","ne.f.area":"Pi\xE8ce","ne.f.kind":"Type","ne.f.parent":"\xC9quipement parent (antenne, r\xE9p\xE9teur)","ne.f.model":"Mod\xE8le","ne.f.notes":"Notes","ne.probe":"Tester","ne.probing":"Test\u2026","ne.answers":"r\xE9pond \xB7 {ms} ms","ne.no_answer":"ne r\xE9pond pas","ne.vlan_detected":"d\xE9tect\xE9 depuis l'IP","ne.mac_detected":"lue sur le routeur ({source})","ne.port_detected":"lu sur le switch","ne.port_via":"{port} (via {via})","ne.sensors":"Capteurs \xE0 cr\xE9er","ne.s.ping":"Pr\xE9sence (ping)","ne.s.latency":"Latence","ne.s.tcp":"Port TCP","ne.s.alert":"Alerte si hors ligne plus de (min)","ne.interval":"Intervalle : {s} s \xB7 regroup\xE9s sous un appareil HA \xAB {name} \xBB.","ne.devices":"\xC9quipements d\xE9clar\xE9s","ne.col.name":"Nom","ne.col.ip":"IP","ne.col.vlan":"VLAN","ne.col.port":"Port","ne.col.sensors":"Capteurs","ne.edit":"Modifier","ne.delete":"Supprimer","ne.s.short.ping":"pr\xE9sence","ne.s.short.latency":"latence","ne.s.short.tcp":"port {p}","ne.s.short.alert":"alerte","ne.vlans":"VLAN","ne.vlan_add":"+ VLAN","ne.v.name":"Nom","ne.v.tag":"Tag","ne.v.subnet":"Sous-r\xE9seau","ne.v.color":"Couleur","ne.v.role":"R\xF4le","ne.v.access":"Acc\xE8s","ne.uplink":"Lien Internet","ne.u.isp":"Fournisseur d'acc\xE8s","ne.u.box_name":"Box","ne.u.box_ip":"IP de la box","ne.u.public_ip":"IP publique","ne.save_network":"Enregistrer","ne.import_title":"Importer depuis OPNsense","ne.import_hint":"Rien n'est \xE9crit avant \xAB Importer la s\xE9lection \xBB. Les \xE9quipements d\xE9j\xE0 d\xE9clar\xE9s sont ignor\xE9s ; seul le capteur de pr\xE9sence est activ\xE9.","ne.import_apply":"Importer la s\xE9lection","ne.import_none":"OPNsense ne propose rien \xE0 importer.","ne.exists":"d\xE9j\xE0 d\xE9clar\xE9","ne.loading":"Lecture d'OPNsense\u2026","ne.required":"Nom obligatoire."},ue={"card.name":"Home Infra Map","card.description":"Electrical boards and home network","card.loading":"Loading\u2026","card.not_configured":"The Home Infra Map integration is not configured (Settings \u2192 Devices & services).","card.error":"Error: {error}","card.retry":"Retry","view.electricity":"Electricity","view.network":"Network","nview.topology":"Topology","nview.vlan":"VLAN","nview.switch":"Switch","edit.open":"Edit","edit.close":"Leave edit mode","edit.title":"Edit \xB7 {name}","edit.cancel":"Cancel","edit.save":"Save","edit.saved":"Saved","edit.conflict":"The data was changed elsewhere. Reloading: your unsaved changes are lost.","edit.refused":"Refused: administrators only.","edit.failed":"Failed: {error}","edit.confirm_delete":'Delete "{name}"?',"edit.unsaved":"Unsaved changes","tools.export":"Export","tools.download":"Download (.yaml)","tools.choose_file":"Choose a .yaml file\u2026","tools.file_too_large":"File too large (2 MB max).","el.slots":"{used} / {capacity} modules","el.slots_unknown":"{used} modules (rail width not set)","ee.board_slots":"Modules per row (rail width)","ee.row_capacity":"Modules of this row (empty = board value)","ee.add_spacer":"Add an empty place to row {label}","check.row_overflow":"Row {row}: {used} modules on a {capacity}-module rail: to check","tools.import":"Import","tools.dashboard":"Generate an example dashboard","tools.copy":"Copy","tools.copied":"Copied","tools.close":"Close","tools.import_hint":"Paste a Home Infra Map export or a house file (boards / devices). The sections present replace the current data.","tools.import_run":"Import","tools.import_done":"Import done: {boards} board(s), {modules} modules, {vlans} VLANs, {devices} devices.","tools.dashboard_hint":"Paste this YAML into a dashboard (Edit \u2192 \u22EE \u2192 Raw configuration editor), or card by card.","el.no_board":"No board yet. Use edit mode (pencil) to create one or import a file.","el.board":"Board","el.rcd_count":"{n} RCD(s)","el.to_identify":"{n} circuit(s) to identify","el.all_identified":"All circuits identified","el.now":"{w} right now","el.warnings":"{n} point(s) to check","el.photo":"Board photo","el.row":"Row {label}","el.kind.rcd":"Residual current device","el.kind.breaker":"Circuit breaker","el.kind.rcbo":"RCBO","el.kind.device":"Other module","el.kind.spacer":"Empty slot","el.d.ref":"Reference","el.d.circuit":"Circuit","el.d.areas":"Areas","el.d.protected_by":"Protected by","el.d.no_rcd":"no RCD upstream on this row","el.d.measure":"Measurement","el.d.energy":"Energy","el.d.history":"24 h","el.d.notes":"Notes","el.d.warnings":"To check","el.d.model":"Model","el.d.entities":"Entities","el.d.cable":"{s} mm\xB2 cable","el.d.no_history":"No history","el.d.close":"Close details","el.sensitivity":"{ma} mA","el.type":"type {t}","el.unknown_type":"type ?","el.module_aria":"{kind} {ref} {title} {name}","ck.kind.lighting":"Lighting","ck.kind.sockets":"Sockets","ck.kind.dedicated":"Dedicated circuit","ck.kind.cooking":"Cooking","ck.kind.water_heater":"Water heater","ck.kind.heating":"Heating","ck.kind.feeder":"Feeder / sub-board","ck.kind.other":"Other","ck.kind.unknown":"Unidentified","check.no_rcd":"No RCD upstream: to check","check.no_rcd_30ma":"No 30 mA RCD upstream ({sensitivity_ma} mA): to check","check.rcd_type_a":"Cooking / washing machine circuit behind a type {rcd_type} RCD ({rcd_ref}): type A expected, to check","check.cable_rating":"{rating_a} A rating on a {cable_mm2} mm\xB2 cable (max {max_a} A): to check","check.kind_rating":"{rating_a} A is high for this kind of circuit (max {max_a} A): to check","check.unidentified":"Unidentified circuit","check.too_many_breakers":"{count} breakers behind this RCD (8 at most advised): to check","check.rcd_sum":"Sum of downstream ratings ({total_a} A) is high for a {rating_a} A RCD (information)","check.disclaimer":"Hints inspired by the French NF C 15-100 standard; they do not replace an electrician.","ee.add_module":"Add a module to row {label}","ee.add_row":"+ Row","ee.add_board":"+ Board","ee.delete_row":"Delete row","ee.delete_board":"Delete board","ee.photo_upload":"Upload photo","ee.photo_uploading":"Uploading photo\u2026","ee.photo_remove":"Remove photo","ee.move_left":"Move \u25C0","ee.move_right":"Move \u25B6","ee.delete":"Delete","ee.select_hint":"Click a module to edit it. Drag and drop or \u25C0 \u25B6 to reorder.","ee.board_name":"Board name","ee.board_location":"Location","ee.board_area":"Area","ee.row_label":"Row name","ee.f.kind":"Kind","ee.f.ref":"Reference","ee.f.rating":"Rating \xB7 curve","ee.f.rcd_rating":"Rating","ee.f.sensitivity":"Sensitivity","ee.f.rcd_type":"RCD type","ee.f.circuit":"Circuit","ee.f.circuit_kind":"Circuit kind","ee.f.areas":"Areas","ee.f.power":"Power sensor","ee.f.energy":"Energy sensor","ee.f.switch":"Linked switch / relay","ee.f.cable":"Cable cross-section","ee.f.width":"Width (DIN modules)","ee.f.model":"Model","ee.f.notes":"Notes","ee.f.label":"Label","ee.f.entities":"Linked entities (comma separated)","ee.none":"\u2014","net.online":"{n} device(s) online","net.offline":"{n} offline","net.no_devices":"No device yet. Use edit mode (pencil) to add some or import from OPNsense.","net.internet":"Internet","net.port":"port {n}","net.offline_short":"offline","net.unplaced":"No known port","net.wifi_under":"via {name}","net.vlan_tag":"VLAN {tag}","net.untagged":"untagged","net.no_vlan":"No VLAN","net.devices_n":"{n} device(s)","net.no_switch":"No switch declared. Add an SNMP source (integration options) or import a file.","net.switch_unavailable":"Switch unreachable: last known data.","net.port_detail":"Port {n}","net.speed":"{s}","net.poe":"PoE","net.vlans_line":"native {pvid} \xB7 tagged {tagged}","net.lldp":"LLDP neighbour","net.seen":"Devices seen","net.macs":"{n} MAC address(es)","net.link_down":"link down","net.link_up":"link up","net.ping_unavailable":"Ping unavailable (ICMP permissions): see the README.","net.gateway":"{name} {delay}","kind.router":"Router","kind.switch":"Switch","kind.ap":"Wi-Fi access point","kind.server":"Server","kind.nas":"NAS","kind.camera":"Camera","kind.iot":"IoT device","kind.computer":"Computer","kind.phone":"Phone","kind.printer":"Printer","kind.other":"Other","ds.tab.info":"Info","ds.tab.firewall":"Firewall","ds.tab.history":"History","ds.close":"Close","ds.online":"Online","ds.online_ms":"Online \xB7 {ms} ms","ds.offline":"Offline","ds.unknown":"Unknown state","ds.blocks_today":"{n} block(s) over 24 h","ds.ip":"Address","ds.mac":"MAC","ds.vlan":"VLAN","ds.port":"Switch port","ds.port_value":"{port} \xB7 {switch}","ds.port_auto":"detected","ds.port_manual":"manual","ds.last_seen":"seen {date}","ds.area":"Area","ds.kind":"Kind","ds.parent":"Parent device","ds.sensors":"Sensors","ds.notes":"Notes","ds.no_sensor":"none","fw.loading":"Analysing the firewall\u2026","fw.not_configured":"OPNsense is not configured, or firewall analysis is disabled (integration options).","fw.unavailable":"OPNsense is unreachable: analysis unavailable.","fw.not_an_ip":"Firewall analysis needs an IP address.","fw.what_can":"What the device can do \xB7 in evaluation order","fw.col.rule":"Rule (OPNsense description)","fw.col.to":"To","fw.col.today":"Today","fw.pass":"allowed","fw.block":"blocked","fw.own_rule":"rule specific to this device","fw.probable":"probable","fw.floating":"floating","fw.blocked_n":"{n} blocked","fw.default_deny":"No rule matches afterwards: blocked by default.","fw.unreachable":"{n} following rule(s) never reached.","fw.redundant":"Rule(s) hidden because a later rule covers them: {list}","fw.who":"Who can reach it","fw.same_network":"same network (not filtered)","fw.partial":"partial","fw.nat":"NAT forward: port {ext} \u2192 {target}","fw.recent":"Recent blocks","fw.col.time":"Time","fw.col.dest":"Destination","fw.col.name":"Name","fw.col.by":"Blocked by","fw.default_rule":"default / automatic rule","fw.no_blocks":"No recent block.","fw.readonly":"Read-only: nothing is changed on the router. Names come from the router DNS log (probable).","fw.dest.any":"Internet / anywhere","fw.dest.router":"router ({ip})","fw.dest.private":"internal networks","fw.dest.network":"{name} network","fw.not":"anything but {x}","fw.reason.no_sequence":"order not guaranteed (no sequence number)","fw.reason.not_quick":"non-quick floating rule","fw.reason.tagged":"tagged rule","fw.reason.route_to":"policy routing","fw.reason.interface_not":"inverted interfaces","fw.reason.ports_unresolved":"unresolved ports","fw.reason.alias_url":"URL alias","fw.reason.alias_urltable":"URL alias","fw.reason.alias_urljson":"URL alias","fw.reason.alias_geoip":"GeoIP alias","fw.reason.alias_mac":"MAC alias","fw.reason.alias_asn":"ASN alias","fw.reason.alias_dynipv6host":"dynamic IPv6 alias","fw.reason.alias_authgroup":"group alias","fw.reason.alias_internal":"internal alias","fw.reason.alias_unresolved":"unresolved alias","fw.reason.unknown_token":"unknown address","fw.reason.source_unresolved":"undetermined source","fw.reason.destination_unresolved":"undetermined destination","hist.presence":"Presence \xB7 24 h","hist.latency":"Latency \xB7 24 h","hist.none":"No presence or latency sensor for this device.","ne.add":"+ Add a device","ne.import_opnsense":"Import everything from OPNsense","ne.add_title":"Add a device","ne.edit_title":"Edit \xB7 {name}","ne.create":"Create","ne.f.name":"Name","ne.f.host":"IP address or host name","ne.f.vlan":"Network (VLAN)","ne.f.mac":"MAC address","ne.f.switch":"Switch","ne.f.port":"Switch port","ne.f.port_source":"Pin the port (manual)","ne.f.area":"Area","ne.f.kind":"Kind","ne.f.parent":"Parent device (access point, repeater)","ne.f.model":"Model","ne.f.notes":"Notes","ne.probe":"Test","ne.probing":"Testing\u2026","ne.answers":"answers \xB7 {ms} ms","ne.no_answer":"no answer","ne.vlan_detected":"detected from the IP","ne.mac_detected":"read on the router ({source})","ne.port_detected":"read on the switch","ne.port_via":"{port} (via {via})","ne.sensors":"Sensors to create","ne.s.ping":"Presence (ping)","ne.s.latency":"Latency","ne.s.tcp":"TCP port","ne.s.alert":"Alert when offline for more than (min)","ne.interval":'Interval: {s} s \xB7 grouped under an HA device "{name}".',"ne.devices":"Declared devices","ne.col.name":"Name","ne.col.ip":"IP","ne.col.vlan":"VLAN","ne.col.port":"Port","ne.col.sensors":"Sensors","ne.edit":"Edit","ne.delete":"Delete","ne.s.short.ping":"presence","ne.s.short.latency":"latency","ne.s.short.tcp":"port {p}","ne.s.short.alert":"alert","ne.vlans":"VLANs","ne.vlan_add":"+ VLAN","ne.v.name":"Name","ne.v.tag":"Tag","ne.v.subnet":"Subnet","ne.v.color":"Colour","ne.v.role":"Role","ne.v.access":"Access","ne.uplink":"Internet link","ne.u.isp":"Internet provider","ne.u.box_name":"Box","ne.u.box_ip":"Box IP","ne.u.public_ip":"Public IP","ne.save_network":"Save","ne.import_title":"Import from OPNsense","ne.import_hint":'Nothing is written before "Import selection". Devices already declared are skipped; only the presence sensor is enabled.',"ne.import_apply":"Import selection","ne.import_none":"OPNsense has nothing to import.","ne.exists":"already declared","ne.loading":"Reading OPNsense\u2026","ne.required":"Name is required."},di={fr:li,en:ue};function me(i){const e=i?.locale?.language??i?.language??(typeof navigator<"u"?navigator.language:"fr");return String(e||"fr").split("-")[0].toLowerCase()==="fr"?"fr":"en"}function T(i){const e=di[i]??ue;return(t,n)=>{let s=e[t]??ue[t]??t;if(n)for(const[a,o]of Object.entries(n))s=s.split(`{${a}}`).join(o==null?"?":String(o));return s}}const V=At`
  :host {
    display: block;
    --him-ok: var(--success-color, #2e9d57);
    --him-warn: var(--warning-color, #d98a00);
    --him-bad: var(--error-color, #d23c3c);
    --him-accent: var(--primary-color, #0b6bcb);
    --him-muted: var(--secondary-text-color, #68737d);
    --him-line: var(--divider-color, #d7dce1);
    --him-card: var(--card-background-color, #fff);
    --him-ink: var(--primary-text-color, #1c2126);
    --him-rail: color-mix(in srgb, var(--him-ink) 8%, var(--him-card));
    --him-mod: color-mix(in srgb, var(--him-ink) 3%, var(--him-card));
    --him-diff: color-mix(in srgb, var(--him-accent) 18%, var(--him-card));
    --him-diff-ink: color-mix(in srgb, var(--him-accent) 75%, var(--him-ink));
    --him-dev: color-mix(in srgb, #f2b233 24%, var(--him-card));
    --him-dev-ink: color-mix(in srgb, #8a5c00 70%, var(--him-ink));
    --him-indent: 22px;
    --him-mono: ui-monospace, 'Roboto Mono', SFMono-Regular, Menlo, monospace;
  }
  ha-card {
    overflow: hidden;
    color: var(--him-ink);
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 14px 16px 8px;
    flex-wrap: wrap;
  }
  .title {
    font-size: 18px;
    font-weight: 500;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .head-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .body {
    padding: 4px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .seg {
    display: inline-flex;
    border: 1px solid var(--him-line);
    border-radius: 8px;
    overflow: hidden;
    font-size: 13px;
  }
  .seg button {
    all: unset;
    cursor: pointer;
    padding: 4px 10px;
    color: var(--him-muted);
  }
  .seg button[aria-pressed='true'],
  .seg button[aria-selected='true'] {
    background: var(--him-accent);
    color: var(--text-primary-color, #fff);
  }
  button:focus-visible,
  .seg button:focus-visible,
  [tabindex]:focus-visible,
  select:focus-visible,
  input:focus-visible,
  textarea:focus-visible {
    outline: 2px solid var(--him-accent);
    outline-offset: 2px;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--him-line);
    border-radius: 99px;
    padding: 3px 10px;
    font-size: 13px;
    background: var(--him-card);
    color: var(--him-ink);
  }
  button.chip {
    cursor: pointer;
    font: inherit;
    font-size: 13px;
  }
  .chip.warn {
    border-color: var(--him-warn);
    color: color-mix(in srgb, var(--him-warn) 70%, var(--him-ink));
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--him-ok);
    flex: none;
    display: inline-block;
  }
  .dot.warn {
    background: var(--him-warn);
  }
  .dot.bad {
    background: var(--him-bad);
  }
  .dot.off {
    background: var(--him-muted);
  }
  .num {
    font-variant-numeric: tabular-nums;
    font-family: var(--him-mono);
    font-size: 12.5px;
  }
  .muted {
    color: var(--him-muted);
  }
  .small {
    font-size: 12px;
  }
  h3 {
    font-size: 13px;
    margin: 6px 0 0;
    color: var(--him-muted);
    font-weight: 500;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .empty {
    padding: 12px;
    color: var(--him-muted);
    border: 1px dashed var(--him-line);
    border-radius: 10px;
  }
  .banner {
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 13px;
    background: color-mix(in srgb, var(--him-bad) 12%, var(--him-card));
    border: 1px solid color-mix(in srgb, var(--him-bad) 45%, var(--him-card));
  }
  .banner.info {
    background: color-mix(in srgb, var(--him-accent) 10%, var(--him-card));
    border-color: color-mix(in srgb, var(--him-accent) 40%, var(--him-card));
  }
  .btn {
    border: 1px solid var(--him-line);
    border-radius: 7px;
    padding: 5px 10px;
    font: inherit;
    font-size: 13px;
    background: var(--him-card);
    color: var(--him-ink);
    cursor: pointer;
    min-height: 30px;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .btn.pri {
    background: var(--him-accent);
    border-color: var(--him-accent);
    color: var(--text-primary-color, #fff);
  }
  .btn.danger {
    color: var(--him-bad);
    border-color: color-mix(in srgb, var(--him-bad) 50%, var(--him-line));
  }
  .icon-btn {
    all: unset;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--him-muted);
  }
  .icon-btn:hover {
    background: color-mix(in srgb, var(--him-ink) 8%, transparent);
  }
  .btns {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  select.sel,
  input.inp,
  textarea.inp {
    border: 1px solid var(--him-line);
    border-radius: 6px;
    padding: 6px 8px;
    background: var(--him-card);
    color: var(--him-ink);
    font: inherit;
    font-size: 13px;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }
  input.inp[type='color'] {
    padding: 1px;
    height: 30px;
  }
  input.inp[type='checkbox'] {
    width: auto;
  }
  textarea.inp {
    font-family: var(--him-mono);
    font-size: 12px;
  }
  .f {
    display: flex;
    flex-direction: column;
    gap: 3px;
    font-size: 13px;
  }
  .f > label,
  .f > .lbl {
    font-size: 11.5px;
    color: var(--him-muted);
  }
  .hint {
    font-size: 11.5px;
  }
  .hint.ok {
    color: var(--him-ok);
  }
  .hint.bad {
    color: var(--him-bad);
  }
  .ent {
    font-family: var(--him-mono);
    font-size: 11.5px;
    color: var(--him-muted);
    word-break: break-all;
  }
  button.ent {
    all: unset;
    font-family: var(--him-mono);
    font-size: 11.5px;
    color: var(--him-accent);
    cursor: pointer;
    word-break: break-all;
  }
  .detail {
    border: 1px solid var(--him-line);
    border-radius: 10px;
    padding: 10px 12px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 14px;
    font-size: 13.5px;
    margin: 0;
  }
  .detail dt {
    color: var(--him-muted);
  }
  .detail dd {
    margin: 0;
    min-width: 0;
  }
  .scroll {
    overflow-x: auto;
  }
  table.tbl {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .tbl td,
  .tbl th {
    border-bottom: 1px solid var(--him-line);
    padding: 5px 6px;
    text-align: left;
    vertical-align: top;
  }
  .tbl th {
    color: var(--him-muted);
    font-weight: 500;
    font-size: 11.5px;
  }
  .tbl tr.hl {
    background: color-mix(in srgb, var(--him-ok) 10%, transparent);
  }
  .act {
    display: inline-flex;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
  }
  .act.pass {
    background: var(--him-ok);
  }
  .act.block {
    background: var(--him-bad);
  }
  .badge {
    display: inline-block;
    font-size: 10.5px;
    border-radius: 99px;
    padding: 0 6px;
    border: 1px solid var(--him-line);
    color: var(--him-muted);
    white-space: nowrap;
  }
  .badge.warn {
    border-color: var(--him-warn);
    color: color-mix(in srgb, var(--him-warn) 70%, var(--him-ink));
  }
  .warnlist {
    margin: 0;
    padding-left: 18px;
    font-size: 13px;
  }
  .warnlist li.warning::marker {
    color: var(--him-warn);
  }

  /* electrical board */
  .board {
    background: var(--him-rail);
    border-radius: 10px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .rail {
    /* one grid column per DIN slot; modules span their width */
    --him-slot: 60px;
    /* below this a slot cannot show "C10": the rail scrolls instead */
    --him-slot-min: 48px;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: auto;
    justify-content: start;
    gap: 3px;
    align-items: stretch;
    background: var(--him-card);
    border-radius: 7px;
    padding: 5px;
    overflow-x: auto;
    min-height: 86px;
  }
  .rl {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 10px;
    color: var(--him-muted);
    padding: 0 2px;
    flex: none;
    text-align: center;
  }
  .m {
    all: unset;
    box-sizing: border-box;
    min-width: 0;
    min-height: 84px;
    border: 1px solid var(--him-line);
    border-radius: 5px;
    background: var(--him-mod);
    padding: 4px 5px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    color: var(--him-ink);
  }
  .m b {
    font-size: 13px;
    line-height: 1.15;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    /* break between words; split a word only when it cannot fit at all */
    overflow-wrap: break-word;
    padding-right: 8px;
  }
  /* ratings ("C10", "40A") never break */
  .m:not(.s) b {
    white-space: nowrap;
    overflow-wrap: normal;
  }
  /* device titles are words ("Shelly", "Prise"), not short ratings */
  .m.s b {
    font-size: 12px;
    letter-spacing: -0.01em;
    overflow-wrap: normal;
  }
  .m.s:not(:has(.led)) b {
    padding-right: 0;
  }
  .m small {
    font-size: 10.5px;
    line-height: 1.15;
    color: var(--him-muted);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    hyphens: auto;
    overflow-wrap: anywhere;
  }
  .m .w {
    white-space: nowrap;
    margin-top: auto;
    font-family: var(--him-mono);
    font-size: 11px;
    font-weight: 500;
  }
  .m .led {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--him-muted);
  }
  .m .led.on {
    background: var(--him-ok);
  }
  .m .wmark {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--him-warn);
  }
  .m.d {
    background: var(--him-diff);
    color: var(--him-diff-ink);
    border-color: transparent;
  }
  .m.d small {
    color: var(--him-diff-ink);
  }
  .m.s {
    background: var(--him-dev);
    color: var(--him-dev-ink);
    border-color: transparent;
  }
  .m.s small {
    color: var(--him-dev-ink);
  }
  .m.u {
    border-style: dashed;
    border-color: color-mix(in srgb, var(--him-ink) 35%, var(--him-card));
  }
  .m.sp {
    background: transparent;
    border-style: dotted;
  }
  /* free DIN slot of a rail whose width is known */
  .m.free {
    background: transparent;
    border: 1px dashed color-mix(in srgb, var(--him-line) 60%, transparent);
    cursor: default;
  }
  .rail.over {
    box-shadow: inset 0 0 0 2px var(--him-warn);
  }
  .rail .cell {
    display: flex;
    min-width: 0;
  }
  .rail .cell > .m {
    width: 100%;
  }
  .rail-meta {
    font-size: 11px;
    color: var(--him-muted);
    margin: -2px 0 2px 4px;
  }
  .rail-meta.over {
    color: var(--him-warn);
    font-weight: 500;
  }
  .add.add-sp {
    font-size: 16px;
  }
  .m.sel {
    outline: 2px solid var(--him-accent);
    outline-offset: 1px;
  }
  .m.drag-over {
    box-shadow: -3px 0 0 var(--him-accent);
  }
  .add {
    all: unset;
    box-sizing: border-box;
    border: 1px dashed var(--him-accent);
    color: var(--him-accent);
    min-width: 0;
    min-height: 84px;
    border-radius: 5px;
    font-size: 20px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .spark {
    width: 100%;
    height: 42px;
    display: block;
  }
  .photo-link {
    font-size: 13px;
  }

  /* network */
  .topo {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13.5px;
  }
  .tn {
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border: 1px solid var(--him-line);
    border-radius: 8px;
    background: var(--him-card);
    min-width: 0;
  }
  button.tn {
    cursor: pointer;
  }
  button.tn:hover {
    border-color: var(--him-accent);
  }
  .tn .name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tn .ip {
    margin-left: auto;
    color: var(--him-muted);
    white-space: nowrap;
  }
  .tn.port-head {
    background: transparent;
    border-style: dashed;
  }
  @media (max-width: 600px) {
    :host {
      --him-indent: 10px;
    }
    .tn {
      flex-wrap: wrap;
      row-gap: 2px;
    }
    .tn .name {
      white-space: normal;
      flex: 1 1 calc(100% - 20px);
    }
    .tn .ip {
      margin-left: 17px;
    }
  }
  .portgrp {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .vgrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 8px;
  }
  .vc {
    border: 1px solid var(--him-line);
    border-left: 5px solid var(--vc, var(--him-muted));
    border-radius: 8px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
  }
  .vc b {
    font-size: 14px;
  }
  .vc .row {
    all: unset;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    border-radius: 4px;
  }
  .vc .row:hover {
    background: color-mix(in srgb, var(--him-ink) 6%, transparent);
  }
  .sw {
    background: #2b3137;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    gap: 10px;
    overflow-x: auto;
  }
  .sw-copper {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(2, 30px);
    gap: 4px;
    flex: 1;
    min-width: max-content;
  }
  .sw-sfp {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(2, 30px);
    gap: 4px;
    padding-left: 10px;
    border-left: 1px solid #4a535c;
  }
  .p {
    all: unset;
    box-sizing: border-box;
    background: #3a424a;
    border-radius: 3px;
    height: 30px;
    min-width: 30px;
    position: relative;
    color: #cfd6dc;
    font-size: 9.5px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 2px;
    font-family: var(--him-mono);
    cursor: pointer;
  }
  .p.sfp {
    background: #30363c;
    border: 1px solid #59626b;
    min-width: 36px;
  }
  .p::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 5px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #59626b;
  }
  .p.up::before {
    background: #47d17c;
  }
  .p.poe::after {
    content: '';
    position: absolute;
    top: 4px;
    right: 5px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f2b233;
  }
  .p.sel {
    outline: 2px solid #4fa3f7;
  }
  .p:focus-visible {
    outline: 2px solid #4fa3f7;
  }

  /* overlays */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 10;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 4vh 8px;
    overflow-y: auto;
  }
  .sheet {
    background: var(--him-card);
    color: var(--him-ink);
    border-radius: 12px;
    width: min(760px, 100%);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  .sheet .head {
    position: sticky;
    top: 0;
    background: var(--him-card);
    z-index: 1;
  }

  /* editor layout */
  .ed {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 12px;
    align-items: start;
  }
  .ed.wide {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
  @media (max-width: 680px) {
    .ed,
    .ed.wide {
      grid-template-columns: 1fr;
    }
  }
  .form {
    border: 1px solid var(--him-line);
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 13px;
    min-width: 0;
  }
  .grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .tog {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .toolbar {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    align-items: center;
  }
  .yaml {
    max-height: 50vh;
    overflow: auto;
    background: var(--him-mod);
    border: 1px solid var(--him-line);
    border-radius: 8px;
    padding: 8px;
    font-family: var(--him-mono);
    font-size: 12px;
    white-space: pre;
    margin: 0;
  }
  .timeline {
    display: flex;
    height: 14px;
    border-radius: 4px;
    overflow: hidden;
    background: var(--him-line);
  }
  .timeline span.on {
    background: var(--him-ok);
  }
  .timeline span.off {
    background: var(--him-bad);
  }
  .timeline span.na {
    background: var(--him-line);
  }
  .photo-full {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 0 0 12px 12px;
  }
  @media (prefers-reduced-motion: no-preference) {
    .m,
    .p,
    .btn {
      transition: outline-color 0.15s;
    }
  }
`;function y(i,e,t){i.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}function Ye(i,e){y(i,"hass-more-info",{entityId:e})}function N(i,e){y(i,"hass-notification",{message:e})}let _e=null;function Qe(){return customElements.get("ha-selector")?Promise.resolve():_e||(_e=(async()=>{try{const i=await window.loadCardHelpers?.();if(!i)return;await(await i.createCardElement({type:"entities",entities:[]}))?.constructor?.getConfigElement?.(),await customElements.get("hui-tile-card")?.getConfigElement?.()}catch{}})(),_e)}function Xe(){return!!customElements.get("ha-selector")}function et(i,e,t,n,s,a){if(Xe()){const p=s?{domain:"sensor",device_class:s}:void 0;return r`<div class="f">
      <ha-selector
        .hass=${i}
        .selector=${{entity:p?{filter:p}:{}}}
        .value=${n??""}
        .label=${t}
        @value-changed=${c=>a(c.detail?.value||null)}
      ></ha-selector>
    </div>`}const o=Object.keys(i.states).filter(p=>!s||i.states[p]?.attributes?.device_class===s).sort();return r`<div class="f">
    <label for=${e}>${t}</label>
    <input
      class="inp"
      id=${e}
      list=${`${e}-list`}
      .value=${n??""}
      @change=${p=>a(p.target.value.trim()||null)}
    />
    <datalist id=${`${e}-list`}>${o.map(p=>r`<option value=${p}></option>`)}</datalist>
  </div>`}function fe(i,e){return e.filter(t=>!!t).map(t=>i?.areas?.[t]?.name??t)}function be(i,e,t,n,s,a){const o=Array.isArray(n)?n:n?[n]:[];if(Xe())return r`<div class="f">
      <ha-selector
        .hass=${i}
        .selector=${{area:{multiple:s}}}
        .value=${s?o:o[0]??""}
        .label=${t}
        @value-changed=${c=>{const h=c.detail?.value;a(Array.isArray(h)?h:h?[h]:[])}}
      ></ha-selector>
    </div>`;const p=Object.values(i.areas??{}).sort((c,h)=>c.name.localeCompare(h.name));return r`<div class="f">
    <label for=${e}>${t}</label>
    <select
      class="sel"
      id=${e}
      ?multiple=${s}
      @change=${c=>{const h=c.target;a(Array.from(h.selectedOptions).map(l=>l.value).filter(Boolean))}}
    >
      ${s?d:r`<option value="" ?selected=${!o.length}>—</option>`}
      ${p.map(c=>r`<option value=${c.area_id} ?selected=${o.includes(c.area_id)}>${c.name}</option>`)}
    </select>
  </div>`}function f(i,e,t,n,s={}){return r`<div class="f">
    <label for=${i}>${e}</label>
    <input
      class="inp"
      id=${i}
      type=${s.type??"text"}
      placeholder=${s.placeholder??""}
      .value=${t==null?"":String(t)}
      @input=${a=>n(a.target.value)}
      @blur=${()=>s.onBlur?.()}
    />
    ${s.hint??d}
  </div>`}function g(i,e,t,n,s){return r`<div class="f">
    <label for=${i}>${e}</label>
    <select class="sel" id=${i} @change=${a=>s(a.target.value)}>
      ${n.map(a=>r`<option value=${String(a.value)} ?selected=${String(a.value)===String(t??"")}>${a.label}</option>`)}
    </select>
  </div>`}async function ci(i){try{return await navigator.clipboard.writeText(i),!0}catch{const e=document.createElement("textarea");e.value=i,document.body.appendChild(e),e.select();const t=document.execCommand?.("copy")??!1;return e.remove(),t}}function hi(i,e){if(!i)return"\u2014";const t=new Date(i);return Number.isNaN(t.getTime())?i:t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}function pi(i,e){if(!i)return"\u2014";const t=new Date(i);return Number.isNaN(t.getTime())?i:t.toLocaleString(e,{dateStyle:"short",timeStyle:"short"})}const ve=class extends k{constructor(){super(),this._loaded=!1,this._config={type:"custom:home-infra-map-card"},this._boards=[]}setConfig(e){this._config={...e&&typeof e=="object"?e:{type:"custom:home-infra-map-card"}}}updated(){!this._loaded&&this.hass&&(this._loaded=!0,pe(this.hass).then(e=>this._boards=e.model.boards).catch(()=>this._boards=[]))}_set(e,t){const n={...this._config};t===""?delete n[e]:n[e]=t,this._config=n,y(this,"config-changed",{config:this._config})}render(){const e=T(me(this.hass)),t=this._config,n=(s,a,o,p)=>r`<div class="f">
        <label for=${`cfg-${s}`}>${a}</label>
        <select class="sel" id=${`cfg-${s}`} @change=${c=>this._set(s,c.target.value)}>
          ${p.map(([c,h])=>r`<option value=${c} ?selected=${(o??"")===c}>${h}</option>`)}
        </select>
      </div>`;return r`<div class="form" style="border:0;padding:0">
      <div class="f">
        <label for="cfg-title">Titre / Title</label>
        <input class="inp" id="cfg-title" .value=${t.title??""} @change=${s=>this._set("title",s.target.value)} />
      </div>
      ${n("view","Vue / View",t.view??"electricity",[["electricity",e("view.electricity")],["network",e("view.network")]])}
      ${this._boards.length?n("board",e("el.board"),t.board,[["","\u2014"],...this._boards.map(s=>[s.id,s.name])]):d}
      ${n("network_view",`${e("view.network")}`,t.network_view??"topology",[["topology",e("nview.topology")],["vlan",e("nview.vlan")],["switch",e("nview.switch")]])}
    </div>`}};ve.styles=V,ve.properties={hass:{attribute:!1},_config:{state:!0},_boards:{state:!0}};let ui=ve;function D(i,e,t){return i[e]?.find(n=>n.key===t)?.entity_id??null}function Q(i,e,t){const n=D(e.entities,i.id,"online"),s=n&&t?t.states[n]:void 0;if(s)return s.state==="on"?"online":s.state==="off"?"offline":"unknown";const a=e.live.ping[i.id];return!a||a.alive===null||a.alive===void 0?"unknown":a.alive?"online":"offline"}function tt(i,e,t){const n=D(e.entities,i.id,"latency"),s=n&&t?t.states[n]:void 0;if(s){const a=Number(s.state);if(Number.isFinite(a))return a}return e.live.ping[i.id]?.rtt_ms??null}function mi(i,e){const t=new Map;for(const n of i)n.switch_id!==e||n.port===null||n.parent_device_id||(t.has(n.port)||t.set(n.port,[]),t.get(n.port).push(n));return[...t.entries()].sort((n,s)=>n[0]-s[0]).map(([n,s])=>({port:n,devices:X(s)}))}const it={router:0,switch:1,ap:2,server:3,nas:4};function X(i){return i.slice().sort((e,t)=>(it[e.kind]??9)-(it[t.kind]??9)||e.name.localeCompare(t.name))}function _i(i,e){return X(i.filter(t=>t.parent_device_id===e))}function fi(i,e){const t=new Set(e.map(n=>n.id));return X(i.filter(n=>!n.parent_device_id&&!(n.switch_id&&t.has(n.switch_id)&&n.port!==null)))}function ee(i){const e=i.split(".");return e.length===4&&e.every(t=>/^\d+$/.test(t))?e.map(t=>t.padStart(3,"0")).join("."):i}function bi(i,e){let t=0,n=0;for(const s of i.model.network.devices){if(!s.monitor.ping)continue;const a=Q(s,i,e);a==="online"&&(t+=1),a==="offline"&&(n+=1)}return{online:t,offline:n}}function vi(i,e,t,n=[]){const s=new Set(n.map(a=>a.toLowerCase()));return X(i.filter(a=>a.switch_id===e.id&&a.port===t||a.mac&&s.has(a.mac.toLowerCase())))}function gi(){return{columns:"full",rows:"auto",min_columns:6,min_rows:4}}function $i(){return 8}function nt(i){if(!i)return[];const e=[];for(const t of i){const n=t.s??t.state,s=Number(n),a=t.lu??t.lc??(t.last_updated?Date.parse(t.last_updated)/1e3:void 0);!Number.isFinite(s)||a===void 0||e.push({t:Number(a)*1e3,v:s})}return e}function st(i,e,t,n=200,s=42){if(!i.length||t<=e)return{line:"",area:""};const a=Math.max(...i.map(m=>m.v),1),o=m=>(Math.min(Math.max(m,e),t)-e)/(t-e)*n,p=m=>s-2-Math.max(m,0)/a*(s-4),c=i.map(m=>`${o(m.t).toFixed(1)} ${p(m.v).toFixed(1)}`),h=i[i.length-1];c.push(`${n} ${p(h.v).toFixed(1)}`);const l=`M${c.join(" L")}`,u=`${l} L${n} ${s} L${o(i[0].t).toFixed(1)} ${s}Z`;return{line:l,area:u}}function wi(i,e,t){if(!i?.length)return[];const n=[],s=i.map(a=>({t:Number(a.lu??a.lc??Date.parse(a.last_updated)/1e3)*1e3,s:String(a.s??a.state)})).filter(a=>Number.isFinite(a.t)).sort((a,o)=>a.t-o.t);return s.forEach((a,o)=>{const p=Math.max(a.t,e),c=o+1<s.length?s[o+1].t:t;c<=p||n.push({from:p,to:c,on:a.s==="on"?!0:a.s==="off"?!1:null})}),n}function x(i,e,t,...n){(i==="error"?console.error:i==="warn"?console.warn:console.info)(`%cHOME-INFRA-MAP%c [${e}] ${t}`,"color:#0b6bcb;font-weight:bold","",...n)}const at=[],rt=new Map,yi=3;function q(i,e){at.push([i,e]),customElements.get(i)||customElements.define(i,e)}function ki(){let i=0;for(const[e,t]of at){if(customElements.get(e))continue;const n=rt.get(e)??0;if(!(n>=yi)){rt.set(e,n+1);try{customElements.define(e,class extends t{}),i+=1,x("warn","register","re-registered %s at t=%dms: the element registry was replaced",e,Math.round(performance.now()))}catch(s){x("error","register","cannot re-register %s: %o",e,s)}}}return i}function xi(i){let e=0;const t=n=>{if(n.localName==="hui-error-card"){const s=n,a=s._config??s.config;`${a?.message??""} ${a?.error??""}`.includes(i)&&(n.dispatchEvent(new CustomEvent("ll-rebuild",{bubbles:!0,composed:!0})),e+=1);return}for(const s of[...n.shadowRoot?.children??[],...n.children])t(s)};return document.body&&t(document.body),e}function Ai(i){for(const e of[0,50,150,400,1e3,2e3,4e3])window.setTimeout(()=>{try{ki();const t=xi(i);t&&x("warn","register","%d error card(s) rebuilt after %dms",t,e)}catch(t){x("error","register","repair failed: %o",t)}},e)}const ot="0.2.0";function lt(i){return i==="online"?"dot":i==="offline"?"dot bad":"dot off"}function dt(i,e){if(!i.monitor.ping)return r`<span class="dot off" aria-hidden="true"></span>`;const t=Q(i,e.payload,e.hass);return r`<span class=${lt(t)} role="img" aria-label=${t==="online"?e.t("ds.online"):t==="offline"?e.t("ds.offline"):e.t("ds.unknown")}></span>`}function Si(i,e){const t=[i.host];if(i.monitor.ping){const n=Q(i,e.payload,e.hass);if(n==="offline")t.push(e.t("net.offline_short"));else if(n==="online"){const s=tt(i,e.payload,e.hass);s!==null&&t.push(`${Math.round(s*10)/10} ms`)}}return t.filter(Boolean).join(" \xB7 ")}function ct(i,e,t,n=""){return r`<button
    class="tn"
    style=${`margin-left:calc(var(--him-indent) * ${t})`}
    data-device-id=${i.id}
    @click=${()=>e.onOpenDevice(i.id)}
  >
    ${dt(i,e)}
    <span class="name">${i.name}${n?r`<span class="muted"> · ${n}</span>`:d}</span>
    <span class="ip num">${Si(i,e)}</span>
  </button>`}function Ci(i,e){let t;switch(i.kind){case"any":t=e("fw.dest.any");break;case"router":t=e("fw.dest.router",{ip:i.value});break;case"private":t=e("fw.dest.private");break;case"network":t=e("fw.dest.network",{name:i.label||i.value});break;case"address":t=i.label?`${i.label} (${i.value})`:i.value;break;case"alias":t=i.value;break;default:t=i.value||i.label}return i.not?e("fw.not",{x:t}):t}function ge(i,e){return i.map(t=>e(`fw.reason.${t}`)).join(", ")}function Pi(i,e,t,n){if(n)return r`<div class="banner">${e("card.error",{error:n})}</div>`;if(!i)return r`<div class="muted">${e("fw.loading")}</div>`;if(!i.available){const o=i.reason==="unavailable"?"fw.unavailable":i.reason==="not_an_ip"?"fw.not_an_ip":"fw.not_configured";return r`<div class="empty">${e(o)}</div>`}const s=i.outbound,a=i.rule_hits??{};return r`
    <h3>${e("fw.what_can")}</h3>
    <div class="scroll">
      <table class="tbl fw-out">
        <thead>
          <tr><th aria-label=${e("fw.col.rule")}></th><th>${e("fw.col.rule")}</th><th>${e("fw.col.to")}</th><th>${e("fw.col.today")}</th></tr>
        </thead>
        <tbody>
          ${s.rules.map(o=>{const p=o.action==="pass",c=o.uuid?a[o.uuid]:void 0,h=Ci(o.destination,e)+(o.ports?`:${o.ports}`:"");return r`<tr class=${o.specific?"hl":""} data-uuid=${o.uuid??""} data-action=${o.action}>
              <td><span class=${`act ${p?"pass":"block"}`} role="img" aria-label=${e(p?"fw.pass":"fw.block")}>${p?"\u2713":"\u2715"}</span></td>
              <td>
                ${o.specific?r`<b class="desc">${o.description}</b> <span class="ent">· ${e("fw.own_rule")}</span>`:r`<span class="desc">${o.description}</span>`}
                ${o.floating?r` <span class="badge">${e("fw.floating")}</span>`:d}
                ${o.probable?r` <span class="badge warn" title=${ge(o.reasons,e)}>${e("fw.probable")}</span>`:d}
                ${o.probable?r`<div class="muted small">${ge(o.reasons,e)}</div>`:d}
              </td>
              <td class="num">${h}${o.protocol!=="any"?r` <span class="muted">${o.protocol}</span>`:d}</td>
              <td class="num">
                ${c?p?String(c):r`<span style="color:var(--him-warn)">${e("fw.blocked_n",{n:c})}</span>`:"\u2014"}
              </td>
            </tr>`})}
        </tbody>
      </table>
    </div>
    ${s.default_deny?r`<div class="muted small">${e("fw.default_deny")}</div>`:d}
    ${s.unreachable_count?r`<div class="muted small">${e("fw.unreachable",{n:s.unreachable_count})}</div>`:d}
    ${s.redundant.length?r`<div class="muted small">${e("fw.redundant",{list:s.redundant.map(o=>`\xAB ${o.description} \xBB`).join(", ")})}</div>`:d}
    <h3>${e("fw.who")}</h3>
    <div class="chips fw-in">
      ${(i.inbound??[]).map(o=>{const p=o.verdict==="allowed"?"dot":o.verdict==="blocked"?"dot bad":o.verdict==="partial"?"dot warn":"dot off",c=[o.rule?.description,o.ports,o.probable?ge(o.reasons,e):""].filter(Boolean).join(" \xB7 ");return r`<span class="chip" title=${c} data-verdict=${o.verdict}>
          <span class=${p}></span>${o.label}
          ${o.verdict==="partial"?r`<span class="muted small">${e("fw.partial")}${o.ports?` ${o.ports}`:""}</span>`:d}
          ${o.verdict==="same_network"?r`<span class="muted small">${e("fw.same_network")}</span>`:d}
          ${o.probable?r`<span class="badge warn">${e("fw.probable")}</span>`:d}
        </span>`})}
    </div>
    ${(i.nat??[]).map(o=>r`<div class="muted small">${e("fw.nat",{ext:o.external_port||"?",target:o.target_port||o.external_port||"?"})}${o.description?` \xB7 ${o.description}`:""}</div>`)}
    <h3>${e("fw.recent")}</h3>
    ${(i.blocks??[]).length?r`<div class="scroll">
          <table class="tbl fw-blocks">
            <thead><tr><th>${e("fw.col.time")}</th><th>${e("fw.col.dest")}</th><th>${e("fw.col.name")}</th><th>${e("fw.col.by")}</th></tr></thead>
            <tbody>
              ${(i.blocks??[]).map(o=>r`<tr>
                  <td class="num">${hi(o.time,t)}</td>
                  <td class="num">${o.destination}${o.port?`:${o.port}`:""}</td>
                  <td>${o.dns_name??"\u2014"}</td>
                  <td>${o.rule??r`<span class="muted">${e("fw.default_rule")}</span>`}</td>
                </tr>`)}
            </tbody>
          </table>
        </div>`:r`<div class="muted small">${e("fw.no_blocks")}</div>`}
    <p class="muted small">${e("fw.readonly")}</p>
  `}const $e=class extends k{constructor(){super(),this._loadedFw=null,this._loadedHist=null,this._keyHandler=e=>{e.key==="Escape"&&this._close()},this.tab="info",this.deviceId=null,this._report=null,this._history=null}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keyHandler)}disconnectedCallback(){window.removeEventListener("keydown",this._keyHandler),super.disconnectedCallback()}get _device(){return this.payload?.model.network.devices.find(e=>e.id===this.deviceId)}get _t(){return T(this._lang)}get _lang(){return(this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en"}updated(e){if(e.has("deviceId")&&(this._report=null,this._history=null,this._loadedFw=null,this._loadedHist=null,this.renderRoot.querySelector('.sheet [role="tab"][aria-selected="true"]')?.focus()),this.tab==="firewall"&&this.hass&&this.deviceId&&this._loadedFw!==this.deviceId&&(this._loadedFw=this.deviceId,this._fwError=void 0,ii(this.hass,this.deviceId).then(t=>this._report=t).catch(t=>this._fwError=w(t))),this.tab==="history"&&this.hass&&this.payload&&this.deviceId&&this._loadedHist!==this.deviceId){this._loadedHist=this.deviceId;const t=["online","latency"].map(n=>D(this.payload.entities,this.deviceId,n)).filter(n=>!!n);Je(this.hass,t).then(n=>this._history=n).catch(()=>this._history={})}}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_setTab(e){this.tab=e}_onTabKey(e){const t=["info","firewall","history"],n=t.indexOf(this.tab);(e.key==="ArrowRight"||e.key==="ArrowLeft")&&(e.preventDefault(),this.tab=t[(n+(e.key==="ArrowRight"?1:t.length-1))%t.length],this.updateComplete.then(()=>this.renderRoot.querySelector('.sheet [role="tab"][aria-selected="true"]')?.focus()))}render(){const e=this._device,t=this._t;if(!e||!this.payload)return r``;const n=this.payload,s=e.monitor.ping?Q(e,n,this.hass):"unknown",a=tt(e,n,this.hass),o=n.model.network.vlans.find(l=>l.id===e.vlan_id),p=D(n.entities,e.id,"blocks"),c=p?Number(this.hass?.states[p]?.state):NaN,h=[["info",t("ds.tab.info")],["firewall",t("ds.tab.firewall")],["history",t("ds.tab.history")]];return r`<div class="overlay" @click=${l=>l.target===l.currentTarget&&this._close()}>
      <div class="sheet" role="dialog" aria-modal="true" aria-label=${e.name}>
        <div class="head">
          <span class="title">${e.name}</span>
          <div class="head-actions">
            <div class="seg" role="tablist" @keydown=${this._onTabKey}>
              ${h.map(([l,u])=>r`<button
                  role="tab"
                  aria-selected=${this.tab===l?"true":"false"}
                  tabindex=${this.tab===l?"0":"-1"}
                  @click=${()=>this._setTab(l)}
                >
                  ${u}
                </button>`)}
            </div>
            <button class="icon-btn" aria-label=${t("ds.close")} @click=${this._close}>✕</button>
          </div>
        </div>
        <div class="body">
          <div class="chips">
            ${e.monitor.ping?r`<span class="chip"><span class=${lt(s)}></span>${s==="online"?a!==null?t("ds.online_ms",{ms:Math.round(a*10)/10}):t("ds.online"):t(s==="offline"?"ds.offline":"ds.unknown")}</span>`:d}
            <span class="chip num">${[e.host,o?.name,e.port!==null?t("net.port",{n:e.port}):""].filter(Boolean).join(" \xB7 ")}</span>
            ${Number.isFinite(c)&&c>0?r`<span class="chip"><span class="dot warn"></span>${t("ds.blocks_today",{n:c})}</span>`:d}
          </div>
          ${this.tab==="info"?this._renderInfo(e):d}
          ${this.tab==="firewall"?Pi(this._report,t,this._lang,this._fwError):d}
          ${this.tab==="history"?this._renderHistory(e):d}
        </div>
      </div>
    </div>`}_renderInfo(e){const t=this._t,n=this.payload,s=n.model.network,a=s.vlans.find(h=>h.id===e.vlan_id),o=s.switches.find(h=>h.id===e.switch_id),p=s.devices.find(h=>h.id===e.parent_device_id),c=n.entities[e.id]??[];return r`<dl class="detail">
      <dt>${t("ds.ip")}</dt><dd class="num">${e.host||"\u2014"}</dd>
      <dt>${t("ds.mac")}</dt><dd class="num">${e.mac??"\u2014"}</dd>
      <dt>${t("ds.vlan")}</dt><dd>${a?`${a.name}${a.subnet?` \xB7 ${a.subnet}`:""}`:"\u2014"}</dd>
      <dt>${t("ds.port")}</dt>
      <dd>
        ${e.port!==null?r`${t("ds.port_value",{port:e.port,switch:o?.name??"?"})}
              <span class="muted small">
                · ${e.port_source==="manual"?t("ds.port_manual"):t("ds.port_auto")}
                ${e.last_seen_port_at?` \xB7 ${t("ds.last_seen",{date:pi(e.last_seen_port_at,this._lang)})}`:""}
              </span>`:"\u2014"}
      </dd>
      <dt>${t("ds.area")}</dt><dd>${fe(this.hass,[e.area_id]).join("")||"\u2014"}</dd>
      <dt>${t("ds.kind")}</dt><dd>${t(`kind.${e.kind}`)}${e.model?` \xB7 ${e.model}`:""}</dd>
      ${p?r`<dt>${t("ds.parent")}</dt><dd>${p.name}</dd>`:d}
      <dt>${t("ds.sensors")}</dt>
      <dd>
        ${c.length?c.map(h=>r`<button class="ent" @click=${()=>Ye(this,h.entity_id)}>${h.entity_id}</button><br />`):t("ds.no_sensor")}
      </dd>
      ${e.notes?r`<dt>${t("ds.notes")}</dt><dd style="white-space:pre-line">${e.notes}</dd>`:d}
    </dl>`}_renderHistory(e){const t=this._t,n=this.payload,s=D(n.entities,e.id,"online"),a=D(n.entities,e.id,"latency");if(!s&&!a)return r`<div class="empty">${t("hist.none")}</div>`;if(this._history===null)return r`<div class="muted">${t("card.loading")}</div>`;const o=Date.now(),p=o-24*3600*1e3,c=s?wi(this._history[s],p,o):[],h=a?nt(this._history[a]):[],{line:l,area:u}=st(h,p,o,200,60);return r`
      ${s?r`<h3>${t("hist.presence")}</h3>
            <div class="timeline" role="img" aria-label=${t("hist.presence")}>
              ${c.map(m=>r`<span class=${m.on===!0?"on":m.on===!1?"off":"na"} style=${`flex:${m.to-m.from}`}></span>`)}
            </div>`:d}
      ${a?r`<h3>${t("hist.latency")}</h3>
            ${l?r`<svg class="spark" style="height:60px" viewBox="0 0 200 60" preserveAspectRatio="none" role="img" aria-label=${t("hist.latency")}>
                  ${We`<path d=${u} fill="var(--him-accent)" opacity=".15"></path><path d=${l} fill="none" stroke="var(--him-accent)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
                </svg>
                <span class="muted small num">max ${Math.max(...h.map(m=>m.v)).toFixed(1)} ms</span>`:r`<span class="muted small">${t("el.d.no_history")}</span>`}`:d}
    `}};$e.styles=V,$e.properties={hass:{attribute:!1},payload:{attribute:!1},deviceId:{attribute:!1},tab:{attribute:!1},_report:{state:!0},_fwError:{state:!0},_history:{state:!0}};let Ii=$e;function Ni(i,e){let t=null;for(const n of i.modules){if(n.id===e)return n.kind==="rcbo"?n:t;n.kind==="rcd"&&(t=n)}return null}function ht(i){if(i.kind!=="breaker"&&i.kind!=="rcbo")return!1;const e=(i.circuit_name??"").trim();return e===""||e==="?"}function we(i,e){if(!i||!e)return null;const t=i.states[e];if(!t||t.state==="unavailable"||t.state==="unknown"||t.state==="")return null;const n=Number(t.state);if(!Number.isFinite(n))return null;const s=t.attributes?.unit_of_measurement;return s==="kW"?n*1e3:s==="mW"?n/1e3:n}function Ei(i,e){const t=new Set;let n=0,s=0;for(const a of e){if(!a||t.has(a))continue;t.add(a);const o=we(i,a);o!==null&&(n+=o,s+=1)}return s?n:null}function Mi(i){return i.rows.flatMap(e=>e.modules.map(t=>t.power_entity_id).filter(t=>!!t))}function Ri(i){let e=0,t=0,n=0,s=0;for(const a of i.rows)for(const o of a.modules)o.kind==="rcd"&&(e+=1),(o.kind==="breaker"||o.kind==="rcbo")&&(t+=1),o.kind==="device"&&(n+=1),ht(o)&&(s+=1);return{rcds:e,breakers:t,devices:n,unidentified:s}}function Ti(i,e){return i.filter(t=>t.module_id===e)}function ye(i){switch(i.kind){case"rcd":return i.rating_a?`${i.rating_a}A`:"ID";case"breaker":case"rcbo":return i.rating_a?`${i.curve!=="?"?i.curve:""}${i.rating_a}`:"?";case"device":{const e=i.model&&!i.model.trim().startsWith("?")?i.model.trim():"";return e?e.replace(/^shelly\s+/i,"")||e:(i.label||"?").replace(/\s*\(.*$/,"").trim().split(/\s+/)[0]||"?"}default:return""}}function te(i,e){return i===null?"\u2014":`${new Intl.NumberFormat(e,{maximumFractionDigits:0}).format(Math.round(i))} W`}function Di(i,e){return i===null?"\u2014":Math.abs(i)<1e3?te(i,e):`${new Intl.NumberFormat(e,{maximumFractionDigits:1}).format(i/1e3)} kW`}function ke(i){return JSON.parse(JSON.stringify(i))}function O(){const i=new Uint8Array(16);return(globalThis.crypto??{getRandomValues:e=>e.map(()=>Math.floor(Math.random()*256))}).getRandomValues(i),Array.from(i,e=>e.toString(16).padStart(2,"0")).join("")}function ie(i,e){return{id:O(),kind:i,ref:e,width_modules:i==="rcd"?2:1,model:null,notes:null,rating_a:i==="rcd"?40:i==="breaker"||i==="rcbo"?16:null,curve:"C",sensitivity_ma:i==="rcd"||i==="rcbo"?30:null,rcd_type:i==="rcd"||i==="rcbo"?"A":"?",cable_mm2:null,circuit_name:"?",circuit_kind:"unknown",area_ids:[],power_entity_id:null,energy_entity_id:null,switch_entity_id:null,label:i==="device"?"?":"",entity_ids:[]}}function Oi(i,e,t){const n=i.slice();if(e<0||e>=n.length)return n;const[s]=n.splice(e,1),a=Math.max(0,Math.min(t,n.length));return n.splice(a,0,s),n}function Li(i,e){return e.capacity||i.modules_per_row||null}function zi(i){return i.modules.reduce((e,t)=>e+Math.max(1,t.width_modules||1),0)}function pt(i){return Math.max(1,i.width_modules||1)}function ut(i){return i!==null?"grid-auto-columns:minmax(var(--him-slot-min),1fr)":"grid-auto-columns:minmax(var(--him-slot-min),var(--him-slot))"}function Ui(i,e){const t=["m"];return i.kind==="rcd"&&t.push("d"),i.kind==="rcbo"&&t.push("d"),i.kind==="device"&&t.push("s"),i.kind==="spacer"&&t.push("sp"),ht(i)&&t.push("u"),e&&t.push("sel"),t.join(" ")}function ji(i,e){switch(i.kind){case"rcd":return`${i.sensitivity_ma?e("el.sensitivity",{ma:i.sensitivity_ma}):"? mA"} \xB7 ${i.rcd_type&&i.rcd_type!=="?"?e("el.type",{t:i.rcd_type}):e("el.unknown_type")}`;case"breaker":case"rcbo":return i.circuit_name||"?";case"device":return ye(i)===i.label?i.notes?.split(`
`)[0]??"":i.label;default:return""}}function mt(i,e){const t=we(e.hass,i.power_entity_id),n=!!i.power_entity_id,s=ye(i),a=ji(i,e.t),o=e.t("el.module_aria",{kind:e.t(`el.kind.${i.kind}`),ref:i.ref,title:s,name:a});return r`<button
    class=${Ui(i,e.selected)}
    style=${`grid-column:span ${pt(i)}`}
    data-module-id=${i.id}
    data-kind=${i.kind}
    aria-label=${o}
    aria-pressed=${e.selected?"true":"false"}
    title=${`${i.ref} \xB7 ${a}`}
    @click=${e.onClick}
  >
    ${n?r`<span class=${`led${t!==null&&t>0?" on":""}`}></span>`:d}
    <b>${s}</b><small>${a}</small>
    ${n?r`<span class="w" title=${te(t,e.lang)}>${Di(t,e.lang)}</span>`:d}
    ${e.warned?r`<span class="wmark" aria-hidden="true"></span>`:d}
  </button>`}function _t(i,e){return e(`check.${i.code}`,i.params)}function Fi(i,e,t){if(i===null)return r`<span class="muted small">…</span>`;const{line:n,area:s}=st(i,e[0],e[1]);return n?r`<svg class="spark" viewBox="0 0 200 42" preserveAspectRatio="none" role="img" aria-label=${t("el.d.history")}>
    ${We`<path d=${s} fill="var(--him-accent)" opacity=".15"></path>
    <path d=${n} fill="none" stroke="var(--him-accent)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
  </svg>`:r`<span class="muted small">${t("el.d.no_history")}</span>`}function ft(i,e){const t=[i.rating_a?`${i.rating_a} A`:"? A",i.sensitivity_ma?`${i.sensitivity_ma} mA`:"? mA"];return t.push(i.rcd_type&&i.rcd_type!=="?"?e("el.type",{t:i.rcd_type}):e("el.unknown_type")),`${i.ref} \xB7 ${t.join(" ")}`}function Hi(i,e,t){const{t:n}=t,s=n(`el.kind.${i.kind}`);let a=s;i.kind==="breaker"||i.kind==="rcbo"?(a+=` ${ye(i)}`,i.cable_mm2&&(a+=`, ${n("el.d.cable",{s:String(i.cable_mm2).replace(".",t.lang==="fr"?",":".")})}`)):i.kind==="rcd"&&(a=`${s} ${ft(i,n).split(" \xB7 ")[1]}`);const o=i.kind==="breaker"?Ni(e,i.id):null,p=Ti(t.payload.checks,i.id),c=we(t.hass,i.power_entity_id),h=i.kind==="breaker"||i.kind==="rcbo";return r`<dl class="detail" aria-live="polite">
    <dt>${n("el.d.ref")}</dt>
    <dd>
      <b>${i.ref||"\u2014"}</b> · ${a}
      <button class="icon-btn" style="float:right;width:24px;height:24px" aria-label=${n("el.d.close")} @click=${()=>t.onSelectModule(null)}>✕</button>
    </dd>
    ${i.model?r`<dt>${n("el.d.model")}</dt><dd>${i.model}</dd>`:d}
    ${h?r`<dt>${n("el.d.circuit")}</dt>
          <dd>
            ${i.circuit_name||"?"}
            ${i.circuit_kind!=="unknown"?r`<span class="muted"> · ${n(`ck.kind.${i.circuit_kind}`)}</span>`:d}
          </dd>`:d}
    ${i.area_ids.length?r`<dt>${n("el.d.areas")}</dt><dd>${fe(t.hass,i.area_ids).join(" \xB7 ")}</dd>`:d}
    ${i.kind==="breaker"?r`<dt>${n("el.d.protected_by")}</dt><dd>${o?ft(o,n):r`<span class="muted">${n("el.d.no_rcd")}</span>`}</dd>`:d}
    ${i.power_entity_id?r`<dt>${n("el.d.measure")}</dt>
          <dd>
            <span class="num">${te(c,t.lang)}</span> ·
            <button class="ent" @click=${()=>t.onMoreInfo(i.power_entity_id)}>${i.power_entity_id}</button>
          </dd>
          <dt>${n("el.d.history")}</dt>
          <dd>${Fi(t.history,t.historyRange,n)}</dd>`:d}
    ${i.energy_entity_id?r`<dt>${n("el.d.energy")}</dt>
          <dd><button class="ent" @click=${()=>t.onMoreInfo(i.energy_entity_id)}>${i.energy_entity_id}</button></dd>`:d}
    ${i.entity_ids.length?r`<dt>${n("el.d.entities")}</dt>
          <dd>${i.entity_ids.map(l=>r`<button class="ent" @click=${()=>t.onMoreInfo(l)}>${l}</button> `)}</dd>`:d}
    ${i.notes?r`<dt>${n("el.d.notes")}</dt><dd style="white-space:pre-line">${i.notes}</dd>`:d}
    ${p.length?r`<dt>${n("el.d.warnings")}</dt>
          <dd><ul class="warnlist">${p.map(l=>r`<li class=${l.severity}>${_t(l,n)}</li>`)}</ul></dd>`:d}
  </dl>`}function bt(i){return Array.from({length:Math.max(0,i)},()=>r`<div class="m free" aria-hidden="true"></div>`)}function ne(i,e){const t=i?Li(i,e):null,n=zi(e);return{used:n,capacity:t,over:t!==null&&n>t}}function Vi(i,e){const t=new Set(e.payload.checks.filter(o=>o.severity==="warning").map(o=>o.module_id)),n=ne(e.board??null,i),s=e.t("el.row",{label:i.label}),a=n.capacity!==null?e.t("el.slots",{used:n.used,capacity:n.capacity}):"";return r`<div
    class=${n.over?"rail over":"rail"}
    style=${ut(n.capacity)}
    role="group"
    aria-label=${a?`${s} \xB7 ${a}`:s}
    title=${a}
    data-row-id=${i.id}
  >
    <span class="rl">${i.label}</span>
    ${i.modules.map(o=>mt(o,{hass:e.hass,t:e.t,lang:e.lang,selected:o.id===e.selectedModuleId,warned:t.has(o.id),onClick:()=>e.onSelectModule(o.id===e.selectedModuleId?null:o.id)}))}
    ${n.capacity!==null?bt(n.capacity-n.used):d}
  </div>`}function qi(i){const{t:e,payload:t,board:n}=i,s=t.model.boards;if(!n)return r`<div class="empty">${e("el.no_board")}</div>`;const a=Ri(n),o=Ei(i.hass,Mi(n)),p=t.checks.filter(h=>h.board_id===n.id&&h.severity==="warning");let c=null;for(const h of n.rows){const l=h.modules.find(u=>u.id===i.selectedModuleId);l&&(c={module:l,row:h})}return r`
    ${s.length>1?r`<div class="seg" role="tablist" aria-label=${e("el.board")}>
          ${s.map(h=>r`<button role="tab" aria-selected=${h.id===n.id?"true":"false"} @click=${()=>i.onSelectBoard(h.id)}>
              ${h.name}
            </button>`)}
        </div>`:d}
    <div class="chips">
      <span class="chip"><span class="dot"></span>${e("el.rcd_count",{n:a.rcds})}</span>
      ${a.unidentified?r`<span class="chip"><span class="dot warn"></span>${e("el.to_identify",{n:a.unidentified})}</span>`:r`<span class="chip"><span class="dot"></span>${e("el.all_identified")}</span>`}
      ${o!==null?r`<span class="chip num">${e("el.now",{w:te(o,i.lang)})}</span>`:d}
      ${p.length?r`<button class="chip warn" aria-expanded=${i.showWarnings?"true":"false"} @click=${i.onToggleWarnings}>
            <span class="dot warn"></span>${e("el.warnings",{n:p.length})}
          </button>`:d}
      ${i.hasPhoto?r`<button class="chip" @click=${i.onOpenPhoto}><ha-icon icon="mdi:image" style="--mdc-icon-size:16px"></ha-icon>${e("el.photo")}</button>`:d}
    </div>
    ${i.showWarnings&&p.length?r`<div class="form">
          <ul class="warnlist">
            ${p.map(h=>r`<li class="warning">
                <button class="ent" @click=${()=>i.onSelectModule(h.module_id)}>${h.ref}</button> · ${_t(h,e)}
              </li>`)}
          </ul>
          <span class="muted small">${e("check.disclaimer")}</span>
        </div>`:d}
    <div class="board">${n.rows.map(h=>Vi(h,{...i,board:n}))}</div>
    ${c?Hi(c.module,c.row,i):d}
  `}const Wi=["breaker","rcd","rcbo","device","spacer"],Bi=[2,6,10,16,20,25,32,40,50,63],Ki=[25,40,63,80,100],Gi=[10,30,100,300,500],Ji=["AC","A","F","B","?"],Zi=["B","C","D","?"],Yi=[1.5,2.5,4,6,10,16],Qi=["lighting","sockets","dedicated","cooking","water_heater","heating","feeder","other","unknown"];function xe(i){for(const e of i.rows)for(const t of e.modules){const n=/^([A-Za-z]+\d+)-/.exec(t.ref);if(n)return n[1]}return""}const Ae=class extends k{constructor(){super(),this._drag=null,this._initialised=!1,this._boards=[],this._selected=null,this._dirty=!1,this._busy=null,this._error=null,this._dragOver=null,this.boardId=null}connectedCallback(){super.connectedCallback(),Qe().then(()=>this.requestUpdate())}willUpdate(){!this._initialised&&this.payload&&(this._initialised=!0,this._boards=ke(this.payload.model.boards),this._boards.length||this._addBoard(!1),(!this.boardId||!this._boards.some(e=>e.id===this.boardId))&&(this.boardId=this._boards[0]?.id??null))}get _t(){return T((this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en")}get _lang(){return(this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en"}get _board(){return this._boards.find(e=>e.id===this.boardId)}_touch(){this._boards=[...this._boards],this._dirty=!0}_locate(e){for(const t of this._boards)for(const n of t.rows){const s=n.modules.findIndex(a=>a.id===e);if(s>=0)return{row:n,index:s}}return null}_patch(e,t){const n=this._locate(e);n&&(n.row.modules[n.index]={...n.row.modules[n.index],...t},this._touch())}_addBoard(e=!0){const t=this._boards.length+1,n={id:O(),name:`Tableau ${t}`,location:null,area_id:null,photo_path:null,rows:[]};n.rows.push({id:O(),label:"R1",modules:[ie("rcd",`T${t}-R1-ID`)]}),this._boards=[...this._boards,n],this.boardId=n.id,e&&this._touch()}_addRow(){const e=this._board;if(!e)return;const t=`R${e.rows.length+1}`,n=xe(e)||`T${this._boards.indexOf(e)+1}`;e.rows.push({id:O(),label:t,modules:[ie("rcd",`${n}-${t}-ID`)]}),this._touch()}_addSpacer(e){const t=this._board,n=xe(t)||`T${this._boards.indexOf(t)+1}`,s=e.modules.filter(o=>o.kind==="spacer").length+1,a=ie("spacer",`${n}-${e.label}-V${s}`);e.modules.push(a),this._selected=a.id,this._touch()}_addModule(e){const t=this._board,n=xe(t)||`T${this._boards.indexOf(t)+1}`,s=e.modules.filter(o=>o.kind==="breaker"||o.kind==="rcbo").length+1,a=ie("breaker",`${n}-${e.label}-${s}`);e.modules.push(a),this._selected=a.id,this._touch()}_delete(e){const t=this._locate(e);if(!t)return;const n=t.row.modules[t.index];window.confirm(this._t("edit.confirm_delete",{name:n.ref||n.circuit_name||n.label}))&&(t.row.modules.splice(t.index,1),this._selected=null,this._touch())}_deleteRow(e){const t=this._board;window.confirm(this._t("edit.confirm_delete",{name:e.label}))&&(t.rows=t.rows.filter(n=>n.id!==e.id),this._touch())}_deleteBoard(){const e=this._board;window.confirm(this._t("edit.confirm_delete",{name:e.name}))&&(this._boards=this._boards.filter(t=>t.id!==e.id),this.boardId=this._boards[0]?.id??null,this._dirty=!0)}_move(e,t){const n=this._locate(e);n&&(n.row.modules=Oi(n.row.modules,n.index,n.index+t),this._touch(),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-module-id="${e}"]`)?.focus()))}moveTo(e,t,n){const s=this._locate(e);if(!s||e===n)return;const[a]=s.row.modules.splice(s.index,1),o=n?t.modules.findIndex(p=>p.id===n):-1;o<0?t.modules.push(a):t.modules.splice(o,0,a),this._touch()}async _upload(e){const t=e.target,n=t.files?.[0],s=this._board;if(!(!n||!s||!this.hass)){this._busy=this._t("ee.photo_uploading");try{s.photo_path=await oi(this.hass,s.id,n),this._touch()}catch(a){this._error=this._t("edit.failed",{error:w(a)})}finally{this._busy=null,t.value=""}}}async _save(){if(!(!this.hass||!this.payload)){this._busy="\u2026",this._error=null;try{await Ge(this.hass,"boards",this._boards,this.payload.section_revisions.boards),this._dirty=!1,y(this,"him-saved",{boardId:this.boardId})}catch(e){const t=I(e);t==="conflict"?y(this,"him-conflict"):t==="unauthorized"?this._error=this._t("edit.refused"):this._error=this._t("edit.failed",{error:w(e)})}finally{this._busy=null}}}_cancel(){this._dirty&&!window.confirm(this._t("edit.unsaved")+" \u2014 "+this._t("edit.cancel")+" ?")||y(this,"him-cancel")}render(){const e=this._t,t=this._board,n=this._selected?this._locate(this._selected):null;return r`
      <div class="toolbar">
        ${this._boards.length>1?g("ee-board",e("el.board"),this.boardId,this._boards.map(s=>({value:s.id,label:s.name})),s=>{this.boardId=s,this._selected=null}):d}
        <span style="flex:1"></span>
        ${this._dirty?r`<span class="badge warn">${e("edit.unsaved")}</span>`:d}
        <button class="btn" @click=${this._cancel}>${e("edit.cancel")}</button>
        <button class="btn pri" ?disabled=${!!this._busy||!this._dirty} @click=${this._save}>${e("edit.save")}</button>
      </div>
      ${this._error?r`<div class="banner" role="alert">${this._error}</div>`:d}
      ${this._busy&&this._busy!=="\u2026"?r`<div class="banner info">${this._busy}</div>`:d}
      ${t?r`<div class="ed">
            <div style="display:flex;flex-direction:column;gap:8px;min-width:0">
              <div class="grid2">
                ${f("ee-bname",e("ee.board_name"),t.name,s=>{t.name=s,this._touch()})}
                ${f("ee-bloc",e("ee.board_location"),t.location,s=>{t.location=s||null,this._touch()})}
              </div>
              ${f("ee-bslots",e("ee.board_slots"),t.modules_per_row??"",s=>{const a=Math.round(Number(s));t.modules_per_row=s.trim()&&a>0?Math.min(96,a):null,this._touch()},{type:"number"})}
              ${this.hass?be(this.hass,"ee-barea",e("ee.board_area"),t.area_id,!1,s=>{t.area_id=s[0]??null,this._touch()}):d}
              <span class="muted small">${e("ee.select_hint")}</span>
              <div class="board">${t.rows.map(s=>this._renderRail(s))}</div>
              <div class="btns">
                <button class="btn" @click=${this._addRow}>${e("ee.add_row")}</button>
                <button class="btn" @click=${()=>this._addBoard()}>${e("ee.add_board")}</button>
                <label class="btn" style="display:inline-flex;align-items:center">
                  ${e("ee.photo_upload")}
                  <input type="file" accept="image/*" style="display:none" @change=${this._upload} />
                </label>
                ${t.photo_path?r`<button class="btn" @click=${()=>{t.photo_path=null,this._touch()}}>${e("ee.photo_remove")}</button>`:d}
                <button class="btn danger" @click=${this._deleteBoard}>${e("ee.delete_board")}</button>
              </div>
            </div>
            ${n?this._renderForm(n.row.modules[n.index],n.row):r`<div class="form muted">${e("ee.select_hint")}</div>`}
          </div>`:d}
    `}_renderRail(e){const t=this._t;return r`<div
      class="rail"
      style=${ut(ne(this._board??null,e).capacity)}
      data-row-id=${e.id}
      @dragover=${n=>{this._drag&&n.preventDefault()}}
      @drop=${n=>{n.preventDefault(),this._drag&&!n.target.closest("[data-module-id]")&&this.moveTo(this._drag.moduleId,e,null),this._drag=null,this._dragOver=null}}
    >
      <span class="rl">${e.label}</span>
      ${e.modules.map(n=>r`<div
          draggable="true"
          style=${`grid-column:span ${pt(n)}`}
          class=${this._dragOver===n.id?"cell drag-wrap":"cell"}
          @dragstart=${s=>{this._drag={moduleId:n.id},s.dataTransfer?.setData("text/plain",n.id)}}
          @dragend=${()=>{this._drag=null,this._dragOver=null}}
          @dragover=${s=>{this._drag&&(s.preventDefault(),this._dragOver=n.id)}}
          @drop=${s=>{s.preventDefault(),s.stopPropagation(),this._drag&&this.moveTo(this._drag.moduleId,e,n.id),this._drag=null,this._dragOver=null}}
        >
          ${mt(n,{hass:this.hass,t,lang:this._lang,selected:n.id===this._selected||this._dragOver===n.id,warned:!1,onClick:()=>this._selected=n.id})}
        </div>`)}
      ${(()=>{const n=ne(this._board??null,e);return n.capacity!==null?bt(n.capacity-n.used):d})()}
      <button class="add" aria-label=${t("ee.add_module",{label:e.label})} @click=${()=>this._addModule(e)}>+</button>
      <button class="add add-sp" aria-label=${t("ee.add_spacer",{label:e.label})} title=${t("ee.add_spacer",{label:e.label})} @click=${()=>this._addSpacer(e)}>▢</button>
    </div>
    ${(()=>{const n=ne(this._board??null,e);return r`<div class=${n.over?"rail-meta over":"rail-meta"}>
        ${e.label} · ${n.capacity!==null?t("el.slots",{used:n.used,capacity:n.capacity}):t("el.slots_unknown",{used:n.used})}
      </div>`})()}`}_renderForm(e,t){const n=this._t,s=this.hass,a=l=>this._patch(e.id,l),o=l=>l===""||l==="?"?null:Number(l),p=e.kind==="breaker"||e.kind==="rcbo",c=e.kind==="rcd"||e.kind==="rcbo",h=t.modules.indexOf(e);return r`<div class="form" aria-label=${e.ref}>
      <b>${e.ref||"\u2014"}</b>
      ${g("ee-kind",n("ee.f.kind"),e.kind,Wi.map(l=>({value:l,label:n(`el.kind.${l}`)})),l=>a({kind:l,width_modules:l==="rcd"?Math.max(2,e.width_modules):e.width_modules}))}
      ${f("ee-ref",n("ee.f.ref"),e.ref,l=>a({ref:l}))}
      ${p?r`<div class="grid2">
            ${g("ee-rating",n("ee.f.rating"),e.rating_a??"?",[...Bi.map(l=>({value:l,label:`${l} A`})),{value:"?",label:"?"}],l=>a({rating_a:o(l)}))}
            ${g("ee-curve","\xA0",e.curve,Zi.map(l=>({value:l,label:l})),l=>a({curve:l}))}
          </div>`:d}
      ${e.kind==="rcd"?g("ee-rcdr",n("ee.f.rcd_rating"),e.rating_a??"?",[...Ki.map(l=>({value:l,label:`${l} A`})),{value:"?",label:"?"}],l=>a({rating_a:o(l)})):d}
      ${c?r`<div class="grid2">
            ${g("ee-sens",n("ee.f.sensitivity"),e.sensitivity_ma??"?",[...Gi.map(l=>({value:l,label:`${l} mA`})),{value:"?",label:"?"}],l=>a({sensitivity_ma:o(l)}))}
            ${g("ee-rcdt",n("ee.f.rcd_type"),e.rcd_type,Ji.map(l=>({value:l,label:l})),l=>a({rcd_type:l}))}
          </div>`:d}
      ${p?r`
            ${f("ee-circ",n("ee.f.circuit"),e.circuit_name,l=>a({circuit_name:l}))}
            ${g("ee-ck",n("ee.f.circuit_kind"),e.circuit_kind,Qi.map(l=>({value:l,label:n(`ck.kind.${l}`)})),l=>a({circuit_kind:l}))}
            ${be(s,"ee-areas",n("ee.f.areas"),e.area_ids,!0,l=>a({area_ids:l}))}
            ${g("ee-cable",n("ee.f.cable"),e.cable_mm2??"",[{value:"",label:"?"},...Yi.map(l=>({value:l,label:`${String(l).replace(".",this._lang==="fr"?",":".")} mm\xB2`}))],l=>a({cable_mm2:l?Number(l):null}))}
          `:d}
      ${e.kind==="device"?r`${f("ee-label",n("ee.f.label"),e.label,l=>a({label:l}))}
          ${f("ee-ents",n("ee.f.entities"),e.entity_ids.join(", "),l=>a({entity_ids:l.split(",").map(u=>u.trim()).filter(u=>/^[a-z0-9_]+\.[a-z0-9_]+$/.test(u))}))}`:d}
      ${p||e.kind==="device"?r`${et(s,"ee-power",n("ee.f.power"),e.power_entity_id,"power",l=>a({power_entity_id:l}))}
          ${et(s,"ee-energy",n("ee.f.energy"),e.energy_entity_id,"energy",l=>a({energy_entity_id:l}))}`:d}
      ${e.kind!=="spacer"?f("ee-model",n("ee.f.model"),e.model,l=>a({model:l||null})):d}
      ${f("ee-width",n("ee.f.width"),e.width_modules,l=>a({width_modules:Math.max(1,Math.min(24,Number(l)||1))}),{type:"number"})}
      <div class="f">
        <label for="ee-notes">${n("ee.f.notes")}</label>
        <textarea class="inp" id="ee-notes" rows="3" .value=${e.notes??""} @input=${l=>a({notes:l.target.value||null})}></textarea>
      </div>
      <div class="btns">
        <button class="btn" ?disabled=${h<=0} @click=${()=>this._move(e.id,-1)}>${n("ee.move_left")}</button>
        <button class="btn" ?disabled=${h>=t.modules.length-1} @click=${()=>this._move(e.id,1)}>${n("ee.move_right")}</button>
        <button class="btn danger" @click=${()=>this._delete(e.id)}>${n("ee.delete")}</button>
      </div>
      <div class="btns">
        ${f("ee-row",n("ee.row_label"),t.label,l=>{t.label=l,this._touch()})}
        ${f("ee-rcap",n("ee.row_capacity"),t.capacity??"",l=>{const u=Math.round(Number(l));t.capacity=l.trim()&&u>0?Math.min(96,u):null,this._touch()},{type:"number"})}
        <button class="btn danger" @click=${()=>this._deleteRow(t)}>${n("ee.delete_row")}</button>
      </div>
    </div>`}};Ae.styles=V,Ae.properties={hass:{attribute:!1},payload:{attribute:!1},boardId:{attribute:!1},_boards:{state:!0},_selected:{state:!0},_dirty:{state:!0},_busy:{state:!0},_error:{state:!0},_dragOver:{state:!0}};let Xi=Ae;const en=["router","switch","ap","server","nas","camera","iot","computer","phone","printer","other"];function tn(){return{id:O(),name:"",host:"",mac:null,vlan_id:null,switch_id:null,port:null,port_source:"auto",last_seen_port_at:null,area_id:null,parent_device_id:null,kind:"other",model:null,notes:null,monitor:{ping:!0,latency:!0,tcp_port:null,offline_alert_minutes:null}}}function nn(i,e){const t={...i};return e.vlan?.vlan_id&&(t.vlan_id=e.vlan.vlan_id),e.mac?.value&&(t.mac=e.mac.value),e.port&&t.port_source!=="manual"&&(t.switch_id=e.port.switch_id,t.port=e.port.port,!t.parent_device_id&&e.port.via_device_id&&e.port.via_device_id!==t.id&&(t.parent_device_id=e.port.via_device_id)),t}const Se=class extends k{constructor(){super(),this._lastRevision=-1,this._net=null,this._mode="list",this._form=null,this._isNew=!1,this._probe=null,this._probing=!1,this._preview=[],this._proposals=null,this._selVlans=new Set,this._selDevices=new Set,this._busy=!1,this._error=null,this._dirty=!1}connectedCallback(){super.connectedCallback(),Qe().then(()=>this.requestUpdate())}disconnectedCallback(){window.clearTimeout(this._previewTimer),super.disconnectedCallback()}willUpdate(){this.payload&&this.payload.section_revisions.network!==this._lastRevision&&!this._dirty&&(this._lastRevision=this.payload.section_revisions.network,this._net=ke(this.payload.model.network))}get _lang(){return(this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en"}get _t(){return T(this._lang)}editDevice(e){const t=this._net?.devices.find(n=>n.id===e);t&&(this._form=ke(t),this._isNew=!1,this._probe=null,this._mode="device",this._schedulePreview())}_newDevice(){this._form=tn(),this._isNew=!0,this._probe=null,this._preview=[],this._mode="device"}_patchForm(e){this._form&&(this._form={...this._form,...e,monitor:{...this._form.monitor,...e.monitor??{}}},this._schedulePreview())}_schedulePreview(){window.clearTimeout(this._previewTimer),this._previewTimer=window.setTimeout(()=>{const e=this._form;!e||!this.hass||Xt(this.hass,{...e,name:e.name||"?"}).then(t=>this._preview=t).catch(()=>this._preview=[])},300)}async _runProbe(){const e=this._form;if(!(!e?.host.trim()||!this.hass)){this._probing=!0;try{const t=await Qt(this.hass,e.host.trim());this._probe=t,this._form=nn(this._form,t),this._schedulePreview()}catch(t){this._error=I(t)==="unauthorized"?this._t("edit.refused"):this._t("edit.failed",{error:w(t)})}finally{this._probing=!1}}}async _persist(e){if(!this.hass||!this.payload)return!1;this._busy=!0,this._error=null;try{return await Ge(this.hass,"network",e,this.payload.section_revisions.network),this._dirty=!1,this._lastRevision=-1,y(this,"him-saved"),!0}catch(t){const n=I(t);return n==="conflict"?y(this,"him-conflict"):n==="unauthorized"?this._error=this._t("edit.refused"):this._error=this._t("edit.failed",{error:w(t)}),!1}finally{this._busy=!1}}async _saveDevice(){const e=this._form,t=this._net;if(!e||!t)return;if(!e.name.trim()){this._error=this._t("ne.required");return}const n=this._isNew?[...t.devices,e]:t.devices.map(a=>a.id===e.id?e:a),s={...t,devices:n};await this._persist(s)&&(this._net=s,this._mode="list",this._form=null)}async _deleteDevice(e){if(!this._net||!window.confirm(this._t("edit.confirm_delete",{name:e.name})))return;const t={...this._net,devices:this._net.devices.filter(n=>n.id!==e.id)};await this._persist(t)&&(this._net=t)}async _openImport(){if(this.hass){this._mode="import",this._proposals=null,this._error=null;try{const e=await ei(this.hass);this._proposals=e,this._selVlans=new Set(e.vlans.map(t=>t.interface)),this._selDevices=new Set(e.devices.filter(t=>!t.exists).map(t=>t.key))}catch(e){this._error=I(e)==="unauthorized"?this._t("edit.refused"):this._t("edit.failed",{error:w(e)})}}}async _applyImport(){if(!(!this.hass||!this.payload)){this._busy=!0;try{await ti(this.hass,[...this._selVlans],[...this._selDevices],this.payload.section_revisions.network),this._dirty=!1,this._lastRevision=-1,this._mode="list",y(this,"him-saved")}catch(e){I(e)==="conflict"?y(this,"him-conflict"):this._error=this._t("edit.failed",{error:w(e)})}finally{this._busy=!1}}}_toggle(e,t){const n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}render(){const e=this._t;return this._net?r`
      ${this._error?r`<div class="banner" role="alert">${this._error}</div>`:d}
      ${this._mode==="device"&&this._form?this._renderDeviceForm(this._form):d}
      ${this._mode==="import"?this._renderImport():d}
      ${this._mode==="list"?r`<div class="toolbar">
              <button class="btn pri" @click=${this._newDevice}>${e("ne.add")}</button>
              ${this.payload?.settings.sources.opnsense?r`<button class="btn" @click=${this._openImport}>${e("ne.import_opnsense")}</button>`:d}
            </div>
            ${this._renderTable()} ${this._renderVlans()} ${this._renderUplink()}`:d}
    `:r``}_sensorsSummary(e){const t=this._t,n=[];return e.monitor.ping&&n.push(t("ne.s.short.ping")),e.monitor.latency&&n.push(t("ne.s.short.latency")),e.monitor.tcp_port&&n.push(t("ne.s.short.tcp",{p:e.monitor.tcp_port})),e.monitor.offline_alert_minutes&&n.push(t("ne.s.short.alert")),n.join(", ")||"\u2014"}_renderTable(){const e=this._t,t=this._net,n=a=>t.vlans.find(o=>o.id===a)?.name??"\u2014",s=t.devices.slice().sort((a,o)=>ee(a.host).localeCompare(ee(o.host)));return r`<h3>${e("ne.devices")}</h3>
      <div class="scroll">
        <table class="tbl">
          <thead>
            <tr><th>${e("ne.col.name")}</th><th>${e("ne.col.ip")}</th><th>${e("ne.col.vlan")}</th><th>${e("ne.col.port")}</th><th>${e("ne.col.sensors")}</th><th></th></tr>
          </thead>
          <tbody>
            ${s.map(a=>r`<tr data-device-id=${a.id}>
                <td>${a.name}</td>
                <td class="num">${a.host}</td>
                <td>${n(a.vlan_id)}</td>
                <td>${a.port??"\u2014"}</td>
                <td>${this._sensorsSummary(a)}</td>
                <td style="white-space:nowrap">
                  <button class="btn" @click=${()=>this.editDevice(a.id)}>${e("ne.edit")}</button>
                  <button class="btn danger" aria-label=${`${e("ne.delete")} ${a.name}`} @click=${()=>this._deleteDevice(a)}>✕</button>
                </td>
              </tr>`)}
          </tbody>
        </table>
      </div>`}_renderDeviceForm(e){const t=this._t,n=this._net,s=this.hass,a=this._probe,o=this._probing?r`<span class="hint muted">${t("ne.probing")}</span>`:a?.ping?a.ping.alive?r`<span class="hint ok">${t("ne.answers",{ms:a.ping.rtt_ms??"?"})}</span>`:r`<span class="hint bad">${a.ping.error??t("ne.no_answer")}</span>`:d,p=[{value:"",label:"\u2014"},...n.vlans.map(l=>({value:l.id,label:`${l.name}${l.subnet?` \xB7 ${l.subnet}`:""}`}))],c=a?.port?r`<span class="hint muted">${a.port.via?t("ne.port_via",{port:a.port.port,via:a.port.via}):a.port.port} · ${t("ne.port_detected")}</span>`:void 0,h=this.payload?.settings.ping_interval_s??60;return r`<div class="toolbar">
        <b style="flex:1">${this._isNew?t("ne.add_title"):t("ne.edit_title",{name:e.name})}</b>
        <button class="btn" @click=${()=>{this._mode="list",this._form=null}}>${t("edit.cancel")}</button>
        <button class="btn pri" ?disabled=${this._busy} @click=${this._saveDevice}>${this._isNew?t("ne.create"):t("edit.save")}</button>
      </div>
      <div class="ed wide">
        <div class="form">
          ${f("ne-name",t("ne.f.name"),e.name,l=>this._patchForm({name:l}))}
          <div class="f">
            <label for="ne-host">${t("ne.f.host")}</label>
            <div style="display:flex;gap:6px">
              <input class="inp num" id="ne-host" .value=${e.host}
                @input=${l=>this._patchForm({host:l.target.value})}
                @change=${this._runProbe} />
              <button class="btn" ?disabled=${this._probing||!e.host} @click=${this._runProbe}>${t("ne.probe")}</button>
            </div>
            ${o}
          </div>
          ${g("ne-vlan",t("ne.f.vlan"),e.vlan_id??"",p,l=>this._patchForm({vlan_id:l||null}))}
          ${a?.vlan?r`<span class="hint muted">${a.vlan.name} · ${a.vlan.subnet} · ${t("ne.vlan_detected")}</span>`:d}
          ${f("ne-mac",t("ne.f.mac"),e.mac,l=>this._patchForm({mac:l.trim()||null}),{hint:a?.mac?r`<span class="hint muted">${t("ne.mac_detected",{source:a.mac.source})}</span>`:void 0})}
          <div class="grid2">
            ${g("ne-switch",t("ne.f.switch"),e.switch_id??"",[{value:"",label:"\u2014"},...n.switches.map(l=>({value:l.id,label:l.name}))],l=>this._patchForm({switch_id:l||null}))}
            ${f("ne-port",t("ne.f.port"),e.port,l=>this._patchForm({port:l===""?null:Number(l)}),{type:"number",hint:c})}
          </div>
          <label class="tog"><input type="checkbox" class="inp" .checked=${e.port_source==="manual"}
            @change=${l=>this._patchForm({port_source:l.target.checked?"manual":"auto"})} />${t("ne.f.port_source")}</label>
          ${be(s,"ne-area",t("ne.f.area"),e.area_id,!1,l=>this._patchForm({area_id:l[0]??null}))}
          <div class="grid2">
            ${g("ne-kind",t("ne.f.kind"),e.kind,en.map(l=>({value:l,label:t(`kind.${l}`)})),l=>this._patchForm({kind:l}))}
            ${g("ne-parent",t("ne.f.parent"),e.parent_device_id??"",[{value:"",label:"\u2014"},...n.devices.filter(l=>l.id!==e.id).map(l=>({value:l.id,label:l.name}))],l=>this._patchForm({parent_device_id:l||null}))}
          </div>
          ${f("ne-model",t("ne.f.model"),e.model,l=>this._patchForm({model:l||null}))}
          ${f("ne-notes",t("ne.f.notes"),e.notes,l=>this._patchForm({notes:l||null}))}
        </div>
        <div class="form">
          <b>${t("ne.sensors")}</b>
          ${this._toggleRow("ping",t("ne.s.ping"),e.monitor.ping,l=>this._patchForm({monitor:{...e.monitor,ping:l}}))}
          ${this._entityPreview("online")}
          ${this._toggleRow("latency",t("ne.s.latency"),e.monitor.latency,l=>this._patchForm({monitor:{...e.monitor,latency:l}}))}
          ${this._entityPreview("latency")}
          ${this._toggleRow("tcp",t("ne.s.tcp"),!!e.monitor.tcp_port,l=>this._patchForm({monitor:{...e.monitor,tcp_port:l?80:null}}))}
          ${e.monitor.tcp_port!==null?r`${f("ne-tcp",t("ne.s.tcp"),e.monitor.tcp_port,l=>this._patchForm({monitor:{...e.monitor,tcp_port:Number(l)||null}}),{type:"number"})}
                ${this._entityPreview("tcp")}`:d}
          ${this._toggleRow("alert",t("ne.s.alert"),!!e.monitor.offline_alert_minutes,l=>this._patchForm({monitor:{...e.monitor,offline_alert_minutes:l?5:null}}))}
          ${e.monitor.offline_alert_minutes!==null?f("ne-alert",t("ne.s.alert"),e.monitor.offline_alert_minutes,l=>this._patchForm({monitor:{...e.monitor,offline_alert_minutes:Number(l)||null}}),{type:"number"}):d}
          ${this._preview.filter(l=>!["online","latency","tcp"].includes(l.key)).map(l=>r`<div class="ent">${l.entity_id}</div>`)}
          <p class="muted small" style="margin:0">${t("ne.interval",{s:h,name:e.name||"\u2026"})}</p>
          ${e.area_id?r`<span class="muted small">${fe(s,[e.area_id]).join("")}</span>`:d}
        </div>
      </div>`}_toggleRow(e,t,n,s){return r`<label class="tog" for=${`ne-s-${e}`}>
      <input type="checkbox" class="inp" id=${`ne-s-${e}`} .checked=${n} @change=${a=>s(a.target.checked)} />
      ${t}
    </label>`}_entityPreview(e){const t=this._preview.find(n=>n.key===e);return t?r`<div class="ent" data-preview=${e}>${t.entity_id}</div>`:d}_renderImport(){const e=this._t,t=this._proposals;return r`<div class="toolbar">
        <b style="flex:1">${e("ne.import_title")}</b>
        <button class="btn" @click=${()=>this._mode="list"}>${e("edit.cancel")}</button>
        <button class="btn pri" ?disabled=${!t||this._busy||!this._selVlans.size&&!this._selDevices.size} @click=${this._applyImport}>
          ${e("ne.import_apply")}
        </button>
      </div>
      <p class="muted small" style="margin:0">${e("ne.import_hint")}</p>
      ${t?!t.vlans.length&&!t.devices.length?r`<div class="empty">${e("ne.import_none")}</div>`:r`<h3>${e("ne.vlans")}</h3>
              <div class="scroll"><table class="tbl">
                <tbody>
                  ${t.vlans.map(n=>r`<tr>
                      <td><input type="checkbox" aria-label=${n.name} .checked=${this._selVlans.has(n.interface)} @change=${()=>this._selVlans=this._toggle(this._selVlans,n.interface)} /></td>
                      <td>${n.name}</td><td class="num">${n.subnet}</td><td>${n.tag??"\u2014"}</td>
                      <td>${n.existing_id?r`<span class="badge">${e("ne.exists")}</span>`:d}</td>
                    </tr>`)}
                </tbody>
              </table></div>
              <h3>${e("ne.devices")}</h3>
              <div class="scroll"><table class="tbl">
                <tbody>
                  ${t.devices.map(n=>r`<tr>
                      <td><input type="checkbox" aria-label=${n.name} ?disabled=${n.exists} .checked=${this._selDevices.has(n.key)} @change=${()=>this._selDevices=this._toggle(this._selDevices,n.key)} /></td>
                      <td>${n.name}</td><td class="num">${n.host}</td><td class="num">${n.mac??""}</td>
                      <td>${n.exists?r`<span class="badge">${e("ne.exists")}</span>`:d}</td>
                    </tr>`)}
                </tbody>
              </table></div>`:r`<div class="muted">${e("ne.loading")}</div>`}`}_vlanPatch(e,t){Object.assign(e,t),this._net={...this._net},this._dirty=!0}_renderVlans(){const e=this._t,t=this._net;return r`<h3>${e("ne.vlans")}</h3>
      <div class="scroll">
        <table class="tbl">
          <thead><tr><th>${e("ne.v.color")}</th><th>${e("ne.v.name")}</th><th>${e("ne.v.tag")}</th><th>${e("ne.v.subnet")}</th><th>${e("ne.v.role")}</th><th></th></tr></thead>
          <tbody>
            ${t.vlans.map(n=>r`<tr>
                <td style="width:44px"><input class="inp" type="color" aria-label=${`${e("ne.v.color")} ${n.name}`} .value=${n.color} @input=${s=>this._vlanPatch(n,{color:s.target.value})} /></td>
                <td><input class="inp" aria-label=${e("ne.v.name")} .value=${n.name} @input=${s=>this._vlanPatch(n,{name:s.target.value})} /></td>
                <td style="width:70px"><input class="inp" type="number" aria-label=${e("ne.v.tag")} .value=${n.tag===null?"":String(n.tag)} @input=${s=>{const a=s.target.value;this._vlanPatch(n,{tag:a?Number(a):null})}} /></td>
                <td><input class="inp num" aria-label=${e("ne.v.subnet")} .value=${n.subnet??""} @input=${s=>this._vlanPatch(n,{subnet:s.target.value||null})} /></td>
                <td><input class="inp" aria-label=${e("ne.v.role")} .value=${n.role} @input=${s=>this._vlanPatch(n,{role:s.target.value})} /></td>
                <td><button class="btn danger" aria-label=${`${e("ne.delete")} ${n.name}`} @click=${()=>{window.confirm(e("edit.confirm_delete",{name:n.name}))&&(this._net={...t,vlans:t.vlans.filter(s=>s.id!==n.id)},this._dirty=!0)}}>✕</button></td>
              </tr>`)}
          </tbody>
        </table>
      </div>
      <div class="btns">
        <button class="btn" @click=${()=>{this._net={...t,vlans:[...t.vlans,{id:O(),name:"VLAN",tag:null,subnet:null,color:"#607d8b",role:"",access_summary:"",interface:null}]},this._dirty=!0}}>${e("ne.vlan_add")}</button>
        <button class="btn pri" ?disabled=${!this._dirty||this._busy} @click=${()=>this._persist(this._net)}>${e("ne.save_network")}</button>
      </div>`}_renderUplink(){const e=this._t,t=this._net.uplink,n=s=>{this._net={...this._net,uplink:{...t,...s}},this._dirty=!0};return r`<h3>${e("ne.uplink")}</h3>
      <div class="grid2">
        ${f("ne-isp",e("ne.u.isp"),t.isp,s=>n({isp:s}))}
        ${f("ne-box",e("ne.u.box_name"),t.box_name,s=>n({box_name:s}))}
        ${f("ne-boxip",e("ne.u.box_ip"),t.box_ip,s=>n({box_ip:s||null}))}
        ${f("ne-pub",e("ne.u.public_ip"),t.public_ip,s=>n({public_ip:s||null}))}
      </div>
      <div class="btns"><button class="btn pri" ?disabled=${!this._dirty||this._busy} @click=${()=>this._persist(this._net)}>${e("ne.save_network")}</button></div>`}};Se.styles=V,Se.properties={hass:{attribute:!1},payload:{attribute:!1},_net:{state:!0},_mode:{state:!0},_form:{state:!0},_isNew:{state:!0},_probe:{state:!0},_probing:{state:!0},_preview:{state:!0},_proposals:{state:!0},_selVlans:{state:!0},_selDevices:{state:!0},_busy:{state:!0},_error:{state:!0},_dirty:{state:!0}};let sn=Se;function an(i){return i?i>=1e3?`${i/1e3} Gbit/s`:`${i} Mbit/s`:""}function rn(i,e,t){const n=["p"];return e&&n.push("sfp"),i?.up&&n.push("up"),i?.poe&&n.push("poe"),t&&n.push("sel"),n.join(" ")}function vt(i,e,t,n){const s=t[String(e)],a=i.sfp_ports.includes(e),o=i.port_labels[String(e)]||s?.alias||"",p=s?.up?n.t("net.link_up"):s?.up===!1?n.t("net.link_down"):"";return r`<button
    class=${rn(s,a,n.selectedPort===e)}
    data-port=${e}
    aria-label=${[n.t("net.port_detail",{n:e}),o,p,s?.poe?n.t("net.poe"):""].filter(Boolean).join(", ")}
    aria-pressed=${n.selectedPort===e?"true":"false"}
    title=${o}
    @click=${()=>n.onSelectPort(n.selectedPort===e?null:e)}
  >
    ${e}
  </button>`}function on(i){const{t:e,payload:t}=i,n=t.model.network.switches;if(!n.length)return r`<div class="empty">${e("net.no_switch")}</div>`;const s=n.find(_=>_.id===i.switchId)??n[0],a=t.live.switches[s.id],o=a?.ports??{},p=Array.from({length:s.ports_count},(_,v)=>v+1),c=p.filter(_=>!s.sfp_ports.includes(_)),h=p.filter(_=>s.sfp_ports.includes(_)),l=i.selectedPort,u=l!==null?o[String(l)]:void 0,m=l!==null?vi(t.model.network.devices,s,l,u?.macs??[]):[],b=_=>t.model.network.vlans.find(v=>v.tag===_)?.name;return r`
    ${n.length>1?r`<div class="seg" role="tablist">
          ${n.map(_=>r`<button role="tab" aria-selected=${_.id===s.id?"true":"false"} @click=${()=>i.onSelectSwitch(_.id)}>${_.name}</button>`)}
        </div>`:d}
    <div class="muted small">${s.name}${s.host?` \xB7 ${s.host}`:""}${a?.sys_name?` \xB7 ${a.sys_name}`:""}</div>
    ${a&&!a.available?r`<div class="banner info">${e("net.switch_unavailable")}</div>`:d}
    <div class="sw" role="group" aria-label=${s.name}>
      <div class="sw-copper">${c.map(_=>vt(s,_,o,i))}</div>
      ${h.length?r`<div class="sw-sfp">${h.map(_=>vt(s,_,o,i))}</div>`:d}
    </div>
    ${l!==null?r`<dl class="detail" aria-live="polite">
          <dt>${e("net.port_detail",{n:l})}</dt>
          <dd>
            ${[s.port_labels[String(l)]||u?.alias||u?.name||"",u?.up===!0?an(u.speed_mbps)||e("net.link_up"):u?.up===!1?e("net.link_down"):"",u?.poe?e("net.poe"):""].filter(Boolean).join(" \xB7 ")||"\u2014"}
          </dd>
          ${u?r`<dt>VLAN</dt>
                <dd>
                  ${e("net.vlans_line",{pvid:u.pvid!==null?`${u.pvid}${b(u.pvid)?` (${b(u.pvid)})`:""}`:"\u2014",tagged:u.tagged_vlans.length?u.tagged_vlans.join(", "):"\u2014"})}
                </dd>`:d}
          ${u?.lldp?.sys_name?r`<dt>${e("net.lldp")}</dt><dd>${u.lldp.sys_name}${u.lldp.port_id?` (${u.lldp.port_id})`:""}</dd>`:d}
          <dt>${e("net.seen")}</dt>
          <dd>
            ${m.length?m.map(_=>r`<button class="ent" @click=${()=>i.onOpenDevice(_.id)}>${_.name}</button><br />`):"\u2014"}
            ${u?.macs?.length?r`<span class="muted small">${e("net.macs",{n:u.macs.length})}</span>`:d}
          </dd>
        </dl>`:d}
  `}function W(i,e,t,n,s){const a=[ct(i,t,n,s)];for(const o of _i(e,i.id))a.push(...W(o,e,t,n+1,""));return a}function ln(i){const{t:e,payload:t}=i,n=t.model.network,s=n.devices;if(!s.length&&!n.switches.length)return r`<div class="empty">${e("net.no_devices")}</div>`;const a=n.uplink,o=s.filter(m=>m.kind==="router"),p=m=>s.find(b=>b.kind==="switch"&&m&&b.host===m),c=new Set,h=n.switches.map(m=>{const b=p(m.host);b&&c.add(b.id);const _=mi(s,m.id).map(v=>({...v,devices:v.devices.filter(z=>z.kind!=="router"&&z.id!==b?.id)})).filter(v=>v.devices.length>0);return r`<div class="portgrp">
      ${b?ct(b,i,3):r`<div class="tn" style="margin-left:calc(var(--him-indent) * 3)"><span class="dot off"></span><span class="name">${m.name}</span>
            <span class="ip num">${m.host??""}</span></div>`}
      ${_.flatMap(v=>{v.devices.forEach(se=>c.add(se.id));const z=e("net.port",{n:v.port});if(v.devices.length===1)return W(v.devices[0],s,i,4,z);const Pe=m.port_labels[String(v.port)];return[r`<div class="tn port-head" style="margin-left:calc(var(--him-indent) * 4)">
            <span class="name"><b>${z}</b>${Pe?r`<span class="muted"> · ${Pe}</span>`:d}</span>
            <span class="ip muted small">${e("net.devices_n",{n:v.devices.length})}</span>
          </div>`,...v.devices.flatMap(se=>W(se,s,i,5,""))]})}
    </div>`});for(const m of o)c.add(m.id);const l=fi(s,n.switches).filter(m=>!c.has(m.id)&&m.kind!=="router"),u=t.live.opnsense.gateways;return r`<div class="topo">
    <div class="tn">
      <span class=${u.length?u.some(m=>m.online)?"dot":"dot bad":"dot off"}></span>
      <span class="name"><b>${e("net.internet")}</b> ${a.isp}</span>
      <span class="ip num">${a.public_ip??""}</span>
    </div>
    ${a.box_name||a.box_ip?r`<div class="tn" style="margin-left:var(--him-indent)"><span class="dot off"></span><span class="name">${a.box_name}</span>
          <span class="ip num">${a.box_ip??""}</span></div>`:d}
    ${o.flatMap(m=>W(m,s,i,2,""))}
    ${h}
    ${l.length?r`<h3>${e("net.unplaced")}</h3>
          ${l.flatMap(m=>W(m,s,i,1,""))}`:d}
  </div>`}function gt(i,e){return i.slice().sort((t,n)=>ee(t.host).localeCompare(ee(n.host))).map(t=>r`<button class="row" data-device-id=${t.id} @click=${()=>e.onOpenDevice(t.id)}>
        ${dt(t,e)}<span>${t.name}</span><span class="muted num" style="margin-left:auto">${t.host}</span>
      </button>`)}function dn(i){const{t:e,payload:t}=i,n=t.model.network,s=n.devices.filter(a=>!a.vlan_id);return!n.vlans.length&&!n.devices.length?r`<div class="empty">${e("net.no_devices")}</div>`:r`<div class="vgrid">
    ${n.vlans.map(a=>{const o=n.devices.filter(p=>p.vlan_id===a.id);return r`<section class="vc" style=${`--vc:${a.color}`} aria-label=${a.name} data-vlan-id=${a.id}>
        <b>${a.name} · ${a.tag?e("net.vlan_tag",{tag:a.tag}):e("net.untagged")}</b>
        <span class="num">${a.subnet??""}</span>
        ${a.role?r`<span class="muted small">${a.role}</span>`:d}
        ${a.access_summary?r`<span class="muted small">${a.access_summary}</span>`:d}
        <span class="muted small">${e("net.devices_n",{n:o.length})}</span>
        ${gt(o,i)}
      </section>`})}
    ${s.length?r`<section class="vc"><b>${e("net.no_vlan")}</b>${gt(s,i)}</section>`:d}
  </div>`}const L="home-infra-map-card",$t="home-infra-map-card-editor";let cn=0;function wt(i,e=new Date){const t=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;return`home-infra-map-${i}-${t}.yaml`}function yt(i,e){const t=URL.createObjectURL(new Blob([e],{type:"text/yaml;charset=utf-8"})),n=document.createElement("a");n.href=t,n.download=i,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(t),1e3)}const Ce=class extends k{constructor(){super(),this._instance=++cn,this._unsub=null,this._subscribing=!1,this._retries=0,this._firstRender=!0,this._viewFromConfig=!1,this._historyFor=null,this._view="electricity",this._networkView="topology",this._boardId=null,this._moduleId=null,this._history=null,this._showWarnings=!1,this._deviceId=null,this._sheetTab="info",this._switchId=null,this._port=null,this._edit=!1,this._editKey=0,this._dialog=null}static getConfigElement(){return document.createElement($t)}static getStubConfig(){return{type:`custom:${L}`,view:"electricity"}}setConfig(e){if(!e||typeof e!="object")throw x("error","card","#%d setConfig rejected: %o",this._instance,e),new Error("Invalid configuration");this._config=e,this._viewFromConfig=!!e.view,(e.view==="electricity"||e.view==="network")&&(this._view=e.view),e.network_view&&["topology","vlan","switch"].includes(e.network_view)&&(this._networkView=e.network_view),e.board&&(this._boardId=e.board),x("info","card","#%d setConfig accepted at t=%dms",this._instance,Math.round(performance.now()))}getCardSize(){return $i()}getGridOptions(){return gi()}connectedCallback(){super.connectedCallback(),this._retries=0,this.hass&&!this._unsub&&this._load()}disconnectedCallback(){super.disconnectedCallback(),window.clearTimeout(this._retryTimer),this._retryTimer=void 0,this._unsub?.(),this._unsub=null}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&!this._subscribing&&this.isConnected&&this._retryTimer===void 0&&this._load()}get _lang(){return me(this.hass)}get _t(){return T(this._lang)}async _load(){if(!(!this.hass||this._subscribing)){this._subscribing=!0;try{const e=await pe(this.hass);this._applyPayload(e),this._error=void 0;const t=await Yt(this.hass,n=>this._onEvent(n));if(!this.isConnected){t();return}this._unsub=()=>{t()}}catch(e){const t=I(e);this._error=t==="not_configured"?this._t("card.not_configured"):this._t("card.error",{error:w(e)}),x("warn","card","#%d load failed (%s)",this._instance,t),t!=="not_configured"&&this._retries<10&&(this._retries+=1,this._retryTimer=window.setTimeout(()=>{this._retryTimer=void 0,this._load()},Math.min(2e3*this._retries,15e3)))}finally{this._subscribing=!1}}}_applyPayload(e){this._payload=e,!this._viewFromConfig&&e.settings.default_view&&(this._view=e.settings.default_view),this._viewFromConfig=!0,(!this._boardId||!e.model.boards.some(t=>t.id===this._boardId))&&(this._boardId=e.model.boards[0]?.id??null)}_onEvent(e){if(e.kind==="model"){const{kind:t,...n}=e;this._applyPayload(n)}else e.kind==="live"&&this._payload&&(this._payload={...this._payload,live:e.live})}updated(){this.getAttribute("lang")!==this._lang&&this.setAttribute("lang",this._lang),this._firstRender&&this._payload&&(this._firstRender=!1,x("info","card","#%d first render with data at t=%dms (v%s)",this._instance,Math.round(performance.now()),ot)),this.dispatchEvent(new CustomEvent("home-infra-map-card-update",{bubbles:!0,composed:!0}))}get _board(){return this._payload?.model.boards.find(e=>e.id===this._boardId)??null}_selectModule(e){this._moduleId=e,this._history=null;const t=(e?this._board?.rows.flatMap(n=>n.modules).find(n=>n.id===e):void 0)?.power_entity_id;!t||!this.hass||(this._historyFor=t,Je(this.hass,[t]).then(n=>{this._historyFor===t&&(this._history=nt(n[t]))}).catch(()=>this._history=[]))}async _openPhoto(){const e=this._board;if(!(!e?.photo_path||!this.hass)){this._dialog={kind:"photo",text:e.name,busy:!0};try{const t=await ri(this.hass,e.id,e.photo_path.split("?v=")[1]??"");this._dialog={kind:"photo",text:e.name,url:t}}catch(t){this._dialog=null,N(this,this._t("card.error",{error:w(t)}))}}}async _tool(e){if(this.hass){if(e==="import"){this._dialog={kind:e,text:""};return}this._dialog={kind:e,text:"",busy:!0};try{const t=e==="export"?await ni(this.hass):await ai(this.hass);this._dialog={kind:e,text:t.yaml}}catch(t){this._dialog={kind:e,text:this._t("card.error",{error:w(t)})}}}}async _readImportFile(e){const t=e.target,n=t.files?.[0];if(t.value="",!(!n||!this._dialog)){if(n.size>2*1024*1024){N(this,this._t("tools.file_too_large"));return}this._dialog={...this._dialog,text:await n.text()}}}async _runImport(){if(!(!this.hass||!this._dialog)){this._dialog={...this._dialog,busy:!0};try{const e=await si(this.hass,this._dialog.text);N(this,this._t("tools.import_done",e)),this._dialog=null,this._editKey+=1}catch(e){const t=I(e)==="unauthorized"?this._t("edit.refused"):this._t("card.error",{error:w(e)});this._dialog={...this._dialog,busy:!1},N(this,t)}}}async _onConflict(){if(N(this,this._t("edit.conflict")),this.hass)try{this._applyPayload(await pe(this.hass))}catch{}this._editKey+=1}render(){const e=this._t;if(!this._payload)return r`<ha-card>
        <div class="head"><span class="title">${this._config?.title??e("card.name")}</span></div>
        <div class="body">
          ${this._error?r`<div class="banner" role="alert">${this._error}</div>
                <div class="btns"><button class="btn" @click=${()=>{this._retries=0,this._load()}}>${e("card.retry")}</button></div>`:r`<div class="muted" role="status">${e("card.loading")}</div>`}
        </div>
      </ha-card>`;const t=!!this.hass?.user?.is_admin;return r`<ha-card>
      ${this._renderHeader(t)}
      <div class="body">
        ${this._edit&&t?this._renderEdit():this._view==="electricity"?this._renderElectricity():this._renderNetwork()}
      </div>
      ${this._deviceId?r`<home-infra-map-device-sheet
            .hass=${this.hass}
            .payload=${this._payload}
            .deviceId=${this._deviceId}
            .tab=${this._sheetTab}
            @close=${()=>this._deviceId=null}
          ></home-infra-map-device-sheet>`:d}
      ${this._dialog?this._renderDialog():d}
    </ha-card>`}_renderHeader(e){const t=this._t,n=this._board;let s=this._config?.title;return s||(s=this._view==="electricity"&&n?[n.name,n.location].filter(Boolean).join(" \xB7 "):t("view.network")),this._edit&&(s=t("edit.title",{name:this._view==="electricity"?n?.name??t("view.electricity"):t("view.network")})),r`<div class="head">
      <span class="title">${s}</span>
      <div class="head-actions">
        ${this._edit?r`<button class="btn" @click=${()=>this._tool("export")}>${t("tools.export")}</button>
              <button class="btn" @click=${()=>this._tool("import")}>${t("tools.import")}</button>
              <button class="btn" @click=${()=>this._tool("dashboard")}>${t("tools.dashboard")}</button>`:d}
        <div class="seg" role="tablist" aria-label=${t("card.name")}>
          ${["electricity","network"].map(a=>r`<button role="tab" aria-selected=${this._view===a?"true":"false"} @click=${()=>{this._view=a,this._moduleId=null}}>${t(`view.${a}`)}</button>`)}
        </div>
        ${e?r`<button
              class="icon-btn"
              aria-label=${this._edit?t("edit.close"):t("edit.open")}
              aria-pressed=${this._edit?"true":"false"}
              title=${this._edit?t("edit.close"):t("edit.open")}
              @click=${()=>{this._edit=!this._edit,this._editKey+=1}}
            >
              ${customElements.get("ha-icon")?r`<ha-icon icon=${this._edit?"mdi:close":"mdi:pencil"}></ha-icon>`:this._edit?"\u2715":"\u270E"}
            </button>`:d}
      </div>
    </div>`}_renderElectricity(){return qi({hass:this.hass,payload:this._payload,t:this._t,lang:this._lang,board:this._board,selectedModuleId:this._moduleId,showWarnings:this._showWarnings,history:this._history,historyRange:[Date.now()-24*3600*1e3,Date.now()],hasPhoto:!!this._board?.photo_path,onSelectBoard:e=>{this._boardId=e,this._moduleId=null},onSelectModule:e=>this._selectModule(e),onToggleWarnings:()=>this._showWarnings=!this._showWarnings,onOpenPhoto:()=>{this._openPhoto()},onMoreInfo:e=>Ye(this,e)})}_renderNetwork(){const e=this._t,t=this._payload,n={hass:this.hass,payload:t,t:e,lang:this._lang,onOpenDevice:a=>{this._deviceId=a,this._sheetTab="info"}},s=bi(t,this.hass);return r`
      <div class="toolbar">
        <div class="seg" role="tablist" aria-label=${e("view.network")}>
          ${["topology","vlan","switch"].map(a=>r`<button role="tab" aria-selected=${this._networkView===a?"true":"false"} @click=${()=>this._networkView=a}>
              ${e(`nview.${a}`)}
            </button>`)}
        </div>
      </div>
      <div class="chips">
        <span class="chip"><span class="dot"></span>${e("net.online",{n:s.online})}</span>
        ${s.offline?r`<span class="chip"><span class="dot bad"></span>${e("net.offline",{n:s.offline})}</span>`:d}
        ${t.live.opnsense.gateways.map(a=>r`<span class="chip"><span class=${a.online?"dot":"dot bad"}></span>${e("net.gateway",{name:a.name,delay:a.delay??""})}</span>`)}
      </div>
      ${t.live.ping_available?d:r`<div class="banner info">${e("net.ping_unavailable")}</div>`}
      ${this._networkView==="topology"?ln(n):d}
      ${this._networkView==="vlan"?dn(n):d}
      ${this._networkView==="switch"?on({...n,switchId:this._switchId,selectedPort:this._port,onSelectSwitch:a=>{this._switchId=a,this._port=null},onSelectPort:a=>this._port=a}):d}
    `}_renderEdit(){const e=()=>N(this,this._t("edit.saved"));return Zt(`${this._view}-${this._editKey}`,this._view==="electricity"?r`<home-infra-map-electricity-editor
            .hass=${this.hass}
            .payload=${this._payload}
            .boardId=${this._boardId}
            @him-saved=${t=>{e(),t.detail?.boardId&&(this._boardId=t.detail.boardId),this._edit=!1}}
            @him-cancel=${()=>this._edit=!1}
            @him-conflict=${this._onConflict}
          ></home-infra-map-electricity-editor>`:r`<home-infra-map-network-editor
            .hass=${this.hass}
            .payload=${this._payload}
            @him-saved=${e}
            @him-conflict=${this._onConflict}
          ></home-infra-map-network-editor>`)}_renderDialog(){const e=this._t,t=this._dialog,n=()=>this._dialog=null,s=t.kind==="export"?e("tools.export"):t.kind==="import"?e("tools.import"):t.kind==="dashboard"?e("tools.dashboard"):t.text;return r`<div
      class="overlay"
      @click=${a=>a.target===a.currentTarget&&n()}
      @keydown=${a=>a.key==="Escape"&&n()}
    >
      <div class="sheet" role="dialog" aria-modal="true" aria-label=${s}>
        <div class="head">
          <span class="title">${s}</span>
          <button class="icon-btn" aria-label=${e("tools.close")} @click=${n}>✕</button>
        </div>
        ${t.kind==="photo"?t.url?r`<img class="photo-full" src=${t.url} alt=${e("el.photo")} />`:r`<div class="body muted">${e("card.loading")}</div>`:r`<div class="body">
              ${t.kind==="import"?r`<p class="muted small" style="margin:0">${e("tools.import_hint")}</p>
                    <label class="btn" style="display:inline-flex;align-items:center;width:max-content">
                      ${e("tools.choose_file")}
                      <input type="file" accept=".yaml,.yml,text/yaml,application/x-yaml,text/plain" style="display:none"
                        @change=${a=>this._readImportFile(a)} />
                    </label>
                    <textarea class="inp" rows="14" aria-label=${e("tools.import")} .value=${t.text}
                      @input=${a=>this._dialog={...t,text:a.target.value}}></textarea>
                    <div class="btns">
                      <button class="btn pri" ?disabled=${t.busy||!t.text.trim()} @click=${this._runImport}>${e("tools.import_run")}</button>
                    </div>`:t.busy?r`<div class="muted">${e("card.loading")}</div>`:r`${t.kind==="dashboard"?r`<p class="muted small" style="margin:0">${e("tools.dashboard_hint")}</p>`:d}
                      <pre class="yaml">${t.text}</pre>
                      <div class="btns">
                        <button class="btn pri" @click=${async()=>N(this,await ci(t.text)?e("tools.copied"):e("card.error",{error:"clipboard"}))}>
                          ${e("tools.copy")}
                        </button>
                        <button class="btn" @click=${()=>yt(wt(t.kind==="dashboard"?"dashboard":"export"),t.text)}>
                          ${e("tools.download")}
                        </button>
                      </div>`}
            </div>`}
      </div>
    </div>`}};Ce.styles=V,Ce.properties={hass:{attribute:!1},_config:{state:!0},_payload:{state:!0},_error:{state:!0},_view:{state:!0},_networkView:{state:!0},_boardId:{state:!0},_moduleId:{state:!0},_history:{state:!0},_showWarnings:{state:!0},_deviceId:{state:!0},_sheetTab:{state:!0},_switchId:{state:!0},_port:{state:!0},_edit:{state:!0},_editKey:{state:!0},_dialog:{state:!0}};let kt=Ce;q("home-infra-map-device-sheet",Ii),q("home-infra-map-electricity-editor",Xi),q("home-infra-map-network-editor",sn),q($t,ui),q(L,kt),x("info","card","v%s registered at t=%dms",ot,Math.round(performance.now())),Ai(L),window.customCards=window.customCards??[],window.customCards.some(i=>i.type===L)||window.customCards.push({type:L,name:"Home Infra Map",description:T(me(void 0))("card.description"),preview:!1,documentationURL:"https://github.com/Eric-D/ha-home-infra-map"});export{L as CARD_TAG,kt as HomeInfraMapCard,yt as downloadText,wt as yamlFilename};
