/* home-infra-map-card — built artefact, do not edit. Sources: frontend/src/ */
const ce=globalThis,ke=ce.ShadowRoot&&(ce.ShadyCSS===void 0||ce.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ae=Symbol(),Ze=new WeakMap;let Xe=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==Ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o;const e=this.t;if(ke&&i===void 0){const t=e!==void 0&&e.length===1;t&&(i=Ze.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&Ze.set(e,i))}return i}toString(){return this.cssText}};const bi=i=>new Xe(typeof i=="string"?i:i+"",void 0,Ae),fi=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((s,n,o)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[o+1],i[0]);return new Xe(t,i,Ae)},_i=(i,e)=>{if(ke)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),n=ce.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=t.cssText,i.appendChild(s)}},et=ke?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return bi(t)})(i):i,{is:$i,defineProperty:gi,getOwnPropertyDescriptor:vi,getOwnPropertyNames:xi,getOwnPropertySymbols:wi,getPrototypeOf:yi}=Object,ue=globalThis,tt=ue.trustedTypes,ki=tt?tt.emptyScript:"",Ai=ue.reactiveElementPolyfillSupport,X=(i,e)=>i,Ce={toAttribute(i,e){switch(e){case Boolean:i=i?ki:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},it=(i,e)=>!$i(i,e),st={attribute:!0,type:String,converter:Ce,reflect:!1,useDefault:!1,hasChanged:it};Symbol.metadata??=Symbol("metadata"),ue.litPropertyMetadata??=new WeakMap;let q=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=st){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){const t=Symbol(),s=this.getPropertyDescriptor(i,t,e);s!==void 0&&gi(this.prototype,i,s)}}static getPropertyDescriptor(i,e,t){const{get:s,set:n}=vi(this.prototype,i)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const a=s?.call(this);n?.call(this,o),this.requestUpdate(i,a,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??st}static _$Ei(){if(this.hasOwnProperty(X("elementProperties")))return;const i=yi(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(X("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(X("properties"))){const e=this.properties,t=[...xi(e),...wi(e)];for(const s of t)this.createProperty(s,e[s])}const i=this[Symbol.metadata];if(i!==null){const e=litPropertyMetadata.get(i);if(e!==void 0)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){const e=[];if(Array.isArray(i)){const t=new Set(i.flat(1/0).reverse());for(const s of t)e.unshift(et(s))}else i!==void 0&&e.push(et(i));return e}static _$Eu(i,e){const t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){const i=new Map,e=this.constructor.elementProperties;for(const t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _i(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){const t=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,t);if(s!==void 0&&t.reflect===!0){const n=(t.converter?.toAttribute!==void 0?t.converter:Ce).toAttribute(e,t.type);this._$Em=i,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(i,e){const t=this.constructor,s=t._$Eh.get(i);if(s!==void 0&&this._$Em!==s){const n=t.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Ce;this._$Em=s;const a=o.fromAttribute(e,n.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(i,e,t,s=!1,n){if(i!==void 0){const o=this.constructor;if(s===!1&&(n=this[i]),t??=o.getPropertyOptions(i),!((t.hasChanged??it)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(i)&&!this.hasAttribute(o._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:s,wrapped:n},o){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,o??e??this[i]),n!==!0||o!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,n]of t){const{wrapped:o}=n,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let i=!1;const e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};q.elementStyles=[],q.shadowRootOptions={mode:"open"},q[X("elementProperties")]=new Map,q[X("finalized")]=new Map,Ai?.({ReactiveElement:q}),(ue.reactiveElementVersions??=[]).push("2.1.2");const Se=globalThis,nt=i=>i,pe=Se.trustedTypes,ot=pe?pe.createPolicy("lit-html",{createHTML:i=>i}):void 0,at="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,rt="?"+T,Ci=`<${rt}>`,z=document,ee=()=>z.createComment(""),te=i=>i===null||typeof i!="object"&&typeof i!="function",Ie=Array.isArray,Si=i=>Ie(i)||typeof i?.[Symbol.iterator]=="function",Me=`[ 	
\f\r]`,ie=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,lt=/-->/g,dt=/>/g,F=RegExp(`>|${Me}(?:([^\\s"'>=/]+)(${Me}*=${Me}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ct=/'/g,ut=/"/g,pt=/^(?:script|style|textarea|title)$/i,ht=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),r=ht(1),A=ht(2),W=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),mt=new WeakMap,L=z.createTreeWalker(z,129);function bt(i,e){if(!Ie(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ot!==void 0?ot.createHTML(e):e}const Ii=(i,e)=>{const t=i.length-1,s=[];let n,o=e===2?"<svg>":e===3?"<math>":"",a=ie;for(let l=0;l<t;l++){const u=i[l];let d,p,m=-1,b=0;for(;b<u.length&&(a.lastIndex=b,p=a.exec(u),p!==null);)b=a.lastIndex,a===ie?p[1]==="!--"?a=lt:p[1]!==void 0?a=dt:p[2]!==void 0?(pt.test(p[2])&&(n=RegExp("</"+p[2],"g")),a=F):p[3]!==void 0&&(a=F):a===F?p[0]===">"?(a=n??ie,m=-1):p[1]===void 0?m=-2:(m=a.lastIndex-p[2].length,d=p[1],a=p[3]===void 0?F:p[3]==='"'?ut:ct):a===ut||a===ct?a=F:a===lt||a===dt?a=ie:(a=F,n=void 0);const f=a===F&&i[l+1].startsWith("/>")?" ":"";o+=a===ie?u+Ci:m>=0?(s.push(d),u.slice(0,m)+at+u.slice(m)+T+f):u+T+(m===-2?l:f)}return[bt(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class le{constructor({strings:e,_$litType$:t},s){let n;this.parts=[];let o=0,a=0;const l=e.length-1,u=this.parts,[d,p]=Ii(e,t);if(this.el=le.createElement(d,s),L.currentNode=this.el.content,t===2||t===3){const m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(n=L.nextNode())!==null&&u.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(const m of n.getAttributeNames())if(m.endsWith(at)){const b=p[a++],f=n.getAttribute(m).split(T),$=/([.?@])?(.*)/.exec(b);u.push({type:1,index:o,name:$[2],strings:f,ctor:$[1]==="."?Pi:$[1]==="?"?Ni:$[1]==="@"?Ei:he}),n.removeAttribute(m)}else m.startsWith(T)&&(u.push({type:6,index:o}),n.removeAttribute(m));if(pt.test(n.tagName)){const m=n.textContent.split(T),b=m.length-1;if(b>0){n.textContent=pe?pe.emptyScript:"";for(let f=0;f<b;f++)n.append(m[f],ee()),L.nextNode(),u.push({type:2,index:++o});n.append(m[b],ee())}}}else if(n.nodeType===8)if(n.data===rt)u.push({type:2,index:o});else{let m=-1;for(;(m=n.data.indexOf(T,m+1))!==-1;)u.push({type:7,index:o}),m+=T.length-1}o++}}static createElement(e,t){const s=z.createElement("template");return s.innerHTML=e,s}}function V(i,e,t=i,s){if(e===W)return e;let n=s!==void 0?t._$Co?.[s]:t._$Cl;const o=te(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),o===void 0?n=void 0:(n=new o(i),n._$AT(i,t,s)),s!==void 0?(t._$Co??=[])[s]=n:t._$Cl=n),n!==void 0&&(e=V(i,n._$AS(i,e.values),n,s)),e}let Mi=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){const{el:{content:e},parts:t}=this._$AD,s=(i?.creationScope??z).importNode(e,!0);L.currentNode=s;let n=L.nextNode(),o=0,a=0,l=t[0];for(;l!==void 0;){if(o===l.index){let u;l.type===2?u=new de(n,n.nextSibling,this,i):l.type===1?u=new l.ctor(n,l.name,l.strings,this,i):l.type===6&&(u=new Ri(n,this,i)),this._$AV.push(u),l=t[++a]}o!==l?.index&&(n=L.nextNode(),o++)}return L.currentNode=z,s}p(i){let e=0;for(const t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}};class de{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,n){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=V(this,e,t),te(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==W&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Si(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&te(this._$AH)?this._$AA.nextSibling.data=e:this.T(z.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,n=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=le.createElement(bt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===n)this._$AH.p(t);else{const o=new Mi(n,this),a=o.u(this.options);o.p(t),this.T(a),this._$AH=o}}_$AC(e){let t=mt.get(e.strings);return t===void 0&&mt.set(e.strings,t=new le(e)),t}k(e){Ie(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,n=0;for(const o of e)n===t.length?t.push(s=new de(this.O(ee()),this.O(ee()),this,this.options)):s=t[n],s._$AI(o),n++;n<t.length&&(this._$AR(s&&s._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const s=nt(e).nextSibling;nt(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class he{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,n,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(e,t=this,s,n){const o=this.strings;let a=!1;if(o===void 0)e=V(this,e,t,0),a=!te(e)||e!==this._$AH&&e!==W,a&&(this._$AH=e);else{const l=e;let u,d;for(e=o[0],u=0;u<o.length-1;u++)d=V(this,l[s+u],t,u),d===W&&(d=this._$AH[u]),a||=!te(d)||d!==this._$AH[u],d===c?e=c:e!==c&&(e+=(d??"")+o[u+1]),this._$AH[u]=d}a&&!n&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Pi extends he{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}}class Ni extends he{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}}class Ei extends he{constructor(e,t,s,n,o){super(e,t,s,n,o),this.type=5}_$AI(e,t=this){if((e=V(this,e,t,0)??c)===W)return;const s=this._$AH,n=e===c&&s!==c||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==c&&(s===c||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class Ri{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){V(this,e)}}const ji=Se.litHtmlPolyfillSupport;ji?.(le,de),(Se.litHtmlVersions??=[]).push("3.3.3");const Ti=(i,e,t)=>{const s=t?.renderBefore??e;let n=s._$litPart$;if(n===void 0){const o=t?.renderBefore??null;s._$litPart$=n=new de(e.insertBefore(ee(),o),o,void 0,t??{})}return n._$AI(i),n},Pe=globalThis;let P=class extends q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=Ti(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};P._$litElement$=!0,P.finalized=!0,Pe.litElementHydrateSupport?.({LitElement:P});const Di=Pe.litElementPolyfillSupport;Di?.({LitElement:P}),(Pe.litElementVersions??=[]).push("4.2.2");const Oi=i=>(...e)=>({_$litDirective$:i,values:e});let Bi=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,e,t){this._$Ct=i,this._$AM=e,this._$Ci=t}_$AS(i,e){return this.update(i,e)}update(i,e){return this.render(...e)}};const zi={},Fi=(i,e=zi)=>i._$AH=e,me=Oi(class extends Bi{constructor(){super(...arguments),this.key=c}render(i,e){return this.key=i,e}update(i,[e,t]){return e!==this.key&&(Fi(i),this.key=e),t}}),I="home_infra_map";function D(i){return i?.code??"unknown_error"}function M(i){const e=i;return e?.message??e?.code??String(i)}const Ne=i=>i.callWS({type:`${I}/get`});function Li(i,e){return i.connection.subscribeMessage(e,{type:`${I}/subscribe`})}const Ee=(i,e,t,s)=>i.callWS({type:`${I}/save`,section:e,data:t,expected_revision:s}),Ui=(i,e)=>i.callWS({type:`${I}/probe`,host:e}),Hi=(i,e)=>i.callWS({type:`${I}/preview_entities`,device:e}),qi=i=>i.callWS({type:`${I}/import_opnsense`}),Wi=(i,e,t,s)=>i.callWS({type:`${I}/import_opnsense`,apply:!0,vlans:e,devices:t,expected_revision:s}),Vi=(i,e)=>i.callWS({type:`${I}/firewall`,device_id:e}),Gi=i=>i.callWS({type:`${I}/export`}),Ki=(i,e)=>i.callWS({type:`${I}/import_yaml`,content:e}),Ji=i=>i.callWS({type:`${I}/generate_dashboard`});async function ft(i,e){if(!e.length)return{};const t=new Date,s=new Date(t.getTime()-24*3600*1e3);return i.callWS({type:"history/history_during_period",start_time:s.toISOString(),end_time:t.toISOString(),entity_ids:e,minimal_response:!0,no_attributes:!0,significant_changes_only:!1})}function _t(i){return`/api/${I}/photo/${encodeURIComponent(i)}`}async function Qi(i,e,t){const s=await i.callWS({type:"auth/sign_path",path:_t(e),expires:3600}),n=s.path.includes("?")?"&":"?";return`${s.path}${n}v=${encodeURIComponent(t)}`}async function Yi(i,e,t){if(!i.fetchWithAuth)throw new Error("upload not supported by this frontend");const s=new FormData;s.append("file",t);const n=await i.fetchWithAuth(_t(e),{method:"POST",body:s}),o=await n.json().catch(()=>({}));if(!n.ok||!o.photo_path)throw new Error(o.message??`HTTP ${n.status}`);return o.photo_path}const Zi={"card.name":"Home Infra Map","card.description":"Tableaux \xE9lectriques et r\xE9seau de la maison","card.loading":"Chargement\u2026","card.not_configured":"L'int\xE9gration Home Infra Map n'est pas configur\xE9e (Param\xE8tres \u2192 Appareils et services).","card.error":"Erreur : {error}","card.retry":"R\xE9essayer","view.electricity":"\xC9lectricit\xE9","view.network":"R\xE9seau","nview.topology":"Topologie","nview.vlan":"VLAN","nview.switch":"Switch","edit.open":"Modifier","edit.close":"Quitter la modification","edit.title":"Modifier \xB7 {name}","edit.cancel":"Annuler","edit.save":"Enregistrer","edit.saved":"Enregistr\xE9","edit.conflict":"Les donn\xE9es ont \xE9t\xE9 modifi\xE9es ailleurs. Rechargement : vos changements non enregistr\xE9s sont perdus.","edit.refused":"Action refus\xE9e : r\xE9serv\xE9e aux administrateurs.","edit.failed":"\xC9chec : {error}","edit.confirm_delete":"Supprimer \xAB {name} \xBB ?","edit.unsaved":"Modifications non enregistr\xE9es","tools.export":"Exporter","tools.download":"T\xE9l\xE9charger (.yaml)","tools.choose_file":"Choisir un fichier .yaml\u2026","tools.file_too_large":"Fichier trop volumineux (2 Mo au plus).","el.slots":"{used} / {capacity} modules","el.slots_unknown":"{used} modules (largeur du rail non renseign\xE9e)","ee.board_slots":"Modules par rang\xE9e (largeur du rail)","ee.row_capacity":"Modules de cette rang\xE9e (vide = celle du tableau)","ee.add_spacer":"Ajouter un emplacement vide \xE0 la rang\xE9e {label}","check.row_overflow":"Rang\xE9e {row} : {used} modules pour un rail de {capacity} : \xE0 v\xE9rifier","tools.import":"Importer","tools.dashboard":"G\xE9n\xE9rer un exemple de tableau de bord","tools.copy":"Copier","tools.copied":"Copi\xE9","tools.close":"Fermer","tools.import_hint":"Collez un export Home Infra Map ou un fichier de la maison (tableaux / \xE9quipements). Les sections pr\xE9sentes remplacent les donn\xE9es actuelles.","tools.import_run":"Importer","tools.import_done":"Import termin\xE9 : {boards} tableau(x), {modules} modules, {vlans} VLAN, {devices} \xE9quipements.","tools.dashboard_hint":"Copiez ce YAML dans un tableau de bord (Modifier \u2192 \u22EE \u2192 \xC9diteur de configuration), ou carte par carte.","el.no_board":"Aucun tableau. Passez en modification (crayon) pour en cr\xE9er un ou importer un fichier.","el.board":"Tableau","box.title":"Bo\xEEtes de d\xE9rivation","be.box":"Bo\xEEte","be.add_box":"Bo\xEEte","be.new_box":"Bo\xEEte","be.none":"Aucune bo\xEEte de d\xE9rivation : \xAB + Bo\xEEte \xBB pour commencer.","be.help":"Cliquez une position \xAB + \xBB pour ajouter une gaine, une gaine pour la modifier. \xAB Relier \xBB puis une autre gaine pour les joindre (tous les fils).","be.link_pick":"Cliquez la gaine \xE0 relier \xE0 {pos} (cliquer une gaine d\xE9j\xE0 reli\xE9e la d\xE9lie).","be.add_here":"Ajouter une gaine en {pos}","be.add_unplaced":"Gaine (position inconnue)","be.add_connector":"Wago / connexion d\xE9taill\xE9e","be.pick_conduit":"S\xE9lectionnez ou ajoutez une gaine.","be.box_settings":"Bo\xEEte : nom, emplacement, nombre de positions","be.side_count":"Positions {side}","be.side.top":"en haut","be.side.bottom":"en bas","be.side.left":"\xE0 gauche","be.side.right":"\xE0 droite","be.box_circuits":"Circuits qui passent par la bo\xEEte (si les gaines ne sont pas d\xE9crites)","be.multi_hint":"Ctrl/Cmd + clic pour en choisir plusieurs ; aucun = inconnu.","be.delete_box":"Supprimer la bo\xEEte","be.k_kind":"Type","be.k_wire":"Fil","be.k_members":"Gaines reli\xE9es","be.side_label":"C\xF4t\xE9","be.position":"Position","be.label":"Nom de la gaine","be.label_ph":"ex. gaine grise","be.joins":"Reli\xE9e \xE0 (tous les fils)","be.unjoin":"D\xE9lier","be.no_join":"aucune liaison","be.join":"Relier \xE0\u2026","be.end.unknown":"? (inconnu)","be.end.board":"Tableau (arriv\xE9e du circuit)","be.end.box":"Une autre bo\xEEte","be.end.point":"Prise, lumi\xE8re, appareil\u2026","be.end.spare":"R\xE9serve (vide)","be.entry":"Entr\xE9e dans cette bo\xEEte","be.point_kind":"Type de point","be.count":"Nombre","be.room":"Pi\xE8ce","be.point_label":"Nom","be.entity":"Entit\xE9 Home Assistant (facultatif)","be.conduit_more":"Gaine, c\xE2ble, passage, notes","be.conduit_kind":"Type de gaine","be.diameter":"Diam\xE8tre (mm)","be.length":"Longueur (m)","be.delete_conduit":"Supprimer la gaine","be.tab.boards":"Tableaux","be.tab.boxes":"Bo\xEEtes de d\xE9rivation","box.see_connectors":"Connexions d\xE9taill\xE9es ci-dessous","box.carried":"d\xE9duit de la liaison","box.joined_to":"reli\xE9e \xE0","box.wire.all":"tous les fils","box.side_letter.top":"H","box.side_letter.bottom":"B","box.side_letter.left":"G","box.side_letter.right":"D","box.point.socket":"Prise","box.point.light":"Point lumineux","box.point.switch":"Interrupteur","box.point.device":"Appareil","box.point.outlet":"Sortie de c\xE2ble","box.point.other":"Point","box.point_n.socket":"prise(s)","box.point_n.light":"point(s) lumineux","box.point_n.switch":"interrupteur(s)","box.point_n.device":"appareil(s)","box.point_n.outlet":"sortie(s) de c\xE2ble","box.point_n.other":"autre(s)","box.from_board":"Tableau","box.spare":"R\xE9serve","box.unknown_dest":"? destination inconnue","box.free":"libre","box.inside":"Int\xE9rieur","box.wire.phase":"phase","box.wire.neutral":"neutre","box.wire.earth":"terre","box.wire.switched":"retour lampe","box.wire.traveler":"navettes","box.wire.other":"autre","box.wire.unknown":"fil ?","box.members_unknown":"gaines non pr\xE9cis\xE9es","box.no_connectors":"Connexions non d\xE9crites","box.also_inside":"Passe aussi par la bo\xEEte :","box.conduit":"Gaine","box.pos_unknown":"position inconnue","box.circuits":"Circuit(s)","box.circuit_unknown":"circuit inconnu","box.cable":"C\xE2ble","box.route":"Passage","box.leads_to":"M\xE8ne \xE0","box.entry_unknown":"entr\xE9e inconnue","box.connectors":"Connexions","box.unplaced":"Position inconnue :","box.n_conduits":"{n} gaine(s)","box.to_complete":"{n} \xE0 compl\xE9ter","box.path":"Desserte","box.loose":"Bo\xEEtes sur ce circuit, place dans le parcours inconnue :","box.counted":"compt\xE9s dans les bo\xEEtes : {list}","cfg.boards_layout":"Plusieurs tableaux","cfg.stacked":"Les uns sous les autres","cfg.tabs":"Onglets","el.rcd_count":"{n} diff\xE9rentiel(s)","el.to_identify":"{n} circuit(s) \xE0 identifier","el.all_identified":"Tous les circuits identifi\xE9s","el.now":"{w} en ce moment","el.warnings":"{n} point(s) \xE0 v\xE9rifier","el.alert":"Alerte : {text}","el.alerts":"{n} alerte(s)","el.d.alert":"Alerte","check.manual":"{text}","ee.f.alert":"Alerte (anomalie \xE0 signaler)","ee.f.alert_level":"Niveau","ee.alert_level.warning":"\xC0 traiter","ee.alert_level.info":"Pour information","ee.alert_hint":"Visible sur le tableau, dans \xAB alertes \xBB et dans l'entit\xE9 Alertes du tableau (pour une automatisation).","ee.alert.s1":"Prise sur un circuit \xE9clairage","ee.alert.s2":"Section de c\xE2ble insuffisante pour le calibre","ee.alert.s3":"Pas de liaison \xE0 la terre","ee.alert.s4":"Neutre commun \xE0 plusieurs circuits","ee.alert.s5":"Disjoncteur qui chauffe","ee.alert.s6":"D\xE9clenchements \xE0 r\xE9p\xE9tition","ee.alert.s7":"Trop de points d'utilisation sur le circuit","ee.alert.s8":"Rep\xE9rage absent ou faux","ee.alert.s9":"Bornier mal serr\xE9 / noirci","el.photo":"Photo du tableau","el.row":"Rang\xE9e {label}","el.kind.rcd":"Interrupteur diff\xE9rentiel","el.kind.breaker":"Disjoncteur","el.kind.rcbo":"Disjoncteur diff\xE9rentiel","el.kind.device":"Autre module","el.kind.spacer":"Emplacement vide","el.kind.meter":"Compteur","el.kind.main_breaker":"Disjoncteur de branchement","el.supply":"Arriv\xE9e","el.load":"{p} % du calibre de {a} A (230 V)","el.feeds_n":"{n} d\xE9part(s)","el.d.fed_by":"Aliment\xE9 par","el.d.fed_manual":"lien manuel","el.d.feeds":"Alimente","el.d.status":"\xC9tat","el.d.kva":"Puissance souscrite","el.d.head_only":"{ref} \xB7 disjoncteur de branchement {ma} mA, pas de diff\xE9rentiel 30 mA","el.status.active":"En service","el.status.off":"Coup\xE9 / disjonct\xE9","el.status.spare":"En r\xE9serve (pos\xE9, non raccord\xE9)","el.tag.off":"Coup\xE9","el.tag.spare":"R\xE9serve","el.spare_count":"{n} en r\xE9serve","el.off_count":"{n} coup\xE9(s)","el.board_fed_by":"Aliment\xE9 par {ref}","el.fx":"aliment\xE9 par {ref}","check.feeder_no_rcd":"D\xE9part sans diff\xE9rentiel 30 mA en amont ({sensitivity_ma} mA) : v\xE9rifier que le tableau aliment\xE9 a ses diff\xE9rentiels 30 mA","ee.f.status":"\xC9tat","ee.f.fed_by":"Aliment\xE9 par","ee.f.fed_auto":"Automatique ({ref})","ee.f.fed_none":"rien","ee.f.kva":"Puissance souscrite (kVA)","ee.f.head_rating":"Calibre (r\xE9glage)","ee.add_meter":"+ Compteur","ee.add_main_breaker":"+ Disjoncteur de branchement","ee.board_fed_by":"Tableau aliment\xE9 par","ee.fed_hint":"Par d\xE9faut un module est aliment\xE9 par le diff\xE9rentiel \xE0 sa gauche sur la rang\xE9e (ou par l'arriv\xE9e). Choisissez un autre \xE9l\xE9ment pour un c\xE2blage particulier.","ee.delete_supply":"Retirer de l'arriv\xE9e","el.d.ref":"Rep\xE8re","el.d.circuit":"Circuit","el.d.areas":"Pi\xE8ces","el.d.protected_by":"Prot\xE9g\xE9 par","el.d.no_rcd":"aucun diff\xE9rentiel en amont","el.d.measure":"Mesure","el.d.energy":"\xC9nergie","el.d.history":"24 h","el.d.notes":"Notes","el.d.warnings":"\xC0 v\xE9rifier","el.d.model":"Mod\xE8le","el.d.entities":"Entit\xE9s","el.d.cable":"c\xE2ble {s} mm\xB2","el.d.no_history":"Pas d'historique","el.d.close":"Fermer le d\xE9tail","el.sensitivity":"{ma} mA","el.type":"type {t}","el.unknown_type":"type ?","el.module_aria":"{kind} {ref} {title} {name}","ck.kind.lighting":"\xC9clairage","ck.kind.sockets":"Prises","ck.kind.dedicated":"Circuit sp\xE9cialis\xE9","ck.kind.cooking":"Cuisson","ck.kind.water_heater":"Chauffe-eau","ck.kind.heating":"Chauffage","ck.kind.feeder":"D\xE9part / sous-tableau","ck.kind.other":"Autre","ck.kind.unknown":"Non identifi\xE9","norm.title":"Rappel NF C 15-100","norm.lighting":"Disjoncteur 16 A au plus (10 A courant), c\xE2ble 1,5 mm\xB2, 8 points lumineux au plus par circuit, derri\xE8re un diff\xE9rentiel 30 mA.","norm.sockets":"16 A en 1,5 mm\xB2 : 8 prises au plus ; 20 A en 2,5 mm\xB2 : 12 prises au plus. Diff\xE9rentiel 30 mA. Cuisine : 6 prises dont 4 au-dessus du plan de travail.","norm.dedicated":"Un circuit par appareil (lave-linge, lave-vaisselle, s\xE8che-linge, four, cong\xE9lateur) : 20 A, 2,5 mm\xB2. Lave-linge : diff\xE9rentiel 30 mA type A.","norm.cooking":"Plaque ou cuisini\xE8re : circuit d\xE9di\xE9 32 A, 6 mm\xB2 en monophas\xE9, diff\xE9rentiel 30 mA type A.","norm.water_heater":"Chauffe-eau : circuit d\xE9di\xE9 20 A, 2,5 mm\xB2 (jusqu'\xE0 3 500 W), souvent command\xE9 par un contacteur heures creuses.","norm.heating":"Chauffage \xE9lectrique : 16 A en 1,5 mm\xB2 jusqu'\xE0 3 500 W, 20 A en 2,5 mm\xB2 jusqu'\xE0 4 500 W par circuit.","norm.feeder":"D\xE9part vers un tableau divisionnaire : section adapt\xE9e au calibre (en g\xE9n\xE9ral 10 mm\xB2 pour 40 A), diff\xE9rentiels 30 mA dans le tableau aliment\xE9.","norm.guess":"Calibre typique d'un circuit {kind}","ee.apply_guess":"Utiliser","ee.f.points":"Nombre de points (prises ou points lumineux)","el.d.points":"Points","el.d.points_max":"{n} ({max} au plus)","check.too_many_points":"{count} points sur ce circuit ({max} au plus) : \xE0 v\xE9rifier","check.no_rcd":"Aucun diff\xE9rentiel en amont : \xE0 v\xE9rifier","check.no_rcd_30ma":"Pas de diff\xE9rentiel 30 mA en amont ({sensitivity_ma} mA) : \xE0 v\xE9rifier","check.rcd_type_a":"Circuit cuisson / lave-linge derri\xE8re un diff\xE9rentiel type {rcd_type} ({rcd_ref}) : type A attendu, \xE0 v\xE9rifier","check.cable_rating":"Calibre {rating_a} A pour un c\xE2ble de {cable_mm2} mm\xB2 (max {max_a} A) : \xE0 v\xE9rifier","check.kind_rating":"Calibre {rating_a} A \xE9lev\xE9 pour ce type de circuit (max {max_a} A) : \xE0 v\xE9rifier","check.unidentified":"Circuit non identifi\xE9","check.too_many_breakers":"{count} disjoncteurs derri\xE8re ce diff\xE9rentiel (8 au plus conseill\xE9s) : \xE0 v\xE9rifier","check.rcd_sum":"Somme des calibres en aval ({total_a} A) \xE9lev\xE9e pour un diff\xE9rentiel de {rating_a} A (information)","check.disclaimer":"Indications inspir\xE9es de la NF C 15-100, qui ne remplacent pas un \xE9lectricien.","ee.add_module":"Ajouter un module \xE0 la rang\xE9e {label}","ee.add_row":"+ Rang\xE9e","ee.add_board":"+ Tableau","ee.delete_row":"Supprimer la rang\xE9e","ee.delete_board":"Supprimer le tableau","ee.photo_upload":"Importer la photo","ee.photo_uploading":"Envoi de la photo\u2026","ee.photo_remove":"Retirer la photo","ee.move_left":"D\xE9placer \u25C0","ee.move_right":"D\xE9placer \u25B6","ee.delete":"Supprimer","ee.select_hint":"Cliquez sur un module pour le modifier. Glisser-d\xE9poser ou \u25C0 \u25B6 pour r\xE9ordonner.","ee.board_name":"Nom du tableau","ee.board_location":"Emplacement","ee.board_area":"Pi\xE8ce","ee.row_label":"Nom de la rang\xE9e","ee.f.kind":"Type","ee.f.ref":"Rep\xE8re","ee.f.rating":"Calibre \xB7 courbe","ee.f.rcd_rating":"Calibre","ee.f.sensitivity":"Sensibilit\xE9","ee.f.rcd_type":"Type de diff\xE9rentiel","ee.f.circuit":"Circuit","ee.f.circuit_kind":"Type de circuit","ee.f.areas":"Pi\xE8ces","ee.f.power":"Capteur de puissance","ee.f.energy":"Capteur d'\xE9nergie","ee.f.switch":"Relais / sortie li\xE9e (coup\xE9 si \xE9teint)","ee.f.cable":"Section du c\xE2ble","ee.f.width":"Largeur (modules DIN)","ee.f.model":"Mod\xE8le","ee.f.notes":"Notes","ee.f.label":"Libell\xE9","ee.f.entities":"Entit\xE9s li\xE9es (s\xE9par\xE9es par des virgules)","ee.none":"\u2014","net.online":"{n} \xE9quipement(s) en ligne","net.offline":"{n} hors ligne","net.no_devices":"Aucun \xE9quipement. Passez en modification (crayon) pour en ajouter ou importer depuis OPNsense.","net.internet":"Internet","net.port":"port {n}","net.offline_short":"hors ligne","net.unplaced":"Sans port connu","net.wifi_under":"via {name}","net.vlan_tag":"VLAN {tag}","net.untagged":"non tagu\xE9","net.no_vlan":"Sans VLAN","net.devices_n":"{n} \xE9quipement(s)","net.no_switch":"Aucun switch d\xE9clar\xE9. Ajoutez une source SNMP (options de l'int\xE9gration) ou importez un fichier.","net.switch_unavailable":"Switch injoignable : derni\xE8res donn\xE9es connues.","net.port_detail":"Port {n}","net.speed":"{s}","net.poe":"PoE","net.vlans_line":"natif {pvid} \xB7 \xE9tiquet\xE9s {tagged}","net.lldp":"Voisin LLDP","net.seen":"\xC9quipements vus","net.macs":"{n} adresse(s) MAC","net.link_down":"lien coup\xE9","net.link_up":"lien actif","net.ping_unavailable":"Ping indisponible (droits ICMP) : voir le README.","net.gateway":"{name} {delay}","kind.router":"Routeur","kind.switch":"Switch","kind.ap":"Antenne Wi-Fi","kind.server":"Serveur","kind.nas":"NAS","kind.camera":"Cam\xE9ra","kind.iot":"Objet connect\xE9","kind.computer":"Ordinateur","kind.phone":"T\xE9l\xE9phone","kind.printer":"Imprimante","kind.other":"Autre","ds.tab.info":"Infos","ds.tab.firewall":"Pare-feu","ds.tab.history":"Historique","ds.close":"Fermer","ds.online":"En ligne","ds.online_ms":"En ligne \xB7 {ms} ms","ds.offline":"Hors ligne","ds.unknown":"\xC9tat inconnu","ds.blocks_today":"{n} blocage(s) sur 24 h","ds.ip":"Adresse","ds.mac":"MAC","ds.vlan":"VLAN","ds.port":"Port du switch","ds.port_value":"{port} \xB7 {switch}","ds.port_auto":"d\xE9tect\xE9","ds.port_manual":"saisi","ds.last_seen":"vu le {date}","ds.area":"Pi\xE8ce","ds.kind":"Type","ds.parent":"\xC9quipement parent","ds.sensors":"Capteurs","ds.notes":"Notes","ds.no_sensor":"aucun","fw.loading":"Analyse du pare-feu\u2026","fw.not_configured":"OPNsense n'est pas configur\xE9, ou l'analyse du pare-feu est d\xE9sactiv\xE9e (options de l'int\xE9gration).","fw.unavailable":"OPNsense est injoignable : analyse indisponible.","fw.not_an_ip":"L'analyse du pare-feu n\xE9cessite une adresse IP.","fw.what_can":"Ce que l'appareil peut faire \xB7 dans l'ordre d'application","fw.col.rule":"R\xE8gle (commentaire OPNsense)","fw.col.to":"Vers","fw.col.today":"Aujourd'hui","fw.pass":"autoris\xE9","fw.block":"bloqu\xE9","fw.own_rule":"r\xE8gle propre \xE0 l'appareil","fw.probable":"probable","fw.floating":"flottante","fw.blocked_n":"{n} bloqu\xE9e(s)","fw.default_deny":"Aucune r\xE8gle ne correspond ensuite : blocage par d\xE9faut.","fw.unreachable":"{n} r\xE8gle(s) suivante(s) jamais atteinte(s).","fw.redundant":"R\xE8gle(s) masqu\xE9e(s) car couvertes par une r\xE8gle suivante : {list}","fw.who":"Qui peut le joindre","fw.same_network":"m\xEAme r\xE9seau (non filtr\xE9)","fw.partial":"partiel","fw.nat":"Redirection NAT : port {ext} \u2192 {target}","fw.recent":"Derniers blocages","fw.col.time":"Heure","fw.col.dest":"Destination","fw.col.name":"Nom","fw.col.by":"Bloqu\xE9 par","fw.default_rule":"r\xE8gle par d\xE9faut / automatique","fw.no_blocks":"Aucun blocage r\xE9cent.","fw.readonly":"Lecture seule : rien n'est modifi\xE9 sur le routeur. Les noms viennent du journal DNS du routeur (probables).","fw.dest.any":"Internet / partout","fw.dest.router":"routeur ({ip})","fw.dest.private":"r\xE9seaux internes","fw.dest.network":"r\xE9seau {name}","fw.not":"tout sauf {x}","fw.reason.no_sequence":"ordre non garanti (sans num\xE9ro de s\xE9quence)","fw.reason.not_quick":"r\xE8gle flottante non \xAB quick \xBB","fw.reason.tagged":"r\xE8gle avec \xE9tiquette (tag)","fw.reason.route_to":"routage par passerelle","fw.reason.interface_not":"interfaces invers\xE9es","fw.reason.ports_unresolved":"ports non r\xE9solus","fw.reason.alias_url":"alias de type URL","fw.reason.alias_urltable":"alias de type URL","fw.reason.alias_urljson":"alias de type URL","fw.reason.alias_geoip":"alias GeoIP","fw.reason.alias_mac":"alias d'adresses MAC","fw.reason.alias_asn":"alias ASN","fw.reason.alias_dynipv6host":"alias IPv6 dynamique","fw.reason.alias_authgroup":"alias de groupe","fw.reason.alias_internal":"alias interne","fw.reason.alias_unresolved":"alias non r\xE9solu","fw.reason.unknown_token":"adresse inconnue","fw.reason.source_unresolved":"source ind\xE9termin\xE9e","fw.reason.destination_unresolved":"destination ind\xE9termin\xE9e","hist.presence":"Pr\xE9sence \xB7 24 h","hist.latency":"Latence \xB7 24 h","hist.none":"Aucun capteur de pr\xE9sence ou de latence pour cet \xE9quipement.","ne.add":"+ Ajouter un \xE9quipement","ne.import_opnsense":"Tout importer depuis OPNsense","ne.add_title":"Ajouter un \xE9quipement","ne.edit_title":"Modifier \xB7 {name}","ne.create":"Cr\xE9er","ne.f.name":"Nom","ne.f.host":"Adresse IP ou nom","ne.f.vlan":"R\xE9seau (VLAN)","ne.f.mac":"Adresse MAC","ne.f.switch":"Switch","ne.f.port":"Port du switch","ne.f.port_source":"Port fig\xE9 (saisi \xE0 la main)","ne.f.area":"Pi\xE8ce","ne.f.kind":"Type","ne.f.parent":"\xC9quipement parent (antenne, r\xE9p\xE9teur)","ne.f.model":"Mod\xE8le","ne.f.notes":"Notes","ne.probe":"Tester","ne.probing":"Test\u2026","ne.answers":"r\xE9pond \xB7 {ms} ms","ne.no_answer":"ne r\xE9pond pas","ne.vlan_detected":"d\xE9tect\xE9 depuis l'IP","ne.mac_detected":"lue sur le routeur ({source})","ne.port_detected":"lu sur le switch","ne.port_via":"{port} (via {via})","ne.sensors":"Capteurs \xE0 cr\xE9er","ne.s.ping":"Pr\xE9sence (ping)","ne.s.latency":"Latence","ne.s.tcp":"Port TCP","ne.s.alert":"Alerte si hors ligne plus de (min)","ne.interval":"Intervalle : {s} s \xB7 regroup\xE9s sous un appareil HA \xAB {name} \xBB.","ne.devices":"\xC9quipements d\xE9clar\xE9s","ne.col.name":"Nom","ne.col.ip":"IP","ne.col.vlan":"VLAN","ne.col.port":"Port","ne.col.sensors":"Capteurs","ne.edit":"Modifier","ne.delete":"Supprimer","ne.s.short.ping":"pr\xE9sence","ne.s.short.latency":"latence","ne.s.short.tcp":"port {p}","ne.s.short.alert":"alerte","ne.vlans":"VLAN","ne.vlan_add":"+ VLAN","ne.v.name":"Nom","ne.v.tag":"Tag","ne.v.subnet":"Sous-r\xE9seau","ne.v.color":"Couleur","ne.v.role":"R\xF4le","ne.v.access":"Acc\xE8s","ne.uplink":"Lien Internet","ne.u.isp":"Fournisseur d'acc\xE8s","ne.u.box_name":"Box","ne.u.box_ip":"IP de la box","ne.u.public_ip":"IP publique","ne.save_network":"Enregistrer","ne.import_title":"Importer depuis OPNsense","ne.import_hint":"Rien n'est \xE9crit avant \xAB Importer la s\xE9lection \xBB. Les \xE9quipements d\xE9j\xE0 d\xE9clar\xE9s sont ignor\xE9s ; seul le capteur de pr\xE9sence est activ\xE9.","ne.import_apply":"Importer la s\xE9lection","ne.import_none":"OPNsense ne propose rien \xE0 importer.","ne.exists":"d\xE9j\xE0 d\xE9clar\xE9","ne.loading":"Lecture d'OPNsense\u2026","ne.required":"Nom obligatoire."},Re={"card.name":"Home Infra Map","card.description":"Electrical boards and home network","card.loading":"Loading\u2026","card.not_configured":"The Home Infra Map integration is not configured (Settings \u2192 Devices & services).","card.error":"Error: {error}","card.retry":"Retry","view.electricity":"Electricity","view.network":"Network","nview.topology":"Topology","nview.vlan":"VLAN","nview.switch":"Switch","edit.open":"Edit","edit.close":"Leave edit mode","edit.title":"Edit \xB7 {name}","edit.cancel":"Cancel","edit.save":"Save","edit.saved":"Saved","edit.conflict":"The data was changed elsewhere. Reloading: your unsaved changes are lost.","edit.refused":"Refused: administrators only.","edit.failed":"Failed: {error}","edit.confirm_delete":'Delete "{name}"?',"edit.unsaved":"Unsaved changes","tools.export":"Export","tools.download":"Download (.yaml)","tools.choose_file":"Choose a .yaml file\u2026","tools.file_too_large":"File too large (2 MB max).","el.slots":"{used} / {capacity} modules","el.slots_unknown":"{used} modules (rail width not set)","ee.board_slots":"Modules per row (rail width)","ee.row_capacity":"Modules of this row (empty = board value)","ee.add_spacer":"Add an empty place to row {label}","check.row_overflow":"Row {row}: {used} modules on a {capacity}-module rail: to check","tools.import":"Import","tools.dashboard":"Generate an example dashboard","tools.copy":"Copy","tools.copied":"Copied","tools.close":"Close","tools.import_hint":"Paste a Home Infra Map export or a house file (boards / devices). The sections present replace the current data.","tools.import_run":"Import","tools.import_done":"Import done: {boards} board(s), {modules} modules, {vlans} VLANs, {devices} devices.","tools.dashboard_hint":"Paste this YAML into a dashboard (Edit \u2192 \u22EE \u2192 Raw configuration editor), or card by card.","el.no_board":"No board yet. Use edit mode (pencil) to create one or import a file.","el.board":"Board","box.title":"Junction boxes","be.box":"Box","be.add_box":"Box","be.new_box":"Box","be.none":"No junction box yet: \u201C+ Box\u201D to start.","be.help":"Click a \u201C+\u201D position to add a conduit, a conduit to edit it. \u201CJoin\u201D then another conduit to connect them (all wires).","be.link_pick":"Click the conduit to join to {pos} (clicking a joined one removes the join).","be.add_here":"Add a conduit at {pos}","be.add_unplaced":"Conduit (position unknown)","be.add_connector":"Wago / detailed connection","be.pick_conduit":"Select or add a conduit.","be.box_settings":"Box: name, location, number of positions","be.side_count":"Positions {side}","be.side.top":"top","be.side.bottom":"bottom","be.side.left":"left","be.side.right":"right","be.box_circuits":"Circuits going through the box (when the conduits are not described)","be.multi_hint":"Ctrl/Cmd + click to pick several; none = unknown.","be.delete_box":"Delete the box","be.k_kind":"Type","be.k_wire":"Wire","be.k_members":"Joined conduits","be.side_label":"Side","be.position":"Position","be.label":"Conduit name","be.label_ph":"e.g. grey conduit","be.joins":"Joined to (all wires)","be.unjoin":"Unjoin","be.no_join":"no join","be.join":"Join to\u2026","be.end.unknown":"? (unknown)","be.end.board":"Board (circuit origin)","be.end.box":"Another box","be.end.point":"Socket, light, appliance\u2026","be.end.spare":"Spare (empty)","be.entry":"Entry in that box","be.point_kind":"Point type","be.count":"Count","be.room":"Room","be.point_label":"Name","be.entity":"Home Assistant entity (optional)","be.conduit_more":"Conduit, cable, route, notes","be.conduit_kind":"Conduit type","be.diameter":"Diameter (mm)","be.length":"Length (m)","be.delete_conduit":"Delete the conduit","be.tab.boards":"Boards","be.tab.boxes":"Junction boxes","box.see_connectors":"Connections listed below","box.carried":"carried by the link","box.joined_to":"joined to","box.wire.all":"all wires","box.side_letter.top":"T","box.side_letter.bottom":"B","box.side_letter.left":"L","box.side_letter.right":"R","box.point.socket":"Socket","box.point.light":"Light point","box.point.switch":"Switch","box.point.device":"Appliance","box.point.outlet":"Cable outlet","box.point.other":"Point","box.point_n.socket":"socket(s)","box.point_n.light":"light point(s)","box.point_n.switch":"switch(es)","box.point_n.device":"appliance(s)","box.point_n.outlet":"cable outlet(s)","box.point_n.other":"other","box.from_board":"Board","box.spare":"Spare","box.unknown_dest":"? unknown destination","box.free":"free","box.inside":"Inside","box.wire.phase":"line","box.wire.neutral":"neutral","box.wire.earth":"earth","box.wire.switched":"switched line","box.wire.traveler":"travelers","box.wire.other":"other","box.wire.unknown":"wire ?","box.members_unknown":"conduits not specified","box.no_connectors":"Connections not described","box.also_inside":"Also goes through the box:","box.conduit":"Conduit","box.pos_unknown":"position unknown","box.circuits":"Circuit(s)","box.circuit_unknown":"unknown circuit","box.cable":"Cable","box.route":"Route","box.leads_to":"Leads to","box.entry_unknown":"entry unknown","box.connectors":"Connections","box.unplaced":"Position unknown:","box.n_conduits":"{n} conduit(s)","box.to_complete":"{n} to complete","box.path":"Path","box.loose":"Boxes on this circuit, place in the path unknown:","box.counted":"counted in the boxes: {list}","cfg.boards_layout":"Several boards","cfg.stacked":"One below the other","cfg.tabs":"Tabs","el.rcd_count":"{n} RCD(s)","el.to_identify":"{n} circuit(s) to identify","el.all_identified":"All circuits identified","el.now":"{w} right now","el.warnings":"{n} point(s) to check","el.alert":"Alert: {text}","el.alerts":"{n} alert(s)","el.d.alert":"Alert","check.manual":"{text}","ee.f.alert":"Alert (issue to report)","ee.f.alert_level":"Level","ee.alert_level.warning":"To fix","ee.alert_level.info":"For information","ee.alert_hint":"Shown on the board, in the alerts list and in the Alerts entity of the board (for automations).","ee.alert.s1":"Socket on a lighting circuit","ee.alert.s2":"Cable too thin for the rating","ee.alert.s3":"No earth connection","ee.alert.s4":"Neutral shared by several circuits","ee.alert.s5":"Breaker running hot","ee.alert.s6":"Repeated tripping","ee.alert.s7":"Too many outlets on the circuit","ee.alert.s8":"Missing or wrong label","ee.alert.s9":"Loose or blackened terminal","el.photo":"Board photo","el.row":"Row {label}","el.kind.rcd":"Residual current device","el.kind.breaker":"Circuit breaker","el.kind.rcbo":"RCBO","el.kind.device":"Other module","el.kind.spacer":"Empty slot","el.kind.meter":"Utility meter","el.kind.main_breaker":"Main breaker","el.supply":"Service entrance","el.load":"{p} % of the {a} A rating (230 V)","el.feeds_n":"{n} departure(s)","el.d.fed_by":"Fed by","el.d.fed_manual":"manual link","el.d.feeds":"Feeds","el.d.status":"State","el.d.kva":"Subscribed power","el.d.head_only":"{ref} \xB7 main breaker {ma} mA, no 30 mA RCD","el.status.active":"In service","el.status.off":"Off / tripped","el.status.spare":"Spare (installed, not wired)","el.tag.off":"Off","el.tag.spare":"Spare","el.spare_count":"{n} spare","el.off_count":"{n} off","el.board_fed_by":"Fed by {ref}","el.fx":"fed by {ref}","check.feeder_no_rcd":"Feeder without a 30 mA RCD upstream ({sensitivity_ma} mA): check that the fed board has its own 30 mA RCDs","ee.f.status":"State","ee.f.fed_by":"Fed by","ee.f.fed_auto":"Automatic ({ref})","ee.f.fed_none":"nothing","ee.f.kva":"Subscribed power (kVA)","ee.f.head_rating":"Rating (setting)","ee.add_meter":"+ Meter","ee.add_main_breaker":"+ Main breaker","ee.board_fed_by":"Board fed by","ee.fed_hint":"By default a module is fed by the RCD on its left on the row (or by the service entrance). Pick another element for special wiring.","ee.delete_supply":"Remove from the entrance","el.d.ref":"Reference","el.d.circuit":"Circuit","el.d.areas":"Areas","el.d.protected_by":"Protected by","el.d.no_rcd":"no RCD upstream","el.d.measure":"Measurement","el.d.energy":"Energy","el.d.history":"24 h","el.d.notes":"Notes","el.d.warnings":"To check","el.d.model":"Model","el.d.entities":"Entities","el.d.cable":"{s} mm\xB2 cable","el.d.no_history":"No history","el.d.close":"Close details","el.sensitivity":"{ma} mA","el.type":"type {t}","el.unknown_type":"type ?","el.module_aria":"{kind} {ref} {title} {name}","ck.kind.lighting":"Lighting","ck.kind.sockets":"Sockets","ck.kind.dedicated":"Dedicated circuit","ck.kind.cooking":"Cooking","ck.kind.water_heater":"Water heater","ck.kind.heating":"Heating","ck.kind.feeder":"Feeder / sub-board","ck.kind.other":"Other","ck.kind.unknown":"Unidentified","norm.title":"NF C 15-100 reminder","norm.lighting":"Breaker 16 A at most (10 A usual), 1.5 mm\xB2 cable, at most 8 light points per circuit, behind a 30 mA RCD.","norm.sockets":"16 A on 1.5 mm\xB2: 8 sockets at most; 20 A on 2.5 mm\xB2: 12 sockets at most. 30 mA RCD. Kitchen: 6 sockets, 4 of them above the worktop.","norm.dedicated":"One circuit per appliance (washing machine, dishwasher, dryer, oven, freezer): 20 A, 2.5 mm\xB2. Washing machine: 30 mA type A RCD.","norm.cooking":"Hob or cooker: dedicated circuit 32 A, 6 mm\xB2 single phase, 30 mA type A RCD.","norm.water_heater":"Water heater: dedicated circuit 20 A, 2.5 mm\xB2 (up to 3,500 W), often driven by an off-peak contactor.","norm.heating":"Electric heating: 16 A on 1.5 mm\xB2 up to 3,500 W, 20 A on 2.5 mm\xB2 up to 4,500 W per circuit.","norm.feeder":"Feeder to a sub-board: cable sized for the rating (usually 10 mm\xB2 for 40 A), 30 mA RCDs in the fed board.","norm.guess":"Usual rating of a {kind} circuit","ee.apply_guess":"Use","ee.f.points":"Number of points (sockets or light points)","el.d.points":"Points","el.d.points_max":"{n} ({max} at most)","check.too_many_points":"{count} points on this circuit ({max} at most): to check","check.no_rcd":"No RCD upstream: to check","check.no_rcd_30ma":"No 30 mA RCD upstream ({sensitivity_ma} mA): to check","check.rcd_type_a":"Cooking / washing machine circuit behind a type {rcd_type} RCD ({rcd_ref}): type A expected, to check","check.cable_rating":"{rating_a} A rating on a {cable_mm2} mm\xB2 cable (max {max_a} A): to check","check.kind_rating":"{rating_a} A is high for this kind of circuit (max {max_a} A): to check","check.unidentified":"Unidentified circuit","check.too_many_breakers":"{count} breakers behind this RCD (8 at most advised): to check","check.rcd_sum":"Sum of downstream ratings ({total_a} A) is high for a {rating_a} A RCD (information)","check.disclaimer":"Hints inspired by the French NF C 15-100 standard; they do not replace an electrician.","ee.add_module":"Add a module to row {label}","ee.add_row":"+ Row","ee.add_board":"+ Board","ee.delete_row":"Delete row","ee.delete_board":"Delete board","ee.photo_upload":"Upload photo","ee.photo_uploading":"Uploading photo\u2026","ee.photo_remove":"Remove photo","ee.move_left":"Move \u25C0","ee.move_right":"Move \u25B6","ee.delete":"Delete","ee.select_hint":"Click a module to edit it. Drag and drop or \u25C0 \u25B6 to reorder.","ee.board_name":"Board name","ee.board_location":"Location","ee.board_area":"Area","ee.row_label":"Row name","ee.f.kind":"Kind","ee.f.ref":"Reference","ee.f.rating":"Rating \xB7 curve","ee.f.rcd_rating":"Rating","ee.f.sensitivity":"Sensitivity","ee.f.rcd_type":"RCD type","ee.f.circuit":"Circuit","ee.f.circuit_kind":"Circuit kind","ee.f.areas":"Areas","ee.f.power":"Power sensor","ee.f.energy":"Energy sensor","ee.f.switch":"Linked switch / relay (off when off)","ee.f.cable":"Cable cross-section","ee.f.width":"Width (DIN modules)","ee.f.model":"Model","ee.f.notes":"Notes","ee.f.label":"Label","ee.f.entities":"Linked entities (comma separated)","ee.none":"\u2014","net.online":"{n} device(s) online","net.offline":"{n} offline","net.no_devices":"No device yet. Use edit mode (pencil) to add some or import from OPNsense.","net.internet":"Internet","net.port":"port {n}","net.offline_short":"offline","net.unplaced":"No known port","net.wifi_under":"via {name}","net.vlan_tag":"VLAN {tag}","net.untagged":"untagged","net.no_vlan":"No VLAN","net.devices_n":"{n} device(s)","net.no_switch":"No switch declared. Add an SNMP source (integration options) or import a file.","net.switch_unavailable":"Switch unreachable: last known data.","net.port_detail":"Port {n}","net.speed":"{s}","net.poe":"PoE","net.vlans_line":"native {pvid} \xB7 tagged {tagged}","net.lldp":"LLDP neighbour","net.seen":"Devices seen","net.macs":"{n} MAC address(es)","net.link_down":"link down","net.link_up":"link up","net.ping_unavailable":"Ping unavailable (ICMP permissions): see the README.","net.gateway":"{name} {delay}","kind.router":"Router","kind.switch":"Switch","kind.ap":"Wi-Fi access point","kind.server":"Server","kind.nas":"NAS","kind.camera":"Camera","kind.iot":"IoT device","kind.computer":"Computer","kind.phone":"Phone","kind.printer":"Printer","kind.other":"Other","ds.tab.info":"Info","ds.tab.firewall":"Firewall","ds.tab.history":"History","ds.close":"Close","ds.online":"Online","ds.online_ms":"Online \xB7 {ms} ms","ds.offline":"Offline","ds.unknown":"Unknown state","ds.blocks_today":"{n} block(s) over 24 h","ds.ip":"Address","ds.mac":"MAC","ds.vlan":"VLAN","ds.port":"Switch port","ds.port_value":"{port} \xB7 {switch}","ds.port_auto":"detected","ds.port_manual":"manual","ds.last_seen":"seen {date}","ds.area":"Area","ds.kind":"Kind","ds.parent":"Parent device","ds.sensors":"Sensors","ds.notes":"Notes","ds.no_sensor":"none","fw.loading":"Analysing the firewall\u2026","fw.not_configured":"OPNsense is not configured, or firewall analysis is disabled (integration options).","fw.unavailable":"OPNsense is unreachable: analysis unavailable.","fw.not_an_ip":"Firewall analysis needs an IP address.","fw.what_can":"What the device can do \xB7 in evaluation order","fw.col.rule":"Rule (OPNsense description)","fw.col.to":"To","fw.col.today":"Today","fw.pass":"allowed","fw.block":"blocked","fw.own_rule":"rule specific to this device","fw.probable":"probable","fw.floating":"floating","fw.blocked_n":"{n} blocked","fw.default_deny":"No rule matches afterwards: blocked by default.","fw.unreachable":"{n} following rule(s) never reached.","fw.redundant":"Rule(s) hidden because a later rule covers them: {list}","fw.who":"Who can reach it","fw.same_network":"same network (not filtered)","fw.partial":"partial","fw.nat":"NAT forward: port {ext} \u2192 {target}","fw.recent":"Recent blocks","fw.col.time":"Time","fw.col.dest":"Destination","fw.col.name":"Name","fw.col.by":"Blocked by","fw.default_rule":"default / automatic rule","fw.no_blocks":"No recent block.","fw.readonly":"Read-only: nothing is changed on the router. Names come from the router DNS log (probable).","fw.dest.any":"Internet / anywhere","fw.dest.router":"router ({ip})","fw.dest.private":"internal networks","fw.dest.network":"{name} network","fw.not":"anything but {x}","fw.reason.no_sequence":"order not guaranteed (no sequence number)","fw.reason.not_quick":"non-quick floating rule","fw.reason.tagged":"tagged rule","fw.reason.route_to":"policy routing","fw.reason.interface_not":"inverted interfaces","fw.reason.ports_unresolved":"unresolved ports","fw.reason.alias_url":"URL alias","fw.reason.alias_urltable":"URL alias","fw.reason.alias_urljson":"URL alias","fw.reason.alias_geoip":"GeoIP alias","fw.reason.alias_mac":"MAC alias","fw.reason.alias_asn":"ASN alias","fw.reason.alias_dynipv6host":"dynamic IPv6 alias","fw.reason.alias_authgroup":"group alias","fw.reason.alias_internal":"internal alias","fw.reason.alias_unresolved":"unresolved alias","fw.reason.unknown_token":"unknown address","fw.reason.source_unresolved":"undetermined source","fw.reason.destination_unresolved":"undetermined destination","hist.presence":"Presence \xB7 24 h","hist.latency":"Latency \xB7 24 h","hist.none":"No presence or latency sensor for this device.","ne.add":"+ Add a device","ne.import_opnsense":"Import everything from OPNsense","ne.add_title":"Add a device","ne.edit_title":"Edit \xB7 {name}","ne.create":"Create","ne.f.name":"Name","ne.f.host":"IP address or host name","ne.f.vlan":"Network (VLAN)","ne.f.mac":"MAC address","ne.f.switch":"Switch","ne.f.port":"Switch port","ne.f.port_source":"Pin the port (manual)","ne.f.area":"Area","ne.f.kind":"Kind","ne.f.parent":"Parent device (access point, repeater)","ne.f.model":"Model","ne.f.notes":"Notes","ne.probe":"Test","ne.probing":"Testing\u2026","ne.answers":"answers \xB7 {ms} ms","ne.no_answer":"no answer","ne.vlan_detected":"detected from the IP","ne.mac_detected":"read on the router ({source})","ne.port_detected":"read on the switch","ne.port_via":"{port} (via {via})","ne.sensors":"Sensors to create","ne.s.ping":"Presence (ping)","ne.s.latency":"Latency","ne.s.tcp":"TCP port","ne.s.alert":"Alert when offline for more than (min)","ne.interval":'Interval: {s} s \xB7 grouped under an HA device "{name}".',"ne.devices":"Declared devices","ne.col.name":"Name","ne.col.ip":"IP","ne.col.vlan":"VLAN","ne.col.port":"Port","ne.col.sensors":"Sensors","ne.edit":"Edit","ne.delete":"Delete","ne.s.short.ping":"presence","ne.s.short.latency":"latency","ne.s.short.tcp":"port {p}","ne.s.short.alert":"alert","ne.vlans":"VLANs","ne.vlan_add":"+ VLAN","ne.v.name":"Name","ne.v.tag":"Tag","ne.v.subnet":"Subnet","ne.v.color":"Colour","ne.v.role":"Role","ne.v.access":"Access","ne.uplink":"Internet link","ne.u.isp":"Internet provider","ne.u.box_name":"Box","ne.u.box_ip":"Box IP","ne.u.public_ip":"Public IP","ne.save_network":"Save","ne.import_title":"Import from OPNsense","ne.import_hint":'Nothing is written before "Import selection". Devices already declared are skipped; only the presence sensor is enabled.',"ne.import_apply":"Import selection","ne.import_none":"OPNsense has nothing to import.","ne.exists":"already declared","ne.loading":"Reading OPNsense\u2026","ne.required":"Name is required."},Xi={fr:Zi,en:Re};function je(i){const e=i?.locale?.language??i?.language??(typeof navigator<"u"?navigator.language:"fr");return String(e||"fr").split("-")[0].toLowerCase()==="fr"?"fr":"en"}function U(i){const e=Xi[i]??Re;return(t,s)=>{let n=e[t]??Re[t]??t;if(s)for(const[o,a]of Object.entries(s))n=n.split(`{${o}}`).join(a==null?"?":String(a));return n}}const G=fi`
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

  /* junction boxes */
  .bx-tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 8px;
  }
  .bx-tile {
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: left;
    font: inherit;
    color: inherit;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
    border-radius: 10px;
    padding: 8px 10px;
    cursor: pointer;
  }
  .bx-tile.sel {
    border: 2px solid var(--primary-color, #03a9f4);
    padding: 7px 9px;
  }
  .bx-tile-n {
    font-weight: 600;
  }
  .bx-tile-c {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }
  .warn-t {
    color: var(--warning-color, #ff9800);
  }
  .c {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 2px;
    flex: none;
  }
  .bx {
    margin-top: 10px;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
    border-radius: 12px;
    padding: 10px 12px;
  }
  .bx-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 6px;
  }
  .bx-svg {
    display: block;
    width: 100%;
    margin: 6px auto;
    overflow: visible;
  }
  .bx-rect {
    fill: rgba(127, 127, 127, 0.05);
    stroke: #78716c;
    stroke-width: 3;
  }
  .bx-center {
    fill: var(--secondary-text-color, #888);
    font-size: 12px;
  }
  .bx-join {
    fill: none;
    stroke-width: 5;
    stroke-linecap: round;
    opacity: 0.85;
  }
  .bx-sg {
    cursor: pointer;
    outline: none;
  }
  .bx-sg circle {
    fill: var(--card-background-color, #fff);
    stroke: #9aa1a9;
    stroke-width: 3;
  }
  .bx-sg.free {
    cursor: default;
  }
  .bx-sg.free.add {
    cursor: pointer;
  }
  .bx-sg.free.add:hover circle {
    stroke: var(--primary-color, #03a9f4);
  }
  .bx-sg.linkfrom circle:not(.bx-halo) {
    stroke-dasharray: 5 3;
    stroke-width: 4;
  }
  .bx-sg.free circle,
  .bx-sg.spare circle {
    stroke-dasharray: 4 3;
  }
  .bx-sg.unk circle {
    stroke-dasharray: 2 3;
  }
  .bx-sg circle.bx-halo {
    fill: none;
    stroke: var(--primary-color, #03a9f4);
    stroke-width: 4;
    opacity: 0.4;
    stroke-dasharray: none;
  }
  .bx-sg:focus-visible circle:not(.bx-halo) {
    stroke-width: 5;
  }
  .bx-sg circle.bx-al {
    fill: var(--him-warn, #ff9800);
    stroke: none;
  }
  .bx-al-t {
    font: 700 9px sans-serif;
    fill: #000;
  }
  .bx-dt {
    font-size: 11px;
    font-weight: 700;
    fill: var(--primary-text-color, #222);
  }
  .bx-sg.free .bx-dt,
  .bx-sg.spare .bx-dt {
    font-weight: 500;
    fill: var(--secondary-text-color, #888);
  }
  .bx-st {
    font-size: 12px;
    fill: var(--primary-text-color, #222);
  }
  .bx-st.muted {
    fill: var(--secondary-text-color, #888);
  }
  .bx-more {
    font-size: 9px;
    fill: var(--secondary-text-color, #888);
  }
  .bx-node-dot {
    stroke: var(--card-background-color, #fff);
    stroke-width: 2;
  }
  .bx-draw {
    display: grid;
    grid-template-columns: minmax(80px, 170px) minmax(160px, 1fr) minmax(80px, 170px);
    grid-template-rows: auto minmax(150px, auto) auto;
    margin: 8px 0;
  }
  .bx-side {
    display: flex;
    gap: 6px;
    justify-content: center;
  }
  .bx-side.top {
    align-items: flex-end;
  }
  .bx-side.bottom {
    align-items: flex-start;
  }
  .bx-side.left,
  .bx-side.right {
    flex-direction: column;
    justify-content: center;
  }
  .bx-g {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    background: none;
    border: 0;
    padding: 2px;
    font: inherit;
    color: inherit;
    cursor: pointer;
    max-width: 120px;
    text-align: center;
  }
  .bx-g.free {
    cursor: default;
  }
  .bx-side.top .bx-g {
    flex-direction: column-reverse;
  }
  .bx-side.left .bx-g {
    flex-direction: row-reverse;
    text-align: right;
    max-width: none;
    justify-content: flex-start;
    align-self: flex-end;
  }
  .bx-side.right .bx-g {
    flex-direction: row;
    text-align: left;
    max-width: none;
    align-self: flex-start;
  }
  .bx-unplaced .bx-g {
    flex-direction: row;
    max-width: none;
    text-align: left;
  }
  .bx-dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid #9aa1a9;
    background: var(--card-background-color, #fff);
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 11px;
    flex: none;
    box-sizing: border-box;
    position: relative;
  }
  .bx-dot sup {
    position: absolute;
    top: -6px;
    right: -8px;
    font-size: 9px;
  }
  .bx-dot.free,
  .bx-dot.spare {
    border-style: dashed;
    color: var(--secondary-text-color, #888);
    font-weight: 500;
  }
  .bx-dot.unk {
    border-color: #9aa1a9;
    border-style: dotted;
  }
  .bx-dot.sel {
    box-shadow: 0 0 0 4px rgba(3, 169, 244, 0.35);
  }
  .bx-dot.al {
    box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.5);
  }
  .bx-lbl {
    font-size: 11px;
    line-height: 1.2;
    overflow-wrap: break-word;
    hyphens: auto;
  }
  .bx-side.top .bx-g,
  .bx-side.bottom .bx-g {
    min-width: 58px;
  }
  .bx-ic {
    --mdc-icon-size: 14px;
    margin-right: 2px;
  }
  .bx-in {
    border: 3px solid #78716c;
    border-radius: 10px;
    padding: 8px 10px;
    margin: 4px;
    background: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(127, 127, 127, 0.06) 8px, rgba(127, 127, 127, 0.06) 16px);
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
  }
  .bx-in-t {
    font-weight: 600;
  }
  .bx-k {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
    border-radius: 6px;
    padding: 2px 6px;
  }
  .bx-k .bx-sw {
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }
  .bx-unplaced {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    padding: 6px;
    border: 1px dashed var(--divider-color, rgba(127, 127, 127, 0.4));
    border-radius: 8px;
  }
  .bx-tree,
  .bx-tree ul {
    list-style: none;
    margin: 0;
    padding-left: 0;
  }
  .bx-tree ul {
    padding-left: 16px;
    margin-left: 6px;
    border-left: 2px solid var(--divider-color, rgba(127, 127, 127, 0.3));
  }
  .bx-node {
    font-weight: 600;
  }

  /* boards one below the other */
  .board-section + .board-section {
    margin-top: 20px;
    padding-top: 12px;
    border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
  }
  .board-title {
    margin: 0 0 8px;
    font-size: 1.05em;
    font-weight: 600;
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
`;function C(i,e,t){i.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}function $t(i,e){C(i,"hass-more-info",{entityId:e})}function H(i,e){C(i,"hass-notification",{message:e})}let Te=null;function De(){return customElements.get("ha-selector")?Promise.resolve():Te||(Te=(async()=>{try{const i=await window.loadCardHelpers?.();if(!i)return;await(await i.createCardElement({type:"entities",entities:[]}))?.constructor?.getConfigElement?.(),await customElements.get("hui-tile-card")?.getConfigElement?.()}catch{}})(),Te)}function gt(){return!!customElements.get("ha-selector")}function K(i,e,t,s,n,o,a){if(gt()){const u=n?{domain:"sensor",device_class:n}:a?{domain:a}:void 0;return r`<div class="f">
      <ha-selector
        .hass=${i}
        .selector=${{entity:u?{filter:u}:{}}}
        .value=${s??""}
        .label=${t}
        @value-changed=${d=>o(d.detail?.value||null)}
      ></ha-selector>
    </div>`}const l=Object.keys(i.states).filter(u=>!n||i.states[u]?.attributes?.device_class===n).filter(u=>!a||a.includes(u.split(".")[0])).sort();return r`<div class="f">
    <label for=${e}>${t}</label>
    <input
      class="inp"
      id=${e}
      list=${`${e}-list`}
      .value=${s??""}
      @change=${u=>o(u.target.value.trim()||null)}
    />
    <datalist id=${`${e}-list`}>${l.map(u=>r`<option value=${u}></option>`)}</datalist>
  </div>`}function Oe(i,e){return e.filter(t=>!!t).map(t=>i?.areas?.[t]?.name??t)}function Be(i,e,t,s,n,o){const a=Array.isArray(s)?s:s?[s]:[];if(gt())return r`<div class="f">
      <ha-selector
        .hass=${i}
        .selector=${{area:{multiple:n}}}
        .value=${n?a:a[0]??""}
        .label=${t}
        @value-changed=${u=>{const d=u.detail?.value;o(Array.isArray(d)?d:d?[d]:[])}}
      ></ha-selector>
    </div>`;const l=Object.values(i.areas??{}).sort((u,d)=>u.name.localeCompare(d.name));return r`<div class="f">
    <label for=${e}>${t}</label>
    <select
      class="sel"
      id=${e}
      ?multiple=${n}
      @change=${u=>{const d=u.target;o(Array.from(d.selectedOptions).map(p=>p.value).filter(Boolean))}}
    >
      ${n?c:r`<option value="" ?selected=${!a.length}>—</option>`}
      ${l.map(u=>r`<option value=${u.area_id} ?selected=${a.includes(u.area_id)}>${u.name}</option>`)}
    </select>
  </div>`}function v(i,e,t,s,n={}){return r`<div class="f">
    <label for=${i}>${e}</label>
    ${n.suggestions?r`<datalist id=${`${i}-list`}>${n.suggestions.map(o=>r`<option value=${o}></option>`)}</datalist>`:c}
    <input
      class="inp"
      id=${i}
      list=${n.suggestions?`${i}-list`:c}
      type=${n.type??"text"}
      placeholder=${n.placeholder??""}
      .value=${t==null?"":String(t)}
      @input=${o=>s(o.target.value)}
      @blur=${()=>n.onBlur?.()}
    />
    ${n.hint??c}
  </div>`}function x(i,e,t,s,n){return r`<div class="f">
    <label for=${i}>${e}</label>
    <select class="sel" id=${i} @change=${o=>n(o.target.value)}>
      ${s.map(o=>r`<option value=${String(o.value)} ?selected=${String(o.value)===String(t??"")}>${o.label}</option>`)}
    </select>
  </div>`}async function es(i){try{return await navigator.clipboard.writeText(i),!0}catch{const e=document.createElement("textarea");e.value=i,document.body.appendChild(e),e.select();const t=document.execCommand?.("copy")??!1;return e.remove(),t}}function ts(i,e){if(!i)return"\u2014";const t=new Date(i);return Number.isNaN(t.getTime())?i:t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}function is(i,e){if(!i)return"\u2014";const t=new Date(i);return Number.isNaN(t.getTime())?i:t.toLocaleString(e,{dateStyle:"short",timeStyle:"short"})}const ze=class extends P{constructor(){super(),this._loaded=!1,this._config={type:"custom:home-infra-map-card"},this._boards=[]}setConfig(e){this._config={...e&&typeof e=="object"?e:{type:"custom:home-infra-map-card"}}}updated(){!this._loaded&&this.hass&&(this._loaded=!0,Ne(this.hass).then(e=>this._boards=e.model.boards).catch(()=>this._boards=[]))}_set(e,t){const s={...this._config};t===""?delete s[e]:s[e]=t,this._config=s,C(this,"config-changed",{config:this._config})}render(){const e=U(je(this.hass)),t=this._config,s=(n,o,a,l)=>r`<div class="f">
        <label for=${`cfg-${n}`}>${o}</label>
        <select class="sel" id=${`cfg-${n}`} @change=${u=>this._set(n,u.target.value)}>
          ${l.map(([u,d])=>r`<option value=${u} ?selected=${(a??"")===u}>${d}</option>`)}
        </select>
      </div>`;return r`<div class="form" style="border:0;padding:0">
      <div class="f">
        <label for="cfg-title">Titre / Title</label>
        <input class="inp" id="cfg-title" .value=${t.title??""} @change=${n=>this._set("title",n.target.value)} />
      </div>
      ${s("view","Vue / View",t.view??"electricity",[["electricity",e("view.electricity")],["network",e("view.network")]])}
      ${this._boards.length>1?s("boards_layout",e("cfg.boards_layout"),t.boards_layout??(t.board?"tabs":"stacked"),[["stacked",e("cfg.stacked")],["tabs",e("cfg.tabs")]]):c}
      ${this._boards.length?s("board",e("el.board"),t.board,[["","\u2014"],...this._boards.map(n=>[n.id,n.name])]):c}
      ${s("network_view",`${e("view.network")}`,t.network_view??"topology",[["topology",e("nview.topology")],["vlan",e("nview.vlan")],["switch",e("nview.switch")]])}
    </div>`}};ze.styles=G,ze.properties={hass:{attribute:!1},_config:{state:!0},_boards:{state:!0}};let ss=ze;function J(i,e,t){return i[e]?.find(s=>s.key===t)?.entity_id??null}function be(i,e,t){const s=J(e.entities,i.id,"online"),n=s&&t?t.states[s]:void 0;if(n)return n.state==="on"?"online":n.state==="off"?"offline":"unknown";const o=e.live.ping[i.id];return!o||o.alive===null||o.alive===void 0?"unknown":o.alive?"online":"offline"}function vt(i,e,t){const s=J(e.entities,i.id,"latency"),n=s&&t?t.states[s]:void 0;if(n){const o=Number(n.state);if(Number.isFinite(o))return o}return e.live.ping[i.id]?.rtt_ms??null}function ns(i,e){const t=new Map;for(const s of i)s.switch_id!==e||s.port===null||s.parent_device_id||(t.has(s.port)||t.set(s.port,[]),t.get(s.port).push(s));return[...t.entries()].sort((s,n)=>s[0]-n[0]).map(([s,n])=>({port:s,devices:fe(n)}))}const xt={router:0,switch:1,ap:2,server:3,nas:4};function fe(i){return i.slice().sort((e,t)=>(xt[e.kind]??9)-(xt[t.kind]??9)||e.name.localeCompare(t.name))}function os(i,e){return fe(i.filter(t=>t.parent_device_id===e))}function as(i,e){const t=new Set(e.map(s=>s.id));return fe(i.filter(s=>!s.parent_device_id&&!(s.switch_id&&t.has(s.switch_id)&&s.port!==null)))}function _e(i){const e=i.split(".");return e.length===4&&e.every(t=>/^\d+$/.test(t))?e.map(t=>t.padStart(3,"0")).join("."):i}function rs(i,e){let t=0,s=0;for(const n of i.model.network.devices){if(!n.monitor.ping)continue;const o=be(n,i,e);o==="online"&&(t+=1),o==="offline"&&(s+=1)}return{online:t,offline:s}}function ls(i,e,t,s=[]){const n=new Set(s.map(o=>o.toLowerCase()));return fe(i.filter(o=>o.switch_id===e.id&&o.port===t||o.mac&&n.has(o.mac.toLowerCase())))}function ds(){return{columns:"full",rows:"auto",min_columns:6,min_rows:4}}function cs(){return 8}function wt(i){if(!i)return[];const e=[];for(const t of i){const s=t.s??t.state,n=Number(s),o=t.lu??t.lc??(t.last_updated?Date.parse(t.last_updated)/1e3:void 0);!Number.isFinite(n)||o===void 0||e.push({t:Number(o)*1e3,v:n})}return e}function yt(i,e,t,s=200,n=42){if(!i.length||t<=e)return{line:"",area:""};const o=Math.max(...i.map(b=>b.v),1),a=b=>(Math.min(Math.max(b,e),t)-e)/(t-e)*s,l=b=>n-2-Math.max(b,0)/o*(n-4),u=i.map(b=>`${a(b.t).toFixed(1)} ${l(b.v).toFixed(1)}`),d=i[i.length-1];u.push(`${s} ${l(d.v).toFixed(1)}`);const p=`M${u.join(" L")}`,m=`${p} L${s} ${n} L${a(i[0].t).toFixed(1)} ${n}Z`;return{line:p,area:m}}function us(i,e,t){if(!i?.length)return[];const s=[],n=i.map(o=>({t:Number(o.lu??o.lc??Date.parse(o.last_updated)/1e3)*1e3,s:String(o.s??o.state)})).filter(o=>Number.isFinite(o.t)).sort((o,a)=>o.t-a.t);return n.forEach((o,a)=>{const l=Math.max(o.t,e),u=a+1<n.length?n[a+1].t:t;u<=l||s.push({from:l,to:u,on:o.s==="on"?!0:o.s==="off"?!1:null})}),s}function R(i,e,t,...s){(i==="error"?console.error:i==="warn"?console.warn:console.info)(`%cHOME-INFRA-MAP%c [${e}] ${t}`,"color:#0b6bcb;font-weight:bold","",...s)}const kt=[],At=new Map,ps=3;function Q(i,e){kt.push([i,e]),customElements.get(i)||customElements.define(i,e)}function hs(){let i=0;for(const[e,t]of kt){if(customElements.get(e))continue;const s=At.get(e)??0;if(!(s>=ps)){At.set(e,s+1);try{customElements.define(e,class extends t{}),i+=1,R("warn","register","re-registered %s at t=%dms: the element registry was replaced",e,Math.round(performance.now()))}catch(n){R("error","register","cannot re-register %s: %o",e,n)}}}return i}function ms(i){let e=0;const t=s=>{if(s.localName==="hui-error-card"){const n=s,o=n._config??n.config;`${o?.message??""} ${o?.error??""}`.includes(i)&&(s.dispatchEvent(new CustomEvent("ll-rebuild",{bubbles:!0,composed:!0})),e+=1);return}for(const n of[...s.shadowRoot?.children??[],...s.children])t(n)};return document.body&&t(document.body),e}function bs(i){for(const e of[0,50,150,400,1e3,2e3,4e3])window.setTimeout(()=>{try{hs();const t=ms(i);t&&R("warn","register","%d error card(s) rebuilt after %dms",t,e)}catch(t){R("error","register","repair failed: %o",t)}},e)}const Ct="0.6.0";function St(i){return i==="online"?"dot":i==="offline"?"dot bad":"dot off"}function It(i,e){if(!i.monitor.ping)return r`<span class="dot off" aria-hidden="true"></span>`;const t=be(i,e.payload,e.hass);return r`<span class=${St(t)} role="img" aria-label=${t==="online"?e.t("ds.online"):t==="offline"?e.t("ds.offline"):e.t("ds.unknown")}></span>`}function fs(i,e){const t=[i.host];if(i.monitor.ping){const s=be(i,e.payload,e.hass);if(s==="offline")t.push(e.t("net.offline_short"));else if(s==="online"){const n=vt(i,e.payload,e.hass);n!==null&&t.push(`${Math.round(n*10)/10} ms`)}}return t.filter(Boolean).join(" \xB7 ")}function Mt(i,e,t,s=""){return r`<button
    class="tn"
    style=${`margin-left:calc(var(--him-indent) * ${t})`}
    data-device-id=${i.id}
    @click=${()=>e.onOpenDevice(i.id)}
  >
    ${It(i,e)}
    <span class="name">${i.name}${s?r`<span class="muted"> · ${s}</span>`:c}</span>
    <span class="ip num">${fs(i,e)}</span>
  </button>`}function _s(i,e){let t;switch(i.kind){case"any":t=e("fw.dest.any");break;case"router":t=e("fw.dest.router",{ip:i.value});break;case"private":t=e("fw.dest.private");break;case"network":t=e("fw.dest.network",{name:i.label||i.value});break;case"address":t=i.label?`${i.label} (${i.value})`:i.value;break;case"alias":t=i.value;break;default:t=i.value||i.label}return i.not?e("fw.not",{x:t}):t}function Fe(i,e){return i.map(t=>e(`fw.reason.${t}`)).join(", ")}function $s(i,e,t,s){if(s)return r`<div class="banner">${e("card.error",{error:s})}</div>`;if(!i)return r`<div class="muted">${e("fw.loading")}</div>`;if(!i.available){const a=i.reason==="unavailable"?"fw.unavailable":i.reason==="not_an_ip"?"fw.not_an_ip":"fw.not_configured";return r`<div class="empty">${e(a)}</div>`}const n=i.outbound,o=i.rule_hits??{};return r`
    <h3>${e("fw.what_can")}</h3>
    <div class="scroll">
      <table class="tbl fw-out">
        <thead>
          <tr><th aria-label=${e("fw.col.rule")}></th><th>${e("fw.col.rule")}</th><th>${e("fw.col.to")}</th><th>${e("fw.col.today")}</th></tr>
        </thead>
        <tbody>
          ${n.rules.map(a=>{const l=a.action==="pass",u=a.uuid?o[a.uuid]:void 0,d=_s(a.destination,e)+(a.ports?`:${a.ports}`:"");return r`<tr class=${a.specific?"hl":""} data-uuid=${a.uuid??""} data-action=${a.action}>
              <td><span class=${`act ${l?"pass":"block"}`} role="img" aria-label=${e(l?"fw.pass":"fw.block")}>${l?"\u2713":"\u2715"}</span></td>
              <td>
                ${a.specific?r`<b class="desc">${a.description}</b> <span class="ent">· ${e("fw.own_rule")}</span>`:r`<span class="desc">${a.description}</span>`}
                ${a.floating?r` <span class="badge">${e("fw.floating")}</span>`:c}
                ${a.probable?r` <span class="badge warn" title=${Fe(a.reasons,e)}>${e("fw.probable")}</span>`:c}
                ${a.probable?r`<div class="muted small">${Fe(a.reasons,e)}</div>`:c}
              </td>
              <td class="num">${d}${a.protocol!=="any"?r` <span class="muted">${a.protocol}</span>`:c}</td>
              <td class="num">
                ${u?l?String(u):r`<span style="color:var(--him-warn)">${e("fw.blocked_n",{n:u})}</span>`:"\u2014"}
              </td>
            </tr>`})}
        </tbody>
      </table>
    </div>
    ${n.default_deny?r`<div class="muted small">${e("fw.default_deny")}</div>`:c}
    ${n.unreachable_count?r`<div class="muted small">${e("fw.unreachable",{n:n.unreachable_count})}</div>`:c}
    ${n.redundant.length?r`<div class="muted small">${e("fw.redundant",{list:n.redundant.map(a=>`\xAB ${a.description} \xBB`).join(", ")})}</div>`:c}
    <h3>${e("fw.who")}</h3>
    <div class="chips fw-in">
      ${(i.inbound??[]).map(a=>{const l=a.verdict==="allowed"?"dot":a.verdict==="blocked"?"dot bad":a.verdict==="partial"?"dot warn":"dot off",u=[a.rule?.description,a.ports,a.probable?Fe(a.reasons,e):""].filter(Boolean).join(" \xB7 ");return r`<span class="chip" title=${u} data-verdict=${a.verdict}>
          <span class=${l}></span>${a.label}
          ${a.verdict==="partial"?r`<span class="muted small">${e("fw.partial")}${a.ports?` ${a.ports}`:""}</span>`:c}
          ${a.verdict==="same_network"?r`<span class="muted small">${e("fw.same_network")}</span>`:c}
          ${a.probable?r`<span class="badge warn">${e("fw.probable")}</span>`:c}
        </span>`})}
    </div>
    ${(i.nat??[]).map(a=>r`<div class="muted small">${e("fw.nat",{ext:a.external_port||"?",target:a.target_port||a.external_port||"?"})}${a.description?` \xB7 ${a.description}`:""}</div>`)}
    <h3>${e("fw.recent")}</h3>
    ${(i.blocks??[]).length?r`<div class="scroll">
          <table class="tbl fw-blocks">
            <thead><tr><th>${e("fw.col.time")}</th><th>${e("fw.col.dest")}</th><th>${e("fw.col.name")}</th><th>${e("fw.col.by")}</th></tr></thead>
            <tbody>
              ${(i.blocks??[]).map(a=>r`<tr>
                  <td class="num">${ts(a.time,t)}</td>
                  <td class="num">${a.destination}${a.port?`:${a.port}`:""}</td>
                  <td>${a.dns_name??"\u2014"}</td>
                  <td>${a.rule??r`<span class="muted">${e("fw.default_rule")}</span>`}</td>
                </tr>`)}
            </tbody>
          </table>
        </div>`:r`<div class="muted small">${e("fw.no_blocks")}</div>`}
    <p class="muted small">${e("fw.readonly")}</p>
  `}const Le=class extends P{constructor(){super(),this._loadedFw=null,this._loadedHist=null,this._keyHandler=e=>{e.key==="Escape"&&this._close()},this.tab="info",this.deviceId=null,this._report=null,this._history=null}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keyHandler)}disconnectedCallback(){window.removeEventListener("keydown",this._keyHandler),super.disconnectedCallback()}get _device(){return this.payload?.model.network.devices.find(e=>e.id===this.deviceId)}get _t(){return U(this._lang)}get _lang(){return(this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en"}updated(e){if(e.has("deviceId")&&(this._report=null,this._history=null,this._loadedFw=null,this._loadedHist=null,this.renderRoot.querySelector('.sheet [role="tab"][aria-selected="true"]')?.focus()),this.tab==="firewall"&&this.hass&&this.deviceId&&this._loadedFw!==this.deviceId&&(this._loadedFw=this.deviceId,this._fwError=void 0,Vi(this.hass,this.deviceId).then(t=>this._report=t).catch(t=>this._fwError=M(t))),this.tab==="history"&&this.hass&&this.payload&&this.deviceId&&this._loadedHist!==this.deviceId){this._loadedHist=this.deviceId;const t=["online","latency"].map(s=>J(this.payload.entities,this.deviceId,s)).filter(s=>!!s);ft(this.hass,t).then(s=>this._history=s).catch(()=>this._history={})}}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_setTab(e){this.tab=e}_onTabKey(e){const t=["info","firewall","history"],s=t.indexOf(this.tab);(e.key==="ArrowRight"||e.key==="ArrowLeft")&&(e.preventDefault(),this.tab=t[(s+(e.key==="ArrowRight"?1:t.length-1))%t.length],this.updateComplete.then(()=>this.renderRoot.querySelector('.sheet [role="tab"][aria-selected="true"]')?.focus()))}render(){const e=this._device,t=this._t;if(!e||!this.payload)return r``;const s=this.payload,n=e.monitor.ping?be(e,s,this.hass):"unknown",o=vt(e,s,this.hass),a=s.model.network.vlans.find(p=>p.id===e.vlan_id),l=J(s.entities,e.id,"blocks"),u=l?Number(this.hass?.states[l]?.state):NaN,d=[["info",t("ds.tab.info")],["firewall",t("ds.tab.firewall")],["history",t("ds.tab.history")]];return r`<div class="overlay" @click=${p=>p.target===p.currentTarget&&this._close()}>
      <div class="sheet" role="dialog" aria-modal="true" aria-label=${e.name}>
        <div class="head">
          <span class="title">${e.name}</span>
          <div class="head-actions">
            <div class="seg" role="tablist" @keydown=${this._onTabKey}>
              ${d.map(([p,m])=>r`<button
                  role="tab"
                  aria-selected=${this.tab===p?"true":"false"}
                  tabindex=${this.tab===p?"0":"-1"}
                  @click=${()=>this._setTab(p)}
                >
                  ${m}
                </button>`)}
            </div>
            <button class="icon-btn" aria-label=${t("ds.close")} @click=${this._close}>✕</button>
          </div>
        </div>
        <div class="body">
          <div class="chips">
            ${e.monitor.ping?r`<span class="chip"><span class=${St(n)}></span>${n==="online"?o!==null?t("ds.online_ms",{ms:Math.round(o*10)/10}):t("ds.online"):t(n==="offline"?"ds.offline":"ds.unknown")}</span>`:c}
            <span class="chip num">${[e.host,a?.name,e.port!==null?t("net.port",{n:e.port}):""].filter(Boolean).join(" \xB7 ")}</span>
            ${Number.isFinite(u)&&u>0?r`<span class="chip"><span class="dot warn"></span>${t("ds.blocks_today",{n:u})}</span>`:c}
          </div>
          ${this.tab==="info"?this._renderInfo(e):c}
          ${this.tab==="firewall"?$s(this._report,t,this._lang,this._fwError):c}
          ${this.tab==="history"?this._renderHistory(e):c}
        </div>
      </div>
    </div>`}_renderInfo(e){const t=this._t,s=this.payload,n=s.model.network,o=n.vlans.find(d=>d.id===e.vlan_id),a=n.switches.find(d=>d.id===e.switch_id),l=n.devices.find(d=>d.id===e.parent_device_id),u=s.entities[e.id]??[];return r`<dl class="detail">
      <dt>${t("ds.ip")}</dt><dd class="num">${e.host||"\u2014"}</dd>
      <dt>${t("ds.mac")}</dt><dd class="num">${e.mac??"\u2014"}</dd>
      <dt>${t("ds.vlan")}</dt><dd>${o?`${o.name}${o.subnet?` \xB7 ${o.subnet}`:""}`:"\u2014"}</dd>
      <dt>${t("ds.port")}</dt>
      <dd>
        ${e.port!==null?r`${t("ds.port_value",{port:e.port,switch:a?.name??"?"})}
              <span class="muted small">
                · ${e.port_source==="manual"?t("ds.port_manual"):t("ds.port_auto")}
                ${e.last_seen_port_at?` \xB7 ${t("ds.last_seen",{date:is(e.last_seen_port_at,this._lang)})}`:""}
              </span>`:"\u2014"}
      </dd>
      <dt>${t("ds.area")}</dt><dd>${Oe(this.hass,[e.area_id]).join("")||"\u2014"}</dd>
      <dt>${t("ds.kind")}</dt><dd>${t(`kind.${e.kind}`)}${e.model?` \xB7 ${e.model}`:""}</dd>
      ${l?r`<dt>${t("ds.parent")}</dt><dd>${l.name}</dd>`:c}
      <dt>${t("ds.sensors")}</dt>
      <dd>
        ${u.length?u.map(d=>r`<button class="ent" @click=${()=>$t(this,d.entity_id)}>${d.entity_id}</button><br />`):t("ds.no_sensor")}
      </dd>
      ${e.notes?r`<dt>${t("ds.notes")}</dt><dd style="white-space:pre-line">${e.notes}</dd>`:c}
    </dl>`}_renderHistory(e){const t=this._t,s=this.payload,n=J(s.entities,e.id,"online"),o=J(s.entities,e.id,"latency");if(!n&&!o)return r`<div class="empty">${t("hist.none")}</div>`;if(this._history===null)return r`<div class="muted">${t("card.loading")}</div>`;const a=Date.now(),l=a-24*3600*1e3,u=n?us(this._history[n],l,a):[],d=o?wt(this._history[o]):[],{line:p,area:m}=yt(d,l,a,200,60);return r`
      ${n?r`<h3>${t("hist.presence")}</h3>
            <div class="timeline" role="img" aria-label=${t("hist.presence")}>
              ${u.map(b=>r`<span class=${b.on===!0?"on":b.on===!1?"off":"na"} style=${`flex:${b.to-b.from}`}></span>`)}
            </div>`:c}
      ${o?r`<h3>${t("hist.latency")}</h3>
            ${p?r`<svg class="spark" style="height:60px" viewBox="0 0 200 60" preserveAspectRatio="none" role="img" aria-label=${t("hist.latency")}>
                  ${A`<path d=${m} fill="var(--him-accent)" opacity=".15"></path><path d=${p} fill="none" stroke="var(--him-accent)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
                </svg>
                <span class="muted small num">max ${Math.max(...d.map(b=>b.v)).toFixed(1)} ms</span>`:r`<span class="muted small">${t("el.d.no_history")}</span>`}`:c}
    `}};Le.styles=G,Le.properties={hass:{attribute:!1},payload:{attribute:!1},deviceId:{attribute:!1},tab:{attribute:!1},_report:{state:!0},_fwError:{state:!0},_history:{state:!0}};let gs=Le;function Pt(i){if(i.kind!=="breaker"&&i.kind!=="rcbo"||i.status==="spare")return!1;const e=(i.circuit_name??"").trim();return e===""||e==="?"}function se(i,e){if(!i||!e)return null;const t=i.states[e];if(!t||t.state==="unavailable"||t.state==="unknown"||t.state==="")return null;const s=Number(t.state);if(!Number.isFinite(s))return null;const n=t.attributes?.unit_of_measurement;return n==="kW"?s*1e3:n==="mW"?s/1e3:s}function Nt(i,e){const t=new Set;let s=0,n=0;for(const o of e){if(!o||t.has(o))continue;t.add(o);const a=se(i,o);a!==null&&(s+=a,n+=1)}return n?s:null}function Et(i){return i.rows.flatMap(e=>e.modules.map(t=>t.power_entity_id).filter(t=>!!t))}function vs(i,e){const t={rcds:0,breakers:0,devices:0,unidentified:0,spare:0,off:0};for(const s of i.rows)for(const n of s.modules)n.kind==="rcd"&&(t.rcds+=1),(n.kind==="breaker"||n.kind==="rcbo")&&(t.breakers+=1),n.kind==="device"&&(t.devices+=1),Pt(n)&&(t.unidentified+=1),n.status==="spare"?t.spare+=1:$e(n,e)&&(t.off+=1);return t}function $e(i,e){if(i.status==="off")return!0;const t=i.switch_entity_id;return!!(t&&e?.states[t]?.state==="off")}class ge{constructor(e){this.modules=new Map,this.boardOf=new Map,this.defaults=new Map;for(const t of e){let s=t.fed_by??null;for(const n of t.supply??[])this.add(n,t,s),s=n.id;for(const n of t.rows){let o=null;for(const a of n.modules)a.kind==="rcd"||a.kind==="meter"||a.kind==="main_breaker"?(this.add(a,t,s),a.kind==="rcd"&&(o=a.id)):this.add(a,t,o??s)}}}add(e,t,s){this.modules.set(e.id,e),this.boardOf.set(e.id,t),this.defaults.set(e.id,s)}defaultFeeder(e){const t=this.defaults.get(e.id);return t?this.modules.get(t)??null:null}feeder(e){const t=(e.fed_by&&this.modules.has(e.fed_by)?e.fed_by:null)??this.defaults.get(e.id);return t?this.modules.get(t)??null:null}chain(e){const t=[],s=new Set([e.id]);let n=this.feeder(e);for(;n&&!s.has(n.id);)t.push(n),s.add(n.id),n=this.feeder(n);return t}protector(e){if(e.kind==="rcbo")return e;for(const t of this.chain(e))if(t.kind==="rcd"||t.kind==="rcbo"||t.kind==="main_breaker"&&t.sensitivity_ma)return t;return null}fed(e){return[...this.modules.values()].filter(t=>this.feeder(t)?.id===e)}downstream(e){const t=new Set,s=[e];for(;s.length;)for(const n of this.fed(s.pop()))t.has(n.id)||n.id===e||(t.add(n.id),s.push(n.id));return t}candidates(e){const t=this.downstream(e.id);return[...this.modules.values()].filter(s=>s.id!==e.id&&!t.has(s.id)&&s.kind!=="spacer")}}function xs(i,e){return i.filter(t=>t.module_id===e)}function j(i){switch(i.kind){case"rcd":return i.rating_a?`${i.rating_a}A`:"ID";case"breaker":case"rcbo":return i.rating_a?`${i.curve!=="?"?i.curve:""}${i.rating_a}`:"?";case"meter":return i.subscribed_kva?`${String(i.subscribed_kva).replace(".",",")} kVA`:"kVA ?";case"main_breaker":return i.rating_a?`${i.rating_a} A`:"? A";case"device":{const e=i.model&&!i.model.trim().startsWith("?")?i.model.trim():"";return e?e.replace(/^shelly\s+/i,"")||e:(i.label||"?").replace(/\s*\(.*$/,"").trim().split(/\s+/)[0]||"?"}default:return""}}function ve(i,e){return i===null?"\u2014":`${new Intl.NumberFormat(e,{maximumFractionDigits:0}).format(Math.round(i))} W`}function Rt(i,e){return i===null?"\u2014":Math.abs(i)<1e3?ve(i,e):`${new Intl.NumberFormat(e,{maximumFractionDigits:1}).format(i/1e3)} kW`}function xe(i){return JSON.parse(JSON.stringify(i))}function N(){const i=new Uint8Array(16);return(globalThis.crypto??{getRandomValues:e=>e.map(()=>Math.floor(Math.random()*256))}).getRandomValues(i),Array.from(i,e=>e.toString(16).padStart(2,"0")).join("")}function ne(i,e){return{id:N(),kind:i,ref:e,width_modules:i==="meter"?4:i==="rcd"||i==="main_breaker"?2:1,model:i==="meter"?"Linky":null,notes:null,status:"active",fed_by:null,subscribed_kva:null,rating_a:i==="rcd"?40:i==="breaker"||i==="rcbo"?16:i==="main_breaker"?60:null,curve:"C",sensitivity_ma:i==="rcd"||i==="rcbo"?30:i==="main_breaker"?500:null,rcd_type:i==="rcd"||i==="rcbo"?"A":"?",cable_mm2:null,circuit_name:"?",circuit_kind:"unknown",area_ids:[],power_entity_id:null,energy_entity_id:null,switch_entity_id:null,label:i==="device"?"?":"",entity_ids:[]}}function ws(i,e,t){const s=i.slice();if(e<0||e>=s.length)return s;const[n]=s.splice(e,1),o=Math.max(0,Math.min(t,s.length));return s.splice(o,0,n),s}function ys(i,e){return e.capacity||i.modules_per_row||null}function ks(i){return i.modules.reduce((e,t)=>e+Math.max(1,t.width_modules||1),0)}const jt=["lighting","sockets","dedicated","cooking","water_heater","heating","feeder"];function Tt(i){return i?i<=10?"lighting":i===16?"sockets":i===20?"dedicated":i===32?"cooking":i>=40?"feeder":null:null}function Dt(i){return i.circuit_kind==="lighting"?8:i.circuit_kind==="sockets"?i.rating_a===16?8:i.rating_a===20?12:null:null}const Ot=["top","left","right","bottom"],Bt=["#03a9f4","#ab47bc","#43a047","#ef6c00","#e91e63","#00897b","#795548","#5c6bc0"],zt={all:"#78716c",phase:"#a0522d",neutral:"#2563eb",earth:"#16a34a",switched:"#7c3aed",traveler:"#db2777",other:"#6b7280",unknown:"#9ca3af"},oe=(i,e)=>`${i}/${e??""}`;function Ft(i){const e=new Map;for(const t of i)for(const s of t.conduits)if(s.end==="box"&&s.end_box_id){e.set(oe(t.id,s.id),[s.end_box_id,s.end_conduit_id]);const n=oe(s.end_box_id,s.end_conduit_id);!e.has(n)&&s.end_conduit_id&&e.set(n,[t.id,s.id])}return e}function Lt(i,e,t,s=Ft(t)){const n=s.get(oe(i.id,e.id));if(!n)return null;const o=t.find(a=>a.id===n[0]);return o?{box:o,conduit:o.conduits.find(a=>a.id===n[1])??null}:null}function ae(i){const e=new Map,t=a=>{e.has(a)||e.set(a,a);let l=a;for(;e.get(l)!==l;)l=e.get(l);return e.set(a,l),l},s=(a,l)=>e.set(t(a),t(l)),n=new Map;for(const a of i){for(const l of a.conduits)n.set(l.id,l.circuits),t(l.id),l.end==="box"&&l.end_conduit_id&&s(l.id,l.end_conduit_id);for(const l of a.connectors)if(l.wire!=="earth")for(const u of l.conduits.slice(1))s(l.conduits[0],u)}const o=new Map;for(const[a,l]of n){const u=o.get(t(a))??[];for(const d of l)u.includes(d)||u.push(d);o.set(t(a),u)}return new Map([...n].map(([a,l])=>[a,l.length?l:o.get(t(a))??[]]))}function Ut(i){const e=[],t=s=>{s&&!e.includes(s)&&e.push(s)};return i.circuits.forEach(t),i.conduits.forEach(s=>s.circuits.forEach(t)),i.connectors.forEach(s=>t(s.circuit)),e}function As(i,e){const t=ae(i);return i.filter(s=>Ut(s).includes(e)||s.conduits.some(n=>t.get(n.id)?.includes(e)))}function Cs(i,e){const t=Math.max(0,...i.conduits.filter(s=>s.side===e).map(s=>s.position??0));return Math.max(i.sides[e]??0,t)}function Ss(i,e){const t=Ft(i),s=new Map(i.map(p=>[p.id,p])),n=ae(i),o=(p,m)=>(n.get(m.id)??[]).includes(e),a=new Set,l=p=>{a.add(p.id);const m={box:p,points:[],unknown:[],children:[]},b=[];for(const f of p.conduits){if(!o(p,f))continue;f.end==="point"?m.points.push(f):f.end==="unknown"&&!t.has(oe(p.id,f.id))&&m.unknown.push(f);const $=t.get(oe(p.id,f.id)),g=$?s.get($[0]):void 0;g&&!a.has(g.id)&&!b.includes(g)&&b.push(g)}for(const f of i)for(const $ of f.conduits)$.end==="box"&&$.end_box_id===p.id&&!$.end_conduit_id&&o(f,$)&&!a.has(f.id)&&!b.includes(f)&&b.push(f);for(const f of b)a.has(f.id)||m.children.push(l(f));return m},u=i.filter(p=>p.conduits.some(m=>m.end==="board"&&o(p,m))).map(p=>a.has(p.id)?null:l(p)).filter(p=>p!==null),d=As(i,e).filter(p=>!a.has(p.id)).map(p=>l(p));return{roots:u,loose:d}}function Is(i,e){const t=ae(i),s={};for(const n of i)for(const o of n.conduits)o.end==="point"&&o.point&&t.get(o.id)?.includes(e)&&(s[o.point.kind]=(s[o.point.kind]??0)+o.point.count);return s}const Ht={socket:["mdi:power-socket-fr","\u25C9"],light:["mdi:lightbulb-outline","\u2600"],switch:["mdi:light-switch","\u25E7"],device:["mdi:washing-machine","\u25A0"],outlet:["mdi:power-plug-outline","\u25CC"],other:["mdi:circle-small","\u2022"]};function Ms(i,e){return customElements.get("ha-icon")?r`<ha-icon class="bx-ic" icon=${i}></ha-icon>`:r`<span class="bx-ic" aria-hidden="true">${e}</span>`}function Ue(i){const[e,t]=Ht[i]??Ht.other;return Ms(e,t)}function S(i,e){return i.side?`${e(`box.side_letter.${i.side}`)}${i.position??"?"}`:"?"}function He(i,e){const t=[i.room,i.label].filter(Boolean).join(" \xB7 ")||e(`box.point.${i.kind}`);return i.count>1?`${t} \xD7${i.count}`:t}function qe(i,e,t){const s=e.modules.get(i);if(!s)return"?";const n=s.circuit_name&&s.circuit_name!=="?"?s.circuit_name:s.label||t("el.unidentified");return`${s.ref||"?"} ${n}`}function We(i,e,t){const{t:s}=t;switch(e.end){case"board":{const n=e.circuits.map(o=>t.index.modules.get(o)?.ref).filter(Boolean).join(", ");return n?`${s("box.from_board")} \xB7 ${n}`:s("box.from_board")}case"point":return e.point?He(e.point,s):s("box.point.other");case"spare":return s("box.spare");default:{const n=Lt(i,e,t.boxes);return n?n.conduit?`${n.box.name} \xB7 ${S(n.conduit,s)}`:n.box.name:e.label?`${e.label} \xB7 ?`:s("box.unknown_dest")}}}function O(i,e){return e.get(i.id)??i.circuits}function qt(i,e){const t=Ut(i);for(const s of i.conduits)for(const n of O(s,e))t.includes(n)||t.push(n);return new Map(t.map((s,n)=>[s,Bt[n%Bt.length]]))}function Ps(i,e,t,s,n){const{t:o}=n,a=O(e,s),l=a.length?t.get(a[0]):void 0,u=n.selectedConduitId===e.id,d=["bx-dot",e.end==="spare"?"spare":"",!a.length&&e.end!=="spare"?"unk":"",u?"sel":"",e.point?.alert?"al":""].filter(Boolean).join(" "),p=We(i,e,n);return r`<button
    class="bx-g"
    title=${`${S(e,o)} \xB7 ${p}`}
    aria-pressed=${u?"true":"false"}
    @click=${()=>n.onSelectBox(i.id,u?null:e.id)}
  >
    <span class=${d} style=${l?`border-color:${l}`:""}>${S(e,o)}</span>
    <span class="bx-lbl">${e.end==="point"&&e.point?Ue(e.point.kind):c}${p}${e.point?.alert?r` <span class="amark-chip">!</span>`:c}</span>
  </button>`}const Ns=92,Es=52,Wt=132,Vt=54,k=15,Gt={top:[0,1],bottom:[0,-1],left:[1,0],right:[-1,0]},Rs={socket:"\u25C9 ",light:"\u2731 ",switch:"\u25E7 ",device:"\u25A0 ",outlet:"\u25CC ",other:""};function js(i,e,t=2){const s=i.split(/\s+/).filter(Boolean),n=[];let o="";for(const a of s)o&&(o+" "+a).length>e?(n.push(o),o=a):o=o?`${o} ${a}`:a;if(o&&n.push(o),n.length>t){const a=n.slice(0,t);return a[t-1]=`${a[t-1].slice(0,e-1)}\u2026`,a}return n}function Ts(i){const e={top:[],bottom:[],left:[],right:[]};for(const l of Ot){for(let u=1;u<=Cs(i,l);u+=1)e[l].push({pos:u,conduit:i.conduits.find(d=>d.side===l&&d.position===u)??null});for(const u of i.conduits.filter(d=>d.side===l&&d.position===null))e[l].push({pos:null,conduit:u})}const t=Math.max(230,Math.max(e.top.length,e.bottom.length)*Ns),s=Math.max(140,Math.max(e.left.length,e.right.length)*Es+16),n=Wt,o=Vt,a=[];for(const l of Ot){const u=e[l];u.forEach((d,p)=>{const m=(p+.5)/u.length,b=l==="left"?n:l==="right"?n+t:n+m*t,f=l==="top"?o:l==="bottom"?o+s:o+m*s;a.push({side:l,pos:d.pos,conduit:d.conduit,x:b,y:f})})}return{slots:a,width:t+2*Wt,height:s+2*Vt,x0:n,y0:o,w:t,h:s}}function Kt(i,e,t){const s=i.side==="top"||i.side==="bottom",n=js(e,s?15:19,2),o=13;let a=i.x,l=i.y,u="middle";return i.side==="top"&&(l=i.y-k-6-(n.length-1)*o),i.side==="bottom"&&(l=i.y+k+15),i.side==="left"&&(a=i.x-k-6,u="end",l=i.y+4-(n.length-1)*o/2),i.side==="right"&&(a=i.x+k+6,u="start",l=i.y+4-(n.length-1)*o/2),A`<text class=${t} x=${a} y=${l} text-anchor=${u}>${n.map((d,p)=>A`<tspan x=${a} dy=${p?o:0}>${d}</tspan>`)}</text>`}function Ds(i,e,t,s){const n=new Map(e.filter(a=>a.conduit).map(a=>[a.conduit.id,a])),o=[];for(const a of i.connectors){if(a.wire!=="all")continue;const l=a.conduits.map(b=>n.get(b)).filter(b=>!!b);if(l.length<2)continue;const u=i.conduits.find(b=>b.id===l[0].conduit.id),d=a.circuit??O(u,s)[0],p=d&&t.get(d)||"#9aa1a9",m=(b,f)=>[b.x+Gt[b.side][0]*f,b.y+Gt[b.side][1]*f];if(l.length===2){const[b,f]=l,[$,g]=m(b,k),[h,_]=m(f,k),[y,E]=m(b,70),[B,w]=m(f,70);o.push(A`<path class="bx-join" d=${`M${$},${g} C${y},${E} ${B},${w} ${h},${_}`} stroke=${p}></path>`)}else{const b=l.map(g=>m(g,60)),f=b.reduce((g,h)=>g+h[0],0)/b.length,$=b.reduce((g,h)=>g+h[1],0)/b.length;for(const g of l){const[h,_]=m(g,k),[y,E]=m(g,55);o.push(A`<path class="bx-join" d=${`M${h},${_} Q${y},${E} ${f},${$}`} stroke=${p}></path>`)}o.push(A`<circle class="bx-node-dot" cx=${f} cy=${$} r="7" fill=${p}></circle>`)}}return o}function Os(i,e,t,s){const{t:n}=s,o=Ts(i),a=i.connectors.some(u=>u.wire==="all"&&u.conduits.length>1),l=!i.connectors.length;return r`<svg
    class="bx-svg"
    viewBox=${`0 0 ${o.width} ${o.height}`}
    style=${`max-width:${Math.round(o.width*1.25)}px`}
    role="group"
    aria-label=${i.name}
  >
    <rect class="bx-rect" x=${o.x0} y=${o.y0} width=${o.w} height=${o.h} rx="12"></rect>
    ${l||!a?A`<text class="bx-center" x=${o.x0+o.w/2} y=${o.y0+o.h/2+4} text-anchor="middle">${n(l?"box.no_connectors":"box.see_connectors")}</text>`:c}
    ${Ds(i,o.slots,e,t)}
    ${o.slots.map(u=>{const d=`${n(`box.side_letter.${u.side}`)}${u.pos??"?"}`,p=u.conduit;if(!p){const _=s.onFreeSlot&&u.pos!==null?()=>s.onFreeSlot(u.side,u.pos):null;return A`<g class=${_?"bx-sg free add":"bx-sg free"} role=${_?"button":c} tabindex=${_?"0":c}
            @click=${()=>_?.()} @keydown=${y=>(y.key==="Enter"||y.key===" ")&&_?.()}>
          ${_?A`<title>${n("be.add_here",{pos:d})}</title>`:c}
          <circle cx=${u.x} cy=${u.y} r=${k}></circle><text class="bx-dt" x=${u.x} y=${u.y+4} text-anchor="middle">${_?"+":d}</text>${Kt(u,_?d:n("box.free"),"bx-st muted")}</g>`}const m=O(p,t),b=m.length?e.get(m[0]):void 0,f=s.selectedConduitId===p.id,$=We(i,p,s),g=`${p.end==="point"&&p.point?Rs[p.point.kind]??"":""}${$}`,h=["bx-sg",p.end==="spare"?"spare":"",!m.length&&p.end!=="spare"?"unk":"",f?"sel":"",s.linkFrom===p.id?"linkfrom":""].filter(Boolean).join(" ");return A`<g class=${h} role="button" tabindex="0" aria-pressed=${f?"true":"false"}
          @click=${()=>s.onSelectBox(i.id,f?null:p.id)}
          @keydown=${_=>(_.key==="Enter"||_.key===" ")&&s.onSelectBox(i.id,f?null:p.id)}>
        <title>${d} · ${$}</title>
        ${f?A`<circle class="bx-halo" cx=${u.x} cy=${u.y} r=${k+6}></circle>`:c}
        <circle cx=${u.x} cy=${u.y} r=${k} style=${b?`stroke:${b}`:""}></circle>
        <text class="bx-dt" x=${u.x} y=${u.y+4} text-anchor="middle">${d}</text>
        ${m.length>1?A`<text class="bx-more" x=${u.x+k} y=${u.y-k+4}>+${m.length-1}</text>`:c}
        ${p.point?.alert?A`<circle class="bx-al" cx=${u.x+k-2} cy=${u.y-k+2} r="6"></circle><text class="bx-al-t" x=${u.x+k-2} y=${u.y-k+5.5} text-anchor="middle">!</text>`:c}
        ${Kt(u,g,"bx-st")}
      </g>`})}
  </svg>`}function Bs(i,e,t){const{t:s}=t,n=new Map(i.conduits.map(d=>[d.id,d])),o=d=>d.wire==="all"&&d.conduits.filter(p=>n.get(p)?.side).length>1,a=i.connectors.filter(d=>!o(d)),l=new Set(i.conduits.flatMap(d=>d.circuits)),u=i.circuits.filter(d=>!l.has(d));return!a.length&&!u.length?c:r`<div class="bx-in">
    ${a.length?r`<div class="bx-in-t">${s("box.connectors")}</div>`:c}
    ${a.map(d=>r`<div class="bx-k">
        <span class="bx-sw" style=${`background:${zt[d.wire]??zt.unknown}`}></span>
        <b>${d.kind}${d.poles?` \xB7 ${d.poles}`:""}</b>
        <span>${s(`box.wire.${d.wire}`)}</span>
        <span class="muted"
          >${d.conduits.length?d.conduits.map(p=>n.get(p)?S(n.get(p),s):"?").join(" \xB7 "):s("box.members_unknown")}</span
        >
        ${d.circuit?r`<span class="c" style=${`background:${e.get(d.circuit)??"#999"}`}></span>`:c}
      </div>`)}
    ${u.length?r`<div class="muted small bx-pass">${s("box.also_inside")} ${u.map(d=>qe(d,t.index,s)).join(", ")}</div>`:c}
  </div>`}function zs(i,e,t,s){const{t:n}=s,o=Lt(i,e,s.boxes),a=i.connectors.filter(u=>u.conduits.includes(e.id)),l=(u,d)=>d==null||d===""?c:r`<dt>${u}</dt><dd>${d}</dd>`;return r`<dl class="detail bx-detail" aria-live="polite">
    <dt>${n("box.conduit")}</dt>
    <dd>
      <b>${S(e,n)}</b>${e.label?` \xB7 ${e.label}`:""}
      ${[e.kind,e.diameter_mm?`\xD8${e.diameter_mm}`:null].filter(Boolean).join(" ")?r` · ${[e.kind,e.diameter_mm?`\xD8${e.diameter_mm}`:null].filter(Boolean).join(" ")}`:c}
      ${e.side?c:r` <span class="tag inline">${n("box.pos_unknown")}</span>`}
    </dd>
    <dt>${n("box.circuits")}</dt>
    <dd>
      ${O(e,t).length?O(e,t).map((u,d)=>r`${d?", ":""}<button class="ent" @click=${()=>s.onSelectModule(u)}>${qe(u,s.index,n)}</button>`):r`<span class="muted">${n("box.circuit_unknown")}</span>`}
      ${!e.circuits.length&&O(e,t).length?r`<span class="muted small"> · ${n("box.carried")}</span>`:c}
    </dd>
    ${l(n("box.cable"),[e.cable,e.length_m!==null?`${e.length_m} m`:null].filter(Boolean).join(" \xB7 "))}
    ${l(n("box.route"),e.route)}
    <dt>${n("box.leads_to")}</dt>
    <dd>
      ${o?r`<button class="ent" @click=${()=>s.onSelectBox(o.box.id,o.conduit?.id??null)}>
            ${o.box.name}${o.conduit?` \xB7 ${S(o.conduit,n)}`:` \xB7 ${n("box.entry_unknown")}`}
          </button>`:e.end==="point"&&e.point?r`${Ue(e.point.kind)} ${He(e.point,n)}
              ${e.point.entity_id?r` · <button class="ent" @click=${()=>s.onMoreInfo(e.point.entity_id)}>${e.point.entity_id}</button>`:c}`:We(i,e,s)}
    </dd>
    ${e.point?.alert?r`<dt>${n("el.d.alert")}</dt><dd class="alert-text"><span class="amark-chip">!</span> ${e.point.alert}</dd>`:c}
    ${a.length?r`<dt>${n("box.connectors")}</dt>
          <dd>
            ${a.map(u=>u.wire==="all"?`${n("box.joined_to")} ${u.conduits.filter(d=>d!==e.id).map(d=>{const p=i.conduits.find(m=>m.id===d);return p?S(p,n):"?"}).join(", ")}`:`${u.kind} (${n(`box.wire.${u.wire}`)})`).join(" \xB7 ")}
          </dd>`:c}
    ${l(n("el.d.notes"),e.notes)}
  </dl>`}function Jt(i,e){const{t}=e,s=ae(e.boxes),n=qt(i,s),o=i.conduits.filter(l=>!l.side),a=i.conduits.find(l=>l.id===e.selectedConduitId);return r`<div class="bx">
    <div class="bx-head">
      <div>
        <b>${i.name}</b>${i.location?r` <span class="muted">· ${i.location}</span>`:c}
        ${i.alert?r`<div class="alert-text"><span class="amark-chip">!</span> ${i.alert}</div>`:c}
      </div>
      ${e.editing?c:r`<button class="icon-btn" aria-label=${t("el.d.close")} @click=${()=>e.onSelectBox(null)}>✕</button>`}
    </div>
    <div class="chips">
      ${[...n].map(([l,u])=>r`<button class="chip" @click=${()=>e.onSelectModule(l)}>
          <span class="c" style=${`background:${u}`}></span>${qe(l,e.index,t)}
        </button>`)}
    </div>
    ${Os(i,n,s,e)}
    ${o.length?r`<div class="bx-unplaced">
          <span class="muted small">${t("box.unplaced")}</span>
          ${o.map(l=>Ps(i,l,n,s,e))}
        </div>`:c}
    ${e.editing?c:Bs(i,n,e)}
    ${i.notes?r`<div class="muted small">${i.notes}</div>`:c}
    ${a&&!e.editing?zs(i,a,s,e):c}
  </div>`}function Fs(i,e){return i.conduits.filter(t=>!t.side||!O(t,e).length&&t.end!=="spare"||t.end==="unknown"&&!t.end_box_id&&!t.label).length}function Qt(i){const{t:e,boxes:t}=i;if(!t.length)return c;const s=t.find(o=>o.id===i.selectedBoxId),n=ae(t);return r`<section class="board-section bx-section" aria-label=${e("box.title")}>
    <h3 class="board-title">${e("box.title")}</h3>
    <div class="bx-tiles">
      ${t.map(o=>{const a=Fs(o,n),l=qt(o,n);return r`<button class=${o.id===i.selectedBoxId?"bx-tile sel":"bx-tile"} @click=${()=>i.onSelectBox(o.id===i.selectedBoxId?null:o.id)}>
          <span class="bx-tile-n">${o.name}${o.alert||o.conduits.some(u=>u.point?.alert)?r` <span class="amark-chip">!</span>`:c}</span>
          <span class="muted small">${o.location??""}</span>
          <span class="bx-tile-c">${[...l.values()].map(u=>r`<span class="c" style=${`background:${u}`}></span>`)}
            <span class="small">${e("box.n_conduits",{n:o.conduits.length})}</span>
            ${a?r`<span class="small warn-t">· ${e("box.to_complete",{n:a})}</span>`:c}</span
          >
        </button>`})}
    </div>
    ${s?Jt(s,i):c}
  </section>`}function Ve(i,e){const{t}=e;return r`<li>
    <button class="ent bx-node" @click=${()=>e.onSelectBox(i.box.id)}>▣ ${i.box.name}</button>
    ${i.box.location?r`<span class="muted small"> · ${i.box.location}</span>`:c}
    ${i.points.length||i.unknown.length||i.children.length?r`<ul>
          ${i.points.map(s=>r`<li>
              <button class="ent" @click=${()=>e.onSelectBox(i.box.id,s.id)}>${Ue(s.point.kind)} ${He(s.point,t)}</button>
              ${s.point.alert?r`<span class="amark-chip">!</span>`:c}
            </li>`)}
          ${i.children.map(s=>Ve(s,e))}
          ${i.unknown.map(s=>r`<li class="muted"><button class="ent" @click=${()=>e.onSelectBox(i.box.id,s.id)}>${S(s,t)}</button> → ?</li>`)}
        </ul>`:c}
  </li>`}function Ls(i,e){const t=Ss(e.boxes,i);return!t.roots.length&&!t.loose.length?c:r`<dt>${e.t("box.path")}</dt>
    <dd>
      <ul class="bx-tree">
        ${t.roots.map(s=>Ve(s,e))}
      </ul>
      ${t.loose.length?r`<div class="muted small">${e.t("box.loose")}</div>
            <ul class="bx-tree">
              ${t.loose.map(s=>Ve(s,e))}
            </ul>`:c}
    </dd>`}function Yt(i){return Math.max(1,i.width_modules||1)}function Zt(i){return i!==null?"grid-auto-columns:minmax(var(--him-slot-min),1fr)":"grid-auto-columns:minmax(var(--him-slot-min),var(--him-slot))"}function Us(i,e,t={}){const s=["m"];return i.kind==="rcd"&&s.push("d"),i.kind==="rcbo"&&s.push("d"),i.kind==="device"&&s.push("s"),i.kind==="spacer"&&s.push("sp"),Pt(i)&&s.push("u"),i.status==="spare"?s.push("spare"):t.off&&s.push("off"),i.fed_by&&s.push("fx"),i.alert&&s.push(i.alert_level==="info"?"al al-info":"al"),t.link&&s.push(t.link),e&&s.push("sel"),s.join(" ")}function Hs(i,e){switch(i.kind){case"rcd":return`${i.sensitivity_ma?e("el.sensitivity",{ma:i.sensitivity_ma}):"? mA"} \xB7 ${i.rcd_type&&i.rcd_type!=="?"?e("el.type",{t:i.rcd_type}):e("el.unknown_type")}`;case"breaker":case"rcbo":return i.circuit_name||"?";case"device":return j(i)===i.label?i.notes?.split(`
`)[0]??"":i.label;default:return""}}function Xt(i,e){const t=se(e.hass,i.power_entity_id),s=!!i.power_entity_id,n=j(i),o=Hs(i,e.t),a=i.status!=="spare"&&$e(i,e.hass),l=i.status==="spare"?e.t("el.tag.spare"):a?e.t("el.tag.off"):"",u=i.fed_by&&e.feeder?e.t("el.fx",{ref:e.feeder.ref||j(e.feeder)}):"",d=i.alert?e.t("el.alert",{text:i.alert.replace(/\n/g," \xB7 ")}):"",p=[e.t("el.module_aria",{kind:e.t(`el.kind.${i.kind}`),ref:i.ref,title:n,name:o}),l,u,d].filter(Boolean).join(" \xB7 ");return r`<button
    class=${Us(i,e.selected,{off:a,link:e.link??null})}
    style=${`grid-column:span ${Yt(i)}`}
    data-module-id=${i.id}
    data-kind=${i.kind}
    aria-label=${p}
    aria-pressed=${e.selected?"true":"false"}
    title=${[i.ref,o,l,u,d].filter(Boolean).join(" \xB7 ")}
    @click=${e.onClick}
  >
    ${u?r`<span class="fxmark" aria-hidden="true">↱</span>`:c}
    ${s?r`<span class=${`led${t!==null&&t>0?" on":""}`}></span>`:c}
    <b>${n}</b><small>${o}</small>
    ${l?r`<span class=${i.status==="spare"?"tag spare":"tag off"}>${l}</span>`:c}
    ${s?r`<span class="w" title=${ve(t,e.lang)}>${Rt(t,e.lang)}</span>`:c}
    ${i.alert?r`<span class="amark" aria-hidden="true">!</span>`:e.warned?r`<span class="wmark" aria-hidden="true"></span>`:c}
  </button>`}function ei(i,e){const t=e?i.modules.get(e):void 0;return t?{index:i,up:new Set(i.chain(t).map(s=>s.id)),down:i.downstream(t.id)}:{index:i,up:new Set,down:new Set}}function ti(i,e){return i?i.up.has(e)?"up":i.down.has(e)?"down":null:null}function ii(i,e){return e(`check.${i.code}`,i.params)}function qs(i,e,t){if(i===null)return r`<span class="muted small">…</span>`;const{line:s,area:n}=yt(i,e[0],e[1]);return s?r`<svg class="spark" viewBox="0 0 200 42" preserveAspectRatio="none" role="img" aria-label=${t("el.d.history")}>
    ${A`<path d=${n} fill="var(--him-accent)" opacity=".15"></path>
    <path d=${s} fill="none" stroke="var(--him-accent)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
  </svg>`:r`<span class="muted small">${t("el.d.no_history")}</span>`}function si(i,e){if(i.kind==="main_breaker")return e("el.d.head_only",{ref:i.ref||e("el.kind.main_breaker"),ma:i.sensitivity_ma??"?"});const t=[i.rating_a?`${i.rating_a} A`:"? A",i.sensitivity_ma?`${i.sensitivity_ma} mA`:"? mA"];return t.push(i.rcd_type&&i.rcd_type!=="?"?e("el.type",{t:i.rcd_type}):e("el.unknown_type")),`${i.ref} \xB7 ${t.join(" ")}`}function Ws(i,e){if(i.status==="spare")return c;if(jt.includes(i.circuit_kind))return r`<dt>${e("norm.title")}</dt><dd class="norm">${e(`norm.${i.circuit_kind}`)}</dd>`;const t=i.circuit_kind==="unknown"?Tt(i.rating_a):null;return t?r`<dt>${e("norm.title")}</dt>
    <dd class="norm"><span class="muted">${e("norm.guess",{kind:e(`ck.kind.${t}`).toLowerCase()})} :</span> ${e(`norm.${t}`)}</dd>`:c}function Ge(i,e,t,s){const n=i.ref||`${e(`el.kind.${i.kind}`)} ${j(i)}`,o=t.boardOf.get(i.id);return o&&s&&o.id!==s.id?`${n} (${o.name})`:n}function Vs(i,e){return i.circuit_kind==="lighting"?e.light||null:i.circuit_kind==="sockets"&&(e.socket??0)+(e.outlet??0)||null}function Gs(i,e,t){const{t:s}=t,n=s(`el.kind.${i.kind}`);let o=n;i.kind==="breaker"||i.kind==="rcbo"?(o+=` ${j(i)}`,i.cable_mm2&&(o+=`, ${s("el.d.cable",{s:String(i.cable_mm2).replace(".",t.lang==="fr"?",":".")})}`)):i.kind==="rcd"?o=`${n} ${si(i,s).split(" \xB7 ")[1]}`:i.kind==="main_breaker"&&(o=`${n} ${j(i)}${i.sensitivity_ma?` \xB7 ${i.sensitivity_ma} mA`:""}`);const a=t.index??new ge(t.payload.model.boards),l=t.board??a.boardOf.get(i.id)??null,u=a.feeder(i),d=a.chain(i),p=a.fed(i.id).filter(w=>w.kind!=="spacer"),m=i.kind==="breaker"||i.kind==="device"?a.protector(i):null,b=i.status==="spare"?"spare":$e(i,t.hass)?"off":null,f=w=>a.boardOf.get(w.id)?.id===l?.id,$=w=>f(w)?r`<button class="ent" @click=${()=>t.onSelectModule(w.id)}>${Ge(w,s,a,l)}</button>`:r`<span>${Ge(w,s,a,l)}</span>`,g=xs(t.payload.checks,i.id).filter(w=>w.code!=="manual"),h=se(t.hass,i.power_entity_id),_=i.kind==="breaker"||i.kind==="rcbo",y=t.boxes?Is(t.boxes.boxes,i.id):{},E=Object.entries(y).map(([w,Z])=>`${Z} ${s(`box.point_n.${w}`)}`).join(" \xB7 "),B=i.points_count??Vs(i,y);return r`<dl class="detail" aria-live="polite">
    <dt>${s("el.d.ref")}</dt>
    <dd>
      <b>${i.ref||"\u2014"}</b> · ${o}
      <button class="icon-btn" style="float:right;width:24px;height:24px" aria-label=${s("el.d.close")} @click=${()=>t.onSelectModule(null)}>✕</button>
    </dd>
    ${i.alert?r`<dt>${s("el.d.alert")}</dt><dd class=${i.alert_level==="info"?"alert-text info":"alert-text"}>${i.alert}</dd>`:c}
    ${i.model?r`<dt>${s("el.d.model")}</dt><dd>${i.model}</dd>`:c}
    ${b?r`<dt>${s("el.d.status")}</dt><dd><span class=${`tag inline ${b}`}>${s(`el.status.${b}`)}</span></dd>`:c}
    ${i.kind==="meter"&&i.subscribed_kva?r`<dt>${s("el.d.kva")}</dt><dd>${String(i.subscribed_kva).replace(".",t.lang==="fr"?",":".")} kVA</dd>`:c}
    ${u?r`<dt>${s("el.d.fed_by")}</dt>
          <dd>
            ${d.map((w,Z)=>r`${Z?r`<span class="muted"> ← </span>`:c}${$(w)}`)}
            ${i.fed_by?r`<span class="muted"> · ${s("el.d.fed_manual")}</span>`:c}
          </dd>`:c}
    ${_?r`<dt>${s("el.d.circuit")}</dt>
          <dd>
            ${i.circuit_name||"?"}
            ${i.circuit_kind!=="unknown"?r`<span class="muted"> · ${s(`ck.kind.${i.circuit_kind}`)}</span>`:c}
          </dd>`:c}
    ${_&&(B||E)?r`<dt>${s("el.d.points")}</dt>
          <dd>
            ${B&&Dt(i)!==null?s("el.d.points_max",{n:B,max:Dt(i)}):B||""}
            ${E?r`<span class="muted">${B?" \xB7 ":""}${s("box.counted",{list:E})}</span>`:c}
          </dd>`:c}
    ${_&&t.boxes?Ls(i.id,t.boxes):c}
    ${_?Ws(i,s):c}
    ${i.area_ids.length?r`<dt>${s("el.d.areas")}</dt><dd>${Oe(t.hass,i.area_ids).join(" \xB7 ")}</dd>`:c}
    ${i.kind==="breaker"?r`<dt>${s("el.d.protected_by")}</dt><dd>${m?si(m,s):r`<span class="muted">${s("el.d.no_rcd")}</span>`}</dd>`:c}
    ${p.length?r`<dt>${s("el.d.feeds")}</dt>
          <dd>${p.map((w,Z)=>r`${Z?", ":c}${$(w)}`)}</dd>`:c}
    ${i.power_entity_id?r`<dt>${s("el.d.measure")}</dt>
          <dd>
            <span class="num">${ve(h,t.lang)}</span> ·
            <button class="ent" @click=${()=>t.onMoreInfo(i.power_entity_id)}>${i.power_entity_id}</button>
          </dd>
          <dt>${s("el.d.history")}</dt>
          <dd>${qs(t.history,t.historyRange,s)}</dd>`:c}
    ${i.energy_entity_id?r`<dt>${s("el.d.energy")}</dt>
          <dd><button class="ent" @click=${()=>t.onMoreInfo(i.energy_entity_id)}>${i.energy_entity_id}</button></dd>`:c}
    ${i.entity_ids.length?r`<dt>${s("el.d.entities")}</dt>
          <dd>${i.entity_ids.map(w=>r`<button class="ent" @click=${()=>t.onMoreInfo(w)}>${w}</button> `)}</dd>`:c}
    ${i.notes?r`<dt>${s("el.d.notes")}</dt><dd style="white-space:pre-line">${i.notes}</dd>`:c}
    ${g.length?r`<dt>${s("el.d.warnings")}</dt>
          <dd><ul class="warnlist">${g.map(w=>r`<li class=${w.severity}>${ii(w,s)}</li>`)}</ul></dd>`:c}
  </dl>`}function ni(i){return Array.from({length:Math.max(0,i)},()=>r`<div class="m free" aria-hidden="true"></div>`)}function we(i,e){const t=i?ys(i,e):null,s=ks(e);return{used:s,capacity:t,over:t!==null&&s>t}}function Ks(i,e){const t=new Set(e.payload.checks.filter(a=>a.severity==="warning").map(a=>a.module_id)),s=we(e.board??null,i),n=e.t("el.row",{label:i.label}),o=s.capacity!==null?e.t("el.slots",{used:s.used,capacity:s.capacity}):"";return r`<div
    class=${s.over?"rail over":"rail"}
    style=${Zt(s.capacity)}
    role="group"
    aria-label=${o?`${n} \xB7 ${o}`:n}
    title=${o}
    data-row-id=${i.id}
  >
    <span class="rl">${i.label}</span>
    ${i.modules.map(a=>Xt(a,{hass:e.hass,t:e.t,lang:e.lang,selected:a.id===e.selectedModuleId,warned:t.has(a.id),link:ti(e.links,a.id),feeder:a.fed_by?e.links?.index.feeder(a):null,onClick:()=>e.onSelectModule(a.id===e.selectedModuleId?null:a.id)}))}
    ${s.capacity!==null?ni(s.capacity-s.used):c}
  </div>`}function Js(i,e){return i===null||!e?null:Math.round(i/(230*e)*100)}function oi(i,e){const t=i.supply??[];if(!t.length&&!e.extra)return c;const{t:s}=e,n=t.map(a=>se(e.hass,a.power_entity_id)).find(a=>a!==null)??null??Nt(e.hass,Et(i)),o=e.links?e.links.index.fed(t[t.length-1]?.id??"").length:0;return r`<div class="supply" role="group" aria-label=${s("el.supply")}>
    <span class="rl">${s("el.supply")}</span>
    ${t.map((a,l)=>{const u=se(e.hass,a.power_entity_id),d=a.kind==="main_breaker"?Js(n,a.rating_a):null,p=a.id===e.selectedModuleId,m=a.kind==="main_breaker"?[a.sensitivity_ma?`${a.sensitivity_ma} mA`:"",a.model&&a.model!==s(`el.kind.${a.kind}`)?a.model:""].filter(Boolean).join(" \xB7 "):a.model??"",b=["sup",a.kind,p?"sel":"",ti(e.links,a.id)??"",a.status==="spare"?"spare":$e(a,e.hass)?"off":"",a.alert?a.alert_level==="info"?"al al-info":"al":""].filter(Boolean).join(" ");return r`${l?r`<span class="arrow" aria-hidden="true">→</span>`:c}
        <button
          class=${b}
          data-module-id=${a.id}
          aria-pressed=${p?"true":"false"}
          aria-label=${`${s(`el.kind.${a.kind}`)} ${j(a)} ${m}`}
          @click=${()=>e.onSelectModule(p?null:a.id)}
        >
          <ha-icon icon=${a.kind==="meter"?"mdi:meter-electric-outline":"mdi:electric-switch"}></ha-icon>
          <span class="txt">
            <small>${s(`el.kind.${a.kind}`)}</small>
            <b>${j(a)}</b>
            ${m?r`<small>${m}</small>`:c}
          </span>
          ${u!==null?r`<span class="w">${Rt(u,e.lang)}</span>`:c}
          ${a.alert?r`<span class="amark" title=${a.alert}>!</span>`:c}
          ${d!==null?r`<span class="load" title=${s("el.load",{p:d,a:a.rating_a??"?"})}>
                <span class="bar"><span style=${`width:${Math.min(100,Math.max(0,d))}%`} class=${d>=80?"hot":""}></span></span>
                <span class="num">${d} %</span>
              </span>`:c}
        </button>`})}
    ${t.length&&o?r`<span class="arrow" aria-hidden="true">→</span><span class="muted small">${s("el.feeds_n",{n:o})}</span>`:c}
    ${e.extra??c}
  </div>`}function Qs(i){const{t:e,payload:t}=i,s=t.model.boards,n=new ge(s),o=Ys(i,n);if(i.stacked&&s.length>1)return r`${s.map(l=>r`<section class="board-section" aria-label=${l.name}>
          <h3 class="board-title">${[l.name,l.location].filter(Boolean).join(" \xB7 ")}</h3>
          ${ai(l,i,n,o)}
        </section>`)}
      ${o?Qt(o):c}`;const a=i.board;return a?r`
    ${s.length>1?r`<div class="seg" role="tablist" aria-label=${e("el.board")}>
          ${s.map(l=>r`<button role="tab" aria-selected=${l.id===a.id?"true":"false"} @click=${()=>i.onSelectBoard(l.id)}>
              ${l.name}
            </button>`)}
        </div>`:c}
    ${ai(a,i,n,o)}
    ${o?Qt(o):c}
  `:r`<div class="empty">${e("el.no_board")}</div>`}function Ys(i,e){const t=i.payload.model.boxes??[];if(t.length)return{hass:i.hass,t:i.t,boxes:t,index:e,selectedBoxId:i.selectedBoxId??null,selectedConduitId:i.selectedConduitId??null,onSelectBox:i.onSelectBox??(()=>{}),onSelectModule:i.onSelectModule,onMoreInfo:i.onMoreInfo}}function ai(i,e,t,s){const{t:n,payload:o}=e,a=vs(i,e.hass),l=Nt(e.hass,Et(i)),u=o.checks.filter(_=>_.board_id===i.id&&(_.severity==="warning"||_.code==="manual"));u.sort((_,y)=>+(y.code==="manual")-+(_.code==="manual"));const d=u.filter(_=>_.code==="manual").length,p=u.length-d,m=e.showWarnings===!0||e.showWarnings instanceof Set&&e.showWarnings.has(i.id),b=()=>e.onToggleWarnings(i.id);let f=null;const $=(i.supply??[]).find(_=>_.id===e.selectedModuleId);$&&(f={module:$,row:null});for(const _ of i.rows){const y=_.modules.find(E=>E.id===e.selectedModuleId);y&&(f={module:y,row:_})}const g=ei(t,e.selectedModuleId),h=i.fed_by?t.modules.get(i.fed_by)??null:null;return r`
    <div class="chips">
      <span class="chip"><span class="dot"></span>${n("el.rcd_count",{n:a.rcds})}</span>
      ${a.unidentified?r`<span class="chip"><span class="dot warn"></span>${n("el.to_identify",{n:a.unidentified})}</span>`:r`<span class="chip"><span class="dot"></span>${n("el.all_identified")}</span>`}
      ${a.off?r`<span class="chip"><span class="dot bad"></span>${n("el.off_count",{n:a.off})}</span>`:c}
      ${a.spare?r`<span class="chip"><span class="dot off"></span>${n("el.spare_count",{n:a.spare})}</span>`:c}
      ${h?r`<span class="chip">${n("el.board_fed_by",{ref:Ge(h,n,t,i)})}</span>`:c}
      ${l!==null?r`<span class="chip num">${n("el.now",{w:ve(l,e.lang)})}</span>`:c}
      ${d?r`<button class="chip warn" aria-expanded=${m?"true":"false"} @click=${b}>
            <span class="amark-chip">!</span>${n("el.alerts",{n:d})}
          </button>`:c}
      ${p?r`<button class="chip warn" aria-expanded=${m?"true":"false"} @click=${b}>
            <span class="dot warn"></span>${n("el.warnings",{n:p})}
          </button>`:c}
      ${i.photo_path?r`<button class="chip" @click=${()=>e.onOpenPhoto(i.id)}><ha-icon icon="mdi:image" style="--mdc-icon-size:16px"></ha-icon>${n("el.photo")}</button>`:c}
    </div>
    ${m&&u.length?r`<div class="form">
          <ul class="warnlist">
            ${u.map(_=>r`<li class=${_.code==="manual"?`${_.severity} manual`:"warning"}>
                <button class="ent" @click=${()=>e.onSelectModule(_.module_id)}>${_.ref}</button> · ${ii(_,n)}
              </li>`)}
          </ul>
          <span class="muted small">${n("check.disclaimer")}</span>
        </div>`:c}
    <div class=${g.up.size||g.down.size?"board linking":"board"}>
      ${oi(i,{...e,links:g})}
      ${i.rows.map(_=>Ks(_,{...e,board:i,links:g}))}
    </div>
    ${f?Gs(f.module,f.row,{...e,index:t,board:i,boxes:s}):c}
  `}const Zs=["breaker","rcd","rcbo","device","spacer"],Xs=[2,6,10,16,20,25,32,40,50,63],en=[25,40,63,80,100],tn=[10,30,100,300,500],sn=["AC","A","F","B","?"],nn=["B","C","D","?"],on=[1.5,2.5,4,6,10,16],an=[15,30,45,60,90],rn=[300,500,650],ln=["active","off","spare"],dn=["lighting","sockets","dedicated","cooking","water_heater","heating","feeder","other","unknown"];function ye(i){for(const e of i.rows)for(const t of e.modules){const s=/^([A-Za-z]+\d+)-/.exec(t.ref);if(s)return s[1]}return""}const Ke=class extends P{constructor(){super(),this._drag=null,this._initialised=!1,this._boards=[],this._selected=null,this._dirty=!1,this._busy=null,this._error=null,this._dragOver=null,this.boardId=null}connectedCallback(){super.connectedCallback(),De().then(()=>this.requestUpdate())}willUpdate(){!this._initialised&&this.payload&&(this._initialised=!0,this._boards=xe(this.payload.model.boards),this._boards.length||this._addBoard(!1),(!this.boardId||!this._boards.some(e=>e.id===this.boardId))&&(this.boardId=this._boards[0]?.id??null))}get _t(){return U((this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en")}get _lang(){return(this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en"}get _board(){return this._boards.find(e=>e.id===this.boardId)}_touch(){this._boards=[...this._boards],this._dirty=!0}_locate(e){for(const t of this._boards){const s=t.supply??=[],n=s.findIndex(o=>o.id===e);if(n>=0)return{list:s,row:null,index:n};for(const o of t.rows){const a=o.modules.findIndex(l=>l.id===e);if(a>=0)return{list:o.modules,row:o,index:a}}}return null}_patch(e,t){const s=this._locate(e);s&&(s.list[s.index]={...s.list[s.index],...t},this._touch())}_addSupply(e){const t=this._board,s=ye(t)||`T${this._boards.indexOf(t)+1}`,n=ne(e,`${s}-${e==="meter"?"CPT":"AGCP"}`),o=t.supply??=[];e==="meter"?o.unshift(n):o.push(n),this._selected=n.id,this._touch()}_addBoard(e=!0){const t=this._boards.length+1,s={id:N(),name:`Tableau ${t}`,location:null,area_id:null,photo_path:null,rows:[]};s.rows.push({id:N(),label:"R1",modules:[ne("rcd",`T${t}-R1-ID`)]}),this._boards=[...this._boards,s],this.boardId=s.id,e&&this._touch()}_addRow(){const e=this._board;if(!e)return;const t=`R${e.rows.length+1}`,s=ye(e)||`T${this._boards.indexOf(e)+1}`;e.rows.push({id:N(),label:t,modules:[ne("rcd",`${s}-${t}-ID`)]}),this._touch()}_addSpacer(e){const t=this._board,s=ye(t)||`T${this._boards.indexOf(t)+1}`,n=e.modules.filter(a=>a.kind==="spacer").length+1,o=ne("spacer",`${s}-${e.label}-V${n}`);e.modules.push(o),this._selected=o.id,this._touch()}_addModule(e){const t=this._board,s=ye(t)||`T${this._boards.indexOf(t)+1}`,n=e.modules.filter(a=>a.kind==="breaker"||a.kind==="rcbo").length+1,o=ne("breaker",`${s}-${e.label}-${n}`);e.modules.push(o),this._selected=o.id,this._touch()}_delete(e){const t=this._locate(e);if(!t)return;const s=t.list[t.index];window.confirm(this._t("edit.confirm_delete",{name:s.ref||s.circuit_name||s.label}))&&(t.list.splice(t.index,1),this._selected=null,this._touch())}_deleteRow(e){const t=this._board;window.confirm(this._t("edit.confirm_delete",{name:e.label}))&&(t.rows=t.rows.filter(s=>s.id!==e.id),this._touch())}_deleteBoard(){const e=this._board;window.confirm(this._t("edit.confirm_delete",{name:e.name}))&&(this._boards=this._boards.filter(t=>t.id!==e.id),this.boardId=this._boards[0]?.id??null,this._dirty=!0)}_move(e,t){const s=this._locate(e);s?.row&&(s.row.modules=ws(s.row.modules,s.index,s.index+t),this._touch(),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-module-id="${e}"]`)?.focus()))}moveTo(e,t,s){const n=this._locate(e);if(!n?.row||e===s)return;const[o]=n.list.splice(n.index,1),a=s?t.modules.findIndex(l=>l.id===s):-1;a<0?t.modules.push(o):t.modules.splice(a,0,o),this._touch()}async _upload(e){const t=e.target,s=t.files?.[0],n=this._board;if(!(!s||!n||!this.hass)){this._busy=this._t("ee.photo_uploading");try{n.photo_path=await Yi(this.hass,n.id,s),this._touch()}catch(o){this._error=this._t("edit.failed",{error:M(o)})}finally{this._busy=null,t.value=""}}}async _save(){if(!(!this.hass||!this.payload)){this._busy="\u2026",this._error=null;try{await Ee(this.hass,"boards",this._boards,this.payload.section_revisions.boards),this._dirty=!1,C(this,"him-saved",{boardId:this.boardId})}catch(e){const t=D(e);t==="conflict"?C(this,"him-conflict"):t==="unauthorized"?this._error=this._t("edit.refused"):this._error=this._t("edit.failed",{error:M(e)})}finally{this._busy=null}}}_cancel(){this._dirty&&!window.confirm(this._t("edit.unsaved")+" \u2014 "+this._t("edit.cancel")+" ?")||C(this,"him-cancel")}render(){const e=this._t,t=this._board,s=this._selected?this._locate(this._selected):null,n=new ge(this._boards),o=ei(n,this._selected),a=t?.supply??[];return r`
      <div class="toolbar">
        ${this._boards.length>1?x("ee-board",e("el.board"),this.boardId,this._boards.map(l=>({value:l.id,label:l.name})),l=>{this.boardId=l,this._selected=null}):c}
        <span style="flex:1"></span>
        ${this._dirty?r`<span class="badge warn">${e("edit.unsaved")}</span>`:c}
        <button class="btn" @click=${this._cancel}>${e("edit.cancel")}</button>
        <button class="btn pri" ?disabled=${!!this._busy||!this._dirty} @click=${this._save}>${e("edit.save")}</button>
      </div>
      ${this._error?r`<div class="banner" role="alert">${this._error}</div>`:c}
      ${this._busy&&this._busy!=="\u2026"?r`<div class="banner info">${this._busy}</div>`:c}
      ${t?r`<div class="ed">
            <div style="display:flex;flex-direction:column;gap:8px;min-width:0">
              <div class="grid2">
                ${v("ee-bname",e("ee.board_name"),t.name,l=>{t.name=l,this._touch()})}
                ${v("ee-bloc",e("ee.board_location"),t.location,l=>{t.location=l||null,this._touch()})}
              </div>
              ${v("ee-bslots",e("ee.board_slots"),t.modules_per_row??"",l=>{const u=Math.round(Number(l));t.modules_per_row=l.trim()&&u>0?Math.min(96,u):null,this._touch()},{type:"number"})}
              ${this.hass?Be(this.hass,"ee-barea",e("ee.board_area"),t.area_id,!1,l=>{t.area_id=l[0]??null,this._touch()}):c}
              ${this._boards.length>1?x("ee-bfed",e("ee.board_fed_by"),t.fed_by??"",[{value:"",label:"\u2014"},...[...n.modules.values()].filter(l=>n.boardOf.get(l.id)?.id!==t.id&&l.kind!=="spacer").map(l=>({value:l.id,label:this._optionLabel(l,n,t)}))],l=>{t.fed_by=l||null,this._touch()}):c}
              <span class="muted small">${e("ee.select_hint")}</span>
              <div class=${o.up.size||o.down.size?"board linking":"board"}>
                ${oi(t,{hass:this.hass,t:e,lang:this._lang,selectedModuleId:this._selected,links:o,onSelectModule:l=>this._selected=l,extra:r`${a.some(l=>l.kind==="meter")?c:r`<button class="btn" @click=${()=>this._addSupply("meter")}>${e("ee.add_meter")}</button>`}
                  ${a.some(l=>l.kind==="main_breaker")?c:r`<button class="btn" @click=${()=>this._addSupply("main_breaker")}>${e("ee.add_main_breaker")}</button>`}`})}
                ${t.rows.map(l=>this._renderRail(l,o))}
              </div>
              <div class="btns">
                <button class="btn" @click=${this._addRow}>${e("ee.add_row")}</button>
                <button class="btn" @click=${()=>this._addBoard()}>${e("ee.add_board")}</button>
                <label class="btn" style="display:inline-flex;align-items:center">
                  ${e("ee.photo_upload")}
                  <input type="file" accept="image/*" style="display:none" @change=${this._upload} />
                </label>
                ${t.photo_path?r`<button class="btn" @click=${()=>{t.photo_path=null,this._touch()}}>${e("ee.photo_remove")}</button>`:c}
                <button class="btn danger" @click=${this._deleteBoard}>${e("ee.delete_board")}</button>
              </div>
            </div>
            ${s?this._renderForm(s.list[s.index],s.row,n):r`<div class="form muted">${e("ee.select_hint")}</div>`}
          </div>`:c}
    `}_optionLabel(e,t,s){const n=this._t,o=t.boardOf.get(e.id),a=`${e.ref||"\u2014"} \xB7 ${n(`el.kind.${e.kind}`)} ${j(e)}`,l=(e.kind==="breaker"||e.kind==="rcbo")&&e.circuit_name&&e.circuit_name!=="?"?` \xB7 ${e.circuit_name}`:"";return`${a}${l}${o&&s&&o.id!==s.id?` (${o.name})`:""}`}_renderRail(e,t){const s=this._t;return r`<div
      class="rail"
      style=${Zt(we(this._board??null,e).capacity)}
      data-row-id=${e.id}
      @dragover=${n=>{this._drag&&n.preventDefault()}}
      @drop=${n=>{n.preventDefault(),this._drag&&!n.target.closest("[data-module-id]")&&this.moveTo(this._drag.moduleId,e,null),this._drag=null,this._dragOver=null}}
    >
      <span class="rl">${e.label}</span>
      ${e.modules.map(n=>r`<div
          draggable="true"
          style=${`grid-column:span ${Yt(n)}`}
          class=${this._dragOver===n.id?"cell drag-wrap":"cell"}
          @dragstart=${o=>{this._drag={moduleId:n.id},o.dataTransfer?.setData("text/plain",n.id)}}
          @dragend=${()=>{this._drag=null,this._dragOver=null}}
          @dragover=${o=>{this._drag&&(o.preventDefault(),this._dragOver=n.id)}}
          @drop=${o=>{o.preventDefault(),o.stopPropagation(),this._drag&&this.moveTo(this._drag.moduleId,e,n.id),this._drag=null,this._dragOver=null}}
        >
          ${Xt(n,{hass:this.hass,t:s,lang:this._lang,selected:n.id===this._selected||this._dragOver===n.id,warned:!1,link:t?.up.has(n.id)?"up":t?.down.has(n.id)?"down":null,feeder:n.fed_by?t?.index.feeder(n):null,onClick:()=>this._selected=n.id})}
        </div>`)}
      ${(()=>{const n=we(this._board??null,e);return n.capacity!==null?ni(n.capacity-n.used):c})()}
      <button class="add" aria-label=${s("ee.add_module",{label:e.label})} @click=${()=>this._addModule(e)}>+</button>
      <button class="add add-sp" aria-label=${s("ee.add_spacer",{label:e.label})} title=${s("ee.add_spacer",{label:e.label})} @click=${()=>this._addSpacer(e)}>▢</button>
    </div>
    ${(()=>{const n=we(this._board??null,e);return r`<div class=${n.over?"rail-meta over":"rail-meta"}>
        ${e.label} · ${n.capacity!==null?s("el.slots",{used:n.used,capacity:n.capacity}):s("el.slots_unknown",{used:n.used})}
      </div>`})()}`}_renderForm(e,t,s){const n=this._t,o=this.hass,a=h=>this._patch(e.id,h),l=h=>h===""||h==="?"?null:Number(h),u=e.kind==="breaker"||e.kind==="rcbo",d=e.kind==="rcd"||e.kind==="rcbo",p=this._board,m=s.defaultFeeder(e),b=r`${x("ee-fed",n("ee.f.fed_by"),e.fed_by??"",[{value:"",label:n("ee.f.fed_auto",{ref:m?m.ref||n(`el.kind.${m.kind}`):n("ee.f.fed_none")})},...s.candidates(e).map(h=>({value:h.id,label:this._optionLabel(h,s,p)}))],h=>a({fed_by:h||null}))}
      <span class="muted small">${n("ee.fed_hint")}</span>`,f=e.kind==="spacer"?c:x("ee-status",n("ee.f.status"),e.status??"active",ln.map(h=>({value:h,label:n(`el.status.${h}`)})),h=>a({status:h})),$=r`${v("ee-alert",n("ee.f.alert"),e.alert,h=>a({alert:h.trim()?h:null}),{suggestions:[1,2,3,4,5,6,7,8,9].map(h=>n(`ee.alert.s${h}`)),hint:r`<span class="muted small">${n("ee.alert_hint")}</span>`})}
      ${e.alert?x("ee-alert-level",n("ee.f.alert_level"),e.alert_level??"warning",["warning","info"].map(h=>({value:h,label:n(`ee.alert_level.${h}`)})),h=>a({alert_level:h})):c}`;if(!t)return this._renderSupplyForm(e,b,f,$);const g=t.modules.indexOf(e);return r`<div class="form" aria-label=${e.ref}>
      <b>${e.ref||"\u2014"}</b>
      ${x("ee-kind",n("ee.f.kind"),e.kind,Zs.map(h=>({value:h,label:n(`el.kind.${h}`)})),h=>a({kind:h,width_modules:h==="rcd"?Math.max(2,e.width_modules):e.width_modules}))}
      ${v("ee-ref",n("ee.f.ref"),e.ref,h=>a({ref:h}))}
      ${f}
      ${e.kind!=="spacer"?$:c}
      ${e.kind!=="spacer"?b:c}
      ${u?r`<div class="grid2">
            ${x("ee-rating",n("ee.f.rating"),e.rating_a??"?",[...Xs.map(h=>({value:h,label:`${h} A`})),{value:"?",label:"?"}],h=>a({rating_a:l(h)}))}
            ${x("ee-curve","\xA0",e.curve,nn.map(h=>({value:h,label:h})),h=>a({curve:h}))}
          </div>`:c}
      ${e.kind==="rcd"?x("ee-rcdr",n("ee.f.rcd_rating"),e.rating_a??"?",[...en.map(h=>({value:h,label:`${h} A`})),{value:"?",label:"?"}],h=>a({rating_a:l(h)})):c}
      ${d?r`<div class="grid2">
            ${x("ee-sens",n("ee.f.sensitivity"),e.sensitivity_ma??"?",[...tn.map(h=>({value:h,label:`${h} mA`})),{value:"?",label:"?"}],h=>a({sensitivity_ma:l(h)}))}
            ${x("ee-rcdt",n("ee.f.rcd_type"),e.rcd_type,sn.map(h=>({value:h,label:h})),h=>a({rcd_type:h}))}
          </div>`:c}
      ${u?r`
            ${v("ee-circ",n("ee.f.circuit"),e.circuit_name,h=>a({circuit_name:h}))}
            ${x("ee-ck",n("ee.f.circuit_kind"),e.circuit_kind,dn.map(h=>({value:h,label:n(`ck.kind.${h}`)})),h=>a({circuit_kind:h}))}
            ${(()=>{const h=e.circuit_kind==="unknown"?Tt(e.rating_a):null;return h?r`<div class="norm small">
                  ${n("norm.guess",{kind:n(`ck.kind.${h}`).toLowerCase()})}
                  <button class="btn" @click=${()=>a({circuit_kind:h})}>${n("ee.apply_guess")}</button>
                </div>`:jt.includes(e.circuit_kind)?r`<div class="norm small"><b>${n("norm.title")}</b> · ${n(`norm.${e.circuit_kind}`)}</div>`:c})()}
            ${v("ee-points",n("ee.f.points"),e.points_count??"",h=>{const _=Math.round(Number(h));a({points_count:h.trim()&&_>=0?Math.min(99,_):null})},{type:"number"})}
            ${Be(o,"ee-areas",n("ee.f.areas"),e.area_ids,!0,h=>a({area_ids:h}))}
            ${x("ee-cable",n("ee.f.cable"),e.cable_mm2??"",[{value:"",label:"?"},...on.map(h=>({value:h,label:`${String(h).replace(".",this._lang==="fr"?",":".")} mm\xB2`}))],h=>a({cable_mm2:h?Number(h):null}))}
          `:c}
      ${e.kind==="device"?r`${v("ee-label",n("ee.f.label"),e.label,h=>a({label:h}))}
          ${v("ee-ents",n("ee.f.entities"),e.entity_ids.join(", "),h=>a({entity_ids:h.split(",").map(_=>_.trim()).filter(_=>/^[a-z0-9_]+\.[a-z0-9_]+$/.test(_))}))}`:c}
      ${u||e.kind==="device"?r`${K(o,"ee-power",n("ee.f.power"),e.power_entity_id,"power",h=>a({power_entity_id:h}))}
          ${K(o,"ee-energy",n("ee.f.energy"),e.energy_entity_id,"energy",h=>a({energy_entity_id:h}))}
          ${K(o,"ee-switch",n("ee.f.switch"),e.switch_entity_id,null,h=>a({switch_entity_id:h}),["switch","light","input_boolean"])}`:c}
      ${e.kind!=="spacer"?v("ee-model",n("ee.f.model"),e.model,h=>a({model:h||null})):c}
      ${v("ee-width",n("ee.f.width"),e.width_modules,h=>a({width_modules:Math.max(1,Math.min(24,Number(h)||1))}),{type:"number"})}
      <div class="f">
        <label for="ee-notes">${n("ee.f.notes")}</label>
        <textarea class="inp" id="ee-notes" rows="3" .value=${e.notes??""} @input=${h=>a({notes:h.target.value||null})}></textarea>
      </div>
      <div class="btns">
        <button class="btn" ?disabled=${g<=0} @click=${()=>this._move(e.id,-1)}>${n("ee.move_left")}</button>
        <button class="btn" ?disabled=${g>=t.modules.length-1} @click=${()=>this._move(e.id,1)}>${n("ee.move_right")}</button>
        <button class="btn danger" @click=${()=>this._delete(e.id)}>${n("ee.delete")}</button>
      </div>
      <div class="btns">
        ${v("ee-row",n("ee.row_label"),t.label,h=>{t.label=h,this._touch()})}
        ${v("ee-rcap",n("ee.row_capacity"),t.capacity??"",h=>{const _=Math.round(Number(h));t.capacity=h.trim()&&_>0?Math.min(96,_):null,this._touch()},{type:"number"})}
        <button class="btn danger" @click=${()=>this._deleteRow(t)}>${n("ee.delete_row")}</button>
      </div>
    </div>`}_renderSupplyForm(e,t,s,n){const o=this._t,a=this.hass,l=d=>this._patch(e.id,d),u=d=>d===""||d==="?"?null:Number(d);return r`<div class="form" aria-label=${e.ref}>
      <b>${o(`el.kind.${e.kind}`)}</b>
      ${v("ee-ref",o("ee.f.ref"),e.ref,d=>l({ref:d}))}
      ${v("ee-model",o("ee.f.model"),e.model,d=>l({model:d||null}))}
      ${e.kind==="meter"?v("ee-kva",o("ee.f.kva"),e.subscribed_kva??"",d=>{const p=Number(d.replace(",","."));l({subscribed_kva:d.trim()&&p>0?p:null})},{type:"number"}):r`<div class="grid2">
            ${x("ee-hr",o("ee.f.head_rating"),e.rating_a??"?",[...an.map(d=>({value:d,label:`${d} A`})),{value:"?",label:"?"}],d=>l({rating_a:u(d)}))}
            ${x("ee-hs",o("ee.f.sensitivity"),e.sensitivity_ma??"?",[...rn.map(d=>({value:d,label:`${d} mA`})),{value:"?",label:"?"}],d=>l({sensitivity_ma:u(d)}))}
          </div>`}
      ${s}
      ${n}
      ${t}
      ${K(a,"ee-power",o("ee.f.power"),e.power_entity_id,"power",d=>l({power_entity_id:d}))}
      ${K(a,"ee-energy",o("ee.f.energy"),e.energy_entity_id,"energy",d=>l({energy_entity_id:d}))}
      <div class="f">
        <label for="ee-notes">${o("ee.f.notes")}</label>
        <textarea class="inp" id="ee-notes" rows="3" .value=${e.notes??""} @input=${d=>l({notes:d.target.value||null})}></textarea>
      </div>
      <div class="btns">
        <button class="btn danger" @click=${()=>this._delete(e.id)}>${o("ee.delete_supply")}</button>
      </div>
    </div>`}};Ke.styles=G,Ke.properties={hass:{attribute:!1},payload:{attribute:!1},boardId:{attribute:!1},_boards:{state:!0},_selected:{state:!0},_dirty:{state:!0},_busy:{state:!0},_error:{state:!0},_dragOver:{state:!0}};let cn=Ke;const ri=["top","bottom","left","right"],un=["unknown","board","box","point","spare"],pn=["socket","light","switch","device","outlet","other"],hn=["all","phase","neutral","earth","switched","traveler","other","unknown"],mn=["ICTA","IRL","Gaine annel\xE9e","C\xE2ble seul","Moulure"],bn=["3G1.5","3G2.5","3G6","2x1.5","4G1.5","5G1.5"],fn=["Wago 221-412","Wago 221-413","Wago 221-415","Wago 2273","Domino","Liaison"];function _n(i){return{id:N(),name:i,location:null,area_id:null,photo_path:null,notes:null,alert:null,alert_level:"warning",sides:{top:2,bottom:2,left:2,right:2},circuits:[],conduits:[],connectors:[]}}function $n(i,e){return{id:N(),side:i,position:e,label:null,kind:null,diameter_mm:null,circuits:[],cable:null,length_m:null,route:null,end:"unknown",end_box_id:null,end_conduit_id:null,point:null,notes:null}}function li(i,e,t){if(e===t)return;const s=i.connectors.filter(l=>l.wire==="all"),n=s.find(l=>l.conduits.includes(e)&&l.conduits.includes(t));if(n){n.conduits=n.conduits.filter(l=>l!==t),n.conduits.length<2&&(i.connectors=i.connectors.filter(l=>l!==n));return}const o=s.find(l=>l.conduits.includes(e)),a=s.find(l=>l.conduits.includes(t));o&&a?(o.conduits=[...o.conduits,...a.conduits.filter(l=>!o.conduits.includes(l))],i.connectors=i.connectors.filter(l=>l!==a)):o?o.conduits.push(t):a?a.conduits.push(e):i.connectors.push({id:N(),kind:"Liaison",poles:null,wire:"all",circuit:null,conduits:[e,t],notes:null})}const Je=class extends P{constructor(){super(),this._initialised=!1,this._boxes=[],this._boxId=null,this._conduitId=null,this._linkFrom=null,this._dirty=!1,this._busy=!1,this._error=null}connectedCallback(){super.connectedCallback(),De().then(()=>this.requestUpdate())}willUpdate(){!this._initialised&&this.payload&&(this._initialised=!0,this._boxes=xe(this.payload.model.boxes??[]),this._boxId=this._boxes[0]?.id??null)}get _t(){return U((this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en")}get _box(){return this._boxes.find(e=>e.id===this._boxId)}_touch(){this._boxes=[...this._boxes],this._dirty=!0}_addBox(){const e=_n(`${this._t("be.new_box")} ${this._boxes.length+1}`);this._boxes=[...this._boxes,e],this._boxId=e.id,this._conduitId=null,this._dirty=!0}_deleteBox(e){if(window.confirm(this._t("edit.confirm_delete",{name:e.name}))){this._boxes=this._boxes.filter(t=>t!==e);for(const t of this._boxes)for(const s of t.conduits)s.end_box_id===e.id&&Object.assign(s,{end:"unknown",end_box_id:null,end_conduit_id:null});this._boxId=this._boxes[0]?.id??null,this._conduitId=null,this._dirty=!0}}_addConduit(e,t){const s=this._box;if(!s)return;const n=$n(e,t);s.conduits.push(n),this._conduitId=n.id,this._linkFrom=null,this._touch()}_deleteConduit(e,t){e.conduits=e.conduits.filter(s=>s!==t);for(const s of e.connectors)s.conduits=s.conduits.filter(n=>n!==t.id);e.connectors=e.connectors.filter(s=>s.wire!=="all"||s.conduits.length>1);for(const s of this._boxes)for(const n of s.conduits)n.end_conduit_id===t.id&&(n.end_conduit_id=null);this._conduitId=null,this._touch()}_clickConduit(e,t){const s=this._box;if(!s||e!==s.id){e&&(this._boxId=e),this._conduitId=t??null;return}if(this._linkFrom&&t&&t!==this._linkFrom){li(s,this._linkFrom,t),this._linkFrom=null,this._conduitId=t,this._touch();return}this._linkFrom=null,this._conduitId=t??null}async _save(){if(!(!this.hass||!this.payload)){this._busy=!0,this._error=null;try{await Ee(this.hass,"boxes",this._boxes,this.payload.section_revisions.boxes??0),this._dirty=!1,C(this,"him-saved",{})}catch(e){const t=D(e);t==="conflict"?C(this,"him-conflict"):t==="unauthorized"?this._error=this._t("edit.refused"):this._error=this._t("edit.failed",{error:M(e)})}finally{this._busy=!1}}}_cancel(){this._dirty&&!window.confirm(this._t("edit.unsaved")+" \u2014 "+this._t("edit.cancel")+" ?")||C(this,"him-cancel")}_circuitOptions(){const e=[];for(const t of this.payload?.model.boards??[])for(const s of t.rows)for(const n of s.modules)(n.kind==="breaker"||n.kind==="rcbo"||n.kind==="device")&&e.push({value:n.id,label:`${n.ref||"?"} ${n.circuit_name&&n.circuit_name!=="?"?n.circuit_name:n.label||"?"}`});return e}_circuitsField(e,t,s,n){const o=this._circuitOptions();return r`<div class="f">
      <label for=${e}>${t}</label>
      <select
        class="sel"
        id=${e}
        multiple
        size=${Math.min(6,Math.max(3,o.length))}
        @change=${a=>n([...a.target.selectedOptions].map(l=>l.value))}
      >
        ${o.map(a=>r`<option value=${a.value} ?selected=${s.includes(a.value)}>${a.label}</option>`)}
      </select>
      <span class="muted small">${this._t("be.multi_hint")}</span>
    </div>`}render(){const e=this._t,t=this._box,s={hass:this.hass,t:e,boxes:this._boxes,index:new ge(this.payload?.model.boards??[]),selectedBoxId:this._boxId,selectedConduitId:this._conduitId,onSelectBox:(o,a)=>this._clickConduit(o,a),onSelectModule:()=>{},onMoreInfo:()=>{},onFreeSlot:(o,a)=>this._addConduit(o,a),linkFrom:this._linkFrom,editing:!0},n=t?.conduits.find(o=>o.id===this._conduitId);return r`
      <div class="toolbar">
        ${this._boxes.length?x("be-box",e("be.box"),this._boxId,this._boxes.map(o=>({value:o.id,label:o.name})),o=>{this._boxId=o,this._conduitId=null,this._linkFrom=null}):c}
        <button class="btn" @click=${this._addBox}>+ ${e("be.add_box")}</button>
        <span style="flex:1"></span>
        ${this._dirty?r`<span class="badge warn">${e("edit.unsaved")}</span>`:c}
        <button class="btn" @click=${this._cancel}>${e("edit.cancel")}</button>
        <button class="btn pri" ?disabled=${this._busy||!this._dirty} @click=${this._save}>${e("edit.save")}</button>
      </div>
      ${this._error?r`<div class="banner" role="alert">${this._error}</div>`:c}
      ${t?r`<div class="ed">
            <div style="display:flex;flex-direction:column;gap:8px;min-width:0">
              ${this._linkFrom?r`<div class="banner info">
                    ${e("be.link_pick",{pos:S(t.conduits.find(o=>o.id===this._linkFrom),e)})}
                    <button class="btn" @click=${()=>this._linkFrom=null}>${e("edit.cancel")}</button>
                  </div>`:r`<div class="muted small">${e("be.help")}</div>`}
              ${Jt(t,s)}
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <button class="btn" @click=${()=>this._addConduit(null,null)}>+ ${e("be.add_unplaced")}</button>
                <button
                  class="btn"
                  @click=${()=>{t.connectors.push({id:N(),kind:"Wago 221-413",poles:null,wire:"unknown",circuit:null,conduits:[],notes:null}),this._touch()}}
                >
                  + ${e("be.add_connector")}
                </button>
              </div>
              ${me(t.id,this._renderBoxForm(t))} ${me(t.id,this._renderConnectors(t))}
            </div>
            <div class="form">${n?me(n.id,this._renderConduitForm(t,n)):r`<span class="muted">${e("be.pick_conduit")}</span>`}</div>
          </div>`:r`<div class="empty">${e("be.none")}</div>`}
    `}_renderBoxForm(e){const t=this._t,s=n=>Math.max(0,Math.min(48,Math.round(Number(n))||0));return r`<details class="form" ?open=${!e.conduits.length}>
      <summary>${t("be.box_settings")}</summary>
      <div class="grid2">
        ${v("be-name",t("ee.board_name"),e.name,n=>{e.name=n||e.name,this._touch()})}
        ${v("be-loc",t("ee.board_location"),e.location,n=>{e.location=n||null,this._touch()})}
      </div>
      <div class="grid2">
        ${ri.map(n=>v(`be-side-${n}`,t("be.side_count",{side:t(`be.side.${n}`)}),e.sides[n]??0,o=>{e.sides={...e.sides,[n]:s(o)},this._touch()},{type:"number"}))}
      </div>
      ${this._circuitsField("be-circuits",t("be.box_circuits"),e.circuits,n=>{e.circuits=n,this._touch()})}
      ${v("be-alert",t("ee.f.alert"),e.alert,n=>{e.alert=n||null,this._touch()})}
      ${v("be-notes",t("ee.f.notes"),e.notes,n=>{e.notes=n||null,this._touch()})}
      <button class="btn danger" @click=${()=>this._deleteBox(e)}>${t("be.delete_box")}</button>
    </details>`}_renderConnectors(e){const t=this._t,s=e.connectors.filter(n=>n.wire!=="all");return s.length?r`<div class="form">
      <b>${t("box.connectors")}</b>
      ${s.map((n,o)=>this._renderConnector(e,n,o))}
    </div>`:c}_renderConnector(e,t,s){const n=this._t;return r`<div class="be-k">
      <div class="grid2">
        ${v(`be-k${s}-kind`,n("be.k_kind"),t.kind,o=>{t.kind=o,this._touch()},{suggestions:fn})}
        ${x(`be-k${s}-wire`,n("be.k_wire"),t.wire,hn.filter(o=>o!=="all").map(o=>({value:o,label:n(`box.wire.${o}`)})),o=>{t.wire=o,this._touch()})}
      </div>
      ${x(`be-k${s}-circuit`,n("box.circuits"),t.circuit,[{value:"",label:"?"},...this._circuitOptions()],o=>{t.circuit=o||null,this._touch()})}
      <div class="f">
        <span class="lbl">${n("be.k_members")}</span>
        <div style="display:flex;flex-wrap:wrap;gap:4px 10px">
          ${e.conduits.map(o=>r`<label class="small"
              ><input
                type="checkbox"
                .checked=${t.conduits.includes(o.id)}
                @change=${a=>{t.conduits=a.target.checked?[...t.conduits,o.id]:t.conduits.filter(l=>l!==o.id),this._touch()}}
              />
              ${S(o,n)}${o.label?` ${o.label}`:""}</label
            >`)}
        </div>
      </div>
      <button
        class="btn danger"
        @click=${()=>{e.connectors=e.connectors.filter(o=>o!==t),this._touch()}}
      >
        ${n("ee.delete")}
      </button>
    </div>`}_renderConduitForm(e,t){const s=this._t,n=e.connectors.filter(d=>d.wire==="all"&&d.conduits.includes(t.id)).flatMap(d=>d.conduits.filter(p=>p!==t.id)),o=this._boxes.filter(d=>d.id!==e.id),a=o.find(d=>d.id===t.end_box_id),l=t.point??{kind:"socket",label:"",room:null,count:1,entity_id:null,alert:null},u=d=>{t.point={...l,...d},this._touch()};return r`
      <b>${s("box.conduit")} ${S(t,s)}</b>
      <div class="grid2">
        ${x("be-c-side",s("be.side_label"),t.side??"",[{value:"",label:"?"},...ri.map(d=>({value:d,label:s(`be.side.${d}`)}))],d=>{t.side=d||null,t.side||(t.position=null),this._touch()})}
        ${v("be-c-pos",s("be.position"),t.position??"",d=>{const p=Math.round(Number(d));t.position=t.side&&d.trim()&&p>0?Math.min(48,p):null,this._touch()},{type:"number",placeholder:"?"})}
      </div>
      ${v("be-c-label",s("be.label"),t.label,d=>{t.label=d||null,this._touch()},{placeholder:s("be.label_ph")})}
      <div class="f">
        <span class="lbl">${s("be.joins")}</span>
        <div>
          ${n.length?n.map(d=>{const p=e.conduits.find(m=>m.id===d);return r`<span class="chip"
                  >${p?S(p,s):"?"}
                  <button
                    class="icon-btn"
                    style="width:20px;height:20px"
                    aria-label=${s("be.unjoin")}
                    @click=${()=>{li(e,t.id,d),this._touch()}}
                  >
                    ✕
                  </button></span
                >`}):r`<span class="muted small">${s("be.no_join")}</span>`}
          <button class="btn" @click=${()=>this._linkFrom=t.id}>${s("be.join")}</button>
        </div>
      </div>
      ${this._circuitsField("be-c-circuits",s("box.circuits"),t.circuits,d=>{t.circuits=d,this._touch()})}
      ${x("be-c-end",s("box.leads_to"),t.end,un.map(d=>({value:d,label:s(`be.end.${d}`)})),d=>{t.end=d,t.end!=="box"&&(t.end_box_id=t.end_conduit_id=null),t.end==="point"&&!t.point&&(t.point={...l}),t.end!=="point"&&(t.point=null),this._touch()})}
      ${t.end==="box"?r`<div class="grid2">
            ${x("be-c-tbox",s("be.box"),t.end_box_id??"",[{value:"",label:"\u2014"},...o.map(d=>({value:d.id,label:d.name}))],d=>{t.end_box_id=d||null,t.end_conduit_id=null,this._touch()})}
            ${a?x("be-c-tconduit",s("be.entry"),t.end_conduit_id??"",[{value:"",label:s("box.entry_unknown")},...a.conduits.map(d=>({value:d.id,label:`${S(d,s)}${d.label?` ${d.label}`:""}`}))],d=>{t.end_conduit_id=d||null,this._touch()}):c}
          </div>`:c}
      ${t.end==="point"?r`<div class="grid2">
              ${x("be-p-kind",s("be.point_kind"),l.kind,pn.map(d=>({value:d,label:s(`box.point.${d}`)})),d=>u({kind:d}))}
              ${v("be-p-count",s("be.count"),l.count,d=>u({count:Math.max(1,Math.min(50,Math.round(Number(d))||1))}),{type:"number"})}
              ${v("be-p-room",s("be.room"),l.room,d=>u({room:d||null}))}
              ${v("be-p-label",s("be.point_label"),l.label,d=>u({label:d}))}
            </div>
            ${this.hass?K(this.hass,"be-p-entity",s("be.entity"),l.entity_id,null,d=>u({entity_id:d})):c}
            ${v("be-p-alert",s("ee.f.alert"),l.alert,d=>u({alert:d||null}))}`:c}
      <details>
        <summary>${s("be.conduit_more")}</summary>
        <div class="grid2">
          ${v("be-c-kind",s("be.conduit_kind"),t.kind,d=>{t.kind=d||null,this._touch()},{suggestions:mn})}
          ${v("be-c-diam",s("be.diameter"),t.diameter_mm??"",d=>{const p=Math.round(Number(d));t.diameter_mm=d.trim()&&p>=3?Math.min(160,p):null,this._touch()},{type:"number"})}
          ${v("be-c-cable",s("box.cable"),t.cable,d=>{t.cable=d||null,this._touch()},{suggestions:bn})}
          ${v("be-c-len",s("be.length"),t.length_m??"",d=>{const p=Number(d.replace(",","."));t.length_m=d.trim()&&p>=0?Math.min(500,p):null,this._touch()},{type:"number"})}
        </div>
        ${v("be-c-route",s("box.route"),t.route,d=>{t.route=d||null,this._touch()})}
        ${v("be-c-notes",s("ee.f.notes"),t.notes,d=>{t.notes=d||null,this._touch()})}
      </details>
      <button class="btn danger" @click=${()=>this._deleteConduit(e,t)}>${s("be.delete_conduit")}</button>
    `}};Je.styles=G,Je.properties={hass:{attribute:!1},payload:{attribute:!1},_boxes:{state:!0},_boxId:{state:!0},_conduitId:{state:!0},_linkFrom:{state:!0},_dirty:{state:!0},_busy:{state:!0},_error:{state:!0}};let gn=Je;const vn=["router","switch","ap","server","nas","camera","iot","computer","phone","printer","other"];function xn(){return{id:N(),name:"",host:"",mac:null,vlan_id:null,switch_id:null,port:null,port_source:"auto",last_seen_port_at:null,area_id:null,parent_device_id:null,kind:"other",model:null,notes:null,monitor:{ping:!0,latency:!0,tcp_port:null,offline_alert_minutes:null}}}function wn(i,e){const t={...i};return e.vlan?.vlan_id&&(t.vlan_id=e.vlan.vlan_id),e.mac?.value&&(t.mac=e.mac.value),e.port&&t.port_source!=="manual"&&(t.switch_id=e.port.switch_id,t.port=e.port.port,!t.parent_device_id&&e.port.via_device_id&&e.port.via_device_id!==t.id&&(t.parent_device_id=e.port.via_device_id)),t}const Qe=class extends P{constructor(){super(),this._lastRevision=-1,this._net=null,this._mode="list",this._form=null,this._isNew=!1,this._probe=null,this._probing=!1,this._preview=[],this._proposals=null,this._selVlans=new Set,this._selDevices=new Set,this._busy=!1,this._error=null,this._dirty=!1}connectedCallback(){super.connectedCallback(),De().then(()=>this.requestUpdate())}disconnectedCallback(){window.clearTimeout(this._previewTimer),super.disconnectedCallback()}willUpdate(){this.payload&&this.payload.section_revisions.network!==this._lastRevision&&!this._dirty&&(this._lastRevision=this.payload.section_revisions.network,this._net=xe(this.payload.model.network))}get _lang(){return(this.hass?.locale?.language??"fr").startsWith("fr")?"fr":"en"}get _t(){return U(this._lang)}editDevice(e){const t=this._net?.devices.find(s=>s.id===e);t&&(this._form=xe(t),this._isNew=!1,this._probe=null,this._mode="device",this._schedulePreview())}_newDevice(){this._form=xn(),this._isNew=!0,this._probe=null,this._preview=[],this._mode="device"}_patchForm(e){this._form&&(this._form={...this._form,...e,monitor:{...this._form.monitor,...e.monitor??{}}},this._schedulePreview())}_schedulePreview(){window.clearTimeout(this._previewTimer),this._previewTimer=window.setTimeout(()=>{const e=this._form;!e||!this.hass||Hi(this.hass,{...e,name:e.name||"?"}).then(t=>this._preview=t).catch(()=>this._preview=[])},300)}async _runProbe(){const e=this._form;if(!(!e?.host.trim()||!this.hass)){this._probing=!0;try{const t=await Ui(this.hass,e.host.trim());this._probe=t,this._form=wn(this._form,t),this._schedulePreview()}catch(t){this._error=D(t)==="unauthorized"?this._t("edit.refused"):this._t("edit.failed",{error:M(t)})}finally{this._probing=!1}}}async _persist(e){if(!this.hass||!this.payload)return!1;this._busy=!0,this._error=null;try{return await Ee(this.hass,"network",e,this.payload.section_revisions.network),this._dirty=!1,this._lastRevision=-1,C(this,"him-saved"),!0}catch(t){const s=D(t);return s==="conflict"?C(this,"him-conflict"):s==="unauthorized"?this._error=this._t("edit.refused"):this._error=this._t("edit.failed",{error:M(t)}),!1}finally{this._busy=!1}}async _saveDevice(){const e=this._form,t=this._net;if(!e||!t)return;if(!e.name.trim()){this._error=this._t("ne.required");return}const s=this._isNew?[...t.devices,e]:t.devices.map(o=>o.id===e.id?e:o),n={...t,devices:s};await this._persist(n)&&(this._net=n,this._mode="list",this._form=null)}async _deleteDevice(e){if(!this._net||!window.confirm(this._t("edit.confirm_delete",{name:e.name})))return;const t={...this._net,devices:this._net.devices.filter(s=>s.id!==e.id)};await this._persist(t)&&(this._net=t)}async _openImport(){if(this.hass){this._mode="import",this._proposals=null,this._error=null;try{const e=await qi(this.hass);this._proposals=e,this._selVlans=new Set(e.vlans.map(t=>t.interface)),this._selDevices=new Set(e.devices.filter(t=>!t.exists).map(t=>t.key))}catch(e){this._error=D(e)==="unauthorized"?this._t("edit.refused"):this._t("edit.failed",{error:M(e)})}}}async _applyImport(){if(!(!this.hass||!this.payload)){this._busy=!0;try{await Wi(this.hass,[...this._selVlans],[...this._selDevices],this.payload.section_revisions.network),this._dirty=!1,this._lastRevision=-1,this._mode="list",C(this,"him-saved")}catch(e){D(e)==="conflict"?C(this,"him-conflict"):this._error=this._t("edit.failed",{error:M(e)})}finally{this._busy=!1}}}_toggle(e,t){const s=new Set(e);return s.has(t)?s.delete(t):s.add(t),s}render(){const e=this._t;return this._net?r`
      ${this._error?r`<div class="banner" role="alert">${this._error}</div>`:c}
      ${this._mode==="device"&&this._form?this._renderDeviceForm(this._form):c}
      ${this._mode==="import"?this._renderImport():c}
      ${this._mode==="list"?r`<div class="toolbar">
              <button class="btn pri" @click=${this._newDevice}>${e("ne.add")}</button>
              ${this.payload?.settings.sources.opnsense?r`<button class="btn" @click=${this._openImport}>${e("ne.import_opnsense")}</button>`:c}
            </div>
            ${this._renderTable()} ${this._renderVlans()} ${this._renderUplink()}`:c}
    `:r``}_sensorsSummary(e){const t=this._t,s=[];return e.monitor.ping&&s.push(t("ne.s.short.ping")),e.monitor.latency&&s.push(t("ne.s.short.latency")),e.monitor.tcp_port&&s.push(t("ne.s.short.tcp",{p:e.monitor.tcp_port})),e.monitor.offline_alert_minutes&&s.push(t("ne.s.short.alert")),s.join(", ")||"\u2014"}_renderTable(){const e=this._t,t=this._net,s=o=>t.vlans.find(a=>a.id===o)?.name??"\u2014",n=t.devices.slice().sort((o,a)=>_e(o.host).localeCompare(_e(a.host)));return r`<h3>${e("ne.devices")}</h3>
      <div class="scroll">
        <table class="tbl">
          <thead>
            <tr><th>${e("ne.col.name")}</th><th>${e("ne.col.ip")}</th><th>${e("ne.col.vlan")}</th><th>${e("ne.col.port")}</th><th>${e("ne.col.sensors")}</th><th></th></tr>
          </thead>
          <tbody>
            ${n.map(o=>r`<tr data-device-id=${o.id}>
                <td>${o.name}</td>
                <td class="num">${o.host}</td>
                <td>${s(o.vlan_id)}</td>
                <td>${o.port??"\u2014"}</td>
                <td>${this._sensorsSummary(o)}</td>
                <td style="white-space:nowrap">
                  <button class="btn" @click=${()=>this.editDevice(o.id)}>${e("ne.edit")}</button>
                  <button class="btn danger" aria-label=${`${e("ne.delete")} ${o.name}`} @click=${()=>this._deleteDevice(o)}>✕</button>
                </td>
              </tr>`)}
          </tbody>
        </table>
      </div>`}_renderDeviceForm(e){const t=this._t,s=this._net,n=this.hass,o=this._probe,a=this._probing?r`<span class="hint muted">${t("ne.probing")}</span>`:o?.ping?o.ping.alive?r`<span class="hint ok">${t("ne.answers",{ms:o.ping.rtt_ms??"?"})}</span>`:r`<span class="hint bad">${o.ping.error??t("ne.no_answer")}</span>`:c,l=[{value:"",label:"\u2014"},...s.vlans.map(p=>({value:p.id,label:`${p.name}${p.subnet?` \xB7 ${p.subnet}`:""}`}))],u=o?.port?r`<span class="hint muted">${o.port.via?t("ne.port_via",{port:o.port.port,via:o.port.via}):o.port.port} · ${t("ne.port_detected")}</span>`:void 0,d=this.payload?.settings.ping_interval_s??60;return r`<div class="toolbar">
        <b style="flex:1">${this._isNew?t("ne.add_title"):t("ne.edit_title",{name:e.name})}</b>
        <button class="btn" @click=${()=>{this._mode="list",this._form=null}}>${t("edit.cancel")}</button>
        <button class="btn pri" ?disabled=${this._busy} @click=${this._saveDevice}>${this._isNew?t("ne.create"):t("edit.save")}</button>
      </div>
      <div class="ed wide">
        <div class="form">
          ${v("ne-name",t("ne.f.name"),e.name,p=>this._patchForm({name:p}))}
          <div class="f">
            <label for="ne-host">${t("ne.f.host")}</label>
            <div style="display:flex;gap:6px">
              <input class="inp num" id="ne-host" .value=${e.host}
                @input=${p=>this._patchForm({host:p.target.value})}
                @change=${this._runProbe} />
              <button class="btn" ?disabled=${this._probing||!e.host} @click=${this._runProbe}>${t("ne.probe")}</button>
            </div>
            ${a}
          </div>
          ${x("ne-vlan",t("ne.f.vlan"),e.vlan_id??"",l,p=>this._patchForm({vlan_id:p||null}))}
          ${o?.vlan?r`<span class="hint muted">${o.vlan.name} · ${o.vlan.subnet} · ${t("ne.vlan_detected")}</span>`:c}
          ${v("ne-mac",t("ne.f.mac"),e.mac,p=>this._patchForm({mac:p.trim()||null}),{hint:o?.mac?r`<span class="hint muted">${t("ne.mac_detected",{source:o.mac.source})}</span>`:void 0})}
          <div class="grid2">
            ${x("ne-switch",t("ne.f.switch"),e.switch_id??"",[{value:"",label:"\u2014"},...s.switches.map(p=>({value:p.id,label:p.name}))],p=>this._patchForm({switch_id:p||null}))}
            ${v("ne-port",t("ne.f.port"),e.port,p=>this._patchForm({port:p===""?null:Number(p)}),{type:"number",hint:u})}
          </div>
          <label class="tog"><input type="checkbox" class="inp" .checked=${e.port_source==="manual"}
            @change=${p=>this._patchForm({port_source:p.target.checked?"manual":"auto"})} />${t("ne.f.port_source")}</label>
          ${Be(n,"ne-area",t("ne.f.area"),e.area_id,!1,p=>this._patchForm({area_id:p[0]??null}))}
          <div class="grid2">
            ${x("ne-kind",t("ne.f.kind"),e.kind,vn.map(p=>({value:p,label:t(`kind.${p}`)})),p=>this._patchForm({kind:p}))}
            ${x("ne-parent",t("ne.f.parent"),e.parent_device_id??"",[{value:"",label:"\u2014"},...s.devices.filter(p=>p.id!==e.id).map(p=>({value:p.id,label:p.name}))],p=>this._patchForm({parent_device_id:p||null}))}
          </div>
          ${v("ne-model",t("ne.f.model"),e.model,p=>this._patchForm({model:p||null}))}
          ${v("ne-notes",t("ne.f.notes"),e.notes,p=>this._patchForm({notes:p||null}))}
        </div>
        <div class="form">
          <b>${t("ne.sensors")}</b>
          ${this._toggleRow("ping",t("ne.s.ping"),e.monitor.ping,p=>this._patchForm({monitor:{...e.monitor,ping:p}}))}
          ${this._entityPreview("online")}
          ${this._toggleRow("latency",t("ne.s.latency"),e.monitor.latency,p=>this._patchForm({monitor:{...e.monitor,latency:p}}))}
          ${this._entityPreview("latency")}
          ${this._toggleRow("tcp",t("ne.s.tcp"),!!e.monitor.tcp_port,p=>this._patchForm({monitor:{...e.monitor,tcp_port:p?80:null}}))}
          ${e.monitor.tcp_port!==null?r`${v("ne-tcp",t("ne.s.tcp"),e.monitor.tcp_port,p=>this._patchForm({monitor:{...e.monitor,tcp_port:Number(p)||null}}),{type:"number"})}
                ${this._entityPreview("tcp")}`:c}
          ${this._toggleRow("alert",t("ne.s.alert"),!!e.monitor.offline_alert_minutes,p=>this._patchForm({monitor:{...e.monitor,offline_alert_minutes:p?5:null}}))}
          ${e.monitor.offline_alert_minutes!==null?v("ne-alert",t("ne.s.alert"),e.monitor.offline_alert_minutes,p=>this._patchForm({monitor:{...e.monitor,offline_alert_minutes:Number(p)||null}}),{type:"number"}):c}
          ${this._preview.filter(p=>!["online","latency","tcp"].includes(p.key)).map(p=>r`<div class="ent">${p.entity_id}</div>`)}
          <p class="muted small" style="margin:0">${t("ne.interval",{s:d,name:e.name||"\u2026"})}</p>
          ${e.area_id?r`<span class="muted small">${Oe(n,[e.area_id]).join("")}</span>`:c}
        </div>
      </div>`}_toggleRow(e,t,s,n){return r`<label class="tog" for=${`ne-s-${e}`}>
      <input type="checkbox" class="inp" id=${`ne-s-${e}`} .checked=${s} @change=${o=>n(o.target.checked)} />
      ${t}
    </label>`}_entityPreview(e){const t=this._preview.find(s=>s.key===e);return t?r`<div class="ent" data-preview=${e}>${t.entity_id}</div>`:c}_renderImport(){const e=this._t,t=this._proposals;return r`<div class="toolbar">
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
                  ${t.vlans.map(s=>r`<tr>
                      <td><input type="checkbox" aria-label=${s.name} .checked=${this._selVlans.has(s.interface)} @change=${()=>this._selVlans=this._toggle(this._selVlans,s.interface)} /></td>
                      <td>${s.name}</td><td class="num">${s.subnet}</td><td>${s.tag??"\u2014"}</td>
                      <td>${s.existing_id?r`<span class="badge">${e("ne.exists")}</span>`:c}</td>
                    </tr>`)}
                </tbody>
              </table></div>
              <h3>${e("ne.devices")}</h3>
              <div class="scroll"><table class="tbl">
                <tbody>
                  ${t.devices.map(s=>r`<tr>
                      <td><input type="checkbox" aria-label=${s.name} ?disabled=${s.exists} .checked=${this._selDevices.has(s.key)} @change=${()=>this._selDevices=this._toggle(this._selDevices,s.key)} /></td>
                      <td>${s.name}</td><td class="num">${s.host}</td><td class="num">${s.mac??""}</td>
                      <td>${s.exists?r`<span class="badge">${e("ne.exists")}</span>`:c}</td>
                    </tr>`)}
                </tbody>
              </table></div>`:r`<div class="muted">${e("ne.loading")}</div>`}`}_vlanPatch(e,t){Object.assign(e,t),this._net={...this._net},this._dirty=!0}_renderVlans(){const e=this._t,t=this._net;return r`<h3>${e("ne.vlans")}</h3>
      <div class="scroll">
        <table class="tbl">
          <thead><tr><th>${e("ne.v.color")}</th><th>${e("ne.v.name")}</th><th>${e("ne.v.tag")}</th><th>${e("ne.v.subnet")}</th><th>${e("ne.v.role")}</th><th></th></tr></thead>
          <tbody>
            ${t.vlans.map(s=>r`<tr>
                <td style="width:44px"><input class="inp" type="color" aria-label=${`${e("ne.v.color")} ${s.name}`} .value=${s.color} @input=${n=>this._vlanPatch(s,{color:n.target.value})} /></td>
                <td><input class="inp" aria-label=${e("ne.v.name")} .value=${s.name} @input=${n=>this._vlanPatch(s,{name:n.target.value})} /></td>
                <td style="width:70px"><input class="inp" type="number" aria-label=${e("ne.v.tag")} .value=${s.tag===null?"":String(s.tag)} @input=${n=>{const o=n.target.value;this._vlanPatch(s,{tag:o?Number(o):null})}} /></td>
                <td><input class="inp num" aria-label=${e("ne.v.subnet")} .value=${s.subnet??""} @input=${n=>this._vlanPatch(s,{subnet:n.target.value||null})} /></td>
                <td><input class="inp" aria-label=${e("ne.v.role")} .value=${s.role} @input=${n=>this._vlanPatch(s,{role:n.target.value})} /></td>
                <td><button class="btn danger" aria-label=${`${e("ne.delete")} ${s.name}`} @click=${()=>{window.confirm(e("edit.confirm_delete",{name:s.name}))&&(this._net={...t,vlans:t.vlans.filter(n=>n.id!==s.id)},this._dirty=!0)}}>✕</button></td>
              </tr>`)}
          </tbody>
        </table>
      </div>
      <div class="btns">
        <button class="btn" @click=${()=>{this._net={...t,vlans:[...t.vlans,{id:N(),name:"VLAN",tag:null,subnet:null,color:"#607d8b",role:"",access_summary:"",interface:null}]},this._dirty=!0}}>${e("ne.vlan_add")}</button>
        <button class="btn pri" ?disabled=${!this._dirty||this._busy} @click=${()=>this._persist(this._net)}>${e("ne.save_network")}</button>
      </div>`}_renderUplink(){const e=this._t,t=this._net.uplink,s=n=>{this._net={...this._net,uplink:{...t,...n}},this._dirty=!0};return r`<h3>${e("ne.uplink")}</h3>
      <div class="grid2">
        ${v("ne-isp",e("ne.u.isp"),t.isp,n=>s({isp:n}))}
        ${v("ne-box",e("ne.u.box_name"),t.box_name,n=>s({box_name:n}))}
        ${v("ne-boxip",e("ne.u.box_ip"),t.box_ip,n=>s({box_ip:n||null}))}
        ${v("ne-pub",e("ne.u.public_ip"),t.public_ip,n=>s({public_ip:n||null}))}
      </div>
      <div class="btns"><button class="btn pri" ?disabled=${!this._dirty||this._busy} @click=${()=>this._persist(this._net)}>${e("ne.save_network")}</button></div>`}};Qe.styles=G,Qe.properties={hass:{attribute:!1},payload:{attribute:!1},_net:{state:!0},_mode:{state:!0},_form:{state:!0},_isNew:{state:!0},_probe:{state:!0},_probing:{state:!0},_preview:{state:!0},_proposals:{state:!0},_selVlans:{state:!0},_selDevices:{state:!0},_busy:{state:!0},_error:{state:!0},_dirty:{state:!0}};let yn=Qe;function kn(i){return i?i>=1e3?`${i/1e3} Gbit/s`:`${i} Mbit/s`:""}function An(i,e,t){const s=["p"];return e&&s.push("sfp"),i?.up&&s.push("up"),i?.poe&&s.push("poe"),t&&s.push("sel"),s.join(" ")}function di(i,e,t,s){const n=t[String(e)],o=i.sfp_ports.includes(e),a=i.port_labels[String(e)]||n?.alias||"",l=n?.up?s.t("net.link_up"):n?.up===!1?s.t("net.link_down"):"";return r`<button
    class=${An(n,o,s.selectedPort===e)}
    data-port=${e}
    aria-label=${[s.t("net.port_detail",{n:e}),a,l,n?.poe?s.t("net.poe"):""].filter(Boolean).join(", ")}
    aria-pressed=${s.selectedPort===e?"true":"false"}
    title=${a}
    @click=${()=>s.onSelectPort(s.selectedPort===e?null:e)}
  >
    ${e}
  </button>`}function Cn(i){const{t:e,payload:t}=i,s=t.model.network.switches;if(!s.length)return r`<div class="empty">${e("net.no_switch")}</div>`;const n=s.find($=>$.id===i.switchId)??s[0],o=t.live.switches[n.id],a=o?.ports??{},l=Array.from({length:n.ports_count},($,g)=>g+1),u=l.filter($=>!n.sfp_ports.includes($)),d=l.filter($=>n.sfp_ports.includes($)),p=i.selectedPort,m=p!==null?a[String(p)]:void 0,b=p!==null?ls(t.model.network.devices,n,p,m?.macs??[]):[],f=$=>t.model.network.vlans.find(g=>g.tag===$)?.name;return r`
    ${s.length>1?r`<div class="seg" role="tablist">
          ${s.map($=>r`<button role="tab" aria-selected=${$.id===n.id?"true":"false"} @click=${()=>i.onSelectSwitch($.id)}>${$.name}</button>`)}
        </div>`:c}
    <div class="muted small">${n.name}${n.host?` \xB7 ${n.host}`:""}${o?.sys_name?` \xB7 ${o.sys_name}`:""}</div>
    ${o&&!o.available?r`<div class="banner info">${e("net.switch_unavailable")}</div>`:c}
    <div class="sw" role="group" aria-label=${n.name}>
      <div class="sw-copper">${u.map($=>di(n,$,a,i))}</div>
      ${d.length?r`<div class="sw-sfp">${d.map($=>di(n,$,a,i))}</div>`:c}
    </div>
    ${p!==null?r`<dl class="detail" aria-live="polite">
          <dt>${e("net.port_detail",{n:p})}</dt>
          <dd>
            ${[n.port_labels[String(p)]||m?.alias||m?.name||"",m?.up===!0?kn(m.speed_mbps)||e("net.link_up"):m?.up===!1?e("net.link_down"):"",m?.poe?e("net.poe"):""].filter(Boolean).join(" \xB7 ")||"\u2014"}
          </dd>
          ${m?r`<dt>VLAN</dt>
                <dd>
                  ${e("net.vlans_line",{pvid:m.pvid!==null?`${m.pvid}${f(m.pvid)?` (${f(m.pvid)})`:""}`:"\u2014",tagged:m.tagged_vlans.length?m.tagged_vlans.join(", "):"\u2014"})}
                </dd>`:c}
          ${m?.lldp?.sys_name?r`<dt>${e("net.lldp")}</dt><dd>${m.lldp.sys_name}${m.lldp.port_id?` (${m.lldp.port_id})`:""}</dd>`:c}
          <dt>${e("net.seen")}</dt>
          <dd>
            ${b.length?b.map($=>r`<button class="ent" @click=${()=>i.onOpenDevice($.id)}>${$.name}</button><br />`):"\u2014"}
            ${m?.macs?.length?r`<span class="muted small">${e("net.macs",{n:m.macs.length})}</span>`:c}
          </dd>
        </dl>`:c}
  `}function re(i,e,t,s,n){const o=[Mt(i,t,s,n)];for(const a of os(e,i.id))o.push(...re(a,e,t,s+1,""));return o}function Sn(i){const{t:e,payload:t}=i,s=t.model.network,n=s.devices;if(!n.length&&!s.switches.length)return r`<div class="empty">${e("net.no_devices")}</div>`;const o=s.uplink,a=n.filter(b=>b.kind==="router"),l=b=>n.find(f=>f.kind==="switch"&&b&&f.host===b),u=new Set,d=s.switches.map(b=>{const f=l(b.host);f&&u.add(f.id);const $=ns(n,b.id).map(g=>({...g,devices:g.devices.filter(h=>h.kind!=="router"&&h.id!==f?.id)})).filter(g=>g.devices.length>0);return r`<div class="portgrp">
      ${f?Mt(f,i,3):r`<div class="tn" style="margin-left:calc(var(--him-indent) * 3)"><span class="dot off"></span><span class="name">${b.name}</span>
            <span class="ip num">${b.host??""}</span></div>`}
      ${$.flatMap(g=>{g.devices.forEach(y=>u.add(y.id));const h=e("net.port",{n:g.port});if(g.devices.length===1)return re(g.devices[0],n,i,4,h);const _=b.port_labels[String(g.port)];return[r`<div class="tn port-head" style="margin-left:calc(var(--him-indent) * 4)">
            <span class="name"><b>${h}</b>${_?r`<span class="muted"> · ${_}</span>`:c}</span>
            <span class="ip muted small">${e("net.devices_n",{n:g.devices.length})}</span>
          </div>`,...g.devices.flatMap(y=>re(y,n,i,5,""))]})}
    </div>`});for(const b of a)u.add(b.id);const p=as(n,s.switches).filter(b=>!u.has(b.id)&&b.kind!=="router"),m=t.live.opnsense.gateways;return r`<div class="topo">
    <div class="tn">
      <span class=${m.length?m.some(b=>b.online)?"dot":"dot bad":"dot off"}></span>
      <span class="name"><b>${e("net.internet")}</b> ${o.isp}</span>
      <span class="ip num">${o.public_ip??""}</span>
    </div>
    ${o.box_name||o.box_ip?r`<div class="tn" style="margin-left:var(--him-indent)"><span class="dot off"></span><span class="name">${o.box_name}</span>
          <span class="ip num">${o.box_ip??""}</span></div>`:c}
    ${a.flatMap(b=>re(b,n,i,2,""))}
    ${d}
    ${p.length?r`<h3>${e("net.unplaced")}</h3>
          ${p.flatMap(b=>re(b,n,i,1,""))}`:c}
  </div>`}function ci(i,e){return i.slice().sort((t,s)=>_e(t.host).localeCompare(_e(s.host))).map(t=>r`<button class="row" data-device-id=${t.id} @click=${()=>e.onOpenDevice(t.id)}>
        ${It(t,e)}<span>${t.name}</span><span class="muted num" style="margin-left:auto">${t.host}</span>
      </button>`)}function In(i){const{t:e,payload:t}=i,s=t.model.network,n=s.devices.filter(o=>!o.vlan_id);return!s.vlans.length&&!s.devices.length?r`<div class="empty">${e("net.no_devices")}</div>`:r`<div class="vgrid">
    ${s.vlans.map(o=>{const a=s.devices.filter(l=>l.vlan_id===o.id);return r`<section class="vc" style=${`--vc:${o.color}`} aria-label=${o.name} data-vlan-id=${o.id}>
        <b>${o.name} · ${o.tag?e("net.vlan_tag",{tag:o.tag}):e("net.untagged")}</b>
        <span class="num">${o.subnet??""}</span>
        ${o.role?r`<span class="muted small">${o.role}</span>`:c}
        ${o.access_summary?r`<span class="muted small">${o.access_summary}</span>`:c}
        <span class="muted small">${e("net.devices_n",{n:a.length})}</span>
        ${ci(a,i)}
      </section>`})}
    ${n.length?r`<section class="vc"><b>${e("net.no_vlan")}</b>${ci(n,i)}</section>`:c}
  </div>`}const Y="home-infra-map-card",ui="home-infra-map-card-editor";let Mn=0;function pi(i,e=new Date){const t=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;return`home-infra-map-${i}-${t}.yaml`}function hi(i,e){const t=URL.createObjectURL(new Blob([e],{type:"text/yaml;charset=utf-8"})),s=document.createElement("a");s.href=t,s.download=i,document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(t),1e3)}const Ye=class extends P{constructor(){super(),this._instance=++Mn,this._unsub=null,this._subscribing=!1,this._retries=0,this._firstRender=!0,this._viewFromConfig=!1,this._historyFor=null,this._view="electricity",this._networkView="topology",this._boardId=null,this._moduleId=null,this._history=null,this._showWarnings=new Set,this._boxId=null,this._editBoxes=!1,this._conduitId=null,this._deviceId=null,this._sheetTab="info",this._switchId=null,this._port=null,this._edit=!1,this._editKey=0,this._dialog=null}static getConfigElement(){return document.createElement(ui)}static getStubConfig(){return{type:`custom:${Y}`,view:"electricity"}}setConfig(e){if(!e||typeof e!="object")throw R("error","card","#%d setConfig rejected: %o",this._instance,e),new Error("Invalid configuration");this._config=e,this._viewFromConfig=!!e.view,(e.view==="electricity"||e.view==="network")&&(this._view=e.view),e.network_view&&["topology","vlan","switch"].includes(e.network_view)&&(this._networkView=e.network_view),e.board&&(this._boardId=e.board),R("info","card","#%d setConfig accepted at t=%dms",this._instance,Math.round(performance.now()))}getCardSize(){return cs()}getGridOptions(){return ds()}connectedCallback(){super.connectedCallback(),this._retries=0,this.hass&&!this._unsub&&this._load()}disconnectedCallback(){super.disconnectedCallback(),window.clearTimeout(this._retryTimer),this._retryTimer=void 0,this._unsub?.(),this._unsub=null}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&!this._subscribing&&this.isConnected&&this._retryTimer===void 0&&this._load()}get _lang(){return je(this.hass)}get _t(){return U(this._lang)}async _load(){if(!(!this.hass||this._subscribing)){this._subscribing=!0;try{const e=await Ne(this.hass);this._applyPayload(e),this._error=void 0;const t=await Li(this.hass,s=>this._onEvent(s));if(!this.isConnected){t();return}this._unsub=()=>{t()}}catch(e){const t=D(e);this._error=t==="not_configured"?this._t("card.not_configured"):this._t("card.error",{error:M(e)}),R("warn","card","#%d load failed (%s)",this._instance,t),t!=="not_configured"&&this._retries<10&&(this._retries+=1,this._retryTimer=window.setTimeout(()=>{this._retryTimer=void 0,this._load()},Math.min(2e3*this._retries,15e3)))}finally{this._subscribing=!1}}}_applyPayload(e){this._payload=e,!this._viewFromConfig&&e.settings.default_view&&(this._view=e.settings.default_view),this._viewFromConfig=!0,(!this._boardId||!e.model.boards.some(t=>t.id===this._boardId))&&(this._boardId=e.model.boards[0]?.id??null)}_onEvent(e){if(e.kind==="model"){const{kind:t,...s}=e;this._applyPayload(s)}else e.kind==="live"&&this._payload&&(this._payload={...this._payload,live:e.live})}updated(){this.getAttribute("lang")!==this._lang&&this.setAttribute("lang",this._lang),this._firstRender&&this._payload&&(this._firstRender=!1,R("info","card","#%d first render with data at t=%dms (v%s)",this._instance,Math.round(performance.now()),Ct)),this.dispatchEvent(new CustomEvent("home-infra-map-card-update",{bubbles:!0,composed:!0}))}get _board(){return this._payload?.model.boards.find(e=>e.id===this._boardId)??null}get _stacked(){return(this._config?.boards_layout??(this._config?.board?"tabs":"stacked"))==="stacked"}_selectModule(e){if(this._moduleId=e,this._history=null,e&&this._stacked){const s=this._payload?.model.boards.find(n=>[...n.supply??[],...n.rows.flatMap(o=>o.modules)].some(o=>o.id===e));s&&(this._boardId=s.id)}const t=(e?this._board?.rows.flatMap(s=>s.modules).find(s=>s.id===e):void 0)?.power_entity_id;!t||!this.hass||(this._historyFor=t,ft(this.hass,[t]).then(s=>{this._historyFor===t&&(this._history=wt(s[t]))}).catch(()=>this._history=[]))}async _openPhoto(){const e=this._board;if(!(!e?.photo_path||!this.hass)){this._dialog={kind:"photo",text:e.name,busy:!0};try{const t=await Qi(this.hass,e.id,e.photo_path.split("?v=")[1]??"");this._dialog={kind:"photo",text:e.name,url:t}}catch(t){this._dialog=null,H(this,this._t("card.error",{error:M(t)}))}}}async _tool(e){if(this.hass){if(e==="import"){this._dialog={kind:e,text:""};return}this._dialog={kind:e,text:"",busy:!0};try{const t=e==="export"?await Gi(this.hass):await Ji(this.hass);this._dialog={kind:e,text:t.yaml}}catch(t){this._dialog={kind:e,text:this._t("card.error",{error:M(t)})}}}}async _readImportFile(e){const t=e.target,s=t.files?.[0];if(t.value="",!(!s||!this._dialog)){if(s.size>2*1024*1024){H(this,this._t("tools.file_too_large"));return}this._dialog={...this._dialog,text:await s.text()}}}async _runImport(){if(!(!this.hass||!this._dialog)){this._dialog={...this._dialog,busy:!0};try{const e=await Ki(this.hass,this._dialog.text);H(this,this._t("tools.import_done",e)),this._dialog=null,this._editKey+=1}catch(e){const t=D(e)==="unauthorized"?this._t("edit.refused"):this._t("card.error",{error:M(e)});this._dialog={...this._dialog,busy:!1},H(this,t)}}}async _onConflict(){if(H(this,this._t("edit.conflict")),this.hass)try{this._applyPayload(await Ne(this.hass))}catch{}this._editKey+=1}render(){const e=this._t;if(!this._payload)return r`<ha-card>
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
          ></home-infra-map-device-sheet>`:c}
      ${this._dialog?this._renderDialog():c}
    </ha-card>`}_renderHeader(e){const t=this._t,s=this._board;let n=this._config?.title;if(!n){const o=this._stacked&&(this._payload?.model.boards.length??0)>1;this._view!=="electricity"?n=t("view.network"):o||!s?n=t("view.electricity"):n=[s.name,s.location].filter(Boolean).join(" \xB7 ")}return this._edit&&(n=t("edit.title",{name:this._view==="electricity"?s?.name??t("view.electricity"):t("view.network")})),r`<div class="head">
      <span class="title">${n}</span>
      <div class="head-actions">
        ${this._edit?r`<button class="btn" @click=${()=>this._tool("export")}>${t("tools.export")}</button>
              <button class="btn" @click=${()=>this._tool("import")}>${t("tools.import")}</button>
              <button class="btn" @click=${()=>this._tool("dashboard")}>${t("tools.dashboard")}</button>`:c}
        <div class="seg" role="tablist" aria-label=${t("card.name")}>
          ${["electricity","network"].map(o=>r`<button role="tab" aria-selected=${this._view===o?"true":"false"} @click=${()=>{this._view=o,this._moduleId=null}}>${t(`view.${o}`)}</button>`)}
        </div>
        ${e?r`<button
              class="icon-btn"
              aria-label=${this._edit?t("edit.close"):t("edit.open")}
              aria-pressed=${this._edit?"true":"false"}
              title=${this._edit?t("edit.close"):t("edit.open")}
              @click=${()=>{this._edit=!this._edit,this._editKey+=1}}
            >
              ${customElements.get("ha-icon")?r`<ha-icon icon=${this._edit?"mdi:close":"mdi:pencil"}></ha-icon>`:this._edit?"\u2715":"\u270E"}
            </button>`:c}
      </div>
    </div>`}_renderElectricity(){return Qs({hass:this.hass,payload:this._payload,t:this._t,lang:this._lang,board:this._board,stacked:this._stacked,selectedBoxId:this._boxId,selectedConduitId:this._conduitId,onSelectBox:(e,t=null)=>{this._boxId=e,this._conduitId=e?t:null},selectedModuleId:this._moduleId,showWarnings:this._showWarnings,history:this._history,historyRange:[Date.now()-24*3600*1e3,Date.now()],onSelectBoard:e=>{this._boardId=e,this._moduleId=null},onSelectModule:e=>this._selectModule(e),onToggleWarnings:e=>{const t=new Set(this._showWarnings);t.delete(e)||t.add(e),this._showWarnings=t},onOpenPhoto:e=>{this._boardId=e,this._openPhoto()},onMoreInfo:e=>$t(this,e)})}_renderNetwork(){const e=this._t,t=this._payload,s={hass:this.hass,payload:t,t:e,lang:this._lang,onOpenDevice:o=>{this._deviceId=o,this._sheetTab="info"}},n=rs(t,this.hass);return r`
      <div class="toolbar">
        <div class="seg" role="tablist" aria-label=${e("view.network")}>
          ${["topology","vlan","switch"].map(o=>r`<button role="tab" aria-selected=${this._networkView===o?"true":"false"} @click=${()=>this._networkView=o}>
              ${e(`nview.${o}`)}
            </button>`)}
        </div>
      </div>
      <div class="chips">
        <span class="chip"><span class="dot"></span>${e("net.online",{n:n.online})}</span>
        ${n.offline?r`<span class="chip"><span class="dot bad"></span>${e("net.offline",{n:n.offline})}</span>`:c}
        ${t.live.opnsense.gateways.map(o=>r`<span class="chip"><span class=${o.online?"dot":"dot bad"}></span>${e("net.gateway",{name:o.name,delay:o.delay??""})}</span>`)}
      </div>
      ${t.live.ping_available?c:r`<div class="banner info">${e("net.ping_unavailable")}</div>`}
      ${this._networkView==="topology"?Sn(s):c}
      ${this._networkView==="vlan"?In(s):c}
      ${this._networkView==="switch"?Cn({...s,switchId:this._switchId,selectedPort:this._port,onSelectSwitch:o=>{this._switchId=o,this._port=null},onSelectPort:o=>this._port=o}):c}
    `}_renderEdit(){const e=()=>H(this,this._t("edit.saved"));return me(`${this._view}-${this._editKey}`,this._view==="electricity"?r`<div class="seg" role="tablist" aria-label=${this._t("view.electricity")} style="margin-bottom:8px">
              ${[!1,!0].map(t=>r`<button
                  role="tab"
                  aria-selected=${this._editBoxes===t?"true":"false"}
                  @click=${()=>this._editBoxes=t}
                >
                  ${this._t(t?"be.tab.boxes":"be.tab.boards")}
                </button>`)}
            </div>
            ${this._editBoxes?r`<home-infra-map-boxes-editor
                  .hass=${this.hass}
                  .payload=${this._payload}
                  @him-saved=${()=>{e(),this._edit=!1}}
                  @him-cancel=${()=>this._edit=!1}
                  @him-conflict=${this._onConflict}
                ></home-infra-map-boxes-editor>`:r`<home-infra-map-electricity-editor
            .hass=${this.hass}
            .payload=${this._payload}
            .boardId=${this._boardId}
            @him-saved=${t=>{e(),t.detail?.boardId&&(this._boardId=t.detail.boardId),this._edit=!1}}
            @him-cancel=${()=>this._edit=!1}
            @him-conflict=${this._onConflict}
          ></home-infra-map-electricity-editor>`}`:r`<home-infra-map-network-editor
            .hass=${this.hass}
            .payload=${this._payload}
            @him-saved=${e}
            @him-conflict=${this._onConflict}
          ></home-infra-map-network-editor>`)}_renderDialog(){const e=this._t,t=this._dialog,s=()=>this._dialog=null,n=t.kind==="export"?e("tools.export"):t.kind==="import"?e("tools.import"):t.kind==="dashboard"?e("tools.dashboard"):t.text;return r`<div
      class="overlay"
      @click=${o=>o.target===o.currentTarget&&s()}
      @keydown=${o=>o.key==="Escape"&&s()}
    >
      <div class="sheet" role="dialog" aria-modal="true" aria-label=${n}>
        <div class="head">
          <span class="title">${n}</span>
          <button class="icon-btn" aria-label=${e("tools.close")} @click=${s}>✕</button>
        </div>
        ${t.kind==="photo"?t.url?r`<img class="photo-full" src=${t.url} alt=${e("el.photo")} />`:r`<div class="body muted">${e("card.loading")}</div>`:r`<div class="body">
              ${t.kind==="import"?r`<p class="muted small" style="margin:0">${e("tools.import_hint")}</p>
                    <label class="btn" style="display:inline-flex;align-items:center;width:max-content">
                      ${e("tools.choose_file")}
                      <input type="file" accept=".yaml,.yml,text/yaml,application/x-yaml,text/plain" style="display:none"
                        @change=${o=>this._readImportFile(o)} />
                    </label>
                    <textarea class="inp" rows="14" aria-label=${e("tools.import")} .value=${t.text}
                      @input=${o=>this._dialog={...t,text:o.target.value}}></textarea>
                    <div class="btns">
                      <button class="btn pri" ?disabled=${t.busy||!t.text.trim()} @click=${this._runImport}>${e("tools.import_run")}</button>
                    </div>`:t.busy?r`<div class="muted">${e("card.loading")}</div>`:r`${t.kind==="dashboard"?r`<p class="muted small" style="margin:0">${e("tools.dashboard_hint")}</p>`:c}
                      <pre class="yaml">${t.text}</pre>
                      <div class="btns">
                        <button class="btn pri" @click=${async()=>H(this,await es(t.text)?e("tools.copied"):e("card.error",{error:"clipboard"}))}>
                          ${e("tools.copy")}
                        </button>
                        <button class="btn" @click=${()=>hi(pi(t.kind==="dashboard"?"dashboard":"export"),t.text)}>
                          ${e("tools.download")}
                        </button>
                      </div>`}
            </div>`}
      </div>
    </div>`}};Ye.styles=G,Ye.properties={hass:{attribute:!1},_config:{state:!0},_payload:{state:!0},_error:{state:!0},_view:{state:!0},_networkView:{state:!0},_boardId:{state:!0},_moduleId:{state:!0},_history:{state:!0},_showWarnings:{state:!0},_boxId:{state:!0},_editBoxes:{state:!0},_conduitId:{state:!0},_deviceId:{state:!0},_sheetTab:{state:!0},_switchId:{state:!0},_port:{state:!0},_edit:{state:!0},_editKey:{state:!0},_dialog:{state:!0}};let mi=Ye;Q("home-infra-map-device-sheet",gs),Q("home-infra-map-electricity-editor",cn),Q("home-infra-map-boxes-editor",gn),Q("home-infra-map-network-editor",yn),Q(ui,ss),Q(Y,mi),R("info","card","v%s registered at t=%dms",Ct,Math.round(performance.now())),bs(Y),window.customCards=window.customCards??[],window.customCards.some(i=>i.type===Y)||window.customCards.push({type:Y,name:"Home Infra Map",description:U(je(void 0))("card.description"),preview:!1,documentationURL:"https://github.com/Eric-D/ha-home-infra-map"});export{Y as CARD_TAG,mi as HomeInfraMapCard,hi as downloadText,pi as yamlFilename};
