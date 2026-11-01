/* home-infra-map-card — built artefact, do not edit. Sources: frontend/src/ */
const ee=globalThis,pe=ee.ShadowRoot&&(ee.ShadyCSS===void 0||ee.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ue=Symbol(),Te=new WeakMap;let De=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==ue)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o;const e=this.t;if(pe&&i===void 0){const t=e!==void 0&&e.length===1;t&&(i=Te.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&Te.set(e,i))}return i}toString(){return this.cssText}};const zt=i=>new De(typeof i=="string"?i:i+"",void 0,ue),Lt=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((n,a,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+i[s+1],i[0]);return new De(t,i,ue)},jt=(i,e)=>{if(pe)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const n=document.createElement("style"),a=ee.litNonce;a!==void 0&&n.setAttribute("nonce",a),n.textContent=t.cssText,i.appendChild(n)}},Oe=pe?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const n of e.cssRules)t+=n.cssText;return zt(t)})(i):i,{is:Ft,defineProperty:Ut,getOwnPropertyDescriptor:Ht,getOwnPropertyNames:qt,getOwnPropertySymbols:Vt,getPrototypeOf:Wt}=Object,te=globalThis,ze=te.trustedTypes,Bt=ze?ze.emptyScript:"",Kt=te.reactiveElementPolyfillSupport,H=(i,e)=>i,me={toAttribute(i,e){switch(e){case Boolean:i=i?Bt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},Le=(i,e)=>!Ft(i,e),je={attribute:!0,type:String,converter:me,reflect:!1,useDefault:!1,hasChanged:Le};Symbol.metadata??=Symbol("metadata"),te.litPropertyMetadata??=new WeakMap;let D=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=je){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){const t=Symbol(),n=this.getPropertyDescriptor(i,t,e);n!==void 0&&Ut(this.prototype,i,n)}}static getPropertyDescriptor(i,e,t){const{get:n,set:a}=Ht(this.prototype,i)??{get(){return this[e]},set(s){this[e]=s}};return{get:n,set(s){const r=n?.call(this);a?.call(this,s),this.requestUpdate(i,r,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??je}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;const i=Wt(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){const e=this.properties,t=[...qt(e),...Vt(e)];for(const n of t)this.createProperty(n,e[n])}const i=this[Symbol.metadata];if(i!==null){const e=litPropertyMetadata.get(i);if(e!==void 0)for(const[t,n]of e)this.elementProperties.set(t,n)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){const e=[];if(Array.isArray(i)){const t=new Set(i.flat(1/0).reverse());for(const n of t)e.unshift(Oe(n))}else i!==void 0&&e.push(Oe(i));return e}static _$Eu(i,e){const t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){const i=new Map,e=this.constructor.elementProperties;for(const t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return jt(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){const t=this.constructor.elementProperties.get(i),n=this.constructor._$Eu(i,t);if(n!==void 0&&t.reflect===!0){const a=(t.converter?.toAttribute!==void 0?t.converter:me).toAttribute(e,t.type);this._$Em=i,a==null?this.removeAttribute(n):this.setAttribute(n,a),this._$Em=null}}_$AK(i,e){const t=this.constructor,n=t._$Eh.get(i);if(n!==void 0&&this._$Em!==n){const a=t.getPropertyOptions(n),s=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:me;this._$Em=n;const r=s.fromAttribute(e,a.type);this[n]=r??this._$Ej?.get(n)??r,this._$Em=null}}requestUpdate(i,e,t,n=!1,a){if(i!==void 0){const s=this.constructor;if(n===!1&&(a=this[i]),t??=s.getPropertyOptions(i),!((t.hasChanged??Le)(a,e)||t.useDefault&&t.reflect&&a===this._$Ej?.get(i)&&!this.hasAttribute(s._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:n,wrapped:a},s){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,s??e??this[i]),a!==!0||s!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),n===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[n,a]of this._$Ep)this[n]=a;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[n,a]of t){const{wrapped:s}=a,r=this[n];s!==!0||this._$AL.has(n)||r===void 0||this.C(n,void 0,a,r)}}let i=!1;const e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};D.elementStyles=[],D.shadowRootOptions={mode:"open"},D[H("elementProperties")]=new Map,D[H("finalized")]=new Map,Kt?.({ReactiveElement:D}),(te.reactiveElementVersions??=[]).push("2.1.2");const fe=globalThis,Fe=i=>i,ie=fe.trustedTypes,Ue=ie?ie.createPolicy("lit-html",{createHTML:i=>i}):void 0,He="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,qe="?"+N,Gt=`<${qe}>`,I=document,q=()=>I.createComment(""),V=i=>i===null||typeof i!="object"&&typeof i!="function",_e=Array.isArray,Zt=i=>_e(i)||typeof i?.[Symbol.iterator]=="function",be=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ve=/-->/g,We=/>/g,E=RegExp(`>|${be}(?:([^\\s"'>=/]+)(${be}*=${be}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Be=/'/g,Ke=/"/g,Ge=/^(?:script|style|textarea|title)$/i,Ze=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),o=Ze(1),Je=Ze(2),O=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),Ye=new WeakMap,M=I.createTreeWalker(I,129);function Qe(i,e){if(!_e(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ue!==void 0?Ue.createHTML(e):e}const Jt=(i,e)=>{const t=i.length-1,n=[];let a,s=e===2?"<svg>":e===3?"<math>":"",r=W;for(let c=0;c<t;c++){const p=i[c];let u,d,m=-1,f=0;for(;f<p.length&&(r.lastIndex=f,d=r.exec(p),d!==null);)f=r.lastIndex,r===W?d[1]==="!--"?r=Ve:d[1]!==void 0?r=We:d[2]!==void 0?(Ge.test(d[2])&&(a=RegExp("</"+d[2],"g")),r=E):d[3]!==void 0&&(r=E):r===E?d[0]===">"?(r=a??W,m=-1):d[1]===void 0?m=-2:(m=r.lastIndex-d[2].length,u=d[1],r=d[3]===void 0?E:d[3]==='"'?Ke:Be):r===Ke||r===Be?r=E:r===Ve||r===We?r=W:(r=E,a=void 0);const v=r===E&&i[c+1].startsWith("/>")?" ":"";s+=r===W?p+Gt:m>=0?(n.push(u),p.slice(0,m)+He+p.slice(m)+N+v):p+N+(m===-2?c:v)}return[Qe(i,s+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]};class Q{constructor({strings:e,_$litType$:t},n){let a;this.parts=[];let s=0,r=0;const c=e.length-1,p=this.parts,[u,d]=Jt(e,t);if(this.el=Q.createElement(u,n),M.currentNode=this.el.content,t===2||t===3){const m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(a=M.nextNode())!==null&&p.length<c;){if(a.nodeType===1){if(a.hasAttributes())for(const m of a.getAttributeNames())if(m.endsWith(He)){const f=d[r++],v=a.getAttribute(m).split(N),b=/([.?@])?(.*)/.exec(f);p.push({type:1,index:s,name:b[2],strings:v,ctor:b[1]==="."?Qt:b[1]==="?"?Xt:b[1]==="@"?ei:ne}),a.removeAttribute(m)}else m.startsWith(N)&&(p.push({type:6,index:s}),a.removeAttribute(m));if(Ge.test(a.tagName)){const m=a.textContent.split(N),f=m.length-1;if(f>0){a.textContent=ie?ie.emptyScript:"";for(let v=0;v<f;v++)a.append(m[v],q()),M.nextNode(),p.push({type:2,index:++s});a.append(m[f],q())}}}else if(a.nodeType===8)if(a.data===qe)p.push({type:2,index:s});else{let m=-1;for(;(m=a.data.indexOf(N,m+1))!==-1;)p.push({type:7,index:s}),m+=N.length-1}s++}}static createElement(e,t){const n=I.createElement("template");return n.innerHTML=e,n}}function z(i,e,t=i,n){if(e===O)return e;let a=n!==void 0?t._$Co?.[n]:t._$Cl;const s=V(e)?void 0:e._$litDirective$;return a?.constructor!==s&&(a?._$AO?.(!1),s===void 0?a=void 0:(a=new s(i),a._$AT(i,t,n)),n!==void 0?(t._$Co??=[])[n]=a:t._$Cl=a),a!==void 0&&(e=z(i,a._$AS(i,e.values),a,n)),e}class Yt{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:n}=this._$AD,a=(e?.creationScope??I).importNode(t,!0);M.currentNode=a;let s=M.nextNode(),r=0,c=0,p=n[0];for(;p!==void 0;){if(r===p.index){let u;p.type===2?u=new X(s,s.nextSibling,this,e):p.type===1?u=new p.ctor(s,p.name,p.strings,this,e):p.type===6&&(u=new ti(s,this,e)),this._$AV.push(u),p=n[++c]}r!==p?.index&&(s=M.nextNode(),r++)}return M.currentNode=I,a}p(e){let t=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,a){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=z(this,e,t),V(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==O&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Zt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&V(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:n}=e,a=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=Q.createElement(Qe(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===a)this._$AH.p(t);else{const s=new Yt(a,this),r=s.u(this.options);s.p(t),this.T(r),this._$AH=s}}_$AC(e){let t=Ye.get(e.strings);return t===void 0&&Ye.set(e.strings,t=new Q(e)),t}k(e){_e(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let n,a=0;for(const s of e)a===t.length?t.push(n=new X(this.O(q()),this.O(q()),this,this.options)):n=t[a],n._$AI(s),a++;a<t.length&&(this._$AR(n&&n._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const n=Fe(e).nextSibling;Fe(e).remove(),e=n}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class ne{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,a,s){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=l}_$AI(e,t=this,n,a){const s=this.strings;let r=!1;if(s===void 0)e=z(this,e,t,0),r=!V(e)||e!==this._$AH&&e!==O,r&&(this._$AH=e);else{const c=e;let p,u;for(e=s[0],p=0;p<s.length-1;p++)u=z(this,c[n+p],t,p),u===O&&(u=this._$AH[p]),r||=!V(u)||u!==this._$AH[p],u===l?e=l:e!==l&&(e+=(u??"")+s[p+1]),this._$AH[p]=u}r&&!a&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Qt extends ne{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}}class Xt extends ne{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}}class ei extends ne{constructor(e,t,n,a,s){super(e,t,n,a,s),this.type=5}_$AI(e,t=this){if((e=z(this,e,t,0)??l)===O)return;const n=this._$AH,a=e===l&&n!==l||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,s=e!==l&&(n===l||a);a&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ti{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){z(this,e)}}const ii=fe.litHtmlPolyfillSupport;ii?.(Q,X),(fe.litHtmlVersions??=[]).push("3.3.3");const ni=(i,e,t)=>{const n=t?.renderBefore??e;let a=n._$litPart$;if(a===void 0){const s=t?.renderBefore??null;n._$litPart$=a=new X(e.insertBefore(q(),s),s,void 0,t??{})}return a._$AI(i),a},ve=globalThis;let S=class extends D{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=ni(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return O}};S._$litElement$=!0,S.finalized=!0,ve.litElementHydrateSupport?.({LitElement:S});const ai=ve.litElementPolyfillSupport;ai?.({LitElement:S}),(ve.litElementVersions??=[]).push("4.2.2");const si=i=>(...e)=>({_$litDirective$:i,values:e});let ri=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,e,t){this._$Ct=i,this._$AM=e,this._$Ci=t}_$AS(i,e){return this.update(i,e)}update(i,e){return this.render(...e)}};const oi={},li=(i,e=oi)=>i._$AH=e,di=si(class extends ri{constructor(){super(...arguments),this.key=l}render(i,e){return this.key=i,e}update(i,[e,t]){return e!==this.key&&(li(i),this.key=e),t}}),k="home_infra_map";function R(i){return i?.code??"unknown_error"}function x(i){const e=i;return e?.message??e?.code??String(i)}const ge=i=>i.callWS({type:`${k}/get`});function ci(i,e){return i.connection.subscribeMessage(e,{type:`${k}/subscribe`})}const Xe=(i,e,t,n)=>i.callWS({type:`${k}/save`,section:e,data:t,expected_revision:n}),hi=(i,e)=>i.callWS({type:`${k}/probe`,host:e}),pi=(i,e)=>i.callWS({type:`${k}/preview_entities`,device:e}),ui=i=>i.callWS({type:`${k}/import_opnsense`}),mi=(i,e,t,n)=>i.callWS({type:`${k}/import_opnsense`,apply:!0,vlans:e,devices:t,expected_revision:n}),fi=(i,e)=>i.callWS({type:`${k}/firewall`,device_id:e}),_i=i=>i.callWS({type:`${k}/export`}),bi=(i,e)=>i.callWS({type:`${k}/import_yaml`,content:e}),vi=i=>i.callWS({type:`${k}/generate_dashboard`});async function et(i,e){if(!e.length)return{};const t=new Date,n=new Date(t.getTime()-24*3600*1e3);return i.callWS({type:"history/history_during_period",start_time:n.toISOString(),end_time:t.toISOString(),entity_ids:e,minimal_response:!0,no_attributes:!0,significant_changes_only:!1})}function tt(i){return`/api/${k}/photo/${encodeURIComponent(i)}`}async function gi(i,e,t){const n=await i.callWS({type:"auth/sign_path",path:tt(e),expires:3600}),a=n.path.includes("?")?"&":"?";return`${n.path}${a}v=${encodeURIComponent(t)}`}async function $i(i,e,t){if(!i.fetchWithAuth)throw new Error("upload not supported by this frontend");const n=new FormData;n.append("file",t);const a=await i.fetchWithAuth(tt(e),{method:"POST",body:n}),s=await a.json().catch(()=>({}));if(!a.ok||!s.photo_path)throw new Error(s.message??`HTTP ${a.status}`);return s.photo_path}const wi={"card.name":"Home Infra Map","card.description":"Tableaux \xE9lectriques et r\xE9seau de la maison","card.loading":"Chargement\u2026","card.not_configured":"L'int\xE9gration Home Infra Map n'est pas configur\xE9e (Param\xE8tres \u2192 Appareils et services).","card.error":"Erreur : {error}","card.retry":"R\xE9essayer","view.electricity":"\xC9lectricit\xE9","view.network":"R\xE9seau","nview.topology":"Topologie","nview.vlan":"VLAN","nview.switch":"Switch","edit.open":"Modifier","edit.close":"Quitter la modification","edit.title":"Modifier \xB7 {name}","edit.cancel":"Annuler","edit.save":"Enregistrer","edit.saved":"Enregistr\xE9","edit.conflict":"Les donn\xE9es ont \xE9t\xE9 modifi\xE9es ailleurs. Rechargement : vos changements non enregistr\xE9s sont perdus.","edit.refused":"Action refus\xE9e : r\xE9serv\xE9e aux administrateurs.","edit.failed":"\xC9chec : {error}","edit.confirm_delete":"Supprimer \xAB {name} \xBB ?","edit.unsaved":"Modifications non enregistr\xE9es","tools.export":"Exporter","tools.download":"T\xE9l\xE9charger (.yaml)","tools.choose_file":"Choisir un fichier .yaml\u2026","tools.file_too_large":"Fichier trop volumineux (2 Mo au plus).","el.slots":"{used} / {capacity} modules","el.slots_unknown":"{used} modules (largeur du rail non renseign\xE9e)","ee.board_slots":"Modules par rang\xE9e (largeur du rail)","ee.row_capacity":"Modules de cette rang\xE9e (vide = celle du tableau)","ee.add_spacer":"Ajouter un emplacement vide \xE0 la rang\xE9e {label}","check.row_overflow":"Rang\xE9e {row} : {used} modules pour un rail de {capacity} : \xE0 v\xE9rifier","tools.import":"Importer","tools.dashboard":"G\xE9n\xE9rer un exemple de tableau de bord","tools.copy":"Copier","tools.copied":"Copi\xE9","tools.close":"Fermer","tools.import_hint":"Collez un export Home Infra Map ou un fichier de la maison (tableaux / \xE9quipements). Les sections pr\xE9sentes remplacent les donn\xE9es actuelles.","tools.import_run":"Importer","tools.import_done":"Import termin\xE9 : {boards} tableau(x), {modules} modules, {vlans} VLAN, {devices} \xE9quipements.","tools.dashboard_hint":"Copiez ce YAML dans un tableau de bord (Modifier \u2192 \u22EE \u2192 \xC9diteur de configuration), ou carte par carte.","el.no_board":"Aucun tableau. Passez en modification (crayon) pour en cr\xE9er un ou importer un fichier.","el.board":"Tableau","el.rcd_count":"{n} diff\xE9rentiel(s)","el.to_identify":"{n} circuit(s) \xE0 identifier","el.all_identified":"Tous les circuits identifi\xE9s","el.now":"{w} en ce moment","el.warnings":"{n} point(s) \xE0 v\xE9rifier","el.alert":"Alerte : {text}","el.alerts":"{n} alerte(s)","el.d.alert":"Alerte","check.manual":"{text}","ee.f.alert":"Alerte (anomalie \xE0 signaler)","ee.f.alert_level":"Niveau","ee.alert_level.warning":"\xC0 traiter","ee.alert_level.info":"Pour information","ee.alert_hint":"Visible sur le tableau, dans \xAB alertes \xBB et dans l'entit\xE9 Alertes du tableau (pour une automatisation).","ee.alert.s1":"Prise sur un circuit \xE9clairage","ee.alert.s2":"Section de c\xE2ble insuffisante pour le calibre","ee.alert.s3":"Pas de liaison \xE0 la terre","ee.alert.s4":"Neutre commun \xE0 plusieurs circuits","ee.alert.s5":"Disjoncteur qui chauffe","ee.alert.s6":"D\xE9clenchements \xE0 r\xE9p\xE9tition","ee.alert.s7":"Trop de points d'utilisation sur le circuit","ee.alert.s8":"Rep\xE9rage absent ou faux","ee.alert.s9":"Bornier mal serr\xE9 / noirci","el.photo":"Photo du tableau","el.row":"Rang\xE9e {label}","el.kind.rcd":"Interrupteur diff\xE9rentiel","el.kind.breaker":"Disjoncteur","el.kind.rcbo":"Disjoncteur diff\xE9rentiel","el.kind.device":"Autre module","el.kind.spacer":"Emplacement vide","el.kind.meter":"Compteur","el.kind.main_breaker":"Disjoncteur de branchement","el.supply":"Arriv\xE9e","el.load":"{p} % du calibre de {a} A (230 V)","el.feeds_n":"{n} d\xE9part(s)","el.d.fed_by":"Aliment\xE9 par","el.d.fed_manual":"lien manuel","el.d.feeds":"Alimente","el.d.status":"\xC9tat","el.d.kva":"Puissance souscrite","el.d.head_only":"{ref} \xB7 disjoncteur de branchement {ma} mA, pas de diff\xE9rentiel 30 mA","el.status.active":"En service","el.status.off":"Coup\xE9 / disjonct\xE9","el.status.spare":"En r\xE9serve (pos\xE9, non raccord\xE9)","el.tag.off":"Coup\xE9","el.tag.spare":"R\xE9serve","el.spare_count":"{n} en r\xE9serve","el.off_count":"{n} coup\xE9(s)","el.board_fed_by":"Aliment\xE9 par {ref}","el.fx":"aliment\xE9 par {ref}","check.feeder_no_rcd":"D\xE9part sans diff\xE9rentiel 30 mA en amont ({sensitivity_ma} mA) : v\xE9rifier que le tableau aliment\xE9 a ses diff\xE9rentiels 30 mA","ee.f.status":"\xC9tat","ee.f.fed_by":"Aliment\xE9 par","ee.f.fed_auto":"Automatique ({ref})","ee.f.fed_none":"rien","ee.f.kva":"Puissance souscrite (kVA)","ee.f.head_rating":"Calibre (r\xE9glage)","ee.add_meter":"+ Compteur","ee.add_main_breaker":"+ Disjoncteur de branchement","ee.board_fed_by":"Tableau aliment\xE9 par","ee.fed_hint":"Par d\xE9faut un module est aliment\xE9 par le diff\xE9rentiel \xE0 sa gauche sur la rang\xE9e (ou par l'arriv\xE9e). Choisissez un autre \xE9l\xE9ment pour un c\xE2blage particulier.","ee.delete_supply":"Retirer de l'arriv\xE9e","el.d.ref":"Rep\xE8re","el.d.circuit":"Circuit","el.d.areas":"Pi\xE8ces","el.d.protected_by":"Prot\xE9g\xE9 par","el.d.no_rcd":"aucun diff\xE9rentiel en amont","el.d.measure":"Mesure","el.d.energy":"\xC9nergie","el.d.history":"24 h","el.d.notes":"Notes","el.d.warnings":"\xC0 v\xE9rifier","el.d.model":"Mod\xE8le","el.d.entities":"Entit\xE9s","el.d.cable":"c\xE2ble {s} mm\xB2","el.d.no_history":"Pas d'historique","el.d.close":"Fermer le d\xE9tail","el.sensitivity":"{ma} mA","el.type":"type {t}","el.unknown_type":"type ?","el.module_aria":"{kind} {ref} {title} {name}","ck.kind.lighting":"\xC9clairage","ck.kind.sockets":"Prises","ck.kind.dedicated":"Circuit sp\xE9cialis\xE9","ck.kind.cooking":"Cuisson","ck.kind.water_heater":"Chauffe-eau","ck.kind.heating":"Chauffage","ck.kind.feeder":"D\xE9part / sous-tableau","ck.kind.other":"Autre","ck.kind.unknown":"Non identifi\xE9","norm.title":"Rappel NF C 15-100","norm.lighting":"Disjoncteur 16 A au plus (10 A courant), c\xE2ble 1,5 mm\xB2, 8 points lumineux au plus par circuit, derri\xE8re un diff\xE9rentiel 30 mA.","norm.sockets":"16 A en 1,5 mm\xB2 : 8 prises au plus ; 20 A en 2,5 mm\xB2 : 12 prises au plus. Diff\xE9rentiel 30 mA. Cuisine : 6 prises dont 4 au-dessus du plan de travail.","norm.dedicated":"Un circuit par appareil (lave-linge, lave-vaisselle, s\xE8che-linge, four, cong\xE9lateur) : 20 A, 2,5 mm\xB2. Lave-linge : diff\xE9rentiel 30 mA type A.","norm.cooking":"Plaque ou cuisini\xE8re : circuit d\xE9di\xE9 32 A, 6 mm\xB2 en monophas\xE9, diff\xE9rentiel 30 mA type A.","norm.water_heater":"Chauffe-eau : circuit d\xE9di\xE9 20 A, 2,5 mm\xB2 (jusqu'\xE0 3 500 W), souvent command\xE9 par un contacteur heures creuses.","norm.heating":"Chauffage \xE9lectrique : 16 A en 1,5 mm\xB2 jusqu'\xE0 3 500 W, 20 A en 2,5 mm\xB2 jusqu'\xE0 4 500 W par circuit.","norm.feeder":"D\xE9part vers un tableau divisionnaire : section adapt\xE9e au calibre (en g\xE9n\xE9ral 10 mm\xB2 pour 40 A), diff\xE9rentiels 30 mA dans le tableau aliment\xE9.","norm.guess":"Calibre typique d'un circuit {kind}","ee.apply_guess":"Utiliser","ee.f.points":"Nombre de points (prises ou points lumineux)","el.d.points":"Points","el.d.points_max":"{n} ({max} au plus)","check.too_many_points":"{count} points sur ce circuit ({max} au plus) : \xE0 v\xE9rifier","check.no_rcd":"Aucun diff\xE9rentiel en amont : \xE0 v\xE9rifier","check.no_rcd_30ma":"Pas de diff\xE9rentiel 30 mA en amont ({sensitivity_ma} mA) : \xE0 v\xE9rifier","check.rcd_type_a":"Circuit cuisson / lave-linge derri\xE8re un diff\xE9rentiel type {rcd_type} ({rcd_ref}) : type A attendu, \xE0 v\xE9rifier","check.cable_rating":"Calibre {rating_a} A pour un c\xE2ble de {cable_mm2} mm\xB2 (max {max_a} A) : \xE0 v\xE9rifier","check.kind_rating":"Calibre {rating_a} A \xE9lev\xE9 pour ce type de circuit (max {max_a} A) : \xE0 v\xE9rifier","check.unidentified":"Circuit non identifi\xE9","check.too_many_breakers":"{count} disjoncteurs derri\xE8re ce diff\xE9rentiel (8 au plus conseill\xE9s) : \xE0 v\xE9rifier","check.rcd_sum":"Somme des calibres en aval ({total_a} A) \xE9lev\xE9e pour un diff\xE9rentiel de {rating_a} A (information)","check.disclaimer":"Indications inspir\xE9es de la NF C 15-100, qui ne remplacent pas un \xE9lectricien.","ee.add_module":"Ajouter un module \xE0 la rang\xE9e {label}","ee.add_row":"+ Rang\xE9e","ee.add_board":"+ Tableau","ee.delete_row":"Supprimer la rang\xE9e","ee.delete_board":"Supprimer le tableau","ee.photo_upload":"Importer la photo","ee.photo_uploading":"Envoi de la photo\u2026","ee.photo_remove":"Retirer la photo","ee.move_left":"D\xE9placer \u25C0","ee.move_right":"D\xE9placer \u25B6","ee.delete":"Supprimer","ee.select_hint":"Cliquez sur un module pour le modifier. Glisser-d\xE9poser ou \u25C0 \u25B6 pour r\xE9ordonner.","ee.board_name":"Nom du tableau","ee.board_location":"Emplacement","ee.board_area":"Pi\xE8ce","ee.row_label":"Nom de la rang\xE9e","ee.f.kind":"Type","ee.f.ref":"Rep\xE8re","ee.f.rating":"Calibre \xB7 courbe","ee.f.rcd_rating":"Calibre","ee.f.sensitivity":"Sensibilit\xE9","ee.f.rcd_type":"Type de diff\xE9rentiel","ee.f.circuit":"Circuit","ee.f.circuit_kind":"Type de circuit","ee.f.areas":"Pi\xE8ces","ee.f.power":"Capteur de puissance","ee.f.energy":"Capteur d'\xE9nergie","ee.f.switch":"Relais / sortie li\xE9e (coup\xE9 si \xE9teint)","ee.f.cable":"Section du c\xE2ble","ee.f.width":"Largeur (modules DIN)","ee.f.model":"Mod\xE8le","ee.f.notes":"Notes","ee.f.label":"Libell\xE9","ee.f.entities":"Entit\xE9s li\xE9es (s\xE9par\xE9es par des virgules)","ee.none":"\u2014","net.online":"{n} \xE9quipement(s) en ligne","net.offline":"{n} hors ligne","net.no_devices":"Aucun \xE9quipement. Passez en modification (crayon) pour en ajouter ou importer depuis OPNsense.","net.internet":"Internet","net.port":"port {n}","net.offline_short":"hors ligne","net.unplaced":"Sans port connu","net.wifi_under":"via {name}","net.vlan_tag":"VLAN {tag}","net.untagged":"non tagu\xE9","net.no_vlan":"Sans VLAN","net.devices_n":"{n} \xE9quipement(s)","net.no_switch":"Aucun switch d\xE9clar\xE9. Ajoutez une source SNMP (options de l'int\xE9gration) ou importez un fichier.","net.switch_unavailable":"Switch injoignable : derni\xE8res donn\xE9es connues.","net.port_detail":"Port {n}","net.speed":"{s}","net.poe":"PoE","net.vlans_line":"natif {pvid} \xB7 \xE9tiquet\xE9s {tagged}","net.lldp":"Voisin LLDP","net.seen":"\xC9quipements vus","net.macs":"{n} adresse(s) MAC","net.link_down":"lien coup\xE9","net.link_up":"lien actif","net.ping_unavailable":"Ping indisponible (droits ICMP) : voir le README.","net.gateway":"{name} {delay}","kind.router":"Routeur","kind.switch":"Switch","kind.ap":"Antenne Wi-Fi","kind.server":"Serveur","kind.nas":"NAS","kind.camera":"Cam\xE9ra","kind.iot":"Objet connect\xE9","kind.computer":"Ordinateur","kind.phone":"T\xE9l\xE9phone","kind.printer":"Imprimante","kind.other":"Autre","ds.tab.info":"Infos","ds.tab.firewall":"Pare-feu","ds.tab.history":"Historique","ds.close":"Fermer","ds.online":"En ligne","ds.online_ms":"En ligne \xB7 {ms} ms","ds.offline":"Hors ligne","ds.unknown":"\xC9tat inconnu","ds.blocks_today":"{n} blocage(s) sur 24 h","ds.ip":"Adresse","ds.mac":"MAC","ds.vlan":"VLAN","ds.port":"Port du switch","ds.port_value":"{port} \xB7 {switch}","ds.port_auto":"d\xE9tect\xE9","ds.port_manual":"saisi","ds.last_seen":"vu le {date}","ds.area":"Pi\xE8ce","ds.kind":"Type","ds.parent":"\xC9quipement parent","ds.sensors":"Capteurs","ds.notes":"Notes","ds.no_sensor":"aucun","fw.loading":"Analyse du pare-feu\u2026","fw.not_configured":"OPNsense n'est pas configur\xE9, ou l'analyse du pare-feu est d\xE9sactiv\xE9e (options de l'int\xE9gration).","fw.unavailable":"OPNsense est injoignable : analyse indisponible.","fw.not_an_ip":"L'analyse du pare-feu n\xE9cessite une adresse IP.","fw.what_can":"Ce que l'appareil peut faire \xB7 dans l'ordre d'application","fw.col.rule":"R\xE8gle (commentaire OPNsense)","fw.col.to":"Vers","fw.col.today":"Aujourd'hui","fw.pass":"autoris\xE9","fw.block":"bloqu\xE9","fw.own_rule":"r\xE8gle propre \xE0 l'appareil","fw.probable":"probable","fw.floating":"flottante","fw.blocked_n":"{n} bloqu\xE9e(s)","fw.default_deny":"Aucune r\xE8gle ne correspond ensuite : blocage par d\xE9faut.","fw.unreachable":"{n} r\xE8gle(s) suivante(s) jamais atteinte(s).","fw.redundant":"R\xE8gle(s) masqu\xE9e(s) car couvertes par une r\xE8gle suivante : {list}","fw.who":"Qui peut le joindre","fw.same_network":"m\xEAme r\xE9seau (non filtr\xE9)","fw.partial":"partiel","fw.nat":"Redirection NAT : port {ext} \u2192 {target}","fw.recent":"Derniers blocages","fw.col.time":"Heure","fw.col.dest":"Destination","fw.col.name":"Nom","fw.col.by":"Bloqu\xE9 par","fw.default_rule":"r\xE8gle par d\xE9faut / automatique","fw.no_blocks":"Aucun blocage r\xE9cent.","fw.readonly":"Lecture seule : rien n'est modifi\xE9 sur le routeur. Les noms viennent du journal DNS du routeur (probables).","fw.dest.any":"Internet / partout","fw.dest.router":"routeur ({ip})","fw.dest.private":"r\xE9seaux internes","fw.dest.network":"r\xE9seau {name}","fw.not":"tout sauf {x}","fw.reason.no_sequence":"ordre non garanti (sans num\xE9ro de s\xE9quence)","fw.reason.not_quick":"r\xE8gle flottante non \xAB quick \xBB","fw.reason.tagged":"r\xE8gle avec \xE9tiquette (tag)","fw.reason.route_to":"routage par passerelle","fw.reason.interface_not":"interfaces invers\xE9es","fw.reason.ports_unresolved":"ports non r\xE9solus","fw.reason.alias_url":"alias de type URL","fw.reason.alias_urltable":"alias de type URL","fw.reason.alias_urljson":"alias de type URL","fw.reason.alias_geoip":"alias GeoIP","fw.reason.alias_mac":"alias d'adresses MAC","fw.reason.alias_asn":"alias ASN","fw.reason.alias_dynipv6host":"alias IPv6 dynamique","fw.reason.alias_authgroup":"alias de groupe","fw.reason.alias_internal":"alias interne","fw.reason.alias_unresolved":"alias non r\xE9solu","fw.reason.unknown_token":"adresse inconnue","fw.reason.source_unresolved":"source ind\xE9termin\xE9e","fw.reason.destination_unresolved":"destination ind\xE9termin\xE9e","hist.presence":"Pr\xE9sence \xB7 24 h","hist.latency":"Latence \xB7 24 h","hist.none":"Aucun capteur de pr\xE9sence ou de latence pour cet \xE9quipement.","ne.add":"+ Ajouter un \xE9quipement","ne.import_opnsense":"Tout importer depuis OPNsense","ne.add_title":"Ajouter un \xE9quipement","ne.edit_title":"Modifier \xB7 {name}","ne.create":"Cr\xE9er","ne.f.name":"Nom","ne.f.host":"Adresse IP ou nom","ne.f.vlan":"R\xE9seau (VLAN)","ne.f.mac":"Adresse MAC","ne.f.switch":"Switch","ne.f.port":"Port du switch","ne.f.port_source":"Port fig\xE9 (saisi \xE0 la main)","ne.f.area":"Pi\xE8ce","ne.f.kind":"Type","ne.f.parent":"\xC9quipement parent (antenne, r\xE9p\xE9teur)","ne.f.model":"Mod\xE8le","ne.f.notes":"Notes","ne.probe":"Tester","ne.probing":"Test\u2026","ne.answers":"r\xE9pond \xB7 {ms} ms","ne.no_answer":"ne r\xE9pond pas","ne.vlan_detected":"d\xE9tect\xE9 depuis l'IP","ne.mac_detected":"lue sur le routeur ({source})","ne.port_detected":"lu sur le switch","ne.port_via":"{port} (via {via})","ne.sensors":"Capteurs \xE0 cr\xE9er","ne.s.ping":"Pr\xE9sence (ping)","ne.s.latency":"Latence","ne.s.tcp":"Port TCP","ne.s.alert":"Alerte si hors ligne plus de (min)","ne.interval":"Intervalle : {s} s \xB7 regroup\xE9s sous un appareil HA \xAB {name} \xBB.","ne.devices":"\xC9quipements d\xE9clar\xE9s","ne.col.name":"Nom","ne.col.ip":"IP","ne.col.vlan":"VLAN","ne.col.port":"Port","ne.col.sensors":"Capteurs","ne.edit":"Modifier","ne.delete":"Supprimer","ne.s.short.ping":"pr\xE9sence","ne.s.short.latency":"latence","ne.s.short.tcp":"port {p}","ne.s.short.alert":"alerte","ne.vlans":"VLAN","ne.vlan_add":"+ VLAN","ne.v.name":"Nom","ne.v.tag":"Tag","ne.v.subnet":"Sous-r\xE9seau","ne.v.color":"Couleur","ne.v.role":"R\xF4le","ne.v.access":"Acc\xE8s","ne.uplink":"Lien Internet","ne.u.isp":"Fournisseur d'acc\xE8s","ne.u.box_name":"Box","ne.u.box_ip":"IP de la box","ne.u.public_ip":"IP publique","ne.save_network":"Enregistrer","ne.import_title":"Importer depuis OPNsense","ne.import_hint":"Rien n'est \xE9crit avant \xAB Importer la s\xE9lection \xBB. Les \xE9quipements d\xE9j\xE0 d\xE9clar\xE9s sont ignor\xE9s ; seul le capteur de pr\xE9sence est activ\xE9.","ne.import_apply":"Importer la s\xE9lection","ne.import_none":"OPNsense ne propose rien \xE0 importer.","ne.exists":"d\xE9j\xE0 d\xE9clar\xE9","ne.loading":"Lecture d'OPNsense\u2026","ne.required":"Nom obligatoire."},$e={"card.name":"Home Infra Map","card.description":"Electrical boards and home network","card.loading":"Loading\u2026","card.not_configured":"The Home Infra Map integration is not configured (Settings \u2192 Devices & services).","card.error":"Error: {error}","card.retry":"Retry","view.electricity":"Electricity","view.network":"Network","nview.topology":"Topology","nview.vlan":"VLAN","nview.switch":"Switch","edit.open":"Edit","edit.close":"Leave edit mode","edit.title":"Edit \xB7 {name}","edit.cancel":"Cancel","edit.save":"Save","edit.saved":"Saved","edit.conflict":"The data was changed elsewhere. Reloading: your unsaved changes are lost.","edit.refused":"Refused: administrators only.","edit.failed":"Failed: {error}","edit.confirm_delete":'Delete "{name}"?',"edit.unsaved":"Unsaved changes","tools.export":"Export","tools.download":"Download (.yaml)","tools.choose_file":"Choose a .yaml file\u2026","tools.file_too_large":"File too large (2 MB max).","el.slots":"{used} / {capacity} modules","el.slots_unknown":"{used} modules (rail width not set)","ee.board_slots":"Modules per row (rail width)","ee.row_capacity":"Modules of this row (empty = board value)","ee.add_spacer":"Add an empty place to row {label}","check.row_overflow":"Row {row}: {used} modules on a {capacity}-module rail: to check","tools.import":"Import","tools.dashboard":"Generate an example dashboard","tools.copy":"Copy","tools.copied":"Copied","tools.close":"Close","tools.import_hint":"Paste a Home Infra Map export or a house file (boards / devices). The sections present replace the current data.","tools.import_run":"Import","tools.import_done":"Import done: {boards} board(s), {modules} modules, {vlans} VLANs, {devices} devices.","tools.dashboard_hint":"Paste this YAML into a dashboard (Edit \u2192 \u22EE \u2192 Raw configuration editor), or card by card.","el.no_board":"No board yet. Use edit mode (pencil) to create one or import a file.","el.board":"Board","el.rcd_count":"{n} RCD(s)","el.to_identify":"{n} circuit(s) to identify","el.all_identified":"All circuits identified","el.now":"{w} right now","el.warnings":"{n} point(s) to check","el.alert":"Alert: {text}","el.alerts":"{n} alert(s)","el.d.alert":"Alert","check.manual":"{text}","ee.f.alert":"Alert (issue to report)","ee.f.alert_level":"Level","ee.alert_level.warning":"To fix","ee.alert_level.info":"For information","ee.alert_hint":"Shown on the board, in the alerts list and in the Alerts entity of the board (for automations).","ee.alert.s1":"Socket on a lighting circuit","ee.alert.s2":"Cable too thin for the rating","ee.alert.s3":"No earth connection","ee.alert.s4":"Neutral shared by several circuits","ee.alert.s5":"Breaker running hot","ee.alert.s6":"Repeated tripping","ee.alert.s7":"Too many outlets on the circuit","ee.alert.s8":"Missing or wrong label","ee.alert.s9":"Loose or blackened terminal","el.photo":"Board photo","el.row":"Row {label}","el.kind.rcd":"Residual current device","el.kind.breaker":"Circuit breaker","el.kind.rcbo":"RCBO","el.kind.device":"Other module","el.kind.spacer":"Empty slot","el.kind.meter":"Utility meter","el.kind.main_breaker":"Main breaker","el.supply":"Service entrance","el.load":"{p} % of the {a} A rating (230 V)","el.feeds_n":"{n} departure(s)","el.d.fed_by":"Fed by","el.d.fed_manual":"manual link","el.d.feeds":"Feeds","el.d.status":"State","el.d.kva":"Subscribed power","el.d.head_only":"{ref} \xB7 main breaker {ma} mA, no 30 mA RCD","el.status.active":"In service","el.status.off":"Off / tripped","el.status.spare":"Spare (installed, not wired)","el.tag.off":"Off","el.tag.spare":"Spare","el.spare_count":"{n} spare","el.off_count":"{n} off","el.board_fed_by":"Fed by {ref}","el.fx":"fed by {ref}","check.feeder_no_rcd":"Feeder without a 30 mA RCD upstream ({sensitivity_ma} mA): check that the fed board has its own 30 mA RCDs","ee.f.status":"State","ee.f.fed_by":"Fed by","ee.f.fed_auto":"Automatic ({ref})","ee.f.fed_none":"nothing","ee.f.kva":"Subscribed power (kVA)","ee.f.head_rating":"Rating (setting)","ee.add_meter":"+ Meter","ee.add_main_breaker":"+ Main breaker","ee.board_fed_by":"Board fed by","ee.fed_hint":"By default a module is fed by the RCD on its left on the row (or by the service entrance). Pick another element for special wiring.","ee.delete_supply":"Remove from the entrance","el.d.ref":"Reference","el.d.circuit":"Circuit","el.d.areas":"Areas","el.d.protected_by":"Protected by","el.d.no_rcd":"no RCD upstream","el.d.measure":"Measurement","el.d.energy":"Energy","el.d.history":"24 h","el.d.notes":"Notes","el.d.warnings":"To check","el.d.model":"Model","el.d.entities":"Entities","el.d.cable":"{s} mm\xB2 cable","el.d.no_history":"No history","el.d.close":"Close details","el.sensitivity":"{ma} mA","el.type":"type {t}","el.unknown_type":"type ?","el.module_aria":"{kind} {ref} {title} {name}","ck.kind.lighting":"Lighting","ck.kind.sockets":"Sockets","ck.kind.dedicated":"Dedicated circuit","ck.kind.cooking":"Cooking","ck.kind.water_heater":"Water heater","ck.kind.heating":"Heating","ck.kind.feeder":"Feeder / sub-board","ck.kind.other":"Other","ck.kind.unknown":"Unidentified","norm.title":"NF C 15-100 reminder","norm.lighting":"Breaker 16 A at most (10 A usual), 1.5 mm\xB2 cable, at most 8 light points per circuit, behind a 30 mA RCD.","norm.sockets":"16 A on 1.5 mm\xB2: 8 sockets at most; 20 A on 2.5 mm\xB2: 12 sockets at most. 30 mA RCD. Kitchen: 6 sockets, 4 of them above the worktop.","norm.dedicated":"One circuit per appliance (washing machine, dishwasher, dryer, oven, freezer): 20 A, 2.5 mm\xB2. Washing machine: 30 mA type A RCD.","norm.cooking":"Hob or cooker: dedicated circuit 32 A, 6 mm\xB2 single phase, 30 mA type A RCD.","norm.water_heater":"Water heater: dedicated circuit 20 A, 2.5 mm\xB2 (up to 3,500 W), often driven by an off-peak contactor.","norm.heating":"Electric heating: 16 A on 1.5 mm\xB2 up to 3,500 W, 20 A on 2.5 mm\xB2 up to 4,500 W per circuit.","norm.feeder":"Feeder to a sub-board: cable sized for the rating (usually 10 mm\xB2 for 40 A), 30 mA RCDs in the fed board.","norm.guess":"Usual rating of a {kind} circuit","ee.apply_guess":"Use","ee.f.points":"Number of points (sockets or light points)","el.d.points":"Points","el.d.points_max":"{n} ({max} at most)","check.too_many_points":"{count} points on this circuit ({max} at most): to check","check.no_rcd":"No RCD upstream: to check","check.no_rcd_30ma":"No 30 mA RCD upstream ({sensitivity_ma} mA): to check","check.rcd_type_a":"Cooking / washing machine circuit behind a type {rcd_type} RCD ({rcd_ref}): type A expected, to check","check.cable_rating":"{rating_a} A rating on a {cable_mm2} mm\xB2 cable (max {max_a} A): to check","check.kind_rating":"{rating_a} A is high for this kind of circuit (max {max_a} A): to check","check.unidentified":"Unidentified circuit","check.too_many_breakers":"{count} breakers behind this RCD (8 at most advised): to check","check.rcd_sum":"Sum of downstream ratings ({total_a} A) is high for a {rating_a} A RCD (information)","check.disclaimer":"Hints inspired by the French NF C 15-100 standard; they do not replace an electrician.","ee.add_module":"Add a module to row {label}","ee.add_row":"+ Row","ee.add_board":"+ Board","ee.delete_row":"Delete row","ee.delete_board":"Delete board","ee.photo_upload":"Upload photo","ee.photo_uploading":"Uploading photo\u2026","ee.photo_remove":"Remove photo","ee.move_left":"Move \u25C0","ee.move_right":"Move \u25B6","ee.delete":"Delete","ee.select_hint":"Click a module to edit it. Drag and drop or \u25C0 \u25B6 to reorder.","ee.board_name":"Board name","ee.board_location":"Location","ee.board_area":"Area","ee.row_label":"Row name","ee.f.kind":"Kind","ee.f.ref":"Reference","ee.f.rating":"Rating \xB7 curve","ee.f.rcd_rating":"Rating","ee.f.sensitivity":"Sensitivity","ee.f.rcd_type":"RCD type","ee.f.circuit":"Circuit","ee.f.circuit_kind":"Circuit kind","ee.f.areas":"Areas","ee.f.power":"Power sensor","ee.f.energy":"Energy sensor","ee.f.switch":"Linked switch / relay (off when off)","ee.f.cable":"Cable cross-section","ee.f.width":"Width (DIN modules)","ee.f.model":"Model","ee.f.notes":"Notes","ee.f.label":"Label","ee.f.entities":"Linked entities (comma separated)","ee.none":"\u2014","net.online":"{n} device(s) online","net.offline":"{n} offline","net.no_devices":"No device yet. Use edit mode (pencil) to add some or import from OPNsense.","net.internet":"Internet","net.port":"port {n}","net.offline_short":"offline","net.unplaced":"No known port","net.wifi_under":"via {name}","net.vlan_tag":"VLAN {tag}","net.untagged":"untagged","net.no_vlan":"No VLAN","net.devices_n":"{n} device(s)","net.no_switch":"No switch declared. Add an SNMP source (integration options) or import a file.","net.switch_unavailable":"Switch unreachable: last known data.","net.port_detail":"Port {n}","net.speed":"{s}","net.poe":"PoE","net.vlans_line":"native {pvid} \xB7 tagged {tagged}","net.lldp":"LLDP neighbour","net.seen":"Devices seen","net.macs":"{n} MAC address(es)","net.link_down":"link down","net.link_up":"link up","net.ping_unavailable":"Ping unavailable (ICMP permissions): see the README.","net.gateway":"{name} {delay}","kind.router":"Router","kind.switch":"Switch","kind.ap":"Wi-Fi access point","kind.server":"Server","kind.nas":"NAS","kind.camera":"Camera","kind.iot":"IoT device","kind.computer":"Computer","kind.phone":"Phone","kind.printer":"Printer","kind.other":"Other","ds.tab.info":"Info","ds.tab.firewall":"Firewall","ds.tab.history":"History","ds.close":"Close","ds.online":"Online","ds.online_ms":"Online \xB7 {ms} ms","ds.offline":"Offline","ds.unknown":"Unknown state","ds.blocks_today":"{n} block(s) over 24 h","ds.ip":"Address","ds.mac":"MAC","ds.vlan":"VLAN","ds.port":"Switch port","ds.port_value":"{port} \xB7 {switch}","ds.port_auto":"detected","ds.port_manual":"manual","ds.last_seen":"seen {date}","ds.area":"Area","ds.kind":"Kind","ds.parent":"Parent device","ds.sensors":"Sensors","ds.notes":"Notes","ds.no_sensor":"none","fw.loading":"Analysing the firewall\u2026","fw.not_configured":"OPNsense is not configured, or firewall analysis is disabled (integration options).","fw.unavailable":"OPNsense is unreachable: analysis unavailable.","fw.not_an_ip":"Firewall analysis needs an IP address.","fw.what_can":"What the device can do \xB7 in evaluation order","fw.col.rule":"Rule (OPNsense description)","fw.col.to":"To","fw.col.today":"Today","fw.pass":"allowed","fw.block":"blocked","fw.own_rule":"rule specific to this device","fw.probable":"probable","fw.floating":"floating","fw.blocked_n":"{n} blocked","fw.default_deny":"No rule matches afterwards: blocked by default.","fw.unreachable":"{n} following rule(s) never reached.","fw.redundant":"Rule(s) hidden because a later rule covers them: {list}","fw.who":"Who can reach it","fw.same_network":"same network (not filtered)","fw.partial":"partial","fw.nat":"NAT forward: port {ext} \u2192 {target}","fw.recent":"Recent blocks","fw.col.time":"Time","fw.col.dest":"Destination","fw.col.name":"Name","fw.col.by":"Blocked by","fw.default_rule":"default / automatic rule","fw.no_blocks":"No recent block.","fw.readonly":"Read-only: nothing is changed on the router. Names come from the router DNS log (probable).","fw.dest.any":"Internet / anywhere","fw.dest.router":"router ({ip})","fw.dest.private":"internal networks","fw.dest.network":"{name} network","fw.not":"anything but {x}","fw.reason.no_sequence":"order not guaranteed (no sequence number)","fw.reason.not_quick":"non-quick floating rule","fw.reason.tagged":"tagged rule","fw.reason.route_to":"policy routing","fw.reason.interface_not":"inverted interfaces","fw.reason.ports_unresolved":"unresolved ports","fw.reason.alias_url":"URL alias","fw.reason.alias_urltable":"URL alias","fw.reason.alias_urljson":"URL alias","fw.reason.alias_geoip":"GeoIP alias","fw.reason.alias_mac":"MAC alias","fw.reason.alias_asn":"ASN alias","fw.reason.alias_dynipv6host":"dynamic IPv6 alias","fw.reason.alias_authgroup":"group alias","fw.reason.alias_internal":"internal alias","fw.reason.alias_unresolved":"unresolved alias","fw.reason.unknown_token":"unknown address","fw.reason.source_unresolved":"undetermined source","fw.reason.destination_unresolved":"undetermined destination","hist.presence":"Presence \xB7 24 h","hist.latency":"Latency \xB7 24 h","hist.none":"No presence or latency sensor for this device.","ne.add":"+ Add a device","ne.import_opnsense":"Import everything from OPNsense","ne.add_title":"Add a device","ne.edit_title":"Edit \xB7 {name}","ne.create":"Create","ne.f.name":"Name","ne.f.host":"IP address or host name","ne.f.vlan":"Network (VLAN)","ne.f.mac":"MAC address","ne.f.switch":"Switch","ne.f.port":"Switch port","ne.f.port_source":"Pin the port (manual)","ne.f.area":"Area","ne.f.kind":"Kind","ne.f.parent":"Parent device (access point, repeater)","ne.f.model":"Model","ne.f.notes":"Notes","ne.probe":"Test","ne.probing":"Testing\u2026","ne.answers":"answers \xB7 {ms} ms","ne.no_answer":"no answer","ne.vlan_detected":"detected from the IP","ne.mac_detected":"read on the router ({source})","ne.port_detected":"read on the switch","ne.port_via":"{port} (via {via})","ne.sensors":"Sensors to create","ne.s.ping":"Presence (ping)","ne.s.latency":"Latency","ne.s.tcp":"TCP port","ne.s.alert":"Alert when offline for more than (min)","ne.interval":'Interval: {s} s \xB7 grouped under an HA device "{name}".',"ne.devices":"Declared devices","ne.col.name":"Name","ne.col.ip":"IP","ne.col.vlan":"VLAN","ne.col.port":"Port","ne.col.sensors":"Sensors","ne.edit":"Edit","ne.delete":"Delete","ne.s.short.ping":"presence","ne.s.short.latency":"latency","ne.s.short.tcp":"port {p}","ne.s.short.alert":"alert","ne.vlans":"VLANs","ne.vlan_add":"+ VLAN","ne.v.name":"Name","ne.v.tag":"Tag","ne.v.subnet":"Subnet","ne.v.color":"Colour","ne.v.role":"Role","ne.v.access":"Access","ne.uplink":"Internet link","ne.u.isp":"Internet provider","ne.u.box_name":"Box","ne.u.box_ip":"Box IP","ne.u.public_ip":"Public IP","ne.save_network":"Save","ne.import_title":"Import from OPNsense","ne.import_hint":'Nothing is written before "Import selection". Devices already declared are skipped; only the presence sensor is enabled.',"ne.import_apply":"Import selection","ne.import_none":"OPNsense has nothing to import.","ne.exists":"already declared","ne.loading":"Reading OPNsense\u2026","ne.required":"Name is required."},yi={fr:wi,en:$e};function we(i){const e=i?.locale?.language??i?.language??(typeof navigator<"u"?navigator.language:"fr");return String(e||"fr").split("-")[0].toLowerCase()==="fr"?"fr":"en"}function L(i){const e=yi[i]??$e;return(t,n)=>{let a=e[t]??$e[t]??t;if(n)for(const[s,r]of Object.entries(n))a=a.split(`{${s}}`).join(r==null?"?":String(r));return a}}const B=Lt`
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
  .warnlist li.manual {
    font-weight: 500;
  }
  .norm {
    font-size: 12.5px;
    line-height: 1.35;
    border-left: 3px solid var(--him-accent);
    padding: 2px 0 2px 8px;
  }
  div.norm .btn {
    margin-left: 6px;
    padding: 2px 8px;
  }
  .alert-text {
    white-space: pre-line;
    color: color-mix(in srgb, var(--him-warn) 75%, var(--him-ink));
    font-weight: 500;
  }
  .alert-text.info {
    color: var(--him-ink);
    font-weight: 400;
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
  /* switched off / tripped: lever down */
  .m.off {
    border-color: var(--him-bad);
    filter: saturate(0.35);
  }
  /* spare: installed for future works, not wired */
  .m.spare {
    background: repeating-linear-gradient(
      135deg,
      var(--him-mod) 0 6px,
      color-mix(in srgb, var(--him-line) 70%, var(--him-mod)) 6px 8px
    );
    border-style: dashed;
    color: var(--him-muted);
  }
  .tag {
    align-self: flex-start;
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    padding: 0 4px;
    border-radius: 3px;
    line-height: 14px;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }
  .m .tag {
    margin-top: auto;
  }
  .m .tag + .w {
    margin-top: 0;
  }
  .tag.off {
    background: var(--him-bad);
    color: #fff;
  }
  .tag.spare {
    background: var(--him-line);
    color: var(--him-ink);
  }
  .tag.inline {
    display: inline-block;
    font-size: 11px;
  }
  /* alert written by the owner */
  .m.al,
  .sup.al {
    border: 2px solid var(--him-warn);
  }
  .m.al.al-info,
  .sup.al.al-info {
    border-color: var(--him-accent);
  }
  .amark-chip {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--him-warn);
    color: #000;
    font: 700 10px/14px var(--him-mono, monospace);
    text-align: center;
  }
  .amark {
    position: absolute;
    bottom: 3px;
    right: 3px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: var(--him-warn);
    color: #000;
    font: 700 11px/15px var(--him-mono, monospace);
    text-align: center;
  }
  .al-info .amark {
    background: var(--him-accent);
    color: #fff;
  }
  .sup .amark {
    position: static;
    flex: none;
  }
  /* explicit feed (not the RCD on the left) */
  .m .fxmark {
    position: absolute;
    top: 2px;
    right: 14px;
    font-size: 11px;
    line-height: 1;
    color: var(--him-accent);
    font-weight: 700;
  }
  .m.fx {
    border-left: 3px solid var(--him-accent);
  }
  /* feed links of the selected module */
  .board.linking .m:not(.up):not(.down):not(.sel):not(.free),
  .board.linking .sup:not(.up):not(.down):not(.sel) {
    opacity: 0.4;
  }
  .m.up,
  .sup.up {
    box-shadow: inset 0 0 0 2px var(--him-accent);
  }
  .m.down,
  .sup.down {
    box-shadow: inset 0 -3px 0 var(--him-accent);
  }
  /* service entrance */
  .supply {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    background: var(--him-card);
    border-radius: 7px;
    padding: 5px;
  }
  .sup {
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 56px;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid var(--him-line);
    background: var(--him-mod);
    color: var(--him-ink);
    cursor: pointer;
  }
  .sup.meter {
    background: color-mix(in srgb, #8bc34a 22%, var(--him-mod));
  }
  .sup.main_breaker {
    background: var(--him-diff);
    color: var(--him-diff-ink);
    border-color: transparent;
  }
  .sup .txt {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
  }
  .sup small {
    font-size: 10.5px;
    opacity: 0.8;
  }
  .sup b {
    font-size: 14px;
  }
  .sup .w {
    font-family: var(--him-mono);
    font-size: 12px;
    font-weight: 500;
  }
  .sup .load {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
  }
  .sup .bar {
    width: 48px;
    height: 6px;
    border-radius: 3px;
    background: color-mix(in srgb, currentColor 20%, transparent);
    overflow: hidden;
  }
  .sup .bar > span {
    display: block;
    height: 100%;
    background: var(--him-ok);
  }
  .sup .bar > span.hot {
    background: var(--him-warn);
  }
  .sup.sel {
    outline: 2px solid var(--him-accent);
    outline-offset: 1px;
  }
  .supply .arrow {
    color: var(--him-muted);
  }
  .supply .rl {
    align-self: stretch;
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
`;function A(i,e,t){i.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}function it(i,e){A(i,"hass-more-info",{entityId:e})}function T(i,e){A(i,"hass-notification",{message:e})}let ye=null;function nt(){return customElements.get("ha-selector")?Promise.resolve():ye||(ye=(async()=>{try{const i=await window.loadCardHelpers?.();if(!i)return;await(await i.createCardElement({type:"entities",entities:[]}))?.constructor?.getConfigElement?.(),await customElements.get("hui-tile-card")?.getConfigElement?.()}catch{}})(),ye)}function at(){return!!customElements.get("ha-selector")}function K(i,e,t,n,a,s,r){if(at()){const p=a?{domain:"sensor",device_class:a}:r?{domain:r}:void 0;return o`<div class="f">
      <ha-selector
        .hass=${i}
        .selector=${{entity:p?{filter:p}:{}}}
        .value=${n??""}
        .label=${t}
        @value-changed=${u=>s(u.detail?.value||null)}
      ></ha-selector>
    </div>`}const c=Object.keys(i.states).filter(p=>!a||i.states[p]?.attributes?.device_class===a).filter(p=>!r||r.includes(p.split(".")[0])).sort();return o`<div class="f">
    <label for=${e}>${t}</label>
    <input
      class="inp"
      id=${e}
      list=${`${e}-list`}
      .value=${n??""}
      @change=${p=>s(p.target.value.trim()||null)}
    />
    <datalist id=${`${e}-list`}>${c.map(p=>o`<option value=${p}></option>`)}</datalist>
  </div>`}function ke(i,e){return e.filter(t=>!!t).map(t=>i?.areas?.[t]?.name??t)}function xe(i,e,t,n,a,s){const r=Array.isArray(n)?n:n?[n]:[];if(at())return o`<div class="f">
      <ha-selector
        .hass=${i}
        .selector=${{area:{multiple:a}}}
        .value=${a?r:r[0]??""}
        .label=${t}
        @value-changed=${p=>{const u=p.detail?.value;s(Array.isArray(u)?u:u?[u]:[])}}
      ></ha-selector>
    </div>`;const c=Object.values(i.areas??{}).sort((p,u)=>p.name.localeCompare(u.name));return o`<div class="f">
    <label for=${e}>${t}</label>
    <select
      class="sel"
      id=${e}
      ?multiple=${a}
      @change=${p=>{const u=p.target;s(Array.from(u.selectedOptions).map(d=>d.value).filter(Boolean))}}
    >
      ${a?l:o`<option value="" ?selected=${!r.length}>—</option>`}
      ${c.map(p=>o`<option value=${p.area_id} ?selected=${r.includes(p.area_id)}>${p.name}</option>`)}
    </select>
  </div>`}function g(i,e,t,n,a={}){return o`<div class="f">
    <label for=${i}>${e}</label>
    ${a.suggestions?o`<datalist id=${`${i}-list`}>${a.suggestions.map(s=>o`<option value=${s}></option>`)}</datalist>`:l}
    <input
      class="inp"
      id=${i}
      list=${a.suggestions?`${i}-list`:l}
      type=${a.type??"text"}
      placeholder=${a.placeholder??""}
      .value=${t==null?"":String(t)}
      @input=${s=>n(s.target.value)}
      @blur=${()=>a.onBlur?.()}
    />
    ${a.hint??l}
  </div>`}function w(i,e,t,n,a){return o`<div class="f">
    <label for=${i}>${e}</label>
    <select class="sel" id=${i} @change=${s=>a(s.target.value)}>
      ${n.map(s=>o`<option value=${String(s.value)} ?selected=${String(s.value)===String(t??"")}>${s.label}</option>`)}
    </select>
  </div>`}async function ki(i){try{return await navigator.clipboard.writeText(i),!0}catch{const e=document.createElement("textarea");e.value=i,document.body.appendChild(e),e.select();const t=document.execCommand?.("copy")??!1;return e.remove(),t}}function xi(i,e){if(!i)return"\u2014";const t=new Date(i);return Number.isNaN(t.getTime())?i:t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}function Ai(i,e){if(!i)return"\u2014";const t=new Date(i);return Number.isNaN(t.getTime())?i:t.toLocaleString(e,{dateStyle:"short",timeStyle:"short"})}const Ae=class extends S{constructor(){super(),this._loaded=!1,this._config={type:"custom:home-infra-map-card"},this._boards=[]}setConfig(e){this._config={...e&&typeof e=="object"?e:{type:"custom:home-infra-map-card"}}}updated(){!this._loaded&&this.hass&&(this._loaded=!0,ge(this.hass).then(e=>this._boards=e.model.boards).catch(()=>this._boards=[]))}_set(e,t){const n={...this._config};t===""?delete n[e]:n[e]=t,this._config=n,A(this,"config-changed",{config:this._config})}render(){const e=L(we(this.hass)),t=this._config,n=(a,s,r,c)=>o`<div class="f">
        <label for=${`cfg-${a}`}>${s}</label>
        <select class="sel" id=${`cfg-${a}`} @change=${p=>this._set(a,p.target.value)}>
          ${c.map(([p,u])=>o`<option value=${p} ?selected=${(r??"")===p}>${u}</option>`)}
        </select>
      </div>`;return o`<div class="form" style="border:0;padding:0">
      <div class="f">
        <label for="cfg-title">Titre / Title</label>
        <input class="inp" id="cfg-title" .value=${t.title??""} @change=${a=>this._set("title",a.target.value)} />
      </div>
      ${n("view","Vue / View",t.view??"electricity",[["electricity",e("view.electricity")],["network",e("view.network")]])}
      ${this._boards.length?n("board",e("el.board"),t.board,[["","\u2014"],...this._boards.map(a=>[a.id,a.name])]):l}
      ${n("network_view",`${e("view.network")}`,t.network_view??"topology",[["topology",e("nview.topology")],["vlan",e("nview.vlan")],["switch",e("nview.switch")]])}
    </div>`}};Ae.styles=B,Ae.properties={hass:{attribute:!1},_config:{state:!0},_boards:{state:!0}};let Si=Ae;function j(i,e,t){return i[e]?.find(n=>n.key===t)?.entity_id??null}function ae(i,e,t){const n=j(e.entities,i.id,"online"),a=n&&t?t.states[n]:void 0;if(a)return a.state==="on"?"online":a.state==="off"?"offline":"unknown";const s=e.live.ping[i.id];return!s||s.alive===null||s.alive===void 0?"unknown":s.alive?"online":"offline"}function st(i,e,t){const n=j(e.entities,i.id,"latency"),a=n&&t?t.states[n]:void 0;if(a){const s=Number(a.state);if(Number.isFinite(s))return s}return e.live.ping[i.id]?.rtt_ms??null}function Ci(i,e){const t=new Map;for(const n of i)n.switch_id!==e||n.port===null||n.parent_device_id||(t.has(n.port)||t.set(n.port,[]),t.get(n.port).push(n));return[...t.entries()].sort((n,a)=>n[0]-a[0]).map(([n,a])=>({port:n,devices:se(a)}))}const rt={router:0,switch:1,ap:2,server:3,nas:4};function se(i){return i.slice().sort((e,t)=>(rt[e.kind]??9)-(rt[t.kind]??9)||e.name.localeCompare(t.name))}function Pi(i,e){return se(i.filter(t=>t.parent_device_id===e))}function Ni(i,e){const t=new Set(e.map(n=>n.id));return se(i.filter(n=>!n.parent_device_id&&!(n.switch_id&&t.has(n.switch_id)&&n.port!==null)))}function re(i){const e=i.split(".");return e.length===4&&e.every(t=>/^\d+$/.test(t))?e.map(t=>t.padStart(3,"0")).join("."):i}function Ii(i,e){let t=0,n=0;for(const a of i.model.network.devices){if(!a.monitor.ping)continue;const s=ae(a,i,e);s==="online"&&(t+=1),s==="offline"&&(n+=1)}return{online:t,offline:n}}function Ei(i,e,t,n=[]){const a=new Set(n.map(s=>s.toLowerCase()));return se(i.filter(s=>s.switch_id===e.id&&s.port===t||s.mac&&a.has(s.mac.toLowerCase())))}function Mi(){return{columns:"full",rows:"auto",min_columns:6,min_rows:4}}function Ri(){return 8}function ot(i){if(!i)return[];const e=[];for(const t of i){const n=t.s??t.state,a=Number(n),s=t.lu??t.lc??(t.last_updated?Date.parse(t.last_updated)/1e3:void 0);!Number.isFinite(a)||s===void 0||e.push({t:Number(s)*1e3,v:a})}return e}function lt(i,e,t,n=200,a=42){if(!i.length||t<=e)return{line:"",area:""};const s=Math.max(...i.map(f=>f.v),1),r=f=>(Math.min(Math.max(f,e),t)-e)/(t-e)*n,c=f=>a-2-Math.max(f,0)/s*(a-4),p=i.map(f=>`${r(f.t).toFixed(1)} ${c(f.v).toFixed(1)}`),u=i[i.length-1];p.push(`${n} ${c(u.v).toFixed(1)}`);const d=`M${p.join(" L")}`,m=`${d} L${n} ${a} L${r(i[0].t).toFixed(1)} ${a}Z`;return{line:d,area:m}}function Ti(i,e,t){if(!i?.length)return[];const n=[],a=i.map(s=>({t:Number(s.lu??s.lc??Date.parse(s.last_updated)/1e3)*1e3,s:String(s.s??s.state)})).filter(s=>Number.isFinite(s.t)).sort((s,r)=>s.t-r.t);return a.forEach((s,r)=>{const c=Math.max(s.t,e),p=r+1<a.length?a[r+1].t:t;p<=c||n.push({from:c,to:p,on:s.s==="on"?!0:s.s==="off"?!1:null})}),n}function C(i,e,t,...n){(i==="error"?console.error:i==="warn"?console.warn:console.info)(`%cHOME-INFRA-MAP%c [${e}] ${t}`,"color:#0b6bcb;font-weight:bold","",...n)}const dt=[],ct=new Map,Di=3;function G(i,e){dt.push([i,e]),customElements.get(i)||customElements.define(i,e)}function Oi(){let i=0;for(const[e,t]of dt){if(customElements.get(e))continue;const n=ct.get(e)??0;if(!(n>=Di)){ct.set(e,n+1);try{customElements.define(e,class extends t{}),i+=1,C("warn","register","re-registered %s at t=%dms: the element registry was replaced",e,Math.round(performance.now()))}catch(a){C("error","register","cannot re-register %s: %o",e,a)}}}return i}function zi(i){let e=0;const t=n=>{if(n.localName==="hui-error-card"){const a=n,s=a._config??a.config;`${s?.message??""} ${s?.error??""}`.includes(i)&&(n.dispatchEvent(new CustomEvent("ll-rebuild",{bubbles:!0,composed:!0})),e+=1);return}for(const a of[...n.shadowRoot?.children??[],...n.children])t(a)};return document.body&&t(document.body),e}function Li(i){for(const e of[0,50,150,400,1e3,2e3,4e3])window.setTimeout(()=>{try{Oi();const t=zi(i);t&&C("warn","register","%d error card(s) rebuilt after %dms",t,e)}catch(t){C("error","register","repair failed: %o",t)}},e)}const ht="0.4.0";function pt(i){return i==="online"?"dot":i==="offline"?"dot bad":"dot off"}function ut(i,e){if(!i.monitor.ping)return o`<span class="dot off" aria-hidden="true"></span>`;const t=ae(i,e.payload,e.hass);return o`<span class=${pt(t)} role="img" aria-label=${t==="online"?e.t("ds.online"):t==="offline"?e.t("ds.offline"):e.t("ds.unknown")}></span>`}function ji(i,e){const t=[i.host];if(i.monitor.ping){const n=ae(i,e.payload,e.hass);if(n==="offline")t.push(e.t("net.offline_short"));else if(n==="online"){const a=st(i,e.payload,e.hass);a!==null&&t.push(`${Math.round(a*10)/10} ms`)}}return t.filter(Boolean).join(" \xB7 ")}function mt(i,e,t,n=""){return o`<button
    class="tn"
    style=${`margin-left:calc(var(--him-indent) * ${t})`}
    data-device-id=${i.id}
    @click=${()=>e.onOpenDevice(i.id)}
  >
    ${ut(i,e)}
    <span class="name">${i.name}${n?o`<span class="muted"> · ${n}</span>`:l}</span>
    <span class="ip num">${ji(i,e)}</span>
  </button>`}function Fi(i,e){let t;switch(i.kind){case"any":t=e("fw.dest.any");break;case"router":t=e("fw.dest.router",{ip:i.value});break;case"private":t=e("fw.dest.private");break;case"network":t=e("fw.dest.network",{name:i.label||i.value});break;case"address":t=i.label?`${i.label} (${i.value})`:i.value;break;case"alias":t=i.value;break;default:t=i.value||i.label}return i.not?e("fw.not",{x:t}):t}function Se(i,e){return i.map(t=>e(`fw.reason.${t}`)).join(", ")}function Ui(i,e,t,n){if(n)return o`<div class="banner">${e("card.error",{error:n})}</div>`;if(!i)return o`<div class="muted">${e("fw.loading")}</div>`;if(!i.available){const r=i.reason==="unavailable"?"fw.unavailable":i.reason==="not_an_ip"?"fw.not_an_ip":"fw.not_configured";return o`<div class="empty">${e(r)}</div>`}const a=i.outbound,s=i.rule_hits??{};return o`
    <h3>${e("fw.what_can")}</h3>
    <div class="scroll">
      <table class="tbl fw-out">
        <thead>
          <tr><th aria-label=${e("fw.col.rule")}></th><th>${e("fw.col.rule")}</th><th>${e("fw.col.to")}</th><th>${e("fw.col.today")}</th></tr>
        </thead>
        <tbody>
          ${a.rules.map(r=>{const c=r.action==="pass",p=r.uuid?s[r.uuid]:void 0,u=Fi(r.destination,e)+(r.ports?`:${r.ports}`:"");return o`<tr class=${r.specific?"hl":""} data-uuid=${r.uuid??""} data-action=${r.action}>
              <td><span class=${`act ${c?"pass":"block"}`} role="img" aria-label=${e(c?"fw.pass":"fw.block")}>${c?"\u2713":"\u2715"}</span></td>
              <td>
                ${r.specific?o`<b class="desc">${r.description}</b> <span class="ent">· ${e("fw.own_rule")}</span>`:o`<span class="desc">${r.description}</span>`}
                ${r.floating?o` <span class="badge">${e("fw.floating")}</span>`:l}
                ${r.probable?o` <span class="badge warn" title=${Se(r.reasons,e)}>${e("fw.probable")}</span>`:l}
                ${r.probable?o`<div class="muted small">${Se(r.reasons,e)}</div>`:l}
              </td>
              <td class="num">${u}${r.protocol!=="any"?o` <span class="muted">${r.protocol}</span>`:l}</td>
              <td class="num">
                ${p?c?String(p):o`<span style="color:var(--him-warn)">${e("fw.blocked_n",{n:p})}</span>`:"\u2014"}
              </td>
            </tr>`})}
        </tbody>
      </table>
    </div>
    ${a.default_deny?o`<div class="muted small">${e("fw.default_deny")}</div>`:l}
    ${a.unreachable_count?o`<div class="muted small">${e("fw.unreachable",{n:a.unreachable_count})}</div>`:l}
    ${a.redundant.length?o`<div class="muted small">${e("fw.redundant",{list:a.redundant.map(r=>`\xAB ${r.description} \xBB`).join(", ")})}</div>`:l}
    <h3>${e("fw.who")}</h3>
    <div class="chips fw-in">
      ${(i.inbound??[]).map(r=>{const c=r.verdict==="allowed"?"dot":r.verdict==="blocked"?"dot bad":r.verdict==="partial"?"dot warn":"dot off",p=[r.rule?.description,r.ports,r.probable?Se(r.reasons,e):""].filter(Boolean).join(" \xB7 ");return o`<span class="chip" title=${p} data-verdict=${r.verdict}>
          <span class=${c}></span>${r.label}
          ${r.verdict==="partial"?o`<span class="muted small">${e("fw.partial")}${r.ports?` ${r.ports}`:""}</span>`:l}
          ${r.verdict==="same_network"?o`<span class="muted small">${e("fw.same_network")}</span>`:l}
          ${r.probable?o`<span class="badge warn">${e("fw.probable")}</span>`:l}
        </span>`})}
    </div>
    ${(i.nat??[]).map(r=>o`<div class="muted small">${e("fw.nat",{ext:r.external_port||"?",target:r.target_port||r.external_port||"?"})}${r.description?` \xB7 ${r.description}`:""}</div>`)}
    <h3>${e("fw.recent")}</h3>
    ${(i.blocks??[]).length?o`<div class="scroll">
          <table class="tbl fw-blocks">
            <thead><tr><th>${e("fw.col.time")}</th><th>${e("fw.col.dest")}</th><th>${e("fw.col.name")}</th><th>${e("fw.col.by")}</th></tr></thead>
            <tbody>
              ${(i.blocks??[]).map(r=>o`<tr>
                  <td class="num">${xi(r.time,t)}</td>
                  <td class="num">${r.destination}${r.port?`:${r.port}`:""}</td>
                  <td>${r.dns_name??"\u2014"}</td>
                  <td>${r.rule??o`<span class="muted">${e("fw.default_rule")}</span>`}</td>
                </tr>`)}
            </tbody>
          </table>
        </div>`:o`<div class="muted small">${e("fw.no_blocks")}</div>`}
    <p class="muted small">${e("fw.readonly")}</p>
  `}const Ce=class extends S{constructor(){super(),this._loadedFw=null,this._loadedHist=null,this._keyHandler=e=>{e.key==="Escape"&&this._close()},this.tab="info",this.deviceId=null,this._report=null,this._history=null}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keyHandler)}disconnectedCallback(){window.removeEventListener("keydown",this._keyHandler),super.disconnectedCallback()}get _device(){return this.payload?.model.network.devices.find(e=>e.id===this.deviceId)}get _t(){return L(this._lang)}get _lang(){return(this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en"}updated(e){if(e.has("deviceId")&&(this._report=null,this._history=null,this._loadedFw=null,this._loadedHist=null,this.renderRoot.querySelector('.sheet [role="tab"][aria-selected="true"]')?.focus()),this.tab==="firewall"&&this.hass&&this.deviceId&&this._loadedFw!==this.deviceId&&(this._loadedFw=this.deviceId,this._fwError=void 0,fi(this.hass,this.deviceId).then(t=>this._report=t).catch(t=>this._fwError=x(t))),this.tab==="history"&&this.hass&&this.payload&&this.deviceId&&this._loadedHist!==this.deviceId){this._loadedHist=this.deviceId;const t=["online","latency"].map(n=>j(this.payload.entities,this.deviceId,n)).filter(n=>!!n);et(this.hass,t).then(n=>this._history=n).catch(()=>this._history={})}}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_setTab(e){this.tab=e}_onTabKey(e){const t=["info","firewall","history"],n=t.indexOf(this.tab);(e.key==="ArrowRight"||e.key==="ArrowLeft")&&(e.preventDefault(),this.tab=t[(n+(e.key==="ArrowRight"?1:t.length-1))%t.length],this.updateComplete.then(()=>this.renderRoot.querySelector('.sheet [role="tab"][aria-selected="true"]')?.focus()))}render(){const e=this._device,t=this._t;if(!e||!this.payload)return o``;const n=this.payload,a=e.monitor.ping?ae(e,n,this.hass):"unknown",s=st(e,n,this.hass),r=n.model.network.vlans.find(d=>d.id===e.vlan_id),c=j(n.entities,e.id,"blocks"),p=c?Number(this.hass?.states[c]?.state):NaN,u=[["info",t("ds.tab.info")],["firewall",t("ds.tab.firewall")],["history",t("ds.tab.history")]];return o`<div class="overlay" @click=${d=>d.target===d.currentTarget&&this._close()}>
      <div class="sheet" role="dialog" aria-modal="true" aria-label=${e.name}>
        <div class="head">
          <span class="title">${e.name}</span>
          <div class="head-actions">
            <div class="seg" role="tablist" @keydown=${this._onTabKey}>
              ${u.map(([d,m])=>o`<button
                  role="tab"
                  aria-selected=${this.tab===d?"true":"false"}
                  tabindex=${this.tab===d?"0":"-1"}
                  @click=${()=>this._setTab(d)}
                >
                  ${m}
                </button>`)}
            </div>
            <button class="icon-btn" aria-label=${t("ds.close")} @click=${this._close}>✕</button>
          </div>
        </div>
        <div class="body">
          <div class="chips">
            ${e.monitor.ping?o`<span class="chip"><span class=${pt(a)}></span>${a==="online"?s!==null?t("ds.online_ms",{ms:Math.round(s*10)/10}):t("ds.online"):t(a==="offline"?"ds.offline":"ds.unknown")}</span>`:l}
            <span class="chip num">${[e.host,r?.name,e.port!==null?t("net.port",{n:e.port}):""].filter(Boolean).join(" \xB7 ")}</span>
            ${Number.isFinite(p)&&p>0?o`<span class="chip"><span class="dot warn"></span>${t("ds.blocks_today",{n:p})}</span>`:l}
          </div>
          ${this.tab==="info"?this._renderInfo(e):l}
          ${this.tab==="firewall"?Ui(this._report,t,this._lang,this._fwError):l}
          ${this.tab==="history"?this._renderHistory(e):l}
        </div>
      </div>
    </div>`}_renderInfo(e){const t=this._t,n=this.payload,a=n.model.network,s=a.vlans.find(u=>u.id===e.vlan_id),r=a.switches.find(u=>u.id===e.switch_id),c=a.devices.find(u=>u.id===e.parent_device_id),p=n.entities[e.id]??[];return o`<dl class="detail">
      <dt>${t("ds.ip")}</dt><dd class="num">${e.host||"\u2014"}</dd>
      <dt>${t("ds.mac")}</dt><dd class="num">${e.mac??"\u2014"}</dd>
      <dt>${t("ds.vlan")}</dt><dd>${s?`${s.name}${s.subnet?` \xB7 ${s.subnet}`:""}`:"\u2014"}</dd>
      <dt>${t("ds.port")}</dt>
      <dd>
        ${e.port!==null?o`${t("ds.port_value",{port:e.port,switch:r?.name??"?"})}
              <span class="muted small">
                · ${e.port_source==="manual"?t("ds.port_manual"):t("ds.port_auto")}
                ${e.last_seen_port_at?` \xB7 ${t("ds.last_seen",{date:Ai(e.last_seen_port_at,this._lang)})}`:""}
              </span>`:"\u2014"}
      </dd>
      <dt>${t("ds.area")}</dt><dd>${ke(this.hass,[e.area_id]).join("")||"\u2014"}</dd>
      <dt>${t("ds.kind")}</dt><dd>${t(`kind.${e.kind}`)}${e.model?` \xB7 ${e.model}`:""}</dd>
      ${c?o`<dt>${t("ds.parent")}</dt><dd>${c.name}</dd>`:l}
      <dt>${t("ds.sensors")}</dt>
      <dd>
        ${p.length?p.map(u=>o`<button class="ent" @click=${()=>it(this,u.entity_id)}>${u.entity_id}</button><br />`):t("ds.no_sensor")}
      </dd>
      ${e.notes?o`<dt>${t("ds.notes")}</dt><dd style="white-space:pre-line">${e.notes}</dd>`:l}
    </dl>`}_renderHistory(e){const t=this._t,n=this.payload,a=j(n.entities,e.id,"online"),s=j(n.entities,e.id,"latency");if(!a&&!s)return o`<div class="empty">${t("hist.none")}</div>`;if(this._history===null)return o`<div class="muted">${t("card.loading")}</div>`;const r=Date.now(),c=r-24*3600*1e3,p=a?Ti(this._history[a],c,r):[],u=s?ot(this._history[s]):[],{line:d,area:m}=lt(u,c,r,200,60);return o`
      ${a?o`<h3>${t("hist.presence")}</h3>
            <div class="timeline" role="img" aria-label=${t("hist.presence")}>
              ${p.map(f=>o`<span class=${f.on===!0?"on":f.on===!1?"off":"na"} style=${`flex:${f.to-f.from}`}></span>`)}
            </div>`:l}
      ${s?o`<h3>${t("hist.latency")}</h3>
            ${d?o`<svg class="spark" style="height:60px" viewBox="0 0 200 60" preserveAspectRatio="none" role="img" aria-label=${t("hist.latency")}>
                  ${Je`<path d=${m} fill="var(--him-accent)" opacity=".15"></path><path d=${d} fill="none" stroke="var(--him-accent)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
                </svg>
                <span class="muted small num">max ${Math.max(...u.map(f=>f.v)).toFixed(1)} ms</span>`:o`<span class="muted small">${t("el.d.no_history")}</span>`}`:l}
    `}};Ce.styles=B,Ce.properties={hass:{attribute:!1},payload:{attribute:!1},deviceId:{attribute:!1},tab:{attribute:!1},_report:{state:!0},_fwError:{state:!0},_history:{state:!0}};let Hi=Ce;function ft(i){if(i.kind!=="breaker"&&i.kind!=="rcbo"||i.status==="spare")return!1;const e=(i.circuit_name??"").trim();return e===""||e==="?"}function Z(i,e){if(!i||!e)return null;const t=i.states[e];if(!t||t.state==="unavailable"||t.state==="unknown"||t.state==="")return null;const n=Number(t.state);if(!Number.isFinite(n))return null;const a=t.attributes?.unit_of_measurement;return a==="kW"?n*1e3:a==="mW"?n/1e3:n}function _t(i,e){const t=new Set;let n=0,a=0;for(const s of e){if(!s||t.has(s))continue;t.add(s);const r=Z(i,s);r!==null&&(n+=r,a+=1)}return a?n:null}function bt(i){return i.rows.flatMap(e=>e.modules.map(t=>t.power_entity_id).filter(t=>!!t))}function qi(i,e){const t={rcds:0,breakers:0,devices:0,unidentified:0,spare:0,off:0};for(const n of i.rows)for(const a of n.modules)a.kind==="rcd"&&(t.rcds+=1),(a.kind==="breaker"||a.kind==="rcbo")&&(t.breakers+=1),a.kind==="device"&&(t.devices+=1),ft(a)&&(t.unidentified+=1),a.status==="spare"?t.spare+=1:oe(a,e)&&(t.off+=1);return t}function oe(i,e){if(i.status==="off")return!0;const t=i.switch_entity_id;return!!(t&&e?.states[t]?.state==="off")}class Pe{constructor(e){this.modules=new Map,this.boardOf=new Map,this.defaults=new Map;for(const t of e){let n=t.fed_by??null;for(const a of t.supply??[])this.add(a,t,n),n=a.id;for(const a of t.rows){let s=null;for(const r of a.modules)r.kind==="rcd"||r.kind==="meter"||r.kind==="main_breaker"?(this.add(r,t,n),r.kind==="rcd"&&(s=r.id)):this.add(r,t,s??n)}}}add(e,t,n){this.modules.set(e.id,e),this.boardOf.set(e.id,t),this.defaults.set(e.id,n)}defaultFeeder(e){const t=this.defaults.get(e.id);return t?this.modules.get(t)??null:null}feeder(e){const t=(e.fed_by&&this.modules.has(e.fed_by)?e.fed_by:null)??this.defaults.get(e.id);return t?this.modules.get(t)??null:null}chain(e){const t=[],n=new Set([e.id]);let a=this.feeder(e);for(;a&&!n.has(a.id);)t.push(a),n.add(a.id),a=this.feeder(a);return t}protector(e){if(e.kind==="rcbo")return e;for(const t of this.chain(e))if(t.kind==="rcd"||t.kind==="rcbo"||t.kind==="main_breaker"&&t.sensitivity_ma)return t;return null}fed(e){return[...this.modules.values()].filter(t=>this.feeder(t)?.id===e)}downstream(e){const t=new Set,n=[e];for(;n.length;)for(const a of this.fed(n.pop()))t.has(a.id)||a.id===e||(t.add(a.id),n.push(a.id));return t}candidates(e){const t=this.downstream(e.id);return[...this.modules.values()].filter(n=>n.id!==e.id&&!t.has(n.id)&&n.kind!=="spacer")}}function Vi(i,e){return i.filter(t=>t.module_id===e)}function P(i){switch(i.kind){case"rcd":return i.rating_a?`${i.rating_a}A`:"ID";case"breaker":case"rcbo":return i.rating_a?`${i.curve!=="?"?i.curve:""}${i.rating_a}`:"?";case"meter":return i.subscribed_kva?`${String(i.subscribed_kva).replace(".",",")} kVA`:"kVA ?";case"main_breaker":return i.rating_a?`${i.rating_a} A`:"? A";case"device":{const e=i.model&&!i.model.trim().startsWith("?")?i.model.trim():"";return e?e.replace(/^shelly\s+/i,"")||e:(i.label||"?").replace(/\s*\(.*$/,"").trim().split(/\s+/)[0]||"?"}default:return""}}function le(i,e){return i===null?"\u2014":`${new Intl.NumberFormat(e,{maximumFractionDigits:0}).format(Math.round(i))} W`}function vt(i,e){return i===null?"\u2014":Math.abs(i)<1e3?le(i,e):`${new Intl.NumberFormat(e,{maximumFractionDigits:1}).format(i/1e3)} kW`}function Ne(i){return JSON.parse(JSON.stringify(i))}function F(){const i=new Uint8Array(16);return(globalThis.crypto??{getRandomValues:e=>e.map(()=>Math.floor(Math.random()*256))}).getRandomValues(i),Array.from(i,e=>e.toString(16).padStart(2,"0")).join("")}function J(i,e){return{id:F(),kind:i,ref:e,width_modules:i==="meter"?4:i==="rcd"||i==="main_breaker"?2:1,model:i==="meter"?"Linky":null,notes:null,status:"active",fed_by:null,subscribed_kva:null,rating_a:i==="rcd"?40:i==="breaker"||i==="rcbo"?16:i==="main_breaker"?60:null,curve:"C",sensitivity_ma:i==="rcd"||i==="rcbo"?30:i==="main_breaker"?500:null,rcd_type:i==="rcd"||i==="rcbo"?"A":"?",cable_mm2:null,circuit_name:"?",circuit_kind:"unknown",area_ids:[],power_entity_id:null,energy_entity_id:null,switch_entity_id:null,label:i==="device"?"?":"",entity_ids:[]}}function Wi(i,e,t){const n=i.slice();if(e<0||e>=n.length)return n;const[a]=n.splice(e,1),s=Math.max(0,Math.min(t,n.length));return n.splice(s,0,a),n}function Bi(i,e){return e.capacity||i.modules_per_row||null}function Ki(i){return i.modules.reduce((e,t)=>e+Math.max(1,t.width_modules||1),0)}const gt=["lighting","sockets","dedicated","cooking","water_heater","heating","feeder"];function $t(i){return i?i<=10?"lighting":i===16?"sockets":i===20?"dedicated":i===32?"cooking":i>=40?"feeder":null:null}function wt(i){return i.circuit_kind==="lighting"?8:i.circuit_kind==="sockets"?i.rating_a===16?8:i.rating_a===20?12:null:null}function yt(i){return Math.max(1,i.width_modules||1)}function kt(i){return i!==null?"grid-auto-columns:minmax(var(--him-slot-min),1fr)":"grid-auto-columns:minmax(var(--him-slot-min),var(--him-slot))"}function Gi(i,e,t={}){const n=["m"];return i.kind==="rcd"&&n.push("d"),i.kind==="rcbo"&&n.push("d"),i.kind==="device"&&n.push("s"),i.kind==="spacer"&&n.push("sp"),ft(i)&&n.push("u"),i.status==="spare"?n.push("spare"):t.off&&n.push("off"),i.fed_by&&n.push("fx"),i.alert&&n.push(i.alert_level==="info"?"al al-info":"al"),t.link&&n.push(t.link),e&&n.push("sel"),n.join(" ")}function Zi(i,e){switch(i.kind){case"rcd":return`${i.sensitivity_ma?e("el.sensitivity",{ma:i.sensitivity_ma}):"? mA"} \xB7 ${i.rcd_type&&i.rcd_type!=="?"?e("el.type",{t:i.rcd_type}):e("el.unknown_type")}`;case"breaker":case"rcbo":return i.circuit_name||"?";case"device":return P(i)===i.label?i.notes?.split(`
`)[0]??"":i.label;default:return""}}function xt(i,e){const t=Z(e.hass,i.power_entity_id),n=!!i.power_entity_id,a=P(i),s=Zi(i,e.t),r=i.status!=="spare"&&oe(i,e.hass),c=i.status==="spare"?e.t("el.tag.spare"):r?e.t("el.tag.off"):"",p=i.fed_by&&e.feeder?e.t("el.fx",{ref:e.feeder.ref||P(e.feeder)}):"",u=i.alert?e.t("el.alert",{text:i.alert.replace(/\n/g," \xB7 ")}):"",d=[e.t("el.module_aria",{kind:e.t(`el.kind.${i.kind}`),ref:i.ref,title:a,name:s}),c,p,u].filter(Boolean).join(" \xB7 ");return o`<button
    class=${Gi(i,e.selected,{off:r,link:e.link??null})}
    style=${`grid-column:span ${yt(i)}`}
    data-module-id=${i.id}
    data-kind=${i.kind}
    aria-label=${d}
    aria-pressed=${e.selected?"true":"false"}
    title=${[i.ref,s,c,p,u].filter(Boolean).join(" \xB7 ")}
    @click=${e.onClick}
  >
    ${p?o`<span class="fxmark" aria-hidden="true">↱</span>`:l}
    ${n?o`<span class=${`led${t!==null&&t>0?" on":""}`}></span>`:l}
    <b>${a}</b><small>${s}</small>
    ${c?o`<span class=${i.status==="spare"?"tag spare":"tag off"}>${c}</span>`:l}
    ${n?o`<span class="w" title=${le(t,e.lang)}>${vt(t,e.lang)}</span>`:l}
    ${i.alert?o`<span class="amark" aria-hidden="true">!</span>`:e.warned?o`<span class="wmark" aria-hidden="true"></span>`:l}
  </button>`}function At(i,e){const t=e?i.modules.get(e):void 0;return t?{index:i,up:new Set(i.chain(t).map(n=>n.id)),down:i.downstream(t.id)}:{index:i,up:new Set,down:new Set}}function St(i,e){return i?i.up.has(e)?"up":i.down.has(e)?"down":null:null}function Ct(i,e){return e(`check.${i.code}`,i.params)}function Ji(i,e,t){if(i===null)return o`<span class="muted small">…</span>`;const{line:n,area:a}=lt(i,e[0],e[1]);return n?o`<svg class="spark" viewBox="0 0 200 42" preserveAspectRatio="none" role="img" aria-label=${t("el.d.history")}>
    ${Je`<path d=${a} fill="var(--him-accent)" opacity=".15"></path>
    <path d=${n} fill="none" stroke="var(--him-accent)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
  </svg>`:o`<span class="muted small">${t("el.d.no_history")}</span>`}function Pt(i,e){if(i.kind==="main_breaker")return e("el.d.head_only",{ref:i.ref||e("el.kind.main_breaker"),ma:i.sensitivity_ma??"?"});const t=[i.rating_a?`${i.rating_a} A`:"? A",i.sensitivity_ma?`${i.sensitivity_ma} mA`:"? mA"];return t.push(i.rcd_type&&i.rcd_type!=="?"?e("el.type",{t:i.rcd_type}):e("el.unknown_type")),`${i.ref} \xB7 ${t.join(" ")}`}function Yi(i,e){if(i.status==="spare")return l;if(gt.includes(i.circuit_kind))return o`<dt>${e("norm.title")}</dt><dd class="norm">${e(`norm.${i.circuit_kind}`)}</dd>`;const t=i.circuit_kind==="unknown"?$t(i.rating_a):null;return t?o`<dt>${e("norm.title")}</dt>
    <dd class="norm"><span class="muted">${e("norm.guess",{kind:e(`ck.kind.${t}`).toLowerCase()})} :</span> ${e(`norm.${t}`)}</dd>`:l}function Ie(i,e,t,n){const a=i.ref||`${e(`el.kind.${i.kind}`)} ${P(i)}`,s=t.boardOf.get(i.id);return s&&n&&s.id!==n.id?`${a} (${s.name})`:a}function Qi(i,e,t){const{t:n}=t,a=n(`el.kind.${i.kind}`);let s=a;i.kind==="breaker"||i.kind==="rcbo"?(s+=` ${P(i)}`,i.cable_mm2&&(s+=`, ${n("el.d.cable",{s:String(i.cable_mm2).replace(".",t.lang==="fr"?",":".")})}`)):i.kind==="rcd"?s=`${a} ${Pt(i,n).split(" \xB7 ")[1]}`:i.kind==="main_breaker"&&(s=`${a} ${P(i)}${i.sensitivity_ma?` \xB7 ${i.sensitivity_ma} mA`:""}`);const r=t.index??new Pe(t.payload.model.boards),c=t.board??r.boardOf.get(i.id)??null,p=r.feeder(i),u=r.chain(i),d=r.fed(i.id).filter($=>$.kind!=="spacer"),m=i.kind==="breaker"||i.kind==="device"?r.protector(i):null,f=i.status==="spare"?"spare":oe(i,t.hass)?"off":null,v=$=>r.boardOf.get($.id)?.id===c?.id,b=$=>v($)?o`<button class="ent" @click=${()=>t.onSelectModule($.id)}>${Ie($,n,r,c)}</button>`:o`<span>${Ie($,n,r,c)}</span>`,_=Vi(t.payload.checks,i.id).filter($=>$.code!=="manual"),h=Z(t.hass,i.power_entity_id),y=i.kind==="breaker"||i.kind==="rcbo";return o`<dl class="detail" aria-live="polite">
    <dt>${n("el.d.ref")}</dt>
    <dd>
      <b>${i.ref||"\u2014"}</b> · ${s}
      <button class="icon-btn" style="float:right;width:24px;height:24px" aria-label=${n("el.d.close")} @click=${()=>t.onSelectModule(null)}>✕</button>
    </dd>
    ${i.alert?o`<dt>${n("el.d.alert")}</dt><dd class=${i.alert_level==="info"?"alert-text info":"alert-text"}>${i.alert}</dd>`:l}
    ${i.model?o`<dt>${n("el.d.model")}</dt><dd>${i.model}</dd>`:l}
    ${f?o`<dt>${n("el.d.status")}</dt><dd><span class=${`tag inline ${f}`}>${n(`el.status.${f}`)}</span></dd>`:l}
    ${i.kind==="meter"&&i.subscribed_kva?o`<dt>${n("el.d.kva")}</dt><dd>${String(i.subscribed_kva).replace(".",t.lang==="fr"?",":".")} kVA</dd>`:l}
    ${p?o`<dt>${n("el.d.fed_by")}</dt>
          <dd>
            ${u.map(($,he)=>o`${he?o`<span class="muted"> ← </span>`:l}${b($)}`)}
            ${i.fed_by?o`<span class="muted"> · ${n("el.d.fed_manual")}</span>`:l}
          </dd>`:l}
    ${y?o`<dt>${n("el.d.circuit")}</dt>
          <dd>
            ${i.circuit_name||"?"}
            ${i.circuit_kind!=="unknown"?o`<span class="muted"> · ${n(`ck.kind.${i.circuit_kind}`)}</span>`:l}
          </dd>`:l}
    ${y&&i.points_count?o`<dt>${n("el.d.points")}</dt>
          <dd>${wt(i)!==null?n("el.d.points_max",{n:i.points_count,max:wt(i)}):i.points_count}</dd>`:l}
    ${y?Yi(i,n):l}
    ${i.area_ids.length?o`<dt>${n("el.d.areas")}</dt><dd>${ke(t.hass,i.area_ids).join(" \xB7 ")}</dd>`:l}
    ${i.kind==="breaker"?o`<dt>${n("el.d.protected_by")}</dt><dd>${m?Pt(m,n):o`<span class="muted">${n("el.d.no_rcd")}</span>`}</dd>`:l}
    ${d.length?o`<dt>${n("el.d.feeds")}</dt>
          <dd>${d.map(($,he)=>o`${he?", ":l}${b($)}`)}</dd>`:l}
    ${i.power_entity_id?o`<dt>${n("el.d.measure")}</dt>
          <dd>
            <span class="num">${le(h,t.lang)}</span> ·
            <button class="ent" @click=${()=>t.onMoreInfo(i.power_entity_id)}>${i.power_entity_id}</button>
          </dd>
          <dt>${n("el.d.history")}</dt>
          <dd>${Ji(t.history,t.historyRange,n)}</dd>`:l}
    ${i.energy_entity_id?o`<dt>${n("el.d.energy")}</dt>
          <dd><button class="ent" @click=${()=>t.onMoreInfo(i.energy_entity_id)}>${i.energy_entity_id}</button></dd>`:l}
    ${i.entity_ids.length?o`<dt>${n("el.d.entities")}</dt>
          <dd>${i.entity_ids.map($=>o`<button class="ent" @click=${()=>t.onMoreInfo($)}>${$}</button> `)}</dd>`:l}
    ${i.notes?o`<dt>${n("el.d.notes")}</dt><dd style="white-space:pre-line">${i.notes}</dd>`:l}
    ${_.length?o`<dt>${n("el.d.warnings")}</dt>
          <dd><ul class="warnlist">${_.map($=>o`<li class=${$.severity}>${Ct($,n)}</li>`)}</ul></dd>`:l}
  </dl>`}function Nt(i){return Array.from({length:Math.max(0,i)},()=>o`<div class="m free" aria-hidden="true"></div>`)}function de(i,e){const t=i?Bi(i,e):null,n=Ki(e);return{used:n,capacity:t,over:t!==null&&n>t}}function Xi(i,e){const t=new Set(e.payload.checks.filter(r=>r.severity==="warning").map(r=>r.module_id)),n=de(e.board??null,i),a=e.t("el.row",{label:i.label}),s=n.capacity!==null?e.t("el.slots",{used:n.used,capacity:n.capacity}):"";return o`<div
    class=${n.over?"rail over":"rail"}
    style=${kt(n.capacity)}
    role="group"
    aria-label=${s?`${a} \xB7 ${s}`:a}
    title=${s}
    data-row-id=${i.id}
  >
    <span class="rl">${i.label}</span>
    ${i.modules.map(r=>xt(r,{hass:e.hass,t:e.t,lang:e.lang,selected:r.id===e.selectedModuleId,warned:t.has(r.id),link:St(e.links,r.id),feeder:r.fed_by?e.links?.index.feeder(r):null,onClick:()=>e.onSelectModule(r.id===e.selectedModuleId?null:r.id)}))}
    ${n.capacity!==null?Nt(n.capacity-n.used):l}
  </div>`}function en(i,e){return i===null||!e?null:Math.round(i/(230*e)*100)}function It(i,e){const t=i.supply??[];if(!t.length&&!e.extra)return l;const{t:n}=e,a=t.map(r=>Z(e.hass,r.power_entity_id)).find(r=>r!==null)??null??_t(e.hass,bt(i)),s=e.links?e.links.index.fed(t[t.length-1]?.id??"").length:0;return o`<div class="supply" role="group" aria-label=${n("el.supply")}>
    <span class="rl">${n("el.supply")}</span>
    ${t.map((r,c)=>{const p=Z(e.hass,r.power_entity_id),u=r.kind==="main_breaker"?en(a,r.rating_a):null,d=r.id===e.selectedModuleId,m=r.kind==="main_breaker"?[r.sensitivity_ma?`${r.sensitivity_ma} mA`:"",r.model&&r.model!==n(`el.kind.${r.kind}`)?r.model:""].filter(Boolean).join(" \xB7 "):r.model??"",f=["sup",r.kind,d?"sel":"",St(e.links,r.id)??"",r.status==="spare"?"spare":oe(r,e.hass)?"off":"",r.alert?r.alert_level==="info"?"al al-info":"al":""].filter(Boolean).join(" ");return o`${c?o`<span class="arrow" aria-hidden="true">→</span>`:l}
        <button
          class=${f}
          data-module-id=${r.id}
          aria-pressed=${d?"true":"false"}
          aria-label=${`${n(`el.kind.${r.kind}`)} ${P(r)} ${m}`}
          @click=${()=>e.onSelectModule(d?null:r.id)}
        >
          <ha-icon icon=${r.kind==="meter"?"mdi:meter-electric-outline":"mdi:electric-switch"}></ha-icon>
          <span class="txt">
            <small>${n(`el.kind.${r.kind}`)}</small>
            <b>${P(r)}</b>
            ${m?o`<small>${m}</small>`:l}
          </span>
          ${p!==null?o`<span class="w">${vt(p,e.lang)}</span>`:l}
          ${r.alert?o`<span class="amark" title=${r.alert}>!</span>`:l}
          ${u!==null?o`<span class="load" title=${n("el.load",{p:u,a:r.rating_a??"?"})}>
                <span class="bar"><span style=${`width:${Math.min(100,Math.max(0,u))}%`} class=${u>=80?"hot":""}></span></span>
                <span class="num">${u} %</span>
              </span>`:l}
        </button>`})}
    ${t.length&&s?o`<span class="arrow" aria-hidden="true">→</span><span class="muted small">${n("el.feeds_n",{n:s})}</span>`:l}
    ${e.extra??l}
  </div>`}function tn(i){const{t:e,payload:t,board:n}=i,a=t.model.boards;if(!n)return o`<div class="empty">${e("el.no_board")}</div>`;const s=qi(n,i.hass),r=_t(i.hass,bt(n)),c=t.checks.filter(_=>_.board_id===n.id&&(_.severity==="warning"||_.code==="manual"));c.sort((_,h)=>+(h.code==="manual")-+(_.code==="manual"));const p=c.filter(_=>_.code==="manual").length,u=c.length-p,d=new Pe(a);let m=null;const f=(n.supply??[]).find(_=>_.id===i.selectedModuleId);f&&(m={module:f,row:null});for(const _ of n.rows){const h=_.modules.find(y=>y.id===i.selectedModuleId);h&&(m={module:h,row:_})}const v=At(d,m?m.module.id:null),b=n.fed_by?d.modules.get(n.fed_by)??null:null;return o`
    ${a.length>1?o`<div class="seg" role="tablist" aria-label=${e("el.board")}>
          ${a.map(_=>o`<button role="tab" aria-selected=${_.id===n.id?"true":"false"} @click=${()=>i.onSelectBoard(_.id)}>
              ${_.name}
            </button>`)}
        </div>`:l}
    <div class="chips">
      <span class="chip"><span class="dot"></span>${e("el.rcd_count",{n:s.rcds})}</span>
      ${s.unidentified?o`<span class="chip"><span class="dot warn"></span>${e("el.to_identify",{n:s.unidentified})}</span>`:o`<span class="chip"><span class="dot"></span>${e("el.all_identified")}</span>`}
      ${s.off?o`<span class="chip"><span class="dot bad"></span>${e("el.off_count",{n:s.off})}</span>`:l}
      ${s.spare?o`<span class="chip"><span class="dot off"></span>${e("el.spare_count",{n:s.spare})}</span>`:l}
      ${b?o`<span class="chip">${e("el.board_fed_by",{ref:Ie(b,e,d,n)})}</span>`:l}
      ${r!==null?o`<span class="chip num">${e("el.now",{w:le(r,i.lang)})}</span>`:l}
      ${p?o`<button class="chip warn" aria-expanded=${i.showWarnings?"true":"false"} @click=${i.onToggleWarnings}>
            <span class="amark-chip">!</span>${e("el.alerts",{n:p})}
          </button>`:l}
      ${u?o`<button class="chip warn" aria-expanded=${i.showWarnings?"true":"false"} @click=${i.onToggleWarnings}>
            <span class="dot warn"></span>${e("el.warnings",{n:u})}
          </button>`:l}
      ${i.hasPhoto?o`<button class="chip" @click=${i.onOpenPhoto}><ha-icon icon="mdi:image" style="--mdc-icon-size:16px"></ha-icon>${e("el.photo")}</button>`:l}
    </div>
    ${i.showWarnings&&c.length?o`<div class="form">
          <ul class="warnlist">
            ${c.map(_=>o`<li class=${_.code==="manual"?`${_.severity} manual`:"warning"}>
                <button class="ent" @click=${()=>i.onSelectModule(_.module_id)}>${_.ref}</button> · ${Ct(_,e)}
              </li>`)}
          </ul>
          <span class="muted small">${e("check.disclaimer")}</span>
        </div>`:l}
    <div class=${v.up.size||v.down.size?"board linking":"board"}>
      ${It(n,{...i,links:v})}
      ${n.rows.map(_=>Xi(_,{...i,board:n,links:v}))}
    </div>
    ${m?Qi(m.module,m.row,{...i,index:d,board:n}):l}
  `}const nn=["breaker","rcd","rcbo","device","spacer"],an=[2,6,10,16,20,25,32,40,50,63],sn=[25,40,63,80,100],rn=[10,30,100,300,500],on=["AC","A","F","B","?"],ln=["B","C","D","?"],dn=[1.5,2.5,4,6,10,16],cn=[15,30,45,60,90],hn=[300,500,650],pn=["active","off","spare"],un=["lighting","sockets","dedicated","cooking","water_heater","heating","feeder","other","unknown"];function ce(i){for(const e of i.rows)for(const t of e.modules){const n=/^([A-Za-z]+\d+)-/.exec(t.ref);if(n)return n[1]}return""}const Ee=class extends S{constructor(){super(),this._drag=null,this._initialised=!1,this._boards=[],this._selected=null,this._dirty=!1,this._busy=null,this._error=null,this._dragOver=null,this.boardId=null}connectedCallback(){super.connectedCallback(),nt().then(()=>this.requestUpdate())}willUpdate(){!this._initialised&&this.payload&&(this._initialised=!0,this._boards=Ne(this.payload.model.boards),this._boards.length||this._addBoard(!1),(!this.boardId||!this._boards.some(e=>e.id===this.boardId))&&(this.boardId=this._boards[0]?.id??null))}get _t(){return L((this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en")}get _lang(){return(this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en"}get _board(){return this._boards.find(e=>e.id===this.boardId)}_touch(){this._boards=[...this._boards],this._dirty=!0}_locate(e){for(const t of this._boards){const n=t.supply??=[],a=n.findIndex(s=>s.id===e);if(a>=0)return{list:n,row:null,index:a};for(const s of t.rows){const r=s.modules.findIndex(c=>c.id===e);if(r>=0)return{list:s.modules,row:s,index:r}}}return null}_patch(e,t){const n=this._locate(e);n&&(n.list[n.index]={...n.list[n.index],...t},this._touch())}_addSupply(e){const t=this._board,n=ce(t)||`T${this._boards.indexOf(t)+1}`,a=J(e,`${n}-${e==="meter"?"CPT":"AGCP"}`),s=t.supply??=[];e==="meter"?s.unshift(a):s.push(a),this._selected=a.id,this._touch()}_addBoard(e=!0){const t=this._boards.length+1,n={id:F(),name:`Tableau ${t}`,location:null,area_id:null,photo_path:null,rows:[]};n.rows.push({id:F(),label:"R1",modules:[J("rcd",`T${t}-R1-ID`)]}),this._boards=[...this._boards,n],this.boardId=n.id,e&&this._touch()}_addRow(){const e=this._board;if(!e)return;const t=`R${e.rows.length+1}`,n=ce(e)||`T${this._boards.indexOf(e)+1}`;e.rows.push({id:F(),label:t,modules:[J("rcd",`${n}-${t}-ID`)]}),this._touch()}_addSpacer(e){const t=this._board,n=ce(t)||`T${this._boards.indexOf(t)+1}`,a=e.modules.filter(r=>r.kind==="spacer").length+1,s=J("spacer",`${n}-${e.label}-V${a}`);e.modules.push(s),this._selected=s.id,this._touch()}_addModule(e){const t=this._board,n=ce(t)||`T${this._boards.indexOf(t)+1}`,a=e.modules.filter(r=>r.kind==="breaker"||r.kind==="rcbo").length+1,s=J("breaker",`${n}-${e.label}-${a}`);e.modules.push(s),this._selected=s.id,this._touch()}_delete(e){const t=this._locate(e);if(!t)return;const n=t.list[t.index];window.confirm(this._t("edit.confirm_delete",{name:n.ref||n.circuit_name||n.label}))&&(t.list.splice(t.index,1),this._selected=null,this._touch())}_deleteRow(e){const t=this._board;window.confirm(this._t("edit.confirm_delete",{name:e.label}))&&(t.rows=t.rows.filter(n=>n.id!==e.id),this._touch())}_deleteBoard(){const e=this._board;window.confirm(this._t("edit.confirm_delete",{name:e.name}))&&(this._boards=this._boards.filter(t=>t.id!==e.id),this.boardId=this._boards[0]?.id??null,this._dirty=!0)}_move(e,t){const n=this._locate(e);n?.row&&(n.row.modules=Wi(n.row.modules,n.index,n.index+t),this._touch(),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-module-id="${e}"]`)?.focus()))}moveTo(e,t,n){const a=this._locate(e);if(!a?.row||e===n)return;const[s]=a.list.splice(a.index,1),r=n?t.modules.findIndex(c=>c.id===n):-1;r<0?t.modules.push(s):t.modules.splice(r,0,s),this._touch()}async _upload(e){const t=e.target,n=t.files?.[0],a=this._board;if(!(!n||!a||!this.hass)){this._busy=this._t("ee.photo_uploading");try{a.photo_path=await $i(this.hass,a.id,n),this._touch()}catch(s){this._error=this._t("edit.failed",{error:x(s)})}finally{this._busy=null,t.value=""}}}async _save(){if(!(!this.hass||!this.payload)){this._busy="\u2026",this._error=null;try{await Xe(this.hass,"boards",this._boards,this.payload.section_revisions.boards),this._dirty=!1,A(this,"him-saved",{boardId:this.boardId})}catch(e){const t=R(e);t==="conflict"?A(this,"him-conflict"):t==="unauthorized"?this._error=this._t("edit.refused"):this._error=this._t("edit.failed",{error:x(e)})}finally{this._busy=null}}}_cancel(){this._dirty&&!window.confirm(this._t("edit.unsaved")+" \u2014 "+this._t("edit.cancel")+" ?")||A(this,"him-cancel")}render(){const e=this._t,t=this._board,n=this._selected?this._locate(this._selected):null,a=new Pe(this._boards),s=At(a,this._selected),r=t?.supply??[];return o`
      <div class="toolbar">
        ${this._boards.length>1?w("ee-board",e("el.board"),this.boardId,this._boards.map(c=>({value:c.id,label:c.name})),c=>{this.boardId=c,this._selected=null}):l}
        <span style="flex:1"></span>
        ${this._dirty?o`<span class="badge warn">${e("edit.unsaved")}</span>`:l}
        <button class="btn" @click=${this._cancel}>${e("edit.cancel")}</button>
        <button class="btn pri" ?disabled=${!!this._busy||!this._dirty} @click=${this._save}>${e("edit.save")}</button>
      </div>
      ${this._error?o`<div class="banner" role="alert">${this._error}</div>`:l}
      ${this._busy&&this._busy!=="\u2026"?o`<div class="banner info">${this._busy}</div>`:l}
      ${t?o`<div class="ed">
            <div style="display:flex;flex-direction:column;gap:8px;min-width:0">
              <div class="grid2">
                ${g("ee-bname",e("ee.board_name"),t.name,c=>{t.name=c,this._touch()})}
                ${g("ee-bloc",e("ee.board_location"),t.location,c=>{t.location=c||null,this._touch()})}
              </div>
              ${g("ee-bslots",e("ee.board_slots"),t.modules_per_row??"",c=>{const p=Math.round(Number(c));t.modules_per_row=c.trim()&&p>0?Math.min(96,p):null,this._touch()},{type:"number"})}
              ${this.hass?xe(this.hass,"ee-barea",e("ee.board_area"),t.area_id,!1,c=>{t.area_id=c[0]??null,this._touch()}):l}
              ${this._boards.length>1?w("ee-bfed",e("ee.board_fed_by"),t.fed_by??"",[{value:"",label:"\u2014"},...[...a.modules.values()].filter(c=>a.boardOf.get(c.id)?.id!==t.id&&c.kind!=="spacer").map(c=>({value:c.id,label:this._optionLabel(c,a,t)}))],c=>{t.fed_by=c||null,this._touch()}):l}
              <span class="muted small">${e("ee.select_hint")}</span>
              <div class=${s.up.size||s.down.size?"board linking":"board"}>
                ${It(t,{hass:this.hass,t:e,lang:this._lang,selectedModuleId:this._selected,links:s,onSelectModule:c=>this._selected=c,extra:o`${r.some(c=>c.kind==="meter")?l:o`<button class="btn" @click=${()=>this._addSupply("meter")}>${e("ee.add_meter")}</button>`}
                  ${r.some(c=>c.kind==="main_breaker")?l:o`<button class="btn" @click=${()=>this._addSupply("main_breaker")}>${e("ee.add_main_breaker")}</button>`}`})}
                ${t.rows.map(c=>this._renderRail(c,s))}
              </div>
              <div class="btns">
                <button class="btn" @click=${this._addRow}>${e("ee.add_row")}</button>
                <button class="btn" @click=${()=>this._addBoard()}>${e("ee.add_board")}</button>
                <label class="btn" style="display:inline-flex;align-items:center">
                  ${e("ee.photo_upload")}
                  <input type="file" accept="image/*" style="display:none" @change=${this._upload} />
                </label>
                ${t.photo_path?o`<button class="btn" @click=${()=>{t.photo_path=null,this._touch()}}>${e("ee.photo_remove")}</button>`:l}
                <button class="btn danger" @click=${this._deleteBoard}>${e("ee.delete_board")}</button>
              </div>
            </div>
            ${n?this._renderForm(n.list[n.index],n.row,a):o`<div class="form muted">${e("ee.select_hint")}</div>`}
          </div>`:l}
    `}_optionLabel(e,t,n){const a=this._t,s=t.boardOf.get(e.id),r=`${e.ref||"\u2014"} \xB7 ${a(`el.kind.${e.kind}`)} ${P(e)}`,c=(e.kind==="breaker"||e.kind==="rcbo")&&e.circuit_name&&e.circuit_name!=="?"?` \xB7 ${e.circuit_name}`:"";return`${r}${c}${s&&n&&s.id!==n.id?` (${s.name})`:""}`}_renderRail(e,t){const n=this._t;return o`<div
      class="rail"
      style=${kt(de(this._board??null,e).capacity)}
      data-row-id=${e.id}
      @dragover=${a=>{this._drag&&a.preventDefault()}}
      @drop=${a=>{a.preventDefault(),this._drag&&!a.target.closest("[data-module-id]")&&this.moveTo(this._drag.moduleId,e,null),this._drag=null,this._dragOver=null}}
    >
      <span class="rl">${e.label}</span>
      ${e.modules.map(a=>o`<div
          draggable="true"
          style=${`grid-column:span ${yt(a)}`}
          class=${this._dragOver===a.id?"cell drag-wrap":"cell"}
          @dragstart=${s=>{this._drag={moduleId:a.id},s.dataTransfer?.setData("text/plain",a.id)}}
          @dragend=${()=>{this._drag=null,this._dragOver=null}}
          @dragover=${s=>{this._drag&&(s.preventDefault(),this._dragOver=a.id)}}
          @drop=${s=>{s.preventDefault(),s.stopPropagation(),this._drag&&this.moveTo(this._drag.moduleId,e,a.id),this._drag=null,this._dragOver=null}}
        >
          ${xt(a,{hass:this.hass,t:n,lang:this._lang,selected:a.id===this._selected||this._dragOver===a.id,warned:!1,link:t?.up.has(a.id)?"up":t?.down.has(a.id)?"down":null,feeder:a.fed_by?t?.index.feeder(a):null,onClick:()=>this._selected=a.id})}
        </div>`)}
      ${(()=>{const a=de(this._board??null,e);return a.capacity!==null?Nt(a.capacity-a.used):l})()}
      <button class="add" aria-label=${n("ee.add_module",{label:e.label})} @click=${()=>this._addModule(e)}>+</button>
      <button class="add add-sp" aria-label=${n("ee.add_spacer",{label:e.label})} title=${n("ee.add_spacer",{label:e.label})} @click=${()=>this._addSpacer(e)}>▢</button>
    </div>
    ${(()=>{const a=de(this._board??null,e);return o`<div class=${a.over?"rail-meta over":"rail-meta"}>
        ${e.label} · ${a.capacity!==null?n("el.slots",{used:a.used,capacity:a.capacity}):n("el.slots_unknown",{used:a.used})}
      </div>`})()}`}_renderForm(e,t,n){const a=this._t,s=this.hass,r=h=>this._patch(e.id,h),c=h=>h===""||h==="?"?null:Number(h),p=e.kind==="breaker"||e.kind==="rcbo",u=e.kind==="rcd"||e.kind==="rcbo",d=this._board,m=n.defaultFeeder(e),f=o`${w("ee-fed",a("ee.f.fed_by"),e.fed_by??"",[{value:"",label:a("ee.f.fed_auto",{ref:m?m.ref||a(`el.kind.${m.kind}`):a("ee.f.fed_none")})},...n.candidates(e).map(h=>({value:h.id,label:this._optionLabel(h,n,d)}))],h=>r({fed_by:h||null}))}
      <span class="muted small">${a("ee.fed_hint")}</span>`,v=e.kind==="spacer"?l:w("ee-status",a("ee.f.status"),e.status??"active",pn.map(h=>({value:h,label:a(`el.status.${h}`)})),h=>r({status:h})),b=o`${g("ee-alert",a("ee.f.alert"),e.alert,h=>r({alert:h.trim()?h:null}),{suggestions:[1,2,3,4,5,6,7,8,9].map(h=>a(`ee.alert.s${h}`)),hint:o`<span class="muted small">${a("ee.alert_hint")}</span>`})}
      ${e.alert?w("ee-alert-level",a("ee.f.alert_level"),e.alert_level??"warning",["warning","info"].map(h=>({value:h,label:a(`ee.alert_level.${h}`)})),h=>r({alert_level:h})):l}`;if(!t)return this._renderSupplyForm(e,f,v,b);const _=t.modules.indexOf(e);return o`<div class="form" aria-label=${e.ref}>
      <b>${e.ref||"\u2014"}</b>
      ${w("ee-kind",a("ee.f.kind"),e.kind,nn.map(h=>({value:h,label:a(`el.kind.${h}`)})),h=>r({kind:h,width_modules:h==="rcd"?Math.max(2,e.width_modules):e.width_modules}))}
      ${g("ee-ref",a("ee.f.ref"),e.ref,h=>r({ref:h}))}
      ${v}
      ${e.kind!=="spacer"?b:l}
      ${e.kind!=="spacer"?f:l}
      ${p?o`<div class="grid2">
            ${w("ee-rating",a("ee.f.rating"),e.rating_a??"?",[...an.map(h=>({value:h,label:`${h} A`})),{value:"?",label:"?"}],h=>r({rating_a:c(h)}))}
            ${w("ee-curve","\xA0",e.curve,ln.map(h=>({value:h,label:h})),h=>r({curve:h}))}
          </div>`:l}
      ${e.kind==="rcd"?w("ee-rcdr",a("ee.f.rcd_rating"),e.rating_a??"?",[...sn.map(h=>({value:h,label:`${h} A`})),{value:"?",label:"?"}],h=>r({rating_a:c(h)})):l}
      ${u?o`<div class="grid2">
            ${w("ee-sens",a("ee.f.sensitivity"),e.sensitivity_ma??"?",[...rn.map(h=>({value:h,label:`${h} mA`})),{value:"?",label:"?"}],h=>r({sensitivity_ma:c(h)}))}
            ${w("ee-rcdt",a("ee.f.rcd_type"),e.rcd_type,on.map(h=>({value:h,label:h})),h=>r({rcd_type:h}))}
          </div>`:l}
      ${p?o`
            ${g("ee-circ",a("ee.f.circuit"),e.circuit_name,h=>r({circuit_name:h}))}
            ${w("ee-ck",a("ee.f.circuit_kind"),e.circuit_kind,un.map(h=>({value:h,label:a(`ck.kind.${h}`)})),h=>r({circuit_kind:h}))}
            ${(()=>{const h=e.circuit_kind==="unknown"?$t(e.rating_a):null;return h?o`<div class="norm small">
                  ${a("norm.guess",{kind:a(`ck.kind.${h}`).toLowerCase()})}
                  <button class="btn" @click=${()=>r({circuit_kind:h})}>${a("ee.apply_guess")}</button>
                </div>`:gt.includes(e.circuit_kind)?o`<div class="norm small"><b>${a("norm.title")}</b> · ${a(`norm.${e.circuit_kind}`)}</div>`:l})()}
            ${g("ee-points",a("ee.f.points"),e.points_count??"",h=>{const y=Math.round(Number(h));r({points_count:h.trim()&&y>=0?Math.min(99,y):null})},{type:"number"})}
            ${xe(s,"ee-areas",a("ee.f.areas"),e.area_ids,!0,h=>r({area_ids:h}))}
            ${w("ee-cable",a("ee.f.cable"),e.cable_mm2??"",[{value:"",label:"?"},...dn.map(h=>({value:h,label:`${String(h).replace(".",this._lang==="fr"?",":".")} mm\xB2`}))],h=>r({cable_mm2:h?Number(h):null}))}
          `:l}
      ${e.kind==="device"?o`${g("ee-label",a("ee.f.label"),e.label,h=>r({label:h}))}
          ${g("ee-ents",a("ee.f.entities"),e.entity_ids.join(", "),h=>r({entity_ids:h.split(",").map(y=>y.trim()).filter(y=>/^[a-z0-9_]+\.[a-z0-9_]+$/.test(y))}))}`:l}
      ${p||e.kind==="device"?o`${K(s,"ee-power",a("ee.f.power"),e.power_entity_id,"power",h=>r({power_entity_id:h}))}
          ${K(s,"ee-energy",a("ee.f.energy"),e.energy_entity_id,"energy",h=>r({energy_entity_id:h}))}
          ${K(s,"ee-switch",a("ee.f.switch"),e.switch_entity_id,null,h=>r({switch_entity_id:h}),["switch","light","input_boolean"])}`:l}
      ${e.kind!=="spacer"?g("ee-model",a("ee.f.model"),e.model,h=>r({model:h||null})):l}
      ${g("ee-width",a("ee.f.width"),e.width_modules,h=>r({width_modules:Math.max(1,Math.min(24,Number(h)||1))}),{type:"number"})}
      <div class="f">
        <label for="ee-notes">${a("ee.f.notes")}</label>
        <textarea class="inp" id="ee-notes" rows="3" .value=${e.notes??""} @input=${h=>r({notes:h.target.value||null})}></textarea>
      </div>
      <div class="btns">
        <button class="btn" ?disabled=${_<=0} @click=${()=>this._move(e.id,-1)}>${a("ee.move_left")}</button>
        <button class="btn" ?disabled=${_>=t.modules.length-1} @click=${()=>this._move(e.id,1)}>${a("ee.move_right")}</button>
        <button class="btn danger" @click=${()=>this._delete(e.id)}>${a("ee.delete")}</button>
      </div>
      <div class="btns">
        ${g("ee-row",a("ee.row_label"),t.label,h=>{t.label=h,this._touch()})}
        ${g("ee-rcap",a("ee.row_capacity"),t.capacity??"",h=>{const y=Math.round(Number(h));t.capacity=h.trim()&&y>0?Math.min(96,y):null,this._touch()},{type:"number"})}
        <button class="btn danger" @click=${()=>this._deleteRow(t)}>${a("ee.delete_row")}</button>
      </div>
    </div>`}_renderSupplyForm(e,t,n,a){const s=this._t,r=this.hass,c=u=>this._patch(e.id,u),p=u=>u===""||u==="?"?null:Number(u);return o`<div class="form" aria-label=${e.ref}>
      <b>${s(`el.kind.${e.kind}`)}</b>
      ${g("ee-ref",s("ee.f.ref"),e.ref,u=>c({ref:u}))}
      ${g("ee-model",s("ee.f.model"),e.model,u=>c({model:u||null}))}
      ${e.kind==="meter"?g("ee-kva",s("ee.f.kva"),e.subscribed_kva??"",u=>{const d=Number(u.replace(",","."));c({subscribed_kva:u.trim()&&d>0?d:null})},{type:"number"}):o`<div class="grid2">
            ${w("ee-hr",s("ee.f.head_rating"),e.rating_a??"?",[...cn.map(u=>({value:u,label:`${u} A`})),{value:"?",label:"?"}],u=>c({rating_a:p(u)}))}
            ${w("ee-hs",s("ee.f.sensitivity"),e.sensitivity_ma??"?",[...hn.map(u=>({value:u,label:`${u} mA`})),{value:"?",label:"?"}],u=>c({sensitivity_ma:p(u)}))}
          </div>`}
      ${n}
      ${a}
      ${t}
      ${K(r,"ee-power",s("ee.f.power"),e.power_entity_id,"power",u=>c({power_entity_id:u}))}
      ${K(r,"ee-energy",s("ee.f.energy"),e.energy_entity_id,"energy",u=>c({energy_entity_id:u}))}
      <div class="f">
        <label for="ee-notes">${s("ee.f.notes")}</label>
        <textarea class="inp" id="ee-notes" rows="3" .value=${e.notes??""} @input=${u=>c({notes:u.target.value||null})}></textarea>
      </div>
      <div class="btns">
        <button class="btn danger" @click=${()=>this._delete(e.id)}>${s("ee.delete_supply")}</button>
      </div>
    </div>`}};Ee.styles=B,Ee.properties={hass:{attribute:!1},payload:{attribute:!1},boardId:{attribute:!1},_boards:{state:!0},_selected:{state:!0},_dirty:{state:!0},_busy:{state:!0},_error:{state:!0},_dragOver:{state:!0}};let mn=Ee;const fn=["router","switch","ap","server","nas","camera","iot","computer","phone","printer","other"];function _n(){return{id:F(),name:"",host:"",mac:null,vlan_id:null,switch_id:null,port:null,port_source:"auto",last_seen_port_at:null,area_id:null,parent_device_id:null,kind:"other",model:null,notes:null,monitor:{ping:!0,latency:!0,tcp_port:null,offline_alert_minutes:null}}}function bn(i,e){const t={...i};return e.vlan?.vlan_id&&(t.vlan_id=e.vlan.vlan_id),e.mac?.value&&(t.mac=e.mac.value),e.port&&t.port_source!=="manual"&&(t.switch_id=e.port.switch_id,t.port=e.port.port,!t.parent_device_id&&e.port.via_device_id&&e.port.via_device_id!==t.id&&(t.parent_device_id=e.port.via_device_id)),t}const Me=class extends S{constructor(){super(),this._lastRevision=-1,this._net=null,this._mode="list",this._form=null,this._isNew=!1,this._probe=null,this._probing=!1,this._preview=[],this._proposals=null,this._selVlans=new Set,this._selDevices=new Set,this._busy=!1,this._error=null,this._dirty=!1}connectedCallback(){super.connectedCallback(),nt().then(()=>this.requestUpdate())}disconnectedCallback(){window.clearTimeout(this._previewTimer),super.disconnectedCallback()}willUpdate(){this.payload&&this.payload.section_revisions.network!==this._lastRevision&&!this._dirty&&(this._lastRevision=this.payload.section_revisions.network,this._net=Ne(this.payload.model.network))}get _lang(){return(this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en"}get _t(){return L(this._lang)}editDevice(e){const t=this._net?.devices.find(n=>n.id===e);t&&(this._form=Ne(t),this._isNew=!1,this._probe=null,this._mode="device",this._schedulePreview())}_newDevice(){this._form=_n(),this._isNew=!0,this._probe=null,this._preview=[],this._mode="device"}_patchForm(e){this._form&&(this._form={...this._form,...e,monitor:{...this._form.monitor,...e.monitor??{}}},this._schedulePreview())}_schedulePreview(){window.clearTimeout(this._previewTimer),this._previewTimer=window.setTimeout(()=>{const e=this._form;!e||!this.hass||pi(this.hass,{...e,name:e.name||"?"}).then(t=>this._preview=t).catch(()=>this._preview=[])},300)}async _runProbe(){const e=this._form;if(!(!e?.host.trim()||!this.hass)){this._probing=!0;try{const t=await hi(this.hass,e.host.trim());this._probe=t,this._form=bn(this._form,t),this._schedulePreview()}catch(t){this._error=R(t)==="unauthorized"?this._t("edit.refused"):this._t("edit.failed",{error:x(t)})}finally{this._probing=!1}}}async _persist(e){if(!this.hass||!this.payload)return!1;this._busy=!0,this._error=null;try{return await Xe(this.hass,"network",e,this.payload.section_revisions.network),this._dirty=!1,this._lastRevision=-1,A(this,"him-saved"),!0}catch(t){const n=R(t);return n==="conflict"?A(this,"him-conflict"):n==="unauthorized"?this._error=this._t("edit.refused"):this._error=this._t("edit.failed",{error:x(t)}),!1}finally{this._busy=!1}}async _saveDevice(){const e=this._form,t=this._net;if(!e||!t)return;if(!e.name.trim()){this._error=this._t("ne.required");return}const n=this._isNew?[...t.devices,e]:t.devices.map(s=>s.id===e.id?e:s),a={...t,devices:n};await this._persist(a)&&(this._net=a,this._mode="list",this._form=null)}async _deleteDevice(e){if(!this._net||!window.confirm(this._t("edit.confirm_delete",{name:e.name})))return;const t={...this._net,devices:this._net.devices.filter(n=>n.id!==e.id)};await this._persist(t)&&(this._net=t)}async _openImport(){if(this.hass){this._mode="import",this._proposals=null,this._error=null;try{const e=await ui(this.hass);this._proposals=e,this._selVlans=new Set(e.vlans.map(t=>t.interface)),this._selDevices=new Set(e.devices.filter(t=>!t.exists).map(t=>t.key))}catch(e){this._error=R(e)==="unauthorized"?this._t("edit.refused"):this._t("edit.failed",{error:x(e)})}}}async _applyImport(){if(!(!this.hass||!this.payload)){this._busy=!0;try{await mi(this.hass,[...this._selVlans],[...this._selDevices],this.payload.section_revisions.network),this._dirty=!1,this._lastRevision=-1,this._mode="list",A(this,"him-saved")}catch(e){R(e)==="conflict"?A(this,"him-conflict"):this._error=this._t("edit.failed",{error:x(e)})}finally{this._busy=!1}}}_toggle(e,t){const n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}render(){const e=this._t;return this._net?o`
      ${this._error?o`<div class="banner" role="alert">${this._error}</div>`:l}
      ${this._mode==="device"&&this._form?this._renderDeviceForm(this._form):l}
      ${this._mode==="import"?this._renderImport():l}
      ${this._mode==="list"?o`<div class="toolbar">
              <button class="btn pri" @click=${this._newDevice}>${e("ne.add")}</button>
              ${this.payload?.settings.sources.opnsense?o`<button class="btn" @click=${this._openImport}>${e("ne.import_opnsense")}</button>`:l}
            </div>
            ${this._renderTable()} ${this._renderVlans()} ${this._renderUplink()}`:l}
    `:o``}_sensorsSummary(e){const t=this._t,n=[];return e.monitor.ping&&n.push(t("ne.s.short.ping")),e.monitor.latency&&n.push(t("ne.s.short.latency")),e.monitor.tcp_port&&n.push(t("ne.s.short.tcp",{p:e.monitor.tcp_port})),e.monitor.offline_alert_minutes&&n.push(t("ne.s.short.alert")),n.join(", ")||"\u2014"}_renderTable(){const e=this._t,t=this._net,n=s=>t.vlans.find(r=>r.id===s)?.name??"\u2014",a=t.devices.slice().sort((s,r)=>re(s.host).localeCompare(re(r.host)));return o`<h3>${e("ne.devices")}</h3>
      <div class="scroll">
        <table class="tbl">
          <thead>
            <tr><th>${e("ne.col.name")}</th><th>${e("ne.col.ip")}</th><th>${e("ne.col.vlan")}</th><th>${e("ne.col.port")}</th><th>${e("ne.col.sensors")}</th><th></th></tr>
          </thead>
          <tbody>
            ${a.map(s=>o`<tr data-device-id=${s.id}>
                <td>${s.name}</td>
                <td class="num">${s.host}</td>
                <td>${n(s.vlan_id)}</td>
                <td>${s.port??"\u2014"}</td>
                <td>${this._sensorsSummary(s)}</td>
                <td style="white-space:nowrap">
                  <button class="btn" @click=${()=>this.editDevice(s.id)}>${e("ne.edit")}</button>
                  <button class="btn danger" aria-label=${`${e("ne.delete")} ${s.name}`} @click=${()=>this._deleteDevice(s)}>✕</button>
                </td>
              </tr>`)}
          </tbody>
        </table>
      </div>`}_renderDeviceForm(e){const t=this._t,n=this._net,a=this.hass,s=this._probe,r=this._probing?o`<span class="hint muted">${t("ne.probing")}</span>`:s?.ping?s.ping.alive?o`<span class="hint ok">${t("ne.answers",{ms:s.ping.rtt_ms??"?"})}</span>`:o`<span class="hint bad">${s.ping.error??t("ne.no_answer")}</span>`:l,c=[{value:"",label:"\u2014"},...n.vlans.map(d=>({value:d.id,label:`${d.name}${d.subnet?` \xB7 ${d.subnet}`:""}`}))],p=s?.port?o`<span class="hint muted">${s.port.via?t("ne.port_via",{port:s.port.port,via:s.port.via}):s.port.port} · ${t("ne.port_detected")}</span>`:void 0,u=this.payload?.settings.ping_interval_s??60;return o`<div class="toolbar">
        <b style="flex:1">${this._isNew?t("ne.add_title"):t("ne.edit_title",{name:e.name})}</b>
        <button class="btn" @click=${()=>{this._mode="list",this._form=null}}>${t("edit.cancel")}</button>
        <button class="btn pri" ?disabled=${this._busy} @click=${this._saveDevice}>${this._isNew?t("ne.create"):t("edit.save")}</button>
      </div>
      <div class="ed wide">
        <div class="form">
          ${g("ne-name",t("ne.f.name"),e.name,d=>this._patchForm({name:d}))}
          <div class="f">
            <label for="ne-host">${t("ne.f.host")}</label>
            <div style="display:flex;gap:6px">
              <input class="inp num" id="ne-host" .value=${e.host}
                @input=${d=>this._patchForm({host:d.target.value})}
                @change=${this._runProbe} />
              <button class="btn" ?disabled=${this._probing||!e.host} @click=${this._runProbe}>${t("ne.probe")}</button>
            </div>
            ${r}
          </div>
          ${w("ne-vlan",t("ne.f.vlan"),e.vlan_id??"",c,d=>this._patchForm({vlan_id:d||null}))}
          ${s?.vlan?o`<span class="hint muted">${s.vlan.name} · ${s.vlan.subnet} · ${t("ne.vlan_detected")}</span>`:l}
          ${g("ne-mac",t("ne.f.mac"),e.mac,d=>this._patchForm({mac:d.trim()||null}),{hint:s?.mac?o`<span class="hint muted">${t("ne.mac_detected",{source:s.mac.source})}</span>`:void 0})}
          <div class="grid2">
            ${w("ne-switch",t("ne.f.switch"),e.switch_id??"",[{value:"",label:"\u2014"},...n.switches.map(d=>({value:d.id,label:d.name}))],d=>this._patchForm({switch_id:d||null}))}
            ${g("ne-port",t("ne.f.port"),e.port,d=>this._patchForm({port:d===""?null:Number(d)}),{type:"number",hint:p})}
          </div>
          <label class="tog"><input type="checkbox" class="inp" .checked=${e.port_source==="manual"}
            @change=${d=>this._patchForm({port_source:d.target.checked?"manual":"auto"})} />${t("ne.f.port_source")}</label>
          ${xe(a,"ne-area",t("ne.f.area"),e.area_id,!1,d=>this._patchForm({area_id:d[0]??null}))}
          <div class="grid2">
            ${w("ne-kind",t("ne.f.kind"),e.kind,fn.map(d=>({value:d,label:t(`kind.${d}`)})),d=>this._patchForm({kind:d}))}
            ${w("ne-parent",t("ne.f.parent"),e.parent_device_id??"",[{value:"",label:"\u2014"},...n.devices.filter(d=>d.id!==e.id).map(d=>({value:d.id,label:d.name}))],d=>this._patchForm({parent_device_id:d||null}))}
          </div>
          ${g("ne-model",t("ne.f.model"),e.model,d=>this._patchForm({model:d||null}))}
          ${g("ne-notes",t("ne.f.notes"),e.notes,d=>this._patchForm({notes:d||null}))}
        </div>
        <div class="form">
          <b>${t("ne.sensors")}</b>
          ${this._toggleRow("ping",t("ne.s.ping"),e.monitor.ping,d=>this._patchForm({monitor:{...e.monitor,ping:d}}))}
          ${this._entityPreview("online")}
          ${this._toggleRow("latency",t("ne.s.latency"),e.monitor.latency,d=>this._patchForm({monitor:{...e.monitor,latency:d}}))}
          ${this._entityPreview("latency")}
          ${this._toggleRow("tcp",t("ne.s.tcp"),!!e.monitor.tcp_port,d=>this._patchForm({monitor:{...e.monitor,tcp_port:d?80:null}}))}
          ${e.monitor.tcp_port!==null?o`${g("ne-tcp",t("ne.s.tcp"),e.monitor.tcp_port,d=>this._patchForm({monitor:{...e.monitor,tcp_port:Number(d)||null}}),{type:"number"})}
                ${this._entityPreview("tcp")}`:l}
          ${this._toggleRow("alert",t("ne.s.alert"),!!e.monitor.offline_alert_minutes,d=>this._patchForm({monitor:{...e.monitor,offline_alert_minutes:d?5:null}}))}
          ${e.monitor.offline_alert_minutes!==null?g("ne-alert",t("ne.s.alert"),e.monitor.offline_alert_minutes,d=>this._patchForm({monitor:{...e.monitor,offline_alert_minutes:Number(d)||null}}),{type:"number"}):l}
          ${this._preview.filter(d=>!["online","latency","tcp"].includes(d.key)).map(d=>o`<div class="ent">${d.entity_id}</div>`)}
          <p class="muted small" style="margin:0">${t("ne.interval",{s:u,name:e.name||"\u2026"})}</p>
          ${e.area_id?o`<span class="muted small">${ke(a,[e.area_id]).join("")}</span>`:l}
        </div>
      </div>`}_toggleRow(e,t,n,a){return o`<label class="tog" for=${`ne-s-${e}`}>
      <input type="checkbox" class="inp" id=${`ne-s-${e}`} .checked=${n} @change=${s=>a(s.target.checked)} />
      ${t}
    </label>`}_entityPreview(e){const t=this._preview.find(n=>n.key===e);return t?o`<div class="ent" data-preview=${e}>${t.entity_id}</div>`:l}_renderImport(){const e=this._t,t=this._proposals;return o`<div class="toolbar">
        <b style="flex:1">${e("ne.import_title")}</b>
        <button class="btn" @click=${()=>this._mode="list"}>${e("edit.cancel")}</button>
        <button class="btn pri" ?disabled=${!t||this._busy||!this._selVlans.size&&!this._selDevices.size} @click=${this._applyImport}>
          ${e("ne.import_apply")}
        </button>
      </div>
      <p class="muted small" style="margin:0">${e("ne.import_hint")}</p>
      ${t?!t.vlans.length&&!t.devices.length?o`<div class="empty">${e("ne.import_none")}</div>`:o`<h3>${e("ne.vlans")}</h3>
              <div class="scroll"><table class="tbl">
                <tbody>
                  ${t.vlans.map(n=>o`<tr>
                      <td><input type="checkbox" aria-label=${n.name} .checked=${this._selVlans.has(n.interface)} @change=${()=>this._selVlans=this._toggle(this._selVlans,n.interface)} /></td>
                      <td>${n.name}</td><td class="num">${n.subnet}</td><td>${n.tag??"\u2014"}</td>
                      <td>${n.existing_id?o`<span class="badge">${e("ne.exists")}</span>`:l}</td>
                    </tr>`)}
                </tbody>
              </table></div>
              <h3>${e("ne.devices")}</h3>
              <div class="scroll"><table class="tbl">
                <tbody>
                  ${t.devices.map(n=>o`<tr>
                      <td><input type="checkbox" aria-label=${n.name} ?disabled=${n.exists} .checked=${this._selDevices.has(n.key)} @change=${()=>this._selDevices=this._toggle(this._selDevices,n.key)} /></td>
                      <td>${n.name}</td><td class="num">${n.host}</td><td class="num">${n.mac??""}</td>
                      <td>${n.exists?o`<span class="badge">${e("ne.exists")}</span>`:l}</td>
                    </tr>`)}
                </tbody>
              </table></div>`:o`<div class="muted">${e("ne.loading")}</div>`}`}_vlanPatch(e,t){Object.assign(e,t),this._net={...this._net},this._dirty=!0}_renderVlans(){const e=this._t,t=this._net;return o`<h3>${e("ne.vlans")}</h3>
      <div class="scroll">
        <table class="tbl">
          <thead><tr><th>${e("ne.v.color")}</th><th>${e("ne.v.name")}</th><th>${e("ne.v.tag")}</th><th>${e("ne.v.subnet")}</th><th>${e("ne.v.role")}</th><th></th></tr></thead>
          <tbody>
            ${t.vlans.map(n=>o`<tr>
                <td style="width:44px"><input class="inp" type="color" aria-label=${`${e("ne.v.color")} ${n.name}`} .value=${n.color} @input=${a=>this._vlanPatch(n,{color:a.target.value})} /></td>
                <td><input class="inp" aria-label=${e("ne.v.name")} .value=${n.name} @input=${a=>this._vlanPatch(n,{name:a.target.value})} /></td>
                <td style="width:70px"><input class="inp" type="number" aria-label=${e("ne.v.tag")} .value=${n.tag===null?"":String(n.tag)} @input=${a=>{const s=a.target.value;this._vlanPatch(n,{tag:s?Number(s):null})}} /></td>
                <td><input class="inp num" aria-label=${e("ne.v.subnet")} .value=${n.subnet??""} @input=${a=>this._vlanPatch(n,{subnet:a.target.value||null})} /></td>
                <td><input class="inp" aria-label=${e("ne.v.role")} .value=${n.role} @input=${a=>this._vlanPatch(n,{role:a.target.value})} /></td>
                <td><button class="btn danger" aria-label=${`${e("ne.delete")} ${n.name}`} @click=${()=>{window.confirm(e("edit.confirm_delete",{name:n.name}))&&(this._net={...t,vlans:t.vlans.filter(a=>a.id!==n.id)},this._dirty=!0)}}>✕</button></td>
              </tr>`)}
          </tbody>
        </table>
      </div>
      <div class="btns">
        <button class="btn" @click=${()=>{this._net={...t,vlans:[...t.vlans,{id:F(),name:"VLAN",tag:null,subnet:null,color:"#607d8b",role:"",access_summary:"",interface:null}]},this._dirty=!0}}>${e("ne.vlan_add")}</button>
        <button class="btn pri" ?disabled=${!this._dirty||this._busy} @click=${()=>this._persist(this._net)}>${e("ne.save_network")}</button>
      </div>`}_renderUplink(){const e=this._t,t=this._net.uplink,n=a=>{this._net={...this._net,uplink:{...t,...a}},this._dirty=!0};return o`<h3>${e("ne.uplink")}</h3>
      <div class="grid2">
        ${g("ne-isp",e("ne.u.isp"),t.isp,a=>n({isp:a}))}
        ${g("ne-box",e("ne.u.box_name"),t.box_name,a=>n({box_name:a}))}
        ${g("ne-boxip",e("ne.u.box_ip"),t.box_ip,a=>n({box_ip:a||null}))}
        ${g("ne-pub",e("ne.u.public_ip"),t.public_ip,a=>n({public_ip:a||null}))}
      </div>
      <div class="btns"><button class="btn pri" ?disabled=${!this._dirty||this._busy} @click=${()=>this._persist(this._net)}>${e("ne.save_network")}</button></div>`}};Me.styles=B,Me.properties={hass:{attribute:!1},payload:{attribute:!1},_net:{state:!0},_mode:{state:!0},_form:{state:!0},_isNew:{state:!0},_probe:{state:!0},_probing:{state:!0},_preview:{state:!0},_proposals:{state:!0},_selVlans:{state:!0},_selDevices:{state:!0},_busy:{state:!0},_error:{state:!0},_dirty:{state:!0}};let vn=Me;function gn(i){return i?i>=1e3?`${i/1e3} Gbit/s`:`${i} Mbit/s`:""}function $n(i,e,t){const n=["p"];return e&&n.push("sfp"),i?.up&&n.push("up"),i?.poe&&n.push("poe"),t&&n.push("sel"),n.join(" ")}function Et(i,e,t,n){const a=t[String(e)],s=i.sfp_ports.includes(e),r=i.port_labels[String(e)]||a?.alias||"",c=a?.up?n.t("net.link_up"):a?.up===!1?n.t("net.link_down"):"";return o`<button
    class=${$n(a,s,n.selectedPort===e)}
    data-port=${e}
    aria-label=${[n.t("net.port_detail",{n:e}),r,c,a?.poe?n.t("net.poe"):""].filter(Boolean).join(", ")}
    aria-pressed=${n.selectedPort===e?"true":"false"}
    title=${r}
    @click=${()=>n.onSelectPort(n.selectedPort===e?null:e)}
  >
    ${e}
  </button>`}function wn(i){const{t:e,payload:t}=i,n=t.model.network.switches;if(!n.length)return o`<div class="empty">${e("net.no_switch")}</div>`;const a=n.find(b=>b.id===i.switchId)??n[0],s=t.live.switches[a.id],r=s?.ports??{},c=Array.from({length:a.ports_count},(b,_)=>_+1),p=c.filter(b=>!a.sfp_ports.includes(b)),u=c.filter(b=>a.sfp_ports.includes(b)),d=i.selectedPort,m=d!==null?r[String(d)]:void 0,f=d!==null?Ei(t.model.network.devices,a,d,m?.macs??[]):[],v=b=>t.model.network.vlans.find(_=>_.tag===b)?.name;return o`
    ${n.length>1?o`<div class="seg" role="tablist">
          ${n.map(b=>o`<button role="tab" aria-selected=${b.id===a.id?"true":"false"} @click=${()=>i.onSelectSwitch(b.id)}>${b.name}</button>`)}
        </div>`:l}
    <div class="muted small">${a.name}${a.host?` \xB7 ${a.host}`:""}${s?.sys_name?` \xB7 ${s.sys_name}`:""}</div>
    ${s&&!s.available?o`<div class="banner info">${e("net.switch_unavailable")}</div>`:l}
    <div class="sw" role="group" aria-label=${a.name}>
      <div class="sw-copper">${p.map(b=>Et(a,b,r,i))}</div>
      ${u.length?o`<div class="sw-sfp">${u.map(b=>Et(a,b,r,i))}</div>`:l}
    </div>
    ${d!==null?o`<dl class="detail" aria-live="polite">
          <dt>${e("net.port_detail",{n:d})}</dt>
          <dd>
            ${[a.port_labels[String(d)]||m?.alias||m?.name||"",m?.up===!0?gn(m.speed_mbps)||e("net.link_up"):m?.up===!1?e("net.link_down"):"",m?.poe?e("net.poe"):""].filter(Boolean).join(" \xB7 ")||"\u2014"}
          </dd>
          ${m?o`<dt>VLAN</dt>
                <dd>
                  ${e("net.vlans_line",{pvid:m.pvid!==null?`${m.pvid}${v(m.pvid)?` (${v(m.pvid)})`:""}`:"\u2014",tagged:m.tagged_vlans.length?m.tagged_vlans.join(", "):"\u2014"})}
                </dd>`:l}
          ${m?.lldp?.sys_name?o`<dt>${e("net.lldp")}</dt><dd>${m.lldp.sys_name}${m.lldp.port_id?` (${m.lldp.port_id})`:""}</dd>`:l}
          <dt>${e("net.seen")}</dt>
          <dd>
            ${f.length?f.map(b=>o`<button class="ent" @click=${()=>i.onOpenDevice(b.id)}>${b.name}</button><br />`):"\u2014"}
            ${m?.macs?.length?o`<span class="muted small">${e("net.macs",{n:m.macs.length})}</span>`:l}
          </dd>
        </dl>`:l}
  `}function Y(i,e,t,n,a){const s=[mt(i,t,n,a)];for(const r of Pi(e,i.id))s.push(...Y(r,e,t,n+1,""));return s}function yn(i){const{t:e,payload:t}=i,n=t.model.network,a=n.devices;if(!a.length&&!n.switches.length)return o`<div class="empty">${e("net.no_devices")}</div>`;const s=n.uplink,r=a.filter(f=>f.kind==="router"),c=f=>a.find(v=>v.kind==="switch"&&f&&v.host===f),p=new Set,u=n.switches.map(f=>{const v=c(f.host);v&&p.add(v.id);const b=Ci(a,f.id).map(_=>({..._,devices:_.devices.filter(h=>h.kind!=="router"&&h.id!==v?.id)})).filter(_=>_.devices.length>0);return o`<div class="portgrp">
      ${v?mt(v,i,3):o`<div class="tn" style="margin-left:calc(var(--him-indent) * 3)"><span class="dot off"></span><span class="name">${f.name}</span>
            <span class="ip num">${f.host??""}</span></div>`}
      ${b.flatMap(_=>{_.devices.forEach($=>p.add($.id));const h=e("net.port",{n:_.port});if(_.devices.length===1)return Y(_.devices[0],a,i,4,h);const y=f.port_labels[String(_.port)];return[o`<div class="tn port-head" style="margin-left:calc(var(--him-indent) * 4)">
            <span class="name"><b>${h}</b>${y?o`<span class="muted"> · ${y}</span>`:l}</span>
            <span class="ip muted small">${e("net.devices_n",{n:_.devices.length})}</span>
          </div>`,..._.devices.flatMap($=>Y($,a,i,5,""))]})}
    </div>`});for(const f of r)p.add(f.id);const d=Ni(a,n.switches).filter(f=>!p.has(f.id)&&f.kind!=="router"),m=t.live.opnsense.gateways;return o`<div class="topo">
    <div class="tn">
      <span class=${m.length?m.some(f=>f.online)?"dot":"dot bad":"dot off"}></span>
      <span class="name"><b>${e("net.internet")}</b> ${s.isp}</span>
      <span class="ip num">${s.public_ip??""}</span>
    </div>
    ${s.box_name||s.box_ip?o`<div class="tn" style="margin-left:var(--him-indent)"><span class="dot off"></span><span class="name">${s.box_name}</span>
          <span class="ip num">${s.box_ip??""}</span></div>`:l}
    ${r.flatMap(f=>Y(f,a,i,2,""))}
    ${u}
    ${d.length?o`<h3>${e("net.unplaced")}</h3>
          ${d.flatMap(f=>Y(f,a,i,1,""))}`:l}
  </div>`}function Mt(i,e){return i.slice().sort((t,n)=>re(t.host).localeCompare(re(n.host))).map(t=>o`<button class="row" data-device-id=${t.id} @click=${()=>e.onOpenDevice(t.id)}>
        ${ut(t,e)}<span>${t.name}</span><span class="muted num" style="margin-left:auto">${t.host}</span>
      </button>`)}function kn(i){const{t:e,payload:t}=i,n=t.model.network,a=n.devices.filter(s=>!s.vlan_id);return!n.vlans.length&&!n.devices.length?o`<div class="empty">${e("net.no_devices")}</div>`:o`<div class="vgrid">
    ${n.vlans.map(s=>{const r=n.devices.filter(c=>c.vlan_id===s.id);return o`<section class="vc" style=${`--vc:${s.color}`} aria-label=${s.name} data-vlan-id=${s.id}>
        <b>${s.name} · ${s.tag?e("net.vlan_tag",{tag:s.tag}):e("net.untagged")}</b>
        <span class="num">${s.subnet??""}</span>
        ${s.role?o`<span class="muted small">${s.role}</span>`:l}
        ${s.access_summary?o`<span class="muted small">${s.access_summary}</span>`:l}
        <span class="muted small">${e("net.devices_n",{n:r.length})}</span>
        ${Mt(r,i)}
      </section>`})}
    ${a.length?o`<section class="vc"><b>${e("net.no_vlan")}</b>${Mt(a,i)}</section>`:l}
  </div>`}const U="home-infra-map-card",Rt="home-infra-map-card-editor";let xn=0;function Tt(i,e=new Date){const t=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;return`home-infra-map-${i}-${t}.yaml`}function Dt(i,e){const t=URL.createObjectURL(new Blob([e],{type:"text/yaml;charset=utf-8"})),n=document.createElement("a");n.href=t,n.download=i,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(t),1e3)}const Re=class extends S{constructor(){super(),this._instance=++xn,this._unsub=null,this._subscribing=!1,this._retries=0,this._firstRender=!0,this._viewFromConfig=!1,this._historyFor=null,this._view="electricity",this._networkView="topology",this._boardId=null,this._moduleId=null,this._history=null,this._showWarnings=!1,this._deviceId=null,this._sheetTab="info",this._switchId=null,this._port=null,this._edit=!1,this._editKey=0,this._dialog=null}static getConfigElement(){return document.createElement(Rt)}static getStubConfig(){return{type:`custom:${U}`,view:"electricity"}}setConfig(e){if(!e||typeof e!="object")throw C("error","card","#%d setConfig rejected: %o",this._instance,e),new Error("Invalid configuration");this._config=e,this._viewFromConfig=!!e.view,(e.view==="electricity"||e.view==="network")&&(this._view=e.view),e.network_view&&["topology","vlan","switch"].includes(e.network_view)&&(this._networkView=e.network_view),e.board&&(this._boardId=e.board),C("info","card","#%d setConfig accepted at t=%dms",this._instance,Math.round(performance.now()))}getCardSize(){return Ri()}getGridOptions(){return Mi()}connectedCallback(){super.connectedCallback(),this._retries=0,this.hass&&!this._unsub&&this._load()}disconnectedCallback(){super.disconnectedCallback(),window.clearTimeout(this._retryTimer),this._retryTimer=void 0,this._unsub?.(),this._unsub=null}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&!this._subscribing&&this.isConnected&&this._retryTimer===void 0&&this._load()}get _lang(){return we(this.hass)}get _t(){return L(this._lang)}async _load(){if(!(!this.hass||this._subscribing)){this._subscribing=!0;try{const e=await ge(this.hass);this._applyPayload(e),this._error=void 0;const t=await ci(this.hass,n=>this._onEvent(n));if(!this.isConnected){t();return}this._unsub=()=>{t()}}catch(e){const t=R(e);this._error=t==="not_configured"?this._t("card.not_configured"):this._t("card.error",{error:x(e)}),C("warn","card","#%d load failed (%s)",this._instance,t),t!=="not_configured"&&this._retries<10&&(this._retries+=1,this._retryTimer=window.setTimeout(()=>{this._retryTimer=void 0,this._load()},Math.min(2e3*this._retries,15e3)))}finally{this._subscribing=!1}}}_applyPayload(e){this._payload=e,!this._viewFromConfig&&e.settings.default_view&&(this._view=e.settings.default_view),this._viewFromConfig=!0,(!this._boardId||!e.model.boards.some(t=>t.id===this._boardId))&&(this._boardId=e.model.boards[0]?.id??null)}_onEvent(e){if(e.kind==="model"){const{kind:t,...n}=e;this._applyPayload(n)}else e.kind==="live"&&this._payload&&(this._payload={...this._payload,live:e.live})}updated(){this.getAttribute("lang")!==this._lang&&this.setAttribute("lang",this._lang),this._firstRender&&this._payload&&(this._firstRender=!1,C("info","card","#%d first render with data at t=%dms (v%s)",this._instance,Math.round(performance.now()),ht)),this.dispatchEvent(new CustomEvent("home-infra-map-card-update",{bubbles:!0,composed:!0}))}get _board(){return this._payload?.model.boards.find(e=>e.id===this._boardId)??null}_selectModule(e){this._moduleId=e,this._history=null;const t=(e?this._board?.rows.flatMap(n=>n.modules).find(n=>n.id===e):void 0)?.power_entity_id;!t||!this.hass||(this._historyFor=t,et(this.hass,[t]).then(n=>{this._historyFor===t&&(this._history=ot(n[t]))}).catch(()=>this._history=[]))}async _openPhoto(){const e=this._board;if(!(!e?.photo_path||!this.hass)){this._dialog={kind:"photo",text:e.name,busy:!0};try{const t=await gi(this.hass,e.id,e.photo_path.split("?v=")[1]??"");this._dialog={kind:"photo",text:e.name,url:t}}catch(t){this._dialog=null,T(this,this._t("card.error",{error:x(t)}))}}}async _tool(e){if(this.hass){if(e==="import"){this._dialog={kind:e,text:""};return}this._dialog={kind:e,text:"",busy:!0};try{const t=e==="export"?await _i(this.hass):await vi(this.hass);this._dialog={kind:e,text:t.yaml}}catch(t){this._dialog={kind:e,text:this._t("card.error",{error:x(t)})}}}}async _readImportFile(e){const t=e.target,n=t.files?.[0];if(t.value="",!(!n||!this._dialog)){if(n.size>2*1024*1024){T(this,this._t("tools.file_too_large"));return}this._dialog={...this._dialog,text:await n.text()}}}async _runImport(){if(!(!this.hass||!this._dialog)){this._dialog={...this._dialog,busy:!0};try{const e=await bi(this.hass,this._dialog.text);T(this,this._t("tools.import_done",e)),this._dialog=null,this._editKey+=1}catch(e){const t=R(e)==="unauthorized"?this._t("edit.refused"):this._t("card.error",{error:x(e)});this._dialog={...this._dialog,busy:!1},T(this,t)}}}async _onConflict(){if(T(this,this._t("edit.conflict")),this.hass)try{this._applyPayload(await ge(this.hass))}catch{}this._editKey+=1}render(){const e=this._t;if(!this._payload)return o`<ha-card>
        <div class="head"><span class="title">${this._config?.title??e("card.name")}</span></div>
        <div class="body">
          ${this._error?o`<div class="banner" role="alert">${this._error}</div>
                <div class="btns"><button class="btn" @click=${()=>{this._retries=0,this._load()}}>${e("card.retry")}</button></div>`:o`<div class="muted" role="status">${e("card.loading")}</div>`}
        </div>
      </ha-card>`;const t=!!this.hass?.user?.is_admin;return o`<ha-card>
      ${this._renderHeader(t)}
      <div class="body">
        ${this._edit&&t?this._renderEdit():this._view==="electricity"?this._renderElectricity():this._renderNetwork()}
      </div>
      ${this._deviceId?o`<home-infra-map-device-sheet
            .hass=${this.hass}
            .payload=${this._payload}
            .deviceId=${this._deviceId}
            .tab=${this._sheetTab}
            @close=${()=>this._deviceId=null}
          ></home-infra-map-device-sheet>`:l}
      ${this._dialog?this._renderDialog():l}
    </ha-card>`}_renderHeader(e){const t=this._t,n=this._board;let a=this._config?.title;return a||(a=this._view==="electricity"&&n?[n.name,n.location].filter(Boolean).join(" \xB7 "):t("view.network")),this._edit&&(a=t("edit.title",{name:this._view==="electricity"?n?.name??t("view.electricity"):t("view.network")})),o`<div class="head">
      <span class="title">${a}</span>
      <div class="head-actions">
        ${this._edit?o`<button class="btn" @click=${()=>this._tool("export")}>${t("tools.export")}</button>
              <button class="btn" @click=${()=>this._tool("import")}>${t("tools.import")}</button>
              <button class="btn" @click=${()=>this._tool("dashboard")}>${t("tools.dashboard")}</button>`:l}
        <div class="seg" role="tablist" aria-label=${t("card.name")}>
          ${["electricity","network"].map(s=>o`<button role="tab" aria-selected=${this._view===s?"true":"false"} @click=${()=>{this._view=s,this._moduleId=null}}>${t(`view.${s}`)}</button>`)}
        </div>
        ${e?o`<button
              class="icon-btn"
              aria-label=${this._edit?t("edit.close"):t("edit.open")}
              aria-pressed=${this._edit?"true":"false"}
              title=${this._edit?t("edit.close"):t("edit.open")}
              @click=${()=>{this._edit=!this._edit,this._editKey+=1}}
            >
              ${customElements.get("ha-icon")?o`<ha-icon icon=${this._edit?"mdi:close":"mdi:pencil"}></ha-icon>`:this._edit?"\u2715":"\u270E"}
            </button>`:l}
      </div>
    </div>`}_renderElectricity(){return tn({hass:this.hass,payload:this._payload,t:this._t,lang:this._lang,board:this._board,selectedModuleId:this._moduleId,showWarnings:this._showWarnings,history:this._history,historyRange:[Date.now()-24*3600*1e3,Date.now()],hasPhoto:!!this._board?.photo_path,onSelectBoard:e=>{this._boardId=e,this._moduleId=null},onSelectModule:e=>this._selectModule(e),onToggleWarnings:()=>this._showWarnings=!this._showWarnings,onOpenPhoto:()=>{this._openPhoto()},onMoreInfo:e=>it(this,e)})}_renderNetwork(){const e=this._t,t=this._payload,n={hass:this.hass,payload:t,t:e,lang:this._lang,onOpenDevice:s=>{this._deviceId=s,this._sheetTab="info"}},a=Ii(t,this.hass);return o`
      <div class="toolbar">
        <div class="seg" role="tablist" aria-label=${e("view.network")}>
          ${["topology","vlan","switch"].map(s=>o`<button role="tab" aria-selected=${this._networkView===s?"true":"false"} @click=${()=>this._networkView=s}>
              ${e(`nview.${s}`)}
            </button>`)}
        </div>
      </div>
      <div class="chips">
        <span class="chip"><span class="dot"></span>${e("net.online",{n:a.online})}</span>
        ${a.offline?o`<span class="chip"><span class="dot bad"></span>${e("net.offline",{n:a.offline})}</span>`:l}
        ${t.live.opnsense.gateways.map(s=>o`<span class="chip"><span class=${s.online?"dot":"dot bad"}></span>${e("net.gateway",{name:s.name,delay:s.delay??""})}</span>`)}
      </div>
      ${t.live.ping_available?l:o`<div class="banner info">${e("net.ping_unavailable")}</div>`}
      ${this._networkView==="topology"?yn(n):l}
      ${this._networkView==="vlan"?kn(n):l}
      ${this._networkView==="switch"?wn({...n,switchId:this._switchId,selectedPort:this._port,onSelectSwitch:s=>{this._switchId=s,this._port=null},onSelectPort:s=>this._port=s}):l}
    `}_renderEdit(){const e=()=>T(this,this._t("edit.saved"));return di(`${this._view}-${this._editKey}`,this._view==="electricity"?o`<home-infra-map-electricity-editor
            .hass=${this.hass}
            .payload=${this._payload}
            .boardId=${this._boardId}
            @him-saved=${t=>{e(),t.detail?.boardId&&(this._boardId=t.detail.boardId),this._edit=!1}}
            @him-cancel=${()=>this._edit=!1}
            @him-conflict=${this._onConflict}
          ></home-infra-map-electricity-editor>`:o`<home-infra-map-network-editor
            .hass=${this.hass}
            .payload=${this._payload}
            @him-saved=${e}
            @him-conflict=${this._onConflict}
          ></home-infra-map-network-editor>`)}_renderDialog(){const e=this._t,t=this._dialog,n=()=>this._dialog=null,a=t.kind==="export"?e("tools.export"):t.kind==="import"?e("tools.import"):t.kind==="dashboard"?e("tools.dashboard"):t.text;return o`<div
      class="overlay"
      @click=${s=>s.target===s.currentTarget&&n()}
      @keydown=${s=>s.key==="Escape"&&n()}
    >
      <div class="sheet" role="dialog" aria-modal="true" aria-label=${a}>
        <div class="head">
          <span class="title">${a}</span>
          <button class="icon-btn" aria-label=${e("tools.close")} @click=${n}>✕</button>
        </div>
        ${t.kind==="photo"?t.url?o`<img class="photo-full" src=${t.url} alt=${e("el.photo")} />`:o`<div class="body muted">${e("card.loading")}</div>`:o`<div class="body">
              ${t.kind==="import"?o`<p class="muted small" style="margin:0">${e("tools.import_hint")}</p>
                    <label class="btn" style="display:inline-flex;align-items:center;width:max-content">
                      ${e("tools.choose_file")}
                      <input type="file" accept=".yaml,.yml,text/yaml,application/x-yaml,text/plain" style="display:none"
                        @change=${s=>this._readImportFile(s)} />
                    </label>
                    <textarea class="inp" rows="14" aria-label=${e("tools.import")} .value=${t.text}
                      @input=${s=>this._dialog={...t,text:s.target.value}}></textarea>
                    <div class="btns">
                      <button class="btn pri" ?disabled=${t.busy||!t.text.trim()} @click=${this._runImport}>${e("tools.import_run")}</button>
                    </div>`:t.busy?o`<div class="muted">${e("card.loading")}</div>`:o`${t.kind==="dashboard"?o`<p class="muted small" style="margin:0">${e("tools.dashboard_hint")}</p>`:l}
                      <pre class="yaml">${t.text}</pre>
                      <div class="btns">
                        <button class="btn pri" @click=${async()=>T(this,await ki(t.text)?e("tools.copied"):e("card.error",{error:"clipboard"}))}>
                          ${e("tools.copy")}
                        </button>
                        <button class="btn" @click=${()=>Dt(Tt(t.kind==="dashboard"?"dashboard":"export"),t.text)}>
                          ${e("tools.download")}
                        </button>
                      </div>`}
            </div>`}
      </div>
    </div>`}};Re.styles=B,Re.properties={hass:{attribute:!1},_config:{state:!0},_payload:{state:!0},_error:{state:!0},_view:{state:!0},_networkView:{state:!0},_boardId:{state:!0},_moduleId:{state:!0},_history:{state:!0},_showWarnings:{state:!0},_deviceId:{state:!0},_sheetTab:{state:!0},_switchId:{state:!0},_port:{state:!0},_edit:{state:!0},_editKey:{state:!0},_dialog:{state:!0}};let Ot=Re;G("home-infra-map-device-sheet",Hi),G("home-infra-map-electricity-editor",mn),G("home-infra-map-network-editor",vn),G(Rt,Si),G(U,Ot),C("info","card","v%s registered at t=%dms",ht,Math.round(performance.now())),Li(U),window.customCards=window.customCards??[],window.customCards.some(i=>i.type===U)||window.customCards.push({type:U,name:"Home Infra Map",description:L(we(void 0))("card.description"),preview:!1,documentationURL:"https://github.com/Eric-D/ha-home-infra-map"});export{U as CARD_TAG,Ot as HomeInfraMapCard,Dt as downloadText,Tt as yamlFilename};
